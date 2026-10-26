import React, { useState } from "react";
import {
  Layers,
  Building2,
  TrendingDown,
  Maximize2,
  X,
  Sparkles
} from "lucide-react";
import SlideHeader from "./SlideHeader";
import SlideFooter from "./SlideFooter";

export default function SlideIntroduction() {
  // State for optional enlarged modal view of sample images/gifs
  const [activeModal, setActiveModal] = useState(null);

  const problemCards = [
    {
      id: "small-lesion",
      pillar: "Pillar 01 • Micro Collapse",
      icon: TrendingDown,
      title: "Dice 0.399",
      subtitle: "Small Lesions (< 1.5 mL)",
      caseId: "ISLES_1219 • 0.010 mL (10 voxels)",
      gifUrl: "/data/presentation/problem1_small_lesion.gif",
      pngUrl: "/data/presentation/problem1_small_lesion.png",
      alt: "Small lesion collapse in ISLES_1219 showing 100% false negative underdetection",
      description:
        "435 cases (29.9% of cohort) present punctate lesions down to 0.010 mL. Standard volume-weighted loss starves micro gradients, causing 100% false-negative omission.",
      highlight: "100% False-Negative Omission",
      keyInsight: "Volume-weighted loss starves micro gradients, leaving network weights unresponsive to punctate infarcts.",
      tagLeft: "435 Cases (29.9%)",
      tagRight: "Gradient Starvation",
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
      pillar: "Pillar 02 • Satellite Omission",
      icon: Layers,
      title: "66% of Cases",
      subtitle: "Discrete Co-Lesions (1–15 Foci)",
      caseId: "ISLES_1202 • 13 Foci (32.36 mL)",
      gifUrl: "/data/presentation/problem2_multilesion_satellite.gif",
      pngUrl: "/data/presentation/problem2_multilesion_satellite.png",
      alt: "Discrete satellite omission in ISLES_1202 showing missed embolic infarcts",
      description:
        "Two-thirds of patients exhibit multifocal embolic showers. Standard architectures capture the dominant 30 mL core while completely dropping secondary satellite infarcts.",
      highlight: "276 Satellite Voxels Missed",
      keyInsight: "Bulky cores dominate per-volume Dice metrics, masking silent omission of critical embolic showers.",
      tagLeft: "Up to 15 Foci / Patient",
      tagRight: "Satellite Omission",
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
      caseId: "0.010 mL vs 387.6 mL (4 Orders)",
      gifUrl: "/data/presentation/problem3_scale_divergence.gif",
      pngUrl: "/data/presentation/problem3_scale_divergence.png",
      alt: "Profound 4-order-of-magnitude scale divergence comparison across centers",
      description:
        "Lesion volumes span 4 orders of magnitude (0.010 mL to 387.6 mL) across 55 worldwide hospital centers, inducing extreme receptive field mismatch and batch collapse.",
      highlight: "4 Orders of Magnitude",
      keyInsight: "Fixed-receptive-field convolutions cannot simultaneously resolve 10-voxel micro-lesions and 387 mL hemisphere strokes.",
      tagLeft: "55 Hospital Centers",
      tagRight: "Receptive Field Mismatch",
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
    <div className="relative w-full h-full flex flex-col justify-between pt-3 sm:pt-4 px-4 sm:px-8 lg:px-12 pb-3 sm:pb-4 overflow-hidden select-none bg-white text-[#801214]">
      {/* Background Subtle Geometric Mesh & Crimson Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[58rem] h-[58rem] rounded-full bg-[#801214]/4 blur-3xl" />
        <div className="absolute top-0 right-0 w-[32rem] h-[32rem] rounded-full bg-[#801214]/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[32rem] h-[32rem] rounded-full bg-[#801214]/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#801214_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.06]" />
      </div>

      {/* REUSABLE STANDARDIZED SLIDE HEADER */}
      <SlideHeader
        title={
          <>
            <span className="text-black">The Challenge: </span>
            <span className="text-[#801214]">Profound Scale Divergence</span>
          </>
        }
        subtitle="Across 4 Orders of Magnitude in 1,453 Multi-Centric Stroke Cases (ATLAS 3.0 / ISLES 2026)"
        description="Direct clinical T1w MRI scans illustrate 3 acute failure modes where standard UNet & nnU-Net models suffer diagnostic collapse."
      />

      {/* 3 HIGH-IMPACT CLINICAL FAILURE MODE CARDS: Utilizing Full Central Canvas */}
      <main className="relative z-20 flex-1 min-h-0 w-full max-w-[98rem] 2xl:max-w-[110rem] mx-auto py-2 sm:py-3 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 xl:gap-8 h-full items-stretch">
          {problemCards.map((card) => {
            const Icon = card.icon;
            const mediaSrc = card.gifUrl;

            return (
              <div
                key={card.id}
                className="group bg-white border-2 border-[#801214]/30 hover:border-[#801214] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl flex flex-col justify-between text-left transition-all duration-300 hover:-translate-y-1"
              >
                {/* Card Top Header: Pillar Tag & Inspection Button */}
                <div className="shrink-0 px-4 sm:px-5 py-2.5 sm:py-3 bg-zinc-50 border-b-2 border-[#801214]/15 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-mono font-black text-[#801214] uppercase tracking-wider bg-[#801214]/10 px-3 py-1 rounded-full border border-[#801214]/20">
                    {card.pillar}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveModal(card)}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white hover:bg-[#801214] hover:text-white text-zinc-700 flex items-center justify-center transition-colors border border-zinc-200 shadow-xs"
                      title="Enlarge slice & view clinical diagnostics"
                    >
                      <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#801214] flex items-center justify-center text-white shadow-xs">
                      <Icon className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Medical Scan Viewport: Maximum Height & Clean Framing (1:1 Medical Scans) */}
                <div className="relative flex-1 min-h-[190px] sm:min-h-[220px] md:min-h-[250px] lg:min-h-[280px] xl:min-h-[320px] bg-zinc-950 overflow-hidden flex items-center justify-center p-2.5">
                  <img
                    src={mediaSrc}
                    alt={card.alt}
                    className="w-full h-full object-contain pointer-events-none transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="eager"
                  />

                  {/* High-Contrast Clinical HUD Overlay */}
                  <div className="absolute bottom-2.5 left-3 pointer-events-none">
                    <span className="text-xs sm:text-sm font-mono font-bold px-3 py-1 rounded-md bg-black/90 text-white border border-white/25 shadow-lg backdrop-blur-md flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {card.caseId}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-3 pointer-events-none">
                    <span className="text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/75 text-zinc-300 border border-white/15 backdrop-blur-sm">
                      T1w + GT Overlay
                    </span>
                  </div>
                </div>

                {/* Card Content & Pathology Breakdown: High Legibility from Distance */}
                <div className="shrink-0 p-4 sm:p-5 flex flex-col justify-between space-y-3 bg-white">
                  {/* Hero Metric & Subtitle */}
                  <div>
                    <div className="text-2xl sm:text-3xl lg:text-3.5xl xl:text-4xl font-black text-black leading-none tracking-tight">
                      {card.title}
                    </div>
                    <div className="text-sm sm:text-base lg:text-lg font-bold text-[#801214] mt-1">
                      {card.subtitle}
                    </div>
                  </div>

                  {/* Primary Narrative Description: Crisp, Dark, High-Contrast */}
                  <p className="text-xs sm:text-sm lg:text-[15px] text-zinc-800 font-semibold leading-relaxed">
                    {card.description}
                  </p>

                  {/* Clinical Impact Callout Box: High Visual Distinction */}
                  <div className="bg-[#faf3f3] border border-[#801214]/25 rounded-xl p-2.5 sm:p-3 space-y-1">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-mono font-black text-[#801214]">
                      <span className="flex items-center gap-1.5 uppercase tracking-wide">
                        <Sparkles className="w-3.5 h-3.5 text-[#801214] shrink-0" />
                        {card.highlight}
                      </span>
                      <span className="text-[11px] sm:text-xs font-mono font-bold text-zinc-700 bg-white px-2 py-0.5 rounded border border-[#801214]/20 shadow-xs">
                        {card.tagLeft}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#52090b] font-bold leading-snug pt-0.5">
                      {card.keyInsight}
                    </p>
                  </div>

                  {/* Bottom Footer Tags */}
                  <div className="pt-2 border-t border-[#801214]/15 flex items-center justify-between text-xs sm:text-sm font-mono font-bold text-zinc-600">
                    <span className="bg-zinc-100 text-zinc-700 px-2.5 py-0.5 rounded">
                      {card.tagLeft}
                    </span>
                    <span className="text-[#801214] bg-[#801214]/10 border border-[#801214]/20 px-2.5 py-0.5 rounded">
                      {card.tagRight}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* REUSABLE STANDARDIZED SLIDE FOOTER */}
      <SlideFooter slideNumber="02" />

      {/* INTERACTIVE ENLARGED MODAL (For Deep Dive Clinical Inspection) */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 animate-fadeIn">
          <div className="relative bg-white border-2 border-[#801214] rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-3">
              <div>
                <span className="text-xs sm:text-sm font-mono font-bold text-[#801214] uppercase tracking-wider">
                  {activeModal.modalDetails.title}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-black mt-0.5">
                  {activeModal.modalDetails.case}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-[#801214] hover:text-white flex items-center justify-center transition-colors text-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full aspect-square max-h-[380px] bg-black rounded-xl overflow-hidden border border-zinc-400 flex items-center justify-center mx-auto">
              <img
                src={activeModal.gifUrl}
                alt={activeModal.alt}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl">
                <span className="text-xs font-mono uppercase text-zinc-500 font-bold block">
                  Reference Volume
                </span>
                <span className="text-base font-black text-[#801214]">
                  {activeModal.modalDetails.refVol}
                </span>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl">
                <span className="text-xs font-mono uppercase text-zinc-500 font-bold block">
                  Baseline Result
                </span>
                <span className="text-base font-black text-rose-600">
                  {activeModal.modalDetails.dice}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed text-left bg-[#801214]/5 p-3.5 rounded-xl border border-[#801214]/20 font-medium">
              <span className="font-bold text-[#801214]">Pathology Note: </span>
              {activeModal.modalDetails.finding}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
