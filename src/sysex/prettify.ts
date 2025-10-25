// Lookup tables for converting between numeric values and human-readable labels

import { MonologueParameters } from "./decode";

const VCO1_WAVE_LABELS = ["SQR", "TRI", "SAW"] as const;
const VCO2_WAVE_LABELS = ["NOISE", "TRI", "SAW"] as const;
const SYNC_RING_LABELS = ["RING", "OFF", "SYNC"] as const;
const OCTAVE_LABELS = ["16'", "8'", "4'", "2'"] as const;
const KEYBOARD_OCTAVE_LABELS = ["-2", "-1", "0", "+1", "+2"] as const;
const EG_TYPE_LABELS = ["GATE", "A/G/D", "A/D"] as const;
const EG_TARGET_LABELS = ["CUTOFF", "PITCH 2", "PITCH"] as const;
const LFO_MODE_LABELS = ["1-SHOT", "SLOW", "FAST"] as const;
const LFO_TARGET_LABELS = ["CUTOFF", "SHAPE", "PITCH"] as const;
const PERCENTAGE_LABELS = ["0%", "33%", "66%", "100%"] as const;
const STEP_RESOLUTION_LABELS = ["1/16", "1/8", "1/4", "1/2", "1/1"] as const;
const BOOLEAN_LABELS = ["OFF", "ON"] as const;

