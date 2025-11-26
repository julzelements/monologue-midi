import { describe, it, expect } from "vitest";
import { getInputs, getOutputs, findMonologue } from "../ports";
import * as easymidi from "easymidi";

/**
 * Hardware integration tests for MIDI port discovery.
 *
 * These tests require an actual Korg Monologue to be connected via USB/MIDI.
 * They are skipped by default and should be run manually when hardware is available.
 *
 * To run these tests:
 * 1. Connect your Korg Monologue via USB
 * 2. Run: npm run test:hardware
 *
 * These tests are automatically skipped in the normal test suite.
 */

// Skip hardware tests unless explicitly enabled via npm run test:hardware
const describeHardware = process.env.HARDWARE_TESTS ? describe : describe.skip;

describeHardware("MIDI Port Discovery - Hardware Integration", () => {
  describe("getInputs with real hardware", () => {
    it("should return available MIDI input ports", () => {
      const inputs = getInputs();

      // Should return an array (may be empty if no devices connected)
      expect(Array.isArray(inputs)).toBe(true);

      // Log for manual verification
      console.log("Available MIDI inputs:", inputs);
    });

    it("should include Monologue input when connected", () => {
      const inputs = getInputs();

      // Should find a port containing "monologue" (case-insensitive)
      const monologueInput = inputs.find((port) => /monologue/i.test(port));

      expect(monologueInput).toBeDefined();
      expect(monologueInput).toContain("monologue");

      console.log("Monologue input port:", monologueInput);
    });
  });

  describe("getOutputs with real hardware", () => {
    it("should return available MIDI output ports", () => {
      const outputs = getOutputs();

      // Should return an array (may be empty if no devices connected)
      expect(Array.isArray(outputs)).toBe(true);

      // Log for manual verification
      console.log("Available MIDI outputs:", outputs);
    });

    it("should include Monologue output when connected", () => {
      const outputs = getOutputs();

      // Should find a port containing "monologue" (case-insensitive)
      const monologueOutput = outputs.find((port) => /monologue/i.test(port));

      expect(monologueOutput).toBeDefined();
      expect(monologueOutput).toContain("monologue");

      console.log("Monologue output port:", monologueOutput);
    });
  });

  describe("findMonologue with real hardware", () => {
    it("should find connected Monologue ports", () => {
      const ports = findMonologue();

      // Should find at least one port (input or output)
      const hasInput = ports.input !== undefined;
      const hasOutput = ports.output !== undefined;

      expect(hasInput || hasOutput).toBe(true);

      console.log("Found Monologue ports:", ports);
    });

    it("should find both input and output ports", () => {
      const ports = findMonologue();

      // When Monologue is properly connected, both should be found
      expect(ports.input).toBeDefined();
      expect(ports.output).toBeDefined();

      // Input typically contains "KBD/KNOB"
      expect(ports.input?.toLowerCase()).toContain("monologue");

      // Output typically contains "SOUND"
      expect(ports.output?.toLowerCase()).toContain("monologue");

      console.log("Monologue input:", ports.input);
      console.log("Monologue output:", ports.output);
    });

    it("should be able to open connection to input port", () => {
      const ports = findMonologue();

      expect(ports.input).toBeDefined();

      // Test that we can actually create a connection
      let input: easymidi.Input | undefined;

      try {
        input = new easymidi.Input(ports.input!);
        expect(input).toBeDefined();
        console.log("Successfully opened input port:", ports.input);
      } catch (error) {
        throw new Error(`Failed to open input port: ${error}`);
      } finally {
        // Clean up
        if (input) {
          input.close();
          console.log("Closed input port");
        }
      }
    });

    it("should be able to open connection to output port", () => {
      const ports = findMonologue();

      expect(ports.output).toBeDefined();

      // Test that we can actually create a connection
      let output: easymidi.Output | undefined;

      try {
        output = new easymidi.Output(ports.output!);
        expect(output).toBeDefined();
        console.log("Successfully opened output port:", ports.output);
      } catch (error) {
        throw new Error(`Failed to open output port: ${error}`);
      } finally {
        // Clean up
        if (output) {
          output.close();
          console.log("Closed output port");
        }
      }
    });
  });
});
