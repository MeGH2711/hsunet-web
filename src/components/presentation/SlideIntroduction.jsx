import React, { useState } from "react";
import {
  Activity,
  Layers,
  Building2,
  ShieldAlert,
  TrendingDown,
  Cpu,
  Maximize2,
  X,
  Sparkles,
  ZoomIn
} from "lucide-react";
import { PRESENTATION_METADATA } from "./slidesData";

export default function SlideIntroduction() {
  // State for optional enlarged modal view of sample images/gifs
  const [activeModal, setActiveModal] = useState(null);

  const problemCards = [
    {
      id: "small-lesion",
      pillar: "Pillar 01 • Collapse",
      icon: TrendingDown,
      title: "Dice 0.399",
      subtitle: "Small Lesions (< 1.5 mL)",
      caseId: "ISLES_1219 (0.010 mL)",
      gifUrl: "/data/presentation/problem1_small_lesion.gif",
      pngUrl: "/data/presentation/problem1_small_lesion.png",
      alt: "Small lesion collapse in ISLES_1219 showing 100% false negative underdetection",
      description:
        "435 cases (29.9% of cohort) present punctate lesions down to 0.010 mL (10 voxels). Standard volume-weighted loss starves micro gradients, causing 100% false-negative collapse.",
      tagLeft: "435 Cases Affected",
      tagRight: "Gradient Starvation",
      badgeColor: "bg-[#801214] text-white",
      highlight: "100% FN Omission",
      modalDetails: {
        title: "Pillar 01: Small Lesion Gradient Starvation",
        case: "Subject ISLES_1219 • Site R011 (1.5T Scanner)",
        refVol: "0.010 mL (10 voxels)",
        dice: "0.000 (Complete Miss by Baseline)",
        finding:
          "In conventional UNet & nnU-Net models, loss contribution is directly proportional to lesion volume. A 10-voxel lesion contributes 0.002% of the gradient compared to typical background, causing the network weights to remain completely unresponsive to punctate strokes."
      }
    },
    {
      id: "multi-lesion",
      pillar: "Pillar 02 • Multi-Lesion",
      icon: Layers,
      title: "66% of Cases",
      subtitle: "Discrete Co-Lesions (1–15 Foci)",
      caseId: "ISLES_1202 (13 Foci • 32.36 mL)",
      gifUrl: "/data/presentation/problem2_multilesion_satellite.gif",
      pngUrl: "/data/presentation/problem2_multilesion_satellite.png",
      alt: "Discrete satellite omission in ISLES_1202 showing missed embolic infarcts",
      description:
        "Two-thirds of patients exhibit multifocal embolic showers. Standard architectures detect the bulky primary core (Dice 0.733) while completely dropping secondary satellite infarcts.",
      tagLeft: "Up to 15 Foci / Case",
      tagRight: "Satellite Omission",
      badgeColor: "bg-[#801214] text-white",
      highlight: "276 Satellite Voxels Missed",
      modalDetails: {
        title: "Pillar 02: Multi-Lesion Satellite Infarct Omission",
        case: "Subject ISLES_1202 • Site R009 (3.0T Scanner)",
        refVol: "32.36 mL • 13 Discrete Connected Components",
        dice: "0.733 (Artificially inflated by dominant core)",
        finding:
          "Standard per-volume evaluation metrics hide critical diagnostic failures: the main 30 mL core dominates the Dice score, while small embolic showers responsible for cognitive decline and recurrence risk are silently omitted (276 False Negative voxels in blue)."
      }
    },
    {
      id: "scale-divergence",
      pillar: "Pillar 03 • Covariate Shift",
      icon: Building2,
      title: "38,760× Span",
      subtitle: "Across 55 Clinical Centers",
      caseId: "0.010 mL vs 387.6 mL",
      gifUrl: "/data/presentation/problem3_scale_divergence.gif",
      pngUrl: "/data/presentation/problem3_scale_divergence.png",
      alt: "Profound 4-order-of-magnitude scale divergence comparison across centers",
      description:
        "Lesion volumes span 4 orders of magnitude (0.010 mL to 387.6 mL) across 55 worldwide hospital centers, inducing extreme receptive field mismatch and batch-norm feature collapse.",
      tagLeft: "55 Centers Skew",
      tagRight: "Receptive Field Mismatch",
      badgeColor: "bg-[#801214] text-white",
      highlight: "4 Orders of Magnitude",
      modalDetails: {
        title: "Pillar 03: Multi-Centric Scale Divergence & Domain Shift",
        case: "ISLES_1219 (0.010 mL, Site R011) vs ISLES_1185 (387.6 mL, Site R005)",
        refVol: "38,760× Volumetric Disparity",
        dice: "Baseline degrades by >45% between micro and massive strokes",
        finding:
          "Fixed-scale convolutional receptive fields cannot simultaneously represent a 6-voxel punctate lesion and a 387,600-voxel massive middle cerebral artery infarction without architectural scale-invariance."
      }
    }
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-between pt-3 sm:pt-4 md:pt-5 px-4 sm:px-8 lg:px-10 pb-3 sm:pb-5 overflow-hidden select-none bg-white text-[#801214]">
      {/* Background Subtle Geometric Mesh & Crimson Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[54rem] h-[54rem] rounded-full bg-[#801214]/4 blur-3xl" />
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] rounded-full bg-[#801214]/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] rounded-full bg-[#801214]/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#801214_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.05]" />
      </div>

      {/* TOP BAR: Category Pill & Top-Right AU Logo */}
      <div className="relative z-30 flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#801214] text-white text-xs font-semibold tracking-wider uppercase shadow-md shadow-[#801214]/20 border border-[#801214]">
            <Activity className="w-3.5 h-3.5 text-white" />
            <span>Problem & Clinical Challenge</span>
          </div>

          <span className="hidden md:inline-flex items-center gap-1.5 text-[#801214] text-xs font-mono font-bold bg-[#801214]/10 px-3.5 py-1.5 rounded-full border border-[#801214]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#801214] animate-pulse" />
            ISLES 2026 / ATLAS 3.0 Clinical Corpus (1,453 Cases)
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

      {/* MAIN CONTENT ZONE: Fully Balanced Widescreen Utilization */}
      <div className="relative z-20 flex-1 flex flex-col justify-evenly items-center text-center max-w-7xl mx-auto w-full px-3 sm:px-6 py-2">
        {/* Category Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#801214]/10 border border-[#801214]/30 text-[#801214] text-xs sm:text-sm font-mono font-bold tracking-wider uppercase shadow-xs">
          <ShieldAlert className="w-4 h-4 text-[#801214]" />
          <span>Core Failure Modes of Standard Segmentation Architectures</span>
        </div>

        {/* Slide Main Heading */}
        <div className="space-y-1.5 max-w-6xl mx-auto">
          <h2 className="tracking-tight select-none">
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-black leading-tight">
              The Challenge:{" "}
              <span className="text-[#801214]">Profound Scale Divergence</span>
            </span>
            <span className="block text-lg sm:text-xl md:text-2xl lg:text-2.5xl text-[#52090b] font-bold mt-1">
              Across 4 Orders of Magnitude in 1,453 Multi-Centric Cases
            </span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-zinc-700 font-medium max-w-5xl mx-auto leading-relaxed pt-0.5">
            Direct clinical scans from the dataset illustrate why baseline nnU-Net models fail on acute ischemic stroke lesions.
          </p>
        </div>

        {/* 3 High-Impact Failure Mode Cards: Expanded Width & Generous Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7.5 xl:gap-8 w-full max-w-7xl mx-auto pt-1">
          {problemCards.map((card) => {
            const Icon = card.icon;
            const mediaSrc = card.gifUrl;

            return (
              <div
                key={card.id}
                className="group bg-white border-2 border-[#801214]/30 hover:border-[#801214] rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Card Top Header: Clean Pillar Tag & Actions (No wrapping) */}
                <div className="px-4 py-2.5 bg-zinc-50/90 border-b border-[#801214]/15 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black text-[#801214] uppercase tracking-wider bg-[#801214]/10 px-2.5 py-0.5 rounded-full">
                    {card.pillar}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveModal(card)}
                      className="w-6 h-6 rounded-md bg-white hover:bg-[#801214] hover:text-white text-zinc-600 flex items-center justify-center transition-all border border-zinc-200 shadow-xs"
                      title="Enlarge slice & view clinical diagnostics"
                    >
                      <Maximize2 className="w-3 h-3" />
                    </button>
                    <span className="w-6 h-6 rounded-md bg-[#801214] flex items-center justify-center text-white shadow-xs">
                      <Icon className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Visual Medical Scan Media Viewport: Calibrated height for expanded card width */}
                <div className="relative w-full h-48 sm:h-52 bg-zinc-950 overflow-hidden flex items-center justify-center">
                  <img
                    src={mediaSrc}
                    alt={card.alt}
                    className="w-full h-full object-contain pointer-events-none transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="eager"
                  />

                  {/* Bottom HUD Overlay: Case Identifier */}
                  <div className="absolute bottom-1.5 left-2 pointer-events-none">
                    <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-black/80 text-white/90 border border-white/15 backdrop-blur-sm">
                      {card.caseId}
                    </span>
                  </div>
                </div>

                {/* Card Content & Clinical Pathology Breakdown */}
                <div className="p-4 sm:p-4.5 flex flex-col justify-between flex-1 space-y-2">
                  <div className="space-y-1">
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-black leading-tight">
                        {card.title}
                      </div>
                      <div className="text-xs font-bold text-[#801214]">
                        {card.subtitle}
                      </div>
                    </div>

                    <p className="text-[11px] sm:text-xs text-zinc-600 font-medium leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="pt-2.5 pb-0.5 border-t border-[#801214]/15 flex items-center justify-between text-[10px] font-mono font-bold text-zinc-500">
                    <span>{card.tagLeft}</span>
                    <span className="text-[#801214]">{card.tagRight}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* HyperScale-UNet Resolution Framework Banner: Expanded Width */}
        <div className="w-full max-w-7xl mx-auto bg-gradient-to-r from-[#faf5f5] via-white to-[#faf5f5] border-2 border-[#801214] rounded-2xl p-3.5 sm:p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#801214] flex items-center justify-center text-white shrink-0 shadow-md">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div className="space-y-0.5">
              <div className="text-[11px] font-mono font-bold text-[#801214] uppercase tracking-wider">
                The Architectural Solution
              </div>
              <div className="text-sm sm:text-base font-black text-black">
                HyperScale-UNet: Scale-Invariant Feature Pyramid
              </div>
              <div className="text-[11px] text-zinc-600 font-medium">
                Decoupled multi-scale loss protecting micro-lesions down to 0.010 mL while retaining global context for massive 387 mL infarctions.
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-end gap-1 shrink-0">
            <span className="px-3 py-1 rounded-full bg-[#801214] text-white text-xs font-bold font-mono shadow-sm">
              0.010 to 387.6 mL
            </span>
            <span className="text-[10px] font-mono text-zinc-500 font-semibold">
              ATLAS 3.0 Standard
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER BAR: SEAS Note on Left & STRICT SLIDE NUMBER ON BOTTOM RIGHT */}
      <div className="relative z-20 flex items-center justify-between text-xs text-[#801214] pt-3 border-t-2 border-[#801214]/20 w-full">
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-[#801214]" />
          <span>School of Engineering and Applied Science • Ahmedabad University</span>
        </div>

        {/* BOTTOM RIGHT SLIDE NUMBER: Slide 2 MUST have slide number */}
        <div className="flex items-center gap-1.5 bg-[#801214] text-white px-4 py-1 rounded-full font-mono text-xs font-bold shadow-lg border border-[#801214]">
          <span className="text-white/80 text-[10px] uppercase font-sans tracking-wider">Slide</span>
          <span className="text-white font-black">02</span>
        </div>
      </div>

      {/* INTERACTIVE ENLARGED MODAL (For Deep Dive Clinical Inspection) */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 sm:p-6 animate-fadeIn">
          <div className="relative bg-white border-2 border-[#801214] rounded-2xl max-w-2xl w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#801214] uppercase tracking-wider">
                  {activeModal.modalDetails.title}
                </span>
                <h3 className="text-lg font-black text-black">
                  {activeModal.modalDetails.case}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-[#801214] hover:text-white flex items-center justify-center transition-colors text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-zinc-300 flex items-center justify-center">
              <img
                src={activeModal.gifUrl}
                alt={activeModal.alt}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl">
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">
                  Reference Volume
                </span>
                <span className="text-sm font-black text-[#801214]">
                  {activeModal.modalDetails.refVol}
                </span>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl">
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">
                  Baseline Result
                </span>
                <span className="text-sm font-black text-rose-600">
                  {activeModal.modalDetails.dice}
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-700 leading-relaxed text-left bg-[#801214]/5 p-3 rounded-xl border border-[#801214]/20">
              <span className="font-bold text-[#801214]">Pathology Note: </span>
              {activeModal.modalDetails.finding}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
