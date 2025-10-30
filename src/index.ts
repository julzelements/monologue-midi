export { encodeMonologueParameters, decodeMonologueParameters, MonologueParameters } from "./sysex";

// Prettification utilities - convert between numeric values and human-readable labels
export { prettyPanelSettings } from "./sysex/prettify";

// MIDI CC encoding/decoding
export { decodeCC } from "./midi/decodeCC";
export { encodeCC } from "./midi/encodeCC";

// Parameter definitions and utilities
export {
  PARAMETERS,
  CC_TO_PARAMETER,
  CC_NAME_TO_PARAMETER,
  isCCParameter,
  getCCParameters,
  getSysExOnlyParameters,
  type ParameterId,
  type ParameterDefinition,
} from "./types";
