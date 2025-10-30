import { describe, it, expect } from "vitest";
import { prettyPanelSettings, vcoPitchToCents } from "../prettify";
import type { MonologueParameters } from "../../types/parameters";
import dump1 from "./data/parsed/dump1.json";

describe("Prettify Utilities", () => {
  describe("prettyPanelSettings with dump1.json", () => {
    const patch = dump1 as MonologueParameters;
    const prettified = prettyPanelSettings(patch);

    it("should prettify drive", () => {
      expect(prettified.drive.value).toBe(0);
      expect(prettified.drive.formatted).toBe(0);
    });

    it("should prettify keyboardOctave", () => {
      expect(prettified.keyboardOctave.value).toBe(0);
      expect(prettified.keyboardOctave.formatted).toBe("-2");
    });

    it("should prettify syncRing", () => {
      expect(prettified.syncRing.value).toBe(1);
      expect(prettified.syncRing.formatted).toBe("OFF");
    });

    it("should prettify seqTrig", () => {
      expect(prettified.seqTrig.value).toBe(0);
      expect(prettified.seqTrig.formatted).toBe("OFF");
    });

    describe("VCO1", () => {
      it("should prettify wave", () => {
        expect(prettified.oscilators.vco1.wave.value).toBe(2);
        expect(prettified.oscilators.vco1.wave.formatted).toBe("SAW");
      });

      it("should prettify shape", () => {
        expect(prettified.oscilators.vco1.shape.value).toBe(0);
        expect(prettified.oscilators.vco1.shape.formatted).toBe(0);
      });

      it("should prettify level", () => {
        expect(prettified.oscilators.vco1.level.value).toBe(1023);
        expect(prettified.oscilators.vco1.level.formatted).toBe(1023);
      });

      it("should prettify pitch to cents", () => {
        expect(prettified.oscilators.vco1.pitch.value).toBe(512);
        expect(prettified.oscilators.vco1.pitch.formatted).toBe(0);
      });

      it("should prettify octave", () => {
        expect(prettified.oscilators.vco1.octave.value).toBe(1);
        expect(prettified.oscilators.vco1.octave.formatted).toBe("8'");
      });
    });

    describe("VCO2", () => {
      it("should prettify wave", () => {
        expect(prettified.oscilators.vco2.wave.value).toBe(2);
        expect(prettified.oscilators.vco2.wave.formatted).toBe("SAW");
      });

      it("should prettify shape", () => {
        expect(prettified.oscilators.vco2.shape.value).toBe(0);
        expect(prettified.oscilators.vco2.shape.formatted).toBe(0);
      });

      it("should prettify level", () => {
        expect(prettified.oscilators.vco2.level.value).toBe(1023);
        expect(prettified.oscilators.vco2.level.formatted).toBe(1023);
      });

      it("should prettify pitch to cents", () => {
        expect(prettified.oscilators.vco2.pitch.value).toBe(1023);
        expect(prettified.oscilators.vco2.pitch.formatted).toBe(1200);
      });

      it("should prettify octave", () => {
        expect(prettified.oscilators.vco2.octave.value).toBe(0);
        expect(prettified.oscilators.vco2.octave.formatted).toBe("16'");
      });
    });

    describe("Filter", () => {
      it("should prettify cutoff", () => {
        expect(prettified.filter.cutoff.value).toBe(488);
        expect(prettified.filter.cutoff.formatted).toBe(488);
      });

      it("should prettify resonance", () => {
        expect(prettified.filter.resonance.value).toBe(909);
        expect(prettified.filter.resonance.formatted).toBe(909);
      });
    });

    describe("Envelope", () => {
      it("should prettify type", () => {
        expect(prettified.envelope.type.value).toBe(0);
        expect(prettified.envelope.type.formatted).toBe("GATE");
      });

      it("should prettify attack", () => {
        expect(prettified.envelope.attack.value).toBe(0);
        expect(prettified.envelope.attack.formatted).toBe(0);
      });

      it("should prettify decay", () => {
        expect(prettified.envelope.decay.value).toBe(485);
        expect(prettified.envelope.decay.formatted).toBe(485);
      });

      it("should prettify intensity", () => {
        expect(prettified.envelope.intensity.value).toBe(855);
        expect(prettified.envelope.intensity.formatted).toBe(855);
      });

      it("should prettify target", () => {
        expect(prettified.envelope.target.value).toBe(0);
        expect(prettified.envelope.target.formatted).toBe("CUTOFF");
      });
    });

    describe("LFO", () => {
      it("should prettify type", () => {
        expect(prettified.lfo.type.value).toBe(1);
        expect(prettified.lfo.type.formatted).toBe("TRI");
      });

      it("should prettify mode", () => {
        expect(prettified.lfo.mode.value).toBe(1);
        expect(prettified.lfo.mode.formatted).toBe("SLOW");
      });

      it("should prettify rate", () => {
        expect(prettified.lfo.rate.value).toBe(512);
        expect(prettified.lfo.rate.formatted).toBe(512);
      });

      it("should prettify intensity", () => {
        expect(prettified.lfo.intensity.value).toBe(512);
        expect(prettified.lfo.intensity.formatted).toBe(512);
      });

      it("should prettify target", () => {
        expect(prettified.lfo.target.value).toBe(2);
        expect(prettified.lfo.target.formatted).toBe("PITCH");
      });
    });
  });

  describe("vcoPitchToCents edge cases", () => {
    it("should handle boundary values correctly", () => {
      expect(vcoPitchToCents(0)).toBe(-1200);
      expect(vcoPitchToCents(4)).toBe(-1200);
      expect(vcoPitchToCents(492)).toBe(0);
      expect(vcoPitchToCents(512)).toBe(0);
      expect(vcoPitchToCents(532)).toBe(0);
      expect(vcoPitchToCents(1020)).toBe(1200);
      expect(vcoPitchToCents(1023)).toBe(1200);
    });

    it("should handle interpolation ranges", () => {
      // Mid-point in 4-356 range (-1200 to -256)
      const midpoint1 = vcoPitchToCents(180);
      expect(midpoint1).toBeCloseTo(-728, 0);

      // Mid-point in 668-1020 range (256 to 1200)
      const midpoint2 = vcoPitchToCents(844);
      expect(midpoint2).toBeCloseTo(728, 0);
    });
  });
});
