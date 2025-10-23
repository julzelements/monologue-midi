/**
 * Test suite for EG (Envelope Generator) parameter encoding/decoding
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { decodeMonologueParameters } from "../../decode";
import { encodeMonologueParameters } from "../../encode";

describe("EG (Envelope Generator) Parameters", () => {
  describe("Decoding", () => {
    it.each(["dump1"])("should decode EG from %s", (dumpFile) => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "..", "data", "dumps", `${dumpFile}.json`);
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

      const sysex = new Uint8Array(dumpData.rawData);

      const decoded = decodeMonologueParameters(sysex);

      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));

      const decodedEG = decoded.panelSettings.envelope;
      const expectedEG = parsedData.panelSettings.envelope;

      expect(decodedEG.type.value).toBe(expectedEG.type.value);
      expect(decodedEG.attack.value).toBe(expectedEG.attack.value);
      expect(decodedEG.decay.value).toBe(expectedEG.decay.value);
      expect(decodedEG.intensity.value).toBe(expectedEG.intensity.value);
      expect(decodedEG.target.value).toBe(expectedEG.target.value);
    });
  });

  describe("Round-trip", () => {
    it.each(["dump1"])("should preserve EG through encode->decode cycle for %s", (dumpFile) => {
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

      const sysex = encodeMonologueParameters(originalParams);
      const decodedParams = decodeMonologueParameters(sysex);

      const originalEG = originalParams.panelSettings.envelope;
      const decodedEG = decodedParams.panelSettings.envelope;

      // Check EG is preserved
      expect(decodedEG.type.value).toBe(originalEG.type.value);
      expect(decodedEG.attack.value).toBe(originalEG.attack.value);
      expect(decodedEG.decay.value).toBe(originalEG.decay.value);
      expect(decodedEG.intensity.value).toBe(originalEG.intensity.value);
      expect(decodedEG.target.value).toBe(originalEG.target.value);
    });
  });
});
