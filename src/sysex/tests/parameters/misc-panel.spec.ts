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
    it.each(["dump1", "dump2", "dump3", "dump4", "dump5"])(
      "should decode drive, keyboardOctave, syncRing & seqTrig from %s",
      (dumpFile) => {
        // Load the raw SysEx dump data
        const dumpPath = join(__dirname, "..", "data", "dumps", `${dumpFile}.json`);
        const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

        // Get the raw SysEx data
        const sysex = new Uint8Array(dumpData.rawData);

        // Decode the SysEx
        const decoded = decodeMonologueParameters(sysex);

        // Check that drive is a valid 10-bit value (0-1023)
        expect(decoded.drive).toBeGreaterThanOrEqual(0);
        expect(decoded.drive).toBeLessThanOrEqual(1023);

        // Check that keyboard octave is valid (0-4)
        expect(decoded.keyboardOctave).toBeGreaterThanOrEqual(0);
        expect(decoded.keyboardOctave).toBeLessThanOrEqual(4);

        // Check that sync ring is valid (0-2)
        expect(decoded.syncRing).toBeGreaterThanOrEqual(0);
        expect(decoded.syncRing).toBeLessThanOrEqual(2);

        // Check that sequence trigger is valid (0-1)
        expect(decoded.seqTrig).toBeGreaterThanOrEqual(0);
        expect(decoded.seqTrig).toBeLessThanOrEqual(1);

        // Load parsed data to compare
        const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
        const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));
        expect(decoded.drive).toBe(parsedData.drive);
        expect(decoded.keyboardOctave).toBe(parsedData.keyboardOctave);
        expect(decoded.syncRing).toBe(parsedData.syncRing);
        expect(decoded.seqTrig).toBe(parsedData.seqTrig);
      }
    );
  });

  describe("Encoding", () => {
    it.each(["dump1", "dump2", "dump3", "dump4", "dump5"])(
      "should encode drive, keyboardOctave, syncRing & seqTrig correctly from %s",
      (dumpFile) => {
        // Load parsed data
        const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
        const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

        // Encode to SysEx
        const encoded = encodeMonologueParameters(originalParams);

        // Decode the encoded data
        const decoded = decodeMonologueParameters(encoded);

        // Verify encoding produces correct values
        expect(decoded.drive).toBe(originalParams.drive);
        expect(decoded.keyboardOctave).toBe(originalParams.keyboardOctave);
        expect(decoded.syncRing).toBe(originalParams.syncRing);
        expect(decoded.seqTrig).toBe(originalParams.seqTrig);
      }
    );
  });

  describe("Round-trip", () => {
    it.each(["dump1", "dump2", "dump3", "dump4", "dump5"])(
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
        expect(decodedParams.drive).toBe(originalParams.drive);
        expect(decodedParams.keyboardOctave).toBe(originalParams.keyboardOctave);
        expect(decodedParams.syncRing).toBe(originalParams.syncRing);
        expect(decodedParams.seqTrig).toBe(originalParams.seqTrig);
      }
    );
  });
});
