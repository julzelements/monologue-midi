export interface MonologueParameters {
  isValid: boolean;
  patchName: string;
  error?: string; // Only optional field - only present when isValid is false

  // All parameters are required in strict mode
  drive: number;
  oscillators: {
    vco1: {
      wave: number; // 0-3 (SAW, TRI, SQR, NOISE)
      pitch: number; // 0-1023
      shape: number; // 0-1023
      level: number; // 0-1023
      octave: number; // 0-3 (16', 8', 4', 2') - Made required
    };
    vco2: {
      wave: number; // 0-3 (SAW, TRI, SQR, NOISE)
      shape: number; // 0-1023
      level: number; // 0-1023
      pitch: number; // 0-1023
      sync: number; // 0-3 (OFF, RING, SYNC, RING+SYNC)
      octave: number; // 0-3 (16', 8', 4', 2')
    };
  };
  filter: {
    cutoff: number; // 0-1023
    resonance: number; // 0-1023
  };
  envelope: {
    type: number; // 0-3 (GATE, ADSR, ADS, AR)
    attack: number; // 0-1023
    decay: number; // 0-1023
    intensity: number; // -512 to +511 (0-1023 raw, adjusted)
    target: number; // 0-3 (PITCH, CUTOFF, AMP, PITCH+CUTOFF)
  };
  lfo: {
    wave: number; // 0-3 (SAW, TRI, SQR, S&H)
    mode: number; // 0-3 (1-SHOT, SLOW, FAST, 1S+F)
    rate: number; // 0-1023
    intensity: number; // -512 to +511 (0-1023 raw, adjusted)
    target: number; // 0-3 (PITCH, CUTOFF, AMP, PITCH+CUTOFF)
  };
  sequencer: {
    stepLength: number; // 1-16 (active steps)
    stepResolution: number; // 0-4 (1/16, 1/8, 1/4, 1/2, 1/1)
    swing: number; // -75 to +75 (timing swing)
    stepOnOff: boolean[]; // 16 boolean flags for step on/off
    motionOnOff: boolean[]; // 16 boolean flags for motion sequencing
  };
  motionSequencing: {
    slots: Array<{
      motionOn: boolean; // Motion On/Off flag
      smoothOn: boolean; // Smooth On/Off flag
      parameterId: number; // Which parameter to automate (0=None, 13=VCO1 PITCH, etc.)
      stepEnabled: boolean[]; // 16 boolean flags for this slot's per-step enable
    }>;
    stepEvents: Array<{
      noteNumber: number; // 0-127 (0 = no event)
      velocity: number; // 0-127 (0 = no event, 1-127 = velocity)
      gateTime: number; // 0-127 (0-72 = 0-100%, 73-127 = TIE)
      triggerSwitch: boolean; // Trigger switch on/off
      motionData: Array<{
        data1: number; // Primary motion value (0-255)
        data2: number; // Secondary value for smooth interpolation (0-255)
        data3: number; // Additional motion data (0-255)
        data4: number; // Additional motion data (0-255)
      }>; // 4 motion slots per step
    }>; // 16 steps
  };
  amp: {
    attack: number; // 0-127 (AMP EG Attack - CC 16)
    decay: number; // 0-127 (AMP EG Decay - CC 17)
  };
  misc: {
    bpmSync: boolean; // BPM sync on/off
    portamentMode: boolean; // Portament mode on/off
    portamentTime: number; // 0-127
    cutoffVelocity: number; // 0-3 (0%, 33%, 66%, 100%)
    cutoffKeyTrack: number; // 0-3 (0%, 33%, 66%, 100%)
    sliderAssign: string; // Parameter name
  };
}

// Motion Parameter ID mapping from CURRENT PROGRAM DATA DUMP.txt
const MOTION_PARAMETER_ID_MATRIX: { [key: number]: string } = {
  0: "None",
  13: "VCO 1 PITCH",
  14: "VCO 1 SHAPE",
  15: "VCO 1 OCTAVE",
  16: "VCO 1 WAVE",
  17: "VCO 2 PITCH",
  18: "VCO 2 SHAPE",
  19: "VCO 2 OCTAVE",
  20: "VCO 2 WAVE",
  21: "VCO 1 LEVEL",
  22: "VCO 2 LEVEL",
  23: "CUTOFF",
  24: "RESONANCE",
  25: "SYNC/RING",
  26: "ATTACK",
  27: "DECAY",
  28: "EG INT",
  29: "EG TYPE",
  30: "EG TARGET",
  31: "LFO RATE",
  32: "LFO INT",
  33: "LFO TARGET",
  34: "LFO TYPE",
  35: "LFO MODE",
  37: "DRIVE",
  40: "PORTAMENT",
  56: "PITCH BEND",
  57: "GATE TIME",
};

