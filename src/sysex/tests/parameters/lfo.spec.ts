/**
 * Test suite for LFO parameter encoding/decoding
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { decodeMonologueParameters } from "../../decode";
import { encodeMonologueParameters } from "../../encode";

describe("LFO Parameters", () => {
  describe("Decoding", () => {
    it.each(["dump1", "dump2", "dump3", "dump4", "dump5"])("should decode LFO from %s", (dumpFile) => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "..", "data", "dumps", `${dumpFile}.json`);
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

      // Get the raw SysEx data
      const sysex = new Uint8Array(dumpData.rawData);

      // Decode the SysEx
      const decoded = decodeMonologueParameters(sysex);

      // Check that LFO values are valid
      expect(decoded.lfo.wave).toBeGreaterThanOrEqual(0);
      expect(decoded.lfo.wave).toBeLessThanOrEqual(2);
      expect(decoded.lfo.mode).toBeGreaterThanOrEqual(0);
      expect(decoded.lfo.mode).toBeLessThanOrEqual(2);
      expect(decoded.lfo.rate).toBeGreaterThanOrEqual(0);
      expect(decoded.lfo.rate).toBeLessThanOrEqual(1023);
      // TODO: Test intensity when decoding is implemented - offsets need investigation
      // expect(decoded.lfo.intensity).toBeGreaterThanOrEqual(0);
      // expect(decoded.lfo.intensity).toBeLessThanOrEqual(1023);
      expect(decoded.lfo.target).toBeGreaterThanOrEqual(0);
      expect(decoded.lfo.target).toBeLessThanOrEqual(2);

      // Load parsed data to compare
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));
      expect(decoded.lfo.wave).toBe(parsedData.lfo.wave);
      expect(decoded.lfo.mode).toBe(parsedData.lfo.mode);
      expect(decoded.lfo.rate).toBe(parsedData.lfo.rate);
      // TODO: Test intensity when decoding is implemented - offsets need investigation
      // expect(decoded.lfo.intensity).toBe(parsedData.lfo.intensity);
      expect(decoded.lfo.target).toBe(parsedData.lfo.target);
    });
  });

  describe("Encoding", () => {
    it.each(["dump1", "dump2", "dump3", "dump4", "dump5"])("should encode LFO values correctly from %s", (dumpFile) => {
      // Load parsed data
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

      // Encode to SysEx
      const sysex = encodeMonologueParameters(originalParams);

      // Decode back
      const decoded = decodeMonologueParameters(sysex);

      // Verify LFO values match original
      expect(decoded.lfo.wave).toBe(originalParams.lfo.wave);
      expect(decoded.lfo.mode).toBe(originalParams.lfo.mode);
      expect(decoded.lfo.rate).toBe(originalParams.lfo.rate);
      // TODO: Test intensity when encoding is implemented - offsets need investigation
      // expect(decoded.lfo.intensity).toBe(originalParams.lfo.intensity);
      expect(decoded.lfo.target).toBe(originalParams.lfo.target);
    });
  });

  describe("Round-trip", () => {
    it.each(["dump1", "dump2", "dump3", "dump4", "dump5"])(
      "should preserve LFO through encode->decode cycle for %s",
      (dumpFile) => {
        // Load parsed data
        const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
        const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

        // Encode to SysEx
        const sysex = encodeMonologueParameters(originalParams);

        // Decode back
        const decodedParams = decodeMonologueParameters(sysex);

        // Check LFO is preserved
        expect(decodedParams.lfo.wave).toBe(originalParams.lfo.wave);
        expect(decodedParams.lfo.mode).toBe(originalParams.lfo.mode);
        expect(decodedParams.lfo.rate).toBe(originalParams.lfo.rate);
        // TODO: Test intensity when encoding/decoding is implemented - offsets need investigation
        // expect(decodedParams.lfo.intensity).toBe(originalParams.lfo.intensity);
        expect(decodedParams.lfo.target).toBe(originalParams.lfo.target);
      }
    );
  });
});
