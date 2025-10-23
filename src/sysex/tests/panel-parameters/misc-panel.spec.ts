/**
 * Test suite for miscellaneous panel parameters encoding/decoding
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { decodeMonologueParameters } from "../../decode";
import { encodeMonologueParameters } from "../../encode";

describe("Miscellaneous Panel Parameters", () => {
  describe("Decoding", () => {
    it.each(["dump1"])("should decode drive, keyboardOctave, syncRing & seqTrig from %s", (dumpFile) => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "..", "data", "dumps", `${dumpFile}.json`);
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

      const sysex = new Uint8Array(dumpData.rawData);

      const decoded = decodeMonologueParameters(sysex);
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));
      expect(decoded.drive.value).toBe(parsedData.drive.value);
      expect(decoded.keyboardOctave.value).toBe(parsedData.keyboardOctave.value);
      expect(decoded.syncRing.value).toBe(parsedData.syncRing.value);
      expect(decoded.seqTrig.value).toBe(parsedData.seqTrig.value);
    });
  });

  describe("Round-trip", () => {
    it.each(["dump1"])(
      "should preserve drive, keyboardOctave, syncRing & seqTrig through encode->decode cycle for %s",
      (dumpFile) => {
        // Load parsed data
        const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
        const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

        // Encode to SysEx
        const sysex = encodeMonologueParameters(originalParams);

        // Decode back
        const decodedParams = decodeMonologueParameters(sysex);

        // Check all parameters are preserved
        expect(decodedParams.drive.value).toBe(originalParams.drive.value);
        expect(decodedParams.keyboardOctave.value).toBe(originalParams.keyboardOctave.value);
        expect(decodedParams.syncRing.value).toBe(originalParams.syncRing.value);
        expect(decodedParams.seqTrig.value).toBe(originalParams.seqTrig.value);
      }
    );
  });
});