// Slider Assign labels mapped by ID
const SLIDER_ASSIGN_LABELS: Record<number, string> = {
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

// Motion Parameter labels mapped by ID (includes all valid motion parameter IDs)
const MOTION_PARAM_LABELS: Record<number, string> = {
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

export const prettyPanelSettings = (patch: MonologueParameters) => {
  return {
    drive: {
      ...patch.panelSettings.drive,
      formatted: patch.panelSettings.drive.value / 1023,
    },
    keyboardOctave: {
      ...patch.panelSettings.keyboardOctave,
      formatted: KEYBOARD_OCTAVE_LABELS[patch.panelSettings.keyboardOctave.value],
    },
    syncRing: {
      ...patch.panelSettings.syncRing,
      formatted: SYNC_RING_LABELS[patch.panelSettings.syncRing.value],
    },
    seqTrig: {
      ...patch.panelSettings.seqTrig,
      formatted: BOOLEAN_LABELS[patch.panelSettings.seqTrig.value],
    },
    oscilators: {
      vco1: {
        wave: {
          ...patch.panelSettings.oscilators.vco1.wave,
          formatted: VCO1_WAVE_LABELS[patch.panelSettings.oscilators.vco1.wave.value],
        },
        shape: {
          ...patch.panelSettings.oscilators.vco1.shape,
          formatted: patch.panelSettings.oscilators.vco1.shape.value / 1023,
        },
        level: {
          ...patch.panelSettings.oscilators.vco1.level,
          formatted: patch.panelSettings.oscilators.vco1.level.value / 1023,
        },
        pitch: {
          ...patch.panelSettings.oscilators.vco1.pitch,
          formatted: patch.panelSettings.oscilators.vco1.pitch.value / 1023,
        },
        octave: {
          ...patch.panelSettings.oscilators.vco1.octave,
          formatted: OCTAVE_LABELS[patch.panelSettings.oscilators.vco1.octave.value],
        },
      },
      vco2: {
        wave: {
          ...patch.panelSettings.oscilators.vco2.wave,
          formatted: VCO2_WAVE_LABELS[patch.panelSettings.oscilators.vco2.wave.value],
        },
        shape: {
          ...patch.panelSettings.oscilators.vco2.shape,
          formatted: patch.panelSettings.oscilators.vco2.shape.value / 1023,
        },
        level: {
          ...patch.panelSettings.oscilators.vco2.level,
          formatted: patch.panelSettings.oscilators.vco2.level.value / 1023,
        },
        pitch: {
          ...patch.panelSettings.oscilators.vco2.pitch,
          formatted: patch.panelSettings.oscilators.vco2.pitch.value / 1023,
        },
        octave: {
          ...patch.panelSettings.oscilators.vco2.octave,
          formatted: OCTAVE_LABELS[patch.panelSettings.oscilators.vco2.octave.value],
        },
      },
    },
    filter: {
      cutoff: {
        ...patch.panelSettings.filter.cutoff,
        formatted: patch.panelSettings.filter.cutoff.value / 1023,
      },
      resonance: {
        ...patch.panelSettings.filter.resonance,
        formatted: patch.panelSettings.filter.resonance.value / 1023,
      },
    },
    envelope: {
      type: {
        ...patch.panelSettings.envelope.type,
        formatted: EG_TYPE_LABELS[patch.panelSettings.envelope.type.value],
      },
      attack: {
        ...patch.panelSettings.envelope.attack,
        formatted: patch.panelSettings.envelope.attack.value / 1023,
      },
      decay: {
        ...patch.panelSettings.envelope.decay,
        formatted: patch.panelSettings.envelope.decay.value / 1023,
      },
      intensity: {
        ...patch.panelSettings.envelope.intensity,
        formatted: patch.panelSettings.envelope.intensity.value / 1023,
      },
      target: {
        ...patch.panelSettings.envelope.target,
        formatted: EG_TARGET_LABELS[patch.panelSettings.envelope.target.value],
      },
    },
    lfo: {
      wave: {
        ...patch.panelSettings.lfo.wave,
        formatted: PERCENTAGE_LABELS[patch.panelSettings.lfo.wave.value],
      },
      mode: {
        ...patch.panelSettings.lfo.mode,
        formatted: LFO_MODE_LABELS[patch.panelSettings.lfo.mode.value],
      },
      rate: {
        ...patch.panelSettings.lfo.rate,
        formatted: patch.panelSettings.lfo.rate.value / 1023,
      },
      intensity: {
        ...patch.panelSettings.lfo.intensity,
        formatted: patch.panelSettings.lfo.intensity.value / 1023,
      },
      target: {
        ...patch.panelSettings.lfo.target,
        formatted: LFO_TARGET_LABELS[patch.panelSettings.lfo.target.value],
      },
    },
  };
};

// Format functions: numeric value -> pretty string
export function formatVco1Wave(value: number): string {
  return VCO1_WAVE_LABELS[value] ?? `UNKNOWN(${value})`;
}

export function formatVco2Wave(value: number): string {
  return VCO2_WAVE_LABELS[value] ?? `UNKNOWN(${value})`;
}

export function formatSyncRing(value: number): string {
  return SYNC_RING_LABELS[value] ?? `UNKNOWN(${value})`;
}

export function formatOctave(value: number): string {
  return OCTAVE_LABELS[value] ?? `UNKNOWN(${value})`;
}

export function formatEgType(value: number): string {
  return EG_TYPE_LABELS[value] ?? `UNKNOWN(${value})`;
}

export function formatEgTarget(value: number): string {
  return EG_TARGET_LABELS[value] ?? `UNKNOWN(${value})`;
}

export function formatLfoMode(value: number): string {
  return LFO_MODE_LABELS[value] ?? `UNKNOWN(${value})`;
}

export function formatLfoTarget(value: number): string {
  return LFO_TARGET_LABELS[value] ?? `UNKNOWN(${value})`;
}

export function formatPercentage(value: number): string {
  return PERCENTAGE_LABELS[value] ?? `UNKNOWN(${value})`;
}

export function formatSliderAssign(value: number): string {
  return SLIDER_ASSIGN_LABELS[value] ?? `UNKNOWN(${value})`;
}

export function formatMotionParam(value: number): string {
  return MOTION_PARAM_LABELS[value] ?? `UNKNOWN(${value})`;
}

export function formatStepResolution(value: number): string {
  return STEP_RESOLUTION_LABELS[value] ?? `UNKNOWN(${value})`;
}

export function formatBoolean(value: number): string {
  return BOOLEAN_LABELS[value] ?? `UNKNOWN(${value})`;
}

// Parse functions: pretty string -> numeric value
export function parseVco1Wave(label: string): number {
  const index = VCO1_WAVE_LABELS.indexOf(label as any);
  if (index === -1) throw new Error(`Unknown VCO1 wave: ${label}`);
  return index;
}

export function parseVco2Wave(label: string): number {
  const index = VCO2_WAVE_LABELS.indexOf(label as any);
  if (index === -1) throw new Error(`Unknown VCO2 wave: ${label}`);
  return index;
}

export function parseSyncRing(label: string): number {
  const index = SYNC_RING_LABELS.indexOf(label as any);
  if (index === -1) throw new Error(`Unknown SYNC/RING mode: ${label}`);
  return index;
}

export function parseOctave(label: string): number {
  const index = OCTAVE_LABELS.indexOf(label as any);
  if (index === -1) throw new Error(`Unknown octave: ${label}`);
  return index;
}

export function parseEgType(label: string): number {
  const index = EG_TYPE_LABELS.indexOf(label as any);
  if (index === -1) throw new Error(`Unknown EG type: ${label}`);
  return index;
}

export function parseEgTarget(label: string): number {
  const index = EG_TARGET_LABELS.indexOf(label as any);
  if (index === -1) throw new Error(`Unknown EG target: ${label}`);
  return index;
}

export function parseLfoMode(label: string): number {
  const index = LFO_MODE_LABELS.indexOf(label as any);
  if (index === -1) throw new Error(`Unknown LFO mode: ${label}`);
  return index;
}

export function parseLfoTarget(label: string): number {
  const index = LFO_TARGET_LABELS.indexOf(label as any);
  if (index === -1) throw new Error(`Unknown LFO target: ${label}`);
  return index;
}

export function parsePercentage(label: string): number {
  const index = PERCENTAGE_LABELS.indexOf(label as any);
  if (index === -1) throw new Error(`Unknown percentage: ${label}`);
  return index;
}

export function parseSliderAssign(label: string): number {
  const entry = Object.entries(SLIDER_ASSIGN_LABELS).find(([_, v]) => v === label);
  if (!entry) throw new Error(`Unknown slider assign: ${label}`);
  return parseInt(entry[0]);
}

export function parseMotionParam(label: string): number {
  const entry = Object.entries(MOTION_PARAM_LABELS).find(([_, v]) => v === label);
  if (!entry) throw new Error(`Unknown motion parameter: ${label}`);
  return parseInt(entry[0]);
}

export function parseStepResolution(label: string): number {
  const index = STEP_RESOLUTION_LABELS.indexOf(label as any);
  if (index === -1) throw new Error(`Unknown step resolution: ${label}`);
  return index;
}

export function parseBoolean(label: string): number {
  const index = BOOLEAN_LABELS.indexOf(label as any);
  if (index === -1) throw new Error(`Unknown boolean: ${label}`);
  return index;
}

// NOTE: Portamento time is super strange
// 0-72 maps to 0% to 100%. But some numbers, (like 49) are skipped...
