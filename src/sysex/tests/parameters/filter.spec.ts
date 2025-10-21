/**
 * Test suite for filter parameter decoding
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { decodeMonologueParameters } from "../../decode";

describe("Filter Parameters", () => {
  describe("Cutoff decoding", () => {
    it("should decode cutoff value from dump1.json", () => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "..", "data", "dumps", "dump1.json");
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

      // Get the raw SysEx data
      const sysex = new Uint8Array(dumpData.rawData);

      // Decode the SysEx
      const decoded = decodeMonologueParameters(sysex);

      // Check that cutoff is a valid 10-bit value (0-1023)
      expect(decoded.filter.cutoff).toBeGreaterThanOrEqual(0);
      expect(decoded.filter.cutoff).toBeLessThanOrEqual(1023);

      // Log the decoded value for manual verification
      console.log(`Cutoff value: ${decoded.filter.cutoff} (0x${decoded.filter.cutoff.toString(16)})`);
    });

    it("should decode cutoff from all dump files", () => {
      const dumpFiles = ["dump1", "dump2", "dump3", "dump4", "dump5"];

      dumpFiles.forEach((dumpFile) => {
        // Load the raw SysEx dump data
        const dumpPath = join(__dirname, "..", "data", "dumps", `${dumpFile}.json`);
        const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

        // Get the raw SysEx data
        const sysex = new Uint8Array(dumpData.rawData);

        // Decode the SysEx
        const decoded = decodeMonologueParameters(sysex);

        // Check that cutoff is a valid 10-bit value (0-1023)
        expect(decoded.filter.cutoff).toBeGreaterThanOrEqual(0);
        expect(decoded.filter.cutoff).toBeLessThanOrEqual(1023);

        console.log(`${dumpFile} - Cutoff: ${decoded.filter.cutoff}`);
      });
    });
  });
});
