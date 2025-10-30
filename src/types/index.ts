import { prettyPanelSettings } from "../sysex/prettify";

/**
 * Extract the return type of prettyPanelSettings
 */
type PrettyPanelSettings = ReturnType<typeof prettyPanelSettings>;

/**
 * Result of a parameter getter - matches the structure from prettify
 */
type ParameterValue = {
  value: number;
  formatted?: string | number;
  name?: string;
};

/**
 * Base parameter definition shared by all parameters
 */
type BaseParameter = {
  readonly key: string;
  readonly getter: (settings: PrettyPanelSettings) => ParameterValue;
  readonly isDiscrete: boolean;
  readonly maxValue: number;
};

/**
 * Parameter that can be controlled via MIDI CC
 */
type CCParameter = BaseParameter & {
  readonly ccNumber: number;
  readonly ccName: string; // The name used in encodeCC/decodeCC
};

/**
 * Parameter that is SysEx-only (no CC control)
 */
type SysExOnlyParameter = BaseParameter & {
  readonly ccNumber?: never;
  readonly ccName?: never;
};

/**
 * Union type for all parameters
 */
export type ParameterDefinition = CCParameter | SysExOnlyParameter;

/**
 * Type guard to check if a parameter has CC support
 */
export function isCCParameter(param: ParameterDefinition): param is CCParameter {
  return param.ccNumber !== undefined;
}

/**
 * Central registry of all Monologue parameters
 */
export const PARAMETERS = {
  // Filter (CC controllable)
  filterCutoff: {
    key: "filter.cutoff",
    ccNumber: 43,
    ccName: "cutoff",
    getter: (s) => s.filter.cutoff,
    isDiscrete: false,
    maxValue: 1023,
  },
  filterResonance: {
    key: "filter.resonance",
    ccNumber: 44,
    ccName: "resonance",
    getter: (s) => s.filter.resonance,
    isDiscrete: false,
    maxValue: 1023,
  },

  // Envelope (CC controllable)
  envelopeAttack: {
    key: "envelope.attack",
    ccNumber: 16,
    ccName: "ampEgAttack",
    getter: (s) => s.envelope.attack,
    isDiscrete: false,
    maxValue: 1023,
  },
  envelopeDecay: {
    key: "envelope.decay",
    ccNumber: 17,
    ccName: "ampEgDecay",
    getter: (s) => s.envelope.decay,
    isDiscrete: false,
    maxValue: 1023,
  },
  envelopeIntensity: {
    key: "envelope.intensity",
    ccNumber: 19,
    ccName: "egInt",
    getter: (s) => s.envelope.intensity,
    isDiscrete: false,
    maxValue: 1023,
  },
  envelopeTarget: {
    key: "envelope.target",
    ccNumber: 55,
    ccName: "egTarget",
    getter: (s) => s.envelope.target,
    isDiscrete: true,
    maxValue: 2,
  },
  envelopeType: {
    key: "envelope.type",
    ccNumber: 54,
    ccName: "egType",
    getter: (s) => s.envelope.type,
    isDiscrete: true,
    maxValue: 2,
  },

  // LFO (CC controllable)
  lfoRate: {
    key: "lfo.rate",
    ccNumber: 18,
    ccName: "lfoRate",
    getter: (s) => s.lfo.rate,
    isDiscrete: false,
    maxValue: 1023,
  },
  lfoIntensity: {
    key: "lfo.intensity",
    ccNumber: 20,
    ccName: "lfoInt",
    getter: (s) => s.lfo.intensity,
    isDiscrete: false,
    maxValue: 1023,
  },
  lfoTarget: {
    key: "lfo.target",
    ccNumber: 51,
    ccName: "lfoTarget",
    getter: (s) => s.lfo.target,
    isDiscrete: true,
    maxValue: 2,
  },
  lfoType: {
    key: "lfo.type",
    ccNumber: 52,
    ccName: "lfoWave",
    getter: (s) => s.lfo.type,
    isDiscrete: true,
    maxValue: 2,
  },
  lfoMode: {
    key: "lfo.mode",
    ccNumber: 53,
    ccName: "lfoMode",
    getter: (s) => s.lfo.mode,
    isDiscrete: true,
    maxValue: 2,
  },

  // VCO1 (CC controllable)
  vco1Pitch: {
    key: "oscilators.vco1.pitch",
    ccNumber: 45,
    ccName: "vco1Pitch",
    getter: (s) => s.oscilators.vco1.pitch,
    isDiscrete: false,
    maxValue: 1023,
  },
  vco1Shape: {
    key: "oscilators.vco1.shape",
    ccNumber: 47,
    ccName: "vco1Shape",
    getter: (s) => s.oscilators.vco1.shape,
    isDiscrete: false,
    maxValue: 1023,
  },
  vco1Octave: {
    key: "oscilators.vco1.octave",
    ccNumber: 48,
    ccName: "vco1Octave",
    getter: (s) => s.oscilators.vco1.octave,
    isDiscrete: true,
    maxValue: 3,
  },
  vco1Wave: {
    key: "oscilators.vco1.wave",
    ccNumber: 50,
    ccName: "vco1Wave",
    getter: (s) => s.oscilators.vco1.wave,
    isDiscrete: true,
    maxValue: 2,
  },
  vco1Level: {
    key: "oscilators.vco1.level",
    ccNumber: 49,
    ccName: "vco1Level",
    getter: (s) => s.oscilators.vco1.level,
    isDiscrete: false,
    maxValue: 1023,
  },

  // VCO2 (CC controllable)
  vco2Pitch: {
    key: "oscilators.vco2.pitch",
    ccNumber: 39,
    ccName: "vco2Pitch",
    getter: (s) => s.oscilators.vco2.pitch,
    isDiscrete: false,
    maxValue: 1023,
  },
  vco2Shape: {
    key: "oscilators.vco2.shape",
    ccNumber: 41,
    ccName: "vco2Shape",
    getter: (s) => s.oscilators.vco2.shape,
    isDiscrete: false,
    maxValue: 1023,
  },
  vco2Octave: {
    key: "oscilators.vco2.octave",
    ccNumber: 42,
    ccName: "vco2Octave",
    getter: (s) => s.oscilators.vco2.octave,
    isDiscrete: true,
    maxValue: 3,
  },
  vco2Wave: {
    key: "oscilators.vco2.wave",
    ccNumber: 40,
    ccName: "vco2Wave",
    getter: (s) => s.oscilators.vco2.wave,
    isDiscrete: true,
    maxValue: 2,
  },
  vco2Level: {
    key: "oscilators.vco2.level",
    ccNumber: 38,
    ccName: "vco2Level",
    getter: (s) => s.oscilators.vco2.level,
    isDiscrete: false,
    maxValue: 1023,
  },

  // Other CC parameters
  drive: {
    key: "drive",
    ccNumber: 21,
    ccName: "drive",
    getter: (s) => s.drive,
    isDiscrete: false,
    maxValue: 1023,
  },
  syncRing: {
    key: "syncRing",
    ccNumber: 56,
    ccName: "syncRing",
    getter: (s) => s.syncRing,
    isDiscrete: true,
    maxValue: 2,
  },

  // SysEx-only parameters (no CC control)
  // Note: These would come from MonologueParameters.programSettings or sequencerSettings
  // For now, we only include panel parameters that can be directly accessed
  // Add more as needed when accessing other parts of the patch structure
} as const satisfies Record<string, ParameterDefinition>;

