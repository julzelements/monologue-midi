import React from "react";
import { prettyPanelSettings, type ParameterId } from "@julzelements/monologue-midi";
import { ParameterCard } from "./ParameterCard";

interface PanelSettingsProps {
  midiData: any;
  ccValuesByParam: Partial<Record<ParameterId, number>>;
}

export const PanelSettings: React.FC<PanelSettingsProps> = ({ midiData, ccValuesByParam }) => {
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
        <ParameterCard label="Drive" paramId="drive" param={prettySettings.drive} ccValuesByParam={ccValuesByParam} />
        <ParameterCard
          label="Sync/Ring"
          paramId="syncRing"
          param={prettySettings.syncRing}
          ccValuesByParam={ccValuesByParam}
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
          paramId="vco1Wave"
          param={prettySettings.oscilators.vco1.wave}
          ccValuesByParam={ccValuesByParam}
        />
        <ParameterCard
          label="VCO1 Shape"
          paramId="vco1Shape"
          param={prettySettings.oscilators.vco1.shape}
          ccValuesByParam={ccValuesByParam}
        />
        <ParameterCard
          label="VCO1 Level"
          paramId="vco1Level"
          param={prettySettings.oscilators.vco1.level}
          ccValuesByParam={ccValuesByParam}
        />
        <ParameterCard
          label="VCO1 Pitch (cents)"
          paramId="vco1Pitch"
          param={prettySettings.oscilators.vco1.pitch}
          ccValuesByParam={ccValuesByParam}
        />
        <ParameterCard
          label="VCO1 Octave"
          paramId="vco1Octave"
          param={prettySettings.oscilators.vco1.octave}
          ccValuesByParam={ccValuesByParam}
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
          paramId="vco2Wave"
          param={prettySettings.oscilators.vco2.wave}
          ccValuesByParam={ccValuesByParam}
        />
        <ParameterCard
          label="VCO2 Shape"
          paramId="vco2Shape"
          param={prettySettings.oscilators.vco2.shape}
          ccValuesByParam={ccValuesByParam}
        />
        <ParameterCard
          label="VCO2 Level"
          paramId="vco2Level"
          param={prettySettings.oscilators.vco2.level}
          ccValuesByParam={ccValuesByParam}
        />
        <ParameterCard
          label="VCO2 Pitch (cents)"
          paramId="vco2Pitch"
          param={prettySettings.oscilators.vco2.pitch}
          ccValuesByParam={ccValuesByParam}
        />
        <ParameterCard
          label="VCO2 Octave"
          paramId="vco2Octave"
          param={prettySettings.oscilators.vco2.octave}
          ccValuesByParam={ccValuesByParam}
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
          paramId="filterCutoff"
          param={prettySettings.filter.cutoff}
          ccValuesByParam={ccValuesByParam}
        />
        <ParameterCard
          label="Resonance"
          paramId="filterResonance"
          param={prettySettings.filter.resonance}
          ccValuesByParam={ccValuesByParam}
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
          paramId="envelopeType"
          param={prettySettings.envelope.type}
          ccValuesByParam={ccValuesByParam}
        />
        <ParameterCard
          label="EG Attack"
          paramId="envelopeAttack"
          param={prettySettings.envelope.attack}
          ccValuesByParam={ccValuesByParam}
        />
        <ParameterCard
          label="EG Decay"
          paramId="envelopeDecay"
          param={prettySettings.envelope.decay}
          ccValuesByParam={ccValuesByParam}
        />
        <ParameterCard
          label="EG Intensity"
          paramId="envelopeIntensity"
          param={prettySettings.envelope.intensity}
          ccValuesByParam={ccValuesByParam}
        />
        <ParameterCard
          label="EG Target"
          paramId="envelopeTarget"
          param={prettySettings.envelope.target}
          ccValuesByParam={ccValuesByParam}
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
          paramId="lfoType"
          param={prettySettings.lfo.type}
          ccValuesByParam={ccValuesByParam}
        />
        <ParameterCard
          label="LFO Mode"
          paramId="lfoMode"
          param={prettySettings.lfo.mode}
          ccValuesByParam={ccValuesByParam}
        />
        <ParameterCard
          label="LFO Rate"
          paramId="lfoRate"
          param={prettySettings.lfo.rate}
          ccValuesByParam={ccValuesByParam}
        />
        <ParameterCard
          label="LFO Intensity"
          paramId="lfoIntensity"
          param={prettySettings.lfo.intensity}
          ccValuesByParam={ccValuesByParam}
        />
        <ParameterCard
          label="LFO Target"
          paramId="lfoTarget"
          param={prettySettings.lfo.target}
          ccValuesByParam={ccValuesByParam}
        />
      </div>
    </div>
  );
};
