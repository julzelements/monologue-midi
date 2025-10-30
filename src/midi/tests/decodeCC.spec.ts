import { describe, it, expect } from "vitest";
import { decodeCC } from "../decodeCC";

describe("decodeCC", () => {
  describe("Continuous parameters (0-127 → 0-1023)", () => {
    it("should decode AMP EG ATTACK (CC16)", () => {
      expect(decodeCC(0xb0, 16, 0)).toEqual({ parameter: "ampEgAttack", value: 0 });
      expect(decodeCC(0xb0, 16, 64)).toEqual({ parameter: "ampEgAttack", value: 516 });
      expect(decodeCC(0xb0, 16, 127)).toEqual({ parameter: "ampEgAttack", value: 1023 });
    });

    it("should decode AMP EG DECAY (CC17)", () => {
      expect(decodeCC(0xb0, 17, 0)).toEqual({ parameter: "ampEgDecay", value: 0 });
      expect(decodeCC(0xb0, 17, 127)).toEqual({ parameter: "ampEgDecay", value: 1023 });
    });

    it("should decode LFO RATE (CC24)", () => {
      expect(decodeCC(0xb0, 24, 0)).toEqual({ parameter: "lfoRate", value: 0 });
      expect(decodeCC(0xb0, 24, 127)).toEqual({ parameter: "lfoRate", value: 1023 });
    });

    it("should decode EG INT (CC25)", () => {
      expect(decodeCC(0xb0, 25, 0)).toEqual({ parameter: "egInt", value: 0 });
      expect(decodeCC(0xb0, 25, 127)).toEqual({ parameter: "egInt", value: 1023 });
    });

    it("should decode LFO INT (CC26)", () => {
      expect(decodeCC(0xb0, 26, 0)).toEqual({ parameter: "lfoInt", value: 0 });
      expect(decodeCC(0xb0, 26, 127)).toEqual({ parameter: "lfoInt", value: 1023 });
    });

    it("should decode DRIVE (CC28)", () => {
      expect(decodeCC(0xb0, 28, 0)).toEqual({ parameter: "drive", value: 0 });
      expect(decodeCC(0xb0, 28, 127)).toEqual({ parameter: "drive", value: 1023 });
    });

    it("should decode VCO 1 PITCH (CC34)", () => {
      expect(decodeCC(0xb0, 34, 0)).toEqual({ parameter: "vco1Pitch", value: 0 });
      expect(decodeCC(0xb0, 34, 127)).toEqual({ parameter: "vco1Pitch", value: 1023 });
    });

    it("should decode VCO 2 PITCH (CC35)", () => {
      expect(decodeCC(0xb0, 35, 0)).toEqual({ parameter: "vco2Pitch", value: 0 });
      expect(decodeCC(0xb0, 35, 127)).toEqual({ parameter: "vco2Pitch", value: 1023 });
    });

    it("should decode VCO 1 SHAPE (CC36)", () => {
      expect(decodeCC(0xb0, 36, 0)).toEqual({ parameter: "vco1Shape", value: 0 });
      expect(decodeCC(0xb0, 36, 127)).toEqual({ parameter: "vco1Shape", value: 1023 });
    });

    it("should decode VCO 2 SHAPE (CC37)", () => {
      expect(decodeCC(0xb0, 37, 0)).toEqual({ parameter: "vco2Shape", value: 0 });
      expect(decodeCC(0xb0, 37, 127)).toEqual({ parameter: "vco2Shape", value: 1023 });
    });

    it("should decode VCO 1 LEVEL (CC39)", () => {
      expect(decodeCC(0xb0, 39, 0)).toEqual({ parameter: "vco1Level", value: 0 });
      expect(decodeCC(0xb0, 39, 127)).toEqual({ parameter: "vco1Level", value: 1023 });
    });

    it("should decode VCO 2 LEVEL (CC40)", () => {
      expect(decodeCC(0xb0, 40, 0)).toEqual({ parameter: "vco2Level", value: 0 });
      expect(decodeCC(0xb0, 40, 127)).toEqual({ parameter: "vco2Level", value: 1023 });
    });

    it("should decode CUTOFF (CC43)", () => {
      expect(decodeCC(0xb0, 43, 0)).toEqual({ parameter: "cutoff", value: 0 });
      expect(decodeCC(0xb0, 43, 127)).toEqual({ parameter: "cutoff", value: 1023 });
    });

    it("should decode RESONANCE (CC44)", () => {
      expect(decodeCC(0xb0, 44, 0)).toEqual({ parameter: "resonance", value: 0 });
      expect(decodeCC(0xb0, 44, 127)).toEqual({ parameter: "resonance", value: 1023 });
    });
  });

  describe("Discrete 4-value parameters (VCO octaves)", () => {
    it("should decode VCO 1 OCTAVE (CC48) with 4 values", () => {
      // 16' = 0-31 → 0
      expect(decodeCC(0xb0, 48, 0)).toEqual({ parameter: "vco1Octave", value: 0 });
      expect(decodeCC(0xb0, 48, 31)).toEqual({ parameter: "vco1Octave", value: 0 });

      // 8' = 32-63 → 1
      expect(decodeCC(0xb0, 48, 32)).toEqual({ parameter: "vco1Octave", value: 1 });
      expect(decodeCC(0xb0, 48, 63)).toEqual({ parameter: "vco1Octave", value: 1 });

      // 4' = 64-95 → 2
      expect(decodeCC(0xb0, 48, 64)).toEqual({ parameter: "vco1Octave", value: 2 });
      expect(decodeCC(0xb0, 48, 95)).toEqual({ parameter: "vco1Octave", value: 2 });

      // 2' = 96-127 → 3
      expect(decodeCC(0xb0, 48, 96)).toEqual({ parameter: "vco1Octave", value: 3 });
      expect(decodeCC(0xb0, 48, 127)).toEqual({ parameter: "vco1Octave", value: 3 });
    });

    it("should decode VCO 2 OCTAVE (CC49) with 4 values", () => {
      expect(decodeCC(0xb0, 49, 0)).toEqual({ parameter: "vco2Octave", value: 0 });
      expect(decodeCC(0xb0, 49, 32)).toEqual({ parameter: "vco2Octave", value: 1 });
      expect(decodeCC(0xb0, 49, 64)).toEqual({ parameter: "vco2Octave", value: 2 });
      expect(decodeCC(0xb0, 49, 96)).toEqual({ parameter: "vco2Octave", value: 3 });
    });
  });

  describe("Discrete 3-value parameters", () => {
    it("should decode VCO 1 WAVE (CC50): SQR, TRI, SAW", () => {
      // SQR = 0-42 → 0
      expect(decodeCC(0xb0, 50, 0)).toEqual({ parameter: "vco1Wave", value: 0 });
      expect(decodeCC(0xb0, 50, 42)).toEqual({ parameter: "vco1Wave", value: 0 });

      // TRI = 43-85 → 1
      expect(decodeCC(0xb0, 50, 43)).toEqual({ parameter: "vco1Wave", value: 1 });
      expect(decodeCC(0xb0, 50, 64)).toEqual({ parameter: "vco1Wave", value: 1 });
      expect(decodeCC(0xb0, 50, 85)).toEqual({ parameter: "vco1Wave", value: 1 });

      // SAW = 86-127 → 2
      expect(decodeCC(0xb0, 50, 86)).toEqual({ parameter: "vco1Wave", value: 2 });
      expect(decodeCC(0xb0, 50, 127)).toEqual({ parameter: "vco1Wave", value: 2 });
    });

    it("should decode VCO 2 WAVE (CC51): NOISE, TRI, SAW", () => {
      expect(decodeCC(0xb0, 51, 0)).toEqual({ parameter: "vco2Wave", value: 0 });
      expect(decodeCC(0xb0, 51, 64)).toEqual({ parameter: "vco2Wave", value: 1 });
      expect(decodeCC(0xb0, 51, 127)).toEqual({ parameter: "vco2Wave", value: 2 });
    });

    it("should decode LFO TARGET (CC56): CUTOFF, SHAPE, PITCH", () => {
      expect(decodeCC(0xb0, 56, 0)).toEqual({ parameter: "lfoTarget", value: 0 });
      expect(decodeCC(0xb0, 56, 64)).toEqual({ parameter: "lfoTarget", value: 1 });
      expect(decodeCC(0xb0, 56, 127)).toEqual({ parameter: "lfoTarget", value: 2 });
    });

    it("should decode LFO WAVE (CC58): SQR, TRI, SAW", () => {
      expect(decodeCC(0xb0, 58, 0)).toEqual({ parameter: "lfoWave", value: 0 });
      expect(decodeCC(0xb0, 58, 64)).toEqual({ parameter: "lfoWave", value: 1 });
      expect(decodeCC(0xb0, 58, 127)).toEqual({ parameter: "lfoWave", value: 2 });
    });

    it("should decode LFO MODE (CC59): 1-SHOT, SLOW, FAST", () => {
      expect(decodeCC(0xb0, 59, 0)).toEqual({ parameter: "lfoMode", value: 0 });
      expect(decodeCC(0xb0, 59, 64)).toEqual({ parameter: "lfoMode", value: 1 });
      expect(decodeCC(0xb0, 59, 127)).toEqual({ parameter: "lfoMode", value: 2 });
    });

    it("should decode SYNC/RING (CC60): RING, OFF, SYNC", () => {
      expect(decodeCC(0xb0, 60, 0)).toEqual({ parameter: "syncRing", value: 0 });
      expect(decodeCC(0xb0, 60, 64)).toEqual({ parameter: "syncRing", value: 1 });
      expect(decodeCC(0xb0, 60, 127)).toEqual({ parameter: "syncRing", value: 2 });
    });

    it("should decode EG TYPE (CC61): GATE, A/G/D, A/D", () => {
      expect(decodeCC(0xb0, 61, 0)).toEqual({ parameter: "egType", value: 0 });
      expect(decodeCC(0xb0, 61, 64)).toEqual({ parameter: "egType", value: 1 });
      expect(decodeCC(0xb0, 61, 127)).toEqual({ parameter: "egType", value: 2 });
    });

    it("should decode EG TARGET (CC62): CUTOFF, PITCH 2, PITCH", () => {
      expect(decodeCC(0xb0, 62, 0)).toEqual({ parameter: "egTarget", value: 0 });
      expect(decodeCC(0xb0, 62, 64)).toEqual({ parameter: "egTarget", value: 1 });
      expect(decodeCC(0xb0, 62, 127)).toEqual({ parameter: "egTarget", value: 2 });
    });
  });

  describe("Unknown CC numbers", () => {
    it("should return null for unknown CC numbers", () => {
      expect(decodeCC(0xb0, 1, 64)).toBeNull();
      expect(decodeCC(0xb0, 99, 127)).toBeNull();
      expect(decodeCC(0xb0, 120, 0)).toBeNull();
    });
  });
});
