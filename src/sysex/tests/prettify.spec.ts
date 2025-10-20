import { describe, it, expect } from "vitest";
import * as prettify from "../prettify";

describe("Prettify Utilities", () => {
  describe("VCO1 Wave", () => {
    it("should format VCO1 wave values correctly", () => {
      expect(prettify.formatVco1Wave(0)).toBe("SQR");
      expect(prettify.formatVco1Wave(1)).toBe("TRI");
      expect(prettify.formatVco1Wave(2)).toBe("SAW");
    });

    it("should parse VCO1 wave labels correctly", () => {
      expect(prettify.parseVco1Wave("SQR")).toBe(0);
      expect(prettify.parseVco1Wave("TRI")).toBe(1);
      expect(prettify.parseVco1Wave("SAW")).toBe(2);
    });

    it("should round-trip VCO1 wave values", () => {
      for (let i = 0; i < 3; i++) {
        const label = prettify.formatVco1Wave(i);
        expect(prettify.parseVco1Wave(label)).toBe(i);
      }
    });
  });

  describe("VCO2 Wave", () => {
    it("should format VCO2 wave values correctly", () => {
      expect(prettify.formatVco2Wave(0)).toBe("NOISE");
      expect(prettify.formatVco2Wave(1)).toBe("TRI");
      expect(prettify.formatVco2Wave(2)).toBe("SAW");
    });

    it("should parse VCO2 wave labels correctly", () => {
      expect(prettify.parseVco2Wave("NOISE")).toBe(0);
      expect(prettify.parseVco2Wave("TRI")).toBe(1);
      expect(prettify.parseVco2Wave("SAW")).toBe(2);
    });

    it("should round-trip VCO2 wave values", () => {
      for (let i = 0; i < 3; i++) {
        const label = prettify.formatVco2Wave(i);
        expect(prettify.parseVco2Wave(label)).toBe(i);
      }
    });
  });

  describe("SYNC/RING", () => {
    it("should format SYNC/RING values correctly", () => {
      expect(prettify.formatSyncRing(0)).toBe("RING");
      expect(prettify.formatSyncRing(1)).toBe("OFF");
      expect(prettify.formatSyncRing(2)).toBe("SYNC");
    });

    it("should parse SYNC/RING labels correctly", () => {
      expect(prettify.parseSyncRing("RING")).toBe(0);
      expect(prettify.parseSyncRing("OFF")).toBe(1);
      expect(prettify.parseSyncRing("SYNC")).toBe(2);
    });

    it("should round-trip SYNC/RING values", () => {
      for (let i = 0; i < 3; i++) {
        const label = prettify.formatSyncRing(i);
        expect(prettify.parseSyncRing(label)).toBe(i);
      }
    });
  });

  describe("Octave", () => {
    it("should format octave values correctly", () => {
      expect(prettify.formatOctave(0)).toBe("16'");
      expect(prettify.formatOctave(1)).toBe("8'");
      expect(prettify.formatOctave(2)).toBe("4'");
      expect(prettify.formatOctave(3)).toBe("2'");
    });

    it("should parse octave labels correctly", () => {
      expect(prettify.parseOctave("16'")).toBe(0);
      expect(prettify.parseOctave("8'")).toBe(1);
      expect(prettify.parseOctave("4'")).toBe(2);
      expect(prettify.parseOctave("2'")).toBe(3);
    });

    it("should round-trip octave values", () => {
      for (let i = 0; i < 4; i++) {
        const label = prettify.formatOctave(i);
        expect(prettify.parseOctave(label)).toBe(i);
      }
    });
  });

  describe("Envelope Type", () => {
    it("should format EG type values correctly", () => {
      expect(prettify.formatEgType(0)).toBe("GATE");
      expect(prettify.formatEgType(1)).toBe("A/G/D");
      expect(prettify.formatEgType(2)).toBe("A/D");
    });

    it("should parse EG type labels correctly", () => {
      expect(prettify.parseEgType("GATE")).toBe(0);
      expect(prettify.parseEgType("A/G/D")).toBe(1);
      expect(prettify.parseEgType("A/D")).toBe(2);
    });

    it("should round-trip EG type values", () => {
      for (let i = 0; i < 3; i++) {
        const label = prettify.formatEgType(i);
        expect(prettify.parseEgType(label)).toBe(i);
      }
    });
  });

  describe("Envelope Target", () => {
    it("should format EG target values correctly", () => {
      expect(prettify.formatEgTarget(0)).toBe("CUTOFF");
      expect(prettify.formatEgTarget(1)).toBe("PITCH 2");
      expect(prettify.formatEgTarget(2)).toBe("PITCH");
    });

    it("should parse EG target labels correctly", () => {
      expect(prettify.parseEgTarget("CUTOFF")).toBe(0);
      expect(prettify.parseEgTarget("PITCH 2")).toBe(1);
      expect(prettify.parseEgTarget("PITCH")).toBe(2);
    });

    it("should round-trip EG target values", () => {
      for (let i = 0; i < 3; i++) {
        const label = prettify.formatEgTarget(i);
        expect(prettify.parseEgTarget(label)).toBe(i);
      }
    });
  });

  describe("LFO Mode", () => {
    it("should format LFO mode values correctly", () => {
      expect(prettify.formatLfoMode(0)).toBe("1-SHOT");
      expect(prettify.formatLfoMode(1)).toBe("SLOW");
      expect(prettify.formatLfoMode(2)).toBe("FAST");
    });

    it("should parse LFO mode labels correctly", () => {
      expect(prettify.parseLfoMode("1-SHOT")).toBe(0);
      expect(prettify.parseLfoMode("SLOW")).toBe(1);
      expect(prettify.parseLfoMode("FAST")).toBe(2);
    });

    it("should round-trip LFO mode values", () => {
      for (let i = 0; i < 3; i++) {
        const label = prettify.formatLfoMode(i);
        expect(prettify.parseLfoMode(label)).toBe(i);
      }
    });
  });

  describe("LFO Target", () => {
    it("should format LFO target values correctly", () => {
      expect(prettify.formatLfoTarget(0)).toBe("CUTOFF");
      expect(prettify.formatLfoTarget(1)).toBe("SHAPE");
      expect(prettify.formatLfoTarget(2)).toBe("PITCH");
    });

    it("should parse LFO target labels correctly", () => {
      expect(prettify.parseLfoTarget("CUTOFF")).toBe(0);
      expect(prettify.parseLfoTarget("SHAPE")).toBe(1);
      expect(prettify.parseLfoTarget("PITCH")).toBe(2);
    });

    it("should round-trip LFO target values", () => {
      for (let i = 0; i < 3; i++) {
        const label = prettify.formatLfoTarget(i);
        expect(prettify.parseLfoTarget(label)).toBe(i);
      }
    });
  });

  describe("Slider Assign", () => {
    it("should format slider assign values correctly", () => {
      expect(prettify.formatSliderAssign(13)).toBe("VCO 1 PITCH");
      expect(prettify.formatSliderAssign(23)).toBe("CUTOFF");
      expect(prettify.formatSliderAssign(56)).toBe("PITCH BEND");
      expect(prettify.formatSliderAssign(57)).toBe("GATE TIME");
    });

    it("should parse slider assign labels correctly", () => {
      expect(prettify.parseSliderAssign("VCO 1 PITCH")).toBe(13);
      expect(prettify.parseSliderAssign("CUTOFF")).toBe(23);
      expect(prettify.parseSliderAssign("PITCH BEND")).toBe(56);
      expect(prettify.parseSliderAssign("GATE TIME")).toBe(57);
    });

    it("should round-trip all slider assign values", () => {
      const values = [13, 14, 17, 18, 21, 22, 23, 24, 26, 27, 28, 31, 32, 40, 56, 57];
      for (const v of values) {
        const label = prettify.formatSliderAssign(v);
        expect(prettify.parseSliderAssign(label)).toBe(v);
      }
    });
  });

  describe("Motion Parameter", () => {
    it("should format motion param values correctly", () => {
      expect(prettify.formatMotionParam(0)).toBe("None");
      expect(prettify.formatMotionParam(13)).toBe("VCO 1 PITCH");
      expect(prettify.formatMotionParam(23)).toBe("CUTOFF");
      expect(prettify.formatMotionParam(37)).toBe("DRIVE");
    });

    it("should parse motion param labels correctly", () => {
      expect(prettify.parseMotionParam("None")).toBe(0);
      expect(prettify.parseMotionParam("VCO 1 PITCH")).toBe(13);
      expect(prettify.parseMotionParam("CUTOFF")).toBe(23);
      expect(prettify.parseMotionParam("DRIVE")).toBe(37);
    });

    it("should round-trip all motion param values", () => {
      const values = [
        0, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 37, 40, 56, 57,
      ];
      for (const v of values) {
        const label = prettify.formatMotionParam(v);
        expect(prettify.parseMotionParam(label)).toBe(v);
      }
    });
  });

  describe("Percentages", () => {
    it("should format percentage values correctly", () => {
      expect(prettify.formatPercentage(0)).toBe("0%");
      expect(prettify.formatPercentage(1)).toBe("33%");
      expect(prettify.formatPercentage(2)).toBe("66%");
      expect(prettify.formatPercentage(3)).toBe("100%");
    });

    it("should parse percentage labels correctly", () => {
      expect(prettify.parsePercentage("0%")).toBe(0);
      expect(prettify.parsePercentage("33%")).toBe(1);
      expect(prettify.parsePercentage("66%")).toBe(2);
      expect(prettify.parsePercentage("100%")).toBe(3);
    });

    it("should round-trip percentage values", () => {
      for (let i = 0; i < 4; i++) {
        const label = prettify.formatPercentage(i);
        expect(prettify.parsePercentage(label)).toBe(i);
      }
    });
  });

  describe("Boolean", () => {
    it("should format boolean values correctly", () => {
      expect(prettify.formatBoolean(0)).toBe("OFF");
      expect(prettify.formatBoolean(1)).toBe("ON");
    });

    it("should parse boolean labels correctly", () => {
      expect(prettify.parseBoolean("OFF")).toBe(0);
      expect(prettify.parseBoolean("ON")).toBe(1);
    });

    it("should round-trip boolean values", () => {
      for (let i = 0; i < 2; i++) {
        const label = prettify.formatBoolean(i);
        expect(prettify.parseBoolean(label)).toBe(i);
      }
    });
  });

  describe("Step Resolution", () => {
    it("should format step resolution values correctly", () => {
      expect(prettify.formatStepResolution(0)).toBe("1/16");
      expect(prettify.formatStepResolution(1)).toBe("1/8");
      expect(prettify.formatStepResolution(2)).toBe("1/4");
      expect(prettify.formatStepResolution(3)).toBe("1/2");
      expect(prettify.formatStepResolution(4)).toBe("1/1");
    });

    it("should parse step resolution labels correctly", () => {
      expect(prettify.parseStepResolution("1/16")).toBe(0);
      expect(prettify.parseStepResolution("1/8")).toBe(1);
      expect(prettify.parseStepResolution("1/4")).toBe(2);
      expect(prettify.parseStepResolution("1/2")).toBe(3);
      expect(prettify.parseStepResolution("1/1")).toBe(4);
    });

    it("should round-trip step resolution values", () => {
      for (let i = 0; i < 5; i++) {
        const label = prettify.formatStepResolution(i);
        expect(prettify.parseStepResolution(label)).toBe(i);
      }
    });
  });
});
