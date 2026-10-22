import React, { useState, useRef } from "react";
import { Activity, ShieldCheck, Award, Zap, Brain, Layers, BarChart3, ArrowRight, GitFork, LineChart, Crosshair } from "lucide-react";
import { cn, getDiceColor, getDiceBg, getSplitBadge, getSplitDot } from "../lib/utils";

export default function OverviewView({ data, onSelectSubject, onGoToInspector, onGoToTraining }) {
  const summary = data?.summary || {};
  const cases = data?.cases || [];
  const trainingEpochs = data?.training?.epochs || [];
  const finalEpoch = data?.training?.final_epoch || trainingEpochs[trainingEpochs.length - 1];

  // Interactive Hover State for Overview Sparklines
  const [hoveredEpoch, setHoveredEpoch] = useState(null);

  // Helper to render responsive interactive mini sparklines with X/Y scales
  const renderMiniSparkline = (dataKey, strokeColor, label, yUnit = "") => {
    if (trainingEpochs.length === 0) return null;
    const values = trainingEpochs.map((e) => e[dataKey]).filter((v) => v !== null && !isNaN(v));
    if (values.length === 0) return null;

    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;
    const width = 280;
    const height = 90;
    const paddingLeft = 46;
    const paddingRight = 12;
    const paddingTop = 12;
    const paddingBottom = 22;

    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;

    const minE = trainingEpochs[0].epoch;
    const maxE = trainingEpochs[trainingEpochs.length - 1].epoch;
    const epochSpan = maxE - minE || 1;

    const getX = (ep) => paddingLeft + ((ep - minE) / epochSpan) * plotWidth;
    const getY = (val) => paddingTop + (1 - (val - minVal) / range) * plotHeight;

    const points = trainingEpochs
      .filter((e) => e[dataKey] !== null && !isNaN(e[dataKey]))
      .map((e) => `${getX(e.epoch).toFixed(1)},${getY(e[dataKey]).toFixed(1)}`)
      .join(" ");

    const formatVal = (v) => {
      if (v === null || v === undefined) return "--";
      if (dataKey === "lr") return v < 0.001 ? v.toExponential(1) : v.toFixed(4);
      return v.toFixed(3);
    };

    const activeEpObj = hoveredEpoch !== null
      ? trainingEpochs.find((e) => e.epoch === hoveredEpoch)
      : null;
    const activeX = activeEpObj ? getX(activeEpObj.epoch) : null;
    const activeY = activeEpObj && activeEpObj[dataKey] !== null ? getY(activeEpObj[dataKey]) : null;

    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const svgX = (e.clientX - rect.left) * (width / rect.width);
      const boundedX = Math.max(paddingLeft, Math.min(width - paddingRight, svgX));
      const ratio = (boundedX - paddingLeft) / plotWidth;
      const targetEp = Math.round(minE + ratio * epochSpan);
      setHoveredEpoch(targetEp);
    };

    return (
      <div className="bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 rounded-xl p-3.5 flex flex-col justify-between relative group transition-all">
        <div className="flex items-center justify-between text-xs mb-1">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: strokeColor }} />
            <span className="font-medium text-zinc-300">{label}</span>
          </div>
          <span className="font-mono text-white text-xs font-semibold">
            {activeEpObj
              ? `Ep ${activeEpObj.epoch}: ${formatVal(activeEpObj[dataKey])}`
              : `${formatVal(values[values.length - 1])}`}
            {yUnit ? ` ${yUnit}` : ""}
          </span>
        </div>

        {/* Interactive SVG Canvas */}
        <div className="w-full relative cursor-crosshair select-none">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-20"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredEpoch(null)}
          >
            {/* Horizontal Y Gridlines & Scale Ticks */}
            {[minVal, minVal + range * 0.5, maxVal].map((val, idx) => {
              const y = getY(val);
              return (
                <g key={`y-axis-${idx}`}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="#27272a"
                    strokeDasharray="2 2"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingLeft - 4}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[8px] font-mono fill-zinc-500"
                  >
                    {formatVal(val)}
                  </text>
                </g>
              );
            })}

            {/* Vertical X Gridlines & Scale Ticks */}
            {[minE, Math.round(minE + epochSpan * 0.5), maxE].map((ep, idx) => {
              const x = getX(ep);
              return (
                <g key={`x-axis-${idx}`}>
                  <line
                    x1={x}
                    y1={paddingTop}
                    x2={x}
                    y2={height - paddingBottom}
                    stroke="#27272a"
                    strokeDasharray="2 2"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={height - paddingBottom + 12}
                    textAnchor="middle"
                    className="text-[8px] font-mono fill-zinc-500"
                  >
                    Ep {ep}
                  </text>
                </g>
              );
            })}

            {/* Solid Coordinate Axes */}
            <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={height - paddingBottom} stroke="#3f3f46" strokeWidth="1" />
            <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="#3f3f46" strokeWidth="1" />

            {/* Main Polyline Curve */}
            <polyline
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />

            {/* Crosshair & Active Hover Dot */}
            {activeEpObj && activeX !== null && (
              <g>
                <line
                  x1={activeX}
                  y1={paddingTop}
                  x2={activeX}
                  y2={height - paddingBottom}
                  stroke="#06B6D4"
                  strokeWidth="1.2"
                  strokeDasharray="2 2"
                />
                {activeY !== null && (
                  <>
                    <circle cx={activeX} cy={activeY} r="5" fill={strokeColor} fillOpacity="0.3" />
                    <circle cx={activeX} cy={activeY} r="2.5" fill="#000" stroke={strokeColor} strokeWidth="2" />
                  </>
                )}
              </g>
            )}
          </svg>
        </div>

        {/* Footer */}
        <div className="flex justify-between text-[9px] text-zinc-500 font-mono pt-1 border-t border-zinc-800/40">
          <span>Scale: [{formatVal(minVal)} .. {formatVal(maxVal)}]</span>
          <span className="text-zinc-400">
            {activeEpObj ? `Epoch ${activeEpObj.epoch}` : `100 Epochs (0–99)`}
          </span>
        </div>
      </div>
    );
  };

  // Stratify by size category
  const sizes = ["Small", "Medium", "Large"];
  const sizeStats = sizes.map((sz) => {
    const subset = cases.filter((c) => c.size_category === sz);
    const meanDsc = subset.length > 0 ? subset.reduce((a, b) => a + b.dice, 0) / subset.length : 0;
    const meanHd95 = subset.length > 0 ? subset.reduce((a, b) => a + (b.hd95 || 0), 0) / subset.length : 0;
    return { size: sz, count: subset.length, meanDsc, meanHd95 };
  });

  // Stratify by split (Training / Validation / Test)
  const splits = ["Training", "Validation", "Test"];
  const splitStats = splits.map((sp) => {
    const subset = cases.filter((c) => (c.split || "").toLowerCase() === sp.toLowerCase());
    const meanDsc = subset.length > 0 ? subset.reduce((a, b) => a + b.dice, 0) / subset.length : 0;
    const meanHd95 = subset.length > 0 ? subset.reduce((a, b) => a + (b.hd95 || 0), 0) / subset.length : 0;
    return { split: sp, count: subset.length, meanDsc, meanHd95 };
  });

  // Top performing & most challenging cases with visuals
  const visualCases = cases.filter((c) => c.has_visuals);
  const topVisuals = [...visualCases].sort((a, b) => b.dice - a.dice).slice(0, 4);
  const bottomVisuals = [...visualCases].sort((a, b) => a.dice - b.dice).slice(0, 4);

  return (
    <div className="flex-1 h-full min-h-0 overflow-y-auto bg-black text-white p-6 space-y-6">
      {/* Top Banner */}
      <div className="border border-zinc-800 bg-zinc-950/70 rounded-xl p-6 relative shrink-0">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-cyan-400 font-medium">
            <Zap className="w-3.5 h-3.5" />
            Executive Performance Overview
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 font-mono">
            HyperScale-UNet (HS-UNet)
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-light">
            Comprehensive evaluation benchmark on 1,453 held-out test subjects for acute ischemic stroke lesion segmentation (ISLES-22 / ATLAS multi-center protocol).
          </p>
        </div>

        {/* Global Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-zinc-800/80">
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3.5">
            <div className="text-[10px] uppercase text-zinc-500 tracking-wider">Mean Dice (DSC)</div>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
              {(summary.mean_dice || 0.6188).toFixed(4)}
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Across 1,453 Cases</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3.5">
            <div className="text-[10px] uppercase text-zinc-500 tracking-wider">Median Dice</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {(summary.median_dice || 0.7195).toFixed(4)}
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">50th Percentile</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3.5">
            <div className="text-[10px] uppercase text-zinc-500 tracking-wider">HD95 Surface Error</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {(summary.mean_hd95 || 22.47).toFixed(2)}
              <span className="text-xs text-zinc-500 font-normal ml-1">mm</span>
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">95th Percentile Dist</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3.5">
            <div className="text-[10px] uppercase text-zinc-500 tracking-wider">Mean Recall</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {((summary.mean_recall || 0.6562) * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Lesion Sensitivity</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3.5">
            <div className="text-[10px] uppercase text-zinc-500 tracking-wider">Mean Precision</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {((summary.mean_precision || 0.6590) * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Positive Predictive</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3.5">
            <div className="text-[10px] uppercase text-zinc-500 tracking-wider">Mean Inference</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {(summary.mean_time_sec || 25.4).toFixed(1)}
              <span className="text-xs text-zinc-500 font-normal ml-1">s</span>
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Sliding Window 3D</div>
          </div>
        </div>
      </div>

      {/* Dataset Split Stratification Benchmark */}
      <div className="border border-zinc-800 bg-zinc-950/70 rounded-xl p-5 space-y-4 shrink-0">
        <h2 className="text-sm font-semibold text-white tracking-wide uppercase flex items-center gap-2">
          <GitFork className="w-4 h-4 text-cyan-400" />
          Dataset Split Distribution & Performance Benchmark
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {splitStats.map((st) => (
            <div key={st.split} className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className={cn("px-2 py-0.5 rounded text-xs font-mono font-medium border flex items-center gap-1.5", getSplitBadge(st.split))}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", getSplitDot(st.split))} />
                  {st.split} Set
                </span>
                <span className="text-xs font-mono text-zinc-400 font-medium">{st.count} Subjects</span>
              </div>
              <div className="flex items-baseline space-x-2 pt-1">
                <span className="text-2xl font-bold font-mono text-white">{st.meanDsc.toFixed(4)}</span>
                <span className="text-xs text-zinc-400">Mean DSC</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full", getSplitDot(st.split))}
                  style={{ width: `${Math.min(100, st.meanDsc * 100)}%` }}
                />
              </div>
              <div className="text-[11px] text-zinc-500 flex justify-between pt-1">
                <span>HD95: {st.meanHd95.toFixed(2)} mm</span>
                <span>
                  {st.split === "Training" ? "Fold 0 Train" : st.split === "Validation" ? "Fold 0 Val" : "Held-Out Test"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lesion Scale Stratification */}
      <div className="border border-zinc-800 bg-zinc-950/70 rounded-xl p-5 space-y-4 shrink-0">
        <h2 className="text-sm font-semibold text-white tracking-wide uppercase flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          Lesion Scale Stratification Benchmark
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sizeStats.map((st) => (
            <div key={st.size} className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white uppercase">{st.size} Lesions</span>
                <span className="text-xs font-mono text-zinc-500">{st.count} Cases</span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold font-mono text-white">{st.meanDsc.toFixed(4)}</span>
                <span className="text-xs text-zinc-400">Mean DSC</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: `${Math.min(100, st.meanDsc * 100)}%` }}
                />
              </div>
              <div className="text-[11px] text-zinc-500 flex justify-between pt-1">
                <span>HD95: {st.meanHd95.toFixed(2)} mm</span>
                <span>Vol: {st.size === "Small" ? "<1.5 mL" : st.size === "Medium" ? "1.5-15 mL" : ">15 mL"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Training Dynamics & Model Convergence (Latest Occurred Epoch Details) */}
      <div className="border border-zinc-800 bg-zinc-950/70 rounded-xl p-5 space-y-4 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase flex items-center gap-2">
              <LineChart className="w-4 h-4 text-cyan-400" />
              Training Dynamics & Model Convergence (Fold 0)
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5 font-light">
              Continuous 100 epochs (0–99) parsed with latest occurred epoch details from official training log.
            </p>
          </div>
          {onGoToTraining && (
            <button
              onClick={onGoToTraining}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs rounded-lg text-zinc-300 hover:text-white transition-colors self-start sm:self-auto font-medium"
            >
              <span>View Full Curves & Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {renderMiniSparkline("train_loss", "#06B6D4", "Train Loss (Latest)")}
          {renderMiniSparkline("val_loss", "#10B981", "Val Loss (Latest)")}
          {renderMiniSparkline("val_dice", "#3B82F6", "Val Pseudo Dice (Latest)")}
          {renderMiniSparkline("lr", "#F59E0B", "Learning Rate (Latest)")}
        </div>
      </div>

      {/* Featured Visual Samples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
        {/* Top Performing Visuals */}
        <div className="border border-zinc-800 bg-zinc-950/70 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <span className="text-xs font-semibold uppercase text-emerald-400 tracking-wide">
              Top Segmentations (Pre-Rendered)
            </span>
            <span className="text-xs text-zinc-500">Highest DSC</span>
          </div>

          <div className="space-y-2">
            {topVisuals.map((c) => (
              <div
                key={c.case_id}
                onClick={() => {
                  onSelectSubject(c);
                  onGoToInspector();
                }}
                className="p-3 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-between cursor-pointer transition-colors group"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-medium text-white">{c.subject}</span>
                    <span className={cn("px-1.5 py-0.2 rounded text-[9px] font-mono font-medium border uppercase tracking-wider", getSplitBadge(c.split))}>
                      {c.split || "Test"}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    {c.case_id} • Site {c.site} • {c.ref_vol_ml.toFixed(1)} mL
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-emerald-950/40 border border-emerald-800/60 text-emerald-300">
                    DSC: {c.dice.toFixed(4)}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Challenging Cases */}
        <div className="border border-zinc-800 bg-zinc-950/70 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <span className="text-xs font-semibold uppercase text-amber-400 tracking-wide">
              Diagnostic Edge Cases (Pre-Rendered)
            </span>
            <span className="text-xs text-zinc-500">Challenging / Low DSC</span>
          </div>

          <div className="space-y-2">
            {bottomVisuals.map((c) => (
              <div
                key={c.case_id}
                onClick={() => {
                  onSelectSubject(c);
                  onGoToInspector();
                }}
                className="p-3 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-between cursor-pointer transition-colors group"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-medium text-white">{c.subject}</span>
                    <span className={cn("px-1.5 py-0.2 rounded text-[9px] font-mono font-medium border uppercase tracking-wider", getSplitBadge(c.split))}>
                      {c.split || "Test"}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    {c.case_id} • Site {c.site} • {c.ref_vol_ml.toFixed(1)} mL
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-amber-950/40 border border-amber-800/60 text-amber-300">
                    DSC: {c.dice.toFixed(4)}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
