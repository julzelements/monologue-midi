import Ajv from "ajv";
import schema from "./schema.json";

const ajv = new Ajv({ allErrors: true, strict: true });
const validate = ajv.compile(schema);

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

/**
 * Validate Monologue parameters against JSON schema
 * @param data - The parameter data to validate
 * @returns Validation result with error details if invalid
 */
export function validateMonologueParametersWithSchema(data: unknown): ValidationResult {
  const valid = validate(data);
  
  if (!valid && validate.errors) {
    const errors = validate.errors.map(err => {
      const path = err.instancePath || 'root';
      return `${path}: ${err.message}`;
    });
    return { valid: false, errors };
  }
  
  return { valid: true };
}

/**
 * Validate and throw on error
 * @param data - The parameter data to validate
 * @throws Error with validation details if invalid
 */
export function validateOrThrow(data: unknown): void {
  const result = validateMonologueParametersWithSchema(data);
  if (!result.valid) {
    throw new Error(`Validation failed:\n${result.errors?.join('\n')}`);
  }
}
