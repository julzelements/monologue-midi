/**
 * Test suite for Other program settings encoding/decoding
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { decodeMonologueParameters } from "../../decode";
import { encodeMonologueParameters } from "../../encode";

describe("Other Program Settings Parameters", () => {
  describe("Decoding", () => {
    it.each(["dump1", "dump2", "dump3", "dump4", "dump5"])("should decode other settings from %s", (dumpFile) => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "..", "data", "dumps", `${dumpFile}.json`);
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

      // Get the raw SysEx data
      const sysex = new Uint8Array(dumpData.rawData);

      // Decode the SysEx
      const decoded = decodeMonologueParameters(sysex);

      // Check that Other settings are valid
      expect(decoded.programSettings.other.lfoBpmSync).toBeGreaterThanOrEqual(0);
      expect(decoded.programSettings.other.lfoBpmSync).toBeLessThanOrEqual(1);
      expect(decoded.programSettings.other.cutoffKeyTrack).toBeGreaterThanOrEqual(0);
      expect(decoded.programSettings.other.cutoffKeyTrack).toBeLessThanOrEqual(2);
      expect(decoded.programSettings.other.cutoffVelocity).toBeGreaterThanOrEqual(0);
      expect(decoded.programSettings.other.cutoffVelocity).toBeLessThanOrEqual(2);
      expect(decoded.programSettings.other.ampVelocity).toBeGreaterThanOrEqual(0);
      expect(decoded.programSettings.other.ampVelocity).toBeLessThanOrEqual(127);
      expect(decoded.programSettings.other.programLevel).toBeGreaterThanOrEqual(77);
      expect(decoded.programSettings.other.programLevel).toBeLessThanOrEqual(127);

      // Load parsed data to compare
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));
      expect(decoded.programSettings.other.lfoBpmSync).toBe(parsedData.programSettings.other.lfoBpmSync);
      expect(decoded.programSettings.other.cutoffKeyTrack).toBe(parsedData.programSettings.other.cutoffKeyTrack);
      expect(decoded.programSettings.other.cutoffVelocity).toBe(parsedData.programSettings.other.cutoffVelocity);
      expect(decoded.programSettings.other.ampVelocity).toBe(parsedData.programSettings.other.ampVelocity);
      expect(decoded.programSettings.other.programLevel).toBe(parsedData.programSettings.other.programLevel);
    });
  });

  describe("Round-trip", () => {
    it.each(["dump1", "dump2", "dump3", "dump4", "dump5"])(
      "should preserve other settings through encode->decode cycle for %s",
      (dumpFile) => {
        // Load parsed data
        const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
        const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

        // Encode to SysEx
        const sysex = encodeMonologueParameters(originalParams);

        // Decode back
        const decodedParams = decodeMonologueParameters(sysex);

        // Check other settings are preserved
        expect(decodedParams.programSettings.other.lfoBpmSync).toBe(originalParams.programSettings.other.lfoBpmSync);
        expect(decodedParams.programSettings.other.cutoffKeyTrack).toBe(
          originalParams.programSettings.other.cutoffKeyTrack
        );
        expect(decodedParams.programSettings.other.cutoffVelocity).toBe(
          originalParams.programSettings.other.cutoffVelocity
        );
        expect(decodedParams.programSettings.other.ampVelocity).toBe(originalParams.programSettings.other.ampVelocity);
        expect(decodedParams.programSettings.other.programLevel).toBe(
          originalParams.programSettings.other.programLevel
        );
      }
    );
  });
});
