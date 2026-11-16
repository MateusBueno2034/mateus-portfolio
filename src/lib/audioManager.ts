export type SoundName =
  | "activate"
  | "confirm"
  | "dismiss"
  | "navigate"
  | "menu-open"
  | "menu-close"
  | "project"
  | "experiment"
  | "achievement"
  | "intro"
  | "game-start"
  | "game-over"
  | "success"
  | "error"
  | "move"
  | "rotate"
  | "drop"
  | "lock"
  | "line"
  | "progress"
  | "hit"
  | "wall"
  | "point"
  | "block"
  | "life"
  | "card"
  | "pair"
  | "type"
  | "clear";

const STORAGE_KEY = "mateus-portfolio-audio";
const DEFAULT_VOLUME = 0.18;

type Voice = {
  oscillator?: OscillatorNode;
  gain: GainNode;
  filter?: BiquadFilterNode;
  noise?: AudioBufferSourceNode;
};

type IntroCharge = {
  base: OscillatorNode;
  harmonic: OscillatorNode;
  pulse: OscillatorNode;
  baseGain: GainNode;
  harmonicGain: GainNode;
  pulseGain: GainNode;
  filter: BiquadFilterNode;
  delay: DelayNode;
  feedback: GainNode;
  wet: GainNode;
  cleanupTimer?: number;
};

class AudioManager {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private lastPlayed = new Map<SoundName, number>();
  private enabled = this.readEnabled();
  private volume = this.readVolume();
  private introCharge: IntroCharge | null = null;

  private readEnabled() {
    if (typeof window === "undefined") return true;
    try { return window.localStorage.getItem(STORAGE_KEY) !== "off"; } catch { return true; }
  }

  private readVolume() {
    if (typeof window === "undefined") return DEFAULT_VOLUME;
    try {
      const stored = window.localStorage.getItem(`${STORAGE_KEY}-volume`);
      if (stored === null) return DEFAULT_VOLUME;
      const value = Number(stored);
      return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : DEFAULT_VOLUME;
    } catch { return DEFAULT_VOLUME; }
  }

  private ensureContext() {
    if (!this.enabled || typeof window === "undefined") return null;
    if (!this.context) {
      const Constructor = window.AudioContext ??
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Constructor) return null;
      this.context = new Constructor();
      this.master = this.context.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(this.context.destination);
    }
    if (this.context.state === "suspended") void this.context.resume();
    return this.context;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    try { window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off"); } catch { /* session-only fallback */ }
    if (!enabled && this.context) void this.context.suspend();
  }

  setVolume(volume: number) {
    this.volume = Math.min(1, Math.max(0, volume));
    if (this.master) this.master.gain.value = this.volume;
    try { window.localStorage.setItem(`${STORAGE_KEY}-volume`, String(this.volume)); } catch { /* session-only fallback */ }
  }

  isEnabled() { return this.enabled; }
  getVolume() { return this.volume; }

