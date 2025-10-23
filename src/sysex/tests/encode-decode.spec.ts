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

    it("should encode parsed dump1 to match original raw data", () => {
      // Load the parsed JSON data
      const parsedPath = join(__dirname, "data", "parsed", "dump1.json");
      const parsedParams = JSON.parse(readFileSync(parsedPath, "utf8"));

      // Load the original raw SysEx dump data
      const dumpPath = join(__dirname, "data", "dumps", "dump1.json");
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));
      const expectedSysex = new Uint8Array(dumpData.rawData);

      // Encode the parsed parameters
      const encodedSysex = encodeMonologueParameters(parsedParams);

      // Compare byte by byte
      expect(encodedSysex.length).toBe(expectedSysex.length);

      // Find and report differences
      const differences: Array<{ index: number; expected: number; received: number }> = [];
      for (let i = 0; i < expectedSysex.length; i++) {
        if (encodedSysex[i] !== expectedSysex[i]) {
          differences.push({
            index: i,
            expected: expectedSysex[i],
            received: encodedSysex[i],
          });
        }
      }

      if (differences.length > 0) {
        console.log("\n=== Byte Differences ===");
        console.log(`Total differences: ${differences.length} out of ${expectedSysex.length} bytes\n`);

        differences.forEach((diff) => {
          const start = Math.max(0, diff.index - 2);
          const end = Math.min(expectedSysex.length, diff.index + 3);
          const context = Array.from(expectedSysex.slice(start, end));
          const receivedContext = Array.from(encodedSysex.slice(start, end));

          console.log(`Position ${diff.index} (0x${diff.index.toString(16).padStart(3, "0")}):`);
          console.log(
            `  Expected: ${diff.expected.toString().padStart(3)} (0x${diff.expected.toString(16).padStart(2, "0")})`
          );
          console.log(
            `  Received: ${diff.received.toString().padStart(3)} (0x${diff.received.toString(16).padStart(2, "0")})`
          );
          console.log(`  Context (expected): [${context.map((b) => b.toString().padStart(3)).join(", ")}]`);
          console.log(`  Context (received): [${receivedContext.map((b) => b.toString().padStart(3)).join(", ")}]`);
          console.log("");
        });
      }

      expect(Array.from(encodedSysex)).toEqual(Array.from(expectedSysex));
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
