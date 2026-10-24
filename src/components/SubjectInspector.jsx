import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Layers,
  ZoomIn,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Play,
  Pause,
  RotateCcw,
  Target,
  Info,
  ShieldAlert,
  ArrowUpRight,
  Flame,
  Loader2,
  Eye,
  Compass,
  AlertCircle
} from "lucide-react";
import { cn, formatNumber, getDiceColor, getDiceBg, getSplitBadge, getSplitDot } from "../lib/utils";

/**
 * High-performance slice image viewer with radar/scanner loading animation overlay
 * Displays an interactive medical scan loader until the full slice image is downloaded & decoded.
 */
function SliceImage({ src, alt, className = "w-full h-full object-contain", contrast = false }) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const prevSrcRef = useRef(src);

  // Reset loading state synchronously whenever slice URL changes
  if (prevSrcRef.current !== src) {
    prevSrcRef.current = src;
    setLoaded(false);
    setHasError(false);
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden select-none">
      {/* Sleek Medical Scanner Loading Animation Overlay */}
      {!loaded && !hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950/85 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-none">
          <div className="relative w-11 h-11 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping opacity-60" />
            <div className="absolute inset-1.5 rounded-full border border-dashed border-cyan-500/40 animate-[spin_4s_linear_infinite]" />
            <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          </div>

          <div className="mt-2 flex items-center space-x-1.5">
            <span className="w-1 h-1 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 h-1 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-1 rounded-full bg-cyan-400 animate-bounce" />
            <span className="text-[10px] font-mono tracking-wider text-cyan-300/80 uppercase ml-0.5">
              Loading Slice...
            </span>
          </div>

          <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse top-1/2 -translate-y-1/2" />
        </div>
      )}

      {/* Error / Processing Fallback State */}
      {hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-3 text-center bg-zinc-950 text-zinc-500">
          <AlertCircle className="w-5 h-5 text-zinc-600 mb-1" />
          <span className="text-[10px] font-mono text-zinc-400">Slice Processing</span>
        </div>
      )}

      {/* Rendered Medical Slice Image */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setHasError(true)}
        className={cn(
          className,
          contrast && "filter contrast-125",
          "transition-opacity duration-300 ease-in-out",
          loaded ? "opacity-100" : "opacity-0"
        )}
        loading="eager"
      />
    </div>
  );
}

/**
 * CroppedSliceImage: Efficiently crops a single slide cell from a consolidated multi-planar image strip.
 * Features 0-latency client-side switching, shared browser cache across all views, and medical scanner animation.
 */
function CroppedSliceImage({
  stripUrl,
  col = 0,
  row = 0,
  totalCols = 6,
  totalRows = 15,
  alt = "Medical Slice",
  contrast = false,
  className = "",
  fallbackSrc = null
}) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const prevSrcRef = useRef(stripUrl || fallbackSrc);

  if (prevSrcRef.current !== (stripUrl || fallbackSrc)) {
    prevSrcRef.current = stripUrl || fallbackSrc;
    setLoaded(false);
    setHasError(false);
  }

  // Fallback to single slice if no stripUrl is available
  if (!stripUrl && fallbackSrc) {
    return <SliceImage src={fallbackSrc} alt={alt} contrast={contrast} className={className} />;
  }

  return (
    <div className={cn("relative w-full h-full flex items-center justify-center bg-black overflow-hidden select-none", className)}>
      {/* Sleek Medical Scanner Loading Animation Overlay */}
      {!loaded && !hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950/85 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-none">
          <div className="relative w-11 h-11 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping opacity-60" />
            <div className="absolute inset-1.5 rounded-full border border-dashed border-cyan-500/40 animate-[spin_4s_linear_infinite]" />
            <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          </div>

          <div className="mt-2 flex items-center space-x-1.5">
            <span className="w-1 h-1 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 h-1 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-1 rounded-full bg-cyan-400 animate-bounce" />
            <span className="text-[10px] font-mono tracking-wider text-cyan-300/80 uppercase ml-0.5">
              Loading Visuals...
            </span>
          </div>

          <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse top-1/2 -translate-y-1/2" />
        </div>
      )}

      {/* Error / Processing Fallback */}
      {hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-3 text-center bg-zinc-950 text-zinc-500">
          <AlertCircle className="w-5 h-5 text-zinc-600 mb-1" />
          <span className="text-[10px] font-mono text-zinc-400">Slice Unavailable</span>
        </div>
      )}

      {/* Consolidated Strip: Cropped in real-time via CSS percentage coordinates */}
      <img
        src={stripUrl}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setHasError(true)}
        style={{
          position: "absolute",
          width: `${totalCols * 100}%`,
          height: `${totalRows * 100}%`,
          left: `-${col * 100}%`,
          top: `-${row * 100}%`,
          maxWidth: "none",
          maxHeight: "none",
          objectFit: "fill",
        }}
        className={cn(
          contrast && "filter contrast-125",
          "transition-opacity duration-300 ease-in-out pointer-events-none",
          loaded ? "opacity-100" : "opacity-0"
        )}
        loading="eager"
      />
    </div>
  );
}

/**
 * PlaneCardHeader: Well-structured, two-tier clinical header for Axial, Sagittal, and Coronal views.
 * - Tier 1 (Anatomical Context & Quantitative Diagnostics):
 *     Plane Badge with color theme, Anatomical Orientation (e.g. Transverse · Superior ↔ Inferior),
 *     Active Coordinate Chip (e.g. Z = 119), Dominant Index (3 / 5), Peak Lesion Status pill, and GT vs Pred voxel counts.
 * - Tier 2 (Dedicated Navigation Toolbar):
 *     Dominant slice mode indicator, Step controls (First, Prev, Next, Last), segmented slice pills,
 *     and a Peak Focus target button.
 */
