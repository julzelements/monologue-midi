/**
 * Test suite for Slider settings encoding/decoding
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { decodeMonologueParameters } from "../../decode";
import { encodeMonologueParameters } from "../../encode";

describe("Slider Parameters", () => {
  describe("Decoding", () => {
    it.each(["dump1"])("should decode slider settings from %s", (dumpFile) => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "..", "data", "dumps", `${dumpFile}.json`);
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

      const sysex = new Uint8Array(dumpData.rawData);

      const decoded = decodeMonologueParameters(sysex);

      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));
      expect(decoded.programSettings.slider.assign.value).toBe(parsedData.programSettings.slider.assign.value);
      expect(decoded.programSettings.slider.bendRangePlus.value).toBe(
        parsedData.programSettings.slider.bendRangePlus.value
      );
      expect(decoded.programSettings.slider.bendRangeMinus.value).toBe(
        parsedData.programSettings.slider.bendRangeMinus.value
      );
    });
  });

  describe("Round-trip", () => {
    it.each(["dump1"])("should preserve slider settings through encode->decode cycle for %s", (dumpFile) => {
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

      const sysex = encodeMonologueParameters(originalParams);
      const decodedParams = decodeMonologueParameters(sysex);

      // Check slider settings are preserved
      expect(decodedParams.programSettings.slider.assign.value).toBe(
        originalParams.programSettings.slider.assign.value
      );
      expect(decodedParams.programSettings.slider.bendRangePlus.value).toBe(
        originalParams.programSettings.slider.bendRangePlus.value
      );
      expect(decodedParams.programSettings.slider.bendRangeMinus.value).toBe(
        originalParams.programSettings.slider.bendRangeMinus.value
      );
    });
  });
});
