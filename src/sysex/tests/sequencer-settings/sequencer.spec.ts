/**
 * Test suite for Sequencer Settings encoding/decoding
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { decodeMonologueParameters } from "../../decode";
import { encodeMonologueParameters } from "../../encode";

describe("Sequencer Settings", () => {
  describe("Decoding", () => {
    it.each(["dump1"])("should decode Sequencer Settings from %s", (dumpFile) => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "..", "data", "dumps", `${dumpFile}.json`);
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));

      const sysex = new Uint8Array(dumpData.rawData);
      const decoded = decodeMonologueParameters(sysex);

      const decodedSeqSettings = decoded.sequencerSettings;
      const expectedSeqSettings = parsedData.sequencerSettings;

      // Basic sequencer settings
      expect(decodedSeqSettings.bpm.value).toBe(expectedSeqSettings.bpm.value);
      expect(decodedSeqSettings.stepLength.value).toBe(expectedSeqSettings.stepLength.value);
      expect(decodedSeqSettings.stepResolution.value).toBe(expectedSeqSettings.stepResolution.value);
      expect(decodedSeqSettings.swing.value).toBe(expectedSeqSettings.swing.value);
      expect(decodedSeqSettings.defaultGateTime.value).toBe(expectedSeqSettings.defaultGateTime.value);

      // Motion slot params
      expect(decodedSeqSettings.motionSlotParams).toHaveLength(4);
      decodedSeqSettings.motionSlotParams.forEach((slot: any, i: number) => {
        expect(slot.slotNumber).toBe(expectedSeqSettings.motionSlotParams[i].slotNumber);
        expect(slot.active.value).toBe(expectedSeqSettings.motionSlotParams[i].active.value);
        expect(slot.smooth.value).toBe(expectedSeqSettings.motionSlotParams[i].smooth.value);
        expect(slot.parameter.value).toBe(expectedSeqSettings.motionSlotParams[i].parameter.value);
      });
    });
  });

  describe.skip("Round-trip", () => {
    it.each(["dump1"])("should preserve Sequencer Settings through encode->decode cycle for %s", (dumpFile) => {
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

      const sysex = encodeMonologueParameters(originalParams);
      const decodedParams = decodeMonologueParameters(sysex);

      const originalSeqSettings = originalParams.sequencerSettings;
      const decodedSeqSettings = decodedParams.sequencerSettings;

      // Basic sequencer settings
      expect(decodedSeqSettings.bpm.value).toBe(originalSeqSettings.bpm.value);
      expect(decodedSeqSettings.stepLength.value).toBe(originalSeqSettings.stepLength.value);
      expect(decodedSeqSettings.stepResolution.value).toBe(originalSeqSettings.stepResolution.value);
      expect(decodedSeqSettings.swing.value).toBe(originalSeqSettings.swing.value);
      expect(decodedSeqSettings.defaultGateTime.value).toBe(originalSeqSettings.defaultGateTime.value);

      // Motion slot params
      expect(decodedSeqSettings.motionSlotParams).toHaveLength(4);
      decodedSeqSettings.motionSlotParams.forEach((slot: any, i: number) => {
        expect(slot.slotNumber).toBe(originalSeqSettings.motionSlotParams[i].slotNumber);
        expect(slot.active.value).toBe(originalSeqSettings.motionSlotParams[i].active.value);
        expect(slot.smooth.value).toBe(originalSeqSettings.motionSlotParams[i].smooth.value);
        expect(slot.parameter.value).toBe(originalSeqSettings.motionSlotParams[i].parameter.value);
      });
    });
  });
});
