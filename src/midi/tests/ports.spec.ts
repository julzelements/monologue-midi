import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getInputs, getOutputs, findMonologue } from "../ports";
import * as easymidi from "easymidi";

// Mock easymidi
vi.mock("easymidi", () => ({
  getInputs: vi.fn(),
  getOutputs: vi.fn(),
}));

describe("MIDI Port Discovery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getInputs", () => {
    it("should return list of MIDI inputs", () => {
      const mockInputs = ["Port 1", "Port 2", "monologue KBD/KNOB"];
      vi.mocked(easymidi.getInputs).mockReturnValue(mockInputs);

      const result = getInputs();

      expect(result).toEqual(mockInputs);
      expect(easymidi.getInputs).toHaveBeenCalledOnce();
    });

    it("should return empty array when no inputs available", () => {
      vi.mocked(easymidi.getInputs).mockReturnValue([]);

      const result = getInputs();

      expect(result).toEqual([]);
    });
  });

  describe("getOutputs", () => {
    it("should return list of MIDI outputs", () => {
      const mockOutputs = ["Port 1", "Port 2", "monologue SOUND"];
      vi.mocked(easymidi.getOutputs).mockReturnValue(mockOutputs);

      const result = getOutputs();

      expect(result).toEqual(mockOutputs);
      expect(easymidi.getOutputs).toHaveBeenCalledOnce();
    });

    it("should return empty array when no outputs available", () => {
      vi.mocked(easymidi.getOutputs).mockReturnValue([]);

      const result = getOutputs();

      expect(result).toEqual([]);
    });
  });

  describe("findMonologue", () => {
    it("should find monologue input and output ports", () => {
      vi.mocked(easymidi.getInputs).mockReturnValue(["Other Device", "monologue KBD/KNOB", "Another Port"]);
      vi.mocked(easymidi.getOutputs).mockReturnValue(["Other Device", "monologue SOUND", "Another Port"]);

      const result = findMonologue();

      expect(result).toEqual({
        input: "monologue KBD/KNOB",
        output: "monologue SOUND",
      });
    });

    it("should be case-insensitive when finding monologue", () => {
      vi.mocked(easymidi.getInputs).mockReturnValue(["MONOLOGUE KBD/KNOB"]);
      vi.mocked(easymidi.getOutputs).mockReturnValue(["Monologue SOUND"]);

      const result = findMonologue();

      expect(result.input).toBe("MONOLOGUE KBD/KNOB");
      expect(result.output).toBe("Monologue SOUND");
    });

    it("should return undefined for missing input", () => {
      vi.mocked(easymidi.getInputs).mockReturnValue(["Other Device"]);
      vi.mocked(easymidi.getOutputs).mockReturnValue(["monologue SOUND"]);

      const result = findMonologue();

      expect(result).toEqual({
        input: undefined,
        output: "monologue SOUND",
      });
    });

    it("should return undefined for missing output", () => {
      vi.mocked(easymidi.getInputs).mockReturnValue(["monologue KBD/KNOB"]);
      vi.mocked(easymidi.getOutputs).mockReturnValue(["Other Device"]);

      const result = findMonologue();

      expect(result).toEqual({
        input: "monologue KBD/KNOB",
        output: undefined,
      });
    });

    it("should return both undefined when monologue not connected", () => {
      vi.mocked(easymidi.getInputs).mockReturnValue(["Other Device 1", "Other Device 2"]);
      vi.mocked(easymidi.getOutputs).mockReturnValue(["Other Device 1", "Other Device 2"]);

      const result = findMonologue();

      expect(result).toEqual({
        input: undefined,
        output: undefined,
      });
    });

    it("should find first monologue port if multiple present", () => {
      vi.mocked(easymidi.getInputs).mockReturnValue(["monologue 1", "monologue 2"]);
      vi.mocked(easymidi.getOutputs).mockReturnValue(["monologue 1", "monologue 2"]);

      const result = findMonologue();

      expect(result).toEqual({
        input: "monologue 1",
        output: "monologue 1",
      });
    });
  });
});
