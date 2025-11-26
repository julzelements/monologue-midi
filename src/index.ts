export { encodeMonologueParameters, decodeMonologueParameters, type MonologueParameters } from "./sysex";

// Prettification utilities - convert between numeric values and human-readable labels
export { prettyPanelSettings, LABELS } from "./sysex/prettify";

// Validation utilities
export { validateMonologueParametersWithSchema, validateOrThrow, type ValidationResult } from "./sysex/validator";

// MIDI CC encoding/decoding
export { decodeCC } from "./midi/decodeCC";
export { encodeCC } from "./midi/encodeCC";

// MIDI port discovery
export { getInputs, getOutputs, findMonologue, type MonologuePorts } from "./midi/ports";

// Parameter definitions and utilities
export {
  PARAMETERS,
  CC_TO_PARAMETER,
  CC_NAME_TO_PARAMETER,
  CC_NAMES,
  isCCParameter,
  getCCParameters,
  getSysExOnlyParameters,
  getParameterByCCName,
  type ParameterId,
  type ParameterDefinition,
  type CCName,
  type SequencerStep,
} from "./types";
