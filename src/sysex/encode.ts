/**
 * Encode Korg Monologue parameter object to SysEx data
 */

import { MonologueParameters } from "./decode";
import { encode7BitData } from "./utils/seven-bit-encoding";
import { SYSEX_CONSTANTS } from "./utils/sysex-format";

/**
 * Encode Monologue parameters to SysEx byte array
 * @param params - Parameter object to encode
 * @returns SysEx data as Uint8Array (520 bytes)
 */
export function encodeMonologueParameters(params: MonologueParameters): Uint8Array {
  // Create 448-byte decoded body
  const body = new Uint8Array(448);

  // Write PROG marker (offset 0-3)
  body[0] = 0x50; // 'P'
  body[1] = 0x52; // 'R'
  body[2] = 0x4f; // 'O'
  body[3] = 0x47; // 'G'

  // Write PROGRAM NAME (offset 4-15, 12 ASCII characters)
  const patchName = params.patchName || "";
  for (let i = 0; i < 12; i++) {
    if (i < patchName.length) {
      // Write character, ensuring it's 7-bit ASCII
      body[4 + i] = patchName.charCodeAt(i) & 0x7f;
    } else {
      // Pad with null bytes
      body[4 + i] = 0x00;
    }
  }

  // TODO: Encode other parameters (VCO, filter, envelope, etc.)
  // For now, leave rest as zeros

  // Encode body to 7-bit MIDI format (448 bytes -> 512 bytes)
  const encodedBody = encode7BitData(body);

  // Create full 520-byte SysEx message
  const sysex = new Uint8Array(SYSEX_CONSTANTS.TOTAL_LENGTH);

  // Write header (7 bytes)
  sysex[0] = 0xf0; // SysEx start
  sysex[1] = 0x42; // Korg
  sysex[2] = 0x30; // Channel 1 (3g where g=0)
  sysex[3] = 0x00; //
  sysex[4] = 0x01; //
  sysex[5] = 0x44; // Monologue
  sysex[6] = 0x40; // Current Program Data Dump

  // Write encoded body (512 bytes)
  sysex.set(encodedBody, SYSEX_CONSTANTS.HEADER_LENGTH);

  // Write footer (1 byte)
  sysex[SYSEX_CONSTANTS.TOTAL_LENGTH - 1] = 0xf7; // SysEx end

  return sysex;
}
