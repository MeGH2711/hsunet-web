import React from "react";
import {
  Brain,
  GraduationCap,
  Sparkles,
  Layers,
  ShieldCheck,
  Scale,
  Building2,
  Award
} from "lucide-react";
import { PRESENTATION_METADATA } from "./slidesData";

export default function SlideTitle() {
  return (
    <div className="relative w-full h-full flex flex-col justify-between pt-4 sm:pt-5 md:pt-6 px-6 sm:px-10 lg:px-12 pb-4 sm:pb-6 overflow-hidden select-none bg-white text-[#801214]">
      {/* Background Subtle Geometric Mesh & Ambient Crimson Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[52rem] h-[52rem] rounded-full bg-[#801214]/4 blur-3xl" />
        <div className="absolute top-0 right-0 w-[28rem] h-[28rem] rounded-full bg-[#801214]/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[28rem] h-[28rem] rounded-full bg-[#801214]/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#801214_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.05]" />
      </div>

      {/* TOP BAR: Tag & Top-Right AU Logo */}
      <div className="relative z-30 flex items-center justify-between w-full">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#801214] text-white text-xs font-semibold tracking-wider uppercase shadow-md shadow-[#801214]/20 border border-[#801214]">
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>AI for Health</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#801214]/10 text-[#801214] text-xs font-bold border border-[#801214]/20">
            <ShieldCheck className="w-3.5 h-3.5 text-[#801214]" />
            <span>ISLES 2026 / ATLAS 3.0</span>
          </div>
        </div>

        {/* Top-Right AU Logo */}
        <div className="flex items-center">
          <img
            src={PRESENTATION_METADATA.logoUrl}
            alt="Ahmedabad University Logo"
            className="h-12 sm:h-14 md:h-16 lg:h-18 w-auto object-contain block select-none transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

      {/* MAIN CENTER-ALIGNED SLIDE CONTENT: Fully Balanced & Proportional White Space */}
      <div className="relative z-20 flex-1 flex flex-col justify-evenly items-center text-center max-w-6xl xl:max-w-7xl mx-auto w-full px-4 sm:px-6 py-2 sm:py-3">
        {/* Top Centered Category Pill */}
        <div className="inline-flex items-center gap-2.5 px-5 py-1.5 rounded-full bg-[#801214]/10 border border-[#801214]/30 text-[#801214] text-xs sm:text-sm font-mono font-bold tracking-wider uppercase shadow-xs">
          <Scale className="w-4 h-4 text-[#801214]" />
          <span>Scale-Invariant Architecture for Stroke Lesion Segmentation</span>
        </div>

        {/* Main Title & Subtitle */}
        <div className="space-y-2 max-w-6xl mx-auto">
          <h1 className="tracking-tight select-none">
            <span className="block text-3xl sm:text-4.5xl md:text-5.5xl lg:text-6xl xl:text-6.5xl font-black text-[#801214] leading-[1.08]">
              <span className="text-black">HyperScale-UNet:</span>{" "}
              <span className="text-[#801214]">Scale-Invariant Architecture</span>
            </span>
            <span className="block text-xl sm:text-2.5xl md:text-3xl lg:text-3.5xl xl:text-4xl text-[#52090b] font-extrabold mt-2 leading-snug">
              for Ischemic Stroke Lesion Segmentation
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-zinc-600 font-medium max-w-5xl mx-auto leading-relaxed pt-1">
            A Unified Deep Learning Architecture Optimizing Small (&lt; 1.5 mL), Medium, and Large Lesions Across 55 Multi-Centric Clinical Sites
          </p>
        </div>

        {/* Centered 3-Pillar Architectural Highlight Cards (Widescreen Canvas Utilization) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 w-full max-w-5xl xl:max-w-6xl mx-auto">
          <div className="bg-white border-2 border-[#801214]/25 hover:border-[#801214] rounded-2xl p-5 sm:p-6 lg:p-7 shadow-md transition-all hover:shadow-xl hover:-translate-y-0.5">
            <div className="flex items-center justify-center gap-2 text-[#801214] mb-2">
              <Scale className="w-5 h-5 text-[#801214]" />
              <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-zinc-500">Scale Invariance</span>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tight">4 Orders of Mag.</div>
            <div className="text-xs sm:text-sm lg:text-base text-zinc-600 font-semibold mt-1.5">0.012 mL to 387.6 mL Coverage</div>
          </div>

          <div className="bg-white border-2 border-[#801214]/25 hover:border-[#801214] rounded-2xl p-5 sm:p-6 lg:p-7 shadow-md transition-all hover:shadow-xl hover:-translate-y-0.5">
            <div className="flex items-center justify-center gap-2 text-[#801214] mb-2">
              <Building2 className="w-5 h-5 text-[#801214]" />
              <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-zinc-500">Clinical Scope</span>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tight">1,453 Cases</div>
            <div className="text-xs sm:text-sm lg:text-base text-zinc-600 font-semibold mt-1.5">55 Multi-Centric Sites</div>
          </div>

          <div className="bg-white border-2 border-[#801214]/25 hover:border-[#801214] rounded-2xl p-5 sm:p-6 lg:p-7 shadow-md transition-all hover:shadow-xl hover:-translate-y-0.5">
            <div className="flex items-center justify-center gap-2 text-[#801214] mb-2">
              <Layers className="w-5 h-5 text-[#801214]" />
              <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-zinc-500">Multi-Lesion</span>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tight">66% Co-Lesions</div>
            <div className="text-xs sm:text-sm lg:text-base text-zinc-600 font-semibold mt-1.5">1 to 15 Discrete Components</div>
          </div>
        </div>

        {/* Presenters & Academic Institution Card: Executive Split Horizontal Layout */}
        <div className="bg-white rounded-2xl px-8 sm:px-12 py-5 sm:py-6 border-2 border-[#801214] shadow-xl w-full max-w-5xl xl:max-w-6xl mx-auto transition-all duration-300 hover:shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left Column: Presenters */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
              <div className="text-xs font-bold text-[#801214] uppercase tracking-widest font-mono flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#801214]" />
                <span>Presented By</span>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-3.5xl font-black text-black tracking-tight">
                Megh Patel <span className="text-[#801214] font-semibold text-xl sm:text-2xl">&amp;</span> Konark Karia
              </div>
              <div className="text-xs sm:text-sm text-zinc-500 font-medium">
                B.Tech Honors Thesis in Computer Science &amp; Engineering
              </div>
            </div>

            {/* Right Column: Institution */}
            <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-1 md:border-l md:border-[#801214]/20 md:pl-8">
              <div className="text-xs font-bold text-[#801214] uppercase tracking-widest font-mono flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#801214]" />
                <span>Academic Institution</span>
              </div>
              <div className="text-xl sm:text-2xl lg:text-2.5xl font-black text-[#801214]">
                School of Engineering and Applied Science
              </div>
              <div className="text-xs sm:text-sm text-zinc-600 font-semibold">
                Ahmedabad University, Gujarat, India
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER: Center Aligned & Strictly NO Slide Number */}
      <div className="relative z-20 flex items-center justify-between text-xs text-[#801214] pt-4 border-t-2 border-[#801214]/20 w-full">
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-[#801214]" />
          <span>Ahmedabad University • School of Engineering and Applied Science</span>
        </div>
        <div className="font-mono text-[11px] font-bold text-[#801214]">
          Megh Patel & Konark Karia
        </div>
        {/* Title slide intentionally has NO slide number */}
      </div>
    </div>
  );
}
