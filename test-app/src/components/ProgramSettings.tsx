import React from "react";
import { type MonologueParameters } from "@julzelements/monologue-midi";

interface ProgramSettingsProps {
  programSettings: MonologueParameters["programSettings"];
}

const InfoRow: React.FC<{ label: string; value: string | number; name?: string }> = ({ label, value, name }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 12px",
      backgroundColor: "#f9f9f9",
      borderRadius: "4px",
      border: "1px solid #e0e0e0",
    }}
  >
    <span style={{ fontWeight: "500", color: "#555" }}>{label}</span>
    <span style={{ color: "#0066cc", fontWeight: "600" }}>
      {value} {name && <span style={{ fontSize: "11px", color: "#999", marginLeft: "6px" }}>({name})</span>}
    </span>
  </div>
);

export const ProgramSettings: React.FC<ProgramSettingsProps> = ({ programSettings }) => {
  return (
    <div style={{ marginBottom: "30px" }}>
      <h3 style={{ marginBottom: "15px" }}>Program Settings</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "15px",
        }}
      >
        {/* Portamento Section */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <h4 style={{ margin: "0 0 12px 0", color: "#333", fontSize: "16px" }}>Portamento</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <InfoRow
              label="Time"
              value={programSettings.portamento.time.value}
              name={programSettings.portamento.time.name}
            />
            <InfoRow
              label="Mode"
              value={programSettings.portamento.mode.value}
              name={programSettings.portamento.mode.name}
            />
            <InfoRow
              label="Slide Time"
              value={programSettings.portamento.slideTime.value}
              name={programSettings.portamento.slideTime.name}
            />
          </div>
        </div>

        {/* Slider Section */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <h4 style={{ margin: "0 0 12px 0", color: "#333", fontSize: "16px" }}>Slider</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <InfoRow
              label="Assign"
              value={programSettings.slider.assign.value}
              name={programSettings.slider.assign.name}
            />
            <InfoRow
              label="Bend Range +"
              value={programSettings.slider.bendRangePlus.value}
              name={programSettings.slider.bendRangePlus.name}
            />
            <InfoRow
              label="Bend Range -"
              value={programSettings.slider.bendRangeMinus.value}
              name={programSettings.slider.bendRangeMinus.name}
            />
          </div>
        </div>

        {/* Pitch Section */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <h4 style={{ margin: "0 0 12px 0", color: "#333", fontSize: "16px" }}>Pitch</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <InfoRow
              label="Micro Tuning"
              value={programSettings.pitch.microTuning.value}
              name={programSettings.pitch.microTuning.name}
            />
            <InfoRow
              label="Scale Key"
              value={programSettings.pitch.scaleKey.value}
              name={programSettings.pitch.scaleKey.name}
            />
            <InfoRow
              label="Program Tuning"
              value={programSettings.pitch.programTuning.value}
              name={programSettings.pitch.programTuning.name}
            />
          </div>
        </div>

        {/* Other Settings */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <h4 style={{ margin: "0 0 12px 0", color: "#333", fontSize: "16px" }}>Other</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <InfoRow
              label="LFO BPM Sync"
              value={programSettings.other.lfoBpmSync.value}
              name={programSettings.other.lfoBpmSync.name}
            />
            <InfoRow
              label="Cutoff Key Track"
              value={programSettings.other.cutoffKeyTrack.value}
              name={programSettings.other.cutoffKeyTrack.name}
            />
            <InfoRow
              label="Cutoff Velocity"
              value={programSettings.other.cutoffVelocity.value}
              name={programSettings.other.cutoffVelocity.name}
            />
            <InfoRow
              label="Amp Velocity"
              value={programSettings.other.ampVelocity.value}
              name={programSettings.other.ampVelocity.name}
            />
            <InfoRow
              label="Program Level"
              value={programSettings.other.programLevel.value}
              name={programSettings.other.programLevel.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
