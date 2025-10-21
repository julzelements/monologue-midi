/**
 * Test suite for drive parameter encoding/decoding
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { decodeMonologueParameters } from "../../decode";
import { encodeMonologueParameters } from "../../encode";

describe("Drive Parameter", () => {
  describe("Decoding", () => {
    it("should decode drive value from dump1.json", () => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "..", "data", "dumps", "dump1.json");
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

      // Get the raw SysEx data
      const sysex = new Uint8Array(dumpData.rawData);

      // Decode the SysEx
      const decoded = decodeMonologueParameters(sysex);

      // Check that drive is a valid 10-bit value (0-1023)
      expect(decoded.drive).toBeGreaterThanOrEqual(0);
      expect(decoded.drive).toBeLessThanOrEqual(1023);

      // Compare with expected value from parsed file
      const parsedPath = join(__dirname, "..", "data", "parsed", "dump1.json");
      const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));
      expect(decoded.drive).toBe(parsedData.drive);
    });

    it("should decode drive from all dump files", () => {
      const dumpFiles = ["dump1", "dump2", "dump3", "dump4", "dump5"];

      dumpFiles.forEach((dumpFile) => {
        // Load the raw SysEx dump data
        const dumpPath = join(__dirname, "..", "data", "dumps", `${dumpFile}.json`);
        const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

        // Get the raw SysEx data
        const sysex = new Uint8Array(dumpData.rawData);

        // Decode the SysEx
        const decoded = decodeMonologueParameters(sysex);

        // Check that drive is a valid 10-bit value (0-1023)
        expect(decoded.drive).toBeGreaterThanOrEqual(0);
        expect(decoded.drive).toBeLessThanOrEqual(1023);

        // Load parsed data to compare
        const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
        const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));
        expect(decoded.drive).toBe(parsedData.drive);
      });
    });
  });

  describe("Encoding", () => {
    it("should encode drive value correctly", () => {
      const dumpFiles = ["dump1", "dump2", "dump3", "dump4", "dump5"];

      dumpFiles.forEach((dumpFile) => {
        // Load parsed data
        const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
        const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

        // Encode to SysEx
        const sysex = encodeMonologueParameters(originalParams);

        // Decode back
        const decoded = decodeMonologueParameters(sysex);

        // Verify drive matches original
        expect(decoded.drive).toBe(originalParams.drive);
      });
    });
  });

  describe("Round-trip", () => {
    it("should preserve drive through encode->decode cycle", () => {
      const dumpFiles = ["dump1", "dump2", "dump3", "dump4", "dump5"];

      dumpFiles.forEach((dumpFile) => {
        // Load parsed data
        const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
        const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

        // Encode to SysEx
        const sysex = encodeMonologueParameters(originalParams);

        // Decode back
        const decodedParams = decodeMonologueParameters(sysex);

        // Check drive is preserved
        expect(decodedParams.drive).toBe(originalParams.drive);
      });
    });
  });
});
