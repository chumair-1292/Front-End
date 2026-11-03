

import "dotenv/config";

import express from "express";
import cors from "cors";
import multer from "multer";
import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY,
});

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
}));
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(file.mimetype)) {
      return callback(new Error("Only JPG, PNG and WEBP images are allowed."));
    }

    callback(null, true);
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "MotionAI API is running" });
});

app.post("/api/generate", upload.single("image"), async (req, res) => {
  try {
    const prompt = String(req.body.prompt || "").trim();
    const mode = req.body.mode;
    const duration = Number(req.body.duration || 5);
    const aspectRatio = req.body.aspectRatio || "16:9";
    const resolution = req.body.resolution || "720p";

    if (!process.env.FAL_KEY) {
      return res.status(500).json({ error: "FAL_KEY is missing in backend .env" });
    }

    if (!prompt) {
      return res.status(400).json({ error: "Please enter a prompt." });
    }

    if (prompt.length > 4000) {
      return res.status(400).json({ error: "Prompt is too long." });
    }

    if (![5, 10, 15].includes(duration)) {
      return res.status(400).json({ error: "Invalid video duration." });
    }

    let model;
    let input;

    if (mode === "image") {
      if (!req.file) {
        return res.status(400).json({ error: "Please upload an image." });
      }

      const imageBlob = new Blob(
        [req.file.buffer],
        { type: req.file.mimetype }
      );

      const imageUrl = await fal.storage.upload(imageBlob);

      model = "fal-ai/wan/v2.7/image-to-video";

      input = {
        prompt,
        image_url: imageUrl,
        duration: String(duration),
        resolution
      };
    } else {
      model = "fal-ai/wan/v2.7/text-to-video";

      input = {
        prompt,
        duration: String(duration),
        aspect_ratio: aspectRatio,
        resolution,
        enable_prompt_expansion: true,
        enable_safety_checker: true
      };
    }

    const result = await fal.subscribe(model, {
      input,
      logs: false
    });

    const videoUrl = result?.data?.video?.url;

    if (!videoUrl) {
      throw new Error("The API did not return a video URL.");
    }

    res.json({
      videoUrl,
      requestId: result.requestId
    });

  } catch (error) {
    console.error("Video generation error:", error);

    res.status(500).json({
      error: error.message || "Video generation failed."
    });
  }
});

app.use((error, _req, res, _next) => {
  res.status(400).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`MotionAI backend running at http://localhost:${PORT}`);
});
