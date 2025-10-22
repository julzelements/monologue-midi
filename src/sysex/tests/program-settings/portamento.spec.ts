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
      expect(decoded.oscilators.vco2.pitch).toBeGreaterThanOrEqual(0);
      expect(decoded.oscilators.vco2.pitch).toBeLessThanOrEqual(1023);
      expect(decoded.oscilators.vco2.shape).toBeGreaterThanOrEqual(0);
      expect(decoded.oscilators.vco2.shape).toBeLessThanOrEqual(1023);
      expect(decoded.oscilators.vco2.level).toBeGreaterThanOrEqual(0);
      expect(decoded.oscilators.vco2.level).toBeLessThanOrEqual(1023);
      expect(decoded.oscilators.vco2.octave).toBeGreaterThanOrEqual(0);
      expect(decoded.oscilators.vco2.octave).toBeLessThanOrEqual(3);
      expect(decoded.oscilators.vco2.wave).toBeGreaterThanOrEqual(0);
      expect(decoded.oscilators.vco2.wave).toBeLessThanOrEqual(2);

      // Load parsed data to compare
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));
      expect(decoded.oscilators.vco2.pitch).toBe(parsedData.oscilators.vco2.pitch);
      expect(decoded.oscilators.vco2.shape).toBe(parsedData.oscilators.vco2.shape);
      expect(decoded.oscilators.vco2.level).toBe(parsedData.oscilators.vco2.level);
      expect(decoded.oscilators.vco2.octave).toBe(parsedData.oscilators.vco2.octave);
      expect(decoded.oscilators.vco2.wave).toBe(parsedData.oscilators.vco2.wave);
    });
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

        // Check Portamento is preserved
        expect(decodedParams.oscilators.vco2.pitch).toBe(originalParams.oscilators.vco2.pitch);
        expect(decodedParams.oscilators.vco2.shape).toBe(originalParams.oscilators.vco2.shape);
        expect(decodedParams.oscilators.vco2.level).toBe(originalParams.oscilators.vco2.level);
        expect(decodedParams.oscilators.vco2.octave).toBe(originalParams.oscilators.vco2.octave);
        expect(decodedParams.oscilators.vco2.wave).toBe(originalParams.oscilators.vco2.wave);
      }
    );
  });
});
