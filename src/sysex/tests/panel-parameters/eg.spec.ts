/**
 * Test suite for EG (Envelope Generator) parameter encoding/decoding
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { decodeMonologueParameters } from "../../decode";
import { encodeMonologueParameters } from "../../encode";

describe("EG (Envelope Generator) Parameters", () => {
  describe("Decoding", () => {
    it.each(["dump1"])("should decode EG from %s", (dumpFile) => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "..", "data", "dumps", `${dumpFile}.json`);
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

      const sysex = new Uint8Array(dumpData.rawData);

      const decoded = decodeMonologueParameters(sysex);

      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));
      expect(decoded.envelope.type.value).toBe(parsedData.envelope.type.value);
      expect(decoded.envelope.attack.value).toBe(parsedData.envelope.attack.value);
      expect(decoded.envelope.decay.value).toBe(parsedData.envelope.decay.value);
      expect(decoded.envelope.intensity.value).toBe(parsedData.envelope.intensity.value);
      expect(decoded.envelope.target.value).toBe(parsedData.envelope.target.value);
    });
  });

  describe("Round-trip", () => {
    it.each(["dump1"])("should preserve EG through encode->decode cycle for %s", (dumpFile) => {
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

      const sysex = encodeMonologueParameters(originalParams);
      const decodedParams = decodeMonologueParameters(sysex);

      // Check EG is preserved
      expect(decodedParams.envelope.type.value).toBe(originalParams.envelope.type.value);
      expect(decodedParams.envelope.attack.value).toBe(originalParams.envelope.attack.value);
      expect(decodedParams.envelope.decay.value).toBe(originalParams.envelope.decay.value);
      expect(decodedParams.envelope.intensity.value).toBe(originalParams.envelope.intensity.value);
      expect(decodedParams.envelope.target.value).toBe(originalParams.envelope.target.value);
    });
  });
});
