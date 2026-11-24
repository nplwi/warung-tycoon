// Cozy Animal Crossing-inspired Web Audio API BGM + Night Ambience + Retro SFX
// Pure procedural synthesis — zero external audio files required.

const NOTE_FREQ: Record<string, number> = {
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196.0,
  A3: 220.0,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
};

interface StepNote {
  bass?: string;
  chord?: string[];
  lead?: string;
}

// 16-step cozy jazzy C-major / F-major loop (105 BPM, bouncy 8th-note feel)
const BGM_PATTERN: StepNote[] = [
  // Bar 1: Cmaj7
  { bass: 'C3', chord: ['E4', 'G4', 'B4'], lead: 'G5' },
  {},
  { lead: 'E5' },
  { bass: 'G3', chord: ['E4', 'G4', 'B4'] },
  // Bar 2: Am7
  { bass: 'A3', chord: ['C4', 'E4', 'G4'], lead: 'A5' },
  { lead: 'G5' },
  { lead: 'E5' },
  { bass: 'E3', chord: ['C4', 'E4', 'G4'], lead: 'C5' },
  // Bar 3: Fmaj7
  { bass: 'F3', chord: ['A4', 'C5', 'E5'], lead: 'D5' },
  {},
  { lead: 'E5' },
  { bass: 'C3', chord: ['A4', 'C5', 'E5'], lead: 'F5' },
  // Bar 4: G7 -> turnaround
  { bass: 'G3', chord: ['B3', 'D4', 'F4'], lead: 'E5' },
  { lead: 'D5' },
  { bass: 'D3', lead: 'B4' },
  { chord: ['B3', 'D4', 'F4'], lead: 'D5' },
];

class WarungSoundEngine {
  private ctx: AudioContext | null = null;
  private sfxMuted = false;
  private bgmEnabled = true;
  private bgmTimer: number | null = null;
  private stepIndex = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public unlockAndStartBgm() {
    if (this.bgmEnabled && this.bgmTimer === null) {
      this.startBgm();
    }
  }

  public setMuted(muted: boolean) {
    this.sfxMuted = muted;
  }

  public isMuted(): boolean {
    return this.sfxMuted;
  }

  public isBgmEnabled(): boolean {
    return this.bgmEnabled;
  }

  public toggleBgm(): boolean {
    this.bgmEnabled = !this.bgmEnabled;
    if (this.bgmEnabled) {
      this.startBgm();
    } else {
      this.stopBgm();
    }
    return this.bgmEnabled;
  }

  public startBgm() {
    if (this.bgmTimer !== null) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const stepMs = 285; // ~105 BPM 8th-note swing feel
    this.bgmTimer = window.setInterval(() => {
      if (!this.bgmEnabled) return;
      this.playBgmStep(this.stepIndex);
      this.stepIndex = (this.stepIndex + 1) % BGM_PATTERN.length;
    }, stepMs);
  }

  public stopBgm() {
    if (this.bgmTimer !== null) {
      window.clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  private playBgmStep(stepIdx: number) {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running') return;
    const now = ctx.currentTime;
    const step = BGM_PATTERN[stepIdx];

    // Mellow triangle bass
    if (step.bass && NOTE_FREQ[step.bass]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(NOTE_FREQ[step.bass], now);
      gain.gain.setValueAtTime(0.055, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }

    // Playful marimba chords
    if (step.chord) {
      step.chord.forEach((n) => {
        const freq = NOTE_FREQ[n];
        if (!freq) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.022, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.17);
      });
    }

    // Whistling soft square lead (lowpass filtered)
    if (step.lead && NOTE_FREQ[step.lead]) {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(NOTE_FREQ[step.lead], now);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);
    }

    // Night Ambience: faint cricket chirp on step 6 & 14
    if (stepIdx === 6 || stepIdx === 14) {
      this.playCricketChirp(now);
    }
  }

  private playCricketChirp(startTime: number) {
    const ctx = this.ctx;
    if (!ctx) return;
    [0, 0.05].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(4350, startTime + offset);
      gain.gain.setValueAtTime(0.006, startTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + offset + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime + offset);
      osc.stop(startTime + offset + 0.04);
    });
  }

  // Bouncy "pop" when customer appears
  public playArrivalBell() {
    if (this.sfxMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.07);
    gain.gain.setValueAtTime(0.075, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Satisfying "clink/cha-ching" on payment
  public playCashRegister() {
    if (this.sfxMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [1046.5, 1318.5, 1568.0].forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const t = now + idx * 0.055;
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.23);
    });
  }

  // Frying sizzle
  public playSizzle() {
    if (this.sfxMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const duration = 0.25;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.55));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, now);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
  }

  // Kettle boil
  public playBoil() {
    if (this.sfxMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [340, 460, 580].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const t = now + i * 0.055;
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, t + 0.05);
      gain.gain.setValueAtTime(0.045, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.08);
    });
  }

  // Soft retro click
  public playClick() {
    if (this.sfxMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.04);
    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Shift end bell
  public playShiftEndBell() {
    if (this.sfxMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [659.25, 783.99, 1046.5].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const t = now + i * 0.12;
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.46);
    });
  }

  // Error / burned / angry buzzer
  public playError() {
    if (this.sfxMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(115, now + 0.18);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.21);
  }
}

export const soundEngine = new WarungSoundEngine();
