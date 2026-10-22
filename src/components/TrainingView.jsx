import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  LineChart,
  Activity,
  Zap,
  CheckCircle2,
  TrendingUp,
  Maximize2,
  Minimize2,
  X,
  Layers,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Eye,
  Crosshair,
  Sparkles,
  LayoutGrid,
  Square
} from "lucide-react";
import { cn } from "../lib/utils";

export default function TrainingView({ trainingData }) {
  const [fullscreenImage, setFullscreenImage] = useState(false);
  const [expandedChart, setExpandedChart] = useState(null); // When set, opens full-size modal for that chart

  const epochs = trainingData?.epochs || [];
  const finalEpoch = trainingData?.final_epoch || epochs[epochs.length - 1];

  // Filters & Range State
  const [selectedCategory, setSelectedCategory] = useState("all"); // "all", "loss", "dice", "speed"
  const [selectedPreset, setSelectedPreset] = useState("all"); // "all", "warmup", "mid", "converge", "custom"
  const [minEpoch, setMinEpoch] = useState(0);
  const [maxEpoch, setMaxEpoch] = useState(epochs.length > 0 ? epochs[epochs.length - 1].epoch : 99);
  const [syncCrosshairs, setSyncCrosshairs] = useState(true);
  const [showPoints, setShowPoints] = useState(false);
  const [smoothed, setSmoothed] = useState(false);

  // Synchronized Hover State
  const [hoveredEpoch, setHoveredEpoch] = useState(null);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setExpandedChart(null);
        setFullscreenImage(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Calculate filtered epochs
  const filteredEpochs = useMemo(() => {
    if (!epochs.length) return [];
    return epochs.filter((e) => e.epoch >= minEpoch && e.epoch <= maxEpoch);
  }, [epochs, minEpoch, maxEpoch]);

  // Handle Preset changes
  const applyPreset = (preset) => {
    setSelectedPreset(preset);
    const maxE = epochs.length > 0 ? epochs[epochs.length - 1].epoch : 99;
    if (preset === "all") {
      setMinEpoch(0);
      setMaxEpoch(maxE);
    } else if (preset === "warmup") {
      setMinEpoch(0);
      setMaxEpoch(Math.min(25, maxE));
    } else if (preset === "mid") {
      setMinEpoch(20);
      setMaxEpoch(Math.min(65, maxE));
    } else if (preset === "converge") {
      setMinEpoch(60);
      setMaxEpoch(maxE);
    }
  };

  // Helper for formatting values based on metric type
  const formatValue = (key, val) => {
    if (val === null || val === undefined || isNaN(val)) return "--";
    if (key === "lr") {
      return val < 0.001 ? val.toExponential(2) : val.toFixed(5);
    }
    if (key === "epoch_time") {
      return `${val.toFixed(1)}s`;
    }
    if (key.includes("dice")) {
      return val.toFixed(4);
    }
    return val > 0 ? `+${val.toFixed(4)}` : val.toFixed(4);
  };

  // Currently active epoch details (either hovered or latest)
  const activeEpochData = useMemo(() => {
    if (hoveredEpoch !== null) {
      const found = epochs.find((e) => e.epoch === hoveredEpoch);
      if (found) return { data: found, isHovered: true };
    }
    return { data: finalEpoch, isHovered: false };
  }, [hoveredEpoch, epochs, finalEpoch]);

  // Reusable SVG Chart Renderer (works both inline and in modal)
  const SVGPlot = ({
    dataKey,
    strokeColor,
    fillColor,
    label,
    yUnit = "",
    secondaryKey = null,
    secondaryColor = null,
    secondaryLabel = null,
    isModal = false
  }) => {
    const svgRef = useRef(null);
    const [localHover, setLocalHover] = useState(null);

    // Extract primary values
    const rawValues = filteredEpochs.map((e) => e[dataKey]).filter((v) => v !== null && !isNaN(v));
    const secValues = secondaryKey
      ? filteredEpochs.map((e) => e[secondaryKey]).filter((v) => v !== null && !isNaN(v))
      : [];

    const allValues = [...rawValues, ...secValues];
    if (allValues.length === 0) return null;

    // Optional moving average smoothing
    const getValuesToRender = (key) => {
      if (!smoothed) return filteredEpochs.map((e) => ({ ep: e.epoch, val: e[key] }));
      return filteredEpochs.map((e, idx, arr) => {
        const windowSize = 3;
        const start = Math.max(0, idx - windowSize + 1);
        const subset = arr.slice(start, idx + 1).map((item) => item[key]).filter((v) => v !== null && !isNaN(v));
        const avg = subset.reduce((a, b) => a + b, 0) / (subset.length || 1);
        return { ep: e.epoch, val: avg };
      });
    };

    const renderData = getValuesToRender(dataKey);
    const renderSecData = secondaryKey ? getValuesToRender(secondaryKey) : [];

    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);
    const yMargin = (maxVal - minVal) * 0.08 || 0.01;
    const yDomainMin = minVal - yMargin;
    const yDomainMax = maxVal + yMargin;
    const yRange = yDomainMax - yDomainMin || 1;

    // SVG Layout Dimensions: high-res viewBox for panoramic full-width 75vh cards and modal
    const width = isModal ? 1200 : 1000;
    const height = isModal ? 520 : 440;
    const paddingLeft = isModal ? 85 : 75;
    const paddingRight = 30;
    const paddingTop = 30;
    const paddingBottom = 48;

    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;

    const minE = filteredEpochs[0].epoch;
    const maxE = filteredEpochs[filteredEpochs.length - 1].epoch;
    const epochSpan = maxE - minE || 1;

    // Coordinate mapping helpers
    const getX = (epochNum) => paddingLeft + ((epochNum - minE) / epochSpan) * plotWidth;
    const getY = (val) => paddingTop + (1 - (val - yDomainMin) / yRange) * plotHeight;

    // Primary polyline points
    const points = renderData
      .filter((d) => d.val !== null && !isNaN(d.val))
      .map((d) => `${getX(d.ep).toFixed(1)},${getY(d.val).toFixed(1)}`)
      .join(" ");

    // Secondary polyline points
    const secPoints = renderSecData
      .filter((d) => d.val !== null && !isNaN(d.val))
      .map((d) => `${getX(d.ep).toFixed(1)},${getY(d.val).toFixed(1)}`)
      .join(" ");

    // Area fill path
    const validDataPoints = renderData.filter((d) => d.val !== null && !isNaN(d.val));
    const areaPoints = validDataPoints.length > 0
      ? `${getX(validDataPoints[0].ep)},${height - paddingBottom} ` +
        points +
        ` ${getX(validDataPoints[validDataPoints.length - 1].ep)},${height - paddingBottom}`
      : "";

    // Generate 6 Y-Axis Scale Ticks
    const yTickCount = isModal ? 7 : 6;
    const yTicks = Array.from({ length: yTickCount }, (_, i) => {
      const val = yDomainMin + (i / (yTickCount - 1)) * yRange;
      const y = getY(val);
      return { val, y };
    });

    // Generate X-Axis Scale Ticks (comfortably spaced for wide 1-graph-per-row layout)
    const xTickCount = isModal ? 11 : 9;
    const xTicks = Array.from({ length: xTickCount }, (_, i) => {
      const ep = Math.round(minE + (i / (xTickCount - 1)) * epochSpan);
      const x = getX(ep);
      return { ep, x };
    });

    // Effective active epoch
    const currentHoveredEpoch = syncCrosshairs ? hoveredEpoch : localHover;
    const activeHoverEpochObj = currentHoveredEpoch !== null
      ? filteredEpochs.find((e) => e.epoch === currentHoveredEpoch)
      : null;

    const activeHoverX = activeHoverEpochObj ? getX(activeHoverEpochObj.epoch) : null;
    const activeHoverY = activeHoverEpochObj && activeHoverEpochObj[dataKey] !== null
      ? getY(activeHoverEpochObj[dataKey])
      : null;

    // Mouse event handlers for interactive scrubber
    const handleMouseMove = (e) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const scaleX = width / rect.width;
      const svgX = clientX * scaleX;

      const boundedX = Math.max(paddingLeft, Math.min(width - paddingRight, svgX));
      const ratio = (boundedX - paddingLeft) / plotWidth;
      const targetEp = Math.round(minE + ratio * epochSpan);

      let closest = filteredEpochs[0];
      let minDiff = Infinity;
      for (const epObj of filteredEpochs) {
        const diff = Math.abs(epObj.epoch - targetEp);
        if (diff < minDiff) {
          minDiff = diff;
          closest = epObj;
        }
      }

      if (syncCrosshairs) {
        setHoveredEpoch(closest.epoch);
      } else {
        setLocalHover(closest.epoch);
      }
    };

    const handleMouseLeave = () => {
      if (syncCrosshairs) {
        setHoveredEpoch(null);
      } else {
        setLocalHover(null);
      }
    };

    const gradientId = `grad-${dataKey}-${isModal ? "modal" : "inline"}-${minEpoch}-${maxEpoch}`;

    return (
      <div className="relative w-full h-full flex-1 min-h-0 select-none cursor-crosshair">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full object-contain"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fillColor || strokeColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={fillColor || strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Grid: Horizontal Y-Ticks & Guidelines */}
          {yTicks.map((tick, idx) => (
            <g key={`y-grid-${idx}`}>
              <line
                x1={paddingLeft}
                y1={tick.y}
                x2={width - paddingRight}
                y2={tick.y}
                stroke="#27272a"
                strokeDasharray="4 4"
                strokeWidth="1"
                strokeOpacity="0.8"
              />
              <text
                x={paddingLeft - 10}
                y={tick.y + 4}
                textAnchor="end"
                className="text-[11px] font-mono fill-zinc-400 select-none font-medium"
              >
                {formatValue(dataKey, tick.val)}
              </text>
            </g>
          ))}

          {/* Background Grid: Vertical X-Ticks & Guidelines */}
          {xTicks.map((tick, idx) => (
            <g key={`x-grid-${idx}`}>
              <line
                x1={tick.x}
                y1={paddingTop}
                x2={tick.x}
                y2={height - paddingBottom}
                stroke="#27272a"
                strokeDasharray="3 3"
                strokeWidth="1"
                strokeOpacity="0.6"
              />
              <text
                x={tick.x}
                y={height - paddingBottom + 22}
                textAnchor="middle"
                className="text-[11px] font-mono fill-zinc-400 select-none font-medium"
              >
                Ep {tick.ep}
              </text>
            </g>
          ))}

          {/* Solid Coordinate Axes */}
          <line
            x1={paddingLeft}
            y1={paddingTop}
            x2={paddingLeft}
            y2={height - paddingBottom}
            stroke="#52525b"
            strokeWidth="1.5"
          />
          <line
            x1={paddingLeft}
            y1={height - paddingBottom}
            x2={width - paddingRight}
            y2={height - paddingBottom}
            stroke="#52525b"
            strokeWidth="1.5"
          />

          {/* Area Fill */}
          {areaPoints && (
            <polygon fill={`url(#${gradientId})`} points={areaPoints} className="transition-opacity" />
          )}

          {/* Secondary Series Polyline */}
          {secondaryKey && secPoints && (
            <polyline
              fill="none"
              stroke={secondaryColor || "#A855F7"}
              strokeWidth={isModal ? "2.5" : "2"}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="5 3"
              points={secPoints}
            />
          )}

          {/* Primary Series Polyline */}
          <polyline
            fill="none"
            stroke={strokeColor}
            strokeWidth={isModal ? "3.5" : "3"}
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Discrete Data Points */}
          {showPoints &&
            renderData
              .filter((d) => d.val !== null && !isNaN(d.val))
              .map((d, i) => (
                <circle
                  key={`point-${i}`}
                  cx={getX(d.ep)}
                  cy={getY(d.val)}
                  r={isModal ? "3" : "2.5"}
                  fill={strokeColor}
                  opacity="0.85"
                />
              ))}

          {/* Interactive Crosshair & Hover Coordinate Cursor */}
          {activeHoverEpochObj && activeHoverX !== null && (
            <g className="transition-opacity">
              {/* Vertical Scrubber Line */}
              <line
                x1={activeHoverX}
                y1={paddingTop}
                x2={activeHoverX}
                y2={height - paddingBottom}
                stroke="#06B6D4"
                strokeWidth={isModal ? "2" : "1.5"}
                strokeDasharray="4 3"
              />

              {/* X-Axis Highlight Marker */}
              <rect
                x={activeHoverX - 26}
                y={height - paddingBottom + 5}
                width="52"
                height="20"
                rx="4"
                fill="#09090b"
                stroke="#06B6D4"
                strokeWidth="1.5"
              />
              <text
                x={activeHoverX}
                y={height - paddingBottom + 19}
                textAnchor="middle"
                className="text-[11px] font-mono fill-cyan-300 font-bold"
              >
                Ep {activeHoverEpochObj.epoch}
              </text>

              {/* Pulsing Active Coordinate Point */}
              {activeHoverY !== null && (
                <g>
                  <circle
                    cx={activeHoverX}
                    cy={activeHoverY}
                    r={isModal ? "9" : "8"}
                    fill={strokeColor}
                    fillOpacity="0.35"
                    className="animate-pulse"
                  />
                  <circle
                    cx={activeHoverX}
                    cy={activeHoverY}
                    r={isModal ? "5" : "4.5"}
                    fill="#09090b"
                    stroke={strokeColor}
                    strokeWidth="3"
                  />
                </g>
              )}
            </g>
          )}
        </svg>

        {/* Floating Tooltip Pill: Positioned cleanly inside plot without vertical clipping */}
        {activeHoverEpochObj && activeHoverX !== null && (
          <div
            className="absolute z-30 pointer-events-none transition-all duration-75"
            style={{
              left: `${Math.min(
                80,
                Math.max(18, (activeHoverX / width) * 100)
              )}%`,
              top: isModal ? "24px" : "14px",
              transform: "translateX(-50%)"
            }}
          >
            <div className="bg-zinc-950/95 border border-cyan-500/50 shadow-2xl backdrop-blur-md rounded-xl p-3 text-xs font-mono space-y-1.5 text-white min-w-[200px]">
              <div className="flex items-center justify-between gap-3 pb-1.5 border-b border-zinc-800 text-cyan-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  Epoch {activeHoverEpochObj.epoch}
                </span>
                <span className="text-[10px] text-zinc-500 font-normal">
                  {minE}–{maxE}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-zinc-400">{label}:</span>
                <span className="font-bold text-white">
                  {formatValue(dataKey, activeHoverEpochObj[dataKey])}
                  {yUnit ? ` ${yUnit}` : ""}
                </span>
              </div>
              {secondaryKey && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-purple-400">{secondaryLabel}:</span>
                  <span className="font-bold text-purple-200">
                    {formatValue(secondaryKey, activeHoverEpochObj[secondaryKey])}
                    {yUnit ? ` ${yUnit}` : ""}
                  </span>
                </div>
              )}
              {/* Delta vs Initial Epoch */}
              {filteredEpochs[0]?.[dataKey] !== undefined && (
                <div className="flex items-center justify-between gap-4 text-[10px] text-zinc-400 pt-1 border-t border-zinc-800/60">
                  <span>Δ vs Ep {minE}:</span>
                  <span
                    className={cn(
                      "font-semibold",
                      (activeHoverEpochObj[dataKey] - filteredEpochs[0][dataKey]) * (dataKey.includes("loss") ? -1 : 1) >= 0
                        ? "text-emerald-400"
                        : "text-rose-400"
                    )}
                  >
                    {(activeHoverEpochObj[dataKey] - filteredEpochs[0][dataKey]) > 0 ? "+" : ""}
                    {(activeHoverEpochObj[dataKey] - filteredEpochs[0][dataKey]).toFixed(4)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Card Container Component with min-h-[75vh] and Expand to Modal action
  const InteractiveChartCard = ({
    dataKey,
    strokeColor,
    fillColor,
    label,
    yUnit = "",
    secondaryKey = null,
    secondaryColor = null,
    secondaryLabel = null
  }) => {
    if (filteredEpochs.length === 0) {
      return (
        <div className="min-h-[75vh] bg-zinc-950/80 border border-zinc-800 rounded-2xl p-8 flex items-center justify-center text-xs text-zinc-500">
          No epoch data in current range ({minEpoch}–{maxEpoch}).
        </div>
      );
    }

    const rawValues = filteredEpochs.map((e) => e[dataKey]).filter((v) => v !== null && !isNaN(v));
    const secValues = secondaryKey
      ? filteredEpochs.map((e) => e[secondaryKey]).filter((v) => v !== null && !isNaN(v))
      : [];
    const allValues = [...rawValues, ...secValues];
    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);

    const minE = filteredEpochs[0].epoch;
    const maxE = filteredEpochs[filteredEpochs.length - 1].epoch;

    const currentHoveredEpoch = syncCrosshairs ? hoveredEpoch : null;
    const activeHoverEpochObj = currentHoveredEpoch !== null
      ? filteredEpochs.find((e) => e.epoch === currentHoveredEpoch)
      : null;

    const chartConfig = {
      dataKey,
      strokeColor,
      fillColor,
      label,
      yUnit,
      secondaryKey,
      secondaryColor,
      secondaryLabel
    };

    return (
      <div className="min-h-[75vh] bg-zinc-950/90 border border-zinc-800 hover:border-zinc-700/80 rounded-2xl p-5 md:p-6 transition-all flex flex-col justify-between relative group shadow-lg">
        {/* Card Header & Dynamic Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80 shrink-0">
          <div className="flex items-center space-x-2.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: strokeColor }} />
            <h3 className="text-sm md:text-base font-semibold text-white tracking-wide">{label}</h3>
            {secondaryLabel && (
              <span className="flex items-center space-x-1.5 text-xs text-zinc-400 font-mono ml-2 pl-2 border-l border-zinc-800">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: secondaryColor }} />
                <span>{secondaryLabel}</span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono self-start sm:self-auto">
            <span className="text-zinc-500 whitespace-nowrap">
              Min: <span className="text-zinc-300 font-semibold">{formatValue(dataKey, minVal)}</span>
            </span>
            <span className="text-zinc-700 hidden sm:inline">•</span>
            <span className="text-zinc-500 whitespace-nowrap">
              Max: <span className="text-zinc-300 font-semibold">{formatValue(dataKey, maxVal)}</span>
            </span>
            <span className="text-zinc-700 hidden sm:inline">•</span>
            <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-cyan-300 font-semibold whitespace-nowrap">
              {activeHoverEpochObj
                ? `Ep ${activeHoverEpochObj.epoch}: ${formatValue(dataKey, activeHoverEpochObj[dataKey])}`
                : `Latest: ${formatValue(dataKey, filteredEpochs[filteredEpochs.length - 1]?.[dataKey])}`}
              {yUnit ? ` ${yUnit}` : ""}
            </span>

            {/* Expand to Modal Button */}
            <button
              onClick={() => setExpandedChart(chartConfig)}
              className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs rounded-lg text-zinc-300 hover:text-white transition-all shadow-sm shrink-0 whitespace-nowrap"
              title="Expand in Fullscreen Modal"
            >
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Expand Modal</span>
            </button>
          </div>
        </div>

        {/* Spacious SVG Plot Area taking the bulk of the 75vh card */}
        <div className="flex-1 w-full min-h-[420px] flex items-center justify-center my-3 relative">
          <SVGPlot {...chartConfig} isModal={false} />
        </div>

        {/* Card Footer with Range & Status */}
        <div className="flex justify-between items-center text-xs text-zinc-500 font-mono pt-3 border-t border-zinc-800/80 shrink-0">
          <span>
            Epoch Range: <span className="text-zinc-300 font-medium">Epoch {minE}</span> to <span className="text-zinc-300 font-medium">Epoch {maxE}</span>
          </span>
          <span className="text-zinc-400">
            {activeHoverEpochObj ? (
              <span className="text-cyan-400 font-medium">Scrubbing: Epoch {activeHoverEpochObj.epoch}</span>
            ) : (
              <span>Hover over curve to scrub crosshair & metrics</span>
            )}
          </span>
          <span>
            Y-Scale: <span className="text-zinc-300 font-medium">[{formatValue(dataKey, minVal)} .. {formatValue(dataKey, maxVal)}]</span>
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 h-full min-h-0 overflow-y-auto bg-black text-white p-6 space-y-6">
      {/* Header & High-Level Summary */}
      <div className="border border-zinc-800 bg-zinc-950/70 rounded-xl p-5 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <LineChart className="w-5 h-5 text-cyan-400" />
              Training Dynamics & Loss Progression
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-light">
              HyperScale-UNet 3D Fullres • Fold 0 • SGD Nesterov Momentum • Cosine Annealing LR
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
              {epochs.length} Logged Epochs (0 to 99)
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-800/60 text-xs font-mono text-emerald-300">
              Converged
            </span>
          </div>
        </div>

        {/* Live Highlight Cards (Reflects hovered epoch or final convergence) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-zinc-800/80">
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase text-zinc-500 tracking-wider">
                {activeEpochData.isHovered ? `Train Loss (Ep ${activeEpochData.data.epoch})` : "Final Train Loss"}
              </div>
              {activeEpochData.isHovered && <Crosshair className="w-3 h-3 text-cyan-400" />}
            </div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {formatValue("train_loss", activeEpochData.data?.train_loss)}
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Dice + Cross-Entropy</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase text-zinc-500 tracking-wider">
                {activeEpochData.isHovered ? `Val Loss (Ep ${activeEpochData.data.epoch})` : "Final Val Loss"}
              </div>
              {activeEpochData.isHovered && <Crosshair className="w-3 h-3 text-emerald-400" />}
            </div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {formatValue("val_loss", activeEpochData.data?.val_loss)}
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Validation Set Target</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase text-zinc-500 tracking-wider">
                {activeEpochData.isHovered ? `Pseudo Dice (Ep ${activeEpochData.data.epoch})` : "Peak EMA Pseudo Dice"}
              </div>
              {activeEpochData.isHovered && <Crosshair className="w-3 h-3 text-purple-400" />}
            </div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
              {activeEpochData.isHovered
                ? formatValue("val_dice", activeEpochData.data?.val_dice)
                : formatValue("ema_dice", finalEpoch?.ema_dice ?? 0.7958)}
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">
              {activeEpochData.isHovered
                ? `EMA: ${formatValue("ema_dice", activeEpochData.data?.ema_dice)}`
                : "checkpoint_best.pth (0.8226 Peak)"}
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase text-zinc-500 tracking-wider">
                {activeEpochData.isHovered ? `LR (Ep ${activeEpochData.data.epoch})` : "Learning Rate"}
              </div>
              {activeEpochData.isHovered && <Crosshair className="w-3 h-3 text-amber-400" />}
            </div>
            <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">
              {formatValue("lr", activeEpochData.data?.lr)}
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Cosine Annealing Schedule</div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Filters Bar */}
      <div className="border border-zinc-800 bg-zinc-950/70 rounded-xl p-5 space-y-4">
        {/* Row 1: Categories, Layout Toggle & Presets */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5 mr-1">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              Category:
            </span>
            <div className="flex flex-wrap gap-1 bg-zinc-900/80 p-1 rounded-lg border border-zinc-800">
              {[
                { id: "all", label: "All Curves (6)" },
                { id: "loss", label: "Losses (2)" },
                { id: "dice", label: "Dice (2)" },
                { id: "speed", label: "LR & Timing (2)" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-2.5 py-1 rounded text-xs font-medium transition-all",
                    selectedCategory === cat.id
                      ? "bg-zinc-800 text-white shadow-sm border border-zinc-700 font-semibold"
                      : "text-zinc-400 hover:text-white"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Epoch Range Presets */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
              Presets:
            </span>
              <div className="flex flex-wrap gap-1 bg-zinc-900/80 p-1 rounded-lg border border-zinc-800">
                {[
                  { id: "all", label: "All (0–99)" },
                  { id: "warmup", label: "Warmup (0–25)" },
                  { id: "mid", label: "Mid (20–65)" },
                  { id: "converge", label: "Convergence (60–99)" }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p.id)}
                    className={cn(
                      "px-2.5 py-1 rounded text-xs font-mono transition-all",
                      selectedPreset === p.id
                        ? "bg-zinc-800 text-cyan-300 shadow-sm border border-zinc-700 font-semibold"
                        : "text-zinc-400 hover:text-white"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
        </div>

        {/* Row 2: Custom Epoch Sliders & Graph Display Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center pt-1">
          {/* Min Epoch Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-zinc-400">
              <span>Start Epoch:</span>
              <span className="text-white font-bold">Epoch {minEpoch}</span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.max(0, maxEpoch - 2)}
              value={minEpoch}
              onChange={(e) => {
                setMinEpoch(Number(e.target.value));
                setSelectedPreset("custom");
              }}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
          </div>

          {/* Max Epoch Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-zinc-400">
              <span>End Epoch:</span>
              <span className="text-white font-bold">Epoch {maxEpoch}</span>
            </div>
            <input
              type="range"
              min={Math.min(99, minEpoch + 2)}
              max={epochs.length > 0 ? epochs[epochs.length - 1].epoch : 99}
              value={maxEpoch}
              onChange={(e) => {
                setMaxEpoch(Number(e.target.value));
                setSelectedPreset("custom");
              }}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
          </div>

          {/* Sync Crosshair & Show Points Toggles */}
          <div className="flex items-center space-x-4 lg:col-span-2 justify-end">
            <label className="flex items-center space-x-2 text-xs text-zinc-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={syncCrosshairs}
                onChange={(e) => setSyncCrosshairs(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-zinc-900 border-zinc-700 accent-cyan-400"
              />
              <span className="flex items-center gap-1 font-mono">
                <Crosshair className="w-3 h-3 text-cyan-400" />
                Sync Scrubber
              </span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-zinc-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showPoints}
                onChange={(e) => setShowPoints(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-zinc-900 border-zinc-700 accent-cyan-400"
              />
              <span className="font-mono">Epoch Dots</span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-zinc-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={smoothed}
                onChange={(e) => setSmoothed(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-zinc-900 border-zinc-700 accent-purple-400"
              />
              <span className="font-mono">Smoothed</span>
            </label>

            <button
              onClick={() => applyPreset("all")}
              className="flex items-center space-x-1 px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-400 hover:text-white rounded transition-colors"
              title="Reset Zoom & Filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Curves Grid: Each card has minimum 75vh height */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-wider text-zinc-400 font-medium flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Interactive Training Curves (Min 75vh High • Expandable in Modal)
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            Showing {filteredEpochs.length} Epochs ({minEpoch}–{maxEpoch}) • Click "Expand Modal" on any chart
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 w-full">
          {(selectedCategory === "all" || selectedCategory === "loss") && (
            <>
              <InteractiveChartCard
                dataKey="train_loss"
                strokeColor="#06B6D4"
                fillColor="#06B6D4"
                label="Training Loss (Dice + CE Loss)"
              />
              <InteractiveChartCard
                dataKey="val_loss"
                strokeColor="#10B981"
                fillColor="#10B981"
                label="Validation Loss (Target Evaluation)"
              />
            </>
          )}

          {(selectedCategory === "all" || selectedCategory === "dice") && (
            <>
              <InteractiveChartCard
                dataKey="val_dice"
                secondaryKey="ema_dice"
                strokeColor="#3B82F6"
                secondaryColor="#A855F7"
                fillColor="#3B82F6"
                label="Validation Pseudo Dice (Raw)"
                secondaryLabel="EMA (Moving Average)"
              />
              <InteractiveChartCard
                dataKey="ema_dice"
                strokeColor="#8B5CF6"
                fillColor="#8B5CF6"
                label="Exponential Moving Average Pseudo Dice"
              />
            </>
          )}

          {(selectedCategory === "all" || selectedCategory === "speed") && (
            <>
              <InteractiveChartCard
                dataKey="lr"
                strokeColor="#F59E0B"
                fillColor="#F59E0B"
                label="Learning Rate Schedule (Cosine Annealing)"
              />
              <InteractiveChartCard
                dataKey="epoch_time"
                strokeColor="#EC4899"
                fillColor="#EC4899"
                label="Epoch Duration Consistency"
                yUnit="s"
              />
            </>
          )}
        </div>
      </div>

      {/* Main Training Graph from nnUNet */}
      <div className="border border-zinc-800 bg-zinc-950/70 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <div>
            <h3 className="text-sm font-semibold text-white">nnU-Net Official Training Progress Plot</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Generated from deduplicated latest occurred epoch records (fold_0/progress.png)
            </p>
          </div>
          <button
            onClick={() => setFullscreenImage(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs rounded text-zinc-300 hover:text-white transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Expand High-Res
          </button>
        </div>

        <div
          onClick={() => setFullscreenImage(true)}
          className="cursor-pointer bg-black rounded-lg border border-zinc-800/80 p-2 flex items-center justify-center hover:border-zinc-600 transition-all group overflow-hidden"
        >
          <img
            src="/data/training/progress.png"
            alt="Training Progress"
            className="w-full max-h-[480px] object-contain rounded"
          />
        </div>
      </div>

      {/* Fullscreen Interactive Curve Modal */}
      {expandedChart && (
        <div
          onClick={() => setExpandedChart(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-7xl w-full h-[90vh] bg-zinc-950 border border-zinc-700/80 rounded-2xl overflow-hidden shadow-2xl p-6 flex flex-col justify-between"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 shrink-0">
              <div className="flex items-center space-x-3">
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: expandedChart.strokeColor }} />
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    {expandedChart.label}
                    {expandedChart.secondaryLabel && (
                      <span className="text-xs text-zinc-400 font-mono ml-2 pl-2 border-l border-zinc-800">
                        Overlay: {expandedChart.secondaryLabel}
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-zinc-400 font-light mt-0.5">
                    Full High-Resolution View • Epochs {minEpoch} to {maxEpoch} • Interactive Crosshair Active
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-cyan-300 font-mono text-xs font-semibold">
                  {hoveredEpoch !== null
                    ? `Scrubbing: Epoch ${hoveredEpoch}`
                    : `Latest Epoch: ${filteredEpochs[filteredEpochs.length - 1]?.epoch}`}
                </span>
                <button
                  onClick={() => setExpandedChart(null)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg border border-zinc-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Close (Esc)</span>
                </button>
              </div>
            </div>

            {/* Modal Body: Spacious Ultra High-Resolution SVG Canvas */}
            <div className="flex-1 w-full min-h-0 flex items-center justify-center my-4 relative">
              <SVGPlot {...expandedChart} isModal={true} />
            </div>

            {/* Modal Footer: Statistical Breakdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-800 text-xs font-mono text-zinc-400 shrink-0">
              <div className="flex items-center space-x-4">
                <span>
                  Initial (Ep {minEpoch}):{" "}
                  <span className="text-white font-medium">
                    {formatValue(expandedChart.dataKey, filteredEpochs[0]?.[expandedChart.dataKey])}
                  </span>
                </span>
                <span>•</span>
                <span>
                  Final (Ep {maxEpoch}):{" "}
                  <span className="text-white font-medium">
                    {formatValue(expandedChart.dataKey, filteredEpochs[filteredEpochs.length - 1]?.[expandedChart.dataKey])}
                  </span>
                </span>
              </div>
              <div className="text-zinc-500">
                Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px]">Esc</kbd> or click outside to dismiss
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Fullscreen Progress Image */}
      {fullscreenImage && (
        <div
          onClick={() => setFullscreenImage(false)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-6xl w-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-4 flex flex-col"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="text-sm font-mono text-white">fold_0/progress.png • Complete Training Progress</span>
              <button
                onClick={() => setFullscreenImage(false)}
                className="text-xs px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-700 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close (Esc)</span>
              </button>
            </div>
            <div className="p-4 bg-black flex items-center justify-center">
              <img
                src="/data/training/progress.png"
                alt="Training Progress Full"
                className="max-h-[80vh] object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
