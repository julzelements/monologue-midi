/**
 * Test suite for Pitch settings encoding/decoding
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { decodeMonologueParameters } from "../../decode";
import { encodeMonologueParameters } from "../../encode";

describe("Pitch Parameters", () => {
  describe("Decoding", () => {
    it.each(["dump1"])("should decode pitch settings from %s", (dumpFile) => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "..", "data", "dumps", `${dumpFile}.json`);
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

      const sysex = new Uint8Array(dumpData.rawData);

      const decoded = decodeMonologueParameters(sysex);

      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));
      expect(decoded.programSettings.pitch.programTuning.value).toBe(
        parsedData.programSettings.pitch.programTuning.value
      );
      // TODO: try saving a patch with a non-default microtuning that is not Equal Temp: 0.
      expect(decoded.programSettings.pitch.microTuning.value).toBe(parsedData.programSettings.pitch.microTuning.value);
      expect(decoded.programSettings.pitch.scaleKey.value).toBe(parsedData.programSettings.pitch.scaleKey.value);
    });
  });

  describe("Round-trip", () => {
    it.each(["dump1"])("should preserve pitch settings through encode->decode cycle for %s", (dumpFile) => {
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

      const sysex = encodeMonologueParameters(originalParams);
      const decodedParams = decodeMonologueParameters(sysex);

      // Check pitch settings are preserved
      expect(decodedParams.programSettings.pitch.programTuning.value).toBe(
        originalParams.programSettings.pitch.programTuning.value
      );
      expect(decodedParams.programSettings.pitch.microTuning.value).toBe(
        originalParams.programSettings.pitch.microTuning.value
      );
      expect(decodedParams.programSettings.pitch.scaleKey.value).toBe(
        originalParams.programSettings.pitch.scaleKey.value
      );
    });
  });
});
