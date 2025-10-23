/**
 * Test suite for encoding and decoding SysEx data
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { decodeMonologueParameters } from "../decode";
import { encodeMonologueParameters } from "../encode";

describe("SysEx Encode/Decode", () => {
  const dumpFiles = ["dump1"];

  // Expected program names for each dump file
  const expectedProgramNames = {
    dump1: "<afx acid3>",
    dump2: "Injection",
    dump3: "Anfem",
    dump4: "<wavetable>",
    dump5: "Lu-Fuki",
  };

  describe("PROG marker validation", () => {
    it("should validate PROG marker in dump1.json", () => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "data", "dumps", "dump1.json");
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

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
      it(`should decode ${dumpFile}.json and extract patchName`, () => {
        // Load the raw SysEx dump data
        const dumpPath = join(__dirname, "data", "dumps", `${dumpFile}.json`);
        const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

        // Get the raw SysEx data
        const sysex = new Uint8Array(dumpData.rawData);

        // Decode the SysEx
        const decoded = decodeMonologueParameters(sysex);

        // Check that patchName matches expected value
        const expected = expectedProgramNames[dumpFile as keyof typeof expectedProgramNames];
        expect(decoded.patchName).toBe(expected);
      });
    });
  });

  describe("Encode SysEx", () => {
    dumpFiles.forEach((dumpFile) => {
      it(`should encode ${dumpFile}.json patchName to SysEx`, () => {
        // Load the JSON data
        const filePath = join(__dirname, "data", "parsed", `${dumpFile}.json`);
        const params = JSON.parse(readFileSync(filePath, "utf8"));

        // Encode to SysEx
        const sysex = encodeMonologueParameters(params);

        // Decode back
        const decoded = decodeMonologueParameters(sysex);

        // Check that patchName matches
        const expected = expectedProgramNames[dumpFile as keyof typeof expectedProgramNames];
        expect(decoded.patchName).toBe(expected);
      });
    });
  });

  describe("Round-trip encoding/decoding", () => {
    dumpFiles.forEach((dumpFile) => {
      it(`should preserve patchName in round-trip for ${dumpFile}`, () => {
        // Load the JSON data
        const filePath = join(__dirname, "data", "parsed", `${dumpFile}.json`);
        const originalParams = JSON.parse(readFileSync(filePath, "utf8"));

        // Encode to SysEx
        const sysex = encodeMonologueParameters(originalParams);

        // Decode back
        const decodedParams = decodeMonologueParameters(sysex);

        // Check patchName is preserved
        const expectedName = expectedProgramNames[dumpFile as keyof typeof expectedProgramNames];
        expect(decodedParams.patchName).toBe(expectedName);
      });
    });
  });
});
