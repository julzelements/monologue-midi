# Data Representation Strategy: Raw vs Pretty Values

## The Problem

The Korg Monologue uses numeric IDs for parameters, but these have human-readable string representations:

- `sliderAssign: 56` → `"PITCH BEND"`
- `vco1.wave: 2` → `"SAW"`
- `envelope.type: 0` → `"GATE"`
- `lfo.target: 2` → `"PITCH"`
- etc.

**Question**: Should we store both numeric and pretty values, or keep only numeric values and provide a separate formatter/interpreter?

## Current State

Right now we have a **mixed approach** (probably unintentional):

- Most values are numeric: `vco1.wave: 2`
- But `sliderAssign` is already a string: `"PITCH BEND"`

This inconsistency should be resolved.

## Option 1: Store Raw Values Only (Recommended)

### Structure

```typescript
interface MonologueParameters {
  oscilators: {
    vco1: {
      wave: number; // 0-2
      duty: number; // 0-2 (SYNC/RING)
      octave: number; // 0-3
      // ...
    };
  };
  envelope: {
    type: number; // 0-2
    target: number; // 0-2
    // ...
  };
  misc: {
    sliderAssign: number; // 13, 14, 17, 18, etc.
  };
  // ...
}
```

### Separate Formatter/Interpreter

```typescript
// Separate module: src/sysex/formatter.ts or src/sysex/prettify.ts
interface PrettyMonologueParameters {
  oscilators: {
    vco1: {
      wave: "SQR" | "TRI" | "SAW";
      duty: "RING" | "OFF" | "SYNC";
      octave: "16'" | "8'" | "4'" | "2'";
      // ...
    }
  },
  envelope: {
    type: "GATE" | "A/G/D" | "A/D";
    target: "CUTOFF" | "PITCH 2" | "PITCH";
    // ...
  },
  misc: {
    sliderAssign: "VCO 1 PITCH" | "PITCH BEND" | "GATE TIME" | /* ... */;
  }
  // ...
}

// Utility functions
function prettify(params: MonologueParameters): PrettyMonologueParameters;
function unprettify(pretty: PrettyMonologueParameters): MonologueParameters;
```

### Pros

✅ **Single source of truth**: Numeric values are canonical, match hardware exactly
✅ **Lossless round-trip**: encode → decode → encode produces identical bytes
✅ **Clear separation**: Data layer vs presentation layer
✅ **Smaller data size**: Numbers are more compact than strings
✅ **Type safety**: TypeScript can enforce valid numeric ranges
✅ **Easy to validate**: JSON schema validates numbers directly
✅ **Easier to compute**: Can do math on numeric values (e.g., increment octave)
✅ **Future-proof**: If Korg adds value 3, just update formatter, not all stored data

### Cons

❌ Not human-readable without formatter
❌ Two layers to maintain (but this is actually good separation of concerns)
❌ Need to update formatter when spec changes

---

## Option 2: Store Pretty Values Only

### Structure

```typescript
interface MonologueParameters {
  oscilators: {
    vco1: {
      wave: "SQR" | "TRI" | "SAW";
      duty: "RING" | "OFF" | "SYNC";
      // ...
    };
  };
  // ...
}
```

### Pros

✅ Human-readable JSON
✅ Self-documenting
✅ Nice for UI display

### Cons

❌ **Lossy encoding**: "VCO 1 LEVEL" appears twice in slider assign list (IDs 21 & 22) - which one?
❌ **Fragile**: String typos break everything
❌ **Verbose**: Larger JSON files
❌ **Harder validation**: Need complex string enum validation
❌ **Math impossible**: Can't increment octave from "8'" to "4'" easily
❌ **Encoding complexity**: Need reverse lookup tables
❌ **Breaking changes**: If Korg renames "A/G/D" → "AGD", all stored patches break

---

## Option 3: Store Both (Dual Representation)

### Structure

```typescript
interface MonologueParameters {
  oscilators: {
    vco1: {
      wave: number;
      waveLabel: string;
      duty: number;
      dutyLabel: string;
      // ...
    };
  };
  // ...
}
```

### Pros

✅ Human-readable
✅ Preserves numeric values

### Cons

❌ **Redundancy**: Double the storage
❌ **Sync issues**: What if `wave: 2` but `waveLabel: "TRI"`? Which is correct?
❌ **Validation complexity**: Must validate both values AND their relationship
❌ **Mutation problems**: If you change `wave`, must remember to update `waveLabel`
❌ **Bloated**: Twice as many fields to type, document, test

