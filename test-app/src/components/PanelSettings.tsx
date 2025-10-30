import React from "react";
import { prettyPanelSettings } from "@julzelements/monologue-midi";
import { ParameterCard } from "./ParameterCard";

interface PanelSettingsProps {
  midiData: any;
  ccValuesByParam: Record<string, number>;
  discreteParams: Record<string, number>;
}

export const PanelSettings: React.FC<PanelSettingsProps> = ({ midiData, ccValuesByParam, discreteParams }) => {
  const prettySettings = prettyPanelSettings(midiData);

  return (
    <div style={{ marginBottom: "30px" }}>
      <h3 style={{ marginBottom: "15px" }}>Panel Settings</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "12px",
        }}
      >
        {/* Global Settings */}
        <ParameterCard
          label="Drive"
          param={prettySettings.drive}
          panelPath="drive"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />
        <ParameterCard
          label="Keyboard Octave"
          param={prettySettings.keyboardOctave}
          panelPath="keyboardOctave"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />
        <ParameterCard
          label="Sync/Ring"
          param={prettySettings.syncRing}
          panelPath="syncRing"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />
        <ParameterCard
          label="Seq Trigger"
          param={prettySettings.seqTrig}
          panelPath="seqTrig"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />

        {/* VCO 1 */}
        <div style={{ gridColumn: "1 / -1", marginTop: "10px" }}>
          <h4
            style={{
              margin: "0 0 10px 0",
              color: "#555",
              borderBottom: "2px solid #ddd",
              paddingBottom: "5px",
            }}
          >
            VCO 1
          </h4>
        </div>
        <ParameterCard
          label="VCO1 Wave"
          param={prettySettings.oscilators.vco1.wave}
          panelPath="oscilators.vco1.wave"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />
        <ParameterCard
          label="VCO1 Shape"
          param={prettySettings.oscilators.vco1.shape}
          panelPath="oscilators.vco1.shape"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />
        <ParameterCard
          label="VCO1 Level"
          param={prettySettings.oscilators.vco1.level}
          panelPath="oscilators.vco1.level"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />
        <ParameterCard
          label="VCO1 Pitch (cents)"
          param={prettySettings.oscilators.vco1.pitch}
          panelPath="oscilators.vco1.pitch"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />
        <ParameterCard
          label="VCO1 Octave"
          param={prettySettings.oscilators.vco1.octave}
          panelPath="oscilators.vco1.octave"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />

        {/* VCO 2 */}
        <div style={{ gridColumn: "1 / -1", marginTop: "10px" }}>
          <h4
            style={{
              margin: "0 0 10px 0",
              color: "#555",
              borderBottom: "2px solid #ddd",
              paddingBottom: "5px",
            }}
          >
            VCO 2
          </h4>
        </div>
        <ParameterCard
          label="VCO2 Wave"
          param={prettySettings.oscilators.vco2.wave}
          panelPath="oscilators.vco2.wave"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />
        <ParameterCard
          label="VCO2 Shape"
          param={prettySettings.oscilators.vco2.shape}
          panelPath="oscilators.vco2.shape"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />
        <ParameterCard
          label="VCO2 Level"
          param={prettySettings.oscilators.vco2.level}
          panelPath="oscilators.vco2.level"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />
        <ParameterCard
          label="VCO2 Pitch (cents)"
          param={prettySettings.oscilators.vco2.pitch}
          panelPath="oscilators.vco2.pitch"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />
        <ParameterCard
          label="VCO2 Octave"
          param={prettySettings.oscilators.vco2.octave}
          panelPath="oscilators.vco2.octave"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />

        {/* Filter */}
        <div style={{ gridColumn: "1 / -1", marginTop: "10px" }}>
          <h4
            style={{
              margin: "0 0 10px 0",
              color: "#555",
              borderBottom: "2px solid #ddd",
              paddingBottom: "5px",
            }}
          >
            Filter
          </h4>
        </div>
        <ParameterCard
          label="Cutoff"
          param={prettySettings.filter.cutoff}
          panelPath="filter.cutoff"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />
        <ParameterCard
          label="Resonance"
          param={prettySettings.filter.resonance}
          panelPath="filter.resonance"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />

        {/* Envelope */}
        <div style={{ gridColumn: "1 / -1", marginTop: "10px" }}>
          <h4
            style={{
              margin: "0 0 10px 0",
              color: "#555",
              borderBottom: "2px solid #ddd",
              paddingBottom: "5px",
            }}
          >
            Envelope
          </h4>
        </div>
        <ParameterCard
          label="EG Type"
          param={prettySettings.envelope.type}
          panelPath="envelope.type"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />
        <ParameterCard
          label="EG Attack"
          param={prettySettings.envelope.attack}
          panelPath="envelope.attack"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />
        <ParameterCard
          label="EG Decay"
          param={prettySettings.envelope.decay}
          panelPath="envelope.decay"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />
        <ParameterCard
          label="EG Intensity"
          param={prettySettings.envelope.intensity}
          panelPath="envelope.intensity"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />
        <ParameterCard
          label="EG Target"
          param={prettySettings.envelope.target}
          panelPath="envelope.target"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />

        {/* LFO */}
        <div style={{ gridColumn: "1 / -1", marginTop: "10px" }}>
          <h4
            style={{
              margin: "0 0 10px 0",
              color: "#555",
              borderBottom: "2px solid #ddd",
              paddingBottom: "5px",
            }}
          >
            LFO
          </h4>
        </div>
        <ParameterCard
          label="LFO Type"
          param={prettySettings.lfo.type}
          panelPath="lfo.type"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />
        <ParameterCard
          label="LFO Mode"
          param={prettySettings.lfo.mode}
          panelPath="lfo.mode"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />
        <ParameterCard
          label="LFO Rate"
          param={prettySettings.lfo.rate}
          panelPath="lfo.rate"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />
        <ParameterCard
          label="LFO Intensity"
          param={prettySettings.lfo.intensity}
          panelPath="lfo.intensity"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />
        <ParameterCard
          label="LFO Target"
          param={prettySettings.lfo.target}
          panelPath="lfo.target"
          ccValuesByParam={ccValuesByParam}
          discreteParams={discreteParams}
        />
      </div>
    </div>
  );
};
