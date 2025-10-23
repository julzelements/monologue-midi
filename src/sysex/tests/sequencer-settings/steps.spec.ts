/**
 * Test suite for Sequencer Steps encoding/decoding
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { decodeMonologueParameters } from "../../decode";
import { encodeMonologueParameters } from "../../encode";

describe("Sequencer Steps", () => {
  describe("Decoding", () => {
    it.each(["dump1"])("should decode Sequencer Steps from %s", (dumpFile) => {
      // Load the raw SysEx dump data
      const dumpPath = join(__dirname, "..", "data", "dumps", `${dumpFile}.json`);
      const dumpData = JSON.parse(readFileSync(dumpPath, "utf8"));
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const parsedData = JSON.parse(readFileSync(parsedPath, "utf8"));

      const sysex = new Uint8Array(dumpData.rawData);
      const decoded = decodeMonologueParameters(sysex);

      const decodedSteps = decoded.sequencerSteps;
      const expectedSteps = parsedData.sequencerSteps;

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
    it.each(["dump1"])("should preserve Sequencer Steps through encode->decode cycle for %s", (dumpFile) => {
      const parsedPath = join(__dirname, "..", "data", "parsed", `${dumpFile}.json`);
      const originalParams = JSON.parse(readFileSync(parsedPath, "utf8"));

      const sysex = encodeMonologueParameters(originalParams);
      const decodedParams = decodeMonologueParameters(sysex);

      const originalSteps = originalParams.sequencerSteps;
      const decodedSteps = decodedParams.sequencerSteps;

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