/**
 * Type-safe parameter IDs
 */
export type ParameterId = keyof typeof PARAMETERS;

/**
 * Reverse lookup: CC number to parameter ID
 * Only includes parameters that have CC support
 */
export const CC_TO_PARAMETER = Object.fromEntries(
  (Object.entries(PARAMETERS) as Array<[ParameterId, ParameterDefinition]>)
    .filter((entry) => isCCParameter(entry[1]))
    .map(([id, param]) => [param.ccNumber!, id])
) as Record<number, ParameterId>;

/**
 * Reverse lookup: CC name (from encodeCC/decodeCC) to parameter ID
 */
export const CC_NAME_TO_PARAMETER = Object.fromEntries(
  (Object.entries(PARAMETERS) as Array<[ParameterId, ParameterDefinition]>)
    .filter((entry) => isCCParameter(entry[1]))
    .map(([id, param]) => [param.ccName!, id])
) as Record<string, ParameterId>;

/**
 * Get all CC-controllable parameters
 */
export function getCCParameters(): Record<string, CCParameter> {
  const result: Record<string, CCParameter> = {};
  for (const [id, param] of Object.entries(PARAMETERS)) {
    if (isCCParameter(param)) {
      result[id] = param;
    }
  }
  return result;
}

/**
 * Get all SysEx-only parameters
 */
export function getSysExOnlyParameters(): Record<string, SysExOnlyParameter> {
  const result: Record<string, SysExOnlyParameter> = {};
  for (const [id, param] of Object.entries(PARAMETERS)) {
    if (!isCCParameter(param)) {
      result[id] = param;
    }
  }
  return result;
}
