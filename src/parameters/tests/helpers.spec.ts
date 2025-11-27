import { describe, it, expect } from "vitest";
import {
  normalizeValue,
  denormalizeValue,
  getParameterRange,
  isValidValue,
  clampValue,
  getParameterDisplayName,
} from "../helpers";

describe("Parameter Helpers", () => {
  describe("normalizeValue", () => {
    it("should convert 0-1 range to parameter range", () => {
      expect(normalizeValue("filterCutoff", 0)).toBe(0);
      expect(normalizeValue("filterCutoff", 0.5)).toBe(512);
      expect(normalizeValue("filterCutoff", 1)).toBe(1023);
    });

    it("should handle discrete parameters", () => {
      expect(normalizeValue("vco1Octave", 0)).toBe(0);
      expect(normalizeValue("vco1Octave", 0.33)).toBe(1);
      expect(normalizeValue("vco1Octave", 0.67)).toBe(2);
      expect(normalizeValue("vco1Octave", 1)).toBe(3);
    });

    it("should clamp values to 0-1 range", () => {
      expect(normalizeValue("filterCutoff", -0.5)).toBe(0);
      expect(normalizeValue("filterCutoff", 1.5)).toBe(1023);
    });

    it("should round continuous parameters", () => {
      expect(normalizeValue("filterCutoff", 0.5001)).toBe(512);
      expect(normalizeValue("filterCutoff", 0.4999)).toBe(511);
    });
  });

  describe("denormalizeValue", () => {
    it("should convert parameter range to 0-1", () => {
      expect(denormalizeValue("filterCutoff", 0)).toBe(0);
      expect(denormalizeValue("filterCutoff", 512)).toBeCloseTo(0.5, 2);
      expect(denormalizeValue("filterCutoff", 1023)).toBeCloseTo(1, 2);
    });

    it("should handle discrete parameters", () => {
      expect(denormalizeValue("vco1Octave", 0)).toBe(0);
      expect(denormalizeValue("vco1Octave", 1)).toBeCloseTo(0.33, 2);
      expect(denormalizeValue("vco1Octave", 2)).toBeCloseTo(0.67, 2);
      expect(denormalizeValue("vco1Octave", 3)).toBe(1);
    });

    it("should be inverse of normalizeValue", () => {
      const original = 0.75;
      const normalized = normalizeValue("filterCutoff", original);
      const denormalized = denormalizeValue("filterCutoff", normalized);
      expect(denormalized).toBeCloseTo(original, 2);
    });
  });

  describe("getParameterRange", () => {
    it("should return range for continuous parameters", () => {
      const range = getParameterRange("filterCutoff");
      expect(range).toEqual({
        min: 0,
        max: 1023,
        isDiscrete: false,
      });
    });

    it("should return range for discrete parameters", () => {
      const range = getParameterRange("vco1Octave");
      expect(range).toEqual({
        min: 0,
        max: 3,
        isDiscrete: true,
      });
    });

    it("should return correct ranges for various parameters", () => {
      expect(getParameterRange("filterResonance").max).toBe(1023);
      expect(getParameterRange("envelopeTarget").max).toBe(2);
      expect(getParameterRange("envelopeTarget").isDiscrete).toBe(true);
      expect(getParameterRange("lfoRate").isDiscrete).toBe(false);
    });
  });

  describe("isValidValue", () => {
    it("should validate values in range", () => {
      expect(isValidValue("filterCutoff", 0)).toBe(true);
      expect(isValidValue("filterCutoff", 512)).toBe(true);
      expect(isValidValue("filterCutoff", 1023)).toBe(true);
    });

    it("should reject values out of range", () => {
      expect(isValidValue("filterCutoff", -1)).toBe(false);
      expect(isValidValue("filterCutoff", 1024)).toBe(false);
      expect(isValidValue("vco1Octave", 4)).toBe(false);
    });

    it("should validate discrete parameters require integers", () => {
      expect(isValidValue("vco1Octave", 2)).toBe(true);
      expect(isValidValue("vco1Octave", 2.5)).toBe(false);
      expect(isValidValue("vco1Octave", 1.1)).toBe(false);
    });

    it("should accept non-integers for continuous parameters", () => {
      expect(isValidValue("filterCutoff", 512.5)).toBe(true);
      expect(isValidValue("filterCutoff", 0.1)).toBe(true);
    });

    it("should reject non-finite values", () => {
      expect(isValidValue("filterCutoff", NaN)).toBe(false);
      expect(isValidValue("filterCutoff", Infinity)).toBe(false);
      expect(isValidValue("filterCutoff", -Infinity)).toBe(false);
    });
  });

  describe("clampValue", () => {
    it("should clamp values to valid range", () => {
      expect(clampValue("filterCutoff", -100)).toBe(0);
      expect(clampValue("filterCutoff", 2000)).toBe(1023);
      expect(clampValue("vco1Octave", 10)).toBe(3);
    });

    it("should not modify values already in range", () => {
      expect(clampValue("filterCutoff", 512)).toBe(512);
      expect(clampValue("vco1Octave", 2)).toBe(2);
    });

    it("should round discrete parameters", () => {
      expect(clampValue("vco1Octave", 1.7)).toBe(2);
      expect(clampValue("vco1Octave", 1.3)).toBe(1);
    });

    it("should round continuous parameters", () => {
      expect(clampValue("filterCutoff", 512.6)).toBe(513);
      expect(clampValue("filterCutoff", 512.4)).toBe(512);
    });
  });

  describe("getParameterDisplayName", () => {
    it("should convert filter parameters", () => {
      expect(getParameterDisplayName("filterCutoff")).toBe("Filter Cutoff");
      expect(getParameterDisplayName("filterResonance")).toBe("Filter Resonance");
    });

    it("should convert envelope parameters", () => {
      expect(getParameterDisplayName("envelopeAttack")).toBe("Envelope Attack");
      expect(getParameterDisplayName("envelopeDecay")).toBe("Envelope Decay");
      expect(getParameterDisplayName("envelopeIntensity")).toBe("Envelope Intensity");
    });

    it("should handle VCO parameters with uppercase", () => {
      expect(getParameterDisplayName("vco1Pitch")).toBe("Oscilators VCO1 Pitch");
      expect(getParameterDisplayName("vco1Shape")).toBe("Oscilators VCO1 Shape");
      expect(getParameterDisplayName("vco2Level")).toBe("Oscilators VCO2 Level");
    });

    it("should handle LFO parameters", () => {
      expect(getParameterDisplayName("lfoRate")).toBe("LFO Rate");
      expect(getParameterDisplayName("lfoIntensity")).toBe("LFO Intensity");
    });

    it("should handle single-word parameters", () => {
      expect(getParameterDisplayName("drive")).toBe("Drive");
      expect(getParameterDisplayName("syncRing")).toBe("Sync Ring");
    });

    it("should handle nested paths", () => {
      expect(getParameterDisplayName("vco1Octave")).toContain("VCO1");
      expect(getParameterDisplayName("envelopeTarget")).toBe("Envelope Target");
    });
  });

  describe("integration tests", () => {
    it("should work together for knob/control implementation", () => {
      // Simulate UI control value (0-1)
      const filterKnobValue = 0.75;

      // Convert to parameter value
      const paramValue = normalizeValue("filterCutoff", filterKnobValue);
      expect(paramValue).toBe(767);

      // Validate it's in range
      expect(isValidValue("filterCutoff", paramValue)).toBe(true);

      // Convert back for display
      const displayValue = denormalizeValue("filterCutoff", paramValue);
      expect(displayValue).toBeCloseTo(filterKnobValue, 2);
    });

    it("should handle edge cases gracefully", () => {
      // Out of range control value
      const tooHigh = 1.5;
      const clamped = normalizeValue("filterCutoff", tooHigh);
      expect(clamped).toBe(1023);

      // Ensure it's valid
      expect(isValidValue("filterCutoff", clamped)).toBe(true);
    });

    it("should work for discrete parameters", () => {
      const values = [0, 0.33, 0.67, 1];
      const expected = [0, 1, 2, 3];

      values.forEach((val, idx) => {
        const normalized = normalizeValue("vco1Octave", val);
        expect(normalized).toBe(expected[idx]);
        expect(isValidValue("vco1Octave", normalized)).toBe(true);
      });
    });
  });
});
