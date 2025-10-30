/**
 * MIDI CC decoder for Korg Monologue
 * Stateless and functional
 */

// CC number to parameter name mapping based on MIDI spec
const CC_TO_PARAMETER: Record<number, string> = {
  16: "ampEgAttack",
  17: "ampEgDecay",
  24: "lfoRate",
  25: "egInt",
  26: "lfoInt",
  28: "drive",
  34: "vco1Pitch",
  35: "vco2Pitch",
  36: "vco1Shape",
  37: "vco2Shape",
  39: "vco1Level",
  40: "vco2Level",
  43: "cutoff",
  44: "resonance",
  48: "vco1Octave",
  49: "vco2Octave",
  50: "vco1Wave",
  51: "vco2Wave",
  56: "lfoTarget",
  58: "lfoWave",
  59: "lfoMode",
  60: "syncRing",
  61: "egType",
  62: "egTarget",
};

/**
 * Decode discrete 3-value parameters (0-42, 43-85, 86-127)
 */
function decodeThreeValueParam(value: number): number {
  if (value <= 42) return 0;
  if (value <= 85) return 1;
  return 2;
}

/**
 * Decode discrete 4-value parameters for octave (0-31, 32-63, 64-95, 96-127)
 */
function decodeFourValueParam(value: number): number {
  if (value <= 31) return 0;
  if (value <= 63) return 1;
  if (value <= 95) return 2;
  return 3;
}

/**
 * Decode a MIDI CC message into a parameter change
 * @param status - MIDI status byte
 * @param controller - MIDI controller number
 * @param value - MIDI value (0-127)
 * @returns Object with parameter name and value (scaled to 0-1023 for continuous params, or 0-2/0-3 for discrete)
 */
export function decodeCC(
  status: number,
  controller: number,
  value: number
): { parameter: string; value: number } | null {
  const parameter = CC_TO_PARAMETER[controller];

  if (!parameter) {
    return null; // Unknown CC number
  }

  let decodedValue: number;

  // Handle discrete parameters
  if (controller === 48 || controller === 49) {
    // VCO octaves: 4-value (0-3)
    decodedValue = decodeFourValueParam(value);
  } else if ([50, 51, 56, 58, 59, 60, 61, 62].includes(controller)) {
    // Wave, target, mode, sync/ring, EG type/target: 3-value (0-2)
    decodedValue = decodeThreeValueParam(value);
  } else {
    // Continuous parameters: scale from 0-127 to 0-1023
    decodedValue = Math.round((value / 127) * 1023);
  }

  return { parameter, value: decodedValue };
}
