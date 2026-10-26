import React from "react";
import {
  HelpCircle,
  MessageSquare,
  GraduationCap,
  Building2
} from "lucide-react";
import { PRESENTATION_METADATA } from "./slidesData";
import SlideFooter from "./SlideFooter";

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
            className="h-16 sm:h-20 md:h-22 lg:h-24 xl:h-28 w-auto object-contain block select-none transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

      {/* MAIN CENTER-ALIGNED CONCLUSION CONTENT: Fully Balanced & Even Widescreen Layout */}
      <div className="relative z-20 flex-1 flex flex-col justify-evenly items-center text-center max-w-6xl xl:max-w-7xl 2xl:max-w-[85rem] mx-auto w-full px-4 py-3 sm:py-5">
        {/* Central Animated Question & Discussion Emblem */}
        <div className="flex items-center justify-center">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-3xl bg-[#801214] flex items-center justify-center text-white shadow-2xl shadow-[#801214]/30 border-2 border-white transition-transform hover:scale-105">
            <div className="absolute inset-0 rounded-3xl border-2 border-[#801214]/40 animate-ping opacity-25" />
            <MessageSquare className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-white animate-pulse" />
          </div>
        </div>

        {/* Thank You & Main Question Heading */}
        <div className="space-y-3 max-w-5xl mx-auto">
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-black tracking-tight leading-none">
            Thank You!
          </h2>
          <h3 className="text-2xl sm:text-3.5xl md:text-4.5xl lg:text-5xl font-black text-[#801214] mt-2 sm:mt-3">
            Questions &amp; Discussion
          </h3>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-zinc-600 font-medium max-w-4xl mx-auto leading-relaxed pt-1">
            We welcome your questions, feedback, and technical inquiries on the HyperScale-UNet architecture and multi-site clinical evaluation.
          </p>
        </div>

        {/* Presenters & Academic Institution Card: Executive Split Horizontal Layout */}
        <div className="bg-white rounded-2xl px-8 sm:px-12 py-6 sm:py-7 border-2 border-[#801214] shadow-xl w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto transition-all duration-300 hover:shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left Column: Presenters */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1.5">
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
            <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-1.5 md:border-l md:border-[#801214]/20 md:pl-8">
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

        {/* Open Floor Invitation Banner */}
        <div className="bg-[#801214] text-white px-8 sm:px-12 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base lg:text-lg flex items-center justify-center gap-3 shadow-xl max-w-4xl w-full mx-auto">
          <HelpCircle className="w-5 h-5 text-white" />
          <span>Floor Open for Questions &amp; Collaborative Discussion</span>
        </div>
      </div>

      {/* FOOTER BAR: Standard SlideFooter (Strictly NO Slide Number on Conclusion) */}
      <SlideFooter />
    </div>
  );
}
