/**
 * Korg Monologue SysEx Core Encoder / Decoder
 *
 * Responsibilities:
 * 1. Low-level 7-bit <-> 8-bit packing/unpacking (groups of 7 data bytes + 1 MSB byte)
 * 2. High-level round-trip parameter encoding (encodeMonologueParameters)
 *
 * This file consolidates previous low-level transform logic and the former round-trip encoder implementation.
 * The API surface now exposes both transformation helpers and the full
 * MonologueParameters -> SysEx encoder in a single place for clarity and maintainability.
 */

export interface DecodedSysExData {
  /** Raw 8-bit data after 7-bit to 8-bit conversion */
  data: number[];
  /** Total bytes after conversion */
  length: number;
  /** Whether the conversion was successful */
  success: boolean;
  /** Any error message */
  error?: string;
}

export interface EncodedSysExData {
  /** Raw 7-bit MIDI-safe data */
  data: number[];
  /** Total bytes after conversion */
  length: number;
  /** Whether the conversion was successful */
  success: boolean;
  /** Any error message */
  error?: string;
}

// ---------------------------------------------------------------------------
// Low-level transformation utilities (existing implementation preserved)
// ---------------------------------------------------------------------------

/**
 * Convert 7-bit MIDI SysEx data to 8-bit internal data
 *
 * According to Korg spec:
 * - 1 Set = 8bit x 7Byte (original data)
 * - Becomes = 7bit x 8Byte (MIDI data)
 * - MSBs are packed into separate bytes
 *
 * @param midiData - Array of 7-bit MIDI bytes (should be 7-bit safe)
 * @returns Decoded 8-bit data
 */
export function decode7BitTo8Bit(midiData: number[]): DecodedSysExData {
  // Validate input
  if (midiData.length === 0) {
    return {
      data: [],
      length: 0,
      success: false,
      error: "Empty input data",
    };
  }

  // Check if input is properly 7-bit (all values <= 127)
  for (let i = 0; i < midiData.length; i++) {
    if (midiData[i] > 127) {
      return {
        data: [],
        length: 0,
        success: false,
        error: `Invalid 7-bit data at index ${i}: ${midiData[i]} > 127`,
      };
    }
  }

  // Process data in chunks of 8 MIDI bytes -> 7 data bytes
  const decoded: number[] = [];

  for (let chunkStart = 0; chunkStart < midiData.length; chunkStart += 8) {
    const chunk = midiData.slice(chunkStart, chunkStart + 8);

    // Need at least 8 bytes for a complete chunk
    if (chunk.length < 8) {
      // Handle partial chunk (padding with zeros if needed)
      while (chunk.length < 8) {
        chunk.push(0);
      }
    }

    // First byte contains the MSBs (bit 7) of the next 7 bytes
    const msbByte = chunk[0];

    // Decode the 7 data bytes
    for (let i = 1; i < 8; i++) {
      const dataByte = chunk[i];
      const msb = (msbByte >> (7 - i)) & 1; // Extract MSB for this position
      const fullByte = (msb << 7) | dataByte; // Combine MSB + 7-bit data
      decoded.push(fullByte);
    }
  }

  return {
    data: decoded,
    length: decoded.length,
    success: true,
  };
}

/**
 * Convert 8-bit internal data to 7-bit MIDI SysEx data
 *
 * Reverse of decode7BitTo8Bit - packs MSBs separately
 *
 * @param internalData - Array of 8-bit internal bytes
 * @returns Encoded 7-bit MIDI-safe data
 */
export function encode8BitTo7Bit(internalData: number[]): EncodedSysExData {
  // Validate input
  if (internalData.length === 0) {
    return {
      data: [],
      length: 0,
      success: false,
      error: "Empty input data",
    };
  }

  // Check if input is valid 8-bit data
  for (let i = 0; i < internalData.length; i++) {
    if (internalData[i] < 0 || internalData[i] > 255) {
      return {
        data: [],
        length: 0,
        success: false,
        error: `Invalid 8-bit data at index ${i}: ${internalData[i]}`,
      };
    }
  }

  const encoded: number[] = [];

  // Process data in chunks of 7 data bytes -> 8 MIDI bytes
  for (let chunkStart = 0; chunkStart < internalData.length; chunkStart += 7) {
    const chunk = internalData.slice(chunkStart, chunkStart + 7);

    // Pad chunk to 7 bytes if necessary
    while (chunk.length < 7) {
      chunk.push(0);
    }

    // Extract MSBs and create MSB byte
    let msbByte = 0;
    const dataBytes: number[] = [];

    for (let i = 0; i < 7; i++) {
      const fullByte = chunk[i];
      const msb = (fullByte >> 7) & 1; // Extract MSB
      const data = fullByte & 0x7f; // Remove MSB, keep lower 7 bits

      msbByte |= msb << (6 - i); // Pack MSB into position
      dataBytes.push(data);
    }

    // Add MSB byte first, then data bytes
    encoded.push(msbByte);
    encoded.push(...dataBytes);
  }

  return {
    data: encoded,
    length: encoded.length,
    success: true,
  };
}

