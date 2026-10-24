import React, { useState } from "react";
import {
  HelpCircle,
  MessageSquare,
  GraduationCap,
  Brain,
  Award,
  Network,
  CheckCircle2,
  Sparkles,
  Share2,
  ShieldCheck,
  ChevronRight,
  Scale
} from "lucide-react";
import { PRESENTATION_METADATA } from "./slidesData";

export default function SlideConclusion() {
  const [activeTopic, setActiveTopic] = useState("scaleloss");

  const discussionTopics = [
    {
      id: "scaleloss",
      title: "Scale-Invariant Loss Strategy",
      icon: Scale,
      summary: "Mitigating gradient starvation on small lesions (< 1.5 mL) down to 0.012 mL.",
      details: "Decouples volumetric dominance in traditional Dice loss, enforcing proportional sensitivity to micro-punctate stroke foci without losing high-volume stability."
    },
    {
      id: "multicentric",
      title: "55-Site Multi-Centric Robustness",
      icon: Network,
      summary: "Scanner-invariant normalization resolving severe foreground intensity outliers.",
      details: "Tackles extreme intensity standard deviation (94,929 vs median 249) and covariate shift across 55 heterogeneous clinical acquisition centres."
    },
    {
      id: "multilesion",
      title: "Multi-Lesion Spatial Sensitivity",
      icon: ShieldCheck,
      summary: "Delineating all discrete co-lesions in 66% multi-lesion patient cases.",
      details: "Guarantees that secondary satellite infarcts (ranging from 1 to 15 components) are segmentally preserved alongside the primary infarct territory."
    },
    {
      id: "clinical",
      title: "Clinical Impact & Translation",
      icon: Award,
      summary: "Rapid sub-2-second 3D automated delineation for acute emergency triage.",
      details: "Eliminates inter-observer variability during hyper-acute stroke windows, providing reliable volumetric quantification for mechanical thrombectomy qualification."
    }
  ];

  const selectedTopic = discussionTopics.find((t) => t.id === activeTopic) || discussionTopics[0];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 md:p-10 lg:p-14 overflow-hidden select-none bg-white text-[#801214]">
      {/* Background Subtle Geometric Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] rounded-full bg-[#801214]/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#801214]/6 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#801214_1px,transparent_1px)] [background-size:26px_26px] opacity-[0.06]" />
      </div>

      {/* TOP BAR: Tag & Top-Right AU Logo */}
      <div className="relative z-30 flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
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
          <div className="bg-white px-4 py-2 rounded-xl shadow-lg border-2 border-[#801214]/20 flex items-center transition-all hover:border-[#801214] hover:scale-105">
            <img
              src={PRESENTATION_METADATA.logoUrl}
              alt="Ahmedabad University Logo"
              className="h-10 md:h-12 w-auto object-contain block"
            />
          </div>
        </div>
      </div>

      {/* MAIN SLIDE CONTENT: High Impact Conclusion & Discussion Hub */}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center flex-1 my-auto">
        {/* Left Column: Thank You, Presenters, School & Question Invitation */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
          {/* Main Thank You Title */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#801214]/10 text-[#801214] text-xs font-mono font-bold tracking-wider uppercase border border-[#801214]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#801214]" />
              <span>Session Concluded</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight leading-none">
              Thank You!
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#801214]">
              Questions & Discussion
            </h3>
            <p className="text-base sm:text-lg text-zinc-700 font-medium leading-relaxed pt-1">
              We welcome your questions, feedback, and technical inquiries on the HyperScale-UNet architecture and multi-site clinical evaluation.
            </p>
          </div>

          {/* Presenter & Department Card */}
          <div className="bg-white text-zinc-900 rounded-2xl p-5 md:p-6 shadow-xl border-2 border-[#801214] space-y-2">
            <div className="text-[11px] font-bold text-[#801214] uppercase tracking-wider font-mono flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#801214]" />
              <span>Project Presenters</span>
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

          {/* Quick Key Takeaway Metric Badges in Light Theme */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border-2 border-[#801214]/30 rounded-xl p-3 text-center shadow-sm">
              <div className="text-lg md:text-xl font-black text-[#801214]">1,453</div>
              <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Cases Evaluated</div>
            </div>
            <div className="bg-white border-2 border-[#801214]/30 rounded-xl p-3 text-center shadow-sm">
              <div className="text-lg md:text-xl font-black text-[#801214]">55 Sites</div>
              <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Multi-Centric</div>
            </div>
            <div className="bg-white border-2 border-[#801214]/30 rounded-xl p-3 text-center shadow-sm">
              <div className="text-lg md:text-xl font-black text-[#801214]">4 Orders</div>
              <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Scale Invariance</div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Discussion Nexus in Pure Light Theme */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-white border-2 border-[#801214] rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#801214]/20">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#801214]" />
              <span className="text-xs font-mono font-black text-[#801214] uppercase tracking-wider">
                Key Discussion Themes
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-white bg-[#801214] px-2 py-0.5 rounded">
              Click Any Topic to Spotlight
            </span>
          </div>

          {/* Interactive Topic Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {discussionTopics.map((topic) => {
              const Icon = topic.icon;
              const isActive = activeTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setActiveTopic(topic.id)}
                  className={`text-left p-3 rounded-xl border-2 transition-all duration-200 flex flex-col justify-between ${
                    isActive
                      ? "bg-[#801214] text-white border-[#801214] shadow-lg scale-[1.02]"
                      : "bg-[#faf5f5] text-zinc-800 border-[#801214]/25 hover:border-[#801214] hover:bg-[#801214]/5"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isActive ? "bg-white text-[#801214]" : "bg-[#801214] text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {isActive && (
                      <span className="text-[9px] font-mono font-black bg-white text-[#801214] px-1.5 py-0.5 rounded uppercase">
                        Active
                      </span>
                    )}
                  </div>
                  <div className={`text-xs font-bold leading-tight ${isActive ? "text-white" : "text-black"}`}>
                    {topic.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Topic Detailed Spotlight Box */}
          <div className="bg-[#faf5f5] border-2 border-[#801214] rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-[#801214] text-xs font-mono font-black uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#801214]" />
              <span>{selectedTopic.title}</span>
            </div>
            <p className="text-sm text-black font-bold leading-snug">
              {selectedTopic.summary}
            </p>
            <p className="text-xs text-zinc-700 font-medium leading-relaxed pt-1 border-t border-[#801214]/20">
              {selectedTopic.details}
            </p>
          </div>

          {/* Open Floor Invitation Banner */}
          <div className="bg-[#801214] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between shadow-md">
            <span className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-white" />
              <span>Open for Questions & Discussion</span>
            </span>
            <span className="text-[11px] font-mono text-white/90">
              Megh Patel & Konark Karia
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER BAR: SEAS Affiliation Note on Left & STRICTLY NO SLIDE NUMBER ON RIGHT */}
      <div className="relative z-20 flex items-center justify-between text-xs text-[#801214] pt-3 border-t-2 border-[#801214]/20">
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
