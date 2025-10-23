/**
 * Encode Korg Monologue parameter object to SysEx data
 */

import { MonologueParameters } from "./decode";
import { encode7BitData } from "./utils/seven-bit-encoding";
import { SYSEX_CONSTANTS } from "./utils/sysex-format";
import { write10BitValue } from "./utils/bit-manipulation";

/**
 * Encode Monologue parameters to SysEx byte array
 * @param params - Parameter object to encode
 * @returns SysEx data as Uint8Array (520 bytes)
 */
export function encodeMonologueParameters(params: MonologueParameters): Uint8Array {
  // Create 448-byte decoded body
  const body = new Uint8Array(448);

  // Write PROG marker (offset 0-3)
  body[0] = 0x50; // 'P'
  body[1] = 0x52; // 'R'
  body[2] = 0x4f; // 'O'
  body[3] = 0x47; // 'G'

  // Write PROGRAM NAME (offset 4-15, 12 ASCII characters)
  const patchName = params.patchName || "";
  for (let i = 0; i < 12; i++) {
    if (i < patchName.length) {
      // Write character, ensuring it's 7-bit ASCII
      body[4 + i] = patchName.charCodeAt(i) & 0x7f;
    } else {
      // Pad with null bytes
      body[4 + i] = 0x00;
    }
  }

  // Encode DRIVE (offset 29 for upper 8 bits, offset 35 bits 6-7 for lower 2 bits)
  const drive = params.panelSettings?.drive?.value || 0;
  const driveEncoded = write10BitValue(drive, 6);
  body[29] = driveEncoded.upperByte;
  // Merge lower bits into byte 35 (preserving other bits)
  body[35] = (body[35] & driveEncoded.mask) | driveEncoded.lowerBits;

  // KEYBOARD OCTAVE (offset 32 bits 2-4, range 0-4)
  const keyboardOctave = (params.panelSettings?.keyboardOctave?.value || 0) & 0x07;
  body[32] = (body[32] & ~(0x07 << 2)) | (keyboardOctave << 2);

  // SYNC/RING (offset 32 bits 0-1, range 0-2)
  const syncRing = (params.panelSettings?.syncRing?.value || 0) & 0x03;
  body[32] = (body[32] & ~0x03) | syncRing;

  // SEQ TRIG (offset 36 bit 6, range 0)
  const seqTrig = (params.panelSettings?.seqTrig?.value || 0) & 0x01;
  body[36] = (body[36] & ~(0x01 << 6)) | (seqTrig << 6);

  // Encode VCO1 parameters
  const vco1 = params.panelSettings?.oscilators?.vco1;
  if (vco1) {
    // VCO1 PITCH (offset 16 for upper 8 bits, offset 30 bits 0-1 for lower 2 bits)
    const vco1PitchEncoded = write10BitValue(vco1.pitch?.value || 0, 0);
    body[16] = vco1PitchEncoded.upperByte;
    body[30] = (body[30] & vco1PitchEncoded.mask) | vco1PitchEncoded.lowerBits;

    // VCO1 SHAPE (offset 17 for upper 8 bits, offset 30 bits 2-3 for lower 2 bits)
    const vco1ShapeEncoded = write10BitValue(vco1.shape?.value || 0, 2);
    body[17] = vco1ShapeEncoded.upperByte;
    body[30] = (body[30] & vco1ShapeEncoded.mask) | vco1ShapeEncoded.lowerBits;

    // VCO1 LEVEL (offset 20 for upper 8 bits, offset 33 bits 0-1 for lower 2 bits)
    const vco1LevelEncoded = write10BitValue(vco1.level?.value || 0, 0);
    body[20] = vco1LevelEncoded.upperByte;
    body[33] = (body[33] & vco1LevelEncoded.mask) | vco1LevelEncoded.lowerBits;

    // VCO1 OCTAVE (offset 30 bits 4-5, range 0-3)
    const vco1Octave = (vco1.octave?.value || 0) & 0x03;
    body[30] = (body[30] & ~(0x03 << 4)) | (vco1Octave << 4);

    // VCO1 WAVE (offset 30 bits 6-7, range 0-2)
    const vco1Wave = (vco1.wave?.value || 0) & 0x03;
    body[30] = (body[30] & ~(0x03 << 6)) | (vco1Wave << 6);
  }

  // Encode VCO2 parameters
  const vco2 = params.panelSettings?.oscilators?.vco2;
  if (vco2) {
    // VCO2 PITCH (offset 18 for upper 8 bits, offset 31 bits 0-1 for lower 2 bits)
    const vco2PitchEncoded = write10BitValue(vco2.pitch?.value || 0, 0);
    body[18] = vco2PitchEncoded.upperByte;
    body[31] = (body[31] & vco2PitchEncoded.mask) | vco2PitchEncoded.lowerBits;

    // VCO2 SHAPE (offset 19 for upper 8 bits, offset 31 bits 2-3 for lower 2 bits)
    const vco2ShapeEncoded = write10BitValue(vco2.shape?.value || 0, 2);
    body[19] = vco2ShapeEncoded.upperByte;
    body[31] = (body[31] & vco2ShapeEncoded.mask) | vco2ShapeEncoded.lowerBits;

    // VCO2 LEVEL (offset 21 for upper 8 bits, offset 33 bits 2-3 for lower 2 bits)
    const vco2LevelEncoded = write10BitValue(vco2.level?.value || 0, 2);
    body[21] = vco2LevelEncoded.upperByte;
    body[33] = (body[33] & vco2LevelEncoded.mask) | vco2LevelEncoded.lowerBits;

    // VCO2 OCTAVE (offset 31 bits 4-5, range 0-3)
    const vco2Octave = (vco2.octave?.value || 0) & 0x03;
    body[31] = (body[31] & ~(0x03 << 4)) | (vco2Octave << 4);

    // VCO2 WAVE (offset 31 bits 6-7, range 0-2)
    const vco2Wave = (vco2.wave?.value || 0) & 0x03;
    body[31] = (body[31] & ~(0x03 << 6)) | (vco2Wave << 6);
  }

  // Encode Filter parameters
  const filter = params.panelSettings?.filter;
  if (filter) {
    // CUTOFF (offset 22 for upper 8 bits, offset 33 bits 4-5 for lower 2 bits)
    const cutoffEncoded = write10BitValue(filter.cutoff?.value || 0, 4);
    body[22] = cutoffEncoded.upperByte;
    body[33] = (body[33] & cutoffEncoded.mask) | cutoffEncoded.lowerBits;

    // RESONANCE (offset 23 for upper 8 bits, offset 33 bits 6-7 for lower 2 bits)
    const resonanceEncoded = write10BitValue(filter.resonance?.value || 0, 6);
    body[23] = resonanceEncoded.upperByte;
    body[33] = (body[33] & resonanceEncoded.mask) | resonanceEncoded.lowerBits;
  }

  // Encode EG (Envelope Generator) parameters
  const envelope = params.panelSettings?.envelope;
  if (envelope) {
    // EG ATTACK (offset 24 for upper 8 bits, offset 34 bits 2-3 for lower 2 bits)
    const egAttackEncoded = write10BitValue(envelope.attack?.value || 0, 2);
    body[24] = egAttackEncoded.upperByte;
    body[34] = (body[34] & egAttackEncoded.mask) | egAttackEncoded.lowerBits;

    // EG DECAY (offset 25 for upper 8 bits, offset 34 bits 4-5 for lower 2 bits)
    const egDecayEncoded = write10BitValue(envelope.decay?.value || 0, 4);
    body[25] = egDecayEncoded.upperByte;
    body[34] = (body[34] & egDecayEncoded.mask) | egDecayEncoded.lowerBits;

    // EG INT (offset 26 for upper 8 bits, offset 35 bits 0-1 for lower 2 bits)
    const egIntEncoded = write10BitValue(envelope.intensity?.value || 0, 0);
    body[26] = egIntEncoded.upperByte;
    body[35] = (body[35] & egIntEncoded.mask) | egIntEncoded.lowerBits;

    // EG TYPE (offset 34 bits 0-1, range 0-2)
    const egType = (envelope.type?.value || 0) & 0x03;
    body[34] = (body[34] & ~0x03) | egType;

    // EG TARGET (offset 34 bits 6-7, range 0-2)
    const egTarget = (envelope.target?.value || 0) & 0x03;
    body[34] = (body[34] & ~(0x03 << 6)) | (egTarget << 6);
  }

  // Encode LFO parameters
  const lfo = params.panelSettings?.lfo;
  if (lfo) {
    // LFO RATE (offset 27 for upper 8 bits, offset 35 bits 2-3 for lower 2 bits)
    const lfoRateEncoded = write10BitValue(lfo.rate?.value || 0, 2);
    body[27] = lfoRateEncoded.upperByte;
    body[35] = (body[35] & lfoRateEncoded.mask) | lfoRateEncoded.lowerBits;

    // LFO INT (offset 28 for upper 8 bits, offset 35 bits 4-5 for lower 2 bits)
    const lfoIntEncoded = write10BitValue(lfo.intensity?.value || 0, 4);
    body[28] = lfoIntEncoded.upperByte;
    body[35] = (body[35] & lfoIntEncoded.mask) | lfoIntEncoded.lowerBits;

    // LFO TYPE (offset 36 bits 0-1, range 0-2)
    const lfoType = (lfo.wave?.value || 0) & 0x03;
    body[36] = (body[36] & ~0x03) | lfoType;

    // LFO MODE (offset 36 bits 2-3, range 0-2)
    const lfoMode = (lfo.mode?.value || 0) & 0x03;
    body[36] = (body[36] & ~(0x03 << 2)) | (lfoMode << 2);

    // LFO TARGET (offset 36 bits 4-5, range 0-2)
    const lfoTarget = (lfo.target?.value || 0) & 0x03;
    body[36] = (body[36] & ~(0x03 << 4)) | (lfoTarget << 4);
  }

  // Encode Portamento settings
  const portamento = params.programSettings?.portamento;
  if (portamento) {
    // SLIDE TIME (offset 40, range 0-72)
    body[40] = (portamento.slideTime?.value || 0) & 0x7f;

    // PORTAMENTO TIME (offset 41, range 0-128)
    body[41] = (portamento.time?.value || 0) & 0xff;

    // PORTAMENTO MODE (offset 44 bit 0, range 0-1)
    const portamentoMode = (portamento.mode?.value || 0) & 0x01;
    body[44] = (body[44] & ~0x01) | portamentoMode;
  }

  // Encode Slider settings
  const slider = params.programSettings?.slider;
  if (slider) {
    // SLIDER ASSIGN (offset 42, CC number)
    body[42] = (slider.assign?.value || 0) & 0x7f;

    // BEND RANGE (+) (offset 43 bits 0-3, range 1-12)
    const bendRangePlus = (slider.bendRangePlus?.value || 1) & 0x0f;
    body[43] = (body[43] & ~0x0f) | bendRangePlus;

    // BEND RANGE (-) (offset 43 bits 4-7, range 1-12)
    const bendRangeMinus = (slider.bendRangeMinus?.value || 1) & 0x0f;
    body[43] = (body[43] & ~(0x0f << 4)) | (bendRangeMinus << 4);
  }

  // Encode Pitch settings
  const pitch = params.programSettings?.pitch;
  if (pitch) {
    // PROGRAM TUNING (offset 37, range 0-100 = -50 to +50 cents)
    body[37] = (pitch.programTuning?.value || 0) & 0x7f;

    // MICRO TUNING (offset 38, range 0-139)
    body[38] = (pitch.microTuning?.value || 0) & 0xff;

    // SCALE KEY (offset 39, range 0-24 = -12 to +12 keys)
    body[39] = (pitch.scaleKey?.value || 0) & 0x1f;
  }

  // Encode Other settings
  const other = params.programSettings?.other;
  if (other) {
    // LFO BPM SYNC (offset 44 bit 3, range 0-1)
    const lfoBpmSync = (other.lfoBpmSync?.value || 0) & 0x01;
    body[44] = (body[44] & ~(0x01 << 3)) | (lfoBpmSync << 3);

    // CUTOFF VELOCITY (offset 44 bits 4-5, range 0-2)
    const cutoffVelocity = (other.cutoffVelocity?.value || 0) & 0x03;
    body[44] = (body[44] & ~(0x03 << 4)) | (cutoffVelocity << 4);

    // CUTOFF KEY TRACK (offset 44 bits 6-7, range 0-2)
    const cutoffKeyTrack = (other.cutoffKeyTrack?.value || 0) & 0x03;
    body[44] = (body[44] & ~(0x03 << 6)) | (cutoffKeyTrack << 6);

    // PROGRAM LEVEL (offset 45, range 77-127)
    body[45] = (other.programLevel?.value || 102) & 0x7f; // Default 102 = 0

    // AMP VELOCITY (offset 46, range 0-127)
    body[46] = (other.ampVelocity?.value || 0) & 0x7f;
  }

  // Encode Sequencer Settings
  const seqSettings = params.sequencerSettings;
  if (seqSettings) {
    // BPM (offset 52-53, 12-bit value, stored as value * 10)
    const bpmValue = Math.round((seqSettings.bpm?.value || 120) * 10);
    body[52] = bpmValue & 0xff; // Lower 8 bits
    body[53] = (body[53] & 0xf0) | ((bpmValue >> 8) & 0x0f); // Upper 4 bits in lower nibble

    // STEP LENGTH (offset 54, range 1-16)
    body[54] = (seqSettings.stepLength?.value || 16) & 0x1f;

    // STEP RESOLUTION (offset 55)
    body[55] = (seqSettings.stepResolution?.value || 0) & 0x7f;

    // SWING (offset 56)
    body[56] = (seqSettings.swing?.value || 0) & 0x7f;

    // DEFAULT GATE TIME (offset 57)
    body[57] = (seqSettings.defaultGateTime?.value || 54) & 0x7f;

    // MOTION SLOT PARAMS (offset 72-79, 4 slots x 2 bytes each)
    if (seqSettings.motionSlotParams) {
      seqSettings.motionSlotParams.forEach((slot: any, i: number) => {
        const baseOffset = 72 + i * 2;

        // Slot active (bit 0) and smooth (bit 1)
        const active = (slot.active?.value || 0) & 0x01;
        const smooth = (slot.smooth?.value || 0) & 0x01;
        body[baseOffset] = active | (smooth << 1);

        // Slot parameter (CC number)
        body[baseOffset + 1] = (slot.parameter?.value || 0) & 0x7f;
      });
    }
  }

  // TODO: Encode sequencer steps
  // For now, leave rest as zeros

  // Encode body to 7-bit MIDI format (448 bytes -> 512 bytes)
  const encodedBody = encode7BitData(body);

  // Create full 520-byte SysEx message
  const sysex = new Uint8Array(SYSEX_CONSTANTS.TOTAL_LENGTH);

  // Write header (7 bytes)
  sysex[0] = 0xf0; // SysEx start
  sysex[1] = 0x42; // Korg
  sysex[2] = 0x30; // Channel 1 (3g where g=0)
  sysex[3] = 0x00; //
  sysex[4] = 0x01; //
  sysex[5] = 0x44; // Monologue
  sysex[6] = 0x40; // Current Program Data Dump

  // Write encoded body (512 bytes)
  sysex.set(encodedBody, SYSEX_CONSTANTS.HEADER_LENGTH);

  // Write footer (1 byte)
  sysex[SYSEX_CONSTANTS.TOTAL_LENGTH - 1] = 0xf7; // SysEx end

  return sysex;
}
