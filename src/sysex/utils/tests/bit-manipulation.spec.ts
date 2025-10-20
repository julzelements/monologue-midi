import { describe, it, expect } from "vitest";
import { read10BitValue, write10BitValue, readBits, writeBits } from "../bit-manipulation.js";

describe("Bit Manipulation Utilities", () => {
  describe("read10BitValue", () => {
    it("should read a 10-bit value from split bytes", () => {
      /**
       * Example: Reading cutoff value 488
       *
       * Binary: 488 = 0b01_1110_1000 (10 bits)
       *
       * Upper 8 bits (bits 2-9): 0b0111_1010 = 122 (0x7A)
       * Lower 2 bits (bits 0-1): 0b00 = 0
       *
       * If lower bits are at offset 4-5 in lowerByte:
       * lowerByte = 0b??00???? (bits 4-5 are 00)
       */
      const upperByte = 122; // 0x7A = bits 2-9 of 488
      const lowerByte = 0b00000000; // bits 0-1 are at positions 4-5, both 0
      const lowerBitOffset = 4;

      const result = read10BitValue(upperByte, lowerByte, lowerBitOffset);
      expect(result).toBe(488);
    });

    it("should read maximum 10-bit value (1023)", () => {
      /**
       * Maximum: 1023 = 0b11_1111_1111 (all bits set)
       *
       * Upper 8 bits: 0b1111_1111 = 255 (0xFF)
       * Lower 2 bits: 0b11 = 3
       *
       * At offset 6-7: lowerByte = 0b1100_0000 = 192 (0xC0)
       */
      const upperByte = 255;
      const lowerByte = 0b11000000; // bits 6-7 set
      const lowerBitOffset = 6;

      const result = read10BitValue(upperByte, lowerByte, lowerBitOffset);
      expect(result).toBe(1023);
    });

    it("should read minimum 10-bit value (0)", () => {
      /**
       * Minimum: 0 = 0b00_0000_0000
       *
       * Upper 8 bits: 0
       * Lower 2 bits: 0
       */
      const upperByte = 0;
      const lowerByte = 0;
      const lowerBitOffset = 0;

      const result = read10BitValue(upperByte, lowerByte, lowerBitOffset);
      expect(result).toBe(0);
    });

    it("should read cutoff value (offset 4-5)", () => {
      /**
       * Cutoff from spec: offset 22 (upper 8 bits), offset 33 bits 4-5 (lower 2 bits)
       *
       * Example: 687 = 0b10_1010_1111
       * Upper 8 bits: 0b1010_1011 = 171 (0xAB)
       * Lower 2 bits: 0b11 = 3
       * At offset 4-5: 0b0011_0000 = 48 (0x30)
       */
      const upperByte = 171; // bits 2-9
      const lowerByte = 0b00110000; // bits 4-5 set to 11
      const lowerBitOffset = 4;

      const result = read10BitValue(upperByte, lowerByte, lowerBitOffset);
      expect(result).toBe(687);
    });

    it("should read resonance value (offset 6-7)", () => {
      /**
       * Resonance from spec: offset 23 (upper 8 bits), offset 33 bits 6-7 (lower 2 bits)
       *
       * Example: 909 = 0b11_1000_1101
       * Upper 8 bits: 0b1110_0011 = 227 (0xE3)
       * Lower 2 bits: 0b01 = 1
       * At offset 6-7: 0b0100_0000 = 64 (0x40)
       */
      const upperByte = 227; // bits 2-9
      const lowerByte = 0b01000000; // bits 6-7 set to 01
      const lowerBitOffset = 6;

      const result = read10BitValue(upperByte, lowerByte, lowerBitOffset);
      expect(result).toBe(909);
    });

    it("should handle different offsets correctly", () => {
      /**
       * Test value 512 = 0b10_0000_0000
       * Upper 8 bits: 0b1000_0000 = 128
       * Lower 2 bits: 0b00 = 0
       */
      const upperByte = 128;

      // Test at offset 0
      const result0 = read10BitValue(upperByte, 0b00000000, 0);
      expect(result0).toBe(512);

      // Test at offset 2
      const result2 = read10BitValue(upperByte, 0b00000000, 2);
      expect(result2).toBe(512);

      // Test at offset 4
      const result4 = read10BitValue(upperByte, 0b00000000, 4);
      expect(result4).toBe(512);
    });

    it("should ignore other bits in lowerByte", () => {
      /**
       * Value: 256 = 0b01_0000_0000
       * Upper 8 bits: 0b0100_0000 = 64
       * Lower 2 bits: 0b00 = 0
       *
       * lowerByte has other bits set, but only bits at offset matter
       */
      const upperByte = 64;
      const lowerByte = 0b11001111; // Bits set everywhere except offset 4-5
      const lowerBitOffset = 4;

      const result = read10BitValue(upperByte, lowerByte, lowerBitOffset);
      expect(result).toBe(256);
    });
  });

  describe("write10BitValue", () => {
    it("should write a 10-bit value split into bytes", () => {
      /**
       * Value: 488 = 0b01_1110_1000
       *
       * Should produce:
       * - upperByte: 0b0111_1010 = 122 (bits 2-9)
       * - lower 2 bits: 0b00 = 0 (bits 0-1)
       * - At offset 4: lowerBits = 0b0000_0000 = 0
       * - mask to clear bits 4-5: ~(0x03 << 4) = ~0b00110000
       */
      const result = write10BitValue(488, 4);

      expect(result.upperByte).toBe(122);
      expect(result.lowerBits).toBe(0b00000000);
      expect(result.mask).toBe(~(0x03 << 4));
    });

    it("should write maximum 10-bit value (1023)", () => {
      /**
       * Maximum: 1023 = 0b11_1111_1111
       *
       * upperByte: 0b1111_1111 = 255
       * lower 2 bits: 0b11 = 3
       * At offset 6: lowerBits = 0b1100_0000 = 192
       * mask to clear bits 6-7: ~(0x03 << 6)
       */
      const result = write10BitValue(1023, 6);

      expect(result.upperByte).toBe(255);
      expect(result.lowerBits).toBe(0b11000000);
      expect(result.mask).toBe(~(0x03 << 6));
    });

    it("should write minimum 10-bit value (0)", () => {
      const result = write10BitValue(0, 2);

      expect(result.upperByte).toBe(0);
      expect(result.lowerBits).toBe(0);
      expect(result.mask).toBe(~(0x03 << 2)); // Clear bits 2-3
    });

    it("should write cutoff value at correct offset", () => {
      /**
       * Cutoff: 687 = 0b10_1010_1111
       *
       * upperByte: 0b1010_1011 = 171
       * lower 2 bits: 0b11 = 3
       * At offset 4: lowerBits = 0b0011_0000 = 48
       */
      const result = write10BitValue(687, 4);

      expect(result.upperByte).toBe(171);
      expect(result.lowerBits).toBe(0b00110000);
      expect(result.mask).toBe(~(0x03 << 4));
    });

    it("should write resonance value at correct offset", () => {
      /**
       * Resonance: 909 = 0b11_1000_1101
       *
       * upperByte: 0b1110_0011 = 227
       * lower 2 bits: 0b01 = 1
       * At offset 6: lowerBits = 0b0100_0000 = 64
       */
      const result = write10BitValue(909, 6);

      expect(result.upperByte).toBe(227);
      expect(result.lowerBits).toBe(0b01000000);
      expect(result.mask).toBe(~(0x03 << 6));
    });

    it("should throw error for values > 1023", () => {
      expect(() => write10BitValue(1024, 0)).toThrow("Value out of range");
      expect(() => write10BitValue(2000, 0)).toThrow("1023");
    });

    it("should throw error for negative values", () => {
      expect(() => write10BitValue(-1, 0)).toThrow("Value out of range");
      expect(() => write10BitValue(-100, 0)).toThrow("0-1023");
    });

    it("should produce correct mask for each offset", () => {
      // Offset 0 (bits 0-1): mask should clear bits 0-1
      expect(write10BitValue(0, 0).mask).toBe(~(0x03 << 0));

      // Offset 2 (bits 2-3): mask should clear bits 2-3
      expect(write10BitValue(0, 2).mask).toBe(~(0x03 << 2));

      // Offset 4 (bits 4-5): mask should clear bits 4-5
      expect(write10BitValue(0, 4).mask).toBe(~(0x03 << 4));

      // Offset 6 (bits 6-7): mask should clear bits 6-7
      expect(write10BitValue(0, 6).mask).toBe(~(0x03 << 6));
    });
  });

  describe("Round-trip 10-bit encoding/decoding", () => {
    it("should preserve values through write->read cycle", () => {
      const testValues = [0, 1, 127, 256, 488, 512, 687, 909, 1022, 1023];

      for (const value of testValues) {
        // Write at offset 4 (cutoff position)
        const written = write10BitValue(value, 4);

        // Simulate writing to a byte
        const lowerByte = written.lowerBits;

        // Read back
        const read = read10BitValue(written.upperByte, lowerByte, 4);

        expect(read).toBe(value);
      }
    });

    it("should preserve values at different offsets", () => {
      const value = 687;
      const offsets = [0, 2, 4, 6];

      for (const offset of offsets) {
        const written = write10BitValue(value, offset);
        const read = read10BitValue(written.upperByte, written.lowerBits, offset);
        expect(read).toBe(value);
      }
    });

    it("should handle multiple values in same byte", () => {
      /**
       * Simulate cutoff and resonance sharing offset 33:
       * - Cutoff at bits 4-5
       * - Resonance at bits 6-7
       */
      const cutoff = 488;
      const resonance = 909;

      // Write cutoff
      const cutoffWritten = write10BitValue(cutoff, 4);
      let sharedByte = 0;
      sharedByte = (sharedByte & cutoffWritten.mask) | cutoffWritten.lowerBits;

      // Write resonance to same byte
      const resonanceWritten = write10BitValue(resonance, 6);
      sharedByte = (sharedByte & resonanceWritten.mask) | resonanceWritten.lowerBits;

      // Read back both values
      const cutoffRead = read10BitValue(cutoffWritten.upperByte, sharedByte, 4);
      const resonanceRead = read10BitValue(resonanceWritten.upperByte, sharedByte, 6);

      expect(cutoffRead).toBe(cutoff);
      expect(resonanceRead).toBe(resonance);
    });
  });

  describe("readBits", () => {
    it("should read a single bit", () => {
      const byte = 0b10101010;

      expect(readBits(byte, 0, 1)).toBe(0); // bit 0
      expect(readBits(byte, 1, 1)).toBe(1); // bit 1
      expect(readBits(byte, 2, 1)).toBe(0); // bit 2
      expect(readBits(byte, 3, 1)).toBe(1); // bit 3
    });

    it("should read multiple bits", () => {
      const byte = 0b11010110;

      // Read bits 0-1: 10 = 2
      expect(readBits(byte, 0, 2)).toBe(0b10);

      // Read bits 2-4: 101 = 5
      expect(readBits(byte, 2, 3)).toBe(0b101);

      // Read bits 4-7: 1101 = 13
      expect(readBits(byte, 4, 4)).toBe(0b1101);
    });

    it("should read entire byte", () => {
      const byte = 0b11010110;
      expect(readBits(byte, 0, 8)).toBe(0b11010110);
    });

    it("should read VCO octave (bits 4-5, 2 bits)", () => {
      /**
       * From spec: VCO 1 OCTAVE at byte 30, bits 4-5
       * Values: 0-3 = 16', 8', 4', 2'
       */
      const byte30 = 0b11010000; // Octave = 0b01 = 1 (8')
      expect(readBits(byte30, 4, 2)).toBe(0b01);
    });

    it("should read VCO wave (bits 6-7, 2 bits)", () => {
      /**
       * From spec: VCO 1 WAVE at byte 30, bits 6-7
       * Values: 0-2 = SQR, TRI, SAW
       */
      const byte30 = 0b10000000; // Wave = 0b10 = 2 (SAW)
      expect(readBits(byte30, 6, 2)).toBe(0b10);
    });

    it("should read EG type (bits 0-1, 2 bits)", () => {
      /**
       * From spec: EG TYPE at byte 34, bits 0-1
       * Values: 0-2 = GATE, A/G/D, A/D
       */
      const byte34 = 0b00000010; // EG Type = 0b10 = 2 (A/D)
      expect(readBits(byte34, 0, 2)).toBe(0b10);
    });
  });

  describe("writeBits", () => {
    it("should write a single bit", () => {
      let byte = 0b00000000;

      byte = writeBits(byte, 1, 0, 1); // Set bit 0
      expect(byte).toBe(0b00000001);

      byte = writeBits(byte, 1, 2, 1); // Set bit 2
      expect(byte).toBe(0b00000101);

      byte = writeBits(byte, 0, 0, 1); // Clear bit 0
      expect(byte).toBe(0b00000100);
    });

    it("should write multiple bits", () => {
      let byte = 0b00000000;

      // Write 0b11 to bits 0-1
      byte = writeBits(byte, 0b11, 0, 2);
      expect(byte).toBe(0b00000011);

      // Write 0b101 to bits 2-4
      byte = writeBits(byte, 0b101, 2, 3);
      expect(byte).toBe(0b00010111);
    });

    it("should overwrite existing bits", () => {
      let byte = 0b11111111;

      // Clear bits 2-4 (write 0b000)
      byte = writeBits(byte, 0b000, 2, 3);
      expect(byte).toBe(0b11100011);

      // Write 0b101 to bits 2-4
      byte = writeBits(byte, 0b101, 2, 3);
      expect(byte).toBe(0b11110111);
    });

    it("should preserve other bits", () => {
      const original = 0b11001010;

      // Write to bits 2-3 only
      const result = writeBits(original, 0b11, 2, 2);

      // Bits 0-1 and 4-7 should be preserved
      expect(result & 0b00000011).toBe(original & 0b00000011); // bits 0-1
      expect(result & 0b11110000).toBe(original & 0b11110000); // bits 4-7

      // Bits 2-3 should be set to 11
      expect(readBits(result, 2, 2)).toBe(0b11);
    });

    it("should write VCO octave", () => {
      let byte30 = 0b00000000;

      // Set octave to 2 (4') at bits 4-5
      byte30 = writeBits(byte30, 2, 4, 2);
      expect(byte30).toBe(0b00100000);
      expect(readBits(byte30, 4, 2)).toBe(2);
    });

    it("should write VCO wave", () => {
      let byte30 = 0b00000000;

      // Set wave to 1 (TRI) at bits 6-7
      byte30 = writeBits(byte30, 1, 6, 2);
      expect(byte30).toBe(0b01000000);
      expect(readBits(byte30, 6, 2)).toBe(1);
    });

    it("should mask values correctly", () => {
      // Writing a value larger than the bit count should mask it
      let byte = 0b00000000;

      // Try to write 0b1111 (15) to 2 bits - should only write 0b11 (3)
      byte = writeBits(byte, 0b1111, 0, 2);
      expect(byte).toBe(0b00000011);
    });
  });

  describe("Round-trip bit read/write", () => {
    it("should preserve values through write->read cycle", () => {
      const testCases = [
        { value: 0b00, bitStart: 0, bitCount: 2 },
        { value: 0b11, bitStart: 2, bitCount: 2 },
        { value: 0b101, bitStart: 4, bitCount: 3 },
        { value: 0b1111, bitStart: 0, bitCount: 4 },
      ];

      for (const { value, bitStart, bitCount } of testCases) {
        let byte = 0b00000000;
        byte = writeBits(byte, value, bitStart, bitCount);
        const read = readBits(byte, bitStart, bitCount);
        expect(read).toBe(value);
      }
    });

    it("should handle multiple fields in same byte", () => {
      /**
       * Simulate byte 30 with multiple fields:
       * - Bits 0-1: VCO PITCH lower 2 bits
       * - Bits 2-3: VCO SHAPE lower 2 bits
       * - Bits 4-5: VCO OCTAVE
       * - Bits 6-7: VCO WAVE
       */
      let byte = 0b00000000;

      byte = writeBits(byte, 0b10, 0, 2); // PITCH lower = 2
      byte = writeBits(byte, 0b01, 2, 2); // SHAPE lower = 1
      byte = writeBits(byte, 0b11, 4, 2); // OCTAVE = 3 (2')
      byte = writeBits(byte, 0b10, 6, 2); // WAVE = 2 (SAW)

      // Read back all fields
      expect(readBits(byte, 0, 2)).toBe(0b10);
      expect(readBits(byte, 2, 2)).toBe(0b01);
      expect(readBits(byte, 4, 2)).toBe(0b11);
      expect(readBits(byte, 6, 2)).toBe(0b10);

      // Full byte should be:
      // bits 6-7: 10, bits 4-5: 11, bits 2-3: 01, bits 0-1: 10
      // = 0b10110110 = 182
      expect(byte).toBe(0b10110110);
    });
  });
});
