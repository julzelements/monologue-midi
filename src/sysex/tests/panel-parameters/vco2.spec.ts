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

      const decodedVCO2 = decoded.panelSettings.oscilators.vco2;
      const expectedVCO2 = parsedData.panelSettings.oscilators.vco2;

      expect(decodedVCO2.pitch.value).toBe(expectedVCO2.pitch.value);
      expect(decodedVCO2.shape.value).toBe(expectedVCO2.shape.value);
      expect(decodedVCO2.level.value).toBe(expectedVCO2.level.value);
      expect(decodedVCO2.octave.value).toBe(expectedVCO2.octave.value);
      expect(decodedVCO2.wave.value).toBe(expectedVCO2.wave.value);
    });
  });

  describe("Round-trip", () => {
    it.each(["dump1"])("should preserve VCO2 through encode->decode cycle for %s", (dumpFile) => {
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

      const sysex = encodeMonologueParameters(originalParams);
      const decodedParams = decodeMonologueParameters(sysex);

      const originalVCO2 = originalParams.panelSettings.oscilators.vco2;
      const decodedVCO2 = decodedParams.panelSettings.oscilators.vco2;

      expect(decodedVCO2.pitch.value).toBe(originalVCO2.pitch.value);
      expect(decodedVCO2.shape.value).toBe(originalVCO2.shape.value);
      expect(decodedVCO2.level.value).toBe(originalVCO2.level.value);
      expect(decodedVCO2.octave.value).toBe(originalVCO2.octave.value);
      expect(decodedVCO2.wave.value).toBe(originalVCO2.wave.value);
    });
  });
});
