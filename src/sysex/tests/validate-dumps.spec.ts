/**
 * Test suite for validating Monologue parameter dumps against JSON schema
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { validateMonologueParametersWithSchema } from "../validator";

describe("Monologue Parameter Validation", () => {
  const dumpFiles = ["dump1", "dump2", "dump3", "dump4", "dump5"];

  describe("JSON Schema Validation", () => {
    dumpFiles.forEach((dumpFile) => {
      it(`should validate ${dumpFile}.json successfully`, () => {
        const filePath = join(__dirname, "data", "parsed", `${dumpFile}.json`);
        const data = JSON.parse(readFileSync(filePath, "utf8"));

        const result = validateMonologueParametersWithSchema(data);

        if (!result.valid) {
          console.error(`\nValidation errors for ${dumpFile}:`);
          result.errors?.forEach((err) => console.error(`  - ${err}`));
        }
        expect(result.valid).toBe(true);
        expect(result.errors).toBeUndefined();
      });
    });
  });

  describe("Parameter Structure", () => {
    dumpFiles.forEach((dumpFile) => {
      it(`should have all required top-level fields in ${dumpFile}`, () => {
        const filePath = join(__dirname, "data", "parsed", `${dumpFile}.json`);
        const data = JSON.parse(readFileSync(filePath, "utf8"));

        expect(data).toHaveProperty("patchName");
        expect(data).toHaveProperty("drive");
        expect(data).toHaveProperty("oscilators");
        expect(data).toHaveProperty("filter");
        expect(data).toHaveProperty("envelope");
        expect(data).toHaveProperty("lfo");
        expect(data).toHaveProperty("misc");
        expect(data).toHaveProperty("sequencer");
      });

      it(`should have oscillators as map structure in ${dumpFile}`, () => {
        const filePath = join(__dirname, "data", "parsed", `${dumpFile}.json`);
        const data = JSON.parse(readFileSync(filePath, "utf8"));

        expect(data.oscilators).toHaveProperty("vco1");
        expect(data.oscilators).toHaveProperty("vco2");
        expect(Array.isArray(data.oscilators)).toBe(false);
      });

      it(`should have motion slot params as map with parameter1-4 keys in ${dumpFile}`, () => {
        const filePath = join(__dirname, "data", "parsed", `${dumpFile}.json`);
        const data = JSON.parse(readFileSync(filePath, "utf8"));

        expect(data.sequencer.motionSlotParams).toHaveProperty("parameter1");
        expect(data.sequencer.motionSlotParams).toHaveProperty("parameter2");
        expect(data.sequencer.motionSlotParams).toHaveProperty("parameter3");
        expect(data.sequencer.motionSlotParams).toHaveProperty("parameter4");
        expect(Array.isArray(data.sequencer.motionSlotParams)).toBe(false);
      });

      it(`should have steps as map with step1-16 keys in ${dumpFile}`, () => {
        const filePath = join(__dirname, "data", "parsed", `${dumpFile}.json`);
        const data = JSON.parse(readFileSync(filePath, "utf8"));

        for (let i = 1; i <= 16; i++) {
          expect(data.sequencer.steps).toHaveProperty(`step${i}`);
        }
        expect(Array.isArray(data.sequencer.steps)).toBe(false);
      });

      it(`should have motionSequencing (not motionSlotsData) in steps in ${dumpFile}`, () => {
        const filePath = join(__dirname, "data", "parsed", `${dumpFile}.json`);
        const data = JSON.parse(readFileSync(filePath, "utf8"));

        const step1 = data.sequencer.steps.step1;
        expect(step1.event).toHaveProperty("motionSequencing");
        expect(step1.event).not.toHaveProperty("motionSlotsData");

        // Check parameter keys not slot keys
        expect(step1.event.motionSequencing).toHaveProperty("parameter1");
        expect(step1.event.motionSequencing).not.toHaveProperty("slot1");
      });

      it(`should not have redundant name/value wrappers in ${dumpFile}`, () => {
        const filePath = join(__dirname, "data", "parsed", `${dumpFile}.json`);
        const data = JSON.parse(readFileSync(filePath, "utf8"));

        // Drive should be a number, not an object with name/value
        expect(typeof data.drive).toBe("number");

        // Filter values should be numbers
        expect(typeof data.filter.cutoff).toBe("number");
        expect(typeof data.filter.resonance).toBe("number");

        // Step active should be a number
        expect(typeof data.sequencer.steps.step1.active).toBe("number");
      });
    });
  });

  describe("Value Ranges", () => {
    it("should have valid 10-bit values (0-1023) for parameters", () => {
      const filePath = join(__dirname, "data", "parsed", "dump1.json");
      const data = JSON.parse(readFileSync(filePath, "utf8"));

      expect(data.drive).toBeGreaterThanOrEqual(0);
      expect(data.drive).toBeLessThanOrEqual(1023);

      expect(data.filter.cutoff).toBeGreaterThanOrEqual(0);
      expect(data.filter.cutoff).toBeLessThanOrEqual(1023);

      expect(data.oscilators.vco1.pitch).toBeGreaterThanOrEqual(0);
      expect(data.oscilators.vco1.pitch).toBeLessThanOrEqual(1023);
    });

    it("should have valid MIDI note values (0-127)", () => {
      const filePath = join(__dirname, "data", "parsed", "dump1.json");
      const data = JSON.parse(readFileSync(filePath, "utf8"));

      Object.values(data.sequencer.steps).forEach((step: any) => {
        expect(step.event.note.key).toBeGreaterThanOrEqual(0);
        expect(step.event.note.key).toBeLessThanOrEqual(127);
        expect(step.event.note.velocity).toBeGreaterThanOrEqual(0);
        expect(step.event.note.velocity).toBeLessThanOrEqual(127);
      });
    });
  });
});
