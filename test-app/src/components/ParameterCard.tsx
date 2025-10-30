import React from "react";
import { PARAMETERS, type ParameterId } from "@julzelements/monologue-midi";

interface ParameterCardProps {
  label: string;
  paramId: ParameterId;
  param: {
    value: number;
    formatted?: string | number;
    name?: string;
  };
  ccValuesByParam: Partial<Record<ParameterId, number>>;
}

export const ParameterCard: React.FC<ParameterCardProps> = ({ label, paramId, param, ccValuesByParam }) => {
  // Get parameter definition from the package
  const paramDef = PARAMETERS[paramId];
  const isDiscrete = paramDef.isDiscrete;
  const maxValue = paramDef.maxValue;

  // Calculate normalized value (0-1) from SysEx data
  let normalizedValue: number;
  if (typeof param.value === "number") {
    normalizedValue = param.value / maxValue;
  } else {
    normalizedValue = 0;
  }

  // Get CC value if it exists for this parameter
  const ccValue = ccValuesByParam[paramId];
  let normalizedCcValue: number | undefined;
  if (ccValue !== undefined) {
    normalizedCcValue = ccValue / maxValue;
  }

  return (
    <div
      style={{
        backgroundColor: "#f9f9f9",
        padding: "12px",
        borderRadius: "6px",
        border: "1px solid #e0e0e0",
        display: "flex",
        flexDirection: "row",
        gap: "12px",
        alignItems: "stretch",
      }}
    >
      {/* Visual level indicators */}
      <div style={{ display: "flex", gap: "4px" }}>
        {/* SysEx value bar (blue) */}
        <div
          style={{
            width: "8px",
            backgroundColor: "#e0e0e0",
            borderRadius: "4px",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column-reverse",
          }}
        >
          <div
            style={{
              width: "100%",
              height: `${normalizedValue * 100}%`,
              backgroundColor: "#0066cc",
              transition: "height 0.2s ease",
            }}
          />
        </div>

        {/* CC value bar (orange) - only show if CC value exists */}
        {normalizedCcValue !== undefined && (
          <div
            style={{
              width: "8px",
              backgroundColor: "#e0e0e0",
              borderRadius: "4px",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column-reverse",
            }}
          >
            <div
              style={{
                width: "100%",
                height: `${normalizedCcValue * 100}%`,
                backgroundColor: "#ff8800",
                // transition: "height 0.2s ease",
              }}
            />
          </div>
        )}
      </div>

      {/* Parameter info */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "14px", color: "#333" }}>{label}</div>
        <div style={{ fontSize: "20px", color: "#0066cc", fontWeight: "500" }}>
          {param.formatted !== undefined ? param.formatted : param.value}
        </div>
        <div style={{ fontSize: "11px", color: "#666", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <span>
            <strong>Raw:</strong> {param.value}
          </span>
          {param.name && (
            <span>
              <strong>Label:</strong> {param.name}
            </span>
          )}
          {ccValue !== undefined && (
            <span style={{ color: "#ff8800" }}>
              <strong>CC:</strong> {ccValue}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
