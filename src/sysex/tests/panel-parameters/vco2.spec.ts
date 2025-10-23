/**
 * Test suite for VCO2 parameter encoding/decoding
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { decodeMonologueParameters } from "../../decode";
import { encodeMonologueParameters } from "../../encode";

describe("VCO2 Parameters", () => {
  describe("Decoding", () => {
    it.each(["dump1"])("should decode VCO2 from %s", (dumpFile) => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "..", "data", "dumps", `${dumpFile}.json`);
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));

      const sysex = new Uint8Array(dumpData.rawData);
      const decoded = decodeMonologueParameters(sysex);

      expect(decoded.oscilators.vco2.pitch.value).toBe(parsedData.oscilators.vco2.pitch.value);
      expect(decoded.oscilators.vco2.shape.value).toBe(parsedData.oscilators.vco2.shape.value);
      expect(decoded.oscilators.vco2.level.value).toBe(parsedData.oscilators.vco2.level.value);
      expect(decoded.oscilators.vco2.octave.value).toBe(parsedData.oscilators.vco2.octave.value);
      expect(decoded.oscilators.vco2.wave.value).toBe(parsedData.oscilators.vco2.wave.value);
    });
  });

  describe("Round-trip", () => {
    it.each(["dump1"])("should preserve VCO2 through encode->decode cycle for %s", (dumpFile) => {
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

      const sysex = encodeMonologueParameters(originalParams);
      const decodedParams = decodeMonologueParameters(sysex);

      expect(decodedParams.oscilators.vco2.pitch.value).toBe(originalParams.oscilators.vco2.pitch.value);
      expect(decodedParams.oscilators.vco2.shape.value).toBe(originalParams.oscilators.vco2.shape.value);
      expect(decodedParams.oscilators.vco2.level.value).toBe(originalParams.oscilators.vco2.level.value);
      expect(decodedParams.oscilators.vco2.octave.value).toBe(originalParams.oscilators.vco2.octave.value);
      expect(decodedParams.oscilators.vco2.wave.value).toBe(originalParams.oscilators.vco2.wave.value);
    });
  });
});
