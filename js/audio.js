/* Original music + SFX generated with the Web Audio API. No audio files, no copied melodies.
   Audio starts only after the first user tap (browser autoplay rules).

   MUSIC_PATTERNS below is pure data (easy to mirror in an offline renderer):
   - steps are 16th notes; a loop is `bars` bars of 16 steps
   - chords[bar] = { root (MIDI, bass), pad: [MIDI...] }
   - bass.pattern = 16 offsets (semitones above root) or null = rest
   - drums: arrays of step indexes within a bar (kick / snare / hat / openHat)
   - lead: [absStep, midi, lengthInSteps] over the whole loop
   - inst: synth params (osc types, detune cents, filter cutoffs, gains, envelope times)
   - fx: delay time in 16th steps, feedback, wet; filterSweep = bass low-pass cutoff per bar (Hz) */
(function () {
  /* v2 (style ref: user's own late-90s console-menu track — style only, nothing copied):
     C minor, tritone (C <-> F#) root movement with stops on Eb, F and G, warm detuned pads,
     sparse moody lead, tight-but-quiet drums, and a slow build: `build.stages` add layers every
     `build.every` bars; after the last stage holds for `build.hold` bars it drops back to stage 1. */
  const MUSIC_PATTERNS = {
    quiz: { // ~150 bpm feel, C minor
      bpm: 150, bars: 8, swing: 0,
      chords: [
        { root: 36, pad: [60, 63, 67] },      // Cm
        { root: 36, pad: [60, 63, 67, 74] },  // Cm(add9)
        { root: 42, pad: [58, 61, 66] },      // F#   (tritone from C)
        { root: 36, pad: [59, 63, 67] },      // Cm(maj7)  — B against C, the spy chord
        { root: 39, pad: [58, 63, 67] },      // Eb
        { root: 41, pad: [60, 65, 68] },      // Fm
        { root: 42, pad: [61, 66, 70] },      // F#
        { root: 43, pad: [59, 62, 65, 67] }   // G7  → back to Cm
      ],
      bass: { pattern: [0, null, 12, null, 0, null, 6, null, 0, null, 12, null, 7, null, 6, null], len: 1.7 }, // 8ths; +6 = tritone
      arp: { every: 1, idx: [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1, 2, 3], oct: 12, len: 0.8, osc: "square", cut: 2300, gain: 0.03 }, // idx wraps over pad tones (+12 per wrap)
      drums: { kick: [0, 8, 10], snare: [4, 12], hat: [2, 6, 10, 14], ghost: [7, 15], openHat: [14] },
      lead: [[0, 67, 6], [8, 66, 2], [10, 63, 4], [16, 60, 10], [32, 73, 4], [36, 70, 4], [40, 66, 8], [56, 71, 6], [62, 72, 2],
             [64, 75, 8], [76, 74, 2], [78, 72, 2], [80, 72, 6], [88, 68, 8], [104, 70, 4], [108, 66, 4], [112, 71, 8], [120, 74, 4], [124, 77, 4]],
      build: { every: 8, hold: 24, stages: [["pad", "bass"], ["pad", "bass", "kick", "hat", "arp"], ["pad", "bass", "kick", "hat", "arp", "snare", "lead"], ["pad", "bass", "kick", "hat", "arp", "snare", "lead", "ghost", "shimmer"]],
               bright: [0.55, 0.75, 0.9, 1] }, // multiplies filter cutoffs per stage
      inst: { bassOsc: ["sawtooth", "square"], bassDetune: 6, bassQ: 5, padOsc: "sawtooth", padDetune: [-12, 0, 12], padCut: 1600, padGain: 0.055, padAttack: 0.35,
              leadOsc: "triangle", leadCut: 2800, leadGain: 0.1, leadVibrato: 5, leadVibDepth: 10, shimmerGain: 0.018, kickGain: 0.5, snareGain: 0.16, hatGain: 0.03, ghostGain: 0.012 },
      fx: { delaySteps: 3, feedback: 0.36, wet: 0.3, filterSweep: [300, 380, 460, 560, 680, 820, 980, 640] }
    },
    arcade: { // arcade games: ~108 bpm, G minor, i–VI–VII driving arps, brighter and busier (style ref 2, nothing copied)
      bpm: 108, bars: 8, swing: 0,
      chords: [
        { root: 43, pad: [62, 67, 70] },      // Gm
        { root: 43, pad: [62, 67, 69, 70] },  // Gm(add9)
        { root: 39, pad: [63, 67, 70] },      // Eb
        { root: 41, pad: [60, 65, 69] },      // F
        { root: 43, pad: [62, 67, 70, 74] },  // Gm
        { root: 46, pad: [62, 65, 70] },      // Bb
        { root: 39, pad: [63, 67, 70, 74] },  // Ebmaj7
        { root: 41, pad: [60, 65, 69, 72] }   // F  → Gm
      ],
      bass: { pattern: [0, null, 12, null, 0, null, 12, 7, 0, null, 12, null, 0, 12, 10, 12], len: 1.2 },
      arp: { every: 1, idx: [0, 1, 2, 3, 4, 3, 2, 1, 0, 2, 4, 5, 4, 2, 3, 1], oct: 12, len: 0.7, osc: "square", cut: 3500, gain: 0.03 },
      drums: { kick: [0, 6, 8], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14], ghost: [3, 7, 11, 15], openHat: [6, 14] },
      lead: [[0, 74, 4], [4, 77, 2], [6, 74, 2], [8, 79, 6], [16, 77, 2], [18, 74, 2], [20, 72, 4], [24, 70, 8], [32, 70, 2], [34, 72, 2], [36, 74, 4], [40, 75, 6], [46, 74, 2],
             [48, 72, 4], [52, 69, 4], [56, 72, 8], [64, 74, 4], [68, 77, 2], [70, 79, 2], [72, 82, 6], [78, 81, 2], [80, 79, 4], [84, 77, 4], [88, 74, 8],
             [96, 75, 4], [100, 79, 4], [104, 82, 4], [108, 79, 4], [112, 81, 6], [118, 77, 2], [120, 72, 4], [124, 74, 4]],
      build: { every: 4, hold: 16, stages: [["pad", "bass", "arp", "hat"], ["pad", "bass", "arp", "hat", "kick", "snare"], ["pad", "bass", "arp", "hat", "kick", "snare", "lead"], ["pad", "bass", "arp", "hat", "kick", "snare", "lead", "ghost", "shimmer"]],
               bright: [0.8, 0.9, 1, 1.1] },
      inst: { bassOsc: ["sawtooth", "square"], bassDetune: 8, bassQ: 6, padOsc: "sawtooth", padDetune: [-10, 0, 10], padCut: 2600, padGain: 0.045, padAttack: 0.12,
              leadOsc: "square", leadCut: 3600, leadGain: 0.075, leadVibrato: 5.5, leadVibDepth: 8, shimmerGain: 0.022, kickGain: 0.55, snareGain: 0.2, hatGain: 0.035, ghostGain: 0.015 },
      fx: { delaySteps: 3, feedback: 0.3, wet: 0.26, filterSweep: [500, 600, 700, 800, 900, 1000, 1100, 800] }
    },
    chill: { // menu: half-time ~76 bpm, C minor
      bpm: 76, bars: 8, swing: 0,
      chords: [
        { root: 36, pad: [60, 63, 67, 74] },  // Cm(add9)
        { root: 42, pad: [58, 61, 66] },      // F#
        { root: 36, pad: [59, 63, 67] },      // Cm(maj7)
        { root: 39, pad: [58, 63, 67, 70] },  // Eb(add Bb)
        { root: 41, pad: [60, 65, 68] },      // Fm
        { root: 42, pad: [61, 66, 70] },      // F#
        { root: 43, pad: [59, 62, 65, 67] },  // G7
        { root: 36, pad: [59, 63, 67, 74] }   // Cm(maj9)
      ],
      bass: { pattern: [0, null, null, null, null, null, 12, null, 0, null, null, null, 6, null, 7, null], len: 3 },
      arp: { every: 2, idx: [0, 1, 2, 3, 2, 1, 2, 3], oct: 12, len: 1.6, osc: "triangle", cut: 1500, gain: 0.04 },
      drums: { kick: [0, 10], snare: [8], hat: [4, 12], ghost: [2, 6, 14], openHat: [] },
      lead: [[4, 67, 8], [16, 70, 8], [26, 73, 4], [34, 72, 6], [40, 71, 8], [52, 70, 8], [60, 67, 4], [68, 68, 8], [76, 65, 4],
             [84, 66, 8], [92, 70, 4], [96, 71, 10], [108, 74, 4], [114, 75, 8], [124, 71, 4]],
      build: { every: 4, hold: 12, stages: [["pad", "bass"], ["pad", "bass", "kick", "hat", "arp"], ["pad", "bass", "kick", "hat", "arp", "snare", "lead"], ["pad", "bass", "kick", "hat", "arp", "snare", "lead", "ghost", "shimmer"]],
               bright: [0.6, 0.8, 0.92, 1] }, // 4 bars at 76 bpm = same seconds as 8 bars at 152
      inst: { bassOsc: ["sawtooth", "triangle"], bassDetune: 5, bassQ: 4, padOsc: "sawtooth", padDetune: [-14, 0, 14], padCut: 1250, padGain: 0.07, padAttack: 1.0,
              leadOsc: "triangle", leadCut: 1700, leadGain: 0.11, leadVibrato: 4.2, leadVibDepth: 12, shimmerGain: 0.02, kickGain: 0.42, snareGain: 0.14, hatGain: 0.025, ghostGain: 0.01 },
      fx: { delaySteps: 3, feedback: 0.42, wet: 0.36, filterSweep: [260, 300, 340, 400, 460, 520, 600, 420] }
    }
  };
  /* Answer SFX params (port of audio-preview/sfx2.py). Streak raises the whole sound by these semitones. */
  const SFX_PARAMS = {
    streakSemis: [0, 2, 4, 7, 12], // 1st, 2nd, 3rd, 4th, 5th+ correct in a row (caps at 12); reset on a miss
    correct: { thump: { f0: 145, f1: 55, decay: 28, dur: 0.12, gain: 0.55 }, snap: { dur: 0.025, gain: 0.35 }, drawer: { at: 0.015, dur: 0.07, lp: 3000, gain: 0.25 },
      bells: [{ f: 1568, at: 0.06, dur: 1.1, gain: 0.42, bend: 0.02 }, { f: 2093, at: 0.11, dur: 1.2, gain: 0.5, bend: 0.03 }],
      partials: [[1, 1, 4.5], [2, 0.35, 7], [2.76, 0.3, 9], [5.4, 0.15, 14]], // [ratio, amp, decay/s]
      coins: { f: [3136, 3520, 4186, 4699, 5274, 6272], at: 0.17, gap: 0.035, dur: 0.22, gain: 0.09 }, sparkle: { at: 0.2, dur: 0.5, decay: 7, gain: 0.05 } },
    /* in-a-row stings, layered ~230 ms after the cha-ching. Notes are MIDI; times in seconds. */
    stings: {
      3: { arp: [76, 80, 83], gap: 0.07, dur: 0.18, lastDur: 0.32, gain: 0.16 },
      5: { fanfare: [71, 76, 80, 83, 88], gap: 0.09, dur: 0.16, lastDur: 0.55, gain: 0.14, coins: { n: 14, span: 0.7, fmin: 3000, fmax: 6500, gain: 0.07 } },
      7: { chord: [52, 59, 64, 68, 71], dur: 0.75, gain: 0.1, drawer: { at: 0.05, dur: 0.09, lp: 900, gain: 0.5, thump: 60 }, clank: 900, coins: { n: 26, span: 1.3, fmin: 2800, fmax: 6500, gain: 0.065 } },
      10: { slot: { n: 18, f: [1568, 2093], gap0: 0.09, gap1: 0.04, dur: 0.3, gain: 0.12 }, coins: { n: 50, at: 0.3, span: 2.2, fmin: 2600, fmax: 7000, gain: 0.06 },
            swell: { notes: [40, 52, 59, 64, 68, 71, 75, 78], at: 0.5, rise: 1.2, hold: 1.4, rel: 0.8, cut0: 400, cut1: 5000, gain: 0.1, detune: [-10, 0, 10] }, bigBell: { at: 1.0, f: 4186, dur: 1.6, gain: 0.35 } }
    },
    /* UI sounds: quiet, short, randomized a little every time */
    ui: { click: { tock: [190, 240], tockDur: 0.012, tick: [3600, 4600], tickDur: 0.006, gain: 0.28 }, btn: { f: [2300, 2800], dur: 0.006, gain: 0.1 },
          toggle: { f: [[1300, 1500], [2000, 2300]], gap: 0.028, dur: 0.008, gain: 0.14 },
          page: { dur: [0.17, 0.22], bp: [[900, 1300], [3600, 4800]], q: 0.9, flutter: [28, 42], gain: 0.07 }, whoosh: { dur: [0.14, 0.18], lp: [350, 1900, 500], gain: 0.07 } },
    space: { reverbSec: 1.4, reverbSend: 0.18, bellPan: 0.25, coinPan: 0.5 },
    buzzer: { f: 98, fifth: 1.498, pulses: [[0, 0.14], [0.17, 0.32]], lp: 1800, gain: 0.6, glide: 6, thump: { f: 70, dur: 0.1, gain: 0.4 } }
  };
  window.MUSIC_PATTERNS = MUSIC_PATTERNS; window.SFX_PARAMS = SFX_PARAMS;

  let duckGain = null, cur = null, pending = null, curSting = null; const buffers = {}, loading = {};
  let rev = null, revSend = null, ctx = null, master = null, comp = null, musicGain = null, sfxGain = null, dly = null, dlyFb = null, dlyWet = null, bassLP = null, noiseBuf = null;
  let timer = null, step = 0, nextTime = 0, track = null, streak = 0;
  /* mixer buses (Settings > Sound): master -> [music (file + synth + stings), game SFX, quiz SFX, UI clicks]. Each SFX category has a dry
     bus into the shared compressor and a wet bus into the shared room reverb, so a category's slider also scales its reverb tail. */
  let musicBus = null, synthBus = null, stingBus = null, bus = "quiz"; const dry = {}, wet = {}, loops = new Set();
  const VOL = { master: 0.8, music: 0.8, game: 0.8, quiz: 0.8, ui: 0.8 }, REF = 0.8; /* 80 % = the original mix */
  let musicScale = 1, musicDeferred = true, riser = null, musicStarts = 0;
  const busGain = v => Math.min(1.6, Math.pow(Math.max(0, v) / REF, 2));
  const D = () => dry[bus] || sfxGain;
  const S = { sound: true, music: true, ui: true }; let lastUiClick = 0, lastUi = 0;
  function init() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    ctx = new AC();
    comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.knee.value = 12; comp.ratio.value = 3; comp.attack.value = 0.005; comp.release.value = 0.2;
    master = ctx.createGain(); master.gain.value = VOL.master; comp.connect(master); master.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.connect(master); synthBus = ctx.createGain(); synthBus.connect(comp); stingBus = ctx.createGain(); stingBus.connect(master);
    musicGain = ctx.createGain(); musicGain.gain.value = 0.14; musicGain.connect(synthBus);
    sfxGain = ctx.createGain(); sfxGain.gain.value = 0.5; sfxGain.connect(comp);
    duckGain = ctx.createGain(); duckGain.gain.value = 1; duckGain.connect(musicBus);
    // echo: delay with filtered feedback, wet into the music bus
    dly = ctx.createDelay(1.5); dlyFb = ctx.createGain(); dlyWet = ctx.createGain(); const fbLP = ctx.createBiquadFilter(); fbLP.type = "lowpass"; fbLP.frequency.value = 2400;
    dly.connect(fbLP); fbLP.connect(dlyFb); dlyFb.connect(dly); dly.connect(dlyWet); dlyWet.connect(musicGain);
    // shared bass low-pass (swept per bar)
    bassLP = ctx.createBiquadFilter(); bassLP.type = "lowpass"; bassLP.connect(musicGain);
    // small room reverb for SFX tails (generated impulse, stereo)
    rev = ctx.createConvolver(); const L = Math.floor(ctx.sampleRate * SFX_PARAMS.space.reverbSec), ir = ctx.createBuffer(2, L, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < L; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / L, 3); }
    rev.buffer = ir; revSend = ctx.createGain(); revSend.gain.value = SFX_PARAMS.space.reverbSend; revSend.connect(rev); rev.connect(D());
    ["game", "quiz", "ui"].forEach(k => { dry[k] = ctx.createGain(); dry[k].connect(sfxGain); wet[k] = ctx.createGain(); wet[k].connect(revSend); });
    applyVol(true);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    loadTrack("ui-click").catch(() => {});
    return ctx;
  }
  const hz = n => 440 * Math.pow(2, (n - 69) / 12);
  const rnd = (a, b) => a + Math.random() * (b - a);
  let HUM = 1; /* per-SFX humanize: every one-shot gets a few cents of random pitch so repeats never sound robotic (music is untouched) */
  function tone(note, t, dur, type = "square", gain = 0.3, dest) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime((typeof note === "number" && note < 200 ? hz(note) : note) * HUM, t);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || D()); o.start(t); o.stop(t + dur + 0.05); return o;
  }
  /* noise burst from the shared buffer; filter = [type, freq, Q] */
  function noise(t, dur, gain = 0.3, filter = ["highpass", 1000], dest, decay = true) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf; f.type = filter[0]; f.frequency.value = filter[1] * HUM; if (filter[2]) f.Q.value = filter[2];
    g.gain.setValueAtTime(gain, t); if (decay) g.gain.exponentialRampToValueAtTime(0.0001, t + dur); else g.gain.setValueAtTime(0, t + dur);
    s.connect(f); f.connect(g); g.connect(dest || D()); s.start(t, Math.random() * 1.4); s.stop(t + dur + 0.02); return g;
  }

  /* ---------------- music voices ---------------- */
  function kick(t, g, dest) { const o = ctx.createOscillator(), v = ctx.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
    v.gain.setValueAtTime(g, t); v.gain.exponentialRampToValueAtTime(0.0001, t + 0.28); o.connect(v); v.connect(dest); o.start(t); o.stop(t + 0.3); }
  function gatedSnare(t, g, dest) { // body + noise, then a hard-gated "room" tail sent into the delay
    tone(185, t, 0.09, "triangle", g * 0.6, dest);
    noise(t, 0.12, g, ["bandpass", 1900, 0.8], dest);
    const tail = noise(t + 0.01, 0.17, g * 0.45, ["highpass", 900], dest, false); tail.connect(dly);
  }
  function bassNote(n, t, dur, P) {
    P.inst.bassOsc.forEach((type, k) => { const o = ctx.createOscillator(), v = ctx.createGain(); o.type = type; o.frequency.value = hz(n); o.detune.value = k ? P.inst.bassDetune : -P.inst.bassDetune;
      v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(k ? 0.12 : 0.2, t + 0.008); v.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(v); v.connect(bassLP); o.start(t); o.stop(t + dur + 0.05); });
  }
  function pad(notes, t, dur, P, br = 1) {
    const f = ctx.createBiquadFilter(), v = ctx.createGain(), cut = P.inst.padCut * br; f.type = "lowpass"; f.frequency.setValueAtTime(cut * 0.6, t); f.frequency.linearRampToValueAtTime(cut, t + dur * 0.6); f.Q.value = 0.7;
    v.gain.setValueAtTime(0.0001, t); v.gain.linearRampToValueAtTime(P.inst.padGain, t + P.inst.padAttack); v.gain.setValueAtTime(P.inst.padGain, t + dur - 0.3); v.gain.linearRampToValueAtTime(0.0001, t + dur + 0.2);
    f.connect(v); v.connect(musicGain); const send = ctx.createGain(); send.gain.value = 0.25; v.connect(send); send.connect(dly);
    notes.forEach(n => P.inst.padDetune.forEach(c => { const o = ctx.createOscillator(); o.type = P.inst.padOsc; o.frequency.value = hz(n); o.detune.value = c; o.connect(f); o.start(t); o.stop(t + dur + 0.3); }));
  }
  function shimmer(notes, t, dur, P) { notes.forEach((n, k) => { const o = ctx.createOscillator(), v = ctx.createGain(); o.type = "sine"; o.frequency.value = hz(n + 12); o.detune.value = k % 2 ? 4 : -4;
      v.gain.setValueAtTime(0.0001, t); v.gain.linearRampToValueAtTime(P.inst.shimmerGain, t + dur * 0.4); v.gain.linearRampToValueAtTime(0.0001, t + dur); o.connect(v); v.connect(musicGain); v.connect(dly); o.start(t); o.stop(t + dur + 0.05); }); }
  function arp(n, t, dur, P, br = 1) { const A = P.arp, o = ctx.createOscillator(), f = ctx.createBiquadFilter(), v = ctx.createGain(); o.type = A.osc; o.frequency.value = hz(n);
    f.type = "lowpass"; f.frequency.value = A.cut * br; f.Q.value = 3; v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(A.gain, t + 0.005); v.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(f); f.connect(v); v.connect(musicGain); const sd = ctx.createGain(); sd.gain.value = 0.6; v.connect(sd); sd.connect(dly); o.start(t); o.stop(t + dur + 0.05); }
  function lead(n, t, dur, P) {
    const o = ctx.createOscillator(), lfo = ctx.createOscillator(), lg = ctx.createGain(), f = ctx.createBiquadFilter(), v = ctx.createGain();
    o.type = P.inst.leadOsc; o.frequency.value = hz(n); lfo.frequency.value = P.inst.leadVibrato; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(P.inst.leadVibDepth, t + dur * 0.6);
    lfo.connect(lg); lg.connect(o.detune); f.type = "lowpass"; f.frequency.value = P.inst.leadCut; f.Q.value = 2;
    v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(P.inst.leadGain, t + 0.02); v.gain.setValueAtTime(P.inst.leadGain, t + dur * 0.7); v.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.08);
    o.connect(f); f.connect(v); v.connect(musicGain); v.connect(dly); o.start(t); lfo.start(t); o.stop(t + dur + 0.1); lfo.stop(t + dur + 0.1);
  }
  /* stage for the current bar: grows every build.every bars, holds, then drops back to stage 1 */
  function stageFor(P, barCount) { const B = P.build, n = B.stages.length, top = B.every * (n - 1);
    if (barCount < top + B.hold) return Math.min(n - 1, Math.floor(barCount / B.every));
    const c = (barCount - top - B.hold) % (B.every * (n - 2) + B.hold); return Math.min(n - 1, 1 + Math.floor(c / B.every)); }
  function arpNote(P, ch, i) { const A = P.arp, k = A.idx[(i / A.every) % A.idx.length], L = ch.pad.length; return ch.pad[k % L] + A.oct + 12 * Math.floor(k / L); }
  function schedule() {
    const P = MUSIC_PATTERNS[track]; if (!P) return;
    const s16 = 60 / P.bpm / 4, loop = P.bars * 16;
    while (nextTime < ctx.currentTime + 0.25) {
      const abs = step % loop, bar = Math.floor(abs / 16), i = abs % 16, ch = P.chords[bar], t = nextTime;
      const st = stageFor(P, Math.floor(step / 16)), on = P.build.stages[st], br = P.build.bright[st], has = k => on.includes(k);
      if (i === 0) { bassLP.frequency.setTargetAtTime(P.fx.filterSweep[bar] * (0.6 + 0.4 * br), t, 0.6); bassLP.Q.value = P.inst.bassQ;
        pad(ch.pad, t, s16 * 16, P, br); if (has("shimmer")) shimmer(ch.pad, t, s16 * 16, P); }
      const off = P.bass.pattern[i]; if (has("bass") && off != null) bassNote(ch.root + off, t, s16 * P.bass.len, P);
      if (has("arp") && i % P.arp.every === 0) arp(arpNote(P, ch, i), t, s16 * P.arp.len, P, br);
      if (has("kick") && P.drums.kick.includes(i)) kick(t, P.inst.kickGain, musicGain);
      if (has("snare") && P.drums.snare.includes(i)) gatedSnare(t, P.inst.snareGain, musicGain);
      if (has("hat") && P.drums.hat.includes(i)) noise(t, P.drums.openHat.includes(i) ? 0.14 : 0.035, P.inst.hatGain, ["highpass", 7000], musicGain);
      else if (has("ghost") && P.drums.ghost.includes(i)) noise(t, 0.025, P.inst.ghostGain, ["highpass", 8500], musicGain);
      if (has("lead")) P.lead.forEach(([s0, n, len]) => { if (s0 === abs) lead(n, t, s16 * len, P); });
      nextTime += s16; step++;
    }
  }

  /* ---------------- music: file loops (primary) + procedural (fallback) ---------------- */
  const FILE_FOR = { quiz: "quiz", chill: "menu", menu: "menu", arcade: "arcade", study: "study", sim: "sim", exam: "exam" }, MUSIC_LEVEL = 0.34, XFADE = 0.6;
  let loopMeta = null;
  const fmt = () => { const a = document.createElement("audio"); return a.canPlayType && a.canPlayType('audio/mp4; codecs="mp4a.40.2"') ? "m4a" : "mp3"; };
  function loadTrack(key) {
    if (buffers[key]) return Promise.resolve(buffers[key]);
    if (!loading[key]) loading[key] = (loopMeta ? Promise.resolve(loopMeta) : fetch("audio/loops.json").then(r => r.json()).then(j => (loopMeta = j)))
      .then(() => fetch(`audio/${key}.${fmt()}`)).then(r => { if (!r.ok) throw new Error("audio " + r.status); return r.arrayBuffer(); })
      .then(ab => new Promise((ok, no) => ctx.decodeAudioData(ab, ok, no))).then(b => (buffers[key] = b))
      .catch(err => { delete loading[key]; throw err; });
    return loading[key];
  }
  function startFile(buf, key) {
    /* Never start a second source for the same file — iPhone was stuttering on intro→menu handoff. */
    if (cur && cur.key === key) return;
    stopSynth(); const m = loopMeta[key], t = ctx.currentTime, src = ctx.createBufferSource(), g = ctx.createGain();
    src.buffer = buf; src.loop = true; src.loopStart = m.loopStart; src.loopEnd = Math.min(m.loopEnd, buf.duration);
    const fade = Math.max(XFADE, 0.9);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(MUSIC_LEVEL, t + fade); src.connect(g); g.connect(duckGain);
    const prev = cur; cur = { src, g, key }; if (prev) fadeOut(prev);
    src.start(t, m.loopStart);
    musicStarts += 1;
  }
  function fadeOut(p) { const t = ctx.currentTime; p.g.gain.cancelScheduledValues(t); p.g.gain.setValueAtTime(p.g.gain.value, t); p.g.gain.linearRampToValueAtTime(0.0001, t + XFADE); try { p.src.stop(t + XFADE + 0.05); } catch (e) {} }
  function stopSting(sec = 0.3) { if (!curSting) return; const t = ctx.currentTime, p = curSting; curSting = null; p.g.gain.cancelScheduledValues(t); p.g.gain.setValueAtTime(p.g.gain.value, t); p.g.gain.linearRampToValueAtTime(0.0001, t + sec); try { p.src.stop(t + sec + 0.05); } catch (e) {}
    const d = duckGain.gain; d.cancelScheduledValues(t); d.setValueAtTime(d.value, t); d.linearRampToValueAtTime(1, t + 1.0); }
  function fadeOutFile() { if (cur && ctx) { fadeOut(cur); cur = null; } }
  /* duck music ~40% under answer SFX and streak stings */
  function duck(hold = 0.5, depth = 0.6) { if (!duckGain) return; const t = ctx.currentTime, g = duckGain.gain; if (depth > g.value + 0.02 && g.value < 0.98) return; /* never lift a deeper duck already running */ g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(depth, t + 0.04); g.setValueAtTime(depth, t + hold); g.linearRampToValueAtTime(1, t + hold + (depth > 0.7 ? 0.35 : 0.6)); }
  function startSynth(name) {
    stopSynth(); step = 0; nextTime = ctx.currentTime + 0.05;
    const P = MUSIC_PATTERNS[name]; if (!P) return; dly.delayTime.value = (60 / P.bpm / 4) * P.fx.delaySteps; dlyFb.gain.value = P.fx.feedback; dlyWet.gain.value = P.fx.wet;
    musicGain.gain.cancelScheduledValues(ctx.currentTime); musicGain.gain.setValueAtTime(0.0001, ctx.currentTime); musicGain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 1.2);
    timer = setInterval(schedule, 50);
  }
  function stopSynth() { if (timer) clearInterval(timer); timer = null; }
  const DUCK = { correct: 0.7, wrong: 0.5, streak3: 0.8, streak5: 1.2, streak7: 1.8, streak10: 3, levelup: 1, fanfare: 1.2, wahwah: 1.4, firework: 0.8, hop: [0.18, 0.8], land: [0.2, 0.78], zonechime: [1.6, 0.55], combo: [0.5, 0.7], chime: [0.6, 0.7], gearclick: [0.8, 0.6], rankfan: [2.4, 0.35], heart: [0.5, 0.6], stampg: [0.5, 0.7], unlock: [0.9, 0.6], stamp: [0.6, 0.65], pickup: [0.25, 0.85] }; /* [hold s, depth]: trail hops dip the music slightly */

  /* trophy-landing UNLOCK: mechanical latch (two clicks + low thunk) then a rising shimmer chime with stereo + reverb */
  function unlockSfx() {
    const t = ctx.currentTime;
    [0, 0.032].forEach((d, k) => { const g = out(k ? 0.15 : -0.15, 0.3); noise(t + d, 0.006, 0.5, ["bandpass", k ? 4200 : 2900, 3], g); });
    { const o = ctx.createOscillator(), v = out(0, 0.2); o.frequency.setValueAtTime(140, t + 0.03); o.frequency.exponentialRampToValueAtTime(70, t + 0.1);
      v.gain.setValueAtTime(0.0001, t + 0.03); v.gain.exponentialRampToValueAtTime(0.5, t + 0.035); v.gain.exponentialRampToValueAtTime(0.0001, t + 0.12); o.connect(v); o.start(t + 0.03); o.stop(t + 0.14); }
    noise(t + 0.03, 0.05, 0.12, ["lowpass", 900], out(0, 0.2));
    [1318.5, 1760, 2093, 2637, 3520].forEach((f, k) => { const st = t + 0.1 + k * 0.055, o = ctx.createOscillator(), o2 = ctx.createOscillator(), v = out(k % 2 ? 0.35 : -0.35, 1);
      o.type = "sine"; o2.type = "sine"; o.frequency.setValueAtTime(f * 0.97, st); o.frequency.exponentialRampToValueAtTime(f, st + 0.05); o2.frequency.value = f * 2.01;
      const g2 = ctx.createGain(); g2.gain.value = 0.25; o2.connect(g2); g2.connect(v);
      v.gain.setValueAtTime(0.0001, st); v.gain.exponentialRampToValueAtTime(0.16, st + 0.01); v.gain.exponentialRampToValueAtTime(0.0001, st + 0.7);
      o.connect(v); o.start(st); o2.start(st); o.stop(st + 0.75); o2.stop(st + 0.75); });
    { const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), v = out(0, 1); src.buffer = noiseBuf; f.type = "bandpass"; f.Q.value = 6;
      f.frequency.setValueAtTime(3000, t + 0.1); f.frequency.exponentialRampToValueAtTime(9000, t + 0.6); v.gain.setValueAtTime(0.0001, t + 0.1); v.gain.exponentialRampToValueAtTime(0.05, t + 0.3); v.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
      src.connect(f); f.connect(v); src.start(t + 0.1, Math.random()); src.stop(t + 0.85); }
  }

  /* ---------------- answer SFX ---------------- */
  /* output node with stereo position + reverb send */
  function out(pan = 0, wetAmt = 1) { const g = ctx.createGain(); let n = g; if (ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = pan; g.connect(p); n = p; } n.connect(D()); if (wetAmt) { const w = ctx.createGain(); w.gain.value = wetAmt; n.connect(w); w.connect(wet[bus] || revSend); } return g; }
  function bell(f, t, dur, g, bend = 0, pan = 0) {
    const o0 = out(pan); o0.gain.setValueAtTime(0, t); o0.gain.linearRampToValueAtTime(g, t + 0.0015);
    SFX_PARAMS.correct.partials.forEach(([r, a, k]) => { const o = ctx.createOscillator(), v = ctx.createGain(); o.type = "sine";
      o.frequency.setValueAtTime(f * r * (1 + bend), t); o.frequency.setTargetAtTime(f * r, t, 1 / 30);
      v.gain.setValueAtTime(a, t); v.gain.setTargetAtTime(0.0001, t, 1 / k); o.connect(v); v.connect(o0); o.start(t); o.stop(t + dur); });
  }
  function correctSfx(semi) {
    const C = SFX_PARAMS.correct, m = Math.pow(2, (semi + rnd(-0.12, 0.12)) / 12), t = ctx.currentTime + 0.005;
    const o = ctx.createOscillator(), v = ctx.createGain(); o.frequency.setValueAtTime(C.thump.f0, t); o.frequency.setTargetAtTime(C.thump.f1, t, 1 / 40);
    v.gain.setValueAtTime(C.thump.gain, t); v.gain.setTargetAtTime(0.0001, t, 1 / C.thump.decay); o.connect(v); v.connect(D()); o.start(t); o.stop(t + C.thump.dur + 0.05);
    noise(t, C.snap.dur, C.snap.gain, ["highpass", 1500]);
    noise(t + C.drawer.at, C.drawer.dur, C.drawer.gain, ["lowpass", C.drawer.lp]);
    const SP = SFX_PARAMS.space;
    C.bells.forEach((b, i) => bell(b.f * m, t + b.at, b.dur, b.gain, b.bend, i ? SP.bellPan : -SP.bellPan));
    C.coins.f.forEach((f, i) => bell(f * m, t + C.coins.at + i * C.coins.gap * rnd(0.9, 1.1), C.coins.dur, C.coins.gain, 0, (i / 5 * 2 - 1) * SP.coinPan));
    noise(t + C.sparkle.at, C.sparkle.dur, C.sparkle.gain, ["highpass", 6500]);
  }
  /* stings */
  function synth(n, t, dur, gain, types, det, cut, pan = 0) { // brass/pluck voice with a fast filter envelope
    const f = ctx.createBiquadFilter(), v = out(pan, 0.8); f.type = "lowpass"; f.Q.value = 1.5; f.frequency.setValueAtTime(cut[0], t); f.frequency.exponentialRampToValueAtTime(cut[1], t + 0.04); f.frequency.exponentialRampToValueAtTime(cut[2], t + dur);
    v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(gain, t + 0.008); v.gain.setValueAtTime(gain, t + dur * 0.6); v.gain.exponentialRampToValueAtTime(0.0001, t + dur); f.connect(v);
    types.forEach((ty, i) => det.forEach(c => { const o = ctx.createOscillator(); o.type = ty; o.frequency.value = hz(n) * HUM; o.detune.value = c + i * 3; o.connect(f); o.start(t); o.stop(t + dur + 0.05); }));
  }
  function coinRain(t, C) { for (let i = 0; i < C.n; i++) { const u = i / C.n, at = t + (C.at || 0) + C.span * Math.pow(u, 0.8) + rnd(0, 0.03); bell(rnd(C.fmin, C.fmax), at, 0.2, C.gain * rnd(0.6, 1), 0, rnd(-0.6, 0.6)); } }
  function sting(n) {
    const P = SFX_PARAMS.stings[n]; if (!P) return; const t = ctx.currentTime + 0.01;
    if (n === 3) P.arp.forEach((x, i) => synth(x, t + i * P.gap, i === P.arp.length - 1 ? P.lastDur : P.dur, P.gain, ["square", "sawtooth"], [-6, 6], [800, 4200, 1200], (i - 1) * 0.3));
    if (n === 5) { P.fanfare.forEach((x, i) => synth(x, t + i * P.gap, i === P.fanfare.length - 1 ? P.lastDur : P.dur, P.gain, ["sawtooth"], [-8, 8], [600, 3500, 1500], (i - 2) * 0.15)); coinRain(t + 0.2, P.coins); }
    if (n === 7) { P.chord.forEach(x => synth(x, t, P.dur, P.gain, ["sawtooth"], [-9, 9], [300, 4500, 1200])); const D = P.drawer;
      noise(t + D.at, D.dur, D.gain, ["lowpass", D.lp]); tone(D.thump, t + D.at, 0.15, "sine", 0.5); bell(P.clank, t + D.at, 0.25, 0.12); coinRain(t + 0.15, P.coins); }
    if (n === 10) { const SL = P.slot; let at = t; for (let i = 0; i < SL.n; i++) { bell(SL.f[i % 2] * rnd(0.99, 1.01), at, SL.dur, SL.gain, 0, i % 2 ? 0.3 : -0.3); at += SL.gap0 + (SL.gap1 - SL.gap0) * i / (SL.n - 1); }
      coinRain(t, P.coins); const W = P.swell, f = ctx.createBiquadFilter(), v = out(0, 1.2); f.type = "lowpass"; f.frequency.setValueAtTime(W.cut0, t + W.at); f.frequency.exponentialRampToValueAtTime(W.cut1, t + W.at + W.rise);
      v.gain.setValueAtTime(0.0001, t + W.at); v.gain.linearRampToValueAtTime(W.gain, t + W.at + W.rise); v.gain.setValueAtTime(W.gain, t + W.at + W.rise + W.hold); v.gain.linearRampToValueAtTime(0.0001, t + W.at + W.rise + W.hold + W.rel); f.connect(v);
      const end = t + W.at + W.rise + W.hold + W.rel + 0.1; W.notes.forEach(x => W.detune.forEach(c => { const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = hz(x); o.detune.value = c; o.connect(f); o.start(t + W.at); o.stop(end); }));
      bell(P.bigBell.f, t + P.bigBell.at, P.bigBell.dur, P.bigBell.gain, 0.02); }
  }
  /* UI */
  function playUiClick(gain) {
    const t = ctx.currentTime + 0.002, dest = dry.ui || D(), buf = buffers["ui-click"];
    if (buf) { const src = ctx.createBufferSource(), g = ctx.createGain(); src.buffer = buf; g.gain.value = gain; src.connect(g); g.connect(dest); src.start(t); return; }
    /* soft tactile tick fallback — filtered noise, not a beepy synth tone */
    noise(t, 0.014, gain * 0.4, ["bandpass", 2100, 1.8], dest);
    noise(t, 0.008, gain * 0.22, ["highpass", 4500], dest);
  }
  function clickSfx(kind) {
    const U = SFX_PARAMS.ui, t = ctx.currentTime + 0.002;
    if (kind === "click" || kind === "btn" || kind === "tap") { playUiClick(kind === "click" ? 0.55 : 0.42); return; }
    if (kind === "toggle") { const G = U.toggle; G.f.forEach((r, i) => { tone(rnd(...r), t + i * G.gap, G.dur, "triangle", G.gain); noise(t + i * G.gap, 0.004, G.gain * 0.4, ["highpass", 4000]); }); }
    if (kind === "page") { const P = U.page, d = rnd(...P.dur), s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), v = ctx.createGain(), fl = ctx.createOscillator(), fg = ctx.createGain();
      s.buffer = noiseBuf; f.type = "bandpass"; f.Q.value = P.q; f.frequency.setValueAtTime(rnd(...P.bp[0]), t); f.frequency.exponentialRampToValueAtTime(rnd(...P.bp[1]), t + d * 0.8);
      v.gain.setValueAtTime(0.0001, t); v.gain.linearRampToValueAtTime(P.gain, t + d * 0.35); v.gain.linearRampToValueAtTime(0.0001, t + d);
      fl.frequency.value = rnd(...P.flutter); fg.gain.value = P.gain * 0.45; fl.connect(fg); fg.connect(v.gain); // paper flutter (AM)
      s.connect(f); f.connect(v); v.connect(D()); s.start(t, Math.random()); s.stop(t + d + 0.02); fl.start(t); fl.stop(t + d + 0.02); }
    if (kind === "whoosh") { const W = U.whoosh, d = rnd(...W.dur), s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), v = ctx.createGain();
      s.buffer = noiseBuf; f.type = "lowpass"; f.Q.value = 1.2; f.frequency.setValueAtTime(W.lp[0], t); f.frequency.exponentialRampToValueAtTime(W.lp[1] * rnd(0.85, 1.15), t + d * 0.45); f.frequency.exponentialRampToValueAtTime(W.lp[2], t + d);
      v.gain.setValueAtTime(0.0001, t); v.gain.linearRampToValueAtTime(W.gain, t + d * 0.45); v.gain.linearRampToValueAtTime(0.0001, t + d); s.connect(f); f.connect(v); v.connect(D()); s.start(t, Math.random()); s.stop(t + d + 0.02); }
  }
  function buzzerSfx() {
    const B = SFX_PARAMS.buzzer, t = ctx.currentTime + 0.005, f0 = B.f * Math.pow(2, rnd(-0.3, 0.3) / 12);
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = B.lp; lp.connect(out(0, 0.5));
    B.pulses.forEach(([t0, d], k) => { const v = ctx.createGain(); v.gain.setValueAtTime(0, t + t0); v.gain.linearRampToValueAtTime(B.gain, t + t0 + 0.004); v.gain.setValueAtTime(B.gain, t + t0 + d - 0.03); v.gain.linearRampToValueAtTime(0, t + t0 + d); v.connect(lp);
      [[1, 0.6], [B.fifth, 0.3]].forEach(([r, a]) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = "square"; o.frequency.setValueAtTime(f0 * r, t + t0); if (k) o.frequency.linearRampToValueAtTime((f0 - B.glide) * r, t + t0 + d); g.gain.value = a; o.connect(g); g.connect(v); o.start(t + t0); o.stop(t + t0 + d + 0.02); }); });
    const o = ctx.createOscillator(), v = ctx.createGain(); o.frequency.value = B.thump.f; v.gain.setValueAtTime(B.thump.gain, t); v.gain.setTargetAtTime(0.0001, t, 1 / 30); o.connect(v); v.connect(D()); o.start(t); o.stop(t + B.thump.dur + 0.1);
  }
  function wahwah() { // sad trombone, game over only
    const t = ctx.currentTime + 0.02, notes = [[58, 0, 0.32], [57, 0.36, 0.32], [56, 0.72, 0.32], [55, 1.08, 0.9]];
    notes.forEach(([n, at, d], k) => { const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), v = ctx.createGain(); o.type = "sawtooth"; o.frequency.value = hz(n);
      if (k === 3) { const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = 6; lg.gain.value = 35; l.connect(lg); lg.connect(o.detune); l.start(t + at); l.stop(t + at + d); }
      f.type = "lowpass"; f.Q.value = 6; f.frequency.setValueAtTime(400, t + at); f.frequency.linearRampToValueAtTime(1400, t + at + 0.1); f.frequency.linearRampToValueAtTime(500, t + at + d);
      v.gain.setValueAtTime(0.0001, t + at); v.gain.exponentialRampToValueAtTime(0.22, t + at + 0.04); v.gain.setValueAtTime(0.22, t + at + d - 0.08); v.gain.exponentialRampToValueAtTime(0.0001, t + at + d);
      o.connect(f); f.connect(v); v.connect(D()); o.start(t + at); o.stop(t + at + d + 0.05); });
  }

  /* ---------------- mixer ---------------- */
  function applyVol(now) { if (!ctx) return; const t = ctx.currentTime, set = (node, v) => { if (!node) return; node.gain.cancelScheduledValues(t); if (now) node.gain.setValueAtTime(v, t); else node.gain.setTargetAtTime(v, t, 0.03); };
    set(master, VOL.master); const m = S.music ? busGain(VOL.music) * musicScale : 0; set(musicBus, m); set(synthBus, m); set(stingBus, busGain(VOL.music) * musicScale);
    ["game", "quiz", "ui"].forEach(k => { set(dry[k], busGain(VOL[k])); set(wet[k], busGain(VOL[k])); }); }
  const CAT_UI = new Set(["click", "btn", "toggle", "page", "whoosh"]);
  const CAT_QUIZ = new Set(["chime", "gearclick", "rankstamp", "rankfan", "correct", "wrong", "streak3", "streak5", "streak7", "streak10", "levelup", "fanfare", "confetti", "firework", "unlock", "stamp", "wahwah", "combo", "zonechime"]);
  const catOf = (name, opts) => opts && opts.bus ? opts.bus : CAT_UI.has(name) ? "ui" : CAT_QUIZ.has(name) ? "quiz" : "game";

  /* ---------------- training-game SFX (synthesized, game bus) ---------------- */
  function zap(t, g = 0.3) { for (let i = 0; i < 6; i++) noise(t + i * 0.018 + rnd(0, 0.01), 0.02, g * rnd(0.5, 1), ["bandpass", rnd(2500, 6000), 2]); noise(t, 0.12, g * 0.5, ["highpass", 1800]); }
  function gameSfx(name, o, t) {
    switch (name) {
      case "snap": { /* wire snap-click: two plastic clicks + a tiny brass ping, pitched by o.pitch */
        const p = o.pitch || 1; noise(t, 0.008, 0.45, ["bandpass", 3200 * p, 4], out(rnd(-0.2, 0.2), 0.3)); noise(t + 0.022, 0.006, 0.3, ["bandpass", 4600 * p, 5], out(0, 0.3));
        tone(rnd(1900, 2100) * p, t + 0.02, 0.08, "triangle", 0.06); const k = tone(320 * p, t, 0.05, "sine", 0.18); k.frequency.exponentialRampToValueAtTime(110, t + 0.04); break; }
      case "unsnap": { const k = tone(600, t, 0.12, "triangle", 0.12); k.frequency.exponentialRampToValueAtTime(180, t + 0.1); noise(t, 0.01, 0.2, ["bandpass", 2400, 3]); break; }
      case "pick": { const k = tone(rnd(700, 760), t, 0.06, "sine", 0.1); k.frequency.exponentialRampToValueAtTime(1200, t + 0.05); break; }
      case "clunk": { /* contactor pulling in: low thud + metal clack + buzz tail */
        const k = tone(120, t, 0.16, "sine", 0.5); k.frequency.exponentialRampToValueAtTime(48, t + 0.12); noise(t, 0.03, 0.4, ["bandpass", 1800, 1.5], out(0, 0.5)); noise(t + 0.012, 0.02, 0.25, ["highpass", 5000]);
        const b = ctx.createOscillator(), v = ctx.createGain(), f = ctx.createBiquadFilter(); b.type = "sawtooth"; b.frequency.value = 120; f.type = "lowpass"; f.frequency.value = 600;
        v.gain.setValueAtTime(0.0001, t + 0.04); v.gain.exponentialRampToValueAtTime(0.05, t + 0.08); v.gain.exponentialRampToValueAtTime(0.0001, t + 0.5); b.connect(f); f.connect(v); v.connect(D()); b.start(t + 0.04); b.stop(t + 0.55); break; }
      case "spark": zap(t, 0.34); { const k = tone(90, t, 0.25, "sawtooth", 0.12); k.frequency.exponentialRampToValueAtTime(40, t + 0.2); } break;
      case "pop": { noise(t, 0.05, 0.6, ["lowpass", 2200], out(0, 0.6)); const k = tone(300, t, 0.08, "sine", 0.35); k.frequency.exponentialRampToValueAtTime(60, t + 0.07); zap(t + 0.03, 0.15); break; }
      case "ignite": { noise(t, 0.18, 0.4, ["lowpass", 900], out(0, 0.5)); const k = tone(70, t, 0.2, "sine", 0.35); k.frequency.exponentialRampToValueAtTime(40, t + 0.18); break; }
      case "sizzle": for (let i = 0; i < 14; i++) noise(t + i * rnd(0.012, 0.03), 0.012, rnd(0.05, 0.16), ["highpass", rnd(4500, 8000)]); noise(t, 0.35, 0.06, ["bandpass", 6000, 1]); break;
      case "flow": { /* alloy wicking: soft liquid shimmer */ for (let i = 0; i < 5; i++) { const k = tone(rnd(900, 1400) + i * 120, t + i * 0.05, 0.12, "sine", 0.05); k.frequency.exponentialRampToValueAtTime(rnd(1600, 2200), t + i * 0.05 + 0.1); } break; }
      case "micron": tone(rnd(2600, 2900), t, 0.012, "square", 0.05); break;
      case "beep": tone(o.f || 2200, t, o.d || 0.05, "square", o.g || 0.06); break;
      case "bubble": { const k = tone(rnd(500, 700), t, 0.07, "sine", 0.16); k.frequency.exponentialRampToValueAtTime(rnd(1300, 1700), t + 0.06); break; }
      case "valve": { noise(t, 0.04, 0.2, ["bandpass", 900, 3]); const k = tone(220, t, 0.1, "triangle", 0.12); k.frequency.exponentialRampToValueAtTime(330, t + 0.08); break; }
      case "gauge": { const k = tone(180, t, 0.45, "triangle", 0.035); k.frequency.exponentialRampToValueAtTime(420, t + 0.4); noise(t + 0.38, 0.01, 0.12, ["bandpass", 3000, 4]); break; }
      case "swish": { const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), v = out(o.pan || 0, 0.2); s.buffer = noiseBuf; f.type = "bandpass"; f.Q.value = 1.4; f.frequency.setValueAtTime(600, t); f.frequency.exponentialRampToValueAtTime(2600, t + 0.12);
        v.gain.setValueAtTime(0.0001, t); v.gain.linearRampToValueAtTime(0.12, t + 0.05); v.gain.linearRampToValueAtTime(0.0001, t + 0.16); s.connect(f); f.connect(v); s.start(t, Math.random()); s.stop(t + 0.18); break; }
      case "step": { const k = tone(rnd(95, 115), t, 0.05, "sine", 0.12); k.frequency.exponentialRampToValueAtTime(60, t + 0.04); noise(t, 0.02, 0.05, ["lowpass", 1200]); break; }
      case "heart": [76, 72, 67].forEach((n, i) => tone(n, t + i * 0.08, 0.12, "square", 0.07)); break;
      case "stampg": { const k = tone(70, t, 0.2, "sine", 0.5); k.frequency.exponentialRampToValueAtTime(40, t + 0.15); noise(t, 0.08, 0.3, ["lowpass", 1500]); noise(t + 0.005, 0.03, 0.15, ["highpass", 3000]); break; }
      case "combo": { const n0 = 64 + (o.level || 2) * 3; [0, 4, 7, 12].forEach((d, i) => synth(n0 + d, t + i * 0.045, i === 3 ? 0.3 : 0.09, 0.07, ["square"], [-5, 5], [1200, 5000, 1600], (i - 1.5) * 0.2)); break; }
      case "boss": { [36, 43, 48].forEach(n => synth(n, t, 1.2, 0.12, ["sawtooth"], [-12, 0, 12], [200, 1800, 300])); const k = tone(55, t, 0.6, "sine", 0.5); k.frequency.exponentialRampToValueAtTime(35, t + 0.5); break; }
      case "catch": { const k = tone(240, t, 0.1, "sine", 0.35); k.frequency.exponentialRampToValueAtTime(90, t + 0.09); noise(t, 0.04, 0.2, ["bandpass", 1400, 1.5]); break; }
      case "pickup": { /* runner pickup: soft thump + bright two-note sparkle, pitch climbs with the combo */
        const p = o.pitch || 1, k = tone(200, t, 0.08, "sine", 0.28); k.frequency.exponentialRampToValueAtTime(90, t + 0.07); noise(t, 0.012, 0.25, ["bandpass", 3800, 3], out(rnd(-0.2, 0.2), 0.3));
        synth(76 + Math.round((p - 1) * 12), t + 0.01, 0.09, 0.06, ["triangle"], [-4, 4], [2000, 6000, 2500], -0.15); synth(83 + Math.round((p - 1) * 12), t + 0.06, 0.18, 0.05, ["triangle"], [-4, 4], [2000, 6000, 2500], 0.15);
        for (let i = 0; i < 4; i++) tone(rnd(4200, 6800), t + 0.08 + i * 0.03, 0.05, "sine", 0.025); break; }
      case "drip": { const k = tone(1200, t, 0.09, "sine", 0.12); k.frequency.exponentialRampToValueAtTime(500, t + 0.08); break; }
      default: return false;
    }
    return true;
  }
  /* continuous loops (torch hiss, nitrogen hiss, compressor hum, fan, vacuum pump). Returns { set(x 0..1), stop() } */
  function makeLoop(kind, x0 = 1) {
    if (!ctx) return null; const t = ctx.currentTime, prevBus = bus; bus = "game";
    const v = out(0, kind === "torch" ? 0.35 : 0.15); bus = prevBus; v.gain.setValueAtTime(0.0001, t); const nodes = [];
    const src = () => { const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true; s.start(t, Math.random()); nodes.push(s); return s; };
    const osc = (type, f) => { const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; o.start(t); nodes.push(o); return o; };
    let set = () => {}, stopFx = null;
    if (kind === "torch") { /* oxy/air-acetylene: steady broadband roaring hiss (mostly 200 Hz–4 kHz) + soft low-mid roar, slow turbulence,
         soft ignition whump, brighter when the flame is adjusted/closer (x), clean short darkening tail on shutoff */
      const s = src(), hp = ctx.createBiquadFilter(), lp = ctx.createBiquadFilter(), pres = ctx.createBiquadFilter(), hiss = ctx.createGain();
      hp.type = "highpass"; hp.frequency.value = 200; hp.Q.value = 0.6; lp.type = "lowpass"; lp.frequency.value = 3400; lp.Q.value = 0.5;
      pres.type = "peaking"; pres.frequency.value = 2600; pres.Q.value = 0.8; pres.gain.value = 0; hiss.gain.value = 0.62;
      s.connect(hp); hp.connect(lp); lp.connect(pres); pres.connect(hiss); hiss.connect(v);
      const s2 = src(), rbp = ctx.createBiquadFilter(), rlp = ctx.createBiquadFilter(), roarG = ctx.createGain(); /* roar: decorrelated noise, low-mid band */
      rbp.type = "bandpass"; rbp.frequency.value = 320; rbp.Q.value = 0.9; rlp.type = "lowpass"; rlp.frequency.value = 700; roarG.gain.value = 0.55;
      s2.connect(rbp); rbp.connect(rlp); rlp.connect(roarG); roarG.connect(v);
      /* turbulence: noise low-passed to a few Hz drives small level + filter wander (no periodic wobble) */
      const s3 = src(), t1 = ctx.createBiquadFilter(), t2 = ctx.createBiquadFilter(), tg = ctx.createGain(), tf = ctx.createGain(), tr = ctx.createGain();
      t1.type = t2.type = "lowpass"; t1.frequency.value = t2.frequency.value = 3.5; s3.connect(t1); t1.connect(t2);
      tg.gain.value = 9; tf.gain.value = 9000; tr.gain.value = 6; t2.connect(tg); tg.connect(hiss.gain); t2.connect(tf); tf.connect(lp.frequency); t2.connect(tr); tr.connect(roarG.gain);
      /* ignition: soft pop/whump, then the hiss blooms in */
      { const pv = out(0, 0.25); pv.gain.value = 0.0001; const th = ctx.createOscillator(), pl = ctx.createBufferSource(), pf = ctx.createBiquadFilter();
        th.type = "sine"; th.frequency.setValueAtTime(95, t); th.frequency.exponentialRampToValueAtTime(42, t + 0.14); pl.buffer = noiseBuf; pf.type = "lowpass"; pf.frequency.setValueAtTime(1600, t); pf.frequency.exponentialRampToValueAtTime(260, t + 0.12);
        th.connect(pv); pl.connect(pf); pf.connect(pv); pv.gain.setValueAtTime(0.0001, t); pv.gain.exponentialRampToValueAtTime(0.11, t + 0.008); pv.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
        th.start(t); th.stop(t + 0.2); pl.start(t, Math.random()); pl.stop(t + 0.2); }
      let first = true;
      set = x => { const n = ctx.currentTime, g = 0.106 + 0.084 * x; /* level curve re-fit so loudness (LUFS) matches the old torch at x=.5 and x=1 */
        if (first) { first = false; v.gain.setValueAtTime(0.0001, n); v.gain.exponentialRampToValueAtTime(g * 0.5, n + 0.03); v.gain.setTargetAtTime(g, n + 0.03, 0.06); } else v.gain.setTargetAtTime(g, n, 0.08);
        lp.frequency.setTargetAtTime(2600 + 1700 * x, n, 0.12); pres.gain.setTargetAtTime(-1 + 3.5 * x, n, 0.12); roarG.gain.setTargetAtTime(0.6 - 0.12 * x, n, 0.12); };
      stopFx = (n, sec) => { lp.frequency.cancelScheduledValues(n); lp.frequency.setValueAtTime(lp.frequency.value, n); lp.frequency.exponentialRampToValueAtTime(500, n + sec); }; }
    if (kind === "n2") { const s = src(), hp = ctx.createBiquadFilter(), pk = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 3000; pk.type = "peaking"; pk.frequency.value = 7000; pk.gain.value = 6; s.connect(hp); hp.connect(pk); pk.connect(v);
      set = x => { v.gain.setTargetAtTime(0.0001 + 0.12 * Math.min(1, x), ctx.currentTime, 0.06); hp.frequency.setTargetAtTime(2200 + 3000 * Math.min(1, x), ctx.currentTime, 0.06); }; }
    if (kind === "hum") { const a = osc("sawtooth", 60), b = osc("square", 120), lp = ctx.createBiquadFilter(), bg = ctx.createGain(); lp.type = "lowpass"; lp.frequency.value = 420; bg.gain.value = 0.3; a.connect(lp); b.connect(bg); bg.connect(lp); lp.connect(v);
      set = x => v.gain.setTargetAtTime(0.0001 + 0.09 * x, ctx.currentTime, 0.08); }
    if (kind === "fan") { const s = src(), lp = ctx.createBiquadFilter(), am = osc("sine", 9), ag = ctx.createGain(), base = ctx.createGain(); lp.type = "lowpass"; lp.frequency.value = 700; s.connect(lp); lp.connect(base); base.connect(v); ag.gain.value = 0.3; am.connect(ag); ag.connect(base.gain);
      set = x => { v.gain.setTargetAtTime(0.0001 + 0.12 * x, ctx.currentTime, 0.1); am.frequency.setTargetAtTime(3 + 9 * x, ctx.currentTime, 0.2); }; }
    if (kind === "pump") { const a = osc("sawtooth", 48), lp = ctx.createBiquadFilter(), chug = osc("square", 8), cg = ctx.createGain(), base = ctx.createGain(); lp.type = "lowpass"; lp.frequency.value = 300; a.connect(lp); lp.connect(base); base.connect(v); cg.gain.value = 0.35; chug.connect(cg); cg.connect(base.gain);
      const s = src(), hp = ctx.createBiquadFilter(), hg = ctx.createGain(); hp.type = "bandpass"; hp.frequency.value = 900; hg.gain.value = 0.25; s.connect(hp); hp.connect(hg); hg.connect(v);
      set = x => { v.gain.setTargetAtTime(0.0001 + 0.1 * Math.max(0.25, x), ctx.currentTime, 0.1); lp.frequency.setTargetAtTime(220 + 300 * x, ctx.currentTime, 0.2); hg.gain.setTargetAtTime(0.05 + 0.4 * x, ctx.currentTime, 0.2); }; }
    set(x0);
    const L = { kind, set: x => { if (ctx) set(x); }, stop: (sec = 0.12) => { if (!loops.has(L)) return; loops.delete(L); const n = ctx.currentTime; v.gain.cancelScheduledValues(n); v.gain.setValueAtTime(v.gain.value, n); if (stopFx) { stopFx(n, sec); v.gain.exponentialRampToValueAtTime(0.0001, n + sec); } else v.gain.linearRampToValueAtTime(0.0001, n + sec); nodes.forEach(o => { try { o.stop(n + sec + 0.05); } catch (e) {} }); } };
    loops.add(L); return L;
  }

  const A = {
    settings: S, patterns: MUSIC_PATTERNS, sfxParams: SFX_PARAMS,
    unlock() {
      try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) {}
      if (!init()) return;
      /* Kick the graph in the same user-gesture turn. iPhone Safari often ignores
         resume() from pointerdown alone, or a resume() promise that resolves after the gesture. */
      const kick = () => {
        try {
          const n = Math.max(1, Math.floor(ctx.sampleRate * 0.03));
          const buf = ctx.createBuffer(1, n, ctx.sampleRate);
          const src = ctx.createBufferSource();
          const g = ctx.createGain(); g.gain.value = 0.0001;
          src.buffer = buf; src.connect(g); g.connect(ctx.destination); src.start(0);
        } catch (e) {}
        try {
          if (!A._htmlUnlock) {
            A._htmlUnlock = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
            A._htmlUnlock.preload = "auto"; A._htmlUnlock.volume = 0.01;
          }
          const p = A._htmlUnlock.play(); if (p && p.catch) p.catch(() => {});
        } catch (e) {}
      };
      kick();
      const go = () => {
        kick();
        if (track && !timer && !cur && !musicDeferred && S.sound && S.music && ctx && ctx.state === "running") {
          const n = track; track = null; A.playMusic(n);
        }
      };
      if (ctx.state === "suspended" || ctx.state === "interrupted") {
        const r = ctx.resume();
        if (r && r.then) r.then(go).catch(() => {});
        /* also try immediately — some engines start running synchronously in a gesture */
        if (ctx.state === "running") go();
      } else go();
    },
    setSound(v) { S.sound = v; if (!v) { A.stopMusic(); A.stopLoops(); } },
    setUi(v) { S.ui = v; },
    setMusic(v) { S.music = v; if (!v) A.stopMusic(); applyVol(); },
    /* Music = the user's own Suno tracks (audio/*.m4a|mp3, cut into bar-aligned seamless loops; see audio-preview/make_loops.py).
       Gapless via AudioBufferSourceNode loop + loopStart/loopEnd from audio/loops.json. Lazy-loaded on first play.
       If a file can't load or decode, the procedural MUSIC_PATTERNS loop plays instead. */
    playMusic(name = "quiz") {
      if (!S.sound || !S.music || !init() || musicDeferred) { track = name; return; }
      if (ctx.state !== "running") { track = name; try { ctx.resume(); } catch (e) {} return; }
      const key = FILE_FOR[name] || name;
      /* Same logical track, or already playing this file: never restart or spawn a second source. */
      if (cur && cur.key === key) { track = name; return; }
      if (track === name && (cur || timer || pending === name)) return;
      if (pending === name) return;
      track = name; pending = name;
      if (name === "exam") loadTrack("fanfare-pass").catch(() => {}); // warm the pass sting
      loadTrack(key).then(buf => { if (pending === name) pending = null; if (track !== name || !S.sound || !S.music) return; startFile(buf, key); })
        .catch(() => { if (pending === name) pending = null; if (track !== name) return; fadeOutFile(); startSynth(MUSIC_PATTERNS[name] ? name : ({ study: "chill", sim: "quiz", exam: "quiz" })[name] || "chill"); });
    },
    /* one-shot stings from the user's 'Triumph in Motion': "pass" (module test / EPA practice exam, 7.9 s) and
       certificates (same 8 s cut, per the user). Music ducks almost to silence under it, then comes back. */
    /* "finished" = the user's 6 s 'ending' (lesson, non-gated quiz or arcade round over); music ducks to ~25 %.
       It never overlaps the pass fanfare: a pass cuts it, and it is skipped while (or right after) a pass plays. */
    sting(kind = "pass") {
      if (!S.sound || !init() || ctx.state !== "running") return;
      if (!S.music || VOL.music <= 0.01) { if (kind !== "finished") A.sfx("fanfare"); return; } /* music off / game-day mode: no Suno sting */
      const fin = kind === "finished", key = fin ? "ending" : "fanfare-pass"; // user picked the 8 s cut for passes AND certificates
      if (fin && ((curSting && curSting.kind !== "finished") || Date.now() - (A.lastPassAt || 0) < 9000)) return;
      if (!fin) A.lastPassAt = Date.now();
      if (curSting) stopSting(0.15);
      const tok = A.stingTok = (A.stingTok || 0) + 1;
      loadTrack(key).then(buf => { if (tok !== A.stingTok || (fin && Date.now() - (A.lastPassAt || 0) < 9000)) return;
        const t = ctx.currentTime, src = ctx.createBufferSource(), g = ctx.createGain(); src.buffer = buf; g.gain.value = fin ? 0.55 : 0.6; src.connect(g); g.connect(stingBus || master);
        const low = fin ? 0.25 : 0.06, d = duckGain.gain; d.cancelScheduledValues(t); d.setValueAtTime(d.value, t); d.linearRampToValueAtTime(low, t + 0.25);
        d.setValueAtTime(low, t + buf.duration - 0.6); d.linearRampToValueAtTime(1, t + buf.duration + 1.2);
        const me = curSting = { src, g, kind }; src.onended = () => { if (curSting === me) curSting = null; };
        src.start(t); A.stingPlays = (A.stingPlays || 0) + 1; A.lastSting = kind; }).catch(() => { if (!fin) A.sfx("fanfare"); });
    },
    stopSting(sec = 0.4) { if (ctx) stopSting(sec); },
    /* mixer: values 0..1 per bus (80 % = original mix). Applied with a short glide so slider drags are click-free. */
    setVolumes(v = {}) { Object.keys(VOL).forEach(k => { if (typeof v[k] === "number" && isFinite(v[k])) VOL[k] = Math.max(0, Math.min(1, v[k])); }); applyVol(); },
    volumes() { return Object.assign({}, VOL); },
    busGains() { if (!ctx) return null; const g = n => n ? +n.gain.value.toFixed(4) : null; return { master: g(master), music: g(musicBus), synth: g(synthBus), sting: g(stingBus), game: g(dry.game), quiz: g(dry.quiz), ui: g(dry.ui) }; },
    /* slider preview: a short representative sound on that bus */
    preview(kind) { if (!S.sound || !init() || ctx.state !== "running") return; const now = performance.now(); if (now - (A._pv || 0) < 130) return; A._pv = now;
      if (kind === "music") { if (cur || timer) return; const P = MUSIC_PATTERNS.chill, sv = musicGain.gain.value; musicGain.gain.setValueAtTime(0.14, ctx.currentTime); pad(P.chords[0].pad, ctx.currentTime + 0.01, 0.9, P, 1); if (!timer) musicGain.gain.setValueAtTime(sv || 0.14, ctx.currentTime + 1.2); return; }
      if (kind === "quiz") return A.sfx("correct", { streak: 1 }); if (kind === "ui") return A.sfx("click"); if (kind === "game") return A.sfx("snap");
      A.sfx("snap"); setTimeout(() => A.sfx("btn"), 60); },
    loop(kind, x) { if (!S.sound || !init() || ctx.state !== "running") return { set() {}, stop() {}, dead: true }; return makeLoop(kind, x) || { set() {}, stop() {}, dead: true }; },
    stopLoops() { [...loops].forEach(l => l.stop(0.08)); },
    loopCount() { return loops.size; },
    stingState() { return { playing: !!curSting, kind: curSting ? curSting.kind : null, plays: A.stingPlays || 0, last: A.lastSting || null }; },
    stopMusic() { track = null; pending = null; fadeOutFile(); stopSynth(); },
    musicState() { return { track, file: cur ? cur.key : null, synth: !!timer, ctx: ctx ? ctx.state : "none" }; },
    resetStreak() { streak = 0; },
    /* sfx("correct", { streak }) uses the caller's streak (1 = first correct); otherwise an internal counter that resets on "wrong". */
    sfx(name, opts = {}) {
      if (name === "correct") streak = opts.streak || streak + 1; else if (name === "wrong") streak = 0;
      if (!S.sound || !init() || ctx.state !== "running") return; const t = ctx.currentTime; if (DUCK[name]) Array.isArray(DUCK[name]) ? duck(DUCK[name][0], DUCK[name][1]) : duck(DUCK[name]);
      bus = catOf(name, opts); A.lastBus = bus; A.sfxLog && A.sfxLog.push([name, performance.now(), bus]);
      HUM = opts.exact ? 1 : Math.pow(2, rnd(name === "correct" ? -8 : -22, name === "correct" ? 8 : 22) / 1200); try { return A._sfxBody(name, opts, t); } finally { HUM = 1; } },
    _sfxBody(name, opts, t) {
      if (bus === "game" && gameSfx(name, opts, t + 0.002)) return;
      if (["click", "btn", "tap", "toggle", "page", "whoosh"].includes(name)) { if (!S.ui) return; const now = performance.now(); if ((name === "page" || name === "whoosh") && now - lastUi < 120) return; if (name === "page" || name === "whoosh") lastUi = now; if (name === "click" || name === "btn" || name === "tap") { const since = now - (lastUiClick || 0); if (since < 40) return; lastUiClick = now; } return clickSfx(name); }
      switch (name) {
        case "correct": { const L = SFX_PARAMS.streakSemis; correctSfx(L[Math.min(Math.max(streak, 1), L.length) - 1]); break; }
        case "wrong": buzzerSfx(); break;
        case "chime": { /* badge: two bright bell partials + shimmer tail */
          [[88, 0], [95, 0.07]].forEach(([n, d]) => { tone(n, t + d, 0.5, "sine", 0.09); tone(n + 12, t + d, 0.25, "sine", 0.03); tone(n + 19.02, t + d, 0.18, "triangle", 0.015); });
          noise(t + 0.06, 0.4, 0.025, ["highpass", 7000]); break; }
        case "gearclick": { /* new gear: latch click + ratchet + sparkle */
          noise(t, 0.008, 0.4, ["bandpass", 3600, 5], out(-0.1, 0.3)); noise(t + 0.03, 0.01, 0.3, ["bandpass", 2400, 4], out(0.1, 0.3));
          for (let i = 0; i < 4; i++) noise(t + 0.07 + i * 0.03, 0.006, 0.12, ["bandpass", 4200 + i * 300, 6]);
          synth(84, t + 0.16, 0.12, 0.05, ["triangle"], [-4, 4], [2500, 7000, 3000], -0.2); synth(91, t + 0.22, 0.3, 0.045, ["triangle"], [-4, 4], [2500, 7000, 3000], 0.2);
          for (let i = 0; i < 6; i++) tone(rnd(4500, 7500), t + 0.24 + i * 0.035, 0.06, "sine", 0.02); break; }
        case "rankstamp": { /* rank badge lands: sub thump + dust + metal ring */
          const k = tone(90, t, 0.45, "sine", 0.6); k.frequency.exponentialRampToValueAtTime(34, t + 0.35); noise(t, 0.25, 0.35, ["lowpass", 900], out(0, 0.6)); noise(t + 0.01, 0.06, 0.18, ["highpass", 3500]);
          tone(opts.ring || 1180, t + 0.01, 0.9, "sine", 0.035); tone((opts.ring || 1180) * 2.76, t + 0.01, 0.5, "sine", 0.012); break; }
        case "rankfan": { /* rank fanfare: brass rise, root by tier */
          const r = opts.root || 60; [[0, 0], [4, 0.11], [7, 0.22], [12, 0.33]].forEach(([d, at], i) => synth(r + d, t + at, i === 3 ? 0.9 : 0.16, 0.085, ["sawtooth"], [-8, 8], [700, 4200, 1500], (i - 1.5) * 0.18));
          [r - 12, r - 5, r].forEach(n => synth(n, t + 0.33, 1.0, 0.04, ["sawtooth"], [-10, 10], [400, 2200, 800])); noise(t + 0.33, 0.9, 0.03, ["highpass", 6500]); break; }
        case "wahwah": wahwah(); break;
        case "streak3": case "streak5": case "streak7": case "streak10": sting(+name.slice(6)); break;
        case "tick": tone(96, t, 0.03, "square", 0.08); break;
        case "jump": { const o = tone(400, t, 0.18, "square", 0.18); o.frequency.exponentialRampToValueAtTime(900, t + 0.15); break; }
        case "splash": noise(t, 0.5, 0.35, ["highpass", 400]); tone(40, t, 0.4, "sine", 0.3); break;
        case "freeze": [84, 88, 91, 96].forEach((n, i) => tone(n, t + i * 0.06, 0.4, "sine", 0.12)); break;
        case "levelup": [64, 67, 71, 76, 79, 83, 88].forEach((n, i) => tone(n, t + i * 0.07, 0.15, "square", 0.16)); break;
        case "fanfare": [[52, 55, 59], [48, 52, 55], [50, 54, 57], [52, 56, 59]].forEach((c, i) => c.forEach(n => tone(n + 12, t + i * 0.18, i === 3 ? 0.8 : 0.2, "sawtooth", 0.08))); break;
        case "confetti": for (let i = 0; i < 6; i++) tone(84 + Math.random() * 12, t + i * 0.04, 0.08, "triangle", 0.12); noise(t, 0.2, 0.12, ["highpass", 4000]); break;
        case "firework": tone(300, t, 0.5, "sine", 0.1).frequency.exponentialRampToValueAtTime(1200, t + 0.45); noise(t + 0.5, 0.6, 0.35, ["highpass", 800]); for (let i = 0; i < 8; i++) noise(t + 0.6 + Math.random() * 0.5, 0.04, 0.2, ["highpass", 5000]); break;
        case "unlock": unlockSfx(); break;
        case "zonechime": { /* zone colors in: soft rising bell arpeggio (sine + octave partial, wide stereo, reverb) then a high shimmer */
          [72, 76, 79, 84, 88].forEach((n, i) => { const at = t + i * 0.11, g = out((i - 2) * 0.22, 0.9); tone(n, at, 1.1, "sine", 0.11, g); tone(n + 12, at, 0.5, "sine", 0.025, g); tone(n + 19.02, at, 0.25, "triangle", 0.012, g); });
          for (let i = 0; i < 16; i++) { const at = t + 0.5 + i * 0.045, g = out(rnd(-0.7, 0.7), 1); tone(rnd(2600, 4200), at, 0.22, "sine", rnd(0.008, 0.02), g); }
          noise(t + 0.45, 0.9, 0.03, ["highpass", 7000], out(0, 1)); break; }
        case "stamp": tone(45, t, 0.25, "sine", 0.6); noise(t, 0.12, 0.3, ["highpass", 200]); break;
        case "land": { const o = tone(rnd(150, 170), t, 0.09, "sine", 0.22); o.frequency.exponentialRampToValueAtTime(70, t + 0.08); noise(t, 0.05, 0.08, ["lowpass", 1400], out(0, 0.1)); break; }
        case "hop": { const o = tone(rnd(480, 540), t, 0.12, "triangle", 0.2); o.frequency.exponentialRampToValueAtTime(1000, t + 0.1); break; }
        case "flame": noise(t, 0.6, 0.25, ["highpass", 300]); tone(55, t, 0.5, "sawtooth", 0.08); break;
      }
    },

    /* splash intro one-shots (game bus, master + game slider). File first; synth fallback.
       Returns false if the AudioContext isn't running (typical on a cold iOS launch). Never throws. */
    playSplash(name, opts = {}) {
      try {
        if (!S.sound || !init()) return false;
        if (ctx.state !== "running") { try { ctx.resume(); } catch (e) {} }
        if (ctx.state !== "running") return false;
        const t = ctx.currentTime + 0.005, dest = dry.game || sfxGain, g0 = (opts.gain == null ? 0.9 : opts.gain);
        const buf = buffers[name];
        if (buf) { const src = ctx.createBufferSource(), g = ctx.createGain(); src.buffer = buf; g.gain.value = g0; src.connect(g); g.connect(dest); src.start(t); return true; }
        /* same-tick synth fallback — do not also fire the file later (would double) */
        if (name === "splash-whoosh") {
          noise(t, 0.45, 0.28, ["bandpass", 2400, 0.9], dest, true);
          noise(t, 0.5, 0.2, ["lowpass", 400], dest, true);
          const o = tone(70, t, 0.4, "sine", 0.12, dest); try { o.frequency.exponentialRampToValueAtTime(48, t + 0.35); } catch (e) {}
        } else if (name === "splash-rattle") {
          const mot = tone(43, t, 0.5, "sawtooth", 0.08, dest); try { mot.frequency.exponentialRampToValueAtTime(50, t + 0.45); } catch (e) {}
          for (let i = 0; i < 11; i++) { const at = t + 0.02 + i * 0.04; noise(at, 0.03, 0.22, ["highpass", 2500], dest, true); tone(72 + i, at, 0.05, "square", 0.06, dest); tone(1800 + i * 80, at, 0.04, "sine", 0.05, dest); }
        } else {
          noise(t, 0.09, 0.18, ["bandpass", 1400, 1], dest, true);
          const k = tone(80, t + 0.09, 0.35, "sine", 0.7, dest); try { k.frequency.exponentialRampToValueAtTime(38, t + 0.3); } catch (e) {}
          noise(t + 0.09, 0.05, 0.45, ["highpass", 3500], dest, true);
          noise(t + 0.09, 0.18, 0.22, ["lowpass", 800], dest, true);
          [820, 1240, 1860, 3180].forEach((f, i) => tone(f, t + 0.09, 0.28 - i * 0.04, "sine", 0.04, dest));
        }
        loadTrack(name).catch(() => {});
        return true;
      } catch (e) { return false; }
    },
    preloadSplash() { if (!init()) return; ["splash-whoosh", "splash-rattle", "splash-impact", "menu"].forEach(k => loadTrack(k).catch(() => {})); },
    ctxState() { return ctx ? ctx.state : "none"; },
    setMusicScale(s) { musicScale = Math.max(0, Math.min(1, +s || 0)); applyVol(); },
    musicScale() { return musicScale; },
    deferMusic(on) {
      /* Only flip the gate. The caller starts music once (avoids a restart when finish() also calls playMusic). */
      musicDeferred = !!on;
    },
    musicDebug() {
      const html = [...document.querySelectorAll("audio")].map(a => ({ src: (a.currentSrc || a.src || "").slice(0, 96), paused: a.paused, muted: a.muted }));
      return { track, curKey: cur && cur.key, pending, deferred: musicDeferred, ctx: ctx && ctx.state, hasCur: !!cur, hasTimer: !!timer, musicStarts, htmlCount: html.length, html, scale: musicScale };
    },
    /* Trailer riser in C (root of the menu / chill theme). Lives on master so a soft question-screen scale doesn't duck the climax. Respects mute + music-off / game-day. */
    startRiser(opts = {}) {
      try {
        if (!S.sound || !S.music || !init()) return false;
        if (ctx.state !== "running") { try { ctx.resume(); } catch (e) {} }
        if (ctx.state !== "running") return false;
        if (riser) { try { riser.g.gain.cancelScheduledValues(ctx.currentTime); riser.g.gain.setValueAtTime(0.0001, ctx.currentTime); } catch (e) {} riser = null; }
        const t = ctx.currentTime, climb = opts.climb || 1.75;
        const C2 = 65.406, C3 = 130.813, C4 = 261.626;
        const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.2, t + 0.3); g.gain.linearRampToValueAtTime(0.4, t + climb);
        g.connect(master);
        const mk = (type, f0, f1, gn) => { const o = ctx.createOscillator(), v = ctx.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + climb); v.gain.value = gn; o.connect(v); v.connect(g); o.start(t); return o; };
        const d1 = mk("sine", C2, C2, 0.45), d0 = mk("sine", C2 / 2, C2 / 2, 0.35);
        const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.setValueAtTime(400, t); lp.frequency.exponentialRampToValueAtTime(5200, t + climb); lp.Q.value = 0.8;
        const r1 = ctx.createOscillator(), r2 = ctx.createOscillator(), rg = ctx.createGain();
        r1.type = "sawtooth"; r2.type = "sawtooth"; r2.detune.value = 7;
        r1.frequency.setValueAtTime(C2, t); r1.frequency.exponentialRampToValueAtTime(C4, t + climb);
        r2.frequency.setValueAtTime(C3, t); r2.frequency.exponentialRampToValueAtTime(C4 * 2, t + climb);
        rg.gain.value = 0.16; r1.connect(lp); r2.connect(lp); lp.connect(rg); rg.connect(g); r1.start(t); r2.start(t);
        const ns = ctx.createBufferSource(); ns.buffer = noiseBuf; ns.loop = true;
        const nf = ctx.createBiquadFilter(); nf.type = "bandpass"; nf.frequency.setValueAtTime(200, t); nf.frequency.exponentialRampToValueAtTime(3200, t + climb); nf.Q.value = 0.9;
        const ng = ctx.createGain(); ng.gain.setValueAtTime(0.04, t); ng.gain.linearRampToValueAtTime(0.15, t + climb);
        ns.connect(nf); nf.connect(ng); ng.connect(g); ns.start(t);
        riser = { g, osc: [d0, d1, r1, r2, ns], t0: t, climb };
        return true;
      } catch (e) { return false; }
    },
    resolveRiser() {
      try {
        if (!riser || !ctx || ctx.state !== "running") return false;
        const t = ctx.currentTime, g = riser.g;
        const C2 = 65.406, C3 = 130.813, C4 = 261.626, G3 = 196, Eb3 = 155.563;
        try { g.gain.cancelScheduledValues(t); const nowG = Math.max(g.gain.value, 0.0001); g.gain.setValueAtTime(nowG, t); g.gain.linearRampToValueAtTime(nowG * 1.12, t + 0.1); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.05); } catch (e) {}
        [C2, C3, G3, C4, Eb3].forEach((f, i) => {
          const o = ctx.createOscillator(), v = ctx.createGain(); o.type = i < 2 ? "sine" : "triangle"; o.frequency.value = f;
          const gn = [0.5, 0.35, 0.22, 0.18, 0.08][i];
          v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(gn, t + 0.03); v.gain.exponentialRampToValueAtTime(0.0001, t + 0.95);
          o.connect(v); v.connect(g); o.start(t); o.stop(t + 1.0);
        });
        riser.osc.forEach(o => { try { o.stop(t + 0.22); } catch (e) {} });
        riser = null; return true;
      } catch (e) { return false; }
    },
  };
  window.Sound = A;
  /* iOS Safari / PWA: pointerdown alone often fails to unlock Web Audio. Also listen
     on touchend/click (still in the gesture) and resume when returning to the tab. */
  ["pointerdown", "pointerup", "touchstart", "touchend", "click", "keydown"].forEach(ev => {
    document.addEventListener(ev, () => A.unlock(), { capture: true, passive: true });
  });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) A.unlock(); });
  window.addEventListener("pageshow", () => A.unlock());
})();
