/**
 * Decode Korg Monologue SysEx data to parameter object
 */

import { parseSysex } from "./utils/sysex-parser";
import { read10BitValue, readBits } from "./utils/bit-manipulation";

export interface MonologueParameters {
  patchName: string;
  drive: number;
  keyboardOctave: number;
  oscilators: {
    vco1: {
      wave: number;
      shape: number;
      level: number;
      pitch: number;
      octave: number;
    };
    vco2: {
      wave: number;
      shape: number;
      level: number;
      pitch: number;
      sync: number;
      octave: number;
    };
  };
  filter: {
    cutoff: number;
    resonance: number;
  };
  envelope: {
    type: number;
    attack: number;
    decay: number;
    intensity: number;
    target: number;
  };
  lfo: {
    wave: number;
    mode: number;
    rate: number;
    intensity: number;
    target: number;
  };
  misc: {
    bpmSync: number;
    portamentMode: number;
    portamentTime: number;
    cutoffVelocity: number;
    cutoffKeyTrack: number;
    sliderAssign: number;
  };
  sequencer: any; // Full sequencer structure - to be defined later
}

/**
 * Decode SysEx byte array to Monologue parameters
 * @param sysex - Raw SysEx data as Uint8Array
 * @returns Decoded parameter object
 */
export function decodeMonologueParameters(sysex: Uint8Array): MonologueParameters {
  // Parse and validate SysEx structure, decode 7-bit to 8-bit
  const parsed = parseSysex(sysex);
  const body = parsed.body;

  // Validate PROG marker (offset 0-3)
  const progMarker = String.fromCharCode(body[0], body[1], body[2], body[3]);
  if (progMarker !== "PROG") {
    throw new Error(`Invalid program data: expected 'PROG' marker at offset 0-3, got '${progMarker}'`);
  }

  // Decode PROGRAM NAME (offset 4-15, 12 ASCII characters)
  const patchNameBytes = body.slice(4, 16);
  let patchName = "";
  for (let i = 0; i < patchNameBytes.length; i++) {
    const byte = patchNameBytes[i];
    // Stop at null terminator
    if (byte === 0) {
      break;
    }
    // Mask to 7-bit ASCII (some bytes may have high bit set due to 7-bit encoding)
    const asciiChar = byte & 0x7f;
    // Only include printable ASCII characters (32-126)
    if (asciiChar >= 32 && asciiChar <= 126) {
      patchName += String.fromCharCode(asciiChar);
    }
  }
  patchName = patchName.trimEnd();

  const drive = read10BitValue(body[29], body[35], 6);

  // VCO1 parameters (offset 30)
  const vco1Wave = readBits(body[30], 6, 2);
  const vco1Shape = read10BitValue(body[17], body[30], 2);
  const vco1Level = read10BitValue(body[20], body[33], 0);
  const vco1Pitch = read10BitValue(body[16], body[30], 0);
  const vco1Octave = readBits(body[30], 4, 2);

  // VCO2 parameters (offset 31)
  const vco2Wave = readBits(body[31], 6, 2);
  const vco2Pitch = read10BitValue(body[18], body[31], 0);
  const vco2Shape = read10BitValue(body[19], body[31], 2);
  const vco2Level = read10BitValue(body[21], body[33], 2);
  const vco2Octave = readBits(body[31], 4, 2);

  // Sync/Ring and Keyboard Octave (offset 32)
  const syncRing = readBits(body[32], 0, 2);
  const keyboardOctave = readBits(body[32], 2, 3);

  const cutoff = read10BitValue(body[22], body[33], 4);
  const resonance = read10BitValue(body[23], body[33], 6);

  const egAttack = read10BitValue(body[24], body[34], 2);
  const egDecay = read10BitValue(body[25], body[34], 4);
  // TODO: EG INT decoding - offset 28 upper bits, offset 35 bits 0-1 lower bits
  // const egInt = read10BitValue(body[28], body[35], 0);

  // EG parameters (offset 34)
  const egType = readBits(body[34], 0, 2);
  const egTarget = readBits(body[34], 6, 2);

  const lfoRate = read10BitValue(body[26], body[35], 2);
  const lfoInt = read10BitValue(body[27], body[35], 4);

  // TODO: Implement full decoding logic for other parameters
  // For now, return a stub with placeholder values
  return {
    patchName,
    drive,
    keyboardOctave,
    oscilators: {
      vco1: {
        wave: vco1Wave,
        shape: vco1Shape,
        level: vco1Level,
        pitch: vco1Pitch,
        octave: vco1Octave,
      },
      vco2: {
        wave: vco2Wave,
        shape: vco2Shape,
        level: vco2Level,
        pitch: vco2Pitch,
        sync: syncRing,
        octave: vco2Octave,
      },
    },
    filter: {
      cutoff,
      resonance: 5000,
    },
    envelope: {
      type: egType,
      attack: egAttack,
      decay: egDecay,
      intensity: 5000, // TODO: Implement EG INT decoding
      target: egTarget,
    },
    lfo: {
      wave: 5000,
      mode: 5000,
      rate: 5000,
      intensity: 5000,
      target: 5000,
    },
    misc: {
      bpmSync: 5000,
      portamentMode: 5000,
      portamentTime: 5000,
      cutoffVelocity: 5000,
      cutoffKeyTrack: 5000,
      sliderAssign: 5000,
    },
    sequencer: {},
  };
}
