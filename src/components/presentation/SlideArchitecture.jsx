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
      title: "6-Stage 3D SE-ResNet Encoder",
      subtitle: "Multi-Scale Context with Channel Attention",
      channels: "[32, 64, 128, 192, 256, 256]",
      strides: "[1, 2, 2, 2, 2, 2]",
      techDetails:
        "Dual SEResBlock3D per stage with Squeeze-and-Excitation (reduction ratio r=16). Explicit mean-pooling prevents Windows CUDA autograd kernel deadlocks.",
      impact:
        "Amplifies subtle 10-voxel lesion channels while suppressing 75%+ non-informative background."
    },
    {
      id: "lag",
      badge: "Stage 02 • Skip Gating",
      icon: Eye,
      title: "3D Lesion Attention Gates (LAG)",
      subtitle: "Spatial Background Noise Suppression",
      channels: "Applied at Tiers S0, S1, S2, S3",
      strides: "Trilinear Resampling + Conv3D 1×1×1",
      techDetails:
        "Learns spatial gating coefficients using decoder gating signals to filter skip features before concatenation, isolating micro-infarcts.",
      impact:
        "Eliminates false-positive activations in healthy white/gray matter across all 4 skip connections."
    },
    {
      id: "auxiliary",
      badge: "Stage 03 • Latent Regularization",
      icon: Target,
      title: "Auxiliary Lesion Scale Head",
      subtitle: "Latent Volume-Aware Regularizer",
      channels: "Bottleneck S5 (320 ch) → 64 → 3",
      strides: "GlobalAvgPool3D + 2-Layer MLP",
      techDetails:
        "Branches directly from the deepest bottleneck. Dynamically categorizes lesions into Small (<1.5 mL), Medium (1.5–15 mL), or Large (>15 mL).",
      impact:
        "Penalizes latent scale collapse across the 4-order-of-magnitude (0.010 to 387.6 mL) volume span."
    },
    {
      id: "decoder",
      badge: "Stage 04 • Multi-Tier Reconstruction",
      icon: Boxes,
      title: "5-Level Deep Supervision Decoder",
      subtitle: "Gradient Starvation Protection",
      channels: "5 Spatial Tiers (128³, 64³, 32³, 16³, 8³)",
      strides: "Trilinear Upsampling + SE-ResBlocks",
      techDetails:
        "Trilinear upsampling combined with SE-ResBlock convolutions and compound Dice + CE loss across 5 output tiers with geometric decay weights.",
      impact:
        "Directly overcomes volume-dominated loss collapse, elevating Small Lesion Dice from 0.399 to 0.58 (+45%)."
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
                className="group bg-white border-2 border-[#801214]/25 hover:border-[#801214] rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between text-left hover:-translate-y-1"
              >
                <div className="space-y-3.5">
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#801214]/10 text-[#801214] group-hover:bg-[#801214] group-hover:text-white transition-colors">
                      {pillar.badge}
                    </span>
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#801214]/10 text-[#801214] group-hover:bg-[#801214] group-hover:text-white transition-all shadow-xs">
                      <Icon className="w-4 h-4" />
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-black group-hover:text-[#801214] transition-colors leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-[#801214] mt-1">
                      {pillar.subtitle}
                    </p>
                  </div>

                  {/* Technical Details */}
                  <p className="text-xs sm:text-sm text-zinc-700 font-medium leading-relaxed">
                    {pillar.techDetails}
                  </p>

                  {/* Clinical Benefit Highlight Box */}
                  <div className="bg-[#faf5f5] border border-[#801214]/20 rounded-xl p-3 sm:p-3.5 space-y-1">
                    <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#801214] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#801214]" />
                      <span>Clinical Benefit</span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-800 font-semibold leading-relaxed">
                      {pillar.impact}
                    </p>
                  </div>
                </div>

                {/* Footer Hardware / Dimension Specs */}
                <div className="pt-3.5 mt-3.5 border-t border-[#801214]/15 space-y-1 text-xs font-mono font-bold">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Channels:</span>
                    <span className="text-[#801214]">{pillar.channels}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400">Strides:</span>
                    <span className="text-zinc-600">{pillar.strides}</span>
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
