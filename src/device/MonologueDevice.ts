import { MonologueParameters } from "../sysex/decode";
import { encodeMonologueParameters } from "../sysex/encode";
import { decodeMonologueParameters } from "../sysex/decode";

/**
 * Stateful WebMIDI device manager for Korg Monologue
 */

export interface MonologueDeviceOptions {
  // TODO: Define options
}

export class MonologueDevice {
  private input: MIDIInput | null = null;
  private output: MIDIOutput | null = null;

  constructor() {
    // Future: manage WebMIDI connections here
  }

  /**
   * Connect to a Korg Monologue device
   */
  async connect(): Promise<void> {
    // TODO: Implement connection logic
    throw new Error("Not implemented");
  }

  /**
   * Disconnect from the device
   */
  async disconnect(): Promise<void> {
    // TODO: Implement disconnection logic
    throw new Error("Not implemented");
  }

  /**
   * Send a SysEx message to the device
   */
  sendSysEx(data: Uint8Array): void {
    // TODO: Implement SysEx sending
    throw new Error("Not implemented");
  }

  /**
   * Send a MIDI CC message to the device
   */
  sendCC(controller: number, value: number): void {
    // TODO: Implement CC sending
    throw new Error("Not implemented");
  }

  /**
   * Listen for incoming MIDI messages
   */
  onMessage(callback: (event: MIDIMessageEvent) => void): void {
    // TODO: Implement message listening
    throw new Error("Not implemented");
  }

  /**
   * Encode Monologue parameters to SysEx
   */
  encode(params: MonologueParameters): number[] {
    // TODO: Add JSON schema validation in future
    return encodeMonologueParameters(params);
  }

  /**
   * Decode SysEx data to Monologue parameters
   */
  decode(sysex: number[]): MonologueParameters {
    return decodeMonologueParameters(sysex);
  }
}
