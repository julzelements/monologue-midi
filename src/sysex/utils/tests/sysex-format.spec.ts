import { describe, it, expect } from "vitest";
import {
  SYSEX_CONSTANTS,
  extractHeader,
  extractFooter,
  extractEncodedData,
  isValidHeader,
  isValidFooter,
  validateSysexStructure,
} from "../sysex-format.js";

describe("SysEx Format Utilities", () => {
  // Create a valid test SysEx message
  const createValidSysex = (): Uint8Array => {
    const sysex = new Uint8Array(520);
    // Header
    sysex.set(SYSEX_CONSTANTS.HEADER, 0);
    // Data (512 bytes)
    for (let i = 0; i < 512; i++) {
      sysex[7 + i] = i % 128; // Valid 7-bit MIDI bytes
    }
    // Footer
    sysex[519] = SYSEX_CONSTANTS.FOOTER;
    return sysex;
  };

  describe("SYSEX_CONSTANTS", () => {
    it("should have correct header values", () => {
      expect(SYSEX_CONSTANTS.HEADER).toEqual([0xf0, 0x42, 0x30, 0x00, 0x01, 0x44, 0x40]);
      expect(SYSEX_CONSTANTS.HEADER_LENGTH).toBe(7);
    });

    it("should have correct footer value", () => {
      expect(SYSEX_CONSTANTS.FOOTER).toBe(0xf7);
      expect(SYSEX_CONSTANTS.FOOTER_LENGTH).toBe(1);
    });

    it("should have correct size constants", () => {
      expect(SYSEX_CONSTANTS.TOTAL_LENGTH).toBe(520);
      expect(SYSEX_CONSTANTS.ENCODED_DATA_LENGTH).toBe(512);
      expect(SYSEX_CONSTANTS.DECODED_DATA_LENGTH).toBe(448);
    });

    it("should have correct encoding set constants", () => {
      expect(SYSEX_CONSTANTS.BYTES_PER_SET_DECODED).toBe(7);
      expect(SYSEX_CONSTANTS.BYTES_PER_SET_ENCODED).toBe(8);
      expect(SYSEX_CONSTANTS.NUM_SETS).toBe(64);
    });
  });

  describe("extractHeader", () => {
    it("should extract the 7-byte header", () => {
      const sysex = createValidSysex();
      const header = extractHeader(sysex);

      expect(header.length).toBe(7);
      expect(Array.from(header)).toEqual([0xf0, 0x42, 0x30, 0x00, 0x01, 0x44, 0x40]);
    });

    it("should extract header from start of array", () => {
      const sysex = new Uint8Array(520);
      sysex.set([0xf0, 0x42, 0x30, 0x00, 0x01, 0x44, 0x40], 0);

      const header = extractHeader(sysex);
      expect(header).toEqual(new Uint8Array([0xf0, 0x42, 0x30, 0x00, 0x01, 0x44, 0x40]));
    });
  });

  describe("extractFooter", () => {
    it("should extract the footer byte", () => {
      const sysex = createValidSysex();
      const footer = extractFooter(sysex);

      expect(footer).toBe(0xf7);
    });

    it("should extract last byte of array", () => {
      const sysex = new Uint8Array(520);
      sysex[519] = 0xf7;

      const footer = extractFooter(sysex);
      expect(footer).toBe(0xf7);
    });
  });

  describe("extractEncodedData", () => {
    it("should extract 512 bytes of data between header and footer", () => {
      const sysex = createValidSysex();
      const data = extractEncodedData(sysex);

      expect(data.length).toBe(512);
    });

    it("should extract correct data slice", () => {
      const sysex = new Uint8Array(520);
      sysex.set(SYSEX_CONSTANTS.HEADER, 0);
      // Set specific pattern in data section
      for (let i = 0; i < 512; i++) {
        sysex[7 + i] = (i % 64) + 10;
      }
      sysex[519] = SYSEX_CONSTANTS.FOOTER;

      const data = extractEncodedData(sysex);

      // Check first few bytes
      expect(data[0]).toBe(10);
      expect(data[1]).toBe(11);
      expect(data[63]).toBe(73);
      expect(data[64]).toBe(10); // Pattern repeats
    });

    it("should not include header or footer in extracted data", () => {
      const sysex = createValidSysex();
      const data = extractEncodedData(sysex);

      // Should not contain header bytes
      expect(data[0]).not.toBe(0xf0);
      // Should not contain footer
      expect(data[511]).not.toBe(0xf7);
    });
  });

  describe("isValidHeader", () => {
    it("should return true for valid header", () => {
      const validHeader = new Uint8Array([0xf0, 0x42, 0x30, 0x00, 0x01, 0x44, 0x40]);
      expect(isValidHeader(validHeader)).toBe(true);
    });

    it("should return false for invalid header bytes", () => {
      const invalidHeader = new Uint8Array([0xf0, 0x42, 0x30, 0x00, 0x01, 0x44, 0x41]); // Wrong last byte
      expect(isValidHeader(invalidHeader)).toBe(false);
    });

    it("should return false for wrong length", () => {
      const wrongLength = new Uint8Array([0xf0, 0x42, 0x30, 0x00, 0x01]);
      expect(isValidHeader(wrongLength)).toBe(false);
    });

    it("should return false for completely wrong header", () => {
      const wrongHeader = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
      expect(isValidHeader(wrongHeader)).toBe(false);
    });
  });

  describe("isValidFooter", () => {
    it("should return true for valid footer", () => {
      expect(isValidFooter(0xf7)).toBe(true);
    });

    it("should return false for invalid footer", () => {
      expect(isValidFooter(0xf0)).toBe(false);
      expect(isValidFooter(0x00)).toBe(false);
      expect(isValidFooter(0xff)).toBe(false);
    });
  });

  describe("validateSysexStructure", () => {
    it("should validate a correct SysEx message", () => {
      const sysex = createValidSysex();
      const result = validateSysexStructure(sysex);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("should detect invalid length", () => {
      const sysex = new Uint8Array(100);
      const result = validateSysexStructure(sysex);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain("Invalid length");
      expect(result.errors[0]).toContain("expected 520");
      expect(result.errors[0]).toContain("got 100");
    });

    it("should detect invalid header", () => {
      const sysex = createValidSysex();
      sysex[0] = 0x00; // Corrupt header
      const result = validateSysexStructure(sysex);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain("Invalid header");
    });

    it("should detect invalid footer", () => {
      const sysex = createValidSysex();
      sysex[519] = 0x00; // Corrupt footer
      const result = validateSysexStructure(sysex);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((err) => err.includes("Invalid footer"))).toBe(true);
    });

    it("should detect multiple errors", () => {
      const sysex = new Uint8Array(100); // Wrong length
      sysex[0] = 0x00; // Wrong header
      const result = validateSysexStructure(sysex);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });

    it("should provide detailed error messages", () => {
      const sysex = new Uint8Array(520);
      sysex.set([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], 0); // Wrong header
      sysex[519] = 0x00; // Wrong footer

      const result = validateSysexStructure(sysex);

      expect(result.valid).toBe(false);
      // Check for expected header in error message
      expect(result.errors.some((err) => err.includes("240, 66, 48, 0, 1, 68, 64"))).toBe(true);
      // Check for expected footer in error message
      expect(result.errors.some((err) => err.includes("247"))).toBe(true);
    });
  });

  describe("Integration: full SysEx validation workflow", () => {
    it("should validate and extract all parts from valid SysEx", () => {
      const sysex = createValidSysex();

      // Validate
      const validation = validateSysexStructure(sysex);
      expect(validation.valid).toBe(true);

      // Extract parts
      const header = extractHeader(sysex);
      const data = extractEncodedData(sysex);
      const footer = extractFooter(sysex);

      expect(isValidHeader(header)).toBe(true);
      expect(data.length).toBe(512);
      expect(isValidFooter(footer)).toBe(true);
    });

    it("should detect corrupted SysEx at any position", () => {
      // Test header corruption
      const sysexBadHeader = createValidSysex();
      sysexBadHeader[3] = 0xff;
      expect(validateSysexStructure(sysexBadHeader).valid).toBe(false);

      // Test footer corruption
      const sysexBadFooter = createValidSysex();
      sysexBadFooter[519] = 0x00;
      expect(validateSysexStructure(sysexBadFooter).valid).toBe(false);
    });
  });
});
