import React, { useState } from "react";
import { LineChart, Activity, Zap, CheckCircle2, TrendingUp, Maximize2, Layers } from "lucide-react";
import { cn } from "../lib/utils";

export default function TrainingView({ trainingData }) {
  const [fullscreenImage, setFullscreenImage] = useState(false);
  const epochs = trainingData?.epochs || [];
  const finalEpoch = trainingData?.final_epoch || epochs[epochs.length - 1];

  // SVG mini-chart helper
  const renderLineChart = (dataKey, strokeColor, label, yUnit = "") => {
    if (epochs.length === 0) return null;
    const values = epochs.map((e) => e[dataKey]).filter((v) => v !== null && !isNaN(v));
    if (values.length === 0) return null;

    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;

    const width = 600;
    const height = 160;
    const padding = 20;

    const points = epochs
      .filter((e) => e[dataKey] !== null && !isNaN(e[dataKey]))
      .map((e, idx, arr) => {
        const x = padding + (idx / (arr.length - 1)) * (width - 2 * padding);
        const y = height - padding - ((e[dataKey] - minVal) / range) * (height - 2 * padding);
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-zinc-300">{label}</span>
          <span className="text-xs font-mono text-zinc-400">
            Min: {minVal.toFixed(4)} | Max: {maxVal.toFixed(4)} {yUnit}
          </span>
        </div>
        <div className="w-full overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36">
            <polyline
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
        <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
          <span>Epoch 0</span>
          <span>Epoch {epochs[epochs.length - 1]?.epoch || 100}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 h-full min-h-0 overflow-y-auto bg-black text-white p-6 space-y-6">
      {/* Header */}
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
              113 Logged Epochs
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-800/60 text-xs font-mono text-emerald-300">
              Converged
            </span>
          </div>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-zinc-800/80">
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3">
            <div className="text-[10px] uppercase text-zinc-500 tracking-wider">Final Train Loss</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {finalEpoch?.train_loss ?? -0.8354}
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Dice + Cross-Entropy</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3">
            <div className="text-[10px] uppercase text-zinc-500 tracking-wider">Final Val Loss</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {finalEpoch?.val_loss ?? -0.8706}
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Validation Set</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3">
            <div className="text-[10px] uppercase text-zinc-500 tracking-wider">Peak EMA Pseudo Dice</div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
              0.8762
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">checkpoint_best.pth</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3">
            <div className="text-[10px] uppercase text-zinc-500 tracking-wider">Learning Rate</div>
            <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">
              {finalEpoch?.lr ? finalEpoch.lr.toExponential(2) : "1.00e-4"}
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Poly Decay</div>
          </div>
        </div>
      </div>

      {/* Main Training Graph from nnUNet */}
      <div className="border border-zinc-800 bg-zinc-950/70 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <div>
            <h3 className="text-sm font-semibold text-white">nnU-Net Official Training Progress Plot</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Generated automatically during training in fold_0/progress.png
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

      {/* Epoch Curve Visualizations */}
      {epochs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderLineChart("train_loss", "#06B6D4", "Training Loss Progression (Train)")}
          {renderLineChart("val_loss", "#10B981", "Validation Loss Progression (Val)")}
          {renderLineChart("val_dice", "#3B82F6", "Validation Pseudo Dice Progression")}
          {renderLineChart("lr", "#F59E0B", "Learning Rate Schedule")}
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
                className="text-xs px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-700"
              >
                Close
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
