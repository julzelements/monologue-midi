/**
 * Decode Korg Monologue SysEx data to parameter object
 */

import { parseSysex } from "./utils/sysex-parser";
import { read10BitValue, readBits } from "./utils/bit-manipulation";

interface NamedValue {
  name: string;
  value: number;
}

export interface MonologueParameters {
  patchName: string;
  drive: NamedValue;
  keyboardOctave: NamedValue;
  syncRing: NamedValue;
  seqTrig: NamedValue;
  oscilators: {
    vco1: {
      wave: NamedValue;
      shape: NamedValue;
      level: NamedValue;
      pitch: NamedValue;
      octave: NamedValue;
    };
    vco2: {
      wave: NamedValue;
      shape: NamedValue;
      level: NamedValue;
      pitch: NamedValue;
      octave: NamedValue;
    };
  };
  filter: {
    cutoff: NamedValue;
    resonance: NamedValue;
  };
  envelope: {
    type: NamedValue;
    attack: NamedValue;
    decay: NamedValue;
    intensity: NamedValue;
    target: NamedValue;
  };
  lfo: {
    wave: NamedValue;
    mode: NamedValue;
    rate: NamedValue;
    intensity: NamedValue;
    target: NamedValue;
  };
  programSettings: {
    portamento: {
      time: NamedValue;
      mode: NamedValue;
      slideTime: NamedValue;
    };
    slider: {
      assign: NamedValue;
      bendRangePlus: NamedValue;
      bendRangeMinus: NamedValue;
    };
    pitch: {
      microTuning: NamedValue;
      scaleKey: NamedValue;
      programTuning: NamedValue;
    };
    other: {
      lfoBpmSync: NamedValue;
      cutoffKeyTrack: NamedValue;
      cutoffVelocity: NamedValue;
      ampVelocity: NamedValue;
      programLevel: NamedValue;
    };
  };
  // sequencer: any; // Full sequencer structure - to be defined later
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
  const keyboardOctave = readBits(body[32], 2, 3);
  const syncRing = readBits(body[32], 0, 2);
  const seqTrig = readBits(body[36], 6, 1);

  const vco1Wave = readBits(body[30], 6, 2);
  const vco1Shape = read10BitValue(body[17], body[30], 2);
  const vco1Level = read10BitValue(body[20], body[33], 0);
  const vco1Pitch = read10BitValue(body[16], body[30], 0);
  const vco1Octave = readBits(body[30], 4, 2);

  const vco2Wave = readBits(body[31], 6, 2);
  const vco2Pitch = read10BitValue(body[18], body[31], 0);
  const vco2Shape = read10BitValue(body[19], body[31], 2);
  const vco2Level = read10BitValue(body[21], body[33], 2);
  const vco2Octave = readBits(body[31], 4, 2);

  const cutoff = read10BitValue(body[22], body[33], 4);
  const resonance = read10BitValue(body[23], body[33], 6);

  const egAttack = read10BitValue(body[24], body[34], 2);
  const egDecay = read10BitValue(body[25], body[34], 4);
  const egInt = read10BitValue(body[26], body[35], 0);
  const egType = readBits(body[34], 0, 2);
  const egTarget = readBits(body[34], 6, 2);

  const lfoRate = read10BitValue(body[27], body[35], 2);
  const lfoInt = read10BitValue(body[28], body[35], 4);
  const lfoType = readBits(body[36], 0, 2);
  const lfoMode = readBits(body[36], 2, 2);
  const lfoTarget = readBits(body[36], 4, 2);

  const portamentoSlideTime = body[40];
  const portamentoTime = body[41];
  const portamentoMode = readBits(body[44], 0, 1);

  const sliderAssign = body[42];
  const bendRangePlus = readBits(body[43], 0, 4);
  const bendRangeMinus = readBits(body[43], 4, 4);

  const programTuning = body[37];
  const microTuning = body[38];
  const scaleKey = body[39];

  const lfoBpmSync = readBits(body[44], 3, 1);
  const cutoffVelocity = readBits(body[44], 4, 2);
  const cutoffKeyTrack = readBits(body[44], 6, 2);
  const programLevel = body[45];
  const ampVelocity = body[46];

  // TODO: Implement full decoding logic for other parameters
  // For now, return a stub with placeholder values
  return {
    patchName,
    drive: { name: "Drive", value: drive },
    keyboardOctave: { name: "Keyboard Octave", value: keyboardOctave },
    syncRing: { name: "Sync/Ring", value: syncRing },
    seqTrig: { name: "Seq Trig", value: seqTrig },
    oscilators: {
      vco1: {
        wave: { name: "Wave", value: vco1Wave },
        shape: { name: "Shape", value: vco1Shape },
        level: { name: "Level", value: vco1Level },
        pitch: { name: "Pitch", value: vco1Pitch },
        octave: { name: "Octave", value: vco1Octave },
      },
      vco2: {
        wave: { name: "Wave", value: vco2Wave },
        shape: { name: "Shape", value: vco2Shape },
        level: { name: "Level", value: vco2Level },
        pitch: { name: "Pitch", value: vco2Pitch },
        octave: { name: "Octave", value: vco2Octave },
      },
    },
    filter: {
      cutoff: { name: "Cutoff", value: cutoff },
      resonance: { name: "Resonance", value: resonance },
    },
    envelope: {
      type: { name: "Envelope Type", value: egType },
      attack: { name: "Attack", value: egAttack },
      decay: { name: "Decay", value: egDecay },
      intensity: { name: "Intensity", value: egInt },
      target: { name: "Target", value: egTarget },
    },
    lfo: {
      wave: { name: "Wave", value: lfoType },
      mode: { name: "LFO Mode", value: lfoMode },
      rate: { name: "Rate", value: lfoRate },
      intensity: { name: "Intensity", value: lfoInt },
      target: { name: "Target", value: lfoTarget },
    },
    programSettings: {
      portamento: {
        time: { name: "time", value: portamentoTime },
        mode: { name: "mode", value: portamentoMode },
        slideTime: { name: "slideTime", value: portamentoSlideTime },
      },
      slider: {
        assign: { name: "assign", value: sliderAssign },
        bendRangePlus: { name: "bendRangePlus", value: bendRangePlus },
        bendRangeMinus: { name: "bendRangeMinus", value: bendRangeMinus },
      },
      pitch: {
        microTuning: { name: "microTuning", value: microTuning },
        scaleKey: { name: "scaleKey", value: scaleKey },
        programTuning: { name: "programTuning", value: programTuning },
      },
      other: {
        lfoBpmSync: { name: "lfoBpmSync", value: lfoBpmSync },
        cutoffKeyTrack: { name: "cutoffKeyTrack", value: cutoffKeyTrack },
        cutoffVelocity: { name: "cutoffVelocity", value: cutoffVelocity },
        ampVelocity: { name: "ampVelocity", value: ampVelocity },
        programLevel: { name: "programLevel", value: programLevel },
      },
    },
  };
}
