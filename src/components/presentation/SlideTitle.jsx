import React, { useState, useEffect } from "react";
import {
  Brain,
  Cpu,
  GraduationCap,
  Sparkles,
  Layers,
  ShieldCheck,
  Activity,
  Award,
  ChevronRight,
  Network,
  Scale
} from "lucide-react";
import { PRESENTATION_METADATA } from "./slidesData";

export default function SlideTitle() {
  const [pulsePhase, setPulsePhase] = useState(0);
  const [activeScale, setActiveScale] = useState("small");

  useEffect(() => {
    const timer = setInterval(() => {
      setPulsePhase((p) => (p + 1) % 100);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-8 md:p-12 lg:p-16 overflow-hidden select-none bg-white text-[#801214]">
      {/* Background Subtle Geometric Mesh in #801214 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#801214]/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] rounded-full bg-[#801214]/6 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#801214_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.06]" />
      </div>

      {/* TOP BAR: Tag & Top-Right AU Logo */}
      <div className="relative z-30 flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#801214] text-white text-xs font-semibold tracking-wider uppercase shadow-md shadow-[#801214]/20 border border-[#801214]">
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>Research Presentation</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#801214]/10 text-[#801214] text-xs font-bold border border-[#801214]/20">
            <ShieldCheck className="w-3.5 h-3.5 text-[#801214]" />
            <span>ISLES 2026 / ATLAS 3.0</span>
          </div>
        </div>

        {/* Top-Right AU Logo */}
        <div className="flex items-center">
          <div className="bg-white px-4 py-2 rounded-xl shadow-lg border-2 border-[#801214]/20 flex items-center transition-all duration-300 hover:border-[#801214] hover:shadow-xl hover:scale-105">
            <img
              src={PRESENTATION_METADATA.logoUrl}
              alt="Ahmedabad University Logo"
              className="h-10 md:h-12 w-auto object-contain block"
            />
          </div>
        </div>
      </div>

      {/* MAIN SLIDE CONTENT: 2-Column High Impact Layout */}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-1 my-auto pt-4 pb-2">
        {/* Left Column: Title, Subtitle, Presenters & Affiliation */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-[#801214]/10 border border-[#801214]/30 text-[#801214] text-xs font-mono font-bold w-fit tracking-wide">
            <Scale className="w-3.5 h-3.5 text-[#801214]" />
            <span>Scale-Invariant Lesion Segmentation</span>
          </div>

          {/* Main Title */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5.5xl font-black text-[#801214] tracking-tight leading-[1.12]">
              <span className="text-black">HyperScale-UNet:</span>{" "}
              <span className="text-[#801214]">
                Scale-Invariant Architecture
              </span>{" "}
              <span className="block text-2xl sm:text-3xl md:text-4xl text-[#52090b] font-bold mt-1">
                for Ischemic Stroke Lesion Segmentation
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-zinc-700 font-medium leading-relaxed max-w-2xl pt-1">
              A Unified Framework Optimizing Small (&lt; 1.5 mL), Medium, and Large Lesion Segmentation across 55 Multi-Centric Sites
            </p>
          </div>

          {/* Key Architectural Highlights Strip */}
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-xl">
            <div className="bg-white border-2 border-[#801214]/30 rounded-xl p-3 shadow-sm hover:border-[#801214] transition">
              <div className="flex items-center gap-2 text-[#801214] mb-1">
                <Network className="w-4 h-4 text-[#801214]" />
                <span className="text-[11px] font-mono text-zinc-500 uppercase font-bold">Architecture</span>
              </div>
              <div className="text-sm font-black text-black">HyperScale-UNet</div>
            </div>

            <div className="bg-white border-2 border-[#801214]/30 rounded-xl p-3 shadow-sm hover:border-[#801214] transition">
              <div className="flex items-center gap-2 text-[#801214] mb-1">
                <Layers className="w-4 h-4 text-[#801214]" />
                <span className="text-[11px] font-mono text-zinc-500 uppercase font-bold">Scale Range</span>
              </div>
              <div className="text-sm font-black text-black">4 Orders of Mag.</div>
            </div>

            <div className="bg-white border-2 border-[#801214]/30 rounded-xl p-3 shadow-sm hover:border-[#801214] transition">
              <div className="flex items-center gap-2 text-[#801214] mb-1">
                <Award className="w-4 h-4 text-[#801214]" />
                <span className="text-[11px] font-mono text-zinc-500 uppercase font-bold">Corpus</span>
              </div>
              <div className="text-sm font-black text-black">1,453 Cases • 55 Sites</div>
            </div>
          </div>

          {/* Presenters & School Card */}
          <div className="bg-white text-zinc-900 rounded-2xl p-5 md:p-6 shadow-xl border-2 border-[#801214] flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-2xl">
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-[#801214] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#801214]" />
                <span>Presenters</span>
              </div>
              <div className="text-xl md:text-2xl font-black text-black tracking-tight">
                Megh Patel and Konark Karia
              </div>
              <div className="text-sm md:text-base font-bold text-[#801214]">
                School of Engineering and Applied Science
              </div>
              <div className="text-xs text-zinc-600 font-semibold">
                Ahmedabad University, Gujarat, India
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end justify-center shrink-0 border-l-2 border-[#801214]/20 pl-4 space-y-1">
              <div className="w-10 h-10 rounded-xl bg-[#801214] flex items-center justify-center text-white shadow-md shadow-[#801214]/30">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-[10px] font-mono font-bold text-[#801214]">ISLES 2026</span>
            </div>
          </div>
        </div>

        {/* Right Column: Animated HyperScale Lesion Scale Visualizer */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-md rounded-2xl bg-white border-2 border-[#801214] p-5 shadow-2xl overflow-hidden group">
            {/* Top Bar of Graphic */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#801214]/20">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#801214] animate-ping" />
                <span className="text-xs font-mono font-black text-[#801214] uppercase tracking-wider">
                  HyperScale-UNet Visualizer
                </span>
              </div>
              <div className="flex items-center gap-1 bg-[#801214] px-2.5 py-0.5 rounded text-[10px] font-mono font-bold text-white">
                <span>Multi-Scale Scan</span>
              </div>
            </div>

            {/* Simulated Brain Slice with Animated Scanning & Multi-Scale Attention */}
            <div className="relative w-full aspect-square rounded-xl bg-[#faf5f5] border-2 border-[#801214]/30 flex items-center justify-center overflow-hidden">
              {/* Scan Slice Image from dataset */}
              <img
                src="/data/subjects/ISLES_1170/hsunet/strip.png"
                alt="Brain Slice Scan"
                className="absolute inset-0 w-full h-full object-contain filter contrast-125 mix-blend-multiply"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              {/* Multi-Scale Pyramid Grid in Crimson #801214 */}
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="border border-[#801214]/20 flex items-start justify-start p-1"
                  >
                    <span className="text-[8px] font-mono font-bold text-[#801214]/40">
                      S{i + 1}
                    </span>
                  </div>
                ))}
              </div>

              {/* Animated Horizontal Laser Scan Beam in AU Crimson */}
              <div
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#801214] to-transparent shadow-[0_0_12px_#801214] z-10 transition-all pointer-events-none"
                style={{
                  top: `${(pulsePhase * 1.5) % 100}%`,
                }}
              />

              {/* Focal Lesion Detection Callout & Bounding Box */}
              <div className="absolute top-[38%] left-[45%] w-20 h-20 border-2 border-[#801214] rounded-lg bg-[#801214]/20 backdrop-blur-[1px] animate-pulse flex flex-col justify-between p-1 z-20 shadow-[0_0_15px_rgba(128,18,20,0.3)]">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-black text-white bg-[#801214] px-1 rounded">
                    INFARCT
                  </span>
                  <span className="text-[9px] font-mono font-black text-[#801214] bg-white px-1 rounded">
                    98.4%
                  </span>
                </div>
                <div className="text-[8px] font-mono font-black text-[#801214] bg-white/90 px-1 rounded text-right">
                  Vol: 18.2 mL
                </div>
              </div>

              {/* Small Co-Lesion Satellite Callout (< 1.5 mL) */}
              <div className="absolute top-[62%] left-[34%] w-10 h-10 border-2 border-[#801214] rounded bg-[#801214]/30 animate-pulse flex items-center justify-center z-10 shadow-sm">
                <span className="text-[7px] font-mono font-black text-white bg-[#801214] px-0.5 rounded">
                  0.18 mL
                </span>
              </div>

              {/* Live HUD telemetry badges in Light Theme */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between z-20 px-2.5 py-1.5 bg-white/95 rounded-lg border border-[#801214]/30 text-[10px] font-mono shadow-md">
                <span className="text-[#801214] font-black flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-[#801214]" /> HyperScale-UNet
                </span>
                <span className="text-[#801214] font-bold">Dice: 0.892</span>
              </div>
            </div>

            {/* Interactive Scale Mode Selector Buttons */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <button
                onClick={() => setActiveScale("small")}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                  activeScale === "small"
                    ? "bg-[#801214] text-white shadow-md"
                    : "bg-[#801214]/10 text-[#801214] hover:bg-[#801214]/20"
                }`}
              >
                Small (&lt;1.5 mL)
              </button>
              <button
                onClick={() => setActiveScale("medium")}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                  activeScale === "medium"
                    ? "bg-[#801214] text-white shadow-md"
                    : "bg-[#801214]/10 text-[#801214] hover:bg-[#801214]/20"
                }`}
              >
                Medium (1.5-15)
              </button>
              <button
                onClick={() => setActiveScale("large")}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                  activeScale === "large"
                    ? "bg-[#801214] text-white shadow-md"
                    : "bg-[#801214]/10 text-[#801214] hover:bg-[#801214]/20"
                }`}
              >
                Large (&gt;15 mL)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER NOTE: Title slide intentionally has NO slide number */}
      <div className="relative z-20 flex items-center justify-between text-xs text-[#801214] pt-4 border-t-2 border-[#801214]/20">
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-[#801214]" />
          <span>Ahmedabad University • School of Engineering and Applied Science</span>
        </div>
        <div className="font-mono text-[11px] font-bold text-[#801214]">
          Megh Patel & Konark Karia
        </div>
      </div>
    </div>
  );
}
