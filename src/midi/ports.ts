import * as easymidi from "easymidi";

/**
 * Monologue port information
 */
export type MonologuePorts = {
  input?: string;
  output?: string;
};

/**
 * Get all available MIDI input ports.
 * @returns Array of input port names
 *
 * @example
 * ```typescript
 * import { getInputs } from '@julzelements/monologue-midi';
 *
 * const inputs = getInputs();
 * console.log('Available inputs:', inputs);
 * ```
 */
export function getInputs(): string[] {
  return easymidi.getInputs();
}

/**
 * Get all available MIDI output ports.
 * @returns Array of output port names
 *
 * @example
 * ```typescript
 * import { getOutputs } from '@julzelements/monologue-midi';
 *
 * const outputs = getOutputs();
 * console.log('Available outputs:', outputs);
 * ```
 */
export function getOutputs(): string[] {
  return easymidi.getOutputs();
}

/**
 * Find Korg Monologue ports by name pattern.
 * Searches for ports containing "monologue" (case-insensitive).
 *
 * @returns Object with input and/or output port names, undefined if not found
 *
 * @example
 * ```typescript
 * import { findMonologue } from '@julzelements/monologue-midi';
 * import * as easymidi from 'easymidi';
 *
 * const ports = findMonologue();
 *
 * if (ports.input) {
 *   const input = new easymidi.Input(ports.input);
 *   input.on('sysex', (msg) => {
 *     console.log('Received SysEx:', msg);
 *   });
 * }
 *
 * if (ports.output) {
 *   const output = new easymidi.Output(ports.output);
 *   output.send('sysex', [0xF0, 0x42, ...]);
 * }
 * ```
 */
export function findMonologue(): MonologuePorts {
  const inputs = getInputs();
  const outputs = getOutputs();

  const pattern = /monologue/i;

  return {
    input: inputs.find((name) => pattern.test(name)),
    output: outputs.find((name) => pattern.test(name)),
  };
}
