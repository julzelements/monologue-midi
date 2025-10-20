/**
 * Bit manipulation utilities for parameter encoding/decoding
 *
 * Many Monologue parameters are 10-bit values (0-1023) split across multiple bytes:
 * - Upper 8 bits stored in one byte
 * - Lower 2 bits stored in another byte's specific bit positions
 */

/**
 * Read a 10-bit value split across two bytes
 *
 * @param upperByte - Byte containing bits 2-9 (upper 8 bits)
 * @param lowerByte - Byte containing bits 0-1 (lower 2 bits)
 * @param lowerBitOffset - Bit position in lowerByte where the 2 bits start
 * @returns 10-bit value (0-1023)
 */
export function read10BitValue(upperByte: number, lowerByte: number, lowerBitOffset: number): number {
  // Extract upper 8 bits (these are bits 2-9 of the final value)
  const upper8 = upperByte & 0xff;

  // Extract lower 2 bits from the specified position
  const lower2 = (lowerByte >> lowerBitOffset) & 0x03;

  // Combine: upper 8 bits shifted left by 2, OR with lower 2 bits
  return (upper8 << 2) | lower2;
}

/**
 * Write a 10-bit value split across two bytes
 *
 * @param value - 10-bit value (0-1023)
 * @param lowerBitOffset - Bit position in the lower byte where bits should be written
 * @returns { upperByte, lowerBits } - Upper 8 bits and lower 2 bits for the offset
 */
export function write10BitValue(
  value: number,
  lowerBitOffset: number
): { upperByte: number; lowerBits: number; mask: number } {
  if (value < 0 || value > 1023) {
    throw new Error(`Value out of range: ${value} (expected 0-1023)`);
  }

  // Upper 8 bits are bits 2-9 of the value
  const upperByte = (value >> 2) & 0xff;

  // Lower 2 bits are bits 0-1 of the value
  const lower2 = value & 0x03;

  // Shift lower bits to the correct position
  const lowerBits = lower2 << lowerBitOffset;

  // Create mask to clear the target bits (2 bits at the offset)
  const mask = ~(0x03 << lowerBitOffset);

  return { upperByte, lowerBits, mask };
}

/**
 * Read a value from specific bits in a byte
 *
 * @param byte - The byte to read from
 * @param bitStart - Starting bit position (0-7)
 * @param bitCount - Number of bits to read (1-8)
 * @returns The extracted value
 */
export function readBits(byte: number, bitStart: number, bitCount: number): number {
  const mask = (1 << bitCount) - 1;
  return (byte >> bitStart) & mask;
}

/**
 * Write a value to specific bits in a byte
 *
 * @param byte - The original byte
 * @param value - The value to write
 * @param bitStart - Starting bit position (0-7)
 * @param bitCount - Number of bits to write (1-8)
 * @returns The modified byte
 */
export function writeBits(byte: number, value: number, bitStart: number, bitCount: number): number {
  const mask = (1 << bitCount) - 1;
  const cleared = byte & ~(mask << bitStart);
  return cleared | ((value & mask) << bitStart);
}