function PlaneCardHeader({
  config,
  currentSliceIdx,
  setSliceIdx,
  info,
  availableSlices = [],
  hasDominantSlices = false,
  safePos = 0,
  isFirst = false,
  isLast = false,
  handleFirst,
  handlePrev,
  handleNext,
  handleLast
}) {
  // Only use button groups if there are 5 or fewer dominant slices (e.g. Vercel static version)
  // For local system (or full volumes with > 5 slices), use the high-precision medical slider
  const isDominantMode = hasDominantSlices && availableSlices.length > 0 && availableSlices.length <= 5;

  return (
    <div className="space-y-3 pb-3 border-b border-zinc-800/80">
      {/* Tier 1: Anatomical Identity & Quantitative Diagnostics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Plane Identity, Orientation & Coordinates */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Plane Badge */}
          <span className={cn("px-3 py-1 rounded-lg text-xs font-mono font-bold border flex items-center gap-1.5 shadow-sm", config.badgeBg)}>
            <Compass className="w-3.5 h-3.5" />
            {config.title}
          </span>

          {/* Anatomical Orientation Tag */}
          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900/80 px-2.5 py-1 rounded-lg border border-zinc-800 hidden sm:inline-flex items-center gap-1.5">
            <span className="text-zinc-300 font-medium">{config.planeLabel}</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400">{config.axisDesc}</span>
          </span>

          {/* Active Coordinate Chip */}
          <div className="flex items-center space-x-1.5 bg-zinc-900 border border-zinc-700/80 px-3 py-1 rounded-lg shadow-inner">
            <span className="text-xs font-bold font-mono text-white tracking-wide">
              {config.axis} = {info.sliceIndex}
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              ({isDominantMode ? `Dominant ${safePos + 1}/${availableSlices.length}` : `Slice ${info.sliceIndex + 1} of ${config.totalSlices}`})
            </span>
          </div>

          {/* Peak Lesion Status Badge */}
          {info.isPeak ? (
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <Flame className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Peak Lesion Slice
            </span>
          ) : info.gtVoxels > 0 ? (
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 flex items-center gap-1.5">
              <Target className="w-3 h-3 text-cyan-400" />
              Active Lesion ({info.gtVoxels}v)
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono text-zinc-400 bg-zinc-900/40 border border-zinc-800/80">
              Lesion Free
            </span>
          )}
        </div>

        {/* Right: Quantitative Area Metrics */}
        <div className="flex items-center space-x-2.5 text-xs font-mono self-start lg:self-auto">
          <div className="flex items-center space-x-2.5 bg-zinc-900/90 border border-zinc-800 px-3 py-1 rounded-lg shadow-sm">
            <span className="flex items-center gap-1.5 text-zinc-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              GT: <span className="text-emerald-400 font-semibold">{info.gtVoxels}</span> vox
            </span>
            <span className="text-zinc-600 font-light">|</span>
            <span className="flex items-center gap-1.5 text-zinc-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
              Pred: <span className="text-cyan-400 font-semibold">{info.predVoxels}</span> vox
            </span>
          </div>
        </div>
      </div>

      {/* Tier 2: Dedicated Navigation & Slice Scrubbing Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-zinc-900/50 border border-zinc-800/80 rounded-lg p-2">
        {/* Left: Slice Position & Mode Label */}
        <div className="flex items-center space-x-2 px-1">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-mono text-zinc-300">
            {isDominantMode ? (
              <span>Dominant Slices <span className="text-zinc-500">({availableSlices.length} key cross-sections)</span></span>
            ) : (
              <span>Volume Slice Scrubbing <span className="text-cyan-400 font-semibold">({config.totalSlices} slices)</span></span>
            )}
          </span>
        </div>

        {/* Right: Step buttons + Segmented Slice Pills OR Medical Slider + Focus */}
        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1.5">
          {/* Step Navigation Controls */}
          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-md p-0.5">
            <button
              onClick={handleFirst}
              disabled={isFirst}
              title={`First ${config.shortName} Slice (${config.axis}=0)`}
              className={cn(
                "p-1.5 rounded text-zinc-400 transition-colors",
                isFirst ? "opacity-30 cursor-not-allowed" : "hover:bg-zinc-800 hover:text-white"
              )}
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handlePrev}
              disabled={isFirst}
              title={`Previous ${config.shortName} Slice`}
              className={cn(
                "p-1.5 rounded text-zinc-400 transition-colors",
                isFirst ? "opacity-30 cursor-not-allowed" : "hover:bg-zinc-800 hover:text-white"
              )}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Conditional Navigation: 5-Slice Button Group for Vercel vs Smooth Medical Slider for Local */}
          {isDominantMode ? (
            <div className="flex items-center bg-zinc-950 p-0.5 rounded-md border border-zinc-800 space-x-1">
              {availableSlices.map((sl, idx) => {
                const isSelected = currentSliceIdx === sl.slice_index;
                return (
                  <button
                    key={sl.slice_index}
                    onClick={() => setSliceIdx(sl.slice_index)}
                    title={`Dominant Slice ${idx + 1} of ${availableSlices.length} (${config.axis}=${sl.slice_index})`}
                    className={cn(
                      "px-2.5 py-1 text-xs rounded font-mono transition-all flex items-center gap-1.5",
                      isSelected
                        ? "bg-white text-black font-bold shadow-md ring-1 ring-white/50"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    )}
                  >
                    <span>{config.axis}={sl.slice_index}</span>
                    {sl.is_peak && (
                      <span className={cn(
                        "text-[9px] px-1 rounded uppercase font-bold",
                        isSelected ? "bg-black/15 text-black" : "bg-emerald-500/20 text-emerald-400"
                      )}>
                        Peak
                      </span>
                    )}
                    {sl.gt_voxels > 0 && (
                      <span className={cn("text-[9px]", isSelected ? "text-zinc-700 font-semibold" : "text-zinc-500")}>
                        ({sl.gt_voxels}v)
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center space-x-2.5 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800">
              <input
                type="range"
                min={0}
                max={Math.max(1, config.totalSlices - 1)}
                value={currentSliceIdx}
                onChange={(e) => setSliceIdx(Number(e.target.value))}
                className="w-36 sm:w-56 md:w-72 lg:w-96 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
              />
              <div className="flex items-center space-x-1.5 text-xs font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700 shadow-inner">
                <span className="font-bold text-cyan-300">{config.axis}={currentSliceIdx}</span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-400">{config.totalSlices - 1}</span>
              </div>
            </div>
          )}

          {/* Step Forward Navigation */}
          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-md p-0.5">
            <button
              onClick={handleNext}
              disabled={isLast}
              title={`Next ${config.shortName} Slice`}
              className={cn(
                "p-1.5 rounded text-zinc-400 transition-colors",
                isLast ? "opacity-30 cursor-not-allowed" : "hover:bg-zinc-800 hover:text-white"
              )}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleLast}
              disabled={isLast}
              title={`Last ${config.shortName} Slice (${config.axis}=${config.totalSlices - 1})`}
              className={cn(
                "p-1.5 rounded text-zinc-400 transition-colors",
                isLast ? "opacity-30 cursor-not-allowed" : "hover:bg-zinc-800 hover:text-white"
              )}
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset to Peak Lesion Focus */}
          <button
            onClick={() => setSliceIdx(config.defaultSlice)}
            title={`Reset to Peak Focus (${config.axis}=${config.defaultSlice})`}
            className={cn(
              "px-2.5 py-1 text-xs rounded-md font-mono flex items-center gap-1.5 transition-all border shadow-sm",
              currentSliceIdx === config.defaultSlice
                ? "bg-emerald-950/50 border-emerald-700/60 text-emerald-300 font-semibold ring-1 ring-emerald-500/20"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
            )}
          >
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>Focus</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SubjectInspector({ subject, onSelectSubject, model = "hsunet" }) {
  const [metaLoading, setMetaLoading] = useState(false);
  const [dynamicMeta, setDynamicMeta] = useState(null);


  // Active visuals payload: static or dynamically fetched
  const visuals = subject?.visuals || dynamicMeta;

  // Compute multi-planar configuration
  const planesConfig = useMemo(() => {
    const p = visuals?.planes || dynamicMeta?.planes;

    // 1. Axial Plane (Z)
    const axialDef = p?.axial?.default_slice ?? visuals?.default_slice ?? 0;
    const axialTotal = p?.axial?.total_slices ?? visuals?.total_slices ?? (visuals?.slices?.length || 179);
    const axialSlices = p?.axial?.slices && p.axial.slices.length > 0 ? p.axial.slices : (visuals?.slices || []);
    const axialLesionProfile = p?.axial?.lesion_profile || visuals?.lesion_profile || [];
    const axialRowOffset = p?.axial?.row_offset ?? 0;

    // 2. Sagittal Plane (X)
    const sagDef = p?.sagittal?.default_slice ?? Math.floor((dynamicMeta?.shape?.[0] || 158) / 2);
    const sagTotal = p?.sagittal?.total_slices ?? (dynamicMeta?.shape?.[0] || 158);
    const sagSlices = p?.sagittal?.slices || [];
    const sagLesionProfile = p?.sagittal?.lesion_profile || [];
    const sagRowOffset = p?.sagittal?.row_offset ?? 5;

    // 3. Coronal Plane (Y)
    const corDef = p?.coronal?.default_slice ?? Math.floor((dynamicMeta?.shape?.[1] || 206) / 2);
    const corTotal = p?.coronal?.total_slices ?? (dynamicMeta?.shape?.[1] || 206);
    const corSlices = p?.coronal?.slices || [];
    const corLesionProfile = p?.coronal?.lesion_profile || [];
    const corRowOffset = p?.coronal?.row_offset ?? 10;

    return {
      axial: {
        key: "axial",
        title: "Row 1: Axial Views",
        shortName: "Axial",
        planeLabel: "Transverse Plane",
        axis: "Z",
        axisDesc: "Superior — Inferior",
        rowOffset: axialRowOffset,
        defaultSlice: axialDef,
        totalSlices: axialTotal,
        slices: axialSlices,
        lesionProfile: axialLesionProfile,
        color: "text-amber-400",
        badgeBg: "bg-amber-950/40 border-amber-800/60 text-amber-300",
      },
      sagittal: {
        key: "sagittal",
        title: "Row 2: Sagittal Views",
        shortName: "Sagittal",
        planeLabel: "Sagittal Plane",
        axis: "X",
        axisDesc: "Left — Right Lateral",
        rowOffset: sagRowOffset,
        defaultSlice: sagDef,
        totalSlices: sagTotal,
        slices: sagSlices,
        lesionProfile: sagLesionProfile,
        color: "text-violet-400",
        badgeBg: "bg-violet-950/40 border-violet-800/60 text-violet-300",
      },
      coronal: {
        key: "coronal",
        title: "Row 3: Coronal Views",
        shortName: "Coronal",
        planeLabel: "Coronal Plane",
        axis: "Y",
        axisDesc: "Anterior — Posterior Frontal",
        rowOffset: corRowOffset,
        defaultSlice: corDef,
        totalSlices: corTotal,
        slices: corSlices,
        lesionProfile: corLesionProfile,
        color: "text-sky-400",
        badgeBg: "bg-sky-950/40 border-sky-800/60 text-sky-300",
      },
    };
  }, [visuals, dynamicMeta]);

  // Per-plane active slice state
  const [axialSliceIdx, setAxialSliceIdx] = useState(0);
  const [sagittalSliceIdx, setSagittalSliceIdx] = useState(0);
  const [coronalSliceIdx, setCoronalSliceIdx] = useState(0);

  const [viewMode, setViewMode] = useState("grid"); // "grid", "error"
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1000);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const playIntervalRef = useRef(null);

  // When subject changes, reset slice indices to their default focus slices (or first dominant slice)
  useEffect(() => {
    if (!subject) return;

    setIsPlaying(false);
    setDynamicMeta(null);

    const p = subject.visuals?.planes;
    const axSlices = p?.axial?.slices || subject.visuals?.slices;
    const sagSlices = p?.sagittal?.slices;
    const corSlices = p?.coronal?.slices;

    const axDef = p?.axial?.default_slice ?? subject.visuals?.default_slice ?? 0;
    const sagDef = p?.sagittal?.default_slice ?? 0;
    const corDef = p?.coronal?.default_slice ?? 0;

    // Ensure the initial active slice is valid and in dominant slices if available
    const initialAx = axSlices && axSlices.length > 0
      ? (axSlices.find((s) => s.slice_index === axDef)?.slice_index ?? axSlices[0].slice_index)
      : axDef;
    const initialSag = sagSlices && sagSlices.length > 0
      ? (sagSlices.find((s) => s.slice_index === sagDef)?.slice_index ?? sagSlices[0].slice_index)
      : sagDef;
    const initialCor = corSlices && corSlices.length > 0
      ? (corSlices.find((s) => s.slice_index === corDef)?.slice_index ?? corSlices[0].slice_index)
      : corDef;

    setAxialSliceIdx(initialAx);
    setSagittalSliceIdx(initialSag);
    setCoronalSliceIdx(initialCor);

    // If case has no pre-rendered static planes, fetch dynamic metadata from Python backend
    if (!p) {
      setMetaLoading(true);
      fetch(`/api/subject_meta?case_id=${subject.case_id}&model=${model || "hsunet"}`)
        .then((res) => {
          if (!res.ok) throw new Error("Metadata fetch error");
          return res.json();
        })
        .then((data) => {
          setDynamicMeta(data);
          if (data.planes) {
            setAxialSliceIdx(data.planes.axial?.default_slice ?? data.default_slice ?? 0);
            setSagittalSliceIdx(data.planes.sagittal?.default_slice ?? 0);
            setCoronalSliceIdx(data.planes.coronal?.default_slice ?? 0);
          } else {
            setAxialSliceIdx(data.default_slice ?? 0);
          }
          setMetaLoading(false);
        })
        .catch((err) => {
          console.warn("Dynamic slice server request:", err);
          setMetaLoading(false);
        });
    }
  }, [subject?.case_id]);

  // Jump all 3 views to the lesion focus coordinate
  const handleJumpAllToFocus = () => {
    setAxialSliceIdx(planesConfig.axial.defaultSlice);
    setSagittalSliceIdx(planesConfig.sagittal.defaultSlice);
    setCoronalSliceIdx(planesConfig.coronal.defaultSlice);
  };

  // Cine loop playback across axial dominant slices
  useEffect(() => {
    if (isPlaying) {
      const axSlices = planesConfig.axial.slices;
      const hasDom = axSlices && axSlices.length > 0;

      playIntervalRef.current = setInterval(() => {
        if (hasDom) {
          setAxialSliceIdx((prevZ) => {
            const curIdx = axSlices.findIndex((s) => s.slice_index === prevZ);
            const nextIdx = curIdx === -1 || curIdx >= axSlices.length - 1 ? 0 : curIdx + 1;
            return axSlices[nextIdx].slice_index;
          });
        } else {
          setAxialSliceIdx((prevZ) => {
            const total = planesConfig.axial.totalSlices;
            if (total <= 1) return prevZ;
            return prevZ >= total - 1 ? 0 : prevZ + 1;
          });
        }
      }, playSpeed);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, planesConfig.axial.slices, planesConfig.axial.totalSlices, playSpeed]);

  // Keyboard navigation strictly across available dominant slices
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "TEXTAREA") return;

      const axSlices = planesConfig.axial.slices;
      const hasDom = axSlices && axSlices.length > 0;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (hasDom) {
          const curIdx = axSlices.findIndex((s) => s.slice_index === axialSliceIdx);
          const safeIdx = curIdx >= 0 ? curIdx : 0;
          if (safeIdx > 0) setAxialSliceIdx(axSlices[safeIdx - 1].slice_index);
        } else {
          setAxialSliceIdx((prev) => Math.max(0, prev - 1));
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (hasDom) {
          const curIdx = axSlices.findIndex((s) => s.slice_index === axialSliceIdx);
          const safeIdx = curIdx >= 0 ? curIdx : 0;
          if (safeIdx < axSlices.length - 1) setAxialSliceIdx(axSlices[safeIdx + 1].slice_index);
        } else {
          setAxialSliceIdx((prev) => Math.min(planesConfig.axial.totalSlices - 1, prev + 1));
        }
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [planesConfig.axial.slices, planesConfig.axial.totalSlices, axialSliceIdx]);

  if (!subject) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-black text-zinc-500">
        <div className="text-center">
          <Layers className="w-12 h-12 mx-auto mb-3 opacity-30 text-white" />
          <h2 className="text-sm font-medium text-zinc-400">No Subject Selected</h2>
          <p className="text-xs text-zinc-600 mt-1">Select a subject from the sidebar to inspect predictions & visuals.</p>
        </div>
      </div>
    );
  }

  // Helper to resolve slice URLs for any anatomical plane
  const getSliceUrl = (planeKey, sliceIdx, type) => {
    const conf = planesConfig[planeKey];
    // Check pre-rendered static slices
    const matched = conf?.slices?.find((s) => s.slice_index === sliceIdx);
    if (matched && matched[`${type}_url`]) {
      return matched[`${type}_url`];
    }
    // Dynamic slice server endpoint
    return `/api/slice?case_id=${subject.case_id}&plane=${planeKey}&slice_idx=${sliceIdx}&type=${type}`;
  };

  // Compute slice info helper for any given plane
  const getPlaneSliceInfo = (planeKey, sliceIdx) => {
    const conf = planesConfig[planeKey];
    const matched = conf?.slices?.find((s) => s.slice_index === sliceIdx);
    const gt = matched?.gt_voxels ?? (conf?.lesionProfile?.[sliceIdx]?.gt ?? 0);
    const pred = matched?.pred_voxels ?? (conf?.lesionProfile?.[sliceIdx]?.pred ?? 0);
    const isPeak = sliceIdx === conf.defaultSlice || (matched ? matched.is_peak : false);

    return {
      planeKey,
      sliceIndex: sliceIdx,
      isPeak,
      gtVoxels: gt,
      predVoxels: pred,
      rawUrl: getSliceUrl(planeKey, sliceIdx, "raw"),
      gtUrl: getSliceUrl(planeKey, sliceIdx, "gt"),
      predUrl: getSliceUrl(planeKey, sliceIdx, "pred"),
      gtOverlayUrl: getSliceUrl(planeKey, sliceIdx, "gt_overlay"),
      predOverlayUrl: getSliceUrl(planeKey, sliceIdx, "pred_overlay"),
      errorUrl: getSliceUrl(planeKey, sliceIdx, "error"),
    };
  };

  const axialInfo = getPlaneSliceInfo("axial", axialSliceIdx);
  const sagittalInfo = getPlaneSliceInfo("sagittal", sagittalSliceIdx);
  const coronalInfo = getPlaneSliceInfo("coronal", coronalSliceIdx);

  // Orthogonal planes list for rendering rows
  const orthogonalRows = [
    {
      config: planesConfig.axial,
      currentSliceIdx: axialSliceIdx,
      setSliceIdx: setAxialSliceIdx,
      info: axialInfo,
    },
    {
      config: planesConfig.sagittal,
      currentSliceIdx: sagittalSliceIdx,
      setSliceIdx: setSagittalSliceIdx,
      info: sagittalInfo,
    },
    {
      config: planesConfig.coronal,
      currentSliceIdx: coronalSliceIdx,
      setSliceIdx: setCoronalSliceIdx,
      info: coronalInfo,
    },
  ];

  return (
    <div className="flex-1 h-full min-h-0 overflow-y-auto bg-black text-white p-6 space-y-6">
      {/* Top Header Card */}
      <div className="border border-zinc-800 bg-zinc-950/70 rounded-xl p-5 backdrop-blur shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold tracking-tight text-white font-mono">
                {subject.subject}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-zinc-800 border border-zinc-700 text-zinc-300">
                {subject.case_id}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-400">
                Site: {subject.site}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-400">
                Scale: {subject.size_category}
              </span>
              <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1.5 shadow-sm", getSplitBadge(subject.split))}>
                <span className={cn("w-1.5 h-1.5 rounded-full", getSplitDot(subject.split))} />
                Split: {subject.split || "Test"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-950/40 border border-cyan-800/60 text-cyan-300">
                Multi-Planar 3D Ready
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1.5 font-light flex items-center gap-2">
              <span>Dataset Split:</span>
              <span className={cn("px-1.5 py-0.5 rounded text-[11px] font-mono font-medium border", getSplitBadge(subject.split))}>
                {subject.split || "Test"}
              </span>
              <span className="text-zinc-500 font-mono text-[11px]">({subject.split_source})</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400 font-mono text-[11px]">
                Volume Shape: [{planesConfig.sagittal.totalSlices} × {planesConfig.coronal.totalSlices} × {planesConfig.axial.totalSlices}]
              </span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-[10px] uppercase text-zinc-500 tracking-wider">Overall DSC</div>
              <div className={cn("text-2xl font-bold font-mono", getDiceColor(subject.dice))}>
                {subject.dice.toFixed(4)}
              </div>
            </div>
            <div className={cn("px-3 py-1.5 rounded-lg border text-xs font-mono font-medium", getDiceBg(subject.dice))}>
              {subject.dice >= 0.85 ? "Excellent" : subject.dice >= 0.70 ? "Good" : subject.dice >= 0.50 ? "Moderate" : "Challenging"}
            </div>
          </div>
        </div>

        {/* Primary Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 pt-4 border-t border-zinc-800/80">
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3">
            <div className="text-[10px] uppercase text-zinc-400 tracking-wider font-medium">Dice (DSC)</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">{subject.dice.toFixed(4)}</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">IoU: {subject.iou.toFixed(4)}</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3">
            <div className="text-[10px] uppercase text-zinc-400 tracking-wider font-medium">HD95 Distance</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {subject.hd95 !== null ? `${subject.hd95.toFixed(2)}` : "0.00"}
              <span className="text-xs font-normal text-zinc-500 ml-1">mm</span>
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">95% Surface Error</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3">
            <div className="text-[10px] uppercase text-zinc-400 tracking-wider font-medium">GT Volume</div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
              {subject.ref_vol_ml.toFixed(2)}
              <span className="text-xs font-normal text-zinc-500 ml-1">mL</span>
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">
              {subject.ref_vol_ml === 0 ? "Stroke Negative" : "Reference Lesion"}
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3">
            <div className="text-[10px] uppercase text-zinc-400 tracking-wider font-medium">Pred Volume</div>
            <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">
              {subject.pred_vol_ml.toFixed(2)}
              <span className="text-xs font-normal text-zinc-500 ml-1">mL</span>
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">
              Diff: {subject.abs_vol_diff_ml.toFixed(2)} mL
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3">
            <div className="text-[10px] uppercase text-zinc-400 tracking-wider font-medium">Recall (Sens)</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {(subject.recall * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">
              Precision: {(subject.precision * 100).toFixed(1)}%
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3">
            <div className="text-[10px] uppercase text-zinc-400 tracking-wider font-medium">Specificity</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {(subject.specificity * 100).toFixed(2)}%
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">
              Time: {subject.time_sec.toFixed(1)}s
            </div>
          </div>
        </div>
      </div>

      {/* Global Multi-Planar Controls & 3D Focus Bar */}
      <div className="border border-zinc-800 bg-zinc-950/70 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 flex-wrap gap-y-2">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">3D Lesion Center:</span>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-amber-300">
              Axial Z = {axialSliceIdx}
            </span>
            <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-violet-300">
              Sagittal X = {sagittalSliceIdx}
            </span>
            <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-sky-300">
              Coronal Y = {coronalSliceIdx}
            </span>
          </div>

          <button
            onClick={handleJumpAllToFocus}
            title="Snap all orthogonal views to lesion peak coordinates"
            className="px-3 py-1 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-800/70 text-emerald-300 text-xs rounded-md font-medium flex items-center gap-1.5 transition-colors"
          >
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>Jump All to 3D Focus</span>
          </button>
        </div>

        {/* View Mode & Cine Control */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "px-2.5 py-1 text-xs rounded transition-all flex items-center gap-1",
                viewMode === "grid" ? "bg-zinc-800 text-white shadow font-medium" : "text-zinc-400 hover:text-white"
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              5-Way Multi-Planar Grid
            </button>
            <button
              onClick={() => setViewMode("error")}
              className={cn(
                "px-2.5 py-1 text-xs rounded transition-all flex items-center gap-1",
                viewMode === "error" ? "bg-zinc-800 text-white shadow font-medium" : "text-zinc-400 hover:text-white"
              )}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              Confusion Error Diagnostic Maps
            </button>
          </div>

          {/* Axial Cine Loop Control */}
          <button
            onClick={() => setIsPlaying((prev) => !prev)}
            title="Axial Cine Loop Auto-Play (Spacebar)"
            className={cn(
              "px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors border",
              isPlaying
                ? "bg-rose-950/40 border-rose-800 text-rose-300"
                : "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white"
            )}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPlaying ? "Pause Cine" : "Play Cine"}</span>
          </button>
        </div>
      </div>

      {/* Loading state indicator */}
      {metaLoading && (
        <div className="border border-zinc-800 bg-zinc-950 rounded-xl p-8 flex items-center justify-center space-x-3 text-zinc-400 text-xs font-mono">
          <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Extracting multi-planar 3D volumetric slices from NIfTI scanner...</span>
        </div>
      )}

      {/* 3 Orthogonal Plane Rows */}
      {viewMode === "grid" ? (
        <div className="space-y-6">
          {orthogonalRows.map(({ config, currentSliceIdx, setSliceIdx, info }) => {
            const isDominantMode = config.slices && config.slices.length > 0 && config.slices.length <= 5;
            const availableSlices = isDominantMode ? config.slices : [];

            // Find active index in dominant slices list if applicable
            const activePos = isDominantMode
              ? availableSlices.findIndex((s) => s.slice_index === currentSliceIdx)
              : -1;
            const safePos = activePos >= 0 ? activePos : 0;
            const isFirst = isDominantMode ? safePos === 0 : currentSliceIdx <= 0;
            const isLast = isDominantMode
              ? safePos === availableSlices.length - 1
              : currentSliceIdx >= config.totalSlices - 1;

            const handleFirst = () => {
              if (isDominantMode) setSliceIdx(availableSlices[0].slice_index);
              else setSliceIdx(0);
            };

            const handlePrev = () => {
              if (isDominantMode) {
                if (safePos > 0) setSliceIdx(availableSlices[safePos - 1].slice_index);
              } else {
                setSliceIdx((prev) => Math.max(0, prev - 1));
              }
            };

            const handleNext = () => {
              if (isDominantMode) {
                if (safePos < availableSlices.length - 1) setSliceIdx(availableSlices[safePos + 1].slice_index);
              } else {
                setSliceIdx((prev) => Math.min(config.totalSlices - 1, prev + 1));
              }
            };

            const handleLast = () => {
              if (isDominantMode) setSliceIdx(availableSlices[availableSlices.length - 1].slice_index);
              else setSliceIdx(config.totalSlices - 1);
            };

            return (
              <div
                key={config.key}
                className="border border-zinc-800/90 bg-zinc-950/80 rounded-xl p-5 space-y-4 shadow-xl"
              >
                {/* Redesigned Structured Plane Card Header */}
                <PlaneCardHeader
                  config={config}
                  currentSliceIdx={currentSliceIdx}
                  setSliceIdx={setSliceIdx}
                  info={info}
                  availableSlices={availableSlices}
                  hasDominantSlices={isDominantMode}
                  safePos={safePos}
                  isFirst={isFirst}
                  isLast={isLast}
                  handleFirst={handleFirst}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                  handleLast={handleLast}
                />

                {/* 5-Way Slices Row: Raw, GT Mask, Pred Mask, GT+Scan Overlay, Pred Mask Overlay */}
                {(() => {
                  const stripRow = isDominantMode ? (config.rowOffset ?? 0) + safePos : 0;
                  const activeModelDir = model === "ensemble" ? "ensemble" : "hsunet";
                  const stripUrl = isDominantMode
                    ? (visuals?.strip_url || (subject?.has_visuals ? `/data/subjects/${subject.case_id}/${activeModelDir}/strip.png` : null))
                    : null;

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
                      {/* 1. Raw Scan */}
                      <div
                        onClick={() => setFullscreenImage({
                          stripUrl,
                          row: stripRow,
                          col: 0,
                          url: info.rawUrl,
                          title: `${config.shortName} Raw MRI / CT Scan (${config.axis}=${info.sliceIndex})`
                        })}
                        className="group relative bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:border-zinc-600 transition-all shadow-md"
                      >
                        <div className="px-3 py-2 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
                          <span className="text-xs font-medium text-zinc-300">1. Raw MRI / CT Scan</span>
                          <Maximize2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
                        </div>
                        <div className="aspect-square bg-black flex items-center justify-center p-1 relative overflow-hidden">
                          <CroppedSliceImage
                            stripUrl={stripUrl}
                            row={stripRow}
                            col={0}
                            fallbackSrc={info.rawUrl}
                            alt="Raw Scan"
                            contrast={true}
                          />
                        </div>
                        <div className="px-3 py-1.5 bg-zinc-950 text-[10px] text-zinc-500 border-t border-zinc-900 flex justify-between">
                          <span>{config.shortName} {config.axis}={info.sliceIndex}</span>
                          <span>Anatomy</span>
                        </div>
                      </div>

                      {/* 2. Ground Truth Mask */}
                      <div
                        onClick={() => setFullscreenImage({
                          stripUrl,
                          row: stripRow,
                          col: 1,
                          url: info.gtUrl,
                          title: `${config.shortName} GT Lesion Mask (${config.axis}=${info.sliceIndex})`
                        })}
                        className="group relative bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:border-zinc-600 transition-all shadow-md"
                      >
                        <div className="px-3 py-2 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
                          <span className="text-xs font-medium text-emerald-400">2. GT Lesion Mask</span>
                          <Maximize2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
                        </div>
                        <div className="aspect-square bg-black flex items-center justify-center p-1 relative overflow-hidden">
                          <CroppedSliceImage
                            stripUrl={stripUrl}
                            row={stripRow}
                            col={1}
                            fallbackSrc={info.gtUrl}
                            alt="GT Mask"
                          />
                        </div>
                        <div className="px-3 py-1.5 bg-zinc-950 text-[10px] text-zinc-500 border-t border-zinc-900 flex justify-between">
                          <span>{info.gtVoxels} Voxel Area</span>
                          <span className="text-emerald-400">{info.gtVoxels > 0 ? "Lesion Present" : "Clear / 0 Vox"}</span>
                        </div>
                      </div>

                      {/* 3. Predicted Lesion Mask */}
                      <div
                        onClick={() => setFullscreenImage({
                          stripUrl,
                          row: stripRow,
                          col: 2,
                          url: info.predUrl,
                          title: `${config.shortName} Predicted Lesion Mask (${config.axis}=${info.sliceIndex})`
                        })}
                        className="group relative bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:border-zinc-600 transition-all shadow-md"
                      >
                        <div className="px-3 py-2 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
                          <span className="text-xs font-medium text-cyan-400">3. Predicted Lesion Mask</span>
                          <Maximize2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
                        </div>
                        <div className="aspect-square bg-black flex items-center justify-center p-1 relative overflow-hidden">
                          <CroppedSliceImage
                            stripUrl={stripUrl}
                            row={stripRow}
                            col={2}
                            fallbackSrc={info.predUrl}
                            alt="Predicted Mask"
                          />
                        </div>
                        <div className="px-3 py-1.5 bg-zinc-950 text-[10px] text-zinc-500 border-t border-zinc-900 flex justify-between">
                          <span>{info.predVoxels} Voxel Area</span>
                          <span className="text-cyan-400">{info.predVoxels > 0 ? "Lesion Predicted" : "Clear / 0 Vox"}</span>
                        </div>
                      </div>

                      {/* 4. GT + Scan Overlay */}
                      <div
                        onClick={() => setFullscreenImage({
                          stripUrl,
                          row: stripRow,
                          col: 3,
                          url: info.gtOverlayUrl,
                          title: `${config.shortName} GT Mask + Scan Overlay (${config.axis}=${info.sliceIndex})`
                        })}
                        className="group relative bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:border-zinc-600 transition-all shadow-md"
                      >
                        <div className="px-3 py-2 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
                          <span className="text-xs font-medium text-emerald-400">4. GT + Scan Overlay</span>
                          <Maximize2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
                        </div>
                        <div className="aspect-square bg-black flex items-center justify-center p-1 relative overflow-hidden">
                          <CroppedSliceImage
                            stripUrl={stripUrl}
                            row={stripRow}
                            col={3}
                            fallbackSrc={info.gtOverlayUrl}
                            alt="GT Overlay"
                          />
                        </div>
                        <div className="px-3 py-1.5 bg-zinc-950 text-[10px] text-emerald-400/80 border-t border-zinc-900 flex justify-between">
                          <span>Reference Annotation</span>
                          <span>Ground Truth</span>
                        </div>
                      </div>

                      {/* 5. Predicted Mask Overlay */}
                      <div
                        onClick={() => setFullscreenImage({
                          stripUrl,
                          row: stripRow,
                          col: 4,
                          url: info.predOverlayUrl,
                          title: `${config.shortName} Predicted Mask Overlay (${config.axis}=${info.sliceIndex})`
                        })}
                        className="group relative bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:border-zinc-600 transition-all shadow-md"
                      >
                        <div className="px-3 py-2 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
                          <span className="text-xs font-medium text-cyan-400">5. Predicted Mask Overlay</span>
                          <Maximize2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
                        </div>
                        <div className="aspect-square bg-black flex items-center justify-center p-1 relative overflow-hidden">
                          <CroppedSliceImage
                            stripUrl={stripUrl}
                            row={stripRow}
                            col={4}
                            fallbackSrc={info.predOverlayUrl}
                            alt="Pred Overlay"
                          />
                        </div>
                        <div className="px-3 py-1.5 bg-zinc-950 text-[10px] text-cyan-400/80 border-t border-zinc-900 flex justify-between">
                          <span>HS-UNet Output</span>
                          <span>{info.predVoxels} Voxels</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      ) : (
        /* Confusion Error Diagnostic Map View Mode across all 3 planes */
        <div className="space-y-6">
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-400 flex items-center justify-between flex-wrap gap-2">
            <span className="font-medium text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Multi-Planar Confusion Diagnostic Error Legend:
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                <span className="text-zinc-300">True Positive (Hit)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />
                <span className="text-zinc-300">False Positive (Over-seg)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
                <span className="text-zinc-300">False Negative (Missed)</span>
              </span>
            </div>
          </div>

          {orthogonalRows.map(({ config, currentSliceIdx, setSliceIdx, info }) => {
            const isDominantMode = config.slices && config.slices.length > 0 && config.slices.length <= 5;
            const availableSlices = isDominantMode ? config.slices : [];
            const currentPos = isDominantMode ? availableSlices.findIndex((s) => s.slice_index === currentSliceIdx) : -1;
            const safePos = currentPos >= 0 ? currentPos : 0;
            const isFirst = isDominantMode ? safePos <= 0 : currentSliceIdx <= 0;
            const isLast = isDominantMode ? safePos >= availableSlices.length - 1 : currentSliceIdx >= config.totalSlices - 1;

            const handleFirst = () => {
              if (isDominantMode) setSliceIdx(availableSlices[0].slice_index);
              else setSliceIdx(0);
            };

            const handlePrev = () => {
              if (isDominantMode) {
                if (safePos > 0) setSliceIdx(availableSlices[safePos - 1].slice_index);
              } else {
                setSliceIdx((prev) => Math.max(0, prev - 1));
              }
            };

            const handleNext = () => {
              if (isDominantMode) {
                if (safePos < availableSlices.length - 1) setSliceIdx(availableSlices[safePos + 1].slice_index);
              } else {
                setSliceIdx((prev) => Math.min(config.totalSlices - 1, prev + 1));
              }
            };

            const handleLast = () => {
              if (isDominantMode) setSliceIdx(availableSlices[availableSlices.length - 1].slice_index);
              else setSliceIdx(config.totalSlices - 1);
            };

            const stripRow = isDominantMode ? (config.rowOffset ?? 0) + safePos : 0;
            const activeModelDir = model === "ensemble" ? "ensemble" : "hsunet";
            const stripUrl = isDominantMode
              ? (visuals?.strip_url || (subject?.has_visuals ? `/data/subjects/${subject.case_id}/${activeModelDir}/strip.png` : null))
              : null;

            return (
              <div
                key={config.key}
                className="border border-zinc-800/90 bg-zinc-950/80 rounded-xl p-5 space-y-4 shadow-xl"
              >
                {/* Redesigned Structured Plane Card Header */}
                <PlaneCardHeader
                  config={config}
                  currentSliceIdx={currentSliceIdx}
                  setSliceIdx={setSliceIdx}
                  info={info}
                  availableSlices={availableSlices}
                  hasDominantSlices={isDominantMode}
                  safePos={safePos}
                  isFirst={isFirst}
                  isLast={isLast}
                  handleFirst={handleFirst}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                  handleLast={handleLast}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Confusion Error Map */}
                  <div
                    onClick={() => setFullscreenImage({
                      stripUrl,
                      row: stripRow,
                      col: 5,
                      url: info.errorUrl,
                      title: `${config.shortName} Error Diagnostic Map (${config.axis}=${info.sliceIndex})`
                    })}
                    className="group relative bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:border-zinc-600 transition-all shadow-md"
                  >
                    <div className="px-3 py-2 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
                      <span className="text-xs font-medium text-rose-400 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        {config.shortName} Confusion Error Map
                      </span>
                      <Maximize2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
                    </div>
                    <div className="aspect-square bg-black flex items-center justify-center p-2 relative overflow-hidden">
                      <CroppedSliceImage
                        stripUrl={stripUrl}
                        row={stripRow}
                        col={5}
                        fallbackSrc={info.errorUrl}
                        alt="Error Map"
                      />
                    </div>
                    <div className="px-3 py-2 bg-zinc-950 text-[11px] text-zinc-400 border-t border-zinc-900">
                      TP (Green) · FP Over-seg (Red) · FN Missed (Blue)
                    </div>
                  </div>

                  {/* Ground Truth Reference */}
                  <div
                    onClick={() => setFullscreenImage({
                      stripUrl,
                      row: stripRow,
                      col: 3,
                      url: info.gtOverlayUrl,
                      title: `${config.shortName} GT Reference Overlay (${config.axis}=${info.sliceIndex})`
                    })}
                    className="group relative bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:border-zinc-600 transition-all shadow-md"
                  >
                    <div className="px-3 py-2 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
                      <span className="text-xs font-medium text-emerald-400">
                        {config.shortName} Ground Truth Reference Overlay
                      </span>
                      <Maximize2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
                    </div>
                    <div className="aspect-square bg-black flex items-center justify-center p-2 relative overflow-hidden">
                      <CroppedSliceImage
                        stripUrl={stripUrl}
                        row={stripRow}
                        col={3}
                        fallbackSrc={info.gtOverlayUrl}
                        alt="GT Overlay"
                      />
                    </div>
                    <div className="px-3 py-2 bg-zinc-950 text-[11px] text-zinc-400 border-t border-zinc-900">
                      Neuroradiologist Target Annotation
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fullscreen Modal Dialog */}
      {fullscreenImage && (
        <div
          onClick={() => setFullscreenImage(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                {fullscreenImage.title}
              </h3>
              <button
                onClick={() => setFullscreenImage(null)}
                className="text-zinc-400 hover:text-white text-xs px-2.5 py-1 bg-zinc-900 rounded border border-zinc-800 transition-colors"
              >
                Close (ESC)
              </button>
            </div>
            <div className="p-6 bg-black flex items-center justify-center max-h-[75vh]">
              <div className="w-[65vh] h-[65vh] max-w-full aspect-square relative overflow-hidden rounded shadow-lg bg-zinc-950 flex items-center justify-center">
                <CroppedSliceImage
                  stripUrl={fullscreenImage.stripUrl}
                  row={fullscreenImage.row}
                  col={fullscreenImage.col}
                  fallbackSrc={fullscreenImage.url}
                  alt={fullscreenImage.title}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
