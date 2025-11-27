# Development Roadmap

Priority features for extending the monologue-midi library while maintaining platform-agnostic design.

## 1. Parameter Helpers

**Goal:** Utility functions for working with parameters in any UI framework

### Tasks

- [ ] Create `src/parameters/helpers.ts`
- [ ] Implement `normalizeValue(paramId, floatValue)` - convert 0-1 to parameter range
- [ ] Implement `denormalizeValue(paramId, rawValue)` - convert parameter value to 0-1
- [ ] Implement `getParameterRange(paramId)` - return min/max metadata
- [ ] Implement `isValidValue(paramId, value)` - validation helper
- [ ] Implement `clampValue(paramId, value)` - constrain to valid range
- [ ] Implement `getParameterDisplayName(paramId)` - convert "filterCutoff" → "Filter Cutoff"
- [ ] Write comprehensive tests
- [ ] Add usage examples to README

### API Design

```typescript
// Normalize slider value (0-1) to parameter range
const cutoffValue = normalizeValue("filterCutoff", 0.75); // 767

// Denormalize raw value to 0-1 range
const normalized = denormalizeValue("filterCutoff", 512); // 0.5

// Get parameter range
const range = getParameterRange("filterCutoff"); // { min: 0, max: 1023, isDiscrete: false }

// Validate and clamp values
if (isValidValue("vco1Octave", 5)) {
  /* ... */
}
const safe = clampValue("vco1Octave", 5); // 3 (max value)

// Get display name for UI
const name = getParameterDisplayName("filterCutoff"); // "Filter Cutoff"
```

---

## 2. Patch Diff/Compare

**Goal:** Analyze and compare patches for editors and patch management tools

### Tasks

- [ ] Create `src/sysex/diff.ts`
- [ ] Implement `diffPatches(patchA, patchB)` - return differences
- [ ] Implement `getPatchSummary(patch)` - key characteristics
- [ ] Implement `mergePatches(base, overrides)` - combine patches
- [ ] Implement `interpolatePatches(patchA, patchB, amount)` - morph between patches
- [ ] Handle nested parameter differences (sequencer steps, etc.)
- [ ] Format diff output (human-readable and machine-readable)
- [ ] Write tests with edge cases
- [ ] Document use cases

### API Design

```typescript
// Compare two patches
const diff = diffPatches(patch1, patch2);
// Returns: { changed: [...], added: [...], removed: [...] }

// Merge patches
const hybrid = mergePatches(bassPatch, { filter: leadPatch.panelSettings.filter });

// Morph between patches
const morphed = interpolatePatches(patch1, patch2, 0.5); // 50% blend
```

---

## 3. Random Patch Generator

**Goal:** Generate creative patches with optional constraints

### Tasks

- [ ] Create `src/sysex/random.ts`
- [ ] Implement `generateRandomPatch(constraints?)` - full random patch
- [ ] Implement `randomizeSection(patch, section)` - randomize specific section
- [ ] Add constraint system (min/max ranges, fixed values, categories)
- [ ] Implement weighted randomization for musical results
- [ ] Add preset constraint templates (bass, lead, pad, etc.)
- [ ] Implement `mutate(patch, amount)` - slightly modify existing patch
- [ ] Write tests for constraints
- [ ] Add examples and documentation

### API Design

```typescript
// Fully random patch
const random = generateRandomPatch();

// Random with constraints
const bass = generateRandomPatch({
  vco1Octave: 0, // Fix octave
  filterCutoff: [0, 512], // Limit range
  category: "bass", // Use bass-friendly weights
});

// Randomize just the filter
const modified = randomizeSection(myPatch, "filter");

// Slight variation
const variant = mutate(myPatch, 0.1); // 10% mutation
```

---

## 4. Bulk Import/Export

**Goal:** Handle multiple patches for patch management and archival

### Tasks

- [ ] Create `src/sysex/bulk.ts`
- [ ] Implement `exportPatchesAsJSON(patches, filepath?)` - save multiple patches
- [ ] Implement `importPatchesFromJSON(filepath)` - load patch library
- [ ] Implement `exportPatchAsText(patch)` - human-readable description
- [ ] Implement `exportPatchAsURL(patch)` - base64 encoded shareable link
- [ ] Implement `importPatchFromURL(url)` - decode from URL
- [ ] Support multiple formats (JSON, YAML, SysEx binary)
- [ ] Add batch conversion utilities
- [ ] Write file I/O tests
- [ ] Document format specifications

### API Design

```typescript
// Export patch collection
await exportPatchesAsJSON(myPatches, "my-library.json");

// Import library
const library = await importPatchesFromJSON("my-library.json");

// Share as URL
const url = exportPatchAsURL(patch);
// Returns: "https://example.com/patch#base64encodeddata"

// Human-readable export
const description = exportPatchAsText(patch);
```

---

## Implementation Order

1. **Parameter Helpers** - Foundation for other features, no external dependencies
2. **Patch Diff/Compare** - Pure data transformations, useful immediately
3. **Random Patch Generator** - Fun feature, depends on parameter helpers
4. **Bulk Import/Export** - Builds on existing encode/decode functionality

---

## Testing Strategy

- Unit tests for all utility functions
- Integration tests for MIDI I/O (with mocks)
- Test with real hardware where possible
- Maintain 100% type safety
- Add example code that runs in CI

## Documentation Updates

- Update main README.md with new features
- Add API documentation for each module
- Create usage examples
- Add troubleshooting guide for MIDI connections
