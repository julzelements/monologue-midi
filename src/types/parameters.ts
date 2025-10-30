/**
 * Type definitions for Monologue MIDI parameters
 */

/**
 * A value with both a numeric value and a human-readable name
 */
export interface NamedValue {
  name: string;
  value: number;
}

/**
 * Complete structure of decoded Monologue parameters
 */
export interface MonologueParameters {
  patchName: string;
  panelSettings: {
    drive: NamedValue;
    keyboardOctave: NamedValue;
    syncRing: NamedValue;
    seqTrig: NamedValue;
    oscilators: {
      vco1: {
        wave: NamedValue;
        shape: NamedValue;
        level: NamedValue;
        pitch: NamedValue;
        octave: NamedValue;
      };
      vco2: {
        wave: NamedValue;
        shape: NamedValue;
        level: NamedValue;
        pitch: NamedValue;
        octave: NamedValue;
      };
    };
    filter: {
      cutoff: NamedValue;
      resonance: NamedValue;
    };
    envelope: {
      type: NamedValue;
      attack: NamedValue;
      decay: NamedValue;
      intensity: NamedValue;
      target: NamedValue;
    };
    lfo: {
      type: NamedValue;
      mode: NamedValue;
      rate: NamedValue;
      intensity: NamedValue;
      target: NamedValue;
    };
  };
  programSettings: {
    portamento: {
      time: NamedValue;
      mode: NamedValue;
      slideTime: NamedValue;
    };
    slider: {
      assign: NamedValue;
      bendRangePlus: NamedValue;
      bendRangeMinus: NamedValue;
    };
    pitch: {
      microTuning: NamedValue;
      scaleKey: NamedValue;
      programTuning: NamedValue;
    };
    other: {
      lfoBpmSync: NamedValue;
      cutoffKeyTrack: NamedValue;
      cutoffVelocity: NamedValue;
      ampVelocity: NamedValue;
      programLevel: NamedValue;
    };
  };
  sequencerSettings: {
    bpm: NamedValue;
    stepLength: NamedValue;
    stepResolution: NamedValue;
    swing: NamedValue;
    defaultGateTime: NamedValue;
    motionSlotParams: Array<{
      slotNumber: number;
      active: NamedValue;
      smooth: NamedValue;
      parameter: NamedValue;
      hasMotionData: number[];
    }>;
  };
  sequencerSteps: Array<{
    stepNumber: number;
    active: NamedValue;
    motionActive: NamedValue;
    slideActive: NamedValue;
    event: {
      note: {
        key: NamedValue;
        velocity: NamedValue;
        gateTime: NamedValue;
        trigger: NamedValue;
      };
      motionSlotsData: NamedValue[][];
    };
  }>;
}
