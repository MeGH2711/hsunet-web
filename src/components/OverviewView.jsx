import React from "react";
import { Activity, ShieldCheck, Award, Zap, Brain, Layers, BarChart3, ArrowRight, GitFork } from "lucide-react";
import { cn, getDiceColor, getDiceBg, getSplitBadge, getSplitDot } from "../lib/utils";

export default function OverviewView({ data, onSelectSubject, onGoToInspector }) {
  const summary = data?.summary || {};
  const cases = data?.cases || [];

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
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-black text-white p-6 space-y-6">
      {/* Top Banner */}
      <div className="border border-zinc-800 bg-zinc-950/70 rounded-xl p-6 relative overflow-hidden">
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
      <div className="border border-zinc-800 bg-zinc-950/70 rounded-xl p-5 space-y-4">
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
      <div className="border border-zinc-800 bg-zinc-950/70 rounded-xl p-5 space-y-4">
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

      {/* Featured Visual Samples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