---

## Recommendation: Option 1 (Raw + Formatter)

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Data Layer (canonical representation)                       │
│ - MonologueParameters interface (numeric values)            │
│ - encode() / decode() work with raw numbers                 │
│ - JSON schema validates numeric ranges                      │
│ - Test data uses numeric values                             │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Presentation Layer (human-friendly)                         │
│ - prettify() converts numbers → strings                     │
│ - unprettify() converts strings → numbers                   │
│ - formatValue() for individual fields                       │
│ - parseValue() for individual fields                        │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ UI Layer                                                     │
│ - Display pretty values to users                            │
│ - Accept pretty values from users                           │
│ - Convert to/from raw for storage/transmission              │
└─────────────────────────────────────────────────────────────┘
```

### Implementation Plan

1. **Fix current inconsistency**: Change `sliderAssign` from string to number
   - Update test data: `"sliderAssign": "PITCH BEND"` → `"sliderAssign": 56`
   - Update schema to validate numeric range
2. **Create formatter module**: `src/sysex/prettify.ts`

   ```typescript
   // Lookup tables
   const VCO1_WAVE_LABELS = ["SQR", "TRI", "SAW"] as const;
   const VCO2_WAVE_LABELS = ["NOISE", "TRI", "SAW"] as const;
   const SYNC_RING_LABELS = ["RING", "OFF", "SYNC"] as const;
   // ... etc

   const SLIDER_ASSIGN_LABELS: Record<number, string> = {
     13: "VCO 1 PITCH",
     14: "VCO 1 SHAPE",
     17: "VCO 2 PITCH",
     // ... etc
   };

   // Formatters for individual fields
   export function formatVco1Wave(value: number): string;
   export function parseVco1Wave(label: string): number;

   // Full prettification
   export function prettify(params: MonologueParameters): PrettyMonologueParameters;
   export function unprettify(pretty: PrettyMonologueParameters): MonologueParameters;
   ```

3. **Add tests** for prettify/unprettify round-trips

4. **Update exports** in `src/index.ts` to include prettify utilities

### Usage Examples

```typescript
// Decoding from hardware
const sysex = device.receiveSysex();
const params = decode(sysex); // { vco1: { wave: 2, ... } }

// For UI display
const pretty = prettify(params); // { vco1: { wave: "SAW", ... } }
console.log(`VCO1 is using ${pretty.oscilators.vco1.wave}`);

// User edits in UI
pretty.oscilators.vco1.wave = "TRI";
const updated = unprettify(pretty); // { vco1: { wave: 1, ... } }

// Send back to hardware
const newSysex = encode(updated);
device.sendSysex(newSysex);
```

### Migration Path

1. ✅ Fix `sliderAssign` to be numeric in all test data
2. ✅ Update schema to validate `sliderAssign` as number with specific allowed values
3. ✅ Create `src/sysex/prettify.ts` with lookup tables and conversion functions
4. ✅ Add comprehensive tests for prettify/unprettify
5. ✅ Export from main index
6. 📝 Document in README with examples

## Alternative: Hybrid Approach (Advanced)

For maximum flexibility, you could support **both** during JSON parsing but **always store raw**:

```typescript
// Accept pretty values during input, convert to raw immediately
const schema = {
  vco1: {
    wave: {
      oneOf: [
        { type: "number", minimum: 0, maximum: 2 },
        { type: "string", enum: ["SQR", "TRI", "SAW"] },
      ],
    },
  },
};

// After validation, normalize to raw
function normalizeToRaw(input: any): MonologueParameters {
  const normalized = { ...input };
  if (typeof input.oscilators.vco1.wave === "string") {
    normalized.oscilators.vco1.wave = parseVco1Wave(input.oscilators.vco1.wave);
  }
  return normalized;
}
```

This is more complex but allows JSON files to use either format while keeping the internal representation consistent.

## Conclusion

**Recommended**: Option 1 (Raw + Formatter)

- Store all values as numbers (matching hardware)
- Provide separate prettify/unprettify utilities
- Clear separation of concerns
- Lossless, type-safe, future-proof

**Next Steps**:

1. Fix `sliderAssign` to numeric in test data
2. Implement `src/sysex/prettify.ts`
3. Add round-trip tests