/**
 * Utility function to validate that data is 7-bit safe
 */
export function is7BitSafe(data: number[]): boolean {
  return data.every((byte) => byte >= 0 && byte <= 127);
}

/**
 * Utility function to validate that data is 8-bit safe
 */
export function is8BitSafe(data: number[]): boolean {
  return data.every((byte) => byte >= 0 && byte <= 255);
}

// ---------------------------------------------------------------------------
// High-level round-trip parameter encoder
// ---------------------------------------------------------------------------
import {
  addLowerBits,
  getBits,
  transformDataFrom7BitTo8Bit,
  getHighBits,
  getLowBits,
  setBits,
  packLowerBits,
  transformDataFrom8BitTo7Bit,
} from "./utilities"; // getBits used by tests elsewhere
import { MonologueParameters } from "./decoder";

const SLIDER_ASSIGN_REVERSE_MATRIX: { [key: string]: number } = {
  "VCO 1 PITCH": 13,
  "VCO 1 SHAPE": 14,
  "VCO 2 PITCH": 17,
  "VCO 2 SHAPE": 18,
  "VCO 1 LEVEL": 21,
  CUTOFF: 23,
  RESONANCE: 24,
  ATTACK: 26,
  DECAY: 27,
  "EG INT": 28,
  "LFO RATE": 31,
  "LFO INT": 32,
  PORTAMENT: 40,
  "PITCH BEND": 56,
  "GATE TIME": 57,
};

// Helper definitions moved to utilities.ts

// ---------------------------------------------------------------------------
// Validation helper (non-throwing) exported for external preflight checks
// ---------------------------------------------------------------------------
export interface EncodeValidationResult {
  valid: boolean;
  missing: string[];
  error?: string;
}

/**
 * Basic structural validation for encoding
 * Note: For comprehensive JSON schema validation, use validateMonologueParametersWithSchema from ./validator
 */
export function validateMonologueParameters(params: MonologueParameters): EncodeValidationResult {
  const missing: string[] = [];
  if (!params.isValid) missing.push("isValid=false");
  if (!params.drive && params.drive !== 0) missing.push("drive");
  if (!params.oscillators) missing.push("oscillators");
  if (!params.filter) missing.push("filter");
  if (!params.envelope) missing.push("envelope");
  if (!params.lfo) missing.push("lfo");
  if (!params.sequencer) missing.push("sequencer");
  if (!params.motionSequencing) missing.push("motionSequencing");
  if (!params.amp) missing.push("amp");
  if (!params.misc) missing.push("misc");
  return {
    valid: missing.length === 0,
    missing,
    error: missing.length ? `Missing sections: ${missing.join(", ")}` : undefined,
  };
}

