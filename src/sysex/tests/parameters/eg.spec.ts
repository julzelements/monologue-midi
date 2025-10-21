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
    it.each(["dump1", "dump2", "dump3", "dump4", "dump5"])("should decode EG from %s", (dumpFile) => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "..", "data", "dumps", `${dumpFile}.json`);
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));

      // Get the raw SysEx data
      const sysex = new Uint8Array(dumpData.rawData);

      // Decode the SysEx
      const decoded = decodeMonologueParameters(sysex);

      // Check that EG values are valid
      expect(decoded.envelope.type).toBeGreaterThanOrEqual(0);
      expect(decoded.envelope.type).toBeLessThanOrEqual(2);
      expect(decoded.envelope.attack).toBeGreaterThanOrEqual(0);
      expect(decoded.envelope.attack).toBeLessThanOrEqual(1023);
      expect(decoded.envelope.decay).toBeGreaterThanOrEqual(0);
      expect(decoded.envelope.decay).toBeLessThanOrEqual(1023);
      // TODO: Test intensity when decoding is implemented
      // expect(decoded.envelope.intensity).toBeGreaterThanOrEqual(0);
      // expect(decoded.envelope.intensity).toBeLessThanOrEqual(1023);
      expect(decoded.envelope.target).toBeGreaterThanOrEqual(0);
      expect(decoded.envelope.target).toBeLessThanOrEqual(2);

      // Load parsed data to compare
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));
      expect(decoded.envelope.type).toBe(parsedData.envelope.type);
      expect(decoded.envelope.attack).toBe(parsedData.envelope.attack);
      expect(decoded.envelope.decay).toBe(parsedData.envelope.decay);
      // TODO: Test intensity when decoding is implemented
      // expect(decoded.envelope.intensity).toBe(parsedData.envelope.intensity);
      expect(decoded.envelope.target).toBe(parsedData.envelope.target);
    });
  });

  describe("Encoding", () => {
    it.each(["dump1", "dump2", "dump3", "dump4", "dump5"])("should encode EG values correctly from %s", (dumpFile) => {
      // Load parsed data
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

      // Encode to SysEx
      const sysex = encodeMonologueParameters(originalParams);

      // Decode back
      const decoded = decodeMonologueParameters(sysex);

      // Verify EG values match original
      expect(decoded.envelope.type).toBe(originalParams.envelope.type);
      expect(decoded.envelope.attack).toBe(originalParams.envelope.attack);
      expect(decoded.envelope.decay).toBe(originalParams.envelope.decay);
      // TODO: Test intensity when encoding is implemented
      // expect(decoded.envelope.intensity).toBe(originalParams.envelope.intensity);
      expect(decoded.envelope.target).toBe(originalParams.envelope.target);
    });
  });

  describe("Round-trip", () => {
    it.each(["dump1", "dump2", "dump3", "dump4", "dump5"])(
      "should preserve EG through encode->decode cycle for %s",
      (dumpFile) => {
        // Load parsed data
        const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
        const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

        // Encode to SysEx
        const sysex = encodeMonologueParameters(originalParams);

        // Decode back
        const decodedParams = decodeMonologueParameters(sysex);

        // Check EG is preserved
        expect(decodedParams.envelope.type).toBe(originalParams.envelope.type);
        expect(decodedParams.envelope.attack).toBe(originalParams.envelope.attack);
        expect(decodedParams.envelope.decay).toBe(originalParams.envelope.decay);
        // TODO: Test intensity when encoding/decoding is implemented
        // expect(decodedParams.envelope.intensity).toBe(originalParams.envelope.intensity);
        expect(decodedParams.envelope.target).toBe(originalParams.envelope.target);
      }
    );
  });
});
