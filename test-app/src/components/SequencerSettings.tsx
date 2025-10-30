import React, { useState } from "react";
import { type MonologueParameters } from "@julzelements/monologue-midi";

interface SequencerSettingsProps {
  sequencerSettings: MonologueParameters["sequencerSettings"];
}

export const SequencerSettings: React.FC<SequencerSettingsProps> = ({ sequencerSettings }) => {
  const [expandedSlots, setExpandedSlots] = useState<Set<number>>(new Set());

  const toggleSlot = (slotNumber: number) => {
    const newExpanded = new Set(expandedSlots);
    if (newExpanded.has(slotNumber)) {
      newExpanded.delete(slotNumber);
    } else {
      newExpanded.add(slotNumber);
    }
    setExpandedSlots(newExpanded);
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <h3 style={{ marginBottom: "15px" }}>Sequencer Settings</h3>

      {/* Global Sequencer Settings */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: "15px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          marginBottom: "15px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "12px",
          }}
        >
          <div style={{ textAlign: "center", padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "4px" }}>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>BPM</div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#0066cc" }}>{sequencerSettings.bpm.value}</div>
          </div>
          <div style={{ textAlign: "center", padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "4px" }}>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Step Length</div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#0066cc" }}>
              {sequencerSettings.stepLength.value}
            </div>
          </div>
          <div style={{ textAlign: "center", padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "4px" }}>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Resolution</div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#0066cc" }}>
              {sequencerSettings.stepResolution.value}
            </div>
            <div style={{ fontSize: "11px", color: "#999" }}>{sequencerSettings.stepResolution.name}</div>
          </div>
          <div style={{ textAlign: "center", padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "4px" }}>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Swing</div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#0066cc" }}>
              {sequencerSettings.swing.value}%
            </div>
          </div>
          <div style={{ textAlign: "center", padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "4px" }}>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Default Gate Time</div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#0066cc" }}>
              {sequencerSettings.defaultGateTime.value}%
            </div>
          </div>
        </div>
      </div>

      {/* Motion Slots */}
      <div>
        <h4 style={{ margin: "0 0 12px 0", color: "#555" }}>Motion Sequence Slots</h4>
        <div style={{ display: "grid", gap: "8px" }}>
          {sequencerSettings.motionSlotParams.map((slot) => {
            const isExpanded = expandedSlots.has(slot.slotNumber);
            const hasMotionData = slot.hasMotionData.some((val: number) => val === 1);

            return (
              <div
                key={slot.slotNumber}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  overflow: "hidden",
                }}
              >
                {/* Slot Header */}
                <div
                  onClick={() => toggleSlot(slot.slotNumber)}
                  style={{
                    padding: "12px 15px",
                    cursor: "pointer",
                    backgroundColor: slot.active.value === 1 ? "#e8f4f8" : "#f9f9f9",
                    borderBottom: isExpanded ? "1px solid #ddd" : "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    <span style={{ fontWeight: "bold", color: "#333" }}>Slot {slot.slotNumber}</span>
                    <span
                      style={{
                        fontSize: "12px",
                        padding: "3px 8px",
                        borderRadius: "12px",
                        backgroundColor: slot.active.value === 1 ? "#4CAF50" : "#999",
                        color: "white",
                      }}
                    >
                      {slot.active.value === 1 ? "Active" : "Inactive"}
                    </span>
                    <span style={{ fontSize: "13px", color: "#666" }}>
                      <strong>Param:</strong> {slot.parameter.name || slot.parameter.value}
                    </span>
                    {hasMotionData && (
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "2px 6px",
                          borderRadius: "10px",
                          backgroundColor: "#ff8800",
                          color: "white",
                        }}
                      >
                        Has Motion Data
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: "18px", color: "#999" }}>{isExpanded ? "▲" : "▼"}</span>
                </div>

                {/* Slot Details */}
                {isExpanded && (
                  <div style={{ padding: "15px", backgroundColor: "#fafafa" }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "12px",
                        marginBottom: "15px",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Smooth</div>
                        <div style={{ fontSize: "16px", fontWeight: "500", color: "#333" }}>
                          {slot.smooth.name || slot.smooth.value}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Parameter</div>
                        <div style={{ fontSize: "16px", fontWeight: "500", color: "#333" }}>
                          {slot.parameter.name || `ID: ${slot.parameter.value}`}
                        </div>
                      </div>
                    </div>

                    {/* Motion Data per Step */}
                    <div>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px", fontWeight: "500" }}>
                        Motion Data (per step)
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(16, 1fr)",
                          gap: "2px",
                        }}
                      >
                        {slot.hasMotionData.map((hasData: number, idx: number) => (
                          <div
                            key={idx}
                            style={{
                              aspectRatio: "1",
                              backgroundColor: hasData === 1 ? "#0066cc" : "#e0e0e0",
                              borderRadius: "2px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "9px",
                              color: hasData === 1 ? "white" : "#999",
                              fontWeight: "500",
                            }}
                          >
                            {idx + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
