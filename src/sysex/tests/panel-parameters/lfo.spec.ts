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

      const decodedLFO = decoded.panelSettings.lfo;
      const expectedLFO = parsedData.panelSettings.lfo;

      expect(decodedLFO.wave.value).toBe(expectedLFO.wave.value);
      expect(decodedLFO.mode.value).toBe(expectedLFO.mode.value);
      expect(decodedLFO.rate.value).toBe(expectedLFO.rate.value);
      expect(decodedLFO.intensity.value).toBe(expectedLFO.intensity.value);
      expect(decodedLFO.target.value).toBe(expectedLFO.target.value);
    });
  });

  describe("Round-trip", () => {
    it.each(["dump1"])("should preserve LFO through encode->decode cycle for %s", (dumpFile) => {
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

      const sysex = encodeMonologueParameters(originalParams);
      const decodedParams = decodeMonologueParameters(sysex);

      const originalLFO = originalParams.panelSettings.lfo;
      const decodedLFO = decodedParams.panelSettings.lfo;

      // Check LFO is preserved
      expect(decodedLFO.wave.value).toBe(originalLFO.wave.value);
      expect(decodedLFO.mode.value).toBe(originalLFO.mode.value);
      expect(decodedLFO.rate.value).toBe(originalLFO.rate.value);
      // TODO: Test intensity when encoding/decoding is implemented - offsets need investigation
      expect(decodedLFO.intensity.value).toBe(originalLFO.intensity.value);
      expect(decodedLFO.target.value).toBe(originalLFO.target.value);
    });
  });
});