export function encodeMonologueParameters(params: MonologueParameters): number[] {
  const validation = validateMonologueParameters(params);
  if (!validation.valid) {
    throw new Error(`Invalid parameters: missing required sections: [${validation.missing.join(", ")}]`);
  }

  const drive = params.drive!;
  const { oscillators, filter, envelope, lfo, sequencer, motionSequencing, amp, misc } = params;
  const data = new Array(448).fill(0);
  const patchName = params.patchName.padEnd(12, "\0").slice(0, 12);
  for (let i = 0; i < 12; i++) data[4 + i] = patchName.charCodeAt(i);

  // VCO1
  data[16] = getHighBits(oscillators!.vco1.pitch);
  data[17] = getHighBits(oscillators!.vco1.shape);
  data[20] = getHighBits(oscillators!.vco1.level);
  data[30] = setBits(data[30], oscillators!.vco1.wave, 6, 7);
  data[30] = setBits(data[30], oscillators!.vco1.octave, 4, 5);
  data[30] = packLowerBits(data[30], oscillators!.vco1.shape, 2);
  data[30] = packLowerBits(data[30], oscillators!.vco1.pitch, 0);
  // VCO2
  data[18] = getHighBits(oscillators!.vco2.pitch);
  data[19] = getHighBits(oscillators!.vco2.shape);
  data[21] = getHighBits(oscillators!.vco2.level);
  data[31] = setBits(data[31], oscillators!.vco2.wave, 6, 7);
  data[31] = setBits(data[31], oscillators!.vco2.octave, 4, 5);
  data[31] = packLowerBits(data[31], oscillators!.vco2.shape, 2);
  data[31] = packLowerBits(data[31], oscillators!.vco2.pitch, 0);
  data[32] = setBits(data[32], oscillators!.vco2.sync, 0, 1);
  // Filter
  data[22] = getHighBits(filter!.cutoff);
  data[23] = getHighBits(filter!.resonance);
  // Envelope
  data[24] = getHighBits(envelope!.attack);
  data[25] = getHighBits(envelope!.decay);
  data[26] = getHighBits(envelope!.intensity + 512);
  data[34] = setBits(data[34], envelope!.type, 0, 1);
  data[34] = packLowerBits(data[34], envelope!.attack, 2);
  data[34] = packLowerBits(data[34], envelope!.decay, 4);
  data[34] = setBits(data[34], envelope!.target, 6, 7);
  // LFO
  data[27] = getHighBits(lfo!.rate);
  data[28] = getHighBits(lfo!.intensity + 512);
  data[36] = setBits(data[36], lfo!.wave, 0, 1);
  data[36] = setBits(data[36], lfo!.mode, 2, 3);
  data[36] = setBits(data[36], lfo!.target, 4, 5);
  // Drive
  data[29] = getHighBits(drive);
  // Packed lower bits
  data[33] = packLowerBits(data[33], oscillators!.vco1.level, 0);
  data[33] = packLowerBits(data[33], oscillators!.vco2.level, 2);
  data[33] = packLowerBits(data[33], filter!.cutoff, 4);
  data[33] = packLowerBits(data[33], filter!.resonance, 6);
  data[35] = packLowerBits(data[35], envelope!.intensity + 512, 0);
  data[35] = packLowerBits(data[35], lfo!.rate, 2);
  data[35] = packLowerBits(data[35], lfo!.intensity + 512, 4);
  data[35] = packLowerBits(data[35], drive, 6);
  // Sequencer basic
  data[54] = sequencer!.stepLength;
  data[55] = sequencer!.stepResolution;
  data[56] = sequencer!.swing + 75;
  for (let i = 0; i < 8; i++) data[64] = setBits(data[64], sequencer!.stepOnOff[i] ? 1 : 0, i, i);
  for (let i = 0; i < 8; i++) data[65] = setBits(data[65], sequencer!.stepOnOff[i + 8] ? 1 : 0, i, i);
  for (let i = 0; i < 8; i++) data[66] = setBits(data[66], sequencer!.motionOnOff[i] ? 1 : 0, i, i);
  for (let i = 0; i < 8; i++) data[67] = setBits(data[67], sequencer!.motionOnOff[i + 8] ? 1 : 0, i, i);
  // Motion slots
  for (let slot = 0; slot < 4; slot++) {
    const s = motionSequencing!.slots[slot];
    const o = 72 + slot * 2;
    data[o] = setBits(data[o], s.motionOn ? 1 : 0, 0, 0);
    data[o] = setBits(data[o], s.smoothOn ? 1 : 0, 1, 1);
    data[o + 1] = s.parameterId;
  }
  for (let slot = 0; slot < 4; slot++) {
    const s = motionSequencing!.slots[slot];
    const o = 80 + slot * 2;
    for (let i = 0; i < 8; i++) data[o] = setBits(data[o], s.stepEnabled[i] ? 1 : 0, i, i);
    for (let i = 0; i < 8; i++) data[o + 1] = setBits(data[o + 1], s.stepEnabled[i + 8] ? 1 : 0, i, i);
  }
  // Step events
  for (let step = 0; step < 16; step++) {
    const ev = motionSequencing!.stepEvents[step];
    const off = 96 + step * 22;
    data[off + 0] = ev.noteNumber;
    data[off + 2] = ev.velocity;
    data[off + 4] = setBits(data[off + 4], ev.gateTime, 0, 6);
    data[off + 4] = setBits(data[off + 4], ev.triggerSwitch ? 1 : 0, 7, 7);
    for (let slot = 0; slot < 4; slot++) {
      const md = ev.motionData[slot];
      const mo = off + 6 + slot * 4;
      data[mo + 0] = md.data1;
      data[mo + 1] = md.data2;
      data[mo + 2] = md.data3;
      data[mo + 3] = md.data4;
    }
  }
  // Misc
  data[41] = misc!.portamentTime;
  data[42] = SLIDER_ASSIGN_REVERSE_MATRIX[misc!.sliderAssign] || 23;
  data[44] = setBits(data[44], misc!.portamentMode ? 1 : 0, 0, 0);
  data[44] = setBits(data[44], misc!.bpmSync ? 1 : 0, 3, 3);
  data[44] = setBits(data[44], misc!.cutoffVelocity, 4, 5);
  data[44] = setBits(data[44], misc!.cutoffKeyTrack, 6, 7);

  const midiData = transformDataFrom8BitTo7Bit(data);
  const sysexHeader = [0xf0, 0x42, 0x30, 0x00, 0x01, 0x44, 0x40];
  const sysexTerminator = [0xf7];
  return [...sysexHeader, ...midiData, ...sysexTerminator];
}

// ---------------------------------------------------------------------------
// Safe encode wrapper (non-throwing API)
// ---------------------------------------------------------------------------
export type SafeEncodeResult = { ok: true; data: number[] } | { ok: false; error: string; missing?: string[] };

/**
 * Safely encode Monologue parameters into a SysEx byte array.
 * Never throws; returns a discriminated union with success or error info.
 * Uses validateMonologueParameters for structural checks and then executes the
 * full encode path. Any unexpected runtime errors are captured and surfaced.
 */
export function safeEncodeMonologueParameters(params: MonologueParameters): SafeEncodeResult {
  const validation = validateMonologueParameters(params);
  if (!validation.valid) {
    return {
      ok: false,
      error: `Invalid parameters: missing required sections`,
      missing: validation.missing,
    };
  }
  try {
    const data = encodeMonologueParameters(params);
    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, error: err?.message || String(err) };
  }
}
