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
    it.each(["dump1"])("should decode other settings from %s", (dumpFile) => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "..", "data", "dumps", `${dumpFile}.json`);
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

      const sysex = new Uint8Array(dumpData.rawData);

      const decoded = decodeMonologueParameters(sysex);

      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));
      expect(decoded.programSettings.other.lfoBpmSync.value).toBe(parsedData.programSettings.other.lfoBpmSync.value);
      expect(decoded.programSettings.other.cutoffKeyTrack.value).toBe(
        parsedData.programSettings.other.cutoffKeyTrack.value
      );
      expect(decoded.programSettings.other.cutoffVelocity.value).toBe(
        parsedData.programSettings.other.cutoffVelocity.value
      );
      expect(decoded.programSettings.other.ampVelocity.value).toBe(parsedData.programSettings.other.ampVelocity.value);
      expect(decoded.programSettings.other.programLevel.value).toBe(
        parsedData.programSettings.other.programLevel.value
      );
    });
  });

  describe("Round-trip", () => {
    it.each(["dump1"])("should preserve other settings through encode->decode cycle for %s", (dumpFile) => {
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

      const sysex = encodeMonologueParameters(originalParams);
      const decodedParams = decodeMonologueParameters(sysex);

      // Check other settings are preserved
      expect(decodedParams.programSettings.other.lfoBpmSync.value).toBe(
        originalParams.programSettings.other.lfoBpmSync.value
      );
      expect(decodedParams.programSettings.other.cutoffKeyTrack.value).toBe(
        originalParams.programSettings.other.cutoffKeyTrack.value
      );
      expect(decodedParams.programSettings.other.cutoffVelocity.value).toBe(
        originalParams.programSettings.other.cutoffVelocity.value
      );
      expect(decodedParams.programSettings.other.ampVelocity.value).toBe(
        originalParams.programSettings.other.ampVelocity.value
      );
      expect(decodedParams.programSettings.other.programLevel.value).toBe(
        originalParams.programSettings.other.programLevel.value
      );
    });
  });
});
