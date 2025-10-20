import { describe, it, expect } from "vitest";
import { decode7BitSet, encode7BitSet, decode7BitData, encode7BitData } from "../seven-bit-encoding.js";

describe("7-bit MIDI Encoding/Decoding", () => {
  describe("decode7BitSet", () => {
    it("should decode a simple set with all zeros", () => {
      const midiSet = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
      const decoded = decode7BitSet(midiSet);

      expect(decoded).toEqual(new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));
    });

    it("should decode a set with all high bits set", () => {
      // High bits byte: 0b01111111 = all 7 high bits are set
      // All data bytes: 0x7F = lower 7 bits all set
      const midiSet = new Uint8Array([0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f]);
      const decoded = decode7BitSet(midiSet);

      // Each decoded byte should be 0xFF (all 8 bits set)
      expect(decoded).toEqual(new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]));
    });

    it("should decode specific bit patterns correctly", () => {
      /**
       * Example decoding matrix:
       *
       * MIDI Input (8 bytes of 7-bit data):
       * Byte 0: 0b0_101_0101 (0x55) - high bits: b7₆=1, b7₅=0, b7₄=1, b7₃=0, b7₂=1, b7₁=0, b7₀=1
       * Byte 1: 0b0_000_0001 (0x01) - data byte 0 lower 7 bits
       * Byte 2: 0b0_000_0010 (0x02) - data byte 1 lower 7 bits
       * Byte 3: 0b0_000_0100 (0x04) - data byte 2 lower 7 bits
       * Byte 4: 0b0_000_1000 (0x08) - data byte 3 lower 7 bits
       * Byte 5: 0b0_001_0000 (0x10) - data byte 4 lower 7 bits
       * Byte 6: 0b0_010_0000 (0x20) - data byte 5 lower 7 bits
       * Byte 7: 0b0_100_0000 (0x40) - data byte 6 lower 7 bits
       *
       * Decoded Output (7 bytes of 8-bit data):
       * Byte 0: 0b1_000_0001 (0x81) = (b7₆=1 << 7) | 0x01
       * Byte 1: 0b0_000_0010 (0x02) = (b7₅=0 << 7) | 0x02
       * Byte 2: 0b1_000_0100 (0x84) = (b7₄=1 << 7) | 0x04
       * Byte 3: 0b0_000_1000 (0x08) = (b7₃=0 << 7) | 0x08
       * Byte 4: 0b1_001_0000 (0x90) = (b7₂=1 << 7) | 0x10
       * Byte 5: 0b0_010_0000 (0x20) = (b7₁=0 << 7) | 0x20
       * Byte 6: 0b1_100_0000 (0xC0) = (b7₀=1 << 7) | 0x40
       */
      const midiSet = new Uint8Array([0x55, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40]);
      const decoded = decode7BitSet(midiSet);

      expect(decoded).toEqual(new Uint8Array([0x81, 0x02, 0x84, 0x08, 0x90, 0x20, 0xc0]));
    });

    it("should decode another specific pattern", () => {
      /**
       * MIDI Input Matrix:
       *
       * Byte 0: 0b0_010_1010 (0x2A) - high bits: 0,1,0,1,0,1,0
       * Byte 1: 0b0_111_1111 (0x7F) - data byte 0: 0b0111_1111
       * Byte 2: 0b0_111_1110 (0x7E) - data byte 1: 0b0111_1110
       * Byte 3: 0b0_111_1100 (0x7C) - data byte 2: 0b0111_1100
       * Byte 4: 0b0_111_1000 (0x78) - data byte 3: 0b0111_1000
       * Byte 5: 0b0_111_0000 (0x70) - data byte 4: 0b0111_0000
       * Byte 6: 0b0_110_0000 (0x60) - data byte 5: 0b0110_0000
       * Byte 7: 0b0_100_0000 (0x40) - data byte 6: 0b0100_0000
       *
       * Decoded Output Matrix:
       *
       * Byte 0: 0b0_111_1111 (0x7F) = (0 << 7) | 0x7F
       * Byte 1: 0b1_111_1110 (0xFE) = (1 << 7) | 0x7E
       * Byte 2: 0b0_111_1100 (0x7C) = (0 << 7) | 0x7C
       * Byte 3: 0b1_111_1000 (0xF8) = (1 << 7) | 0x78
       * Byte 4: 0b0_111_0000 (0x70) = (0 << 7) | 0x70
       * Byte 5: 0b1_110_0000 (0xE0) = (1 << 7) | 0x60
       * Byte 6: 0b0_100_0000 (0x40) = (0 << 7) | 0x40
       */
      const midiSet = new Uint8Array([0x2a, 0x7f, 0x7e, 0x7c, 0x78, 0x70, 0x60, 0x40]);
      const decoded = decode7BitSet(midiSet);

      expect(decoded).toEqual(new Uint8Array([0x7f, 0xfe, 0x7c, 0xf8, 0x70, 0xe0, 0x40]));
    });

    it("should throw error for invalid length", () => {
      const invalidSet = new Uint8Array([0x00, 0x00, 0x00]);
      expect(() => decode7BitSet(invalidSet)).toThrow("Invalid MIDI set length");
    });
  });

  describe("encode7BitSet", () => {
    it("should encode a simple set with all zeros", () => {
      const dataSet = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
      const encoded = encode7BitSet(dataSet);

      expect(encoded).toEqual(new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));
    });

    it("should encode a set with all bits set", () => {
      const dataSet = new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
      const encoded = encode7BitSet(dataSet);

      // High bits: 0b01111111 = 0x7F (all 7 high bits set)
      // Data bytes: all 0x7F (lower 7 bits all set)
      expect(encoded).toEqual(new Uint8Array([0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f]));
    });

    it("should encode specific bit patterns correctly", () => {
      /**
       * Data Input (7 bytes of 8-bit data):
       * Byte 0: 0b1_000_0001 (0x81) - b7=1, lower 7 bits: 0x01
       * Byte 1: 0b0_000_0010 (0x02) - b7=0, lower 7 bits: 0x02
       * Byte 2: 0b1_000_0100 (0x84) - b7=1, lower 7 bits: 0x04
       * Byte 3: 0b0_000_1000 (0x08) - b7=0, lower 7 bits: 0x08
       * Byte 4: 0b1_001_0000 (0x90) - b7=1, lower 7 bits: 0x10
       * Byte 5: 0b0_010_0000 (0x20) - b7=0, lower 7 bits: 0x20
       * Byte 6: 0b1_100_0000 (0xC0) - b7=1, lower 7 bits: 0x40
       *
       * MIDI Output Matrix:
       * Byte 0: 0b0_101_0101 (0x55) - packed high bits: 1,0,1,0,1,0,1
       * Byte 1: 0b0_000_0001 (0x01) - lower 7 bits of byte 0
       * Byte 2: 0b0_000_0010 (0x02) - lower 7 bits of byte 1
       * Byte 3: 0b0_000_0100 (0x04) - lower 7 bits of byte 2
       * Byte 4: 0b0_000_1000 (0x08) - lower 7 bits of byte 3
       * Byte 5: 0b0_001_0000 (0x10) - lower 7 bits of byte 4
       * Byte 6: 0b0_010_0000 (0x20) - lower 7 bits of byte 5
       * Byte 7: 0b0_100_0000 (0x40) - lower 7 bits of byte 6
       */
      const dataSet = new Uint8Array([0x81, 0x02, 0x84, 0x08, 0x90, 0x20, 0xc0]);
      const encoded = encode7BitSet(dataSet);

      expect(encoded).toEqual(new Uint8Array([0x55, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40]));
    });

    it("should encode another specific pattern", () => {
      /**
       * Data Input Matrix:
       * Byte 0: 0b0_111_1111 (0x7F) - b7=0, lower: 0x7F
       * Byte 1: 0b1_111_1110 (0xFE) - b7=1, lower: 0x7E
       * Byte 2: 0b0_111_1100 (0x7C) - b7=0, lower: 0x7C
       * Byte 3: 0b1_111_1000 (0xF8) - b7=1, lower: 0x78
       * Byte 4: 0b0_111_0000 (0x70) - b7=0, lower: 0x70
       * Byte 5: 0b1_110_0000 (0xE0) - b7=1, lower: 0x60
       * Byte 6: 0b0_100_0000 (0x40) - b7=0, lower: 0x40
       *
       * MIDI Output Matrix:
       * Byte 0: 0b0_010_1010 (0x2A) - packed: 0,1,0,1,0,1,0
       * Byte 1: 0b0_111_1111 (0x7F)
       * Byte 2: 0b0_111_1110 (0x7E)
       * Byte 3: 0b0_111_1100 (0x7C)
       * Byte 4: 0b0_111_1000 (0x78)
       * Byte 5: 0b0_111_0000 (0x70)
       * Byte 6: 0b0_110_0000 (0x60)
       * Byte 7: 0b0_100_0000 (0x40)
       */
      const dataSet = new Uint8Array([0x7f, 0xfe, 0x7c, 0xf8, 0x70, 0xe0, 0x40]);
      const encoded = encode7BitSet(dataSet);

      expect(encoded).toEqual(new Uint8Array([0x2a, 0x7f, 0x7e, 0x7c, 0x78, 0x70, 0x60, 0x40]));
    });

    it("should throw error for invalid length", () => {
      const invalidSet = new Uint8Array([0x00, 0x00, 0x00]);
      expect(() => encode7BitSet(invalidSet)).toThrow("Invalid data set length");
    });
  });

  describe("Round-trip encoding/decoding", () => {
    it("should preserve data through encode->decode cycle", () => {
      const original = new Uint8Array([0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde]);
      const encoded = encode7BitSet(original);
      const decoded = decode7BitSet(encoded);

      expect(decoded).toEqual(original);
    });

    it("should preserve all possible byte values", () => {
      // Test all combinations of high bit on/off with various lower bits
      const testCases = [
        new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06]),
        new Uint8Array([0x7f, 0x7e, 0x7d, 0x7c, 0x7b, 0x7a, 0x79]),
        new Uint8Array([0x80, 0x81, 0x82, 0x83, 0x84, 0x85, 0x86]),
        new Uint8Array([0xff, 0xfe, 0xfd, 0xfc, 0xfb, 0xfa, 0xf9]),
        new Uint8Array([0xa5, 0x5a, 0x3c, 0xc3, 0x69, 0x96, 0x33]),
      ];

      for (const original of testCases) {
        const encoded = encode7BitSet(original);
        const decoded = decode7BitSet(encoded);
        expect(decoded).toEqual(original);
      }
    });
  });

  describe("decode7BitData", () => {
    it("should decode 512 bytes to 448 bytes", () => {
      // Create 512 bytes of MIDI data (64 sets of 8 bytes)
      const midiData = new Uint8Array(512);
      const decoded = decode7BitData(midiData);

      expect(decoded.length).toBe(448);
    });

    it("should decode multiple sets correctly", () => {
      /**
       * Full data decoding example:
       *
       * MIDI Input (512 bytes = 64 sets × 8 bytes):
       * Set 0 (bytes 0-7):   [0x55, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40]
       * Set 1 (bytes 8-15):  [0x2A, 0x7F, 0x7E, 0x7C, 0x78, 0x70, 0x60, 0x40]
       * ... (remaining 62 sets filled with zeros)
       *
       * Decoded Output (448 bytes = 64 sets × 7 bytes):
       * Set 0 (bytes 0-6):   [0x81, 0x02, 0x84, 0x08, 0x90, 0x20, 0xC0]
       * Set 1 (bytes 7-13):  [0x7F, 0xFE, 0x7C, 0xF8, 0x70, 0xE0, 0x40]
       * ... (remaining 62 sets filled with zeros)
       */
      const midiData = new Uint8Array(512);
      // Set 0
      midiData.set([0x55, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40], 0);
      // Set 1
      midiData.set([0x2a, 0x7f, 0x7e, 0x7c, 0x78, 0x70, 0x60, 0x40], 8);

      const decoded = decode7BitData(midiData);

      // Check first set
      expect(Array.from(decoded.slice(0, 7))).toEqual([0x81, 0x02, 0x84, 0x08, 0x90, 0x20, 0xc0]);
      // Check second set
      expect(Array.from(decoded.slice(7, 14))).toEqual([0x7f, 0xfe, 0x7c, 0xf8, 0x70, 0xe0, 0x40]);
    });

    it("should throw error for invalid length", () => {
      const invalidData = new Uint8Array(256);
      expect(() => decode7BitData(invalidData)).toThrow("Invalid MIDI data length");
    });
  });

  describe("encode7BitData", () => {
    it("should encode 448 bytes to 512 bytes", () => {
      const data = new Uint8Array(448);
      const encoded = encode7BitData(data);

      expect(encoded.length).toBe(512);
    });

    it("should encode multiple sets correctly", () => {
      /**
       * Full data encoding example:
       *
       * Data Input (448 bytes = 64 sets × 7 bytes):
       * Set 0 (bytes 0-6):   [0x81, 0x02, 0x84, 0x08, 0x90, 0x20, 0xC0]
       * Set 1 (bytes 7-13):  [0x7F, 0xFE, 0x7C, 0xF8, 0x70, 0xE0, 0x40]
       * ... (remaining 62 sets filled with zeros)
       *
       * MIDI Output (512 bytes = 64 sets × 8 bytes):
       * Set 0 (bytes 0-7):   [0x55, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40]
       * Set 1 (bytes 8-15):  [0x2A, 0x7F, 0x7E, 0x7C, 0x78, 0x70, 0x60, 0x40]
       * ... (remaining 62 sets filled with zeros)
       */
      const data = new Uint8Array(448);
      // Set 0
      data.set([0x81, 0x02, 0x84, 0x08, 0x90, 0x20, 0xc0], 0);
      // Set 1
      data.set([0x7f, 0xfe, 0x7c, 0xf8, 0x70, 0xe0, 0x40], 7);

      const encoded = encode7BitData(data);

      // Check first set
      expect(Array.from(encoded.slice(0, 8))).toEqual([0x55, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40]);
      // Check second set
      expect(Array.from(encoded.slice(8, 16))).toEqual([0x2a, 0x7f, 0x7e, 0x7c, 0x78, 0x70, 0x60, 0x40]);
    });

    it("should throw error for invalid length", () => {
      const invalidData = new Uint8Array(256);
      expect(() => encode7BitData(invalidData)).toThrow("Invalid data length");
    });
  });

  describe("Full round-trip with 448/512 byte arrays", () => {
    it("should preserve all data through full encode->decode cycle", () => {
      // Create test data with varied patterns across all 448 bytes
      const original = new Uint8Array(448);
      for (let i = 0; i < 448; i++) {
        original[i] = (i * 7 + 13) % 256; // Pseudo-random pattern
      }

      const encoded = encode7BitData(original);
      expect(encoded.length).toBe(512);

      const decoded = decode7BitData(encoded);
      expect(decoded.length).toBe(448);
      expect(decoded).toEqual(original);
    });
  });
});
