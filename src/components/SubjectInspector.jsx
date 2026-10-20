import React, { useState, useEffect, useRef } from "react";
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
  Loader2
} from "lucide-react";
import { cn, formatNumber, getDiceColor, getDiceBg, getSplitBadge, getSplitDot } from "../lib/utils";

export default function SubjectInspector({ subject, onSelectSubject }) {
  const [metaLoading, setMetaLoading] = useState(false);
  const [dynamicMeta, setDynamicMeta] = useState(null);

  // Determine slices and total count (either pre-rendered or dynamically loaded)
  const visuals = subject?.visuals || dynamicMeta;
  const slices = visuals?.slices || [];
  const totalSlices = visuals?.total_slices || slices.length || 0;
  const defaultSlice = visuals?.default_slice ?? (slices[0]?.slice_index ?? 0);

  const [currentSliceIdx, setCurrentSliceIdx] = useState(defaultSlice);
  const [viewMode, setViewMode] = useState("grid"); // "grid", "error"
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(150); // ms per slice
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const playIntervalRef = useRef(null);

  // When subject changes, set initial slice
  useEffect(() => {
    if (!subject) return;

    setIsPlaying(false);

    if (subject.visuals?.slices?.length > 0) {
      setDynamicMeta(null);
      const defZ = subject.visuals.default_slice;
      const matched = subject.visuals.slices.find((s) => s.slice_index === defZ);
      if (matched) {
        setCurrentSliceIdx(defZ);
      } else {
        setCurrentSliceIdx(subject.visuals.slices[0].slice_index);
      }
    } else {
      setMetaLoading(true);
      fetch(`/api/subject_meta?case_id=${subject.case_id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Metadata fetch error");
          return res.json();
        })
        .then((data) => {
          setDynamicMeta(data);
          setCurrentSliceIdx(data.default_slice ?? 0);
          setMetaLoading(false);
        })
        .catch((err) => {
          // If on static host like Vercel and API is not present, don't crash
          setMetaLoading(false);
        });
    }
  }, [subject?.case_id]);

  // Cine loop playback across available slices
  useEffect(() => {
    if (isPlaying && slices.length > 1) {
      playIntervalRef.current = setInterval(() => {
        setCurrentSliceIdx((prevZ) => {
          const currentIdxInSlices = slices.findIndex((s) => s.slice_index === prevZ);
          if (currentIdxInSlices === -1 || currentIdxInSlices >= slices.length - 1) {
            return slices[0].slice_index;
          }
          return slices[currentIdxInSlices + 1].slice_index;
        });
      }, playSpeed);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, slices, playSpeed]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "TEXTAREA") return;

      if (slices.length > 0) {
        const curIdx = slices.findIndex((s) => s.slice_index === currentSliceIdx);
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          if (curIdx > 0) setCurrentSliceIdx(slices[curIdx - 1].slice_index);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          if (curIdx < slices.length - 1) setCurrentSliceIdx(slices[curIdx + 1].slice_index);
        } else if (e.key === " ") {
          e.preventDefault();
          setIsPlaying((prev) => !prev);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slices, currentSliceIdx]);

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

  // Find active slice by slice_index
  const activeSlice =
    slices.find((s) => s.slice_index === currentSliceIdx) ||
    (slices.length > 0 ? slices[0] : null);

  const lesionProfile = visuals?.lesion_profile || [];
  const maxLesionVoxels = Math.max(...lesionProfile.map((p) => Math.max(p.gt, p.pred)), 1);

  const getSliceUrl = (type) => {
    if (activeSlice && activeSlice[`${type}_url`]) {
      return activeSlice[`${type}_url`];
    }
    return `/api/slice?case_id=${subject.case_id}&z=${currentSliceIdx}&type=${type}`;
  };

  const currentSlice = {
    slice_index: activeSlice ? activeSlice.slice_index : currentSliceIdx,
    is_peak: activeSlice ? activeSlice.is_peak : false,
    gt_voxels: activeSlice ? activeSlice.gt_voxels : 0,
    pred_voxels: activeSlice ? activeSlice.pred_voxels : 0,
    raw_url: getSliceUrl("raw"),
    gt_url: getSliceUrl("gt"),
    gt_overlay_url: getSliceUrl("gt_overlay"),
    pred_url: getSliceUrl("pred"),
    pred_overlay_url: getSliceUrl("pred_overlay"),
    error_url: getSliceUrl("error"),
  };

  const isFull3DScrub = slices.length >= 100;

  return (
    <div className="flex-1 h-full min-h-0 overflow-y-auto bg-black text-white p-6 space-y-5">
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
              {slices.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-950/40 border border-cyan-800/60 text-cyan-300">
                  {slices.length} Slices Available
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-1.5 font-light flex items-center gap-1.5">
              <span>Dataset Split:</span>
              <span className={cn("px-1.5 py-0.5 rounded text-[11px] font-mono font-medium border", getSplitBadge(subject.split))}>
                {subject.split || "Test"}
              </span>
              <span className="text-zinc-500 font-mono text-[11px]">({subject.split_source})</span>
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

      {/* Slices Navigator & Controls */}
      {metaLoading ? (
        <div className="border border-zinc-800 bg-zinc-950 rounded-xl p-8 flex items-center justify-center space-x-3 text-zinc-400 text-xs font-mono">
          <Loader2 className="w-5 h-5 animate-spin text-white" />
          <span>Accessing visual scans...</span>
        </div>
      ) : slices.length > 0 ? (
        <div className="border border-zinc-800 bg-zinc-950/70 rounded-xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Slice Position Status */}
            <div className="flex items-center space-x-3">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">Axial Slice:</span>
              <span className="text-sm font-bold font-mono text-white bg-zinc-900 border border-zinc-700 px-3 py-1 rounded-md shadow-inner">
                Z = {currentSlice.slice_index} <span className="text-zinc-500 font-normal">({slices.findIndex((s) => s.slice_index === currentSlice.slice_index) + 1} of {slices.length})</span>
              </span>

              {currentSlice.is_peak && (
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-emerald-400" />
                  {currentSlice.gt_voxels > 0 ? "Peak Lesion Slice" : "Brain Center Slice"}
                </span>
              )}

              <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
                (GT: <span className="text-emerald-400 font-medium">{currentSlice.gt_voxels}</span> voxels | Pred: <span className="text-cyan-400 font-medium">{currentSlice.pred_voxels}</span> voxels)
              </span>
            </div>

            {/* Step & Playback Controls */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setCurrentSliceIdx(slices[0].slice_index)}
                title="First Slice"
                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-300 hover:text-white transition-colors"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const cur = slices.findIndex((s) => s.slice_index === currentSlice.slice_index);
                  if (cur > 0) setCurrentSliceIdx(slices[cur - 1].slice_index);
                }}
                title="Previous Slice (Left Arrow)"
                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-300 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {slices.length > 1 && (
                <button
                  onClick={() => setIsPlaying((prev) => !prev)}
                  title="Cine Loop Auto-Play (Spacebar)"
                  className={cn(
                    "px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors border",
                    isPlaying
                      ? "bg-rose-950/40 border-rose-800 text-rose-300"
                      : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white"
                  )}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? "Pause" : "Play Cine"}</span>
                </button>
              )}

              <button
                onClick={() => {
                  const cur = slices.findIndex((s) => s.slice_index === currentSlice.slice_index);
                  if (cur < slices.length - 1) setCurrentSliceIdx(slices[cur + 1].slice_index);
                }}
                title="Next Slice (Right Arrow)"
                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-300 hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentSliceIdx(slices[slices.length - 1].slice_index)}
                title="Last Slice"
                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-300 hover:text-white transition-colors"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>

              {defaultSlice !== undefined && (
                <button
                  onClick={() => setCurrentSliceIdx(defaultSlice)}
                  title="Jump to Focus Slice"
                  className="ml-2 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-emerald-900/60 text-emerald-400 text-xs rounded font-medium flex items-center gap-1 transition-colors"
                >
                  <Target className="w-3.5 h-3.5" />
                  Jump to Focus (Z={defaultSlice})
                </button>
              )}
            </div>
          </div>

          {/* Quick Slice Selectors */}
          {!isFull3DScrub ? (
            <div className="pt-2">
              <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                <span className="text-[11px] text-zinc-400 font-light mr-1">Select Axial Slice:</span>
                {slices.map((sl) => (
                  <button
                    key={sl.slice_index}
                    onClick={() => setCurrentSliceIdx(sl.slice_index)}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-lg font-mono transition-all border flex items-center gap-1.5",
                      currentSlice.slice_index === sl.slice_index
                        ? "bg-white text-black border-white font-semibold shadow-md"
                        : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:text-white"
                    )}
                  >
                    <span>Z = {sl.slice_index}</span>
                    {sl.is_peak && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded">
                        Focus
                      </span>
                    )}
                    {sl.gt_voxels > 0 && (
                      <span className="text-[9px] text-zinc-400">({sl.gt_voxels} vox)</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 pt-2">
              <input
                type="range"
                min={0}
                max={totalSlices - 1}
                value={currentSlice.slice_index}
                onChange={(e) => setCurrentSliceIdx(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none"
              />
            </div>
          )}
        </div>
      ) : null}

      {/* Visual Displays Grid */}
      <div className="border border-zinc-800 bg-zinc-950/70 rounded-xl p-5 space-y-4">
        {/* View Mode & Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800/80 gap-3">
          <div className="flex items-center space-x-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "px-2.5 py-1 text-xs rounded transition-all flex items-center gap-1",
                viewMode === "grid" ? "bg-zinc-800 text-white shadow font-medium" : "text-zinc-400 hover:text-white"
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              4-Way Visual Grid
            </button>
            <button
              onClick={() => setViewMode("error")}
              className={cn(
                "px-2.5 py-1 text-xs rounded transition-all flex items-center gap-1",
                viewMode === "error" ? "bg-zinc-800 text-white shadow font-medium" : "text-zinc-400 hover:text-white"
              )}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              Confusion Error Diagnostic Map
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-400 font-light">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
              <span className="text-zinc-300">Ground Truth</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 inline-block" />
              <span className="text-zinc-300">Predicted Mask</span>
            </div>
            {viewMode === "error" && (
              <>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />
                  <span className="text-zinc-300">FP (Over-seg)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
                  <span className="text-zinc-300">FN (Missed)</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Visual Panels */}
        {!activeSlice && slices.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950">
            <Info className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
            <p className="text-sm text-zinc-400 font-medium">
              Scans not loaded for {subject.subject} ({subject.case_id}).
            </p>
          </div>
        ) : viewMode === "grid" ? (
          /* 4-Way Synchronized Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Raw Scan */}
            <div
              onClick={() => setFullscreenImage({ url: currentSlice.raw_url, title: `Raw Scan (Z=${currentSlice.slice_index})` })}
              className="group relative bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:border-zinc-600 transition-all shadow-md"
            >
              <div className="px-3 py-2 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-300">1. Raw MRI / CT Scan</span>
                <Maximize2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
              </div>
              <div className="aspect-square bg-black flex items-center justify-center p-1">
                <img
                  src={currentSlice.raw_url}
                  alt="Raw Scan"
                  className="w-full h-full object-contain filter contrast-125"
                  loading="lazy"
                />
              </div>
              <div className="px-3 py-1.5 bg-zinc-950 text-[10px] text-zinc-500 border-t border-zinc-900 flex justify-between">
                <span>Axial Slice Z={currentSlice.slice_index}</span>
                <span>Anatomy</span>
              </div>
            </div>

            {/* 2. Ground Truth Mask */}
            <div
              onClick={() => setFullscreenImage({ url: currentSlice.gt_url, title: `Ground Truth Mask (Z=${currentSlice.slice_index})` })}
              className="group relative bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:border-zinc-600 transition-all shadow-md"
            >
              <div className="px-3 py-2 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-medium text-emerald-400">2. GT Lesion Mask</span>
                <Maximize2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
              </div>
              <div className="aspect-square bg-black flex items-center justify-center p-1">
                <img
                  src={currentSlice.gt_url}
                  alt="GT Lesion Mask"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="px-3 py-1.5 bg-zinc-950 text-[10px] text-zinc-500 border-t border-zinc-900 flex justify-between">
                <span>{currentSlice.gt_voxels} Voxel Area</span>
                <span className="text-emerald-400">{currentSlice.gt_voxels > 0 ? "Lesion Present" : "Clear / 0 Vox"}</span>
              </div>
            </div>

            {/* 3. GT Overlay on Scan */}
            <div
              onClick={() => setFullscreenImage({ url: currentSlice.gt_overlay_url, title: `GT Mask + Scan Overlay (Z=${currentSlice.slice_index})` })}
              className="group relative bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:border-zinc-600 transition-all shadow-md"
            >
              <div className="px-3 py-2 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-medium text-emerald-400">3. GT + Scan Overlay</span>
                <Maximize2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
              </div>
              <div className="aspect-square bg-black flex items-center justify-center p-1">
                <img
                  src={currentSlice.gt_overlay_url}
                  alt="GT Overlay"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="px-3 py-1.5 bg-zinc-950 text-[10px] text-emerald-400/80 border-t border-zinc-900 flex justify-between">
                <span>Reference Mask Overlay</span>
                <span>Manual Annotation</span>
              </div>
            </div>

            {/* 4. Predicted Mask Overlay */}
            <div
              onClick={() => setFullscreenImage({ url: currentSlice.pred_overlay_url, title: `Predicted Mask Overlay (Z=${currentSlice.slice_index})` })}
              className="group relative bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:border-zinc-600 transition-all shadow-md"
            >
              <div className="px-3 py-2 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-medium text-cyan-400">4. Predicted Mask Overlay</span>
                <Maximize2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
              </div>
              <div className="aspect-square bg-black flex items-center justify-center p-1">
                <img
                  src={currentSlice.pred_overlay_url}
                  alt="Predicted Overlay"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="px-3 py-1.5 bg-zinc-950 text-[10px] text-cyan-400/80 border-t border-zinc-900 flex justify-between">
                <span>HS-UNet Prediction</span>
                <span>{currentSlice.pred_voxels} Voxels</span>
              </div>
            </div>
          </div>
        ) : (
          /* Error Confusion Diagnostic Map View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setFullscreenImage({ url: currentSlice.error_url, title: `Diagnostic Error Map (Z=${currentSlice.slice_index})` })}
              className="group relative bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:border-zinc-600 transition-all shadow-md"
            >
              <div className="px-3 py-2 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-medium text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  Confusion Error Map (TP: Green, FP: Red, FN: Blue)
                </span>
                <Maximize2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
              </div>
              <div className="aspect-square bg-black flex items-center justify-center p-2">
                <img
                  src={currentSlice.error_url}
                  alt="Error Map"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="px-3 py-2 bg-zinc-950 text-xs text-zinc-400 border-t border-zinc-900">
                Green = Correct Hit (TP) | Red = Over-segmented False Positive (FP) | Blue = Missed Lesion (FN)
              </div>
            </div>

            {/* Side-by-side comparison with GT */}
            <div
              onClick={() => setFullscreenImage({ url: currentSlice.gt_overlay_url, title: `Ground Truth Overlay (Z=${currentSlice.slice_index})` })}
              className="group relative bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:border-zinc-600 transition-all shadow-md"
            >
              <div className="px-3 py-2 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-medium text-emerald-400">
                  Ground Truth Reference (for direct comparison)
                </span>
                <Maximize2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
              </div>
              <div className="aspect-square bg-black flex items-center justify-center p-2">
                <img
                  src={currentSlice.gt_overlay_url}
                  alt="GT Overlay Reference"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="px-3 py-2 bg-zinc-950 text-xs text-zinc-400 border-t border-zinc-900">
                Target reference mask annotated by clinical neuroradiologists
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal Dialog */}
      {fullscreenImage && (
        <div
          onClick={() => setFullscreenImage(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white font-mono">{fullscreenImage.title}</h3>
              <button
                onClick={() => setFullscreenImage(null)}
                className="text-zinc-400 hover:text-white text-xs px-2 py-1 bg-zinc-900 rounded border border-zinc-800"
              >
                Close (ESC)
              </button>
            </div>
            <div className="p-6 bg-black flex items-center justify-center max-h-[75vh]">
              <img
                src={fullscreenImage.url}
                alt={fullscreenImage.title}
                className="max-h-[70vh] object-contain rounded shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
