"use client";

import { AlertCircle, Download, Pause, Play, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";
import {
  runDCAnalysis,
  runTransientAnalysis,
  validateCircuit,
} from "../lib/analyzer";

/**
 * SimulationPanel Component
 * Features:
 * - DC, AC, and Transient analysis
 * - Real-time results display
 * - Waveform export
 * - Error reporting
 */
export default function SimulationPanel({
  components,
  connections,
  isRunning,
  onPlay,
  onPause,
  onStop,
}) {
  const [analysisType, setAnalysisType] = useState("dc");
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const runAnalysis = useCallback(() => {
    setErrors([]);
    setWarnings([]);
    setIsSimulating(true);

    try {
      // Validate circuit first
      const validation = validateCircuit(components, connections);

      if (validation.warnings.length > 0) {
        setWarnings(validation.warnings);
      }

      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsSimulating(false);
        return;
      }

      let analysisResults;

      if (analysisType === "dc") {
        analysisResults = runDCAnalysis(components, connections);
      } else if (analysisType === "transient") {
        analysisResults = runTransientAnalysis(
          components,
          connections,
          1,
          0.001,
        );
      } else if (analysisType === "ac") {
        analysisResults = { success: true, message: "AC analysis coming soon" };
      }

      if (analysisResults.success) {
        setResults(analysisResults);
      } else {
        setErrors([analysisResults.error || "Analysis failed"]);
      }
    } catch (error) {
      setErrors([error.message || "Unknown error during analysis"]);
    } finally {
      setIsSimulating(false);
    }
  }, [components, connections, analysisType]);

  const exportResults = () => {
    if (!results) return;

    const exportData = {
      analysisType,
      timestamp: new Date().toISOString(),
      results,
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `simulation-${Date.now()}.json`;
    a.click();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#111827",
        borderTop: "1px solid #374151",
      }}
    >
      {/* Analysis Control */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          padding: "12px",
          borderBottom: "1px solid #374151",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Analysis Type Selection */}
        <div style={{ display: "flex", gap: "8px" }}>
          {["dc", "transient", "ac"].map((type) => (
            <button
              key={type}
              onClick={() => setAnalysisType(type)}
              style={{
                padding: "6px 12px",
                backgroundColor: analysisType === type ? "#3b82f6" : "#1e293b",
                border: `1px solid ${analysisType === type ? "#2563eb" : "#374151"}`,
                borderRadius: "4px",
                color: analysisType === type ? "#ffffff" : "#cbd5e1",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "500",
                transition: "all 0.2s",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => {
                if (analysisType !== type) {
                  e.target.style.backgroundColor = "#334155";
                }
              }}
              onMouseLeave={(e) => {
                if (analysisType !== type) {
                  e.target.style.backgroundColor = "#1e293b";
                }
              }}
            >
              {type === "dc" && "DC Analysis"}
              {type === "transient" && "Transient"}
              {type === "ac" && "AC Analysis"}
            </button>
          ))}
        </div>

        {/* Run/Export Buttons */}
        <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
          <button
            onClick={runAnalysis}
            disabled={isSimulating}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              backgroundColor: isSimulating ? "#1e293b" : "#10b981",
              border: "none",
              borderRadius: "4px",
              color: "#ffffff",
              cursor: isSimulating ? "not-allowed" : "pointer",
              fontSize: "12px",
              fontWeight: "500",
              opacity: isSimulating ? 0.6 : 1,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!isSimulating) {
                e.target.style.backgroundColor = "#059669";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSimulating) {
                e.target.style.backgroundColor = "#10b981";
              }
            }}
          >
            <Play size={14} />
            Run
          </button>

          <button
            onClick={exportResults}
            disabled={!results}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              backgroundColor: results ? "#8b5cf6" : "#1e293b",
              border: "none",
              borderRadius: "4px",
              color: "#ffffff",
              cursor: results ? "pointer" : "not-allowed",
              fontSize: "12px",
              fontWeight: "500",
              opacity: results ? 1 : 0.5,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (results) {
                e.target.style.backgroundColor = "#7c3aed";
              }
            }}
            onMouseLeave={(e) => {
              if (results) {
                e.target.style.backgroundColor = "#8b5cf6";
              }
            }}
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* Results Area */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "12px",
        }}
      >
        {/* Errors */}
        {errors.length > 0 && (
          <div
            style={{
              marginBottom: "12px",
              padding: "12px",
              backgroundColor: "#7f1d1d",
              border: "1px solid #991b1b",
              borderRadius: "4px",
            }}
          >
            <div
              style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}
            >
              <AlertCircle
                size={16}
                style={{ color: "#fca5a5", marginTop: "2px" }}
              />
              <div>
                <h4
                  style={{
                    margin: "0 0 6px 0",
                    color: "#fca5a5",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  Errors
                </h4>
                {errors.map((error, idx) => (
                  <p
                    key={idx}
                    style={{
                      margin: "4px 0",
                      color: "#fecaca",
                      fontSize: "11px",
                    }}
                  >
                    • {error}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div
            style={{
              marginBottom: "12px",
              padding: "12px",
              backgroundColor: "#78350f",
              border: "1px solid #92400e",
              borderRadius: "4px",
            }}
          >
            <div
              style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}
            >
              <AlertCircle
                size={16}
                style={{ color: "#fbbf24", marginTop: "2px" }}
              />
              <div>
                <h4
                  style={{
                    margin: "0 0 6px 0",
                    color: "#fbbf24",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  Warnings
                </h4>
                {warnings.map((warning, idx) => (
                  <p
                    key={idx}
                    style={{
                      margin: "4px 0",
                      color: "#fcd34d",
                      fontSize: "11px",
                    }}
                  >
                    • {warning}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "4px",
            }}
          >
            <h3
              style={{
                margin: "0 0 12px 0",
                color: "#e2e8f0",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              Analysis Results
            </h3>

            {analysisType === "dc" && results.voltages && (
              <div>
                <h4
                  style={{
                    margin: "0 0 8px 0",
                    color: "#cbd5e1",
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                >
                  Node Voltages
                </h4>
                <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                  {Object.entries(results.voltages || {})
                    .slice(0, 10)
                    .map(([node, voltage]) => (
                      <div
                        key={node}
                        style={{ margin: "4px 0", fontFamily: "monospace" }}
                      >
                        {node}:{" "}
                        <span style={{ color: "#60a5fa" }}>
                          {voltage.toFixed(3)}V
                        </span>
                      </div>
                    ))}
                  {Object.entries(results.voltages || {}).length > 10 && (
                    <div style={{ margin: "4px 0", color: "#6b7280" }}>
                      ... and{" "}
                      {Object.entries(results.voltages || {}).length - 10} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {analysisType === "transient" && results.results && (
              <div>
                <h4
                  style={{
                    margin: "0 0 8px 0",
                    color: "#cbd5e1",
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                >
                  Transient Analysis
                </h4>
                <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                  <div>
                    Points:{" "}
                    <span style={{ color: "#60a5fa" }}>
                      {results.results.length}
                    </span>
                  </div>
                  <div>
                    Duration:{" "}
                    <span style={{ color: "#60a5fa" }}>
                      {results.duration}s
                    </span>
                  </div>
                  <div>
                    Step:{" "}
                    <span style={{ color: "#60a5fa" }}>{results.step}s</span>
                  </div>
                </div>
              </div>
            )}

            <p
              style={{
                margin: "12px 0 0 0",
                fontSize: "11px",
                color: "#6b7280",
              }}
            >
              ✓ {results.message || "Analysis completed successfully"}
            </p>
          </div>
        )}

        {!results && !errors.length && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#6b7280",
              fontSize: "12px",
            }}
          >
            <Zap size={32} style={{ marginBottom: "12px", opacity: 0.3 }} />
            <p>Run analysis to see results</p>
          </div>
        )}
      </div>
    </div>
  );
}

const Zap = ({ size, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    {...style}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
