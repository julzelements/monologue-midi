/**
 * Prettification utilities for Korg Monologue parameters
 * Converts between raw numeric values and human-readable string labels
 */

// Lookup Tables
export const VCO1_WAVE_LABELS = ["SQR", "TRI", "SAW"] as const;
export const VCO2_WAVE_LABELS = ["NOISE", "TRI", "SAW"] as const;
export const SYNC_RING_LABELS = ["RING", "OFF", "SYNC"] as const;
export const OCTAVE_LABELS = ["16'", "8'", "4'", "2'"] as const;
export const EG_TYPE_LABELS = ["GATE", "A/G/D", "A/D"] as const;
export const EG_TARGET_LABELS = ["CUTOFF", "PITCH 2", "PITCH"] as const;
export const LFO_WAVE_LABELS = VCO1_WAVE_LABELS;
export const LFO_MODE_LABELS = ["1-SHOT", "SLOW", "FAST"] as const;
export const LFO_TARGET_LABELS = ["CUTOFF", "SHAPE", "PITCH"] as const;
export const PERCENTAGE_LABELS = ["0%", "33%", "66%", "100%"] as const;
export const STEP_RESOLUTION_LABELS = ["1/16", "1/8", "1/4", "1/2", "1/1"] as const;
export const BOOLEAN_LABELS = ["OFF", "ON"] as const;

export const SLIDER_ASSIGN_LABELS: Record<number, string> = {
  13: "VCO 1 PITCH",
  14: "VCO 1 SHAPE",
  17: "VCO 2 PITCH",
  18: "VCO 2 SHAPE",
  21: "VCO 1 LEVEL",
  22: "VCO 2 LEVEL",
  23: "CUTOFF",
  24: "RESONANCE",
  26: "ATTACK",
  27: "DECAY",
  28: "EG INT",
  31: "LFO RATE",
  32: "LFO INT",
  40: "PORTAMENT",
  56: "PITCH BEND",
  57: "GATE TIME",
};

export const MOTION_PARAM_LABELS: Record<number, string> = {
  0: "None",
  13: "VCO 1 PITCH",
  14: "VCO 1 SHAPE",
  15: "VCO 1 OCTAVE",
  16: "VCO 1 WAVE",
  17: "VCO 2 PITCH",
  18: "VCO 2 SHAPE",
  19: "VCO 2 OCTAVE",
  20: "VCO 2 WAVE",
  21: "VCO 1 LEVEL",
  22: "VCO 2 LEVEL",
  23: "CUTOFF",
  24: "RESONANCE",
  25: "SYNC/RING",
  26: "ATTACK",
  27: "DECAY",
  28: "EG INT",
  29: "EG TYPE",
  30: "EG TARGET",
  31: "LFO RATE",
  32: "LFO INT",
  33: "LFO TARGET",
  34: "LFO TYPE",
  35: "LFO MODE",
  37: "DRIVE",
  40: "PORTAMENT",
  56: "PITCH BEND",
  57: "GATE TIME",
};

// Format functions (number → string)
export const formatVco1Wave = (v: number) =>
  VCO1_WAVE_LABELS[v] ||
  (() => {
    throw new Error(`Invalid VCO1 wave: ${v}`);
  })();
export const formatVco2Wave = (v: number) =>
  VCO2_WAVE_LABELS[v] ||
  (() => {
    throw new Error(`Invalid VCO2 wave: ${v}`);
  })();
export const formatSyncRing = (v: number) =>
  SYNC_RING_LABELS[v] ||
  (() => {
    throw new Error(`Invalid SYNC/RING: ${v}`);
  })();
export const formatOctave = (v: number) =>
  OCTAVE_LABELS[v] ||
  (() => {
    throw new Error(`Invalid octave: ${v}`);
  })();
export const formatEgType = (v: number) =>
  EG_TYPE_LABELS[v] ||
  (() => {
    throw new Error(`Invalid EG type: ${v}`);
  })();
export const formatEgTarget = (v: number) =>
  EG_TARGET_LABELS[v] ||
  (() => {
    throw new Error(`Invalid EG target: ${v}`);
  })();
