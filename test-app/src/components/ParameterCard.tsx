import React from "react";

interface ParameterCardProps {
  label: string;
  param: {
    value: number;
    formatted?: string | number;
    name?: string;
  };
  panelPath: string;
  ccValuesByParam: Record<string, number>;
  discreteParams: Record<string, number>;
}

export const ParameterCard: React.FC<ParameterCardProps> = ({
  label,
  param,
  panelPath,
  ccValuesByParam,
  discreteParams,
}) => {
  // Check if this is a discrete parameter
  const maxDiscreteValue = discreteParams[panelPath];
  const isDiscrete = maxDiscreteValue !== undefined;

  // Calculate normalized value (0-1) from SysEx data
  let normalizedValue: number;
  if (typeof param.value === "number") {
    if (isDiscrete) {
      // For discrete params: divide by max value (e.g., 0-2 becomes 0/2, 1/2, 2/2)
      normalizedValue = param.value / maxDiscreteValue;
    } else {
      // For continuous params: divide by 1023
      normalizedValue = param.value / 1023;
    }
  } else {
    normalizedValue = 0;
  }

  // Get CC value if it exists for this parameter
  const ccValue = ccValuesByParam[panelPath];
  let normalizedCcValue: number | undefined;
  if (ccValue !== undefined) {
    if (isDiscrete) {
      // For discrete params: divide by max value
      normalizedCcValue = ccValue / maxDiscreteValue;
    } else {
      // For continuous params: divide by 1023
      normalizedCcValue = ccValue / 1023;
    }
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
