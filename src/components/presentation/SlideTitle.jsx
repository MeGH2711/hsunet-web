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
    <div className="relative w-full h-full flex flex-col justify-between p-8 md:p-12 lg:p-14 overflow-hidden select-none bg-white text-[#801214]">
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
          <div className="bg-white px-5 py-2.5 rounded-2xl shadow-xl border-2 border-[#801214]/25 flex items-center transition-all duration-300 hover:border-[#801214] hover:scale-105">
            <img
              src={PRESENTATION_METADATA.logoUrl}
              alt="Ahmedabad University Logo"
              className="h-14 sm:h-16 md:h-18 lg:h-20 w-auto object-contain block"
            />
          </div>
        </div>
      </div>

      {/* MAIN CENTER-ALIGNED SLIDE CONTENT: Balanced Spacing & Width */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center max-w-6xl mx-auto my-auto w-full space-y-6 px-4">
        {/* Top Centered Category Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#801214]/10 border border-[#801214]/30 text-[#801214] text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
          <Scale className="w-4 h-4 text-[#801214]" />
          <span>Scale-Invariant Architecture for Stroke Lesion Segmentation</span>
        </div>

        {/* Main Title (Center Aligned, Locked In One Line) */}
        <div className="space-y-2 max-w-5xl mx-auto">
          <h1 className="tracking-tight leading-tight select-none">
            <span className="block whitespace-nowrap text-2xl sm:text-3.5xl md:text-4.5xl lg:text-5xl xl:text-5.5xl font-black text-[#801214]">
              <span className="text-black">HyperScale-UNet:</span>{" "}
              <span className="text-[#801214]">Scale-Invariant Architecture</span>
            </span>
            <span className="block text-xl sm:text-2xl md:text-3xl lg:text-3.5xl text-[#52090b] font-bold mt-2">
              for Ischemic Stroke Lesion Segmentation
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-zinc-700 font-medium max-w-4xl mx-auto leading-relaxed pt-1">
            A Unified Deep Learning Architecture Optimizing Small (&lt; 1.5 mL), Medium, and Large Lesions Across 55 Multi-Centric Clinical Sites
          </p>
        </div>

        {/* Centered 3-Pillar Architectural Highlight Cards (Optimal Horizontal Canvas Utilization) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mx-auto pt-1">
          <div className="bg-white border-2 border-[#801214]/25 hover:border-[#801214] rounded-2xl p-4 shadow-md transition-all hover:shadow-lg">
            <div className="flex items-center justify-center gap-2 text-[#801214] mb-1.5">
              <Scale className="w-5 h-5 text-[#801214]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">Scale Invariance</span>
            </div>
            <div className="text-xl font-black text-black">4 Orders of Mag.</div>
            <div className="text-xs text-zinc-600 font-medium mt-1">0.012 mL to 387.6 mL Coverage</div>
          </div>

          <div className="bg-white border-2 border-[#801214]/25 hover:border-[#801214] rounded-2xl p-4 shadow-md transition-all hover:shadow-lg">
            <div className="flex items-center justify-center gap-2 text-[#801214] mb-1.5">
              <Building2 className="w-5 h-5 text-[#801214]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">Clinical Scope</span>
            </div>
            <div className="text-xl font-black text-black">1,453 Cases</div>
            <div className="text-xs text-zinc-600 font-medium mt-1">55 Multi-Centric Sites</div>
          </div>

          <div className="bg-white border-2 border-[#801214]/25 hover:border-[#801214] rounded-2xl p-4 shadow-md transition-all hover:shadow-lg">
            <div className="flex items-center justify-center gap-2 text-[#801214] mb-1.5">
              <Layers className="w-5 h-5 text-[#801214]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">Multi-Lesion</span>
            </div>
            <div className="text-xl font-black text-black">66% Co-Lesions</div>
            <div className="text-xs text-zinc-600 font-medium mt-1">1 to 15 Discrete Components</div>
          </div>
        </div>

        {/* Presenters & School Card (Center Aligned, Generous Padding) */}
        <div className="bg-white rounded-2xl px-10 py-5 border-2 border-[#801214] shadow-xl text-center space-y-1.5 w-full max-w-2xl mx-auto transition hover:shadow-2xl hover:shadow-[#801214]/15">
          <div className="text-xs font-bold text-[#801214] uppercase tracking-widest font-mono flex items-center justify-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#801214]" />
            <span>Presented By</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Megh Patel and Konark Karia
          </div>
          <div className="text-base sm:text-lg font-bold text-[#801214]">
            School of Engineering and Applied Science
          </div>
          <div className="text-xs text-zinc-600 font-semibold tracking-wide">
            Ahmedabad University, Gujarat, India
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
