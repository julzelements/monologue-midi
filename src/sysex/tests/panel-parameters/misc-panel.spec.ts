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

      const decodedPanel = decoded.panelSettings;
      const expectedPanel = parsedData.panelSettings;

      expect(decodedPanel.drive.value).toBe(expectedPanel.drive.value);
      expect(decodedPanel.keyboardOctave.value).toBe(expectedPanel.keyboardOctave.value);
      expect(decodedPanel.syncRing.value).toBe(expectedPanel.syncRing.value);
      expect(decodedPanel.seqTrig.value).toBe(expectedPanel.seqTrig.value);
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

        const originalPanel = originalParams.panelSettings;
        const decodedPanel = decodedParams.panelSettings;

        // Check all parameters are preserved
        expect(decodedPanel.drive.value).toBe(originalPanel.drive.value);
        expect(decodedPanel.keyboardOctave.value).toBe(originalPanel.keyboardOctave.value);
        expect(decodedPanel.syncRing.value).toBe(originalPanel.syncRing.value);
        expect(decodedPanel.seqTrig.value).toBe(originalPanel.seqTrig.value);
      }
    );
  });
});
