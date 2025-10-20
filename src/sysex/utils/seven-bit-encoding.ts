/**
 * 7-bit MIDI encoding/decoding utilities
 *
 * MIDI SysEx requires all bytes to have bit 7 = 0 (values 0-127).
 * To pack 8-bit data into 7-bit MIDI format:
 *
 * Original: 7 bytes of 8-bit data
 * Packed:   8 bytes of 7-bit data
 *
 * Pattern per set:
 * - Byte 0: [0, b7₆, b7₅, b7₄, b7₃, b7₂, b7₁, b7₀] (all the high bits)
 * - Byte 1-7: [0, b6-b0] (lower 7 bits of each original byte)
 */

/**
 * Decode a single 8-byte MIDI set into 7 bytes of data
 *
 * @param midiSet - 8 bytes of 7-bit MIDI data
 * @returns 7 bytes of decoded 8-bit data
 */
export function decode7BitSet(midiSet: Uint8Array): Uint8Array {
  if (midiSet.length !== 8) {
    throw new Error(`Invalid MIDI set length: expected 8, got ${midiSet.length}`);
  }

  const decoded = new Uint8Array(7);
  const highBits = midiSet[0]; // First byte contains all the b7 bits

  for (let i = 0; i < 7; i++) {
    // Extract the high bit for this byte from the packed byte
    const highBit = (highBits >> (6 - i)) & 0x01;
    // Combine high bit (b7) with lower 7 bits (b6-b0)
    decoded[i] = (highBit << 7) | midiSet[i + 1];
  }

  return decoded;
}

/**
 * Encode 7 bytes of data into an 8-byte MIDI set
 *
 * @param dataSet - 7 bytes of 8-bit data
 * @returns 8 bytes of 7-bit MIDI encoded data
 */
export function encode7BitSet(dataSet: Uint8Array): Uint8Array {
  if (dataSet.length !== 7) {
    throw new Error(`Invalid data set length: expected 7, got ${dataSet.length}`);
  }

  const encoded = new Uint8Array(8);
  let highBits = 0;

  // Pack all the high bits (b7) into the first byte
  for (let i = 0; i < 7; i++) {
    const highBit = (dataSet[i] >> 7) & 0x01;
    highBits |= highBit << (6 - i);
  }

  encoded[0] = highBits;

  // Store the lower 7 bits in the remaining bytes
  for (let i = 0; i < 7; i++) {
    encoded[i + 1] = dataSet[i] & 0x7f;
  }

  return encoded;
}

/**
 * Decode entire 512-byte MIDI payload into 448 bytes of data
 *
 * @param midiData - 512 bytes of 7-bit MIDI encoded data
 * @returns 448 bytes of decoded 8-bit data
 */
export function decode7BitData(midiData: Uint8Array): Uint8Array {
  if (midiData.length !== 512) {
    throw new Error(`Invalid MIDI data length: expected 512, got ${midiData.length}`);
  }

  const decoded = new Uint8Array(448);

  // Process 64 sets of 8 bytes -> 7 bytes
  for (let setIndex = 0; setIndex < 64; setIndex++) {
    const midiSetStart = setIndex * 8;
    const midiSet = midiData.slice(midiSetStart, midiSetStart + 8);
    const decodedSet = decode7BitSet(midiSet);

    const decodedStart = setIndex * 7;
    decoded.set(decodedSet, decodedStart);
  }

  return decoded;
}

/**
 * Encode 448 bytes of data into 512-byte MIDI payload
 *
 * @param data - 448 bytes of 8-bit data
 * @returns 512 bytes of 7-bit MIDI encoded data
 */
export function encode7BitData(data: Uint8Array): Uint8Array {
  if (data.length !== 448) {
    throw new Error(`Invalid data length: expected 448, got ${data.length}`);
  }

  const encoded = new Uint8Array(512);

  // Process 64 sets of 7 bytes -> 8 bytes
  for (let setIndex = 0; setIndex < 64; setIndex++) {
    const dataSetStart = setIndex * 7;
    const dataSet = data.slice(dataSetStart, dataSetStart + 7);
    const encodedSet = encode7BitSet(dataSet);

    const encodedStart = setIndex * 8;
    encoded.set(encodedSet, encodedStart);
  }

  return encoded;
}
