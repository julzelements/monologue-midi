// Lookup tables for converting between numeric values and human-readable labels

import type { MonologueParameters } from "../types/parameters";

export const VCO1_WAVE_LABELS = ["SQR", "TRI", "SAW"] as const;
export const VCO2_WAVE_LABELS = ["NOISE", "TRI", "SAW"] as const;
export const LFO_TYPE_LABELS = ["SQR", "TRI", "SAW"] as const;
export const SYNC_RING_LABELS = ["RING", "OFF", "SYNC"] as const;
export const OCTAVE_LABELS = ["16'", "8'", "4'", "2'"] as const;
export const KEYBOARD_OCTAVE_LABELS = ["-2", "-1", "0", "+1", "+2"] as const;
export const EG_TYPE_LABELS = ["GATE", "A/G/D", "A/D"] as const;
export const EG_TARGET_LABELS = ["CUTOFF", "PITCH 2", "PITCH"] as const;
export const LFO_MODE_LABELS = ["1-SHOT", "SLOW", "FAST"] as const;
export const LFO_TARGET_LABELS = ["CUTOFF", "SHAPE", "PITCH"] as const;
export const PERCENTAGE_LABELS = ["0%", "33%", "66%", "100%"] as const;
export const STEP_RESOLUTION_LABELS = ["1/16", "1/8", "1/4", "1/2", "1/1"] as const;
export const BOOLEAN_LABELS = ["OFF", "ON"] as const;

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
      formatted: patch.panelSettings.drive.value,
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
          formatted: patch.panelSettings.oscilators.vco1.shape.value,
        },
        level: {
          ...patch.panelSettings.oscilators.vco1.level,
          formatted: patch.panelSettings.oscilators.vco1.level.value,
        },
        pitch: {
          ...patch.panelSettings.oscilators.vco1.pitch,
          formatted: vcoPitchToCents(patch.panelSettings.oscilators.vco1.pitch.value),
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
          formatted: patch.panelSettings.oscilators.vco2.shape.value,
        },
        level: {
          ...patch.panelSettings.oscilators.vco2.level,
          formatted: patch.panelSettings.oscilators.vco2.level.value,
        },
        pitch: {
          ...patch.panelSettings.oscilators.vco2.pitch,
          formatted: vcoPitchToCents(patch.panelSettings.oscilators.vco2.pitch.value),
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
        formatted: patch.panelSettings.filter.cutoff.value,
      },
      resonance: {
        ...patch.panelSettings.filter.resonance,
        formatted: patch.panelSettings.filter.resonance.value,
      },
    },
    envelope: {
      type: {
        ...patch.panelSettings.envelope.type,
        formatted: EG_TYPE_LABELS[patch.panelSettings.envelope.type.value],
      },
      attack: {
        ...patch.panelSettings.envelope.attack,
        formatted: patch.panelSettings.envelope.attack.value,
      },
      decay: {
        ...patch.panelSettings.envelope.decay,
        formatted: patch.panelSettings.envelope.decay.value,
      },
      intensity: {
        ...patch.panelSettings.envelope.intensity,
        formatted: patch.panelSettings.envelope.intensity.value,
      },
      target: {
        ...patch.panelSettings.envelope.target,
        formatted: EG_TARGET_LABELS[patch.panelSettings.envelope.target.value],
      },
    },
    lfo: {
      type: {
        ...patch.panelSettings.lfo.type,
        formatted: LFO_TYPE_LABELS[patch.panelSettings.lfo.type.value],
      },
      mode: {
        ...patch.panelSettings.lfo.mode,
        formatted: LFO_MODE_LABELS[patch.panelSettings.lfo.mode.value],
      },
      rate: {
        ...patch.panelSettings.lfo.rate,
        formatted: patch.panelSettings.lfo.rate.value,
      },
      intensity: {
        ...patch.panelSettings.lfo.intensity,
        formatted: patch.panelSettings.lfo.intensity.value,
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

/**
 * Convert VCO pitch value (0-1023) to cents
 * Based on the non-linear mapping from the Monologue specification:
 * - 0-4: -1200 cents
 * - 4-356: -1200 to -256 cents (linear interpolation)
 * - 356-476: -256 to -16 cents (linear interpolation)
 * - 476-492: -16 to 0 cents (linear interpolation)
 * - 492-532: 0 cents
 * - 532-548: 0 to 16 cents (linear interpolation)
 * - 548-668: 16 to 256 cents (linear interpolation)
 * - 668-1020: 256 to 1200 cents (linear interpolation)
 * - 1020-1023: 1200 cents
 */

export function vcoPitchToCents(value: number): number {
  const v = Math.max(0, Math.min(1023, value));
  const range = [
    [0, 4, -1200, -1200],
    [4, 356, -1200, -256],
    [356, 476, -256, -16],
    [476, 492, -16, 0],
    [492, 532, 0, 0],
    [532, 548, 0, 16],
    [548, 668, 16, 256],
    [668, 1020, 256, 1200],
    [1020, 1023, 1200, 1200],
  ];

  function lerp(x: number, x1: number, x2: number, y1: number, y2: number) {
    return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
  }

  const [x1, x2, y1, y2] = range.find(([a, b]) => v >= a && v <= b)!;
  return y1 === y2 ? y1 : lerp(v, x1, x2, y1, y2);
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

/**
 * Convert LFO rate value (0-1023) to BPM-synced time division label
 * When BPM sync is ON, the LFO rate maps to musical time divisions
 * When BPM sync is OFF, returns the raw value
 *
 * @param value - LFO rate value (0-1023)
 * @param bpmSyncOn - Whether BPM sync is enabled (0 = off, 1 = on)
 * @returns Time division string (e.g., "1/4", "1/8") or raw value
 */
export function lfoRateToBpmSync(value: number, bpmSyncOn: number): string | number {
  if (bpmSyncOn === 0) return value;

  const steps = [
    "4",
    "2",
    "1",
    "3/4",
    "1/2",
    "3/8",
    "1/3",
    "1/4",
    "3/16",
    "1/6",
    "1/8",
    "1/12",
    "1/16",
    "1/24",
    "1/32",
    "1/36",
  ];

  const index = Math.min(Math.floor(value / 64), steps.length - 1);
  return steps[index];
}

// NOTE: Portamento time is super strange
// 0-72 maps to 0% to 100%. But some numbers, (like 49) are skipped...
