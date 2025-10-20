/**
 * Tests for SysEx parser utility
 */

import { describe, it, expect } from "vitest";
import { parseSysex, validateSysex, tryParseSysex } from "../sysex-parser";
import { SYSEX_CONSTANTS } from "../sysex-format";
import { encode7BitData } from "../seven-bit-encoding";

describe("parseSysex", () => {
  it("should parse a valid SysEx message", () => {
    // Create a valid 448-byte data payload
    const data = new Uint8Array(448);
    for (let i = 0; i < 448; i++) {
      data[i] = i % 256;
    }

    // Encode to 7-bit MIDI format (512 bytes)
    const encodedBody = encode7BitData(data);

    // Build complete SysEx message (520 bytes)
    const sysex = new Uint8Array(520);
    sysex.set(SYSEX_CONSTANTS.HEADER, 0);
    sysex.set(encodedBody, SYSEX_CONSTANTS.HEADER_LENGTH);
    sysex[519] = SYSEX_CONSTANTS.FOOTER;

    // Parse
    const result = parseSysex(sysex);

    // Verify structure
    expect(result.header).toEqual(new Uint8Array(SYSEX_CONSTANTS.HEADER));
    expect(result.footer).toBe(SYSEX_CONSTANTS.FOOTER);
    expect(result.body.length).toBe(448);

    // Verify decoded data matches original
    expect(result.body).toEqual(data);
  });

  it("should throw on invalid length", () => {
    const invalidSysex = new Uint8Array(100);

    expect(() => parseSysex(invalidSysex)).toThrow("SysEx validation failed");
  });

  it("should throw on invalid header", () => {
    const sysex = new Uint8Array(520);
    // Wrong header
    sysex.set([0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], 0);
    sysex[519] = SYSEX_CONSTANTS.FOOTER;

    expect(() => parseSysex(sysex)).toThrow("Invalid header");
  });

  it("should throw on invalid footer", () => {
    const sysex = new Uint8Array(520);
    sysex.set(SYSEX_CONSTANTS.HEADER, 0);
    sysex[519] = 0x00; // Wrong footer

    expect(() => parseSysex(sysex)).toThrow("Invalid footer");
  });

  it("should throw on invalid data bytes (> 127)", () => {
    const sysex = new Uint8Array(520);
    sysex.set(SYSEX_CONSTANTS.HEADER, 0);
    sysex[519] = SYSEX_CONSTANTS.FOOTER;
    // Set an invalid byte in the data section
    sysex[10] = 0x80; // > 127

    expect(() => parseSysex(sysex)).toThrow("Invalid data byte");
  });
});

describe("validateSysex", () => {
  it("should validate a correct SysEx message", () => {
    const sysex = new Uint8Array(520);
    sysex.set(SYSEX_CONSTANTS.HEADER, 0);
    // Fill with valid 7-bit data
    for (let i = SYSEX_CONSTANTS.HEADER_LENGTH; i < 519; i++) {
      sysex[i] = i % 128;
    }
    sysex[519] = SYSEX_CONSTANTS.FOOTER;

    const result = validateSysex(sysex);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should detect wrong length", () => {
    const sysex = new Uint8Array(100);

    const result = validateSysex(sysex);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("Invalid length");
    expect(result.errors[0]).toContain("520");
    expect(result.errors[0]).toContain("100");
  });

  it("should detect invalid header", () => {
    const sysex = new Uint8Array(520);
    sysex.set([0xf0, 0x99, 0x99, 0x99, 0x99, 0x99, 0x99], 0);
    sysex[519] = SYSEX_CONSTANTS.FOOTER;

    const result = validateSysex(sysex);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Invalid header"))).toBe(true);
  });

  it("should detect invalid footer", () => {
    const sysex = new Uint8Array(520);
    sysex.set(SYSEX_CONSTANTS.HEADER, 0);
    sysex[519] = 0x00;

    const result = validateSysex(sysex);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Invalid footer"))).toBe(true);
  });

  it("should detect invalid data bytes", () => {
    const sysex = new Uint8Array(520);
    sysex.set(SYSEX_CONSTANTS.HEADER, 0);
    sysex[519] = SYSEX_CONSTANTS.FOOTER;
    sysex[10] = 0xff; // Invalid byte > 127

    const result = validateSysex(sysex);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Invalid data byte at offset 10"))).toBe(true);
  });

  it("should report multiple errors", () => {
    const sysex = new Uint8Array(520);
    // Wrong header
    sysex.set([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], 0);
    // Wrong footer
    sysex[519] = 0x00;
    // Invalid data byte
    sysex[10] = 0x80;

    const result = validateSysex(sysex);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });

  it("should limit error reporting for many invalid bytes", () => {
    const sysex = new Uint8Array(520);
    sysex.set(SYSEX_CONSTANTS.HEADER, 0);
    sysex[519] = SYSEX_CONSTANTS.FOOTER;
    // Set many invalid bytes
    for (let i = 7; i < 20; i++) {
      sysex[i] = 0xff;
    }

    const result = validateSysex(sysex);
    expect(result.valid).toBe(false);
    // Should have at most 5 specific byte errors + 1 "and more" message
    const byteErrors = result.errors.filter((e) => e.includes("Invalid data byte"));
    expect(byteErrors.length).toBeLessThanOrEqual(6);
  });
});

describe("tryParseSysex", () => {
  it("should return success for valid SysEx", () => {
    const data = new Uint8Array(448);
    const encodedBody = encode7BitData(data);
    const sysex = new Uint8Array(520);
    sysex.set(SYSEX_CONSTANTS.HEADER, 0);
    sysex.set(encodedBody, SYSEX_CONSTANTS.HEADER_LENGTH);
    sysex[519] = SYSEX_CONSTANTS.FOOTER;

    const result = tryParseSysex(sysex);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.body.length).toBe(448);
    }
  });

  it("should return errors for invalid SysEx", () => {
    const invalidSysex = new Uint8Array(100);

    const result = tryParseSysex(invalidSysex);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain("Invalid length");
    }
  });
});
