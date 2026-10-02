document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const textInput = document.getElementById('textInput');
  const voiceSelect = document.getElementById('voiceSelect');
  const listenBtn = document.getElementById('listenBtn');
  const btnIcon = document.getElementById('btnIcon');
  const btnText = document.getElementById('btnText');

  // Speech Synthesis API instance
  const synth = window.speechSynthesis;
  let voices = [];

  // Function to Load Available System Voices & Languages
  const populateVoices = () => {
    voices = synth.getVoices();

    if (voices.length === 0) return;

    voiceSelect.innerHTML = '';

    voices.forEach((voice, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `${voice.name} (${voice.lang})`;
      
      // Default to Google US English or English if available
      if (voice.name.includes('Google US English') || voice.lang === 'en-US') {
        option.selected = true;
      }
      
      voiceSelect.appendChild(option);
    });
  };

  // Populate voices immediately and on voiceschanged event (for Chrome/Safari)
  populateVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
  }

  // Function to Speak or Pause/Resume
  const handleSpeech = () => {
    const text = textInput.value.trim();

    if (!text) {
      alert('Please write something in the text box first!');
      return;
    }

    // If already speaking, toggle pause/resume or stop
    if (synth.speaking) {
      if (synth.paused) {
        synth.resume();
        btnIcon.className = 'fa-solid fa-pause';
        btnText.textContent = 'Pause';
      } else {
        synth.pause();
        btnIcon.className = 'fa-solid fa-play';
        btnText.textContent = 'Resume';
      }
      return;
    }

    // Create Speech Utterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Set selected voice
    const selectedVoiceIndex = voiceSelect.value;
    if (voices[selectedVoiceIndex]) {
      utterance.voice = voices[selectedVoiceIndex];
    }

    // Speech Events
    utterance.onstart = () => {
      btnIcon.className = 'fa-solid fa-pause';
      btnText.textContent = 'Pause';
    };

    utterance.onend = () => {
      btnIcon.className = 'fa-solid fa-play';
      btnText.textContent = 'Listen';
    };

    utterance.onerror = () => {
      btnIcon.className = 'fa-solid fa-play';
      btnText.textContent = 'Listen';
    };

    // Speak text
    synth.speak(utterance);
  };

  // Event Listeners
  listenBtn.addEventListener('click', handleSpeech);

  // Reset speech when user changes the voice
  voiceSelect.addEventListener('change', () => {
    if (synth.speaking) {
      synth.cancel();
      btnIcon.className = 'fa-solid fa-play';
      btnText.textContent = 'Listen';
    }
  });
});