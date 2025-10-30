# Monologue MIDI

TypeScript library for encoding and decoding MIDI SysEx and CC messages for the Korg Monologue synthesizer.

## Installation

```bash
npm install @julzelements/monologue-midi
```

## Features

- ✅ **SysEx encoding/decoding** - Full program dump support
- ✅ **MIDI CC encoding/decoding** - Control panel parameters via MIDI CC
- ✅ **Type-safe parameter definitions** - Complete TypeScript types for all parameters
- ✅ **Human-readable formatting** - Convert numeric values to meaningful labels

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

## Parameter Access

All parameters are strongly typed and accessible via the `PARAMETERS` registry:

```typescript
import { PARAMETERS, isCCParameter } from "@julzelements/monologue-midi";

// Check if parameter supports CC
if (isCCParameter(PARAMETERS.filterCutoff)) {
  console.log(`CC#${PARAMETERS.filterCutoff.ccNumber}`); // CC#43
}
```

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
