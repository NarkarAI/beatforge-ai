// ============================================================
// BeatForge AI — Audio Engine
// Web Audio API music synthesis, sequencing, and export
// ============================================================

const GENRES = {
  'hip-hop': {
    name: 'Hip Hop', emoji: '🎤', bpm: 90,
    kick:  [1,0,0,0, 0,0,0,0, 1,0,1,0, 0,0,0,0],
    snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    clap:  [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    bass:  [1,0,0,1, 0,0,0,0, 1,0,0,0, 0,0,1,0],
    padStyle: 'warm', bassType: 'sub', swing: 0.05
  },
  'trap': {
    name: 'Trap', emoji: '🔥', bpm: 140,
    kick:  [1,0,0,0, 0,0,1,0, 0,0,1,0, 0,0,0,0],
    snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hihat: [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
    clap:  [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1],
    bass:  [1,0,0,0, 0,0,1,0, 0,0,1,0, 0,0,0,0],
    padStyle: 'dark', bassType: '808', swing: 0.0
  },
  'house': {
    name: 'House', emoji: '🏠', bpm: 128,
    kick:  [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
    snare: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    hihat: [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
    clap:  [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    bass:  [1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,1,0],
    padStyle: 'bright', bassType: 'synth', swing: 0.0
  },
  'edm': {
    name: 'EDM', emoji: '⚡', bpm: 128,
    kick:  [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
    snare: [0,0,0,0, 1,0,0,1, 0,0,0,0, 1,0,0,1],
    hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    clap:  [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    bass:  [1,0,1,0, 0,0,1,0, 1,0,1,0, 0,0,1,0],
    padStyle: 'supersaw', bassType: 'wobble', swing: 0.0
  },
  'pop': {
    name: 'Pop', emoji: '🌟', bpm: 120,
    kick:  [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
    snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    clap:  [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    bass:  [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,1,0],
    padStyle: 'warm', bassType: 'synth', swing: 0.0
  },
  'rnb': {
    name: 'R&B', emoji: '💜', bpm: 85,
    kick:  [1,0,0,1, 0,0,0,0, 1,0,0,0, 0,0,1,0],
    snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hihat: [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
    clap:  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    bass:  [1,0,0,1, 0,0,0,0, 1,0,0,0, 0,0,1,0],
    padStyle: 'warm', bassType: 'sub', swing: 0.08
  },
  'lofi': {
    name: 'Lo-Fi', emoji: '🌙', bpm: 80,
    kick:  [1,0,0,0, 0,0,1,0, 0,0,1,0, 0,0,0,0],
    snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1],
    hihat: [1,0,1,0, 1,0,1,0, 1,0,1,1, 1,0,1,0],
    clap:  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    bass:  [1,0,0,0, 0,0,1,0, 0,0,1,0, 0,0,0,0],
    padStyle: 'lofi', bassType: 'sub', swing: 0.1
  },
  'dnb': {
    name: 'Drum & Bass', emoji: '🥁', bpm: 174,
    kick:  [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
    snare: [0,0,0,0, 1,0,0,1, 0,0,0,0, 1,0,0,0],
    hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    clap:  [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    bass:  [1,0,0,0, 0,0,0,1, 0,0,1,0, 0,0,0,1],
    padStyle: 'dark', bassType: 'reese', swing: 0.0
  },
  'reggaeton': {
    name: 'Reggaeton', emoji: '🎶', bpm: 95,
    kick:  [1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,1,0],
    snare: [0,0,0,1, 0,0,1,0, 0,0,0,1, 0,0,1,0],
    hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    clap:  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    bass:  [1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,1,0],
    padStyle: 'bright', bassType: 'synth', swing: 0.0
  },
  'techno': {
    name: 'Techno', emoji: '🤖', bpm: 135,
    kick:  [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
    snare: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    clap:  [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    bass:  [1,0,1,0, 0,0,1,0, 1,0,1,0, 0,0,1,0],
    padStyle: 'dark', bassType: 'acid', swing: 0.0
  }
};

// Chord progressions by mood: [semitone offsets from root]
const CHORD_PROGRESSIONS = {
  energetic: [
    [0, 4, 7],      // I (major)
    [5, 9, 12],     // IV
    [7, 11, 14],    // V
    [7, 11, 14]     // V
  ],
  happy: [
    [0, 4, 7],      // I
    [7, 11, 14],    // V
    [9, 12, 16],    // vi
    [5, 9, 12]      // IV
  ],
  chill: [
    [0, 4, 7, 11],  // Imaj7
    [9, 12, 16, 19],// vi7
    [2, 5, 9, 12],  // ii7
    [7, 11, 14, 17] // V7
  ],
  dark: [
    [0, 3, 7],      // i (minor)
    [8, 12, 15],    // VI
    [5, 8, 12],     // iv
    [7, 10, 14]     // v
  ],
  melancholic: [
    [0, 3, 7],      // i
    [5, 9, 12],     // IV
    [0, 4, 7],      // I
    [7, 11, 14]     // V
  ]
};

// Note frequencies for key of C
const NOTE_C3 = 130.81;
const NOTE_C4 = 261.63;

// Vowel formant frequencies for vocal synthesis
const FORMANTS = {
  a: { f1: 800, f2: 1150, f3: 2800, gain: [1, 0.5, 0.3] },
  e: { f1: 400, f2: 1600, f3: 2700, gain: [1, 0.4, 0.2] },
  i: { f1: 350, f2: 2300, f3: 3000, gain: [1, 0.3, 0.2] },
  o: { f1: 450, f2: 800,  f3: 2830, gain: [1, 0.3, 0.2] },
  u: { f1: 325, f2: 700,  f3: 2530, gain: [1, 0.2, 0.1] }
};

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.offlineCtx = null;
    this.masterGain = null;
    this.compressor = null;
    this.analyser = null;
    this.convolver = null;
    this.reverbGain = null;
    this.dryGain = null;
    this.isPlaying = false;
    this.isGenerating = false;
    this.generatedBuffer = null;
    this.playbackSource = null;
    this.playbackStartTime = 0;
    this.playbackOffset = 0;
    this.noiseBuffer = null;
    this.genre = null;
    this.bpm = 120;
    this.keyOffset = 0;
    this.mood = 'energetic';
    this.vocalStyle = 'singing';
    this.vocalPitch = 0;
    this.reverbAmount = 0.3;
    this.duration = 30;
    this.lyrics = '';
    this.onProgress = null;
    this.onComplete = null;
    this.animationFrame = null;
  }

  init() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this._setupChain(this.ctx);
    this._createNoiseBuffer();
    this._createImpulseResponse();
  }

  _setupChain(ctx, destination) {
    const dest = destination || ctx.destination;
    this.compressor = ctx.createDynamicsCompressor();
    this.compressor.threshold.value = -12;
    this.compressor.knee.value = 10;
    this.compressor.ratio.value = 4;

    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = 0.8;

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 2048;

    // Reverb send
    this.convolver = ctx.createConvolver();
    this.reverbGain = ctx.createGain();
    this.reverbGain.gain.value = this.reverbAmount;
    this.dryGain = ctx.createGain();
    this.dryGain.gain.value = 1;

    this.masterGain.connect(this.dryGain);
    this.masterGain.connect(this.convolver);
    this.convolver.connect(this.reverbGain);
    this.dryGain.connect(this.compressor);
    this.reverbGain.connect(this.compressor);
    this.compressor.connect(this.analyser);
    this.analyser.connect(dest);
  }

  _createNoiseBuffer() {
    const length = this.ctx.sampleRate * 2;
    this.noiseBuffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }

  _createImpulseResponse() {
    const rate = this.ctx.sampleRate;
    const length = rate * 2;
    const impulse = this.ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
      }
    }
    this.convolver.buffer = impulse;
  }

  _freq(semitones) {
    return NOTE_C3 * Math.pow(2, (semitones + this.keyOffset) / 12);
  }

  _freqHigh(semitones) {
    return NOTE_C4 * Math.pow(2, (semitones + this.keyOffset) / 12);
  }

  // ---- Instrument Synthesis ----

  _playKick(ctx, dest, time, genre) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const is808 = genre.bassType === '808';
    const startFreq = is808 ? 200 : 150;
    const endDur = is808 ? 0.6 : 0.4;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(30, time + endDur);

    gain.gain.setValueAtTime(0.9, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + endDur);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + endDur + 0.01);
  }

  _playSnare(ctx, dest, time) {
    // Noise part
    const noiseSource = ctx.createBufferSource();
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
    const noiseData = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) noiseData[i] = Math.random() * 2 - 1;
    noiseSource.buffer = noiseBuf;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1500;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(dest);
    noiseSource.start(time);
    noiseSource.stop(time + 0.21);

    // Tone part
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.1);
    oscGain.gain.setValueAtTime(0.5, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    osc.connect(oscGain);
    oscGain.connect(dest);
    osc.start(time);
    osc.stop(time + 0.11);
  }

  _playHihat(ctx, dest, time, open) {
    const dur = open ? 0.2 : 0.04;
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    const source = ctx.createBufferSource();
    source.buffer = noiseBuf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7000;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    source.start(time);
    source.stop(time + dur + 0.01);
  }

  _playClap(ctx, dest, time) {
    for (let i = 0; i < 3; i++) {
      const t = time + i * 0.01;
      const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let j = 0; j < data.length; j++) data[j] = Math.random() * 2 - 1;

      const source = ctx.createBufferSource();
      source.buffer = noiseBuf;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2000;
      filter.Q.value = 1;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(dest);
      source.start(t);
      source.stop(t + 0.16);
    }
  }

  _playBass(ctx, dest, time, freq, duration, genre) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    switch (genre.bassType) {
      case '808':
        osc.type = 'sine';
        filter.frequency.value = 200;
        break;
      case 'sub':
        osc.type = 'sine';
        filter.frequency.value = 300;
        break;
      case 'acid':
        osc.type = 'sawtooth';
        filter.frequency.setValueAtTime(800, time);
        filter.frequency.exponentialRampToValueAtTime(200, time + duration * 0.6);
        filter.Q.value = 12;
        break;
      case 'reese':
        osc.type = 'sawtooth';
        filter.frequency.value = 600;
        filter.Q.value = 2;
        break;
      case 'wobble':
        osc.type = 'sawtooth';
        filter.frequency.value = 400;
        filter.Q.value = 8;
        // LFO for wobble
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 4;
        lfoGain.gain.value = 300;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start(time);
        lfo.stop(time + duration);
        break;
      default:
        osc.type = 'sawtooth';
        filter.frequency.value = 500;
    }

    filter.type = 'lowpass';
    osc.frequency.setValueAtTime(freq / 2, time);

    gain.gain.setValueAtTime(0.45, time);
    if (duration > 0.1) {
      gain.gain.setValueAtTime(0.45, time + duration - 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    }

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + duration + 0.01);

    // Add sub layer for fullness
    if (genre.bassType !== 'sub' && genre.bassType !== '808') {
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(freq / 2, time);
      subGain.gain.setValueAtTime(0.25, time);
      subGain.gain.exponentialRampToValueAtTime(0.001, time + duration);
      sub.connect(subGain);
      subGain.connect(dest);
      sub.start(time);
      sub.stop(time + duration + 0.01);
    }
  }

  _playPad(ctx, dest, time, chordFreqs, duration, genre) {
    const numOsc = genre.padStyle === 'supersaw' ? 5 : 2;
    const detune = genre.padStyle === 'supersaw' ? 15 : 5;
    const attackTime = genre.padStyle === 'lofi' ? 0.5 : 0.3;

    chordFreqs.forEach(freq => {
      for (let i = 0; i < numOsc; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = genre.padStyle === 'dark' ? 'square' : 'sawtooth';
        const cents = (i - (numOsc - 1) / 2) * detune;
        osc.frequency.setValueAtTime(freq, time);
        osc.detune.setValueAtTime(cents, time);

        filter.type = 'lowpass';
        filter.frequency.value = genre.padStyle === 'lofi' ? 1500 :
                                  genre.padStyle === 'dark' ? 2000 : 4000;
        filter.Q.value = 0.5;

        const vol = 0.06 / numOsc;
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(vol, time + attackTime);
        gain.gain.setValueAtTime(vol, time + duration - 0.4);
        gain.gain.linearRampToValueAtTime(0, time + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);
        osc.start(time);
        osc.stop(time + duration + 0.01);
      }
    });
  }

  _playMelody(ctx, dest, time, freq, duration) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    // Vibrato
    const vib = ctx.createOscillator();
    const vibGain = ctx.createGain();
    vib.frequency.value = 5;
    vibGain.gain.value = 3;
    vib.connect(vibGain);
    vibGain.connect(osc.frequency);
    vib.start(time);
    vib.stop(time + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3000, time);
    filter.frequency.exponentialRampToValueAtTime(800, time + duration);
    filter.Q.value = 2;

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.12, time + 0.03);
    gain.gain.setValueAtTime(0.12, time + duration - 0.05);
    gain.gain.linearRampToValueAtTime(0, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + duration + 0.01);
  }

  // ---- Vocal Synthesis (Formant) ----

  _playVocalNote(ctx, dest, time, freq, duration, vowel) {
    const formant = FORMANTS[vowel] || FORMANTS['a'];
    const source = ctx.createOscillator();
    source.type = 'sawtooth';
    source.frequency.setValueAtTime(freq, time);

    // Vibrato
    const vib = ctx.createOscillator();
    const vibGain = ctx.createGain();
    vib.frequency.value = 5.5;
    vibGain.gain.value = 4;
    vib.connect(vibGain);
    vibGain.connect(source.frequency);
    vib.start(time);
    vib.stop(time + duration);

    const merger = ctx.createGain();
    merger.gain.value = 1;

    [formant.f1, formant.f2, formant.f3].forEach((fFreq, idx) => {
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = fFreq;
      bp.Q.value = 12;

      const fGain = ctx.createGain();
      fGain.gain.value = formant.gain[idx] * 0.15;

      source.connect(bp);
      bp.connect(fGain);
      fGain.connect(merger);
    });

    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(1, time + 0.04);
    envelope.gain.setValueAtTime(1, time + duration - 0.06);
    envelope.gain.linearRampToValueAtTime(0, time + duration);

    merger.connect(envelope);
    envelope.connect(dest);
    source.start(time);
    source.stop(time + duration + 0.01);
  }

  // ---- Song Generation ----

  _parseLyrics(text) {
    if (!text || !text.trim()) return [];
    const words = text.trim().split(/\s+/);
    const vowelMap = { a: 'a', e: 'e', i: 'i', o: 'o', u: 'u' };
    return words.map(word => {
      const lower = word.toLowerCase().replace(/[^a-z]/g, '');
      let vowel = 'a';
      for (const ch of lower) {
        if (vowelMap[ch]) { vowel = ch; break; }
      }
      return { word, vowel };
    });
  }

  _generateMelodyPattern(numSteps, mood) {
    const scales = {
      energetic: [0, 2, 4, 5, 7, 9, 11, 12],
      happy:     [0, 2, 4, 5, 7, 9, 11, 12],
      chill:     [0, 2, 4, 7, 9, 12],
      dark:      [0, 2, 3, 5, 7, 8, 10, 12],
      melancholic: [0, 2, 3, 5, 7, 8, 10, 12]
    };
    const scale = scales[mood] || scales.energetic;
    const pattern = [];
    let prevIdx = Math.floor(scale.length / 2);

    for (let i = 0; i < numSteps; i++) {
      if (Math.random() < 0.4) {
        pattern.push(-1); // rest
      } else {
        const step = Math.floor(Math.random() * 3) - 1;
        prevIdx = Math.max(0, Math.min(scale.length - 1, prevIdx + step));
        pattern.push(scale[prevIdx]);
      }
    }
    return pattern;
  }

  async generate(params) {
    this.isGenerating = true;
    this.genre = GENRES[params.genre] || GENRES['pop'];
    this.bpm = params.bpm || this.genre.bpm;
    this.keyOffset = params.key || 0;
    this.mood = params.mood || 'energetic';
    this.vocalStyle = params.vocalStyle || 'singing';
    this.vocalPitch = params.vocalPitch || 0;
    this.reverbAmount = params.reverb || 0.3;
    this.duration = params.duration || 30;
    this.lyrics = params.lyrics || '';

    const sampleRate = 44100;
    const totalSamples = sampleRate * this.duration;
    const offCtx = new OfflineAudioContext(2, totalSamples, sampleRate);

    // Setup chain on offline context
    const comp = offCtx.createDynamicsCompressor();
    comp.threshold.value = -12;
    comp.ratio.value = 4;

    const master = offCtx.createGain();
    master.gain.value = 0.75;

    // Reverb
    const convolver = offCtx.createConvolver();
    const irLen = sampleRate * 2;
    const irBuf = offCtx.createBuffer(2, irLen, sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = irBuf.getChannelData(ch);
      for (let i = 0; i < irLen; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / irLen, 2.5);
      }
    }
    convolver.buffer = irBuf;

    const revGain = offCtx.createGain();
    revGain.gain.value = this.reverbAmount;
    const dryGain = offCtx.createGain();
    dryGain.gain.value = 1;

    master.connect(dryGain);
    master.connect(convolver);
    convolver.connect(revGain);
    dryGain.connect(comp);
    revGain.connect(comp);
    comp.connect(offCtx.destination);

    // Calculate timing
    const stepsPerBeat = 4;
    const stepDuration = 60 / this.bpm / stepsPerBeat;
    const totalSteps = Math.floor(this.duration / stepDuration);
    const stepsPerBar = 16;
    const beatsPerBar = 4;

    const genre = this.genre;
    const chords = CHORD_PROGRESSIONS[this.mood] || CHORD_PROGRESSIONS.energetic;

    // Parse lyrics
    const words = this._parseLyrics(this.lyrics);
    const melodyPattern = this._generateMelodyPattern(totalSteps, this.mood);

    // Schedule all notes
    let wordIdx = 0;

    if (this.onProgress) this.onProgress(10, 'Composing drums...');

    for (let step = 0; step < totalSteps; step++) {
      const patIdx = step % 16;
      const barNum = Math.floor(step / stepsPerBar);
      const chordIdx = barNum % chords.length;
      const chord = chords[chordIdx];
      const time = step * stepDuration;

      // Apply swing
      const swingOffset = (patIdx % 2 === 1) ? stepDuration * genre.swing : 0;
      const t = time + swingOffset;

      // Song structure: intro(2 bars), verse, chorus, verse, chorus, outro(2 bars)
      const totalBars = Math.floor(totalSteps / stepsPerBar);
      const isIntro = barNum < 2;
      const isOutro = barNum >= totalBars - 2;
      const sectionLength = Math.max(1, Math.floor((totalBars - 4) / 4));
      const innerBar = barNum - 2;
      const isChorus = !isIntro && !isOutro &&
        (innerBar >= sectionLength && innerBar < sectionLength * 2) ||
        (innerBar >= sectionLength * 3);

      // Drums
      if (genre.kick[patIdx] && !isOutro) {
        this._playKick(offCtx, master, t, genre);
      }
      if (genre.snare[patIdx] && !isIntro) {
        this._playSnare(offCtx, master, t);
      }
      if (genre.hihat[patIdx]) {
        const vel = isIntro ? 0.5 : 1;
        const hh = offCtx.createGain();
        hh.gain.value = vel;
        hh.connect(master);
        this._playHihat(offCtx, hh, t, false);
      }
      if (genre.clap[patIdx] && !isIntro) {
        this._playClap(offCtx, master, t);
      }

      // Bass
      if (genre.bass[patIdx]) {
        const bassNote = chord[0];
        const bassFreq = this._freq(bassNote);
        const bassDur = stepDuration * 1.5;
        this._playBass(offCtx, master, t, bassFreq, bassDur, genre);
      }

      // Pad (play on beat 1 of each bar)
      if (patIdx === 0) {
        const padFreqs = chord.map(n => this._freqHigh(n));
        const padDur = stepDuration * stepsPerBar;
        const padGain = offCtx.createGain();
        padGain.gain.value = isChorus ? 1.2 : 0.8;
        padGain.connect(master);
        this._playPad(offCtx, padGain, t, padFreqs, padDur, genre);
      }

      // Melody (sparse, only on some beats during chorus)
      if (isChorus && melodyPattern[step % melodyPattern.length] >= 0 && Math.random() < 0.3) {
        const melNote = melodyPattern[step % melodyPattern.length];
        const melFreq = this._freqHigh(melNote + 12);
        const melDur = stepDuration * (1 + Math.floor(Math.random() * 3));
        this._playMelody(offCtx, master, t, melFreq, Math.min(melDur, stepDuration * 4));
      }

      // Vocals
      if (this.vocalStyle !== 'instrumental' && words.length > 0) {
        const isVocalStep = this.vocalStyle === 'rap'
          ? (patIdx % 2 === 0 && Math.random() < 0.7)
          : (patIdx % 4 === 0);

        if (isVocalStep && !isIntro && !isOutro && wordIdx < words.length * 3) {
          const w = words[wordIdx % words.length];
          const vocalSemitone = chord[0] + 12 + this.vocalPitch;
          const vocalFreq = this._freq(vocalSemitone);
          const vocalDur = this.vocalStyle === 'rap'
            ? stepDuration * 0.8
            : stepDuration * (2 + Math.random() * 2);

          const vocalGain = offCtx.createGain();
          vocalGain.gain.value = 0.7;
          vocalGain.connect(master);

          this._playVocalNote(offCtx, vocalGain, t, vocalFreq,
            Math.min(vocalDur, stepDuration * 4), w.vowel);
          wordIdx++;
        }
      }

      // Progress updates
      if (step % Math.floor(totalSteps / 5) === 0 && this.onProgress) {
        const pct = 10 + Math.floor((step / totalSteps) * 70);
        const phase = step < totalSteps * 0.3 ? 'Composing drums...' :
                      step < totalSteps * 0.6 ? 'Layering instruments...' :
                      'Synthesizing vocals...';
        this.onProgress(pct, phase);
      }
    }

    if (this.onProgress) this.onProgress(85, 'Rendering audio...');

    // Render
    this.generatedBuffer = await offCtx.startRendering();

    if (this.onProgress) this.onProgress(100, 'Done!');

    this.isGenerating = false;
    return this.generatedBuffer;
  }

  // ---- Playback ----

  play() {
    if (!this.generatedBuffer || this.isPlaying) return;

    if (this.ctx.state === 'suspended') this.ctx.resume();

    this.playbackSource = this.ctx.createBufferSource();
    this.playbackSource.buffer = this.generatedBuffer;
    this.playbackSource.connect(this.ctx.destination);
    this.playbackSource.start(0, this.playbackOffset);
    this.playbackStartTime = this.ctx.currentTime - this.playbackOffset;
    this.isPlaying = true;

    this.playbackSource.onended = () => {
      if (this.isPlaying) {
        this.isPlaying = false;
        this.playbackOffset = 0;
        if (this.onPlaybackEnd) this.onPlaybackEnd();
      }
    };
  }

  stop() {
    if (!this.isPlaying || !this.playbackSource) return;
    this.isPlaying = false;
    this.playbackSource.onended = null;
    this.playbackSource.stop();
    this.playbackOffset = 0;
    if (this.onPlaybackEnd) this.onPlaybackEnd();
  }

  pause() {
    if (!this.isPlaying || !this.playbackSource) return;
    this.isPlaying = false;
    this.playbackOffset = this.ctx.currentTime - this.playbackStartTime;
    this.playbackSource.onended = null;
    this.playbackSource.stop();
  }

  getCurrentTime() {
    if (!this.isPlaying) return this.playbackOffset;
    return this.ctx.currentTime - this.playbackStartTime;
  }

  getDuration() {
    if (!this.generatedBuffer) return 0;
    return this.generatedBuffer.duration;
  }

  getAnalyserData() {
    if (!this.analyser) return null;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  // ---- Export ----

  exportToWav() {
    if (!this.generatedBuffer) return null;
    const buffer = this.generatedBuffer;
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const length = buffer.length;
    const bytesPerSample = 2; // 16-bit
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = length * blockAlign;
    const headerSize = 44;
    const totalSize = headerSize + dataSize;

    const arrayBuffer = new ArrayBuffer(totalSize);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeStr = (offset, str) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeStr(0, 'RIFF');
    view.setUint32(4, totalSize - 8, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bytesPerSample * 8, true);
    writeStr(36, 'data');
    view.setUint32(40, dataSize, true);

    // Interleave and write samples
    const channels = [];
    for (let ch = 0; ch < numChannels; ch++) {
      channels.push(buffer.getChannelData(ch));
    }

    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        let sample = channels[ch][i];
        sample = Math.max(-1, Math.min(1, sample));
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(offset, intSample, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  exportToMp3() {
    // MP3 encoding using lamejs if available, otherwise fallback to WAV
    if (typeof lamejs !== 'undefined') {
      return this._encodeMp3();
    }
    // Fallback: export WAV but name it .mp3 equivalent
    return this.exportToWav();
  }

  _encodeMp3() {
    const buffer = this.generatedBuffer;
    const channels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const kbps = 192;
    const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, kbps);

    const left = buffer.getChannelData(0);
    const right = channels > 1 ? buffer.getChannelData(1) : left;
    const length = left.length;
    const sampleBlockSize = 1152;
    const mp3Data = [];

    const floatTo16Bit = (arr) => {
      const buf = new Int16Array(arr.length);
      for (let i = 0; i < arr.length; i++) {
        const s = Math.max(-1, Math.min(1, arr[i]));
        buf[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      return buf;
    };

    const leftI16 = floatTo16Bit(left);
    const rightI16 = floatTo16Bit(right);

    for (let i = 0; i < length; i += sampleBlockSize) {
      const leftChunk = leftI16.subarray(i, i + sampleBlockSize);
      const rightChunk = rightI16.subarray(i, i + sampleBlockSize);
      const mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
      if (mp3buf.length > 0) mp3Data.push(mp3buf);
    }

    const end = mp3encoder.flush();
    if (end.length > 0) mp3Data.push(end);

    return new Blob(mp3Data, { type: 'audio/mp3' });
  }
}

// Make available globally
window.AudioEngine = AudioEngine;
window.GENRES = GENRES;
