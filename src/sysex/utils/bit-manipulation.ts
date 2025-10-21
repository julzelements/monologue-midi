/**
 * Bit manipulation utilities for parameter encoding/decoding
 *
 * Many Monologue parameters are 10-bit values (0-1023) split across multiple bytes:
 * - Bits 9-2 (the high 8 bits) stored in one byte
 * - Bits 1-0 (the low 2 bits) stored in another byte's specific bit positions
 *
 * Example: Value 488 (0x1E8) = 0b0111101000
 *   Bits [9:2] = 0b01111010 = 122 -> stored in upperByte
 *   Bits [1:0] = 0b00 = 0 -> stored in lowerByte at specified offset
 */

/**
 * Read a 10-bit value split across two bytes
 *
 * @param upperByte - Byte containing bits [9:2] of the 10-bit value
 * @param lowerByte - Byte containing bits [1:0] packed with other data
 * @param lowerBitOffset - Bit position in lowerByte where bits [1:0] start (0-7)
 * @returns 10-bit value (0-1023)
 */
export function read10BitValue(upperByte: number, lowerByte: number, lowerBitOffset: number): number {
  // Extract the high 8 bits (bits [9:2] of the final 10-bit value)
  const upper8 = upperByte & 0xff;

  // Extract the low 2 bits (bits [1:0]) from the specified position
  const lower2 = (lowerByte >> lowerBitOffset) & 0x03;

  // Combine: shift high 8 bits left by 2 positions, OR with low 2 bits
  // Result: [bit9 bit8 bit7 bit6 bit5 bit4 bit3 bit2 bit1 bit0]
  return (upper8 << 2) | lower2;
}

/**
 * Write a 10-bit value split across two bytes
 *
 * @param value - 10-bit value (0-1023)
 * @param lowerBitOffset - Bit position in the lower byte where bits [1:0] should be written
 * @returns { upperByte, lowerBits, mask } - Upper 8 bits, lower 2 bits positioned, and mask to clear target bits
 *
 * Example: Value 488 (0b0111101000) with lowerBitOffset=4
 *   upperByte = 122 (0b01111010) - bits [9:2]
 *   lowerBits = 0 (0b00) shifted to position 4 = 0b00000000
 *   mask = 0b11001111 (clears bits 4-5)
 */
export function write10BitValue(
  value: number,
  lowerBitOffset: number
): { upperByte: number; lowerBits: number; mask: number } {
  if (value < 0 || value > 1023) {
    throw new Error(`Value out of range: ${value} (expected 0-1023)`);
  }

  // Extract high 8 bits (bits [9:2]) by shifting right 2 positions
  const upperByte = (value >> 2) & 0xff;

  // Extract low 2 bits (bits [1:0])
  const lower2 = value & 0x03;

  // Shift lower bits to the correct position in the target byte
  const lowerBits = lower2 << lowerBitOffset;

  // Create mask to clear the target bit positions (2 bits at the offset)
  const mask = ~(0x03 << lowerBitOffset);

  return { upperByte, lowerBits, mask };
}

/**
 * Read a value from specific bits in a byte
 *
 * @param byte - The byte to read from
 * @param bitStart - Starting bit position (0=LSB, 7=MSB)
 * @param bitCount - Number of consecutive bits to read (1-8)
 * @returns The extracted value
 *
 * Example: readBits(0b01001111, 4, 2) extracts bits [5:4]
 *   Result: 0b00 = 0
 */
export function readBits(byte: number, bitStart: number, bitCount: number): number {
  const mask = (1 << bitCount) - 1;
  return (byte >> bitStart) & mask;
}

/**
 * Write a value to specific bits in a byte
 *
 * @param byte - The original byte
 * @param value - The value to write (will be masked to fit bitCount)
 * @param bitStart - Starting bit position (0=LSB, 7=MSB)
 * @param bitCount - Number of consecutive bits to write (1-8)
 * @returns The modified byte
 *
 * Example: writeBits(0b11111111, 0b00, 4, 2) writes 0b00 to bits [5:4]
 *   Result: 0b11001111
 */
export function writeBits(byte: number, value: number, bitStart: number, bitCount: number): number {
  const mask = (1 << bitCount) - 1;
  const cleared = byte & ~(mask << bitStart);
  return cleared | ((value & mask) << bitStart);
}