  private voice(context: AudioContext, start: number, duration: number, type: OscillatorType, frequency: number, peak = 0.35) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + Math.min(0.012, duration * 0.2));
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(this.master!);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
    return { oscillator, gain };
  }

  private noise(context: AudioContext, start: number, duration: number, peak = 0.18) {
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.value = 1400;
    filter.Q.value = 0.8;
    gain.gain.setValueAtTime(peak, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter).connect(gain).connect(this.master!);
    source.start(start);
    return source;
  }

  startIntroCharge() {
    const context = this.ensureContext();
    if (!context || !this.master || this.introCharge) return;
    const start = context.currentTime;
    const base = context.createOscillator();
    const harmonic = context.createOscillator();
    const pulse = context.createOscillator();
    const baseGain = context.createGain();
    const harmonicGain = context.createGain();
    const pulseGain = context.createGain();
    const filter = context.createBiquadFilter();
    const delay = context.createDelay(0.5);
    const feedback = context.createGain();
    const wet = context.createGain();

    base.type = "sine";
    base.frequency.setValueAtTime(42, start);
    harmonic.type = "triangle";
    harmonic.frequency.setValueAtTime(84, start);
    pulse.type = "sine";
    pulse.frequency.setValueAtTime(1.7, start);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(180, start);
    filter.Q.setValueAtTime(1.2, start);
    delay.delayTime.setValueAtTime(0.16, start);
    feedback.gain.setValueAtTime(0.28, start);
    wet.gain.setValueAtTime(0.12, start);
    [baseGain, harmonicGain, pulseGain].forEach((gain) => gain.gain.setValueAtTime(0.0001, start));

    base.connect(baseGain).connect(filter);
    harmonic.connect(harmonicGain).connect(filter);
    filter.connect(this.master);
    filter.connect(delay).connect(feedback).connect(delay);
    delay.connect(wet).connect(this.master);
    pulse.connect(pulseGain).connect(this.master);
    base.start(start);
    harmonic.start(start);
    pulse.start(start);
    this.introCharge = { base, harmonic, pulse, baseGain, harmonicGain, pulseGain, filter, delay, feedback, wet };
  }

  updateIntroCharge(progress: number) {
    const charge = this.introCharge;
    if (!charge || !this.context) return;
    const now = this.context.currentTime;
    const value = Math.min(1, Math.max(0, progress));
    const intensity = 0.018 + value * value * 0.16;
    charge.baseGain.gain.setTargetAtTime(0.035 + value * 0.16, now, 0.045);
    charge.harmonicGain.gain.setTargetAtTime(0.012 + value * 0.12, now, 0.06);
    charge.pulseGain.gain.setTargetAtTime(intensity * (0.7 + value * 0.5), now, 0.045);
    charge.base.frequency.setTargetAtTime(42 + value * 20, now, 0.08);
    charge.harmonic.frequency.setTargetAtTime(84 + value * 128, now, 0.08);
    charge.pulse.frequency.setTargetAtTime(1.7 + value * 3.8, now, 0.08);
    charge.filter.frequency.setTargetAtTime(180 + value * 1050, now, 0.08);
    charge.delay.delayTime.setTargetAtTime(0.16 + value * 0.08, now, 0.1);
    charge.wet.gain.setTargetAtTime(0.1 + value * 0.12, now, 0.1);
  }

  private finishIntroCharge(fadeDuration: number) {
    const charge = this.introCharge;
    if (!charge || !this.context) return;
    const now = this.context.currentTime;
    [charge.baseGain, charge.harmonicGain, charge.pulseGain, charge.wet].forEach((gain) => {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(0.0001, now, fadeDuration);
    });
    charge.cleanupTimer = window.setTimeout(() => {
      charge.base.stop();
      charge.harmonic.stop();
      charge.pulse.stop();
      charge.base.disconnect();
      charge.harmonic.disconnect();
      charge.pulse.disconnect();
      this.introCharge = null;
    }, Math.ceil(fadeDuration * 5000));
  }

  cancelIntroCharge() {
    this.finishIntroCharge(0.09);
  }

  completeIntroCharge() {
    const context = this.ensureContext();
    if (!context || !this.master) return;
    this.finishIntroCharge(0.16);
    const start = context.currentTime + 0.025;
    const impact = this.voice(context, start, 0.92, "sine", 58, 0.34);
    impact.oscillator!.frequency.exponentialRampToValueAtTime(28, start + 0.82);
    const body = this.voice(context, start, 0.55, "triangle", 118, 0.2);
    body.oscillator!.frequency.exponentialRampToValueAtTime(62, start + 0.5);

    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * 1.15), context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) {
      data[index] = (Math.random() * 2 - 1) * (1 - index / data.length);
    }
    const expansion = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const expansionGain = context.createGain();
    const delay = context.createDelay(0.6);
    const echoGain = context.createGain();
    expansion.buffer = buffer;
    filter.type = "bandpass";
    filter.Q.setValueAtTime(0.65, start);
    filter.frequency.setValueAtTime(320, start);
    filter.frequency.exponentialRampToValueAtTime(2600, start + 0.52);
    expansionGain.gain.setValueAtTime(0.0001, start);
    expansionGain.gain.exponentialRampToValueAtTime(0.12, start + 0.08);
    expansionGain.gain.exponentialRampToValueAtTime(0.0001, start + 1.08);
    delay.delayTime.setValueAtTime(0.18, start);
    echoGain.gain.setValueAtTime(0.16, start);
    expansion.connect(filter).connect(expansionGain).connect(this.master);
    expansionGain.connect(delay).connect(echoGain).connect(this.master);
    expansion.start(start);
    expansion.stop(start + 1.2);

    const tail = this.voice(context, start + 0.16, 1.35, "sine", 196, 0.075);
    tail.oscillator!.frequency.exponentialRampToValueAtTime(92, start + 1.45);
  }

  play(name: SoundName) {
    const now = performance.now();
    const previous = this.lastPlayed.get(name) ?? -Infinity;
    const cooldown = name === "move" || name === "type" ? 45 : 85;
    if (now - previous < cooldown) return;
    this.lastPlayed.set(name, now);
    const context = this.ensureContext();
    if (!context || !this.master) return;
    const start = context.currentTime;
    const make = (frequency: number, duration: number, type: OscillatorType, peak?: number, offset = 0) =>
      this.voice(context, start + offset, duration, type, frequency, peak);

    switch (name) {
      case "menu-open": { const v = make(180, 0.16, "sine", 0.28); v.oscillator!.frequency.exponentialRampToValueAtTime(420, start + 0.16); break; }
      case "menu-close": { const v = make(420, 0.13, "sine", 0.24); v.oscillator!.frequency.exponentialRampToValueAtTime(160, start + 0.13); break; }
      case "navigate": { make(260, 0.06, "triangle", 0.24); make(390, 0.09, "sine", 0.16); break; }
      case "confirm": case "activate": { make(520, 0.08, "square", 0.13); make(780, 0.16, "sine", 0.18); break; }
      case "dismiss": case "error": { const v = make(name === "error" ? 150 : 220, 0.18, "sawtooth", 0.12); v.oscillator!.frequency.exponentialRampToValueAtTime(75, start + 0.18); break; }
      case "project": { make(220, 0.22, "triangle", 0.2); const v = make(440, 0.3, "sine", 0.14); v.oscillator!.frequency.exponentialRampToValueAtTime(660, start + 0.3); break; }
      case "experiment": { make(110, 0.3, "sine", 0.16); make(330, 0.18, "triangle", 0.2); this.noise(context, start, 0.08, 0.08); break; }
      case "achievement": { [0, 4, 7, 12].forEach((step, index) => { make(330 * 2 ** (step / 12), 0.28, "sine", 0.18, index * 0.07); }); break; }
      case "intro": { make(55, 1.2, "sine", 0.12); const v = make(110, 0.9, "triangle", 0.1); v.oscillator!.frequency.exponentialRampToValueAtTime(440, start + 0.9); break; }
      case "game-start": { make(196, 0.12, "square", 0.12); make(294, 0.16, "square", 0.12); make(392, 0.22, "sine", 0.16); break; }
      case "game-over": { const v = make(240, 0.45, "sawtooth", 0.14); v.oscillator!.frequency.exponentialRampToValueAtTime(70, start + 0.45); this.noise(context, start, 0.12, 0.1); break; }
      case "success": case "pair": { make(name === "pair" ? 660 : 520, 0.1, "sine", 0.18); make(name === "pair" ? 990 : 780, 0.2, "sine", 0.16); break; }
      case "move": case "rotate": { make(name === "rotate" ? 360 : 220, 0.055, "triangle", 0.16); break; }
      case "drop": case "lock": { this.noise(context, start, 0.07, 0.13); make(name === "drop" ? 95 : 135, 0.11, "square", 0.12); break; }
      case "line": { [440, 554, 659].forEach((frequency, index) => make(frequency, 0.13 + index * 0.03, "sine", 0.14)); break; }
      case "progress": { make(300, 0.12, "triangle", 0.13); make(600, 0.2, "sine", 0.15); break; }
      case "hit": case "wall": { this.noise(context, start, 0.045, 0.16); make(name === "wall" ? 180 : 260, 0.06, "triangle", 0.14); break; }
      case "point": { make(440, 0.08, "square", 0.12); make(880, 0.18, "sine", 0.16); break; }
      case "block": { this.noise(context, start, 0.05, 0.13); make(520, 0.08, "triangle", 0.14); break; }
      case "life": { const v = make(180, 0.3, "sawtooth", 0.11); v.oscillator!.frequency.exponentialRampToValueAtTime(90, start + 0.3); break; }
      case "card": { make(300, 0.07, "triangle", 0.13); break; }
      case "type": { make(700, 0.035, "square", 0.07); break; }
      case "clear": { this.noise(context, start, 0.16, 0.12); make(120, 0.12, "sine", 0.1); break; }
    }
  }
}

export const audioManager = new AudioManager();
