import React, { useState } from "react";

interface SequencerStepsProps {
  sequencerSteps: any[];
}

export const SequencerSteps: React.FC<SequencerStepsProps> = ({ sequencerSteps }) => {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (stepNumber: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepNumber)) {
      newExpanded.delete(stepNumber);
    } else {
      newExpanded.add(stepNumber);
    }
    setExpandedSteps(newExpanded);
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <h3 style={{ marginBottom: "15px" }}>Sequencer Steps</h3>

      {/* Step Grid View */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
          gap: "6px",
          marginBottom: "20px",
        }}
      >
        {sequencerSteps.map((step) => {
          const isActive = step.active.value === 1;
          const hasMotion = step.motionActive.value === 1;
          const hasSlide = step.slideActive.value === 1;
          const isExpanded = expandedSteps.has(step.stepNumber);

          return (
            <div
              key={step.stepNumber}
              onClick={() => toggleStep(step.stepNumber)}
              style={{
                padding: "8px",
                backgroundColor: isActive ? "#0066cc" : "#e0e0e0",
                color: isActive ? "white" : "#666",
                borderRadius: "6px",
                cursor: "pointer",
                textAlign: "center",
                border: isExpanded ? "2px solid #ff8800" : "2px solid transparent",
                transition: "all 0.2s ease",
                position: "relative",
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }}>{step.stepNumber}</div>
              <div style={{ fontSize: "10px", marginBottom: "2px" }}>
                {step.event.note.key.name || `Note ${step.event.note.key.value}`}
              </div>
              <div style={{ fontSize: "9px", opacity: 0.8 }}>Vel: {step.event.note.velocity.value}</div>
              {/* Indicators */}
              <div style={{ display: "flex", gap: "2px", justifyContent: "center", marginTop: "4px" }}>
                {hasMotion && (
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#ff8800",
                    }}
                    title="Motion"
                  />
                )}
                {hasSlide && (
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#4CAF50",
                    }}
                    title="Slide"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Step Details */}
      {expandedSteps.size > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h4 style={{ margin: "0 0 12px 0", color: "#555" }}>Step Details</h4>
          <div style={{ display: "grid", gap: "12px" }}>
            {sequencerSteps
              .filter((step) => expandedSteps.has(step.stepNumber))
              .map((step) => (
                <div
                  key={step.stepNumber}
                  style={{
                    backgroundColor: "#fff",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "2px solid #ff8800",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "15px",
                    }}
                  >
                    <h4 style={{ margin: 0, color: "#333" }}>Step {step.stepNumber}</h4>
                    <button
                      onClick={() => toggleStep(step.stepNumber)}
                      style={{
                        padding: "4px 12px",
                        fontSize: "12px",
                        backgroundColor: "#f0f0f0",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Close
                    </button>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    {/* Note Section */}
                    <div style={{ backgroundColor: "#f9f9f9", padding: "12px", borderRadius: "6px" }}>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px", fontWeight: "500" }}>
                        Note
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <div>
                          <span style={{ fontSize: "11px", color: "#999" }}>Key: </span>
                          <span style={{ fontSize: "14px", fontWeight: "bold", color: "#0066cc" }}>
                            {step.event.note.key.name || step.event.note.key.value}
                          </span>
                        </div>
                        <div>
                          <span style={{ fontSize: "11px", color: "#999" }}>Velocity: </span>
                          <span style={{ fontSize: "14px", fontWeight: "bold", color: "#0066cc" }}>
                            {step.event.note.velocity.value}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Gate/Timing Section */}
                    <div style={{ backgroundColor: "#f9f9f9", padding: "12px", borderRadius: "6px" }}>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px", fontWeight: "500" }}>
                        Gate & Timing
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <div>
                          <span style={{ fontSize: "11px", color: "#999" }}>Gate Time: </span>
                          <span style={{ fontSize: "14px", fontWeight: "bold", color: "#0066cc" }}>
                            {step.event.gateTime.value}%
                          </span>
                        </div>
                        <div>
                          <span style={{ fontSize: "11px", color: "#999" }}>Trigger Timing: </span>
                          <span style={{ fontSize: "14px", fontWeight: "bold", color: "#0066cc" }}>
                            {step.event.triggerTiming.value}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Flags Section */}
                    <div style={{ backgroundColor: "#f9f9f9", padding: "12px", borderRadius: "6px" }}>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px", fontWeight: "500" }}>
                        Flags
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              backgroundColor: step.active.value === 1 ? "#4CAF50" : "#ccc",
                            }}
                          />
                          <span style={{ fontSize: "13px" }}>Active</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              backgroundColor: step.motionActive.value === 1 ? "#ff8800" : "#ccc",
                            }}
                          />
                          <span style={{ fontSize: "13px" }}>Motion</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              backgroundColor: step.slideActive.value === 1 ? "#4CAF50" : "#ccc",
                            }}
                          />
                          <span style={{ fontSize: "13px" }}>Slide</span>
                        </div>
                      </div>
                    </div>

                    {/* Motion Data Section */}
                    {step.motionActive.value === 1 && step.motionData && (
                      <div
                        style={{
                          backgroundColor: "#fff4e6",
                          padding: "12px",
                          borderRadius: "6px",
                          gridColumn: "1 / -1",
                        }}
                      >
                        <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px", fontWeight: "500" }}>
                          Motion Data
                        </div>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                            gap: "8px",
                          }}
                        >
                          {step.motionData.map((motion: any, idx: number) => (
                            <div key={idx} style={{ fontSize: "12px" }}>
                              <span style={{ color: "#999" }}>Slot {idx + 1}: </span>
                              <span style={{ fontWeight: "bold", color: "#ff8800" }}>{motion.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
