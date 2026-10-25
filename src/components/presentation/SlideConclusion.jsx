import React from "react";
import {
  HelpCircle,
  MessageSquare,
  GraduationCap,
  Brain,
  Award,
  Network,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Scale,
  Building2
} from "lucide-react";
import { PRESENTATION_METADATA } from "./slidesData";

export default function SlideConclusion() {
  return (
    <div className="relative w-full h-full flex flex-col justify-between pt-4 sm:pt-5 md:pt-6 px-6 sm:px-10 lg:px-12 pb-4 sm:pb-6 overflow-hidden select-none bg-white text-[#801214]">
      {/* Background Subtle Geometric Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] rounded-full bg-[#801214]/4 blur-3xl" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#801214]/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#801214]/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#801214_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.05]" />
      </div>

      {/* TOP BAR: Tag & Top-Right AU Logo */}
      <div className="relative z-30 flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#801214] text-white text-xs font-semibold tracking-wider uppercase shadow-md border border-[#801214]">
            <HelpCircle className="w-3.5 h-3.5 text-white" />
            <span>Conclusion & Q&A</span>
          </div>
          <span className="hidden sm:inline-block text-[#801214] text-xs font-mono font-bold bg-[#801214]/10 px-3 py-1 rounded-full border border-[#801214]/20">
            HyperScale-UNet Concluding Remarks
          </span>
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

      {/* MAIN CENTER-ALIGNED CONCLUSION CONTENT: Fully Balanced Widescreen Utilization */}
      <div className="relative z-20 flex-1 flex flex-col justify-evenly items-center text-center max-w-5xl xl:max-w-6xl mx-auto w-full px-4 py-2 sm:py-3">
        {/* Session Tag Pill */}
        <div className="inline-flex items-center gap-2.5 px-5 py-1.5 rounded-full bg-[#801214]/10 text-[#801214] text-xs sm:text-sm font-mono font-bold tracking-wider uppercase border border-[#801214]/30 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#801214]" />
          <span>Session Concluded</span>
        </div>

        {/* Central Animated Question & Discussion Emblem */}
        <div className="flex items-center justify-center">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-3xl bg-[#801214] flex items-center justify-center text-white shadow-2xl shadow-[#801214]/30 border-2 border-white transition-transform hover:scale-105">
            <div className="absolute inset-0 rounded-3xl border-2 border-[#801214]/40 animate-ping opacity-30" />
            <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white animate-pulse" />
          </div>
        </div>

        {/* Thank You & Main Question Heading */}
        <div className="space-y-2 max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-black tracking-tight leading-none">
            Thank You!
          </h2>
          <h3 className="text-2xl sm:text-3.5xl md:text-4.5xl lg:text-5xl font-black text-[#801214] mt-2">
            Questions &amp; Discussion
          </h3>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-zinc-600 font-medium max-w-3xl mx-auto leading-relaxed pt-1">
            We welcome your questions, feedback, and technical inquiries on the HyperScale-UNet architecture and multi-site clinical evaluation.
          </p>
        </div>

        {/* Presenters & Academic Institution Card: Executive Split Horizontal Layout */}
        <div className="bg-white rounded-2xl px-8 sm:px-12 py-5 sm:py-6 border-2 border-[#801214] shadow-xl w-full max-w-4xl xl:max-w-5xl mx-auto transition-all duration-300 hover:shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left Column: Presenters */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
              <div className="text-xs font-bold text-[#801214] uppercase tracking-widest font-mono flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#801214]" />
                <span>Project Presenters</span>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-3.5xl font-black text-black tracking-tight">
                Megh Patel <span className="text-[#801214] font-semibold text-xl sm:text-2xl">&amp;</span> Konark Karia
              </div>
              <div className="text-xs sm:text-sm text-zinc-500 font-medium">
                School of Engineering and Applied Science
              </div>
            </div>

            {/* Right Column: Institution */}
            <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-1 md:border-l md:border-[#801214]/20 md:pl-8">
              <div className="text-xs font-bold text-[#801214] uppercase tracking-widest font-mono flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#801214]" />
                <span>Academic Institution</span>
              </div>
              <div className="text-xl sm:text-2xl lg:text-2.5xl font-black text-[#801214]">
                Ahmedabad University
              </div>
              <div className="text-xs sm:text-sm text-zinc-600 font-semibold">
                Gujarat, India • ISLES 2026 / ATLAS 3.0
              </div>
            </div>
          </div>
        </div>

        {/* Benchmark Metric Highlights: 3 Distinct Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl xl:max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2.5 bg-white border-2 border-[#801214]/25 hover:border-[#801214] px-5 py-3 rounded-2xl text-xs sm:text-sm lg:text-base font-bold text-black shadow-sm transition hover:shadow-md">
            <Award className="w-5 h-5 text-[#801214]" />
            <span>1,453 Cases Evaluated</span>
          </div>
          <div className="flex items-center justify-center gap-2.5 bg-white border-2 border-[#801214]/25 hover:border-[#801214] px-5 py-3 rounded-2xl text-xs sm:text-sm lg:text-base font-bold text-black shadow-sm transition hover:shadow-md">
            <Building2 className="w-5 h-5 text-[#801214]" />
            <span>55 Multi-Centric Sites</span>
          </div>
          <div className="flex items-center justify-center gap-2.5 bg-white border-2 border-[#801214]/25 hover:border-[#801214] px-5 py-3 rounded-2xl text-xs sm:text-sm lg:text-base font-bold text-black shadow-sm transition hover:shadow-md">
            <Scale className="w-5 h-5 text-[#801214]" />
            <span>4 Orders Scale Invariance</span>
          </div>
        </div>

        {/* Open Floor Invitation Banner */}
        <div className="bg-[#801214] text-white px-8 py-3 rounded-full font-bold text-xs sm:text-sm lg:text-base flex items-center justify-center gap-2.5 shadow-lg max-w-3xl w-full mx-auto">
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          <span>Floor Open for Questions &amp; Collaborative Discussion</span>
        </div>
      </div>

      {/* FOOTER BAR: SEAS Affiliation Note on Left & STRICTLY NO SLIDE NUMBER ON RIGHT */}
      <div className="relative z-20 flex items-center justify-between text-xs text-[#801214] pt-3 border-t-2 border-[#801214]/20 w-full">
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-[#801214]" />
          <span>School of Engineering and Applied Science • Ahmedabad University</span>
        </div>
        <div className="font-mono text-[11px] font-bold text-[#801214]">
          Q&A Session
        </div>
        {/* Strictly NO slide number on conclusion slide */}
      </div>
    </div>
  );
}
