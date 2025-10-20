# Schema Corrections

This document details corrections made to `src/sysex/schema.json` based on the official Korg Monologue MIDI specification (docs/4.CURRENT PROGRAM DATA DUMP.txt).

## Summary

The initial schema had several "hallucinated" assumptions where enum ranges were incorrectly set to 0-3 when they should have been 0-2. This was corrected by carefully comparing against the official specification starting at line 310+.

## Corrections Made

### 1. VCO1 Wave Types
- **Before**: `minimum: 0, maximum: 3` (generic assumption)
- **After**: `minimum: 0, maximum: 2`
- **Values**: 0=SQR, 1=TRI, 2=SAW
- **Source**: Spec line 310, note P4

### 2. VCO2 Wave Types
- **Before**: Single `oscillator` definition shared between VCO1 and VCO2 with `maximum: 3`
- **After**: Separate `vco2` definition with `minimum: 0, maximum: 2`
- **Values**: 0=NOISE, 1=TRI, 2=SAW (different mapping than VCO1!)
- **Source**: Spec line 315, note P5
- **Note**: VCO2 has NOISE instead of SQR

### 3. SYNC/RING (duty field)
- **Before**: `minimum: 0, maximum: 3`, described as "Duty cycle or sync mode"
- **After**: `minimum: 0, maximum: 2`, described as "SYNC/RING: 0=RING, 1=OFF, 2=SYNC"
- **Source**: Spec line 320, note P6

### 4. Envelope Type
- **Before**: `minimum: 0, maximum: 3`, values "0=GATE, 1=ADSR, 2=ADS, 3=AR"
- **After**: `minimum: 0, maximum: 2`, values "0=GATE, 1=A/G/D, 2=A/D"
- **Source**: Spec line 325, note P7

### 5. Envelope Target
- **Before**: `minimum: 0, maximum: 3`, values "0=PITCH, 1=CUTOFF, 2=AMP, 3=PITCH+CUTOFF"
- **After**: `minimum: 0, maximum: 2`, values "0=CUTOFF, 1=PITCH 2, 2=PITCH"
- **Source**: Spec line 330, note P8
- **Note**: Official spec has unusual "PITCH 2" label for value 1

### 6. LFO Wave Types
- **Before**: `minimum: 0, maximum: 3`, values "0=SAW, 1=TRI, 2=SQR, 3=S&H"
- **After**: `minimum: 0, maximum: 2`, values "0=SQR, 1=TRI, 2=SAW" (same as VCO1)
- **Source**: Spec line 310, note P4 (LFO TYPE same as VCO1 WAVE)

### 7. LFO Mode
- **Before**: `minimum: 0, maximum: 3`, values "0=1-SHOT, 1=SLOW, 2=FAST, 3=1S+F"
- **After**: `minimum: 0, maximum: 2`, values "0=1-SHOT, 1=SLOW, 2=FAST"
- **Source**: Spec line 335, note P9

### 8. LFO Target
- **Before**: `minimum: 0, maximum: 3`, values "0=PITCH, 1=CUTOFF, 2=AMP, 3=PITCH+CUTOFF"
- **After**: `minimum: 0, maximum: 2`, values "0=CUTOFF, 1=SHAPE, 2=PITCH"
- **Source**: Spec line 340, note P10

## Structural Changes

### Separate VCO Definitions
Created two separate schema definitions:
- `vco1`: With wave values 0=SQR, 1=TRI, 2=SAW
- `vco2`: With wave values 0=NOISE, 1=TRI, 2=SAW

This replaces the previous single `oscillator` definition that couldn't properly express the different wave type mappings.

## Validation Results

All 38 tests pass with the corrected schema, confirming that:
1. All 5 converted dump files validate successfully
2. The corrected enum ranges are compatible with real-world patch data
3. The stricter validation catches potential errors earlier

## Root Cause Analysis

The original schema appeared to default many enum fields to 0-3 range, likely assuming:
- 2-bit fields would always span 0-3 (4 values)
- Parameters would follow a consistent pattern

However, the Monologue uses 0-2 (3 values) for most enum parameters, reserving the 4th value (3) for future use or leaving it invalid. This is a common hardware design pattern to allow future expansion without protocol changes.

## Implications

With these corrections:
- ✅ Invalid parameter values are now rejected earlier
- ✅ Schema accurately reflects hardware capabilities
- ✅ Generated TypeScript types will have correct constraints
- ✅ Documentation matches official specification exactly
- ⚠️ Any previously created patches with values of 3 for these parameters would now fail validation (but such patches would have been invalid on the hardware anyway)
