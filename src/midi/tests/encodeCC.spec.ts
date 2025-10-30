import { describe, it, expect } from "vitest";
import { encodeCC } from "../encodeCC";
import { decodeCC } from "../decodeCC";

describe("encodeCC", () => {
  describe("Continuous parameters (0-1023 → 0-127)", () => {
    it("should encode AMP EG ATTACK", () => {
      expect(encodeCC("ampEgAttack", 0)).toEqual([0xb0, 16, 0]);
      expect(encodeCC("ampEgAttack", 512)).toEqual([0xb0, 16, 64]);
      expect(encodeCC("ampEgAttack", 1023)).toEqual([0xb0, 16, 127]);
    });

    it("should encode AMP EG DECAY", () => {
      expect(encodeCC("ampEgDecay", 0)).toEqual([0xb0, 17, 0]);
      expect(encodeCC("ampEgDecay", 1023)).toEqual([0xb0, 17, 127]);
    });

    it("should encode LFO RATE", () => {
      expect(encodeCC("lfoRate", 0)).toEqual([0xb0, 24, 0]);
      expect(encodeCC("lfoRate", 1023)).toEqual([0xb0, 24, 127]);
    });

    it("should encode EG INT", () => {
      expect(encodeCC("egInt", 0)).toEqual([0xb0, 25, 0]);
      expect(encodeCC("egInt", 1023)).toEqual([0xb0, 25, 127]);
    });

    it("should encode LFO INT", () => {
      expect(encodeCC("lfoInt", 0)).toEqual([0xb0, 26, 0]);
      expect(encodeCC("lfoInt", 1023)).toEqual([0xb0, 26, 127]);
    });

    it("should encode DRIVE", () => {
      expect(encodeCC("drive", 0)).toEqual([0xb0, 28, 0]);
      expect(encodeCC("drive", 1023)).toEqual([0xb0, 28, 127]);
    });

    it("should encode VCO 1 PITCH", () => {
      expect(encodeCC("vco1Pitch", 0)).toEqual([0xb0, 34, 0]);
      expect(encodeCC("vco1Pitch", 1023)).toEqual([0xb0, 34, 127]);
    });

    it("should encode VCO 2 PITCH", () => {
      expect(encodeCC("vco2Pitch", 0)).toEqual([0xb0, 35, 0]);
      expect(encodeCC("vco2Pitch", 1023)).toEqual([0xb0, 35, 127]);
    });

    it("should encode VCO 1 SHAPE", () => {
      expect(encodeCC("vco1Shape", 0)).toEqual([0xb0, 36, 0]);
      expect(encodeCC("vco1Shape", 1023)).toEqual([0xb0, 36, 127]);
    });

    it("should encode VCO 2 SHAPE", () => {
      expect(encodeCC("vco2Shape", 0)).toEqual([0xb0, 37, 0]);
      expect(encodeCC("vco2Shape", 1023)).toEqual([0xb0, 37, 127]);
    });

    it("should encode VCO 1 LEVEL", () => {
      expect(encodeCC("vco1Level", 0)).toEqual([0xb0, 39, 0]);
      expect(encodeCC("vco1Level", 1023)).toEqual([0xb0, 39, 127]);
    });

    it("should encode VCO 2 LEVEL", () => {
      expect(encodeCC("vco2Level", 0)).toEqual([0xb0, 40, 0]);
      expect(encodeCC("vco2Level", 1023)).toEqual([0xb0, 40, 127]);
    });

    it("should encode CUTOFF", () => {
      expect(encodeCC("cutoff", 0)).toEqual([0xb0, 43, 0]);
      expect(encodeCC("cutoff", 1023)).toEqual([0xb0, 43, 127]);
    });

    it("should encode RESONANCE", () => {
      expect(encodeCC("resonance", 0)).toEqual([0xb0, 44, 0]);
      expect(encodeCC("resonance", 1023)).toEqual([0xb0, 44, 127]);
    });
  });

  describe("Discrete 4-value parameters (VCO octaves)", () => {
    it("should encode VCO 1 OCTAVE with 4 values", () => {
      expect(encodeCC("vco1Octave", 0)).toEqual([0xb0, 48, 0]); // 16'
      expect(encodeCC("vco1Octave", 1)).toEqual([0xb0, 48, 42]); // 8'
      expect(encodeCC("vco1Octave", 2)).toEqual([0xb0, 48, 84]); // 4'
      expect(encodeCC("vco1Octave", 3)).toEqual([0xb0, 48, 127]); // 2'
    });

    it("should encode VCO 2 OCTAVE with 4 values", () => {
      expect(encodeCC("vco2Octave", 0)).toEqual([0xb0, 49, 0]);
      expect(encodeCC("vco2Octave", 1)).toEqual([0xb0, 49, 42]);
      expect(encodeCC("vco2Octave", 2)).toEqual([0xb0, 49, 84]);
      expect(encodeCC("vco2Octave", 3)).toEqual([0xb0, 49, 127]);
    });
  });

  describe("Discrete 3-value parameters", () => {
    it("should encode VCO 1 WAVE: SQR, TRI, SAW", () => {
      expect(encodeCC("vco1Wave", 0)).toEqual([0xb0, 50, 0]); // SQR
      expect(encodeCC("vco1Wave", 1)).toEqual([0xb0, 50, 64]); // TRI
      expect(encodeCC("vco1Wave", 2)).toEqual([0xb0, 50, 127]); // SAW
    });

    it("should encode VCO 2 WAVE: NOISE, TRI, SAW", () => {
      expect(encodeCC("vco2Wave", 0)).toEqual([0xb0, 51, 0]); // NOISE
      expect(encodeCC("vco2Wave", 1)).toEqual([0xb0, 51, 64]); // TRI
      expect(encodeCC("vco2Wave", 2)).toEqual([0xb0, 51, 127]); // SAW
    });

    it("should encode LFO TARGET: CUTOFF, SHAPE, PITCH", () => {
      expect(encodeCC("lfoTarget", 0)).toEqual([0xb0, 56, 0]); // CUTOFF
      expect(encodeCC("lfoTarget", 1)).toEqual([0xb0, 56, 64]); // SHAPE
      expect(encodeCC("lfoTarget", 2)).toEqual([0xb0, 56, 127]); // PITCH
    });

    it("should encode LFO WAVE: SQR, TRI, SAW", () => {
      expect(encodeCC("lfoWave", 0)).toEqual([0xb0, 58, 0]);
      expect(encodeCC("lfoWave", 1)).toEqual([0xb0, 58, 64]);
      expect(encodeCC("lfoWave", 2)).toEqual([0xb0, 58, 127]);
    });

    it("should encode LFO MODE: 1-SHOT, SLOW, FAST", () => {
      expect(encodeCC("lfoMode", 0)).toEqual([0xb0, 59, 0]);
      expect(encodeCC("lfoMode", 1)).toEqual([0xb0, 59, 64]);
      expect(encodeCC("lfoMode", 2)).toEqual([0xb0, 59, 127]);
    });

    it("should encode SYNC/RING: RING, OFF, SYNC", () => {
      expect(encodeCC("syncRing", 0)).toEqual([0xb0, 60, 0]);
      expect(encodeCC("syncRing", 1)).toEqual([0xb0, 60, 64]);
      expect(encodeCC("syncRing", 2)).toEqual([0xb0, 60, 127]);
    });

    it("should encode EG TYPE: GATE, A/G/D, A/D", () => {
      expect(encodeCC("egType", 0)).toEqual([0xb0, 61, 0]);
      expect(encodeCC("egType", 1)).toEqual([0xb0, 61, 64]);
      expect(encodeCC("egType", 2)).toEqual([0xb0, 61, 127]);
    });

    it("should encode EG TARGET: CUTOFF, PITCH 2, PITCH", () => {
      expect(encodeCC("egTarget", 0)).toEqual([0xb0, 62, 0]);
      expect(encodeCC("egTarget", 1)).toEqual([0xb0, 62, 64]);
      expect(encodeCC("egTarget", 2)).toEqual([0xb0, 62, 127]);
    });
  });

  describe("Round-trip encoding/decoding", () => {
    it("should maintain values through encode/decode cycle for continuous params", () => {
      const testValue = 512;
      const encoded = encodeCC("drive", testValue);
      expect(encoded).not.toBeNull();

      if (encoded) {
        const decoded = decodeCC(encoded[0], encoded[1], encoded[2]);
        expect(decoded).not.toBeNull();
        expect(decoded?.parameter).toBe("drive");
        // Allow small rounding error due to 0-1023 → 0-127 → 0-1023 conversion
        expect(Math.abs(decoded!.value - testValue)).toBeLessThan(10);
      }
    });

    it("should maintain values through encode/decode cycle for discrete params", () => {
      const encoded = encodeCC("vco1Wave", 1);
      expect(encoded).not.toBeNull();

      if (encoded) {
        const decoded = decodeCC(encoded[0], encoded[1], encoded[2]);
        expect(decoded).toEqual({ parameter: "vco1Wave", value: 1 });
      }
    });
  });

  describe("Unknown parameters", () => {
    it("should return null for unknown parameter names", () => {
      expect(encodeCC("unknownParam", 100)).toBeNull();
      expect(encodeCC("invalidParameter", 0)).toBeNull();
    });
  });
});
