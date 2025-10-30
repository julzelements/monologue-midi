import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  decodeMonologueParameters,
  decodeCC,
  CC_NAME_TO_PARAMETER,
  type ParameterId,
} from "@julzelements/monologue-midi";
import { WebMidi } from "webmidi";
import { PanelSettings } from "./components/PanelSettings";
import { ProgramSettings } from "./components/ProgramSettings";
import { SequencerSettings } from "./components/SequencerSettings";
import { SequencerSteps } from "./components/SequencerSteps";

const App = () => {
  const [midiData, setMidiData] = useState<any>(null);
  const [isWebMidiEnabled, setIsWebMidiEnabled] = useState(false);
  const [isRawDataExpanded, setIsRawDataExpanded] = useState(false);
  const [lastMidiMessage, setLastMidiMessage] = useState<string | null>(null);
  const [ccValuesByParam, setCcValuesByParam] = useState<Partial<Record<ParameterId, number>>>({});

  const sampleData = new Uint8Array([
    240, 66, 48, 0, 1, 68, 64, 0, 80, 82, 79, 71, 79, 110, 79, 0, 102, 102, 0, 0, 0, 0, 0, 84, 0, 0, 0, 0, 0, 0, 127,
    96, 0, 92, 0, 0, 127, 51, 0, 13, 0, 0, 16, 16, 0, 3, 48, 0, 1, 0, 50, 0, 0, 0, 0, 32, 56, 34, 0, 102, 0, 72, 83, 8,
    69, 81, 68, 48, 4, 16, 0, 12, 0, 54, 127, 127, 0, 0, 0, 24, 0, 85, 85, 42, 42, 85, 85, 0, 0, 0, 3, 23, 3, 27, 3, 8,
    28, 3, 16, 78, 125, 30, 15, 12, 82, 72, 42, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 28, 0, 4, 40, 0, 54, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 0, 0, 124, 124, 126, 3, 61, 7, 61, 61, 61, 1, 1,
    1, 1, 80, 52, 0, 51, 0, 54, 0, 127, 127, 127, 127, 127, 3, 8, 11, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 48, 86, 86, 86, 86, 11, 3, 127, 0, 125, 0, 0, 0, 0, 2, 2, 64, 2, 2, 33, 0, 58, 0, 54, 0, 0, 0, 0, 0, 0, 125, 124,
    60, 124, 124, 52, 52, 52, 52, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 104, 0, 109, 114, 117, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 36, 0, 30, 2, 0, 54, 0, 108, 110, 110, 99, 112, 117, 118, 118, 118, 34, 34, 34, 1, 34, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 99, 71, 47, 0, 41, 118, 118, 118, 118, 0, 0, 0, 0, 0, 2, 2, 2, 2, 40, 8, 0, 47, 0, 54, 0, 41, 85, 56,
    70, 70, 125, 6, 17, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 120, 0, 0, 0, 20, 20, 10, 3, 0, 0, 0, 0,
    0, 1, 1, 1, 32, 1, 45, 0, 48, 0, 54, 0, 16, 99, 99, 100, 106, 3, 125, 124, 0, 124, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 24, 0, 106, 116, 0, 8, 124, 126, 60, 124, 124, 51, 51, 51, 51, 2, 0, 2, 2, 2, 36, 0, 54, 0, 13, 54, 0, 8,
    4, 109, 91, 101, 0, 92, 91, 91, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 91, 83, 86, 91, 0, 121, 126, 126,
    108, 0, 0, 0, 0, 0, 1, 1, 1, 1, 33, 0, 4, 50, 0, 54, 0, 91, 92, 92, 96, 92, 108, 118, 117, 117, 60, 60, 3, 60, 60,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 1, 99, 103, 103, 0, 0, 0, 0, 0, 2, 2, 2, 2, 247,
  ]);

  function stringifyWithLineLimit(obj: any, maxLineLength = 150, indent = 2, level = 0): string {
    const currentIndent = " ".repeat(level * indent);
    const nextIndent = " ".repeat((level + 1) * indent);

    if (obj === null || typeof obj !== "object") {
      return JSON.stringify(obj);
    }

    if (Array.isArray(obj)) {
      const oneLine = `[${obj.map((item) => stringifyWithLineLimit(item, maxLineLength, indent, 0)).join(", ")}]`;
      if (oneLine.length <= maxLineLength) return oneLine;

      // multiline
      const items = obj
        .map((item) => `${nextIndent}${stringifyWithLineLimit(item, maxLineLength, indent, level + 1)}`)
        .join(",\n");
      return `[\n${items}\n${currentIndent}]`;
    }

    // Object
    const entries = Object.entries(obj);
    const oneLine = `{${entries
      .map(([key, value]) => `"${key}": ${stringifyWithLineLimit(value, maxLineLength, indent, 0)}`)
      .join(", ")}}`;
    if (oneLine.length <= maxLineLength) return oneLine;

    // multiline
    const multiline = entries
      .map(
        ([key, value]) => `${nextIndent}"${key}": ${stringifyWithLineLimit(value, maxLineLength, indent, level + 1)}`
      )
      .join(",\n");
    return `{\n${multiline}\n${currentIndent}}`;
  }

  useEffect(() => {
    // Parse the sample data on component mount
    const loadSampleData = async () => {
      try {
        const parsed = decodeMonologueParameters(sampleData);
        setMidiData(parsed);
      } catch (error) {
        console.error("Error parsing sample MIDI data:", error);
      }
    };

    loadSampleData();

    // Initialize WebMIDI
    WebMidi.enable({ sysex: true })
      .then(onEnabled)
      .catch((err) => console.error("WebMIDI error:", err));
  }, []);

  function onEnabled() {
    setIsWebMidiEnabled(true);

    const myInput = WebMidi.getInputByName(`monologue KBD/KNOB`);
    const myOutput = WebMidi.getOutputByName(`monologue SOUND`);

    if (myInput) {
      myInput.addListener("noteon", (e) => {
        console.log(e.note.identifier);
      });

      myInput.addListener("controlchange", (e) => {
        const ccNum = e.controller.number;
        const ccValue = e.value;
        const ccRawValue = e.rawValue ?? 0;
        const timestamp = new Date().toLocaleTimeString();
        setLastMidiMessage(`CC${ccNum}: ${ccValue}, raw:[${ccRawValue}] (${timestamp})`);

        // Decode CC to parameter name and store value (0-1023)
        const decoded = decodeCC(0xb0, ccNum, ccRawValue);
        if (decoded) {
          const paramId = CC_NAME_TO_PARAMETER[decoded.parameter];
          if (paramId) {
            setCcValuesByParam((prev) => ({ ...prev, [paramId]: decoded.value }));
          }
        }

        console.log(`CC${ccNum} = ${ccValue}`);
      });

      myInput.addListener("sysex", async (msg) => {
        try {
          const parsed = decodeMonologueParameters(msg.data);
          setMidiData(parsed);
        } catch (error) {
          console.error("Error parsing MIDI data:", error);
        }
      });

      myInput.addListener("programchange", (event: any) => {
        console.log(`Program Change received on channel ${event.channel}: ${event.value}`);
        requestCurrentProgramDump(event.channel);
      });
    }

    function requestCurrentProgramDump(channel = 1) {
      if (!myOutput) return;

      const manufacturerId = 0x42; // Korg
      const globalChannel = channel - 1; // Convert 1–16 → 0–15
      const deviceByte = 0x30 + globalChannel;
      const modelId = [0x00, 0x01, 0x44];
      const functionCode = 0x10; // Current Program Data Dump Request

      const data = [deviceByte, ...modelId, functionCode];
      myOutput.sendSysex(manufacturerId, data);

      console.log(`Sent Current Program Dump Request on channel ${channel}`);
    }

    requestCurrentProgramDump();
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Korg Monologue MIDI Data Viewer</h1>

      <div style={{ marginBottom: "20px" }}>
        <strong>WebMIDI Status:</strong> {isWebMidiEnabled ? "✅ Enabled" : "❌ Disabled"}
      </div>

      {lastMidiMessage && (
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "#e8f4f8",
            border: "1px solid #0066cc",
            borderRadius: "6px",
            fontFamily: "monospace",
            fontSize: "14px",
          }}
        >
          <strong>Last MIDI Message:</strong> {lastMidiMessage}
        </div>
      )}

      {midiData && (
        <>
          <h2>Patch: {midiData.patchName}</h2>

          {/* Panel Settings Component */}
          <PanelSettings midiData={midiData} ccValuesByParam={ccValuesByParam} />

          {/* Program Settings Component */}
          <ProgramSettings programSettings={midiData.programSettings} />

          {/* Sequencer Settings Component */}
          <SequencerSettings sequencerSettings={midiData.sequencerSettings} />

          {/* Sequencer Steps Component */}
          <SequencerSteps sequencerSteps={midiData.sequencerSteps} />

          {/* Raw Data Section */}
          <h3>Raw Data</h3>
          <div
            style={{
              backgroundColor: "#f5f5f5",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            <button
              onClick={() => setIsRawDataExpanded(!isRawDataExpanded)}
              style={{
                backgroundColor: "#0066cc",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: isRawDataExpanded ? "15px" : "0",
              }}
            >
              {isRawDataExpanded ? "Hide Raw Data ▲" : "Show Raw Data ▼"}
            </button>
            {isRawDataExpanded && (
              <pre
                style={{
                  margin: 0,
                  fontSize: "12px",
                  lineHeight: "1.4",
                  overflow: "auto",
                  maxHeight: "70vh",
                }}
              >
                {stringifyWithLineLimit(midiData)}
              </pre>
            )}
          </div>
        </>
      )}

      {!midiData && <div>Loading MIDI data...</div>}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
