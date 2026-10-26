import React from "react";
import {
  Layers,
  Sparkles,
  Target,
  Boxes,
  Eye
} from "lucide-react";
import SlideHeader from "./SlideHeader";
import SlideFooter from "./SlideFooter";

export default function SlideArchitecture() {
  const pillars = [
    {
      id: "encoder",
      badge: "Stage 01 • Feature Extraction",
      icon: Layers,
      title: "3D SE-ResNet Encoder",
      subtitle: "6-Stage Multi-Scale Channel Attention",
      impactPill: "+45% Micro Sensitivity",
      techDetails:
        "Dual SEResBlock3D per stage with Squeeze-and-Excitation (reduction r=16). Explicit 3D mean-pooling prevents Windows CUDA autograd kernel deadlocks.",
      impact:
        "Dynamically amplifies subtle 10-voxel lesion channels while suppressing over 75% of non-informative brain background tissue.",
      specLabel1: "Channels:",
      specValue1: "[32 → 256] 6 Stages",
      specLabel2: "Strides:",
      specValue2: "Downsample 32×",
    },
    {
      id: "lag",
      badge: "Stage 02 • Skip Gating",
      icon: Eye,
      title: "Lesion Attention Gates",
      subtitle: "Spatial Skip Filtering (Tiers S0–S3)",
      impactPill: "Zero False Positives",
      techDetails:
        "Learns spatial gating coefficients using decoder coarse signals to filter high-resolution skip features before concatenation, isolating micro-infarcts.",
      impact:
        "Eliminates false-positive activations in healthy white and gray matter across all 4 skip connections prior to decoder fusion.",
      specLabel1: "Skip Tiers:",
      specValue1: "S0, S1, S2, S3",
      specLabel2: "Operator:",
      specValue2: "Trilinear + 1×1×1 Conv",
    },
    {
      id: "auxiliary",
      badge: "Stage 03 • Latent Regularizer",
      icon: Target,
      title: "Auxiliary Scale Head",
      subtitle: "Latent Multi-Volume Regularizer",
      impactPill: "Prevents Scale Collapse",
      techDetails:
        "Branches directly from deepest bottleneck S5. Dynamically classifies stroke volumes into Small (<1.5 mL), Medium, or Large (>15 mL).",
      impact:
        "Forces latent bottleneck features to preserve micro-stroke representations across the extreme 4-order-of-magnitude volume disparity.",
      specLabel1: "Bottleneck:",
      specValue1: "S5 (320 ch) → 64 → 3",
      specLabel2: "Loss Term:",
      specValue2: "λ_scale = 0.1 CE Loss",
    },
    {
      id: "decoder",
      badge: "Stage 04 • Multi-Tier Decoder",
      icon: Boxes,
      title: "Deep Supervision Decoder",
      subtitle: "5-Level Gradient Starvation Shield",
      impactPill: "Dice 0.399 → 0.58 (+45%)",
      techDetails:
        "Trilinear upsampling with SE-ResBlocks and composite Dice + CE loss across 5 output tiers with decaying geometric weights.",
      impact:
        "Directly overcomes volume-dominated loss starvation by injecting backpropagation gradients directly into early decoder stages.",
      specLabel1: "Resolutions:",
      specValue1: "128³, 64³, 32³, 16³, 8³",
      specLabel2: "Weights:",
      specValue2: "[0.53, 0.27, 0.13, 0.07]",
    }
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-between pt-3 sm:pt-4 px-4 sm:px-8 lg:px-12 pb-3 sm:pb-4 overflow-hidden select-none bg-white text-[#801214]">
      {/* Background Subtle Geometric Mesh & Crimson Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[54rem] h-[54rem] rounded-full bg-[#801214]/4 blur-3xl" />
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] rounded-full bg-[#801214]/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] rounded-full bg-[#801214]/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#801214_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.05]" />
      </div>

      {/* REUSABLE STANDARDIZED SLIDE HEADER */}
      <SlideHeader
        title={
          <>
            <span className="text-black">HyperScale-UNet: </span>
            <span className="text-[#801214]">Scale-Invariant Architecture</span>
          </>
        }
        subtitle="Dual SE-ResNet Backbone with 3D Lesion Attention Gates (LAG) & 5-Level Deep Supervision"
        description="Engineered to decouple multi-scale lesion gradients, elevating small lesion Dice by +45% within an 8 GB VRAM budget."
      />

      {/* MAIN CONTENT ZONE: 4 Architectural Innovation Pillar Cards Fully Utilizing Vertical Canvas */}
      <main className="relative z-20 flex-1 min-h-0 w-full max-w-[98rem] 2xl:max-w-[110rem] mx-auto py-2 sm:py-3 flex flex-col justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 xl:gap-6 w-full h-full items-stretch">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <div
                key={pillar.id}
                className="group bg-white border-2 border-[#801214]/25 hover:border-[#801214] rounded-2xl p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between text-left hover:-translate-y-1"
              >
                <div className="space-y-3.5">
                  {/* Top Badge & Stage Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-[13px] font-mono font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#801214]/10 text-[#801214] border border-[#801214]/20 group-hover:bg-[#801214] group-hover:text-white transition-colors">
                      {pillar.badge}
                    </span>
                    <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-[#801214] text-white shadow-sm transition-transform group-hover:scale-105">
                      <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </span>
                  </div>

                  {/* Title & Subtitle: High Prominence & Scale */}
                  <div>
                    <h3 className="text-xl sm:text-2xl lg:text-[23px] xl:text-2.5xl font-black text-black group-hover:text-[#801214] transition-colors leading-tight tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm lg:text-[15px] font-extrabold text-[#801214] mt-1 tracking-normal">
                      {pillar.subtitle}
                    </p>
                  </div>

                  {/* Technical Details: Crisp Charcoal, High Readability */}
                  <p className="text-xs sm:text-sm lg:text-[15px] text-zinc-900 font-semibold leading-relaxed">
                    {pillar.techDetails}
                  </p>

                  {/* Clinical Benefit Highlight Box: High Contrast Callout */}
                  <div className="bg-[#faf2f2] border-2 border-[#801214]/25 rounded-xl p-3 sm:p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-mono font-black text-[#801214]">
                      <span className="flex items-center gap-1.5 uppercase tracking-wide">
                        <Sparkles className="w-4 h-4 text-[#801214] shrink-0" />
                        Clinical Benefit
                      </span>
                      <span className="text-[11px] sm:text-xs font-mono font-bold text-[#801214] bg-white px-2 py-0.5 rounded border border-[#801214]/20 shadow-xs">
                        {pillar.impactPill}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#52090b] leading-snug">
                      {pillar.impact}
                    </p>
                  </div>
                </div>

                {/* Footer Hardware / Dimension Specs */}
                <div className="pt-3 mt-3 border-t-2 border-[#801214]/15 space-y-2 text-xs sm:text-sm font-mono font-bold">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600 font-bold">{pillar.specLabel1}</span>
                    <span className="text-[#801214] bg-[#801214]/10 border border-[#801214]/20 px-2 py-0.5 rounded font-black">
                      {pillar.specValue1}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-zinc-600 font-bold">{pillar.specLabel2}</span>
                    <span className="bg-zinc-100 text-zinc-800 border border-zinc-200 px-2 py-0.5 rounded font-black">
                      {pillar.specValue2}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* REUSABLE STANDARDIZED SLIDE FOOTER */}
      <SlideFooter slideNumber="03" />
    </div>
  );
}
