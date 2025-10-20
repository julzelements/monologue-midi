/**
 * Test suite for encoding and decoding SysEx data
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { decodeMonologueParameters } from "../decode";
import { encodeMonologueParameters } from "../encode";

describe("SysEx Encode/Decode", () => {
  const dumpFiles = ["dump1", "dump2", "dump3", "dump4", "dump5"];

  // Expected filter values for each dump file
  const expectedFilterValues = {
    dump1: { cutoff: 488, resonance: 909 },
    dump2: { cutoff: 687, resonance: 852 },
    dump3: { cutoff: 90, resonance: 579 },
    dump4: { cutoff: 756, resonance: 0 },
    dump5: { cutoff: 176, resonance: 736 },
  };

  describe("PROG marker validation", () => {
    it("should validate PROG marker in dump1.json", () => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "data", "dumps", "dump1.json");
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

      // Get the raw SysEx data
      const sysex = new Uint8Array(dumpData.rawData);

      // This should not throw - PROG marker should be valid
      expect(() => decodeMonologueParameters(sysex)).not.toThrow();
    });

    it("should throw error for invalid PROG marker", () => {
      // Load a valid dump first
      const dumpPath = join(__dirname, "data", "dumps", "dump1.json");
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));
      const sysex = new Uint8Array(dumpData.rawData);

      // Corrupt the PROG marker by changing 'P' (80) to 'X' (88)
      // In the 7-bit encoding, the first data byte group starts at offset 7
      // Byte 8 contains 'P' (0x50), so we change it to 'X' (0x58)
      const corruptedSysex = new Uint8Array(sysex);
      corruptedSysex[8] = 0x58; // Change 'P' (0x50) to 'X' (0x58)

      // This should throw an error about invalid PROG marker
      expect(() => decodeMonologueParameters(corruptedSysex)).toThrow(/Invalid program data.*PROG/);
    });
  });

  describe("Decode SysEx", () => {
    dumpFiles.forEach((dumpFile) => {
      it(`should decode ${dumpFile}.json and extract filter.cutoff`, () => {
        // Load the raw SysEx dump data
        const dumpPath = join(__dirname, "data", "dumps", `${dumpFile}.json`);
        const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

        // Get the raw SysEx data
        const sysex = new Uint8Array(dumpData.rawData);

        // Decode the SysEx
        const decoded = decodeMonologueParameters(sysex);

        // Check that cutoff matches expected value
        const expected = expectedFilterValues[dumpFile as keyof typeof expectedFilterValues];
        expect(decoded.filter.cutoff).toBe(expected.cutoff);
      });

      it(`should decode ${dumpFile}.json and extract filter.resonance`, () => {
        // Load the raw SysEx dump data
        const dumpPath = join(__dirname, "data", "dumps", `${dumpFile}.json`);
        const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

        // Get the raw SysEx data
        const sysex = new Uint8Array(dumpData.rawData);

        // Decode the SysEx
        const decoded = decodeMonologueParameters(sysex);

        // Check that resonance matches expected value
        const expected = expectedFilterValues[dumpFile as keyof typeof expectedFilterValues];
        expect(decoded.filter.resonance).toBe(expected.resonance);
      });
    });
  });

  describe("Encode SysEx", () => {
    dumpFiles.forEach((dumpFile) => {
      it(`should encode ${dumpFile}.json filter.cutoff to SysEx`, () => {
        // Load the JSON data
        const filePath = join(__dirname, "data", "parsed", `${dumpFile}.json`);
        const params = JSON.parse(readFileSync(filePath, "utf8"));

        // Encode to SysEx
        const sysex = encodeMonologueParameters(params);

        // Decode back
        const decoded = decodeMonologueParameters(sysex);

        // Check that cutoff matches
        const expected = expectedFilterValues[dumpFile as keyof typeof expectedFilterValues];
        expect(decoded.filter.cutoff).toBe(expected.cutoff);
      });

      it(`should encode ${dumpFile}.json filter.resonance to SysEx`, () => {
        // Load the JSON data
        const filePath = join(__dirname, "data", "parsed", `${dumpFile}.json`);
        const params = JSON.parse(readFileSync(filePath, "utf8"));

        // Encode to SysEx
        const sysex = encodeMonologueParameters(params);

        // Decode back
        const decoded = decodeMonologueParameters(sysex);

        // Check that resonance matches
        const expected = expectedFilterValues[dumpFile as keyof typeof expectedFilterValues];
        expect(decoded.filter.resonance).toBe(expected.resonance);
      });
    });
  });

  describe("Round-trip encoding/decoding", () => {
    dumpFiles.forEach((dumpFile) => {
      it(`should preserve filter values in round-trip for ${dumpFile}`, () => {
        // Load the JSON data
        const filePath = join(__dirname, "data", "parsed", `${dumpFile}.json`);
        const originalParams = JSON.parse(readFileSync(filePath, "utf8"));

        // Encode to SysEx
        const sysex = encodeMonologueParameters(originalParams);

        // Decode back
        const decodedParams = decodeMonologueParameters(sysex);

        // Check both cutoff and resonance are preserved
        const expected = expectedFilterValues[dumpFile as keyof typeof expectedFilterValues];
        expect(decodedParams.filter.cutoff).toBe(expected.cutoff);
        expect(decodedParams.filter.resonance).toBe(expected.resonance);
      });
    });
  });
});
