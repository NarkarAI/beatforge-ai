// ============================================================
// BeatForge AI — Application Controller
// UI logic, event handling, and visualization
// ============================================================

(function() {
  'use strict';

  const engine = new AudioEngine();
  let isInitialized = false;
  let animFrameId = null;
  let currentGenre = 'hip-hop';
  let currentVocal = 'singing';

  // ---- DOM Elements ----
  const $ = (sel) => document.querySelector(sel);
  const genreGrid = $('#genreGrid');
  const lyricsInput = $('#lyricsInput');
  const bpmSlider = $('#bpmSlider');
  const bpmValue = $('#bpmValue');
  const keySelect = $('#keySelect');
  const moodSelect = $('#moodSelect');
  const durationSelect = $('#durationSelect');
  const vocalPitch = $('#vocalPitch');
  const vocalPitchValue = $('#vocalPitchValue');
  const reverbAmount = $('#reverbAmount');
  const reverbValue = $('#reverbValue');
  const generateBtn = $('#generateBtn');
  const playBtn = $('#playBtn');
  const stopBtn = $('#stopBtn');
  const downloadBtn = $('#downloadBtn');
  const progressContainer = $('#progressContainer');
  const progressFill = $('#progressFill');
  const progressText = $('#progressText');
  const playbackInfo = $('#playbackInfo');
  const currentTimeEl = $('#currentTime');
  const totalTimeEl = $('#totalTime');
  const playbackProgress = $('#playbackProgress');
  const canvas = $('#visualizer');
  const canvasCtx = canvas.getContext('2d');
  const lyricsDisplay = $('#lyricsDisplay');

  // ---- Initialize Genre Grid ----
  function initGenres() {
    Object.entries(GENRES).forEach(([id, genre]) => {
      const btn = document.createElement('button');
      btn.className = `genre-btn${id === currentGenre ? ' active' : ''}`;
      btn.dataset.genre = id;
      btn.innerHTML = `<span class="genre-emoji">${genre.emoji}</span>${genre.name}`;
      btn.addEventListener('click', () => selectGenre(id));
      genreGrid.appendChild(btn);
    });
  }

  function selectGenre(id) {
    currentGenre = id;
    const genre = GENRES[id];

    // Update BPM to genre default
    bpmSlider.value = genre.bpm;
    bpmValue.textContent = genre.bpm;

    // Update active state
    document.querySelectorAll('.genre-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.genre-btn[data-genre="${id}"]`).classList.add('active');
  }

  // ---- Vocal Style Selection ----
  function initVocalButtons() {
    document.querySelectorAll('.vocal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.vocal-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentVocal = btn.dataset.vocal;
      });
    });
  }

  // ---- Slider Updates ----
  function initSliders() {
    bpmSlider.addEventListener('input', () => {
      bpmValue.textContent = bpmSlider.value;
    });

    vocalPitch.addEventListener('input', () => {
      const v = parseInt(vocalPitch.value);
      vocalPitchValue.textContent = (v > 0 ? '+' : '') + v;
    });

    reverbAmount.addEventListener('input', () => {
      reverbValue.textContent = reverbAmount.value + '%';
    });
  }

  // ---- Canvas Visualizer ----
  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = 180 * window.devicePixelRatio;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = '180px';
    canvasCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  function drawIdle() {
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    canvasCtx.clearRect(0, 0, w, h);

    // Draw a subtle static waveform
    const gradient = canvasCtx.createLinearGradient(0, 0, w, 0);
    gradient.addColorStop(0, 'rgba(0, 240, 255, 0.1)');
    gradient.addColorStop(0.5, 'rgba(176, 0, 255, 0.15)');
    gradient.addColorStop(1, 'rgba(0, 240, 255, 0.1)');

    canvasCtx.beginPath();
    canvasCtx.moveTo(0, h / 2);
    for (let x = 0; x < w; x++) {
      const y = h / 2 + Math.sin(x * 0.02 + Date.now() * 0.001) * 5;
      canvasCtx.lineTo(x, y);
    }
    canvasCtx.strokeStyle = gradient;
    canvasCtx.lineWidth = 2;
    canvasCtx.stroke();
  }

  function drawVisualizer() {
    if (!engine.isPlaying) {
      drawIdle();
      animFrameId = requestAnimationFrame(drawVisualizer);
      return;
    }

    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    canvasCtx.clearRect(0, 0, w, h);

    // Use analyser data if playing through live context
    // Otherwise draw from buffer
    const data = engine.getAnalyserData();
    const barCount = 64;
    const barWidth = w / barCount;
    const maxBarHeight = h * 0.85;

    for (let i = 0; i < barCount; i++) {
      const dataIdx = Math.floor(i * (data ? data.length : 128) / barCount);
      let value;
      if (data && data[dataIdx] !== undefined) {
        value = data[dataIdx] / 255;
      } else {
        value = 0.1 + Math.random() * 0.3;
      }

      const barH = value * maxBarHeight;
      const x = i * barWidth;
      const y = h - barH;

      // Gradient per bar
      const hue = 180 + (i / barCount) * 100;
      const saturation = 80 + value * 20;
      const lightness = 40 + value * 30;

      canvasCtx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${0.6 + value * 0.4})`;
      canvasCtx.fillRect(x + 1, y, barWidth - 2, barH);

      // Glow effect on top
      canvasCtx.fillStyle = `hsla(${hue}, 100%, 70%, ${value * 0.5})`;
      canvasCtx.fillRect(x + 1, y, barWidth - 2, 2);
    }

    // Update playback time
    updatePlaybackTime();

    animFrameId = requestAnimationFrame(drawVisualizer);
  }

  function drawGeneratingAnimation(progress) {
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    canvasCtx.clearRect(0, 0, w, h);

    const time = Date.now() * 0.003;
    const barCount = 48;
    const barWidth = w / barCount;

    for (let i = 0; i < barCount; i++) {
      const phase = (i / barCount) * Math.PI * 4 + time;
      const value = (Math.sin(phase) * 0.3 + 0.3) * (progress / 100);
      const barH = value * h * 0.7;
      const x = i * barWidth;
      const y = (h - barH) / 2;

      const hue = 180 + (i / barCount) * 100;
      canvasCtx.fillStyle = `hsla(${hue}, 80%, 50%, 0.6)`;
      canvasCtx.fillRect(x + 1, y, barWidth - 2, barH);
    }
  }

  // ---- Playback Time ----
  function updatePlaybackTime() {
    const current = engine.getCurrentTime();
    const total = engine.getDuration();
    currentTimeEl.textContent = formatTime(current);
    totalTimeEl.textContent = formatTime(total);
    if (total > 0) {
      playbackProgress.style.width = ((current / total) * 100) + '%';
    }
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + s.toString().padStart(2, '0');
  }

  // ---- Lyrics Display ----
  function showLyrics(text) {
    if (!text) {
      lyricsDisplay.classList.remove('visible');
      return;
    }
    lyricsDisplay.textContent = text;
    lyricsDisplay.classList.add('visible');
  }

  // ---- Toast Notifications ----
  function showToast(message, type = '') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ---- Button State ----
  function setButtonStates(state) {
    switch (state) {
      case 'idle':
        generateBtn.disabled = false;
        generateBtn.classList.remove('generating');
        playBtn.disabled = true;
        stopBtn.disabled = true;
        downloadBtn.disabled = true;
        break;
      case 'generating':
        generateBtn.disabled = true;
        generateBtn.classList.add('generating');
        playBtn.disabled = true;
        stopBtn.disabled = true;
        downloadBtn.disabled = true;
        break;
      case 'ready':
        generateBtn.disabled = false;
        generateBtn.classList.remove('generating');
        playBtn.disabled = false;
        stopBtn.disabled = true;
        downloadBtn.disabled = false;
        break;
      case 'playing':
        generateBtn.disabled = true;
        playBtn.disabled = true;
        stopBtn.disabled = false;
        downloadBtn.disabled = false;
        break;
    }
  }

  // ---- Generate Handler ----
  async function handleGenerate() {
    if (!isInitialized) {
      engine.init();
      isInitialized = true;
    }

    if (engine.isPlaying) engine.stop();

    setButtonStates('generating');
    progressContainer.classList.add('visible');
    playbackInfo.classList.remove('visible');

    let genProgress = 0;
    engine.onProgress = (pct, msg) => {
      genProgress = pct;
      progressFill.style.width = pct + '%';
      progressText.textContent = msg;
      drawGeneratingAnimation(pct);
    };

    // Animate progress during generation
    const animateProgress = () => {
      if (engine.isGenerating) {
        drawGeneratingAnimation(genProgress);
        requestAnimationFrame(animateProgress);
      }
    };
    requestAnimationFrame(animateProgress);

    try {
      await engine.generate({
        genre: currentGenre,
        bpm: parseInt(bpmSlider.value),
        key: parseInt(keySelect.value),
        mood: moodSelect.value,
        vocalStyle: currentVocal,
        vocalPitch: parseInt(vocalPitch.value),
        reverb: parseInt(reverbAmount.value) / 100,
        duration: parseInt(durationSelect.value),
        lyrics: lyricsInput.value
      });

      setButtonStates('ready');
      playbackInfo.classList.add('visible');
      updatePlaybackTime();
      showToast('Track generated successfully!', 'success');

      // Show lyrics if provided
      if (lyricsInput.value.trim()) {
        showLyrics(lyricsInput.value.trim().split('\n')[0] + '...');
      }

    } catch (err) {
      console.error('Generation error:', err);
      showToast('Error generating track. Please try again.', 'error');
      setButtonStates('idle');
    }

    setTimeout(() => {
      progressContainer.classList.remove('visible');
    }, 1500);
  }

  // ---- Play/Stop Handlers ----
  function handlePlay() {
    if (!isInitialized) return;
    engine.play();
    setButtonStates('playing');
    drawVisualizer();
    if (currentVocal === 'speech') {
      speakLyrics(lyricsInput.value);
    }
  }

  engine.onPlaybackEnd = () => {
    stopSpeech();
    setButtonStates('ready');
    playbackProgress.style.width = '0%';
    currentTimeEl.textContent = '0:00';
  };

  function handleStop() {
    engine.stop();
    stopSpeech();
    setButtonStates('ready');
    playbackProgress.style.width = '0%';
    currentTimeEl.textContent = '0:00';
  }

  // ---- Download Handler ----
  function handleDownload() {
    if (!engine.generatedBuffer) return;

    showToast('Preparing MP3 download...', '');

    // Try MP3 first, fallback to WAV
    const blob = engine.exportToWav();
    if (!blob) {
      showToast('Export failed', 'error');
      return;
    }

    const ext = blob.type === 'audio/mp3' ? 'mp3' : 'wav';
    const genreName = GENRES[currentGenre]?.name || 'Track';
    const filename = `BeatForge_${genreName.replace(/\s+/g, '_')}_${parseInt(bpmSlider.value)}bpm.${ext}`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Downloaded ${filename}`, 'success');
  }

  // ---- Speech Synthesis (synced to playback) ----
  function speakLyrics(text) {
    if (!('speechSynthesis' in window) || !text || !text.trim()) return;
    if (currentVocal === 'instrumental') return;

    window.speechSynthesis.cancel();

    const lines = text.trim().split('\n').filter(l => l.trim());
    const bpm = parseInt(bpmSlider.value);
    const secPerBeat = 60 / bpm;
    // Start vocals after 2-bar intro (8 beats)
    let delay = secPerBeat * 8;

    lines.forEach((line) => {
      const utterance = new SpeechSynthesisUtterance(line.trim());
      const pitchShift = parseInt(vocalPitch.value) / 24;

      switch (currentVocal) {
        case 'rap':
          utterance.rate = 1.4;
          utterance.pitch = 0.8 + pitchShift;
          break;
        case 'speech':
          utterance.rate = 1.0;
          utterance.pitch = 1.0 + pitchShift;
          break;
        case 'singing':
        default:
          utterance.rate = 0.7;
          utterance.pitch = 1.3 + pitchShift;
          break;
      }

      setTimeout(() => {
        if (engine.isPlaying) {
          window.speechSynthesis.speak(utterance);
        }
      }, delay * 1000);

      // Estimate line duration and advance delay
      const wordsInLine = line.trim().split(/\s+/).length;
      const lineDuration = (wordsInLine / utterance.rate) * 0.35;
      delay += Math.max(lineDuration, secPerBeat * 2);
    });
  }

  function stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // ---- Event Listeners ----
  function initEvents() {
    generateBtn.addEventListener('click', handleGenerate);
    playBtn.addEventListener('click', handlePlay);
    stopBtn.addEventListener('click', handleStop);
    downloadBtn.addEventListener('click', handleDownload);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (engine.isPlaying) handleStop();
        else if (engine.generatedBuffer) handlePlay();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      resizeCanvas();
      if (!engine.isPlaying) drawIdle();
    });
  }

  // ---- Initialize ----
  function init() {
    initGenres();
    initVocalButtons();
    initSliders();
    initEvents();
    resizeCanvas();
    setButtonStates('idle');
    drawIdle();

    // Idle animation loop
    function idleLoop() {
      if (!engine.isPlaying && !engine.isGenerating) {
        drawIdle();
      }
      requestAnimationFrame(idleLoop);
    }
    idleLoop();
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
