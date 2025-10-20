/**
 * Decode Korg Monologue SysEx data to parameter object
 */

import { parseSysex } from "./utils/sysex-parser";

export interface MonologueParameters {
  patchName: string;
  drive: number;
  oscilators: {
    vco1: {
      wave: number;
      shape: number;
      level: number;
      pitch: number;
      duty: number;
      octave: number;
    };
    vco2: {
      wave: number;
      shape: number;
      level: number;
      pitch: number;
      duty: number;
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
  // Trim trailing spaces
  patchName = patchName.trimEnd();

  // TODO: Implement full decoding logic for other parameters
  // For now, return a stub with placeholder values
  return {
    patchName,
    drive: 0,
    oscilators: {
      vco1: {
        wave: 0,
        shape: 0,
        level: 0,
        pitch: 0,
        duty: 0,
        octave: 0,
      },
      vco2: {
        wave: 0,
        shape: 0,
        level: 0,
        pitch: 0,
        duty: 0,
        octave: 0,
      },
    },
    filter: {
      cutoff: 0,
      resonance: 0,
    },
    envelope: {
      type: 0,
      attack: 0,
      decay: 0,
      intensity: 0,
      target: 0,
    },
    lfo: {
      wave: 0,
      mode: 0,
      rate: 0,
      intensity: 0,
      target: 0,
    },
    misc: {
      bpmSync: 0,
      portamentMode: 0,
      portamentTime: 0,
      cutoffVelocity: 0,
      cutoffKeyTrack: 0,
      sliderAssign: 0,
    },
    sequencer: {},
  };
}