// Slider assignment matrix from monologue.js
const SLIDER_ASSIGN_MATRIX: { [key: number]: string } = {
  13: "VCO 1 PITCH",
  14: "VCO 1 SHAPE",
  17: "VCO 2 PITCH",
  18: "VCO 2 SHAPE",
  21: "VCO 1 LEVEL",
  22: "VCO 1 LEVEL",
  23: "CUTOFF",
  24: "RESONANCE",
  26: "ATTACK",
  27: "DECAY",
  28: "EG INT",
  31: "LFO RATE",
  32: "LFO INT",
  40: "PORTAMENT",
  56: "PITCH BEND",
  57: "GATE TIME",
};

/**
 * Convert 10-bit internal value (0-1023) to MIDI CC value (0-127)
 */
export function to7BitMidiValue(value10bit: number): number {
  return Math.round((value10bit / 1023) * 127);
}

/**
 * Convert MIDI CC value (0-127) to 10-bit internal value (0-1023)
 */
export function from7BitMidiValue(valueMidi: number): number {
  return Math.round((valueMidi / 127) * 1023);
}

/**
 * Complete Monologue SysEx decoder based on the working JavaScript implementation
 */
export function decodeMonologueParameters(rawSysexData: number[]): MonologueParameters {
  try {
    // Validate basic structure
    if (rawSysexData.length !== 520) {
      return {
        isValid: false,
        patchName: "",
        error: `Invalid SysEx length: ${rawSysexData.length}, expected 520`,
        drive: 0,
        oscillators: {
          vco1: { wave: 0, pitch: 0, shape: 0, level: 0, octave: 0 },
          vco2: { wave: 0, shape: 0, level: 0, pitch: 0, sync: 0, octave: 0 },
        },
        filter: { cutoff: 0, resonance: 0 },
        envelope: { type: 0, attack: 0, decay: 0, intensity: 0, target: 0 },
        lfo: { wave: 0, mode: 0, rate: 0, intensity: 0, target: 0 },
        sequencer: {
          stepLength: 0,
          stepResolution: 0,
          swing: 0,
          stepOnOff: Array(16).fill(false),
          motionOnOff: Array(16).fill(false),
        },
        motionSequencing: { slots: [], stepEvents: [] },
        amp: { attack: 0, decay: 0 },
        misc: {
          bpmSync: false,
          portamentMode: false,
          portamentTime: 0,
          cutoffVelocity: 0,
          cutoffKeyTrack: 0,
          sliderAssign: "",
        },
      };
    }

    // Validate header [0xF0, 0x42, 0x30, 0x00, 0x01, 0x44, 0x40]
    const expectedHeader = [0xf0, 0x42, 0x30, 0x00, 0x01, 0x44, 0x40];
    for (let i = 0; i < expectedHeader.length; i++) {
      if (rawSysexData[i] !== expectedHeader[i]) {
        return {
          isValid: false,
          patchName: "",
          error: `Invalid header at byte ${i}`,
          drive: 0,
          oscillators: {
            vco1: { wave: 0, pitch: 0, shape: 0, level: 0, octave: 0 },
            vco2: { wave: 0, shape: 0, level: 0, pitch: 0, sync: 0, octave: 0 },
          },
          filter: { cutoff: 0, resonance: 0 },
          envelope: { type: 0, attack: 0, decay: 0, intensity: 0, target: 0 },
          lfo: { wave: 0, mode: 0, rate: 0, intensity: 0, target: 0 },
          sequencer: {
            stepLength: 0,
            stepResolution: 0,
            swing: 0,
            stepOnOff: Array(16).fill(false),
            motionOnOff: Array(16).fill(false),
          },
          motionSequencing: { slots: [], stepEvents: [] },
          amp: { attack: 0, decay: 0 },
          misc: {
            bpmSync: false,
            portamentMode: false,
            portamentTime: 0,
            cutoffVelocity: 0,
            cutoffKeyTrack: 0,
            sliderAssign: "",
          },
        };
      }
    }

    // Transform to 8-bit data using the same method as example parser
    const data = transformDataFrom7BitTo8Bit(rawSysexData);

    // Extract patch name (bytes 4-15)
    const patchName = data
      .slice(4, 16)
      .map((x) => String.fromCharCode(x))
      .join("")
      .replace(/\0/g, "") // Remove null terminators
      .trim();

    // Drive parameter
    const drive = addLowerBits(data[29], data[35], 6);

    // VCO 1 parameters
    const vco1 = {
      wave: getBits(data[30], 6, 7),
      pitch: addLowerBits(data[16], data[30], 0),
      shape: addLowerBits(data[17], data[30], 2),
      level: addLowerBits(data[20], data[33], 0),
      octave: getBits(data[30], 4, 5),
    };

    // VCO 2 parameters
    const vco2 = {
      wave: getBits(data[31], 6, 7),
      shape: addLowerBits(data[19], data[31], 2),
      level: addLowerBits(data[21], data[33], 2),
      sync: getBits(data[32], 0, 1),
      pitch: addLowerBits(data[18], data[31], 0),
      octave: getBits(data[31], 4, 5),
    };

    // Filter parameters (VCF) - same as our working parser
    const filter = {
      cutoff: addLowerBits(data[22], data[33], 4),
      resonance: addLowerBits(data[23], data[33], 6),
    };

    // Envelope parameters
    const envelope = {
      type: getBits(data[34], 0, 1),
      attack: addLowerBits(data[24], data[34], 2),
      decay: addLowerBits(data[25], data[34], 4),
      intensity: addLowerBits(data[26], data[35], 0) - 512, // Adjust to bipolar range
      target: getBits(data[34], 6, 7),
    };

    // LFO parameters
    const lfo = {
      wave: getBits(data[36], 0, 1),
      mode: getBits(data[36], 2, 3),
      rate: addLowerBits(data[27], data[35], 2),
      intensity: addLowerBits(data[28], data[35], 4) - 512, // Adjust to bipolar range
      target: getBits(data[36], 4, 5),
    };

    // Sequencer parameters (bytes 54-66)
    const sequencer = {
      stepLength: data[54], // 1-16 steps
      stepResolution: data[55], // 0-4 (1/16, 1/8, 1/4, 1/2, 1/1)
      swing: data[56] - 75, // Adjust to -75 to +75 range
      stepOnOff: [
        // Byte 64: Steps 1-8
        getBits(data[64], 0, 0) === 1,
        getBits(data[64], 1, 1) === 1,
        getBits(data[64], 2, 2) === 1,
        getBits(data[64], 3, 3) === 1,
        getBits(data[64], 4, 4) === 1,
        getBits(data[64], 5, 5) === 1,
        getBits(data[64], 6, 6) === 1,
        getBits(data[64], 7, 7) === 1,
        // Byte 65: Steps 9-16
        getBits(data[65], 0, 0) === 1,
        getBits(data[65], 1, 1) === 1,
        getBits(data[65], 2, 2) === 1,
        getBits(data[65], 3, 3) === 1,
        getBits(data[65], 4, 4) === 1,
        getBits(data[65], 5, 5) === 1,
        getBits(data[65], 6, 6) === 1,
        getBits(data[65], 7, 7) === 1,
      ],
      motionOnOff: [
        // Byte 66: Motion Steps 1-8
        getBits(data[66], 0, 0) === 1,
        getBits(data[66], 1, 1) === 1,
        getBits(data[66], 2, 2) === 1,
        getBits(data[66], 3, 3) === 1,
        getBits(data[66], 4, 4) === 1,
        getBits(data[66], 5, 5) === 1,
        getBits(data[66], 6, 6) === 1,
        getBits(data[66], 7, 7) === 1,
        // Byte 67: Motion Steps 9-16
        getBits(data[67], 0, 0) === 1,
        getBits(data[67], 1, 1) === 1,
        getBits(data[67], 2, 2) === 1,
        getBits(data[67], 3, 3) === 1,
        getBits(data[67], 4, 4) === 1,
        getBits(data[67], 5, 5) === 1,
        getBits(data[67], 6, 6) === 1,
        getBits(data[67], 7, 7) === 1,
      ],
    };

    // Motion Sequencing data (bytes 72-447)
    const motionSequencing = {
      // Motion Slot Parameters (bytes 72-79, 2 bytes per slot)
      slots: [
        {
          motionOn: getBits(data[72], 0, 0) === 1,
          smoothOn: getBits(data[72], 1, 1) === 1,
          parameterId: data[73],
          stepEnabled: [
            // Slot 1 steps (bytes 80-81)
            getBits(data[80], 0, 0) === 1,
            getBits(data[80], 1, 1) === 1,
            getBits(data[80], 2, 2) === 1,
            getBits(data[80], 3, 3) === 1,
            getBits(data[80], 4, 4) === 1,
            getBits(data[80], 5, 5) === 1,
            getBits(data[80], 6, 6) === 1,
            getBits(data[80], 7, 7) === 1,
            getBits(data[81], 0, 0) === 1,
            getBits(data[81], 1, 1) === 1,
            getBits(data[81], 2, 2) === 1,
            getBits(data[81], 3, 3) === 1,
            getBits(data[81], 4, 4) === 1,
            getBits(data[81], 5, 5) === 1,
            getBits(data[81], 6, 6) === 1,
            getBits(data[81], 7, 7) === 1,
          ],
        },
        {
          motionOn: getBits(data[74], 0, 0) === 1,
          smoothOn: getBits(data[74], 1, 1) === 1,
          parameterId: data[75],
          stepEnabled: [
            // Slot 2 steps (bytes 82-83)
            getBits(data[82], 0, 0) === 1,
            getBits(data[82], 1, 1) === 1,
            getBits(data[82], 2, 2) === 1,
            getBits(data[82], 3, 3) === 1,
            getBits(data[82], 4, 4) === 1,
            getBits(data[82], 5, 5) === 1,
            getBits(data[82], 6, 6) === 1,
            getBits(data[82], 7, 7) === 1,
            getBits(data[83], 0, 0) === 1,
            getBits(data[83], 1, 1) === 1,
            getBits(data[83], 2, 2) === 1,
            getBits(data[83], 3, 3) === 1,
            getBits(data[83], 4, 4) === 1,
            getBits(data[83], 5, 5) === 1,
            getBits(data[83], 6, 6) === 1,
            getBits(data[83], 7, 7) === 1,
          ],
        },
        {
          motionOn: getBits(data[76], 0, 0) === 1,
          smoothOn: getBits(data[76], 1, 1) === 1,
          parameterId: data[77],
          stepEnabled: [
            // Slot 3 steps (bytes 84-85)
            getBits(data[84], 0, 0) === 1,
            getBits(data[84], 1, 1) === 1,
            getBits(data[84], 2, 2) === 1,
            getBits(data[84], 3, 3) === 1,
            getBits(data[84], 4, 4) === 1,
            getBits(data[84], 5, 5) === 1,
            getBits(data[84], 6, 6) === 1,
            getBits(data[84], 7, 7) === 1,
            getBits(data[85], 0, 0) === 1,
            getBits(data[85], 1, 1) === 1,
            getBits(data[85], 2, 2) === 1,
            getBits(data[85], 3, 3) === 1,
            getBits(data[85], 4, 4) === 1,
            getBits(data[85], 5, 5) === 1,
            getBits(data[85], 6, 6) === 1,
            getBits(data[85], 7, 7) === 1,
          ],
        },
        {
          motionOn: getBits(data[78], 0, 0) === 1,
          smoothOn: getBits(data[78], 1, 1) === 1,
          parameterId: data[79],
          stepEnabled: [
            // Slot 4 steps (bytes 86-87)
            getBits(data[86], 0, 0) === 1,
            getBits(data[86], 1, 1) === 1,
            getBits(data[86], 2, 2) === 1,
            getBits(data[86], 3, 3) === 1,
            getBits(data[86], 4, 4) === 1,
            getBits(data[86], 5, 5) === 1,
            getBits(data[86], 6, 6) === 1,
            getBits(data[86], 7, 7) === 1,
            getBits(data[87], 0, 0) === 1,
            getBits(data[87], 1, 1) === 1,
            getBits(data[87], 2, 2) === 1,
            getBits(data[87], 3, 3) === 1,
            getBits(data[87], 4, 4) === 1,
            getBits(data[87], 5, 5) === 1,
            getBits(data[87], 6, 6) === 1,
            getBits(data[87], 7, 7) === 1,
          ],
        },
      ],
      // Step Event Data (bytes 96-447, 22 bytes per step × 16 steps)
      stepEvents: [] as Array<{
        noteNumber: number;
        velocity: number;
        gateTime: number;
        triggerSwitch: boolean;
        motionData: Array<{
          data1: number;
          data2: number;
          data3: number;
          data4: number;
        }>;
      }>,
    };

    // Extract Step Event Data for all 16 steps
    for (let step = 0; step < 16; step++) {
      const stepOffset = 96 + step * 22; // 22 bytes per step

      motionSequencing.stepEvents.push({
        noteNumber: data[stepOffset + 0],
        velocity: data[stepOffset + 2],
        gateTime: getBits(data[stepOffset + 4], 0, 6), // Bits 0-6
        triggerSwitch: getBits(data[stepOffset + 4], 7, 7) === 1, // Bit 7
        motionData: [
          // Motion Slot 1 data for this step
          {
            data1: data[stepOffset + 6],
            data2: data[stepOffset + 7],
            data3: data[stepOffset + 8],
            data4: data[stepOffset + 9],
          },
          // Motion Slot 2 data for this step
          {
            data1: data[stepOffset + 10],
            data2: data[stepOffset + 11],
            data3: data[stepOffset + 12],
            data4: data[stepOffset + 13],
          },
          // Motion Slot 3 data for this step
          {
            data1: data[stepOffset + 14],
            data2: data[stepOffset + 15],
            data3: data[stepOffset + 16],
            data4: data[stepOffset + 17],
          },
          // Motion Slot 4 data for this step
          {
            data1: data[stepOffset + 18],
            data2: data[stepOffset + 19],
            data3: data[stepOffset + 20],
            data4: data[stepOffset + 21],
          },
        ],
      });
    }

    // AMP envelope parameters
    const amp = {
      attack: data[16], // AMP EG Attack (CC 16)
      decay: data[17], // AMP EG Decay (CC 17)
    };

    // Misc parameters
    const misc = {
      bpmSync: getBits(data[44], 3, 3) === 1,
      portamentMode: getBits(data[44], 0, 0) === 1,
      portamentTime: data[41],
      cutoffVelocity: getBits(data[44], 4, 5),
      cutoffKeyTrack: getBits(data[44], 6, 7),
      sliderAssign: SLIDER_ASSIGN_MATRIX[data[42]] || "UNKNOWN",
    };

    return {
      isValid: true,
      patchName: patchName || "Untitled",
      drive,
      oscillators: {
        vco1,
        vco2,
      },
      filter,
      envelope,
      lfo,
      sequencer,
      motionSequencing,
      amp,
      misc,
    };
  } catch (error) {
    return {
      isValid: false,
      patchName: "",
      error: `Parse error: ${error instanceof Error ? error.message : String(error)}`,
      drive: 0,
      oscillators: {
        vco1: { wave: 0, pitch: 0, shape: 0, level: 0, octave: 0 },
        vco2: { wave: 0, shape: 0, level: 0, pitch: 0, sync: 0, octave: 0 },
      },
      filter: { cutoff: 0, resonance: 0 },
      envelope: { type: 0, attack: 0, decay: 0, intensity: 0, target: 0 },
      lfo: { wave: 0, mode: 0, rate: 0, intensity: 0, target: 0 },
      sequencer: {
        stepLength: 0,
        stepResolution: 0,
        swing: 0,
        stepOnOff: Array(16).fill(false),
        motionOnOff: Array(16).fill(false),
      },
      motionSequencing: { slots: [], stepEvents: [] },
      amp: { attack: 0, decay: 0 },
      misc: {
        bpmSync: false,
        portamentMode: false,
        portamentTime: 0,
        cutoffVelocity: 0,
        cutoffKeyTrack: 0,
        sliderAssign: "",
      },
    };
  }
}
