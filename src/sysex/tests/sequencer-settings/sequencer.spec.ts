/**
 * Test suite for Sequencer parameter encoding/decoding
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { decodeMonologueParameters } from "../../decode";
import { encodeMonologueParameters } from "../../encode";

describe("Sequencer Parameters", () => {
  describe("Decoding", () => {
    it.each(["dump1"])("should decode Sequencer from %s", (dumpFile) => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "..", "data", "dumps", `${dumpFile}.json`);
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));

      const sysex = new Uint8Array(dumpData.rawData);
      const decoded = decodeMonologueParameters(sysex);

      const decodedSeqSettings = decoded.sequencerSettings;
      const expectedSeqSettings = parsedData.sequencerSettings;
      const decodedSteps = decoded.sequencerSteps;
      const expectedSteps = parsedData.sequencerSteps;

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

      // Sequencer steps
      expect(decodedSteps).toHaveLength(16);
      decodedSteps.forEach((step: any, i: number) => {
        const parsedStep = expectedSteps[i];

        expect(step.stepNumber).toBe(parsedStep.stepNumber);
        expect(step.active.value).toBe(parsedStep.active.value);
        expect(step.motionActive.value).toBe(parsedStep.motionActive.value);
        expect(step.slideActive.value).toBe(parsedStep.slideActive.value);

        // Note event
        expect(step.event.note.key.value).toBe(parsedStep.event.note.key.value);
        expect(step.event.note.velocity.value).toBe(parsedStep.event.note.velocity.value);
        expect(step.event.note.gateTime.value).toBe(parsedStep.event.note.gateTime.value);
        expect(step.event.note.trigger.value).toBe(parsedStep.event.note.trigger.value);

        // Motion slots data (4 slots x 4 data points each)
        expect(step.event.motionSlotsData).toHaveLength(4);
        step.event.motionSlotsData.forEach((slotData: any, slotIdx: number) => {
          expect(slotData).toHaveLength(4);
          slotData.forEach((dataPoint: any, dataIdx: number) => {
            expect(dataPoint.value).toBe(parsedStep.event.motionSlotsData[slotIdx][dataIdx].value);
          });
        });
      });
    });
  });

  describe.skip("Round-trip", () => {
    it.each(["dump1"])("should preserve Sequencer through encode->decode cycle for %s", (dumpFile) => {
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

      const sysex = encodeMonologueParameters(originalParams);
      const decodedParams = decodeMonologueParameters(sysex);

      const originalSeqSettings = originalParams.sequencerSettings;
      const decodedSeqSettings = decodedParams.sequencerSettings;
      const originalSteps = originalParams.sequencerSteps;
      const decodedSteps = decodedParams.sequencerSteps;

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

      // Sequencer steps
      expect(decodedSteps).toHaveLength(16);
      decodedSteps.forEach((step: any, i: number) => {
        const originalStep = originalSteps[i];

        expect(step.stepNumber).toBe(originalStep.stepNumber);
        expect(step.active.value).toBe(originalStep.active.value);
        expect(step.motionActive.value).toBe(originalStep.motionActive.value);
        expect(step.slideActive.value).toBe(originalStep.slideActive.value);

        // Note event
        expect(step.event.note.key.value).toBe(originalStep.event.note.key.value);
        expect(step.event.note.velocity.value).toBe(originalStep.event.note.velocity.value);
        expect(step.event.note.gateTime.value).toBe(originalStep.event.note.gateTime.value);
        expect(step.event.note.trigger.value).toBe(originalStep.event.note.trigger.value);

        // Motion slots data (4 slots x 4 data points each)
        expect(step.event.motionSlotsData).toHaveLength(4);
        step.event.motionSlotsData.forEach((slotData: any, slotIdx: number) => {
          expect(slotData).toHaveLength(4);
          slotData.forEach((dataPoint: any, dataIdx: number) => {
            expect(dataPoint.value).toBe(originalStep.event.motionSlotsData[slotIdx][dataIdx].value);
          });
        });
      });
    });
  });
});
