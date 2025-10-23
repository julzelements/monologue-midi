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
    it.each(["dump1"])("should decode VCO1 from %s", (dumpFile) => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "..", "data", "dumps", `${dumpFile}.json`);
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));

      const sysex = new Uint8Array(dumpData.rawData);
      const decoded = decodeMonologueParameters(sysex);

      const decodedVCO1 = decoded.panelSettings.oscilators.vco1;
      const expectedVCO1 = parsedData.panelSettings.oscilators.vco1;

      expect(decodedVCO1.pitch.value).toBe(expectedVCO1.pitch.value);
      expect(decodedVCO1.shape.value).toBe(expectedVCO1.shape.value);
      expect(decodedVCO1.level.value).toBe(expectedVCO1.level.value);
      expect(decodedVCO1.octave.value).toBe(expectedVCO1.octave.value);
      expect(decodedVCO1.wave.value).toBe(expectedVCO1.wave.value);
    });
  });

  describe("Round-trip", () => {
    it.each(["dump1"])("should preserve VCO1 through encode->decode cycle for %s", (dumpFile) => {
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

      const sysex = encodeMonologueParameters(originalParams);
      const decodedParams = decodeMonologueParameters(sysex);

      const originalVCO1 = originalParams.panelSettings.oscilators.vco1;
      const decodedVCO1 = decodedParams.panelSettings.oscilators.vco1;

      expect(decodedVCO1.pitch.value).toBe(originalVCO1.pitch.value);
      expect(decodedVCO1.shape.value).toBe(originalVCO1.shape.value);
      expect(decodedVCO1.level.value).toBe(originalVCO1.level.value);
      expect(decodedVCO1.octave.value).toBe(originalVCO1.octave.value);
      expect(decodedVCO1.wave.value).toBe(originalVCO1.wave.value);
    });
  });
});
