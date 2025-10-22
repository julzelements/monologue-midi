/**
 * Test suite for Pitch settings encoding/decoding
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { decodeMonologueParameters } from "../../decode";
import { encodeMonologueParameters } from "../../encode";

describe("Pitch Parameters", () => {
  describe("Decoding", () => {
    it.each(["dump1", "dump2", "dump3", "dump4", "dump5"])("should decode pitch settings from %s", (dumpFile) => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "..", "data", "dumps", `${dumpFile}.json`);
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

      // Get the raw SysEx data
      const sysex = new Uint8Array(dumpData.rawData);

      // Decode the SysEx
      const decoded = decodeMonologueParameters(sysex);

      // Check that Pitch settings are valid
      expect(decoded.programSettings.pitch.programTuning).toBeGreaterThanOrEqual(0);
      expect(decoded.programSettings.pitch.programTuning).toBeLessThanOrEqual(100);
      expect(decoded.programSettings.pitch.microTuning).toBeGreaterThanOrEqual(0);
      expect(decoded.programSettings.pitch.microTuning).toBeLessThanOrEqual(139);
      expect(decoded.programSettings.pitch.scaleKey).toBeGreaterThanOrEqual(0);
      expect(decoded.programSettings.pitch.scaleKey).toBeLessThanOrEqual(24);

      // Load parsed data to compare
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));
      expect(decoded.programSettings.pitch.programTuning).toBe(parsedData.programSettings.pitch.programTuning);
      // TODO: try saving a patch with a non-default microtuning that is not Equal Temp: 0.
      expect(decoded.programSettings.pitch.microTuning).toBe(parsedData.programSettings.pitch.microTuning);
      expect(decoded.programSettings.pitch.scaleKey).toBe(parsedData.programSettings.pitch.scaleKey);
    });
  });

  describe("Round-trip", () => {
    it.each(["dump1", "dump2", "dump3", "dump4", "dump5"])(
      "should preserve pitch settings through encode->decode cycle for %s",
      (dumpFile) => {
        // Load parsed data
        const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
        const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

        // Encode to SysEx
        const sysex = encodeMonologueParameters(originalParams);

        // Decode back
        const decodedParams = decodeMonologueParameters(sysex);

        // Check pitch settings are preserved
        expect(decodedParams.programSettings.pitch.programTuning).toBe(
          originalParams.programSettings.pitch.programTuning
        );
        expect(decodedParams.programSettings.pitch.microTuning).toBe(originalParams.programSettings.pitch.microTuning);
        expect(decodedParams.programSettings.pitch.scaleKey).toBe(originalParams.programSettings.pitch.scaleKey);
      }
    );
  });
});
