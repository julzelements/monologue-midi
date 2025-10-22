/**
 * Test suite for Portamento settings encoding/decoding
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { decodeMonologueParameters } from "../../decode";
import { encodeMonologueParameters } from "../../encode";

describe("Portamento Parameters", () => {
  describe("Decoding", () => {
    it.each(["dump1", "dump2", "dump3", "dump4", "dump5"])("should decode portamento settings from %s", (dumpFile) => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "..", "data", "dumps", `${dumpFile}.json`);
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

      // Get the raw SysEx data
      const sysex = new Uint8Array(dumpData.rawData);

      // Decode the SysEx
      const decoded = decodeMonologueParameters(sysex);

      // Check that Portamento settings are valid
      expect(decoded.programSettings.portamento.time).toBeGreaterThanOrEqual(0);
      expect(decoded.programSettings.portamento.time).toBeLessThanOrEqual(128);
      expect(decoded.programSettings.portamento.mode).toBeGreaterThanOrEqual(0);
      expect(decoded.programSettings.portamento.mode).toBeLessThanOrEqual(1);
      expect(decoded.programSettings.portamento.slideTime).toBeGreaterThanOrEqual(0);
      expect(decoded.programSettings.portamento.slideTime).toBeLessThanOrEqual(72);

      // Load parsed data to compare
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));
      expect(decoded.programSettings.portamento.time).toBe(parsedData.programSettings.portamento.time);
      expect(decoded.programSettings.portamento.mode).toBe(parsedData.programSettings.portamento.mode);
      expect(decoded.programSettings.portamento.slideTime).toBe(parsedData.programSettings.portamento.slideTime);
    });
  });

  describe("Encoding", () => {
    it.each(["dump1", "dump2", "dump3", "dump4", "dump5"])(
      "should encode portamento settings correctly from %s",
      (dumpFile) => {
        // Load parsed data
        const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
        const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

        // Encode to SysEx
        const sysex = encodeMonologueParameters(originalParams);

        // Decode back
        const decoded = decodeMonologueParameters(sysex);

        // Verify portamento settings match original
        expect(decoded.programSettings.portamento.time).toBe(originalParams.programSettings.portamento.time);
        expect(decoded.programSettings.portamento.mode).toBe(originalParams.programSettings.portamento.mode);
        expect(decoded.programSettings.portamento.slideTime).toBe(originalParams.programSettings.portamento.slideTime);
      }
    );
  });

  describe("Round-trip", () => {
    it.each(["dump1", "dump2", "dump3", "dump4", "dump5"])(
      "should preserve portamento settings through encode->decode cycle for %s",
      (dumpFile) => {
        // Load parsed data
        const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
        const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

        // Encode to SysEx
        const sysex = encodeMonologueParameters(originalParams);

        // Decode back
        const decodedParams = decodeMonologueParameters(sysex);

        // Check portamento settings are preserved
        expect(decodedParams.programSettings.portamento.time).toBe(originalParams.programSettings.portamento.time);
        expect(decodedParams.programSettings.portamento.mode).toBe(originalParams.programSettings.portamento.mode);
        expect(decodedParams.programSettings.portamento.slideTime).toBe(
          originalParams.programSettings.portamento.slideTime
        );
      }
    );
  });
});