export const formatLfoWave = (v: number) => formatVco1Wave(v);
export const formatLfoMode = (v: number) =>
  LFO_MODE_LABELS[v] ||
  (() => {
    throw new Error(`Invalid LFO mode: ${v}`);
  })();
export const formatLfoTarget = (v: number) =>
  LFO_TARGET_LABELS[v] ||
  (() => {
    throw new Error(`Invalid LFO target: ${v}`);
  })();
export const formatPercentage = (v: number) =>
  PERCENTAGE_LABELS[v] ||
  (() => {
    throw new Error(`Invalid percentage: ${v}`);
  })();
export const formatStepResolution = (v: number) =>
  STEP_RESOLUTION_LABELS[v] ||
  (() => {
    throw new Error(`Invalid resolution: ${v}`);
  })();
export const formatBoolean = (v: number) =>
  BOOLEAN_LABELS[v] ||
  (() => {
    throw new Error(`Invalid boolean: ${v}`);
  })();
export const formatSliderAssign = (v: number) =>
  SLIDER_ASSIGN_LABELS[v] ||
  (() => {
    throw new Error(`Invalid slider assign: ${v}`);
  })();
export const formatMotionParam = (v: number) =>
  MOTION_PARAM_LABELS[v] ||
  (() => {
    throw new Error(`Invalid motion param: ${v}`);
  })();

// Parse functions (string → number)
export const parseVco1Wave = (l: string) => {
  const i = VCO1_WAVE_LABELS.indexOf(l as any);
  if (i === -1) throw new Error(`Invalid label: ${l}`);
  return i;
};
export const parseVco2Wave = (l: string) => {
  const i = VCO2_WAVE_LABELS.indexOf(l as any);
  if (i === -1) throw new Error(`Invalid label: ${l}`);
  return i;
};
export const parseSyncRing = (l: string) => {
  const i = SYNC_RING_LABELS.indexOf(l as any);
  if (i === -1) throw new Error(`Invalid label: ${l}`);
  return i;
};
export const parseOctave = (l: string) => {
  const i = OCTAVE_LABELS.indexOf(l as any);
  if (i === -1) throw new Error(`Invalid label: ${l}`);
  return i;
};
export const parseEgType = (l: string) => {
  const i = EG_TYPE_LABELS.indexOf(l as any);
  if (i === -1) throw new Error(`Invalid label: ${l}`);
  return i;
};
export const parseEgTarget = (l: string) => {
  const i = EG_TARGET_LABELS.indexOf(l as any);
  if (i === -1) throw new Error(`Invalid label: ${l}`);
  return i;
};
export const parseLfoWave = (l: string) => parseVco1Wave(l);
export const parseLfoMode = (l: string) => {
  const i = LFO_MODE_LABELS.indexOf(l as any);
  if (i === -1) throw new Error(`Invalid label: ${l}`);
  return i;
};
export const parseLfoTarget = (l: string) => {
  const i = LFO_TARGET_LABELS.indexOf(l as any);
  if (i === -1) throw new Error(`Invalid label: ${l}`);
  return i;
};
export const parsePercentage = (l: string) => {
  const i = PERCENTAGE_LABELS.indexOf(l as any);
  if (i === -1) throw new Error(`Invalid label: ${l}`);
  return i;
};
export const parseStepResolution = (l: string) => {
  const i = STEP_RESOLUTION_LABELS.indexOf(l as any);
  if (i === -1) throw new Error(`Invalid label: ${l}`);
  return i;
};
export const parseBoolean = (l: string) => {
  const i = BOOLEAN_LABELS.indexOf(l as any);
  if (i === -1) throw new Error(`Invalid label: ${l}`);
  return i;
};
export const parseSliderAssign = (l: string) => {
  const e = Object.entries(SLIDER_ASSIGN_LABELS).find(([, v]) => v === l);
  if (!e) throw new Error(`Invalid label: ${l}`);
  return parseInt(e[0], 10);
};
export const parseMotionParam = (l: string) => {
  const e = Object.entries(MOTION_PARAM_LABELS).find(([, v]) => v === l);
  if (!e) throw new Error(`Invalid label: ${l}`);
  return parseInt(e[0], 10);
};
