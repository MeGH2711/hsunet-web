import React, { useState } from "react";
import { BookOpen, Copy, Check } from "lucide-react";
import { PRESENTATION_METADATA } from "./slidesData";

export default function SlideReferences() {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const citations = [
    {
      id: 1,
      text: "Isensee, F., Jaeger, P. F., Kohl, S. A., Petersen, J., & Maier-Hein, K. H. (2021). nnU-Net: a self-configuring method for deep learning-based biomedical image segmentation. Nature methods, 18(2), 203-211."
    },
    {
      id: 2,
      text: "Patel, M., & Karia, K. Investigating Small-Lesion Segmentation Failures in Acute Ischemic Stroke: An nnU-Net Baseline Analysis for ISLES’26. In Stroke and neurovascular diseases Workshop on Imaging and Treatment CHallenges."
    },
    {
      id: 3,
      text: "Karia, K., & Patel, M. Bottleneck-Mamba 3D U-Net Baseline for Lesion Segmentation in ISLES’26 Ischemic Stroke: Limited by Precision in Segmenting Small and Multifocal Lesions. In Stroke and neurovascular diseases Workshop on Imaging and Treatment CHallenges."
    }
  ];

  const handleCopy = (text, idx) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (_) {}
  };

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
            <BookOpen className="w-3.5 h-3.5 text-white" />
            <span>Academic References</span>
          </div>
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

      {/* MAIN CONTENT ZONE: Clean, Centered, and Evenly Spaced */}
      <div className="relative z-20 flex-1 flex flex-col justify-evenly items-center max-w-[92rem] 2xl:max-w-[100rem] mx-auto w-full px-4 sm:px-8 py-4 sm:py-6">
        {/* Slide Main Heading */}
        <div className="space-y-2 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5.5xl font-black text-black tracking-tight leading-tight select-none">
            Academic <span className="text-[#801214]">References</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-zinc-600 font-medium">
            Foundational Literature &amp; Associated Workshop Publications
          </p>
        </div>

        {/* Pure Citation Cards: Clean, Readable, and Focused */}
        <div className="w-full space-y-5 sm:space-y-6">
          {citations.map((cite, idx) => {
            const isCopied = copiedIndex === idx;

            return (
              <div
                key={cite.id}
                className="group bg-white border-2 border-[#801214]/25 hover:border-[#801214] rounded-2xl p-5 sm:p-6 lg:p-7 shadow-md hover:shadow-xl transition-all duration-300 flex items-start gap-4 sm:gap-6 text-left"
              >
                {/* Reference Number */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#801214] text-white flex items-center justify-center font-mono font-black text-base sm:text-lg shrink-0 shadow-sm mt-0.5">
                  [{cite.id}]
                </div>

                {/* Pure Citation Text */}
                <div className="flex-1">
                  <p className="text-base sm:text-lg md:text-xl lg:text-1.5xl text-zinc-900 font-medium leading-relaxed group-hover:text-black transition-colors">
                    {cite.text}
                  </p>
                </div>

                {/* Copy Action */}
                <button
                  onClick={() => handleCopy(cite.text, idx)}
                  title="Copy citation"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-400 hover:text-[#801214] px-3 py-1.5 rounded-lg border border-zinc-200 hover:border-[#801214] bg-zinc-50 hover:bg-white transition-all shrink-0 mt-0.5"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </button>
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

        {/* BOTTOM RIGHT SLIDE NUMBER: Slide 4 */}
        <div className="flex items-center gap-1.5 bg-[#801214] text-white px-4 py-1 rounded-full font-mono text-xs font-bold shadow-lg border border-[#801214]">
          <span className="text-white/80 text-[10px] uppercase font-sans tracking-wider">Slide</span>
          <span className="text-white font-black">04</span>
        </div>
      </div>
    </div>
  );
}
