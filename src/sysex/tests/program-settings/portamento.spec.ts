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
    it.each(["dump1"])("should decode portamento settings from %s", (dumpFile) => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "..", "data", "dumps", `${dumpFile}.json`);
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

      const sysex = new Uint8Array(dumpData.rawData);

      const decoded = decodeMonologueParameters(sysex);

      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));
      expect(decoded.programSettings.portamento.time.value).toBe(parsedData.programSettings.portamento.time.value);
      expect(decoded.programSettings.portamento.mode.value).toBe(parsedData.programSettings.portamento.mode.value);
      expect(decoded.programSettings.portamento.slideTime.value).toBe(parsedData.programSettings.portamento.slideTime.value);
    });
  });

  describe("Round-trip", () => {
    it.each(["dump1"])("should preserve portamento settings through encode->decode cycle for %s", (dumpFile) => {
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

      const sysex = encodeMonologueParameters(originalParams);
      const decodedParams = decodeMonologueParameters(sysex);

      // Check portamento settings are preserved
      expect(decodedParams.programSettings.portamento.time.value).toBe(originalParams.programSettings.portamento.time.value);
      expect(decodedParams.programSettings.portamento.mode.value).toBe(originalParams.programSettings.portamento.mode.value);
      expect(decodedParams.programSettings.portamento.slideTime.value).toBe(
        originalParams.programSettings.portamento.slideTime.value
      );
    });
  });
});
