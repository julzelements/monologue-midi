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
    it.each(["dump1"])("should decode LFO from %s", (dumpFile) => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "..", "data", "dumps", `${dumpFile}.json`);
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

      const sysex = new Uint8Array(dumpData.rawData);

      const decoded = decodeMonologueParameters(sysex);
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));
      expect(decoded.lfo.wave.value).toBe(parsedData.lfo.wave.value);
      expect(decoded.lfo.mode.value).toBe(parsedData.lfo.mode.value);
      expect(decoded.lfo.rate.value).toBe(parsedData.lfo.rate.value);
      expect(decoded.lfo.intensity.value).toBe(parsedData.lfo.intensity.value);
      expect(decoded.lfo.target.value).toBe(parsedData.lfo.target.value);
    });
  });

  describe("Round-trip", () => {
    it.each(["dump1"])("should preserve LFO through encode->decode cycle for %s", (dumpFile) => {
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

      const sysex = encodeMonologueParameters(originalParams);
      const decodedParams = decodeMonologueParameters(sysex);

      // Check LFO is preserved
      expect(decodedParams.lfo.wave.value).toBe(originalParams.lfo.wave.value);
      expect(decodedParams.lfo.mode.value).toBe(originalParams.lfo.mode.value);
      expect(decodedParams.lfo.rate.value).toBe(originalParams.lfo.rate.value);
      // TODO: Test intensity when encoding/decoding is implemented - offsets need investigation
      expect(decodedParams.lfo.intensity.value).toBe(originalParams.lfo.intensity.value);
      expect(decodedParams.lfo.target.value).toBe(originalParams.lfo.target.value);
    });
  });
});
