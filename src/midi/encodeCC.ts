/**
 * MIDI CC encoder for Korg Monologue
 * Stateless and functional
 */

// Parameter name to CC number mapping
const PARAMETER_TO_CC: Record<string, number> = {
  ampEgAttack: 16,
  ampEgDecay: 17,
  lfoRate: 24,
  egInt: 25,
  lfoInt: 26,
  drive: 28,
  vco1Pitch: 34,
  vco2Pitch: 35,
  vco1Shape: 36,
  vco2Shape: 37,
  vco1Level: 39,
  vco2Level: 40,
  cutoff: 43,
  resonance: 44,
  vco1Octave: 48,
  vco2Octave: 49,
  vco1Wave: 50,
  vco2Wave: 51,
  lfoTarget: 56,
  lfoWave: 58,
  lfoMode: 59,
  syncRing: 60,
  egType: 61,
  egTarget: 62,
};

/**
 * Encode discrete 3-value parameters (0, 1, 2) to MIDI values
 */
function encodeThreeValueParam(value: number): number {
  if (value === 0) return 0;
  if (value === 1) return 64;
  return 127;
}

/**
 * Encode discrete 4-value parameters for octave (0, 1, 2, 3) to MIDI values
 */
function encodeFourValueParam(value: number): number {
  if (value === 0) return 0;
  if (value === 1) return 42;
  if (value === 2) return 84;
  return 127;
}

/**
 * Encode a parameter change into a MIDI CC message
 * @param parameter - The parameter to change
 * @param value - The value to set (0-1023 for continuous, 0-2 or 0-3 for discrete)
 * @returns MIDI CC message as [status, controller, value] or null if parameter unknown
 */
export function encodeCC(parameter: string, value: number): [number, number, number] | null {
  const controller = PARAMETER_TO_CC[parameter];

  if (controller === undefined) {
    return null; // Unknown parameter
  }

  const status = 0xb0; // Control Change on channel 1
  let midiValue: number;

  // Handle discrete parameters
  if (controller === 48 || controller === 49) {
    // VCO octaves: 4-value (0-3)
    midiValue = encodeFourValueParam(value);
  } else if ([50, 51, 56, 58, 59, 60, 61, 62].includes(controller)) {
    // Wave, target, mode, sync/ring, EG type/target: 3-value (0-2)
    midiValue = encodeThreeValueParam(value);
  } else {
    // Continuous parameters: scale from 0-1023 to 0-127
    midiValue = Math.round((value / 1023) * 127);
  }

  return [status, controller, midiValue];
}
