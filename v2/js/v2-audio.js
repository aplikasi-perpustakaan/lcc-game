/**
 * PTAR Shelfcraft - Version 2 Audio Engine
 * Spatial Web Audio API, Foley Synthesizer & Ambient Soundscape Mixer
 */

export class V2AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambientGain = null;
    this.foleyGain = null;
    
    this.isMuted = false;
    this.rainNode = null;
    this.clockInterval = null;
    
    this.volumes = {
      master: 0.8,
      rain: 0.35,
      clock: 0.15,
      foley: 0.9
    };
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    // Master bus
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volumes.master, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Sub-buses
    this.foleyGain = this.ctx.createGain();
    this.foleyGain.gain.setValueAtTime(this.volumes.foley, this.ctx.currentTime);
    this.foleyGain.connect(this.masterGain);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
    this.ambientGain.connect(this.masterGain);
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : this.volumes.master,
        this.ctx.currentTime,
        0.05
      );
    }
    return this.isMuted;
  }

  // Bunyi angkat buku dengan stereo panner (X: -1 hingga +1)
  playPickup(panX = 0) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const panner = this.createPanner(panX);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(280 + Math.random() * 40, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(460, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(panner);
      panner.connect(this.foleyGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  // Bunyi meletak buku di rak kayu (Warm wooden thud)
  playDrop(panX = 0, isHeavy = false) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const panner = this.createPanner(panX);
      
      // Frekuensi lebih rendah untuk buku tebal
      const baseFreq = isHeavy ? 110 : 160;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq + Math.random() * 20, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(panner);
      panner.connect(this.foleyGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  // Bunyi geseran buku semasa menggelongsor
  playSlide(panX = 0) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const panner = this.createPanner(panX);
      const bufferSize = this.ctx.sampleRate * 0.06;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 800;
      filter.Q.value = 2.0;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(panner);
      panner.connect(this.foleyGain);

      noise.start();
    } catch (e) {}
  }

  // Chime jawapan tepat (Arpeggio pentatonik emas)
  playCorrect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

        const startT = this.ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0.2, startT);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.45);

        osc.connect(gain);
        gain.connect(this.foleyGain);

        osc.start(startT);
        osc.stop(startT + 0.45);
      });
    } catch (e) {}
  }

  // Bunyi salah (Gentle double-tap buzz)
  playWrong() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      [0, 0.1].forEach(delay => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, this.ctx.currentTime + delay);

        const startT = this.ctx.currentTime + delay;
        gain.gain.setValueAtTime(0.12, startT);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.08);

        osc.connect(gain);
        gain.connect(this.foleyGain);

        osc.start(startT);
        osc.stop(startT + 0.08);
      });
    } catch (e) {}
  }

  // Suasana Hujan Tropika di Luar Tingkap Perpustakaan (Sintesis Prosedural)
  toggleRain(enable) {
    this.init();
    if (!this.ctx) return;

    if (enable && !this.rainNode) {
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02; // Brown noise
        lastOut = output[i];
      }

      this.rainNode = this.ctx.createBufferSource();
      this.rainNode.buffer = noiseBuffer;
      this.rainNode.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1000;

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(this.volumes.rain, this.ctx.currentTime);

      this.rainNode.connect(filter);
      filter.connect(this.rainGain);
      this.rainGain.connect(this.ambientGain);

      this.rainNode.start();
    } else if (!enable && this.rainNode) {
      try {
        this.rainNode.stop();
        this.rainNode.disconnect();
      } catch (e) {}
      this.rainNode = null;
    }
  }

  setRainVolume(val) {
    this.volumes.rain = val;
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.setTargetAtTime(val, this.ctx.currentTime, 0.05);
    }
  }

  createPanner(panX) {
    if (this.ctx.createStereoPanner) {
      const panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(Math.max(-1, Math.min(1, panX)), this.ctx.currentTime);
      return panner;
    }
    // Fallback gain jika StereoPanner tiada
    return this.ctx.createGain();
  }
}
