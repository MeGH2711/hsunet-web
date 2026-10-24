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
    <div className="relative w-full h-full flex flex-col justify-between p-6 md:p-10 lg:p-14 overflow-hidden select-none bg-white text-[#801214]">
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
          <div className="bg-white px-5 py-2.5 rounded-2xl shadow-xl border-2 border-[#801214]/25 flex items-center transition-all duration-300 hover:border-[#801214] hover:scale-105">
            <img
              src={PRESENTATION_METADATA.logoUrl}
              alt="Ahmedabad University Logo"
              className="h-14 sm:h-16 md:h-18 lg:h-20 w-auto object-contain block"
            />
          </div>
        </div>
      </div>

      {/* MAIN CENTER-ALIGNED CONCLUSION CONTENT */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center max-w-4xl mx-auto my-auto w-full space-y-6 px-4">
        {/* Session Tag Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#801214]/10 text-[#801214] text-xs font-mono font-bold tracking-wider uppercase border border-[#801214]/30">
          <Sparkles className="w-3.5 h-3.5 text-[#801214]" />
          <span>Session Concluded</span>
        </div>

        {/* Central Animated Question & Discussion Emblem */}
        <div className="flex items-center justify-center">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#801214] flex items-center justify-center text-white shadow-2xl shadow-[#801214]/30 border-2 border-white transition-transform hover:scale-105">
            <div className="absolute inset-0 rounded-3xl border-2 border-[#801214]/40 animate-ping opacity-30" />
            <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-pulse" />
          </div>
        </div>

        {/* Thank You & Main Question Heading */}
        <div className="space-y-2">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-black tracking-tight leading-none">
            Thank You!
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#801214]">
            Questions & Discussion
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-zinc-700 font-medium max-w-2xl mx-auto leading-relaxed pt-1">
            We welcome your questions, feedback, and technical inquiries on the HyperScale-UNet architecture and multi-site clinical evaluation.
          </p>
        </div>

        {/* Presenters & School Card (Center Aligned) */}
        <div className="bg-white rounded-2xl px-8 py-5 border-2 border-[#801214] shadow-xl text-center space-y-1.5 w-full max-w-xl mx-auto">
          <div className="text-xs font-bold text-[#801214] uppercase tracking-widest font-mono flex items-center justify-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-[#801214]" />
            <span>Project Presenters</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Megh Patel and Konark Karia
          </div>
          <div className="text-base sm:text-lg font-bold text-[#801214]">
            School of Engineering and Applied Science
          </div>
          <div className="text-xs text-zinc-600 font-semibold">
            Ahmedabad University, Gujarat, India
          </div>
        </div>

        {/* Benchmark Metric Chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <div className="flex items-center gap-2 bg-[#801214]/5 border-2 border-[#801214]/25 px-4 py-1.5 rounded-full text-xs font-bold text-[#801214] shadow-sm">
            <Award className="w-4 h-4 text-[#801214]" />
            <span>1,453 Cases Evaluated</span>
          </div>
          <div className="flex items-center gap-2 bg-[#801214]/5 border-2 border-[#801214]/25 px-4 py-1.5 rounded-full text-xs font-bold text-[#801214] shadow-sm">
            <Building2 className="w-4 h-4 text-[#801214]" />
            <span>55 Multi-Centric Sites</span>
          </div>
          <div className="flex items-center gap-2 bg-[#801214]/5 border-2 border-[#801214]/25 px-4 py-1.5 rounded-full text-xs font-bold text-[#801214] shadow-sm">
            <Scale className="w-4 h-4 text-[#801214]" />
            <span>4 Orders Scale Invariance</span>
          </div>
        </div>

        {/* Open Floor Invitation Banner */}
        <div className="bg-[#801214] text-white px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg">
          <HelpCircle className="w-4 h-4 text-white" />
          <span>Floor Open for Questions & Collaborative Discussion</span>
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
