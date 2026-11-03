
import { useRef, useState } from "react";
import {
  Aperture, Sparkles, Video, Image as ImageIcon,
  Upload, Download, FolderOpen, Plus, Menu,
  LoaderCircle, X
} from "lucide-react";
import "./App.css";

const API_URL = "http://localhost:5000";

const examples = [
  "A cinematic drone shot over a futuristic city at sunset",
  "A tiny astronaut walking on a glowing alien planet",
  "A luxury perfume bottle with dramatic studio lighting"
];

export default function App() {
  const [mode, setMode] = useState("text");
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [duration, setDuration] = useState("5");
  const [ratio, setRatio] = useState("16:9");
  const [resolution, setResolution] = useState("720p");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState("Create");
  const [menuOpen, setMenuOpen] = useState(false);

  const fileRef = useRef(null);

  function handleImage(event) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setImage(selectedFile);
    setError("");
  }

  async function generateVideo(event) {
    event.preventDefault();
    setError("");
    setVideoUrl("");

    if (!prompt.trim()) {
      setError("Please write a video prompt.");
      return;
    }

    if (mode === "image" && !image) {
      setError("Please upload an image first.");
      return;
    }

    const formData = new FormData();

    formData.append("prompt", prompt);
    formData.append("mode", mode);
    formData.append("duration", duration);
    formData.append("aspectRatio", ratio);
    formData.append("resolution", resolution);

    if (mode === "image") {
      formData.append("image", image);
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed.");
      }

      setVideoUrl(data.videoUrl);

      setProjects(current => [
        {
          id: Date.now(),
          prompt,
          videoUrl: data.videoUrl,
          mode
        },
        ...current
      ]);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">

      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><Aperture /></div>
          <span>Motion<span className="purple">AI</span></span>
          <button className="close-menu" onClick={() => setMenuOpen(false)}>
            <X />
          </button>
        </div>

        <p className="side-label">WORKSPACE</p>

        <button
          className={page === "Create" ? "nav active" : "nav"}
          onClick={() => {
            setPage("Create");
            setMenuOpen(false);
          }}
        >
          <Plus size={18} /> Create video
        </button>

        <button
          className={page === "Projects" ? "nav active" : "nav"}
          onClick={() => {
            setPage("Projects");
            setMenuOpen(false);
          }}
        >
          <FolderOpen size={18} /> My projects
          <span className="count">{projects.length}</span>
        </button>

        <div className="sidebar-footer">
          <Sparkles size={20} />
          <strong>Bring ideas to life</strong>
          <p>Create videos using artificial intelligence.</p>
          <small>Made By Umair</small>
        </div>
      </aside>

      {menuOpen && (
        <button
          className="overlay"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        />
      )}

      <main className="main">

        <header className="topbar">
          <button className="menu-button" onClick={() => setMenuOpen(true)}>
            <Menu />
          </button>
          <span>Workspace / {page}</span>
          <small><i /> AI VIDEO STUDIO</small>
        </header>

        {page === "Create" ? (
          <div className="content">

            <section className="intro">
              <span className="eyebrow">
                <Sparkles size={14} /> YOUR CREATIVE SPACE
              </span>
              <h1>Turn imagination<br /> into <span>motion.</span></h1>
              <p>Create videos from text prompts or bring images to life.</p>
            </section>

            <div className="workspace">

              <section className="panel">
                <div className="panel-title">
                  <h2>Create your video</h2>
                  <small>POWERED BY FAL.AI</small>
                </div>

                <div className="mode-switch">
                  <button
                    className={mode === "text" ? "selected" : ""}
                    onClick={() => setMode("text")}
                  >
                    <Video size={16} /> Text to video
                  </button>

                  <button
                    className={mode === "image" ? "selected" : ""}
                    onClick={() => setMode("image")}
                  >
                    <ImageIcon size={16} /> Image to video
                  </button>
                </div>

                <form onSubmit={generateVideo}>
                  <label>Describe your video</label>

                  <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Describe the video you want to create..."
                    maxLength={4000}
                  />

                  <div className="text-info">
                    <span>Describe camera movement, lighting and mood.</span>
                    <span>{prompt.length}/4000</span>
                  </div>

                  {mode === "image" && (
                    <div className="upload-area">
                      <label>Starting image</label>

                      <button
                        type="button"
                        className="upload-box"
                        onClick={() => fileRef.current?.click()}
                      >
                        <Upload />
                        <strong>
                          {image ? image.name : "Choose an image"}
                        </strong>
                        <span>JPG, PNG or WEBP · Max 20 MB</span>
                      </button>

                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        hidden
                        onChange={handleImage}
                      />

                      {image && (
                        <button
                          type="button"
                          className="remove-image"
                          onClick={() => setImage(null)}
                        >
                          Remove image
                        </button>
                      )}
                    </div>
                  )}

                  <div className="settings">
                    <div>
                      <label>Duration</label>
                      <select
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                      >
                        <option value="5">5 seconds</option>
                        <option value="10">10 seconds</option>
                        <option value="15">15 seconds</option>
                      </select>
                    </div>

                    <div>
                      <label>Aspect ratio</label>
                      <select
                        value={ratio}
                        onChange={e => setRatio(e.target.value)}
                      >
                        <option>16:9</option>
                        <option>9:16</option>
                        <option>1:1</option>
                        <option>4:3</option>
                        <option>3:4</option>
                      </select>
                    </div>

                    <div>
                      <label>Quality</label>
                      <select
                        value={resolution}
                        onChange={e => setResolution(e.target.value)}
                      >
                        <option value="720p">720p</option>
                        <option value="1080p">1080p</option>
                      </select>
                    </div>
                  </div>

                  {error && <p className="error">{error}</p>}

                  <button className="generate" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="spin" />
                        Generating video...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Generate video →
                      </>
                    )}
                  </button>

                  <p className="note">
                    Video generation may take a few minutes.
                    API usage may incur charges.
                  </p>
                </form>
              </section>

              <section className="panel">
                <div className="panel-title">
                  <h2>Video preview</h2>
                  {videoUrl && <small className="ready">READY</small>}
                </div>

                <div className="preview">
                  {videoUrl ? (
                    <video src={videoUrl} controls playsInline />
                  ) : loading ? (
                    <div className="empty">
                      <LoaderCircle className="spin large" />
                      <strong>Creating your video...</strong>
                      <p>Please wait while AI generates your video.</p>
                    </div>
                  ) : (
                    <div className="empty">
                      <div className="empty-icon"><Video /></div>
                      <strong>Your preview will appear here</strong>
                      <p>Write a prompt and generate your first video.</p>
                    </div>
                  )}
                </div>

                {videoUrl && (
                  <a
                    className="download"
                    href={videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                  >
                    <Download size={17} /> Open / download video
                  </a>
                )}
              </section>
            </div>

            <section className="examples">
              <h3>Need an idea?</h3>
              <p>Try one of these prompts.</p>

              <div className="example-grid">
                {examples.map(item => (
                  <button key={item} onClick={() => setPrompt(item)}>
                    {item} <span>↗</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="content">
            <section className="intro">
              <h1>My <span>projects.</span></h1>
              <p>Your videos created during this session.</p>
            </section>

            {projects.length === 0 ? (
              <div className="empty-projects">
                <FolderOpen size={32} />
                <h2>No projects yet</h2>
                <p>Your generated videos will appear here.</p>
              </div>
            ) : (
              <div className="project-grid">
                {projects.map(project => (
                  <button
                    className="project-card"
                    key={project.id}
                    onClick={() => {
                      setVideoUrl(project.videoUrl);
                      setPrompt(project.prompt);
                      setPage("Create");
                    }}
                  >
                    <video src={project.videoUrl} muted />
                    <strong>{project.prompt}</strong>
                    <small>
                      {project.mode === "image" ? "Image to video" : "Text to video"}
                    </small>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
