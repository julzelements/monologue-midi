/**
 * Test suite for VCO1 parameter encoding/decoding
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { decodeMonologueParameters } from "../../decode";
import { encodeMonologueParameters } from "../../encode";

describe("VCO1 Parameters", () => {
  describe("Decoding", () => {
    it("should decode VCO1 values from dump1.json", () => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "..", "data", "dumps", "dump1.json");
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

      // Get the raw SysEx data
      const sysex = new Uint8Array(dumpData.rawData);

      // Decode the SysEx
      const decoded = decodeMonologueParameters(sysex);

      // Check that VCO1 values are valid
      expect(decoded.oscilators.vco1.pitch).toBeGreaterThanOrEqual(0);
      expect(decoded.oscilators.vco1.pitch).toBeLessThanOrEqual(1023);

      expect(decoded.oscilators.vco1.shape).toBeGreaterThanOrEqual(0);
      expect(decoded.oscilators.vco1.shape).toBeLessThanOrEqual(1023);

      expect(decoded.oscilators.vco1.level).toBeGreaterThanOrEqual(0);
      expect(decoded.oscilators.vco1.level).toBeLessThanOrEqual(1023);

      expect(decoded.oscilators.vco1.octave).toBeGreaterThanOrEqual(0);
      expect(decoded.oscilators.vco1.octave).toBeLessThanOrEqual(3);

      expect(decoded.oscilators.vco1.wave).toBeGreaterThanOrEqual(0);
      expect(decoded.oscilators.vco1.wave).toBeLessThanOrEqual(2);

      // Compare with expected value from parsed file
      const parsedPath = join(__dirname, "..", "data", "parsed", "dump1.json");
      const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));
      expect(decoded.oscilators.vco1.pitch).toBe(parsedData.oscilators.vco1.pitch);
      expect(decoded.oscilators.vco1.shape).toBe(parsedData.oscilators.vco1.shape);
      expect(decoded.oscilators.vco1.level).toBe(parsedData.oscilators.vco1.level);
      expect(decoded.oscilators.vco1.octave).toBe(parsedData.oscilators.vco1.octave);
      expect(decoded.oscilators.vco1.wave).toBe(parsedData.oscilators.vco1.wave);
    });

    it.each(["dump1", "dump2", "dump3", "dump4", "dump5"])("should decode VCO1 from %s", (dumpFile) => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "..", "data", "dumps", `${dumpFile}.json`);
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

      // Get the raw SysEx data
      const sysex = new Uint8Array(dumpData.rawData);

      // Decode the SysEx
      const decoded = decodeMonologueParameters(sysex);

      // Check that VCO1 values are valid
      expect(decoded.oscilators.vco1.pitch).toBeGreaterThanOrEqual(0);
      expect(decoded.oscilators.vco1.pitch).toBeLessThanOrEqual(1023);
      expect(decoded.oscilators.vco1.shape).toBeGreaterThanOrEqual(0);
      expect(decoded.oscilators.vco1.shape).toBeLessThanOrEqual(1023);
      expect(decoded.oscilators.vco1.level).toBeGreaterThanOrEqual(0);
      expect(decoded.oscilators.vco1.level).toBeLessThanOrEqual(1023);
      expect(decoded.oscilators.vco1.octave).toBeGreaterThanOrEqual(0);
      expect(decoded.oscilators.vco1.octave).toBeLessThanOrEqual(3);
      expect(decoded.oscilators.vco1.wave).toBeGreaterThanOrEqual(0);
      expect(decoded.oscilators.vco1.wave).toBeLessThanOrEqual(2);

      // Load parsed data to compare
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));
      expect(decoded.oscilators.vco1.pitch).toBe(parsedData.oscilators.vco1.pitch);
      expect(decoded.oscilators.vco1.shape).toBe(parsedData.oscilators.vco1.shape);
      expect(decoded.oscilators.vco1.level).toBe(parsedData.oscilators.vco1.level);
      expect(decoded.oscilators.vco1.octave).toBe(parsedData.oscilators.vco1.octave);
      expect(decoded.oscilators.vco1.wave).toBe(parsedData.oscilators.vco1.wave);
    });
  });

  describe("Encoding", () => {
    it.each(["dump1", "dump2", "dump3", "dump4", "dump5"])(
      "should encode VCO1 values correctly from %s",
      (dumpFile) => {
        // Load parsed data
        const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
        const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

        // Encode to SysEx
        const sysex = encodeMonologueParameters(originalParams);

        // Decode back
        const decoded = decodeMonologueParameters(sysex);

        // Verify VCO1 values match original
        expect(decoded.oscilators.vco1.pitch).toBe(originalParams.oscilators.vco1.pitch);
        expect(decoded.oscilators.vco1.shape).toBe(originalParams.oscilators.vco1.shape);
        expect(decoded.oscilators.vco1.level).toBe(originalParams.oscilators.vco1.level);
        expect(decoded.oscilators.vco1.octave).toBe(originalParams.oscilators.vco1.octave);
        expect(decoded.oscilators.vco1.wave).toBe(originalParams.oscilators.vco1.wave);
      }
    );
  });

  describe("Round-trip", () => {
    it.each(["dump1", "dump2", "dump3", "dump4", "dump5"])(
      "should preserve VCO1 through encode->decode cycle for %s",
      (dumpFile) => {
        // Load parsed data
        const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
        const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

        // Encode to SysEx
        const sysex = encodeMonologueParameters(originalParams);

        // Decode back
        const decodedParams = decodeMonologueParameters(sysex);

        // Check VCO1 is preserved
        expect(decodedParams.oscilators.vco1.pitch).toBe(originalParams.oscilators.vco1.pitch);
        expect(decodedParams.oscilators.vco1.shape).toBe(originalParams.oscilators.vco1.shape);
        expect(decodedParams.oscilators.vco1.level).toBe(originalParams.oscilators.vco1.level);
        expect(decodedParams.oscilators.vco1.octave).toBe(originalParams.oscilators.vco1.octave);
        expect(decodedParams.oscilators.vco1.wave).toBe(originalParams.oscilators.vco1.wave);
      }
    );
  });
});
