import { PARAMETERS, type ParameterId } from "../types";

/**
 * Parameter range information
 */
export type ParameterRange = {
  min: number;
  max: number;
  isDiscrete: boolean;
};

/**
 * Normalize a value from 0-1 range to the parameter's actual range.
 * @param paramId - The parameter identifier
 * @param normalizedValue - Value between 0 and 1
 * @returns The parameter value in its native range
 *
 * @example
 * ```typescript
 * const cutoff = normalizeValue('filterCutoff', 0.5); // 511
 * const octave = normalizeValue('vco1Octave', 0.66); // 2
 * ```
 */
export function normalizeValue(paramId: ParameterId, normalizedValue: number): number {
  const param = PARAMETERS[paramId];
  const clamped = Math.max(0, Math.min(1, normalizedValue));
  const value = clamped * param.maxValue;

  return param.isDiscrete ? Math.round(value) : Math.round(value);
}

/**
 * Denormalize a parameter value to 0-1 range.
 * @param paramId - The parameter identifier
 * @param value - The parameter value in its native range
 * @returns Normalized value between 0 and 1
 *
 * @example
 * ```typescript
 * const normalized = denormalizeValue('filterCutoff', 512); // ~0.5
 * const normalized = denormalizeValue('vco1Octave', 2); // ~0.67
 * ```
 */
export function denormalizeValue(paramId: ParameterId, value: number): number {
  const param = PARAMETERS[paramId];
  return value / param.maxValue;
}

/**
 * Get the valid range for a parameter.
 * @param paramId - The parameter identifier
 * @returns Parameter range information including min, max, and whether it's discrete
 *
 * @example
 * ```typescript
 * const range = getParameterRange('filterCutoff');
 * // { min: 0, max: 1023, isDiscrete: false }
 * ```
 */
export function getParameterRange(paramId: ParameterId): ParameterRange {
  const param = PARAMETERS[paramId];
  return {
    min: 0,
    max: param.maxValue,
    isDiscrete: param.isDiscrete,
  };
}

/**
 * Validate if a value is within the valid range for a parameter.
 * @param paramId - The parameter identifier
 * @param value - The value to validate
 * @returns True if the value is valid for the parameter
 *
 * @example
 * ```typescript
 * isValidValue('vco1Octave', 2); // true
 * isValidValue('vco1Octave', 5); // false (max is 3)
 * isValidValue('filterCutoff', 512); // true
 * isValidValue('filterCutoff', -1); // false
 * ```
 */
export function isValidValue(paramId: ParameterId, value: number): boolean {
  const param = PARAMETERS[paramId];

  if (!Number.isFinite(value)) {
    return false;
  }

  if (value < 0 || value > param.maxValue) {
    return false;
  }

  // For discrete parameters, must be an integer
  if (param.isDiscrete && !Number.isInteger(value)) {
    return false;
  }

  return true;
}

/**
 * Clamp a value to the valid range for a parameter.
 * @param paramId - The parameter identifier
 * @param value - The value to clamp
 * @returns The clamped value
 *
 * @example
 * ```typescript
 * clampValue('vco1Octave', 5); // 3 (max value)
 * clampValue('filterCutoff', -100); // 0 (min value)
 * clampValue('filterCutoff', 2000); // 1023 (max value)
 * ```
 */
export function clampValue(paramId: ParameterId, value: number): number {
  const param = PARAMETERS[paramId];
  const clamped = Math.max(0, Math.min(param.maxValue, value));

  return param.isDiscrete ? Math.round(clamped) : Math.round(clamped);
}
