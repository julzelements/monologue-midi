/**
 * SysEx message parsing and validation utilities
 *
 * Parses complete Korg Monologue SysEx messages, validates structure,
 * and extracts/decodes the data payload.
 */

import {
  SYSEX_CONSTANTS,
  extractHeader,
  extractFooter,
  extractEncodedData,
  validateSysexStructure,
} from "./sysex-format";
import { decode7BitData } from "./seven-bit-encoding";

/**
 * Parsed SysEx message structure
 */
export interface ParsedSysex {
  /** 7-byte SysEx header */
  header: Uint8Array;
  /** 448 bytes of decoded (8-bit) program data */
  body: Uint8Array;
  /** 1-byte SysEx footer (0xF7) */
  footer: number;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Parse and validate a complete Korg Monologue SysEx message
 *
 * This function:
 * 1. Validates the message structure (length, header, footer)
 * 2. Extracts header, body, and footer
 * 3. Decodes the body from 7-bit MIDI encoding to 8-bit data
 *
 * @param sysex - Complete 520-byte SysEx message
 * @returns Parsed SysEx data with decoded body
 * @throws Error if validation fails
 */
export function parseSysex(sysex: Uint8Array): ParsedSysex {
  // Validate structure first
  const validation = validateSysex(sysex);
  if (!validation.valid) {
    throw new Error(`SysEx validation failed:\n${validation.errors.join("\n")}`);
  }

  // Extract components
  const header = extractHeader(sysex);
  const encodedBody = extractEncodedData(sysex);
  const footer = extractFooter(sysex);

  // Decode 7-bit MIDI data to 8-bit data
  // 512 bytes (7-bit) -> 448 bytes (8-bit)
  const body = decode7BitData(encodedBody);

  return {
    header,
    body,
    footer,
  };
}

/**
 * Validate a SysEx message without parsing
 *
 * Extends the basic structure validation with additional checks:
 * - All data bytes are 7-bit values (0-127)
 *
 * @param sysex - SysEx message to validate
 * @returns Validation result with any errors
 */
export function validateSysex(sysex: Uint8Array): ValidationResult {
  // First, use the existing structure validation
  const structureValidation = validateSysexStructure(sysex);

  // If structure is invalid, return early
  if (!structureValidation.valid) {
    return structureValidation;
  }

  // Additional validation: check all data bytes are 7-bit (values 0-127)
  const errors: string[] = [];
  const dataStart = SYSEX_CONSTANTS.HEADER_LENGTH;
  const dataEnd = dataStart + SYSEX_CONSTANTS.ENCODED_DATA_LENGTH;

  for (let i = dataStart; i < dataEnd; i++) {
    if (sysex[i] > 0x7f) {
      errors.push(
        `Invalid data byte at offset ${i}: 0x${sysex[i].toString(16).toUpperCase().padStart(2, "0")} (must be 0-127)`
      );
      // Only report first few invalid bytes to avoid spam
      if (errors.filter((e) => e.includes("Invalid data byte")).length >= 5) {
        errors.push("... and more invalid data bytes");
        break;
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Safe parse that returns validation result instead of throwing
 *
 * @param sysex - SysEx message to parse
 * @returns Parsed data if valid, or validation errors
 */
export function tryParseSysex(
  sysex: Uint8Array
): { success: true; data: ParsedSysex } | { success: false; errors: string[] } {
  const validation = validateSysex(sysex);
  if (!validation.valid) {
    return { success: false, errors: validation.errors };
  }

  try {
    const data = parseSysex(sysex);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
}
