import React, { useState, useEffect } from "react";
import {
  Activity,
  Layers,
  BrainCircuit,
  AlertCircle,
  Clock,
  Scan,
  CheckCircle2,
  Sliders,
  Sparkles,
  BarChart3,
  Cpu,
  Scale,
  Building2
} from "lucide-react";
import { PRESENTATION_METADATA } from "./slidesData";

export default function SlideIntroduction() {
  const [activeCategory, setActiveCategory] = useState("small");
  const [scanPos, setScanPos] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setScanPos((p) => (p + 1) % 100);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 md:p-10 lg:p-14 overflow-hidden select-none bg-white text-[#801214]">
      {/* Background Subtle Geometric Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 right-1/3 w-80 h-80 rounded-full bg-[#801214]/5 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-[#801214]/6 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#801214_1px,transparent_1px)] [background-size:26px_26px] opacity-[0.06]" />
      </div>

      {/* TOP BAR: Tag & Top-Right AU Logo */}
      <div className="relative z-30 flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#801214] text-white text-xs font-semibold tracking-wider uppercase shadow-md border border-[#801214]">
            <Activity className="w-3.5 h-3.5 text-white" />
            <span>Problem & Challenge</span>
          </div>
          <span className="hidden sm:inline-block text-[#801214] text-xs font-mono font-bold bg-[#801214]/10 px-3 py-1 rounded-full border border-[#801214]/20">
            ISLES 2026 / ATLAS 3.0 Clinical Corpus
          </span>
        </div>

        {/* Top-Right AU Logo */}
        <div className="flex items-center">
          <div className="bg-white px-4 py-2 rounded-xl shadow-lg border-2 border-[#801214]/20 flex items-center transition-all hover:border-[#801214] hover:scale-105">
            <img
              src={PRESENTATION_METADATA.logoUrl}
              alt="Ahmedabad University Logo"
              className="h-10 md:h-12 w-auto object-contain block"
            />
          </div>
        </div>
      </div>

      {/* SLIDE HEADING */}
      <div className="relative z-20 mt-2 mb-3">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4.5xl font-black text-black tracking-tight leading-tight">
          The Challenge:{" "}
          <span className="text-[#801214]">
            Profound Scale Divergence Across 4 Orders of Magnitude
          </span>
        </h2>
        <p className="text-sm md:text-base text-zinc-700 font-medium mt-1">
          Why standard architectures fail on small lesions and how HyperScale-UNet achieves scale-invariance across 55 clinical centres
        </p>
      </div>

      {/* MAIN CONTENT GRID: 3 Core Failure Mode Pillars + Live Multi-Scale Scanner */}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-stretch my-auto">
        {/* Left Column: 3 Structured Content Cards (Dense, Large Text, Zero Wasted Whitespace) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
          {/* Card 1: Small Lesion Underdetection */}
          <div className="bg-white text-zinc-900 rounded-xl p-4 md:p-5 shadow-lg border-2 border-[#801214] flex items-start gap-4">
            <div className="w-11 h-11 rounded-lg bg-[#801214] flex items-center justify-center shrink-0 text-white shadow-md">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-[#801214] uppercase tracking-wider">
                  Critical Failure Mode 01
                </span>
                <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-[#801214] text-white">
                  Dice Collapses to 0.399
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-black text-black">
                Small Lesion Underdetection (&lt; 1.5 mL)
              </h3>
              <p className="text-xs sm:text-sm text-zinc-700 font-medium leading-relaxed">
                29.9% of all benchmark cases are small lesions (smallest is just 0.012 mL / 12 voxels). Standard volume-weighted Dice loss causes gradient starvation: a 100 mL lesion overwhelms a small lesion signal by 1,000×.
              </p>
            </div>
          </div>

          {/* Card 2: 66% Multi-Lesion Fraction */}
          <div className="bg-white text-zinc-900 rounded-xl p-4 md:p-5 shadow-lg border-2 border-[#801214] flex items-start gap-4">
            <div className="w-11 h-11 rounded-lg bg-[#801214] flex items-center justify-center shrink-0 text-white shadow-md">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-[#801214] uppercase tracking-wider">
                  Structural Complexity 02
                </span>
                <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-[#801214] text-white">
                  66% Multi-Lesion Cases
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-black text-black">
                Discrete Co-Lesions: 1 to 15 Components Per Patient
              </h3>
              <p className="text-xs sm:text-sm text-zinc-700 font-medium leading-relaxed">
                Standard models achieve acceptable overall Dice on the dominant primary lesion while completely missing smaller satellite co-lesions, risking severe diagnostic oversight in clinical thrombectomy evaluation.
              </p>
            </div>
          </div>

          {/* Card 3: Multi-Centric Covariate Shift */}
          <div className="bg-white text-zinc-900 rounded-xl p-4 md:p-5 shadow-lg border-2 border-[#801214] flex items-start gap-4">
            <div className="w-11 h-11 rounded-lg bg-[#801214] flex items-center justify-center shrink-0 text-white shadow-md">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-[#801214] uppercase tracking-wider">
                  Domain Shift 03
                </span>
                <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-[#801214] text-white">
                  55 Clinical Sites
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-black text-black">
                Extreme Scanner & Intensity Heterogeneity
              </h3>
              <p className="text-xs sm:text-sm text-zinc-700 font-medium leading-relaxed">
                Highly unbalanced site distribution (from 1 to 169 cases per site) and intense foreground outliers (intensity std 94,929 vs median 249) cause standard batch normalization to fail.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: HyperScale Scanner Simulator in Pure Light Theme */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white border-2 border-[#801214] rounded-2xl p-4 md:p-5 shadow-2xl">
          {/* Header of Visual Tool */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#801214]/20">
            <div className="flex items-center gap-2">
              <Scan className="w-4 h-4 text-[#801214] animate-pulse" />
              <span className="text-xs font-mono font-black text-[#801214] uppercase tracking-wider">
                HyperScale-UNet Scale Inspection
              </span>
            </div>
            <div className="text-[10px] font-mono font-bold text-white bg-[#801214] px-2 py-0.5 rounded">
              1,453 Cases • 55 Sites
            </div>
          </div>

          {/* Multi-Scale Brain Slice Display in Light Theme */}
          <div className="relative my-3 w-full aspect-[4/3] rounded-xl bg-[#faf5f5] border-2 border-[#801214]/30 flex items-center justify-center overflow-hidden shadow-inner">
            {/* Real MRI Slice Strip Image from dataset */}
            <img
              src="/data/subjects/ISLES_1170/hsunet/strip.png"
              alt="Clinical Stroke Scan"
              className="w-full h-full object-contain filter contrast-125 mix-blend-multiply"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            {/* Scanning Laser Beam in AU Crimson */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#801214] to-transparent shadow-[0_0_12px_#801214] z-10 pointer-events-none"
              style={{
                left: `${scanPos}%`,
              }}
            />

            {/* Scale-Specific Callouts */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative w-3/4 h-3/4">
                {/* Primary Lesion Callout */}
                <div className="absolute top-[35%] right-[28%] w-16 h-16 rounded-full border-2 border-[#801214] bg-[#801214]/25 backdrop-blur-xs animate-pulse shadow-md flex items-center justify-center">
                  <span className="text-[9px] font-mono font-black text-white bg-[#801214] px-1 py-0.5 rounded shadow">
                    CORE: 98%
                  </span>
                </div>

                {/* Satellite Small Lesion Callout */}
                <div className="absolute bottom-[28%] right-[34%] w-9 h-9 rounded-full border-2 border-[#801214] bg-[#801214]/40 animate-pulse flex items-center justify-center shadow">
                  <span className="text-[8px] font-mono font-black text-white bg-[#801214] px-1 rounded">
                    0.12 mL
                  </span>
                </div>
              </div>
            </div>

            {/* Mode Indicator Overlay */}
            <div className="absolute top-2 left-2 bg-white/95 px-2.5 py-1 rounded-md border border-[#801214]/40 text-[10px] font-mono text-[#801214] font-black shadow flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#801214]" />
              <span className="uppercase">{activeCategory} Lesion Category</span>
            </div>

            {/* Telemetry Badge */}
            <div className="absolute bottom-2 right-2 bg-white/95 px-2.5 py-1 rounded-md border border-[#801214]/40 text-[10px] font-mono text-[#801214] shadow font-bold">
              HyperScale: <span className="text-black font-black">Dice 0.892</span>
            </div>
          </div>

          {/* Scale Category Selector Buttons */}
          <div className="grid grid-cols-3 gap-2 mb-2">
            <button
              onClick={() => setActiveCategory("small")}
              className={`py-1.5 px-1 rounded-lg text-xs font-black uppercase transition ${
                activeCategory === "small"
                  ? "bg-[#801214] text-white shadow"
                  : "bg-[#801214]/10 text-[#801214] hover:bg-[#801214]/20"
              }`}
            >
              Small (&lt;1.5 mL)
            </button>
            <button
              onClick={() => setActiveCategory("medium")}
              className={`py-1.5 px-1 rounded-lg text-xs font-black uppercase transition ${
                activeCategory === "medium"
                  ? "bg-[#801214] text-white shadow"
                  : "bg-[#801214]/10 text-[#801214] hover:bg-[#801214]/20"
              }`}
            >
              Medium (1.5-15)
            </button>
            <button
              onClick={() => setActiveCategory("large")}
              className={`py-1.5 px-1 rounded-lg text-xs font-black uppercase transition ${
                activeCategory === "large"
                  ? "bg-[#801214] text-white shadow"
                  : "bg-[#801214]/10 text-[#801214] hover:bg-[#801214]/20"
              }`}
            >
              Large (&gt;15 mL)
            </button>
          </div>

          {/* Quantitative Clinical Summary Badges in Light Theme */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t-2 border-[#801214]/20 text-center">
            <div className="bg-[#faf5f5] p-1.5 rounded-lg border border-[#801214]/20">
              <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Min Volume</div>
              <div className="text-xs font-black text-[#801214]">0.012 mL (12 vox)</div>
            </div>
            <div className="bg-[#faf5f5] p-1.5 rounded-lg border border-[#801214]/20">
              <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Max Volume</div>
              <div className="text-xs font-black text-[#801214]">387.6 mL</div>
            </div>
            <div className="bg-[#faf5f5] p-1.5 rounded-lg border border-[#801214]/20">
              <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Multi-Lesion</div>
              <div className="text-xs font-black text-[#801214]">66% of Patients</div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER BAR: SEAS Note on Left & STRICT SLIDE NUMBER ON BOTTOM RIGHT */}
      <div className="relative z-20 flex items-center justify-between text-xs text-[#801214] pt-3 border-t-2 border-[#801214]/20">
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-[#801214]" />
          <span>School of Engineering and Applied Science • Ahmedabad University</span>
        </div>

        {/* BOTTOM RIGHT SLIDE NUMBER: Slide 2 MUST have slide number */}
        <div className="flex items-center gap-1.5 bg-[#801214] text-white px-3.5 py-1 rounded-full font-mono text-xs font-bold shadow-lg border border-[#801214]">
          <span className="text-white/80 text-[10px] uppercase font-sans tracking-wider">Slide</span>
          <span className="text-white font-black">02</span>
        </div>
      </div>
    </div>
  );
}
