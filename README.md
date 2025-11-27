# Monologue MIDI

TypeScript library for encoding and decoding MIDI SysEx and CC messages for the Korg Monologue synthesizer.

## Installation

```bash
npm install @julzelements/monologue-midi
```

## Features

- ✅ **SysEx encoding/decoding** - Full program dump support
- ✅ **MIDI CC encoding/decoding** - Control panel parameters via MIDI CC
- ✅ **Parameter helpers** - Utilities for UI integration (normalize, validate, display names)
- ✅ **Type-safe parameter definitions** - Complete TypeScript types for all parameters
- ✅ **Human-readable formatting** - Convert numeric values to meaningful labels
- ✅ **Platform agnostic** - Pure data transformation, works in Node.js and browsers

## Quick Start

```typescript
import {
  decodeMonologueParameters,
  encodeMonologueParameters,
  encodeCC,
  decodeCC,
  prettyPanelSettings,
} from "@julzelements/monologue-midi";

// Decode a SysEx dump
const sysexData = new Uint8Array([0xf0, 0x42, 0x30 /* ... */, , 0xf7]);
const parameters = decodeMonologueParameters(sysexData);

// Pretty print panel settings
const pretty = prettyPanelSettings(parameters);
console.log(pretty.filter.cutoff.formatted); // 512

// Encode back to SysEx
const encoded = encodeMonologueParameters(parameters);

// Encode/decode MIDI CC
const ccMessage = encodeCC("cutoff", 512);
const value = decodeCC("cutoff", 64); // returns 512
```

## MIDI I/O Integration

This library focuses on data transformation. For MIDI communication, use your platform's MIDI library:

### Node.js

```typescript
import { decodeMonologueParameters, encodeMonologueParameters } from "@julzelements/monologue-midi";
import * as easymidi from "easymidi";

// Find Monologue port
const inputs = easymidi.getInputs();
const monologuePort = inputs.find((name) => /monologue/i.test(name));

// Listen for SysEx dumps
const input = new easymidi.Input(monologuePort);
input.on("sysex", (msg) => {
  const parameters = decodeMonologueParameters(msg.bytes);
  console.log("Received patch:", parameters.patchName);
});

// Send SysEx to hardware
const output = new easymidi.Output(monologuePort);
const sysex = encodeMonologueParameters(myPatch);
output.send("sysex", Array.from(sysex));
```

### Browser

```typescript
import { decodeMonologueParameters, encodeMonologueParameters } from "@julzelements/monologue-midi";

// Request MIDI access
const midiAccess = await navigator.requestMIDIAccess({ sysex: true });

// Find Monologue input
const inputs = Array.from(midiAccess.inputs.values());
const monologueInput = inputs.find((input) => /monologue/i.test(input.name));

// Listen for SysEx
monologueInput.onmidimessage = (event) => {
  if (event.data[0] === 0xf0) {
    // SysEx message
    const parameters = decodeMonologueParameters(event.data);
    console.log("Received patch:", parameters.patchName);
  }
};

// Send SysEx to hardware
const outputs = Array.from(midiAccess.outputs.values());
const monologueOutput = outputs.find((output) => /monologue/i.test(output.name));
const sysex = encodeMonologueParameters(myPatch);
monologueOutput.send(sysex);
```

## Parameter Access

All parameters are strongly typed and accessible via the `PARAMETERS` registry:

```typescript
import { PARAMETERS, isCCParameter } from "@julzelements/monologue-midi";

// Check if parameter supports CC
if (isCCParameter(PARAMETERS.filterCutoff)) {
  console.log(`CC#${PARAMETERS.filterCutoff.ccNumber}`); // CC#43
}
```

## Parameter Helpers

Utility functions for working with parameters in any UI framework:

```typescript
import {
  normalizeValue,
  denormalizeValue,
  getParameterRange,
  isValidValue,
  clampValue,
} from "@julzelements/monologue-midi";

// Convert UI control value (0-1) to parameter value
const cutoffValue = normalizeValue("filterCutoff", 0.75); // 767

// Convert parameter value back to 0-1 for UI
const controlValue = denormalizeValue("filterCutoff", 512); // ~0.5

// Get parameter range information
const range = getParameterRange("filterCutoff");
// { min: 0, max: 1023, isDiscrete: false }

// Validate a value is in range
if (isValidValue("vco1Octave", 2)) {
  // Value is valid
}

// Clamp out-of-range values
const safe = clampValue("filterCutoff", 2000); // 1023

// Get display name for UI labels
const label = getParameterDisplayName("filterCutoff"); // "Filter Cutoff"
```

These helpers are particularly useful for:

- Building parameter controls (sliders, knobs, dropdowns)
- Validating user input
- Displaying parameter names and values
- Converting between UI ranges and MIDI values

## Data Structure

Decoded parameters include:

- **Panel Settings** - VCO1, VCO2, Filter, Envelope, LFO, Drive, Sync/Ring
- **Program Settings** - Portamento, Slider, Pitch, BPM Sync, Velocity settings
- **Sequencer Settings** - BPM, step length, resolution, swing, motion slots
- **Sequencer Steps** - 16 steps with note, velocity, gate time, motion data

## Types

```typescript
import type { MonologueParameters, SequencerStep, ParameterId, CCName } from "@julzelements/monologue-midi";
```

## Development

```bash
npm install
npm run build      # Build library
npm test          # Run tests
npm run test:watch # Watch mode
```

## License

MIT
