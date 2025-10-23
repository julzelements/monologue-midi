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

      // Basic sequencer settings
      expect(decoded.sequencer.bpm.value).toBe(parsedData.sequencer.bpm.value);
      expect(decoded.sequencer.stepLength.value).toBe(parsedData.sequencer.stepLength.value);
      expect(decoded.sequencer.stepResolution.value).toBe(parsedData.sequencer.stepResolution.value);
      expect(decoded.sequencer.swing.value).toBe(parsedData.sequencer.swing.value);
      expect(decoded.sequencer.defaultGateTime.value).toBe(parsedData.sequencer.defaultGateTime.value);

      // Motion slot params
      expect(decoded.sequencer.motionSlotParams).toHaveLength(4);
      decoded.sequencer.motionSlotParams.forEach((slot: any, i: number) => {
        expect(slot.slotNumber).toBe(parsedData.sequencer.motionSlotParams[i].slotNumber);
        expect(slot.active.value).toBe(parsedData.sequencer.motionSlotParams[i].active.value);
        expect(slot.smooth.value).toBe(parsedData.sequencer.motionSlotParams[i].smooth.value);
        expect(slot.parameter.value).toBe(parsedData.sequencer.motionSlotParams[i].parameter.value);
      });

      // Sequencer steps
      expect(decoded.sequencer.steps).toHaveLength(16);
      decoded.sequencer.steps.forEach((step: any, i: number) => {
        const parsedStep = parsedData.sequencer.steps[i];

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

      // Basic sequencer settings
      expect(decodedParams.sequencer.bpm.value).toBe(originalParams.sequencer.bpm.value);
      expect(decodedParams.sequencer.stepLength.value).toBe(originalParams.sequencer.stepLength.value);
      expect(decodedParams.sequencer.stepResolution.value).toBe(originalParams.sequencer.stepResolution.value);
      expect(decodedParams.sequencer.swing.value).toBe(originalParams.sequencer.swing.value);
      expect(decodedParams.sequencer.defaultGateTime.value).toBe(originalParams.sequencer.defaultGateTime.value);

      // Motion slot params
      expect(decodedParams.sequencer.motionSlotParams).toHaveLength(4);
      decodedParams.sequencer.motionSlotParams.forEach((slot: any, i: number) => {
        expect(slot.slotNumber).toBe(originalParams.sequencer.motionSlotParams[i].slotNumber);
        expect(slot.active.value).toBe(originalParams.sequencer.motionSlotParams[i].active.value);
        expect(slot.smooth.value).toBe(originalParams.sequencer.motionSlotParams[i].smooth.value);
        expect(slot.parameter.value).toBe(originalParams.sequencer.motionSlotParams[i].parameter.value);
      });

      // Sequencer steps
      expect(decodedParams.sequencer.steps).toHaveLength(16);
      decodedParams.sequencer.steps.forEach((step: any, i: number) => {
        const originalStep = originalParams.sequencer.steps[i];

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
