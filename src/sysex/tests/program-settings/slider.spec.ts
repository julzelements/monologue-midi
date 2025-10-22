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
    it.each(["dump1", "dump2", "dump3", "dump4", "dump5"])("should decode slider settings from %s", (dumpFile) => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "..", "data", "dumps", `${dumpFile}.json`);
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

      // Get the raw SysEx data
      const sysex = new Uint8Array(dumpData.rawData);

      // Decode the SysEx
      const decoded = decodeMonologueParameters(sysex);

      // Check that Slider settings are valid
      expect(decoded.programSettings.slider.assign).toBeGreaterThanOrEqual(0);
      // Assign should be one of the valid CC numbers
      expect([13, 14, 17, 18, 21, 22, 23, 24, 26, 27, 28, 31, 32, 40, 56, 57]).toContain(
        decoded.programSettings.slider.assign
      );
      expect(decoded.programSettings.slider.bendRangePlus).toBeGreaterThanOrEqual(1);
      expect(decoded.programSettings.slider.bendRangePlus).toBeLessThanOrEqual(12);
      expect(decoded.programSettings.slider.bendRangeMinus).toBeGreaterThanOrEqual(1);
      expect(decoded.programSettings.slider.bendRangeMinus).toBeLessThanOrEqual(12);

      // Load parsed data to compare
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));
      expect(decoded.programSettings.slider.assign).toBe(parsedData.programSettings.slider.assign);
      expect(decoded.programSettings.slider.bendRangePlus).toBe(parsedData.programSettings.slider.bendRangePlus);
      expect(decoded.programSettings.slider.bendRangeMinus).toBe(parsedData.programSettings.slider.bendRangeMinus);
    });
  });

  describe("Round-trip", () => {
    it.each(["dump1", "dump2", "dump3", "dump4", "dump5"])(
      "should preserve slider settings through encode->decode cycle for %s",
      (dumpFile) => {
        // Load parsed data
        const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
        const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

        // Encode to SysEx
        const sysex = encodeMonologueParameters(originalParams);

        // Decode back
        const decodedParams = decodeMonologueParameters(sysex);

        // Check slider settings are preserved
        expect(decodedParams.programSettings.slider.assign).toBe(originalParams.programSettings.slider.assign);
        expect(decodedParams.programSettings.slider.bendRangePlus).toBe(
          originalParams.programSettings.slider.bendRangePlus
        );
        expect(decodedParams.programSettings.slider.bendRangeMinus).toBe(
          originalParams.programSettings.slider.bendRangeMinus
        );
      }
    );
  });
});
