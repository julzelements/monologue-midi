/**
 * Encode Korg Monologue parameter object to SysEx data
 */

import { MonologueParameters } from "./decode";

/**
 * Encode Monologue parameters to SysEx byte array
 * @param params - Parameter object to encode
 * @returns SysEx data as Uint8Array
 */
export function encodeMonologueParameters(params: MonologueParameters): Uint8Array {
  // TODO: Implement encoding logic
  // For now, return a minimal SysEx header
  const header = [0xf0, 0x42, 0x30, 0x00, 0x01, 0x44, 0x40];
  const footer = [0xf7];

  // 512 bytes total SysEx message (including header and footer)
  const sysex = new Uint8Array(512);

  // Set header
  header.forEach((byte, i) => {
    sysex[i] = byte;
  });

  // Set footer
  sysex[511] = footer[0];

  return sysex;
}
