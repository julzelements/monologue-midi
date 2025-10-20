/**
 * Low-level SysEx format utilities for Korg Monologue
 *
 * The Monologue uses 7-bit MIDI encoding for SysEx data:
 * - Original data: 448 bytes (7 bytes × 64 sets)
 * - MIDI data: 512 bytes (8 bytes × 64 sets)
 * - Header: 7 bytes
 * - Footer: 1 byte
 * - Total: 520 bytes
 */

/**
 * SysEx message structure constants
 */
export const SYSEX_CONSTANTS = {
  HEADER: [0xf0, 0x42, 0x30, 0x00, 0x01, 0x44, 0x40] as const,
  FOOTER: 0xf7,
  HEADER_LENGTH: 7,
  FOOTER_LENGTH: 1,
  ENCODED_DATA_LENGTH: 512,
  DECODED_DATA_LENGTH: 448,
  TOTAL_LENGTH: 520,
  BYTES_PER_SET_DECODED: 7,
  BYTES_PER_SET_ENCODED: 8,
  NUM_SETS: 64,
} as const;

/**
 * Extract header from SysEx message
 */
export function extractHeader(sysex: Uint8Array): Uint8Array {
  return sysex.slice(0, SYSEX_CONSTANTS.HEADER_LENGTH);
}

/**
 * Extract footer from SysEx message
 */
export function extractFooter(sysex: Uint8Array): number {
  return sysex[sysex.length - 1];
}

/**
 * Extract encoded data payload (excluding header and footer)
 */
export function extractEncodedData(sysex: Uint8Array): Uint8Array {
  return sysex.slice(
    SYSEX_CONSTANTS.HEADER_LENGTH,
    SYSEX_CONSTANTS.HEADER_LENGTH + SYSEX_CONSTANTS.ENCODED_DATA_LENGTH
  );
}

/**
 * Validate SysEx header
 */
export function isValidHeader(header: Uint8Array): boolean {
  if (header.length !== SYSEX_CONSTANTS.HEADER_LENGTH) {
    return false;
  }
  return SYSEX_CONSTANTS.HEADER.every((byte, i) => byte === header[i]);
}

/**
 * Validate SysEx footer
 */
export function isValidFooter(footer: number): boolean {
  return footer === SYSEX_CONSTANTS.FOOTER;
}

/**
 * Validate entire SysEx message structure
 */
export function validateSysexStructure(sysex: Uint8Array): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (sysex.length !== SYSEX_CONSTANTS.TOTAL_LENGTH) {
    errors.push(`Invalid length: expected ${SYSEX_CONSTANTS.TOTAL_LENGTH}, got ${sysex.length}`);
  }

  const header = extractHeader(sysex);
  if (!isValidHeader(header)) {
    errors.push(
      `Invalid header: expected [${SYSEX_CONSTANTS.HEADER.join(", ")}], got [${Array.from(header).join(", ")}]`
    );
  }

  const footer = extractFooter(sysex);
  if (!isValidFooter(footer)) {
    errors.push(`Invalid footer: expected ${SYSEX_CONSTANTS.FOOTER}, got ${footer}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
