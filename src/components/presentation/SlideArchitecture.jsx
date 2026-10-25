import React from "react";
import {
  Cpu,
  Layers,
  Scale,
  Sparkles,
  Target,
  Boxes,
  Eye,
  Activity,
  CheckCircle2
} from "lucide-react";
import { PRESENTATION_METADATA } from "./slidesData";

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
      badge: "Stage 02 • Skip Connection Gating",
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
    <div className="relative w-full h-full flex flex-col justify-between pt-3 sm:pt-4 md:pt-5 px-4 sm:px-8 lg:px-10 pb-3 sm:pb-5 overflow-hidden select-none bg-white text-[#801214]">
      {/* Background Subtle Geometric Mesh & Crimson Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[54rem] h-[54rem] rounded-full bg-[#801214]/4 blur-3xl" />
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] rounded-full bg-[#801214]/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] rounded-full bg-[#801214]/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#801214_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.05]" />
      </div>

      {/* TOP BAR: Tag & Top-Right AU Logo */}
      <div className="relative z-30 flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#801214] text-white text-xs font-semibold tracking-wider uppercase shadow-md shadow-[#801214]/20 border border-[#801214]">
            <Cpu className="w-3.5 h-3.5 text-white" />
            <span>Proposed Architecture</span>
          </div>

          <span className="hidden md:inline-flex items-center gap-1.5 text-[#801214] text-xs font-mono font-bold bg-[#801214]/10 px-3.5 py-1.5 rounded-full border border-[#801214]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#801214] animate-pulse" />
            HyperScale-UNet • nnU-Net v2 Full-Resolution Framework
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

      {/* MAIN CONTENT ZONE: Fully Balanced & Even Widescreen Layout */}
      <div className="relative z-20 flex-1 flex flex-col justify-evenly items-center text-center max-w-[96rem] 2xl:max-w-[106rem] mx-auto w-full px-2 sm:px-4 py-2 sm:py-3">
        {/* Slide Main Heading */}
        <div className="space-y-2 max-w-7xl mx-auto">
          <h2 className="tracking-tight select-none">
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-5.5xl font-black text-black leading-tight">
              HyperScale-UNet:{" "}
              <span className="text-[#801214]">Scale-Invariant Architecture</span>
            </span>
            <span className="block text-xl sm:text-2xl md:text-2.5xl lg:text-3xl text-[#52090b] font-bold mt-1.5">
              Dual SE-ResNet Backbone with Lesion Attention Gates &amp; 5-Tier Deep Supervision
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-600 font-medium max-w-6xl mx-auto leading-relaxed pt-0.5">
            Engineered to decouple multi-scale lesion gradients, elevating small lesion Dice by +45% within an 8 GB VRAM hardware budget.
          </p>
        </div>

        {/* 4 Architectural Innovation Pillar Cards: Expansive & Balanced */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 xl:gap-7 w-full max-w-[96rem] 2xl:max-w-[106rem] mx-auto items-stretch">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <div
                key={pillar.id}
                className="group bg-white border-2 border-[#801214]/25 hover:border-[#801214] rounded-2xl p-5 sm:p-6 lg:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between text-left hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] xl:text-xs font-mono font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#801214]/10 text-[#801214] group-hover:bg-[#801214] group-hover:text-white transition-colors">
                      {pillar.badge}
                    </span>
                    <span className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#801214]/10 text-[#801214] group-hover:bg-[#801214] group-hover:text-white transition-all shadow-xs">
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
                  <p className="text-xs sm:text-sm text-zinc-600 font-medium leading-relaxed">
                    {pillar.techDetails}
                  </p>

                  {/* Clinical Benefit Highlight Box */}
                  <div className="bg-[#faf5f5] border border-[#801214]/20 rounded-xl p-3 sm:p-3.5 space-y-1">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#801214] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#801214]" />
                      <span>Clinical Benefit</span>
                    </div>
                    <p className="text-xs text-zinc-700 font-semibold leading-relaxed">
                      {pillar.impact}
                    </p>
                  </div>
                </div>

                {/* Footer Hardware / Dimension Specs */}
                <div className="pt-4 mt-4 border-t border-[#801214]/15 space-y-1.5 text-xs font-mono font-bold">
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
      </div>

      {/* FOOTER BAR: SEAS Affiliation Note on Left & STRICT SLIDE NUMBER ON BOTTOM RIGHT */}
      <div className="relative z-20 flex items-center justify-between text-xs text-[#801214] pt-3 border-t-2 border-[#801214]/20 w-full">
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-[#801214]" />
          <span>School of Engineering and Applied Science • Ahmedabad University • Megh Patel &amp; Konark Karia</span>
        </div>

        {/* BOTTOM RIGHT SLIDE NUMBER: Slide 3 */}
        <div className="flex items-center gap-1.5 bg-[#801214] text-white px-4 py-1 rounded-full font-mono text-xs font-bold shadow-lg border border-[#801214]">
          <span className="text-white/80 text-[10px] uppercase font-sans tracking-wider">Slide</span>
          <span className="text-white font-black">03</span>
        </div>
      </div>
    </div>
  );
}
