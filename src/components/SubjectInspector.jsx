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
import { cn, formatNumber, getDiceColor, getDiceBg } from "../lib/utils";

export default function SubjectInspector({ subject, onSelectSubject }) {
  const [metaLoading, setMetaLoading] = useState(false);
  const [dynamicMeta, setDynamicMeta] = useState(null);

  // Determine slices and total count (either pre-rendered or dynamically loaded)
  const visuals = subject?.visuals || dynamicMeta;
  const slices = visuals?.slices || [];
  const totalSlices = visuals?.total_slices || 0;
  const defaultSlice = visuals?.default_slice || 0;

  const [currentSliceIdx, setCurrentSliceIdx] = useState(defaultSlice);
  const [viewMode, setViewMode] = useState("grid"); // "grid", "error"
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(120); // ms per slice
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const playIntervalRef = useRef(null);

  // When subject changes, fetch metadata if not pre-rendered
  useEffect(() => {
    if (!subject) return;

    setIsPlaying(false);

    if (subject.visuals) {
      setDynamicMeta(null);
      setCurrentSliceIdx(subject.visuals.default_slice ?? 0);
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
          console.warn("Could not load dynamic meta, fallback to default", err);
          setMetaLoading(false);
        });
    }
  }, [subject?.case_id]);

  // Cine loop playback
  useEffect(() => {
    if (isPlaying && totalSlices > 0) {
      playIntervalRef.current = setInterval(() => {
        setCurrentSliceIdx((prev) => {
          if (prev >= totalSlices - 1) return 0;
          return prev + 1;
        });
      }, playSpeed);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, totalSlices, playSpeed]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "TEXTAREA") return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentSliceIdx((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentSliceIdx((prev) => Math.min(totalSlices - 1, prev + 1));
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalSlices]);

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

  const lesionProfile = visuals?.lesion_profile || [];
  const maxLesionVoxels = Math.max(...lesionProfile.map((p) => Math.max(p.gt, p.pred)), 1);

  // Active slice data (construct URLs for dynamic or static)
  const currentProfile = lesionProfile[currentSliceIdx] || { gt: 0, pred: 0 };
  const isPeak = currentSliceIdx === defaultSlice && (currentProfile.gt > 0 || currentProfile.pred > 0);

  const getSliceUrl = (type) => {
    if (subject.visuals && slices[currentSliceIdx]) {
      return slices[currentSliceIdx][`${type}_url`];
    }
    return `/api/slice?case_id=${subject.case_id}&z=${currentSliceIdx}&type=${type}`;
  };

  const currentSlice = {
    slice_index: currentSliceIdx,
    is_peak: isPeak,
    gt_voxels: currentProfile.gt,
    pred_voxels: currentProfile.pred,
    raw_url: getSliceUrl("raw"),
    gt_url: getSliceUrl("gt"),
    gt_overlay_url: getSliceUrl("gt_overlay"),
    pred_url: getSliceUrl("pred"),
    pred_overlay_url: getSliceUrl("pred_overlay"),
    error_url: getSliceUrl("error"),
  };

  const lesionSpan = lesionProfile.filter((p) => p.gt > 0 || p.pred > 0);
  const firstLesionSlice = lesionSpan.length > 0 ? lesionSpan[0].slice : null;
  const lastLesionSlice = lesionSpan.length > 0 ? lesionSpan[lesionSpan.length - 1].slice : null;

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-black text-white p-6 space-y-5">
      {/* Top Header Card */}
      <div className="border border-zinc-800 bg-zinc-950/70 rounded-xl p-5 backdrop-blur">
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
              {totalSlices > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-950/40 border border-cyan-800/60 text-cyan-300">
                  {totalSlices} Slices (Full 3D)
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-1.5 font-light">
              Dataset Split: <span className="text-zinc-300 font-mono">{subject.split_source}</span>
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
              {subject.hd95 !== null ? `${subject.hd95.toFixed(2)}` : "N/A"}
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
              {subject.ref_vol_ml === 0 ? "True Negative" : "Reference Lesion"}
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

      {/* 3D Volume Slices Navigator & Controls */}
      {metaLoading ? (
        <div className="border border-zinc-800 bg-zinc-950 rounded-xl p-8 flex items-center justify-center space-x-3 text-zinc-400 text-xs font-mono">
          <Loader2 className="w-5 h-5 animate-spin text-white" />
          <span>Accessing 3D NIfTI Volume & Precomputing Slices...</span>
        </div>
      ) : totalSlices > 0 ? (
        <div className="border border-zinc-800 bg-zinc-950/70 rounded-xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Slice Position Status */}
            <div className="flex items-center space-x-3">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">Axial Depth:</span>
              <span className="text-sm font-bold font-mono text-white bg-zinc-900 border border-zinc-700 px-3 py-1 rounded-md shadow-inner">
                Slice Z = {currentSliceIdx} <span className="text-zinc-500 font-normal">/ {totalSlices - 1}</span>
              </span>

              {isPeak && (
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-emerald-400" />
                  Peak Lesion Slice
                </span>
              )}

              <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
                (GT: <span className="text-emerald-400 font-medium">{currentSlice.gt_voxels}</span> voxels | Pred: <span className="text-cyan-400 font-medium">{currentSlice.pred_voxels}</span> voxels)
              </span>
            </div>

            {/* Step & Playback Controls */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setCurrentSliceIdx(0)}
                title="First Slice (Z=0)"
                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-300 hover:text-white transition-colors"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentSliceIdx((prev) => Math.max(0, prev - 1))}
                title="Previous Slice (Left Arrow)"
                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-300 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

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

              <button
                onClick={() => setCurrentSliceIdx((prev) => Math.min(totalSlices - 1, prev + 1))}
                title="Next Slice (Right Arrow)"
                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-300 hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentSliceIdx(totalSlices - 1)}
                title="Last Slice"
                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-300 hover:text-white transition-colors"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>

              {defaultSlice !== undefined && (
                <button
                  onClick={() => setCurrentSliceIdx(defaultSlice)}
                  title="Jump directly to Max Lesion Area or Center of Brain"
                  className="ml-2 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-emerald-900/60 text-emerald-400 text-xs rounded font-medium flex items-center gap-1 transition-colors"
                >
                  <Target className="w-3.5 h-3.5" />
                  Jump to Focus (Z={defaultSlice})
                </button>
              )}
            </div>
          </div>

          {/* Continuous Interactive Slice Slider */}
          <div className="space-y-1.5 pt-2">
            <input
              type="range"
              min={0}
              max={totalSlices - 1}
              value={currentSliceIdx}
              onChange={(e) => setCurrentSliceIdx(Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none"
            />

            {/* Lesion Depth Profile Strip */}
            {lesionProfile.length > 0 && (
              <div className="relative pt-1">
                <div className="h-6 w-full bg-zinc-900/80 rounded border border-zinc-800 flex items-end px-0.5 overflow-hidden">
                  {lesionProfile.map((p) => {
                    const heightPct = (Math.max(p.gt, p.pred) / maxLesionVoxels) * 100;
                    const isSelected = p.slice === currentSliceIdx;
                    return (
                      <div
                        key={p.slice}
                        onClick={() => setCurrentSliceIdx(p.slice)}
                        title={`Slice ${p.slice}: GT ${p.gt} voxels, Pred ${p.pred} voxels`}
                        style={{ width: `${100 / totalSlices}%`, height: `${Math.max(10, heightPct)}%` }}
                        className={cn(
                          "transition-colors cursor-pointer",
                          isSelected
                            ? "bg-white"
                            : p.gt > 0 && p.pred > 0
                            ? "bg-emerald-500/80 hover:bg-emerald-400"
                            : p.pred > 0
                            ? "bg-cyan-500/80 hover:bg-cyan-400"
                            : p.gt > 0
                            ? "bg-blue-500/80 hover:bg-blue-400"
                            : "bg-zinc-800/40 hover:bg-zinc-700/60"
                        )}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono mt-1">
                  <span>Slice 0 (Inferior Base)</span>
                  {firstLesionSlice !== null ? (
                    <span className="text-zinc-400">
                      Lesion Extent: Z={firstLesionSlice} to Z={lastLesionSlice} ({lesionSpan.length} Slices)
                    </span>
                  ) : (
                    <span className="text-zinc-500 italic">No focal lesion present (Stroke-negative control scan)</span>
                  )}
                  <span>Slice {totalSlices - 1} (Superior Vertex)</span>
                </div>
              </div>
            )}
          </div>
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
        {totalSlices === 0 && !metaLoading ? (
          <div className="p-12 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950">
            <Info className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
            <p className="text-sm text-zinc-400 font-medium">
              Loading slices for {subject.subject} ({subject.case_id})...
            </p>
          </div>
        ) : viewMode === "grid" ? (
          /* 4-Way Synchronized Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Raw Scan */}
            <div
              onClick={() => setFullscreenImage({ url: currentSlice.raw_url, title: `Raw Scan (Z=${currentSliceIdx})` })}
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
                <span>Axial Slice {currentSliceIdx}</span>
                <span>Anatomy</span>
              </div>
            </div>

            {/* 2. Ground Truth Mask */}
            <div
              onClick={() => setFullscreenImage({ url: currentSlice.gt_url, title: `Ground Truth Mask (Z=${currentSliceIdx})` })}
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
              onClick={() => setFullscreenImage({ url: currentSlice.gt_overlay_url, title: `GT Mask + Scan Overlay (Z=${currentSliceIdx})` })}
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
              onClick={() => setFullscreenImage({ url: currentSlice.pred_overlay_url, title: `Predicted Mask Overlay (Z=${currentSliceIdx})` })}
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
              onClick={() => setFullscreenImage({ url: currentSlice.error_url, title: `Diagnostic Error Map (Z=${currentSliceIdx})` })}
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
              onClick={() => setFullscreenImage({ url: currentSlice.gt_overlay_url, title: `Ground Truth Overlay (Z=${currentSliceIdx})` })}
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
