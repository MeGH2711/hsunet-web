import React, { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import SlideHeader from "./SlideHeader";
import SlideFooter from "./SlideFooter";

export default function SlideReferences() {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const citations = [
    {
      id: 1,
      venue: "Nature Methods (2021) • Biomedical Segmentation Foundation",
      text: "Isensee, F., Jaeger, P. F., Kohl, S. A., Petersen, J., & Maier-Hein, K. H. (2021). nnU-Net: a self-configuring method for deep learning-based biomedical image segmentation. Nature Methods, 18(2), 203–211."
    },
    {
      id: 2,
      venue: "MICCAI Workshop on Imaging and Treatment CHallenges (ISLES'26)",
      text: "Patel, M., & Karia, K. Investigating Small-Lesion Segmentation Failures in Acute Ischemic Stroke: An nnU-Net Baseline Analysis for ISLES’26. In Stroke and Neurovascular Diseases Workshop on Imaging and Treatment CHallenges."
    },
    {
      id: 3,
      venue: "MICCAI Workshop on Imaging and Treatment CHallenges (ISLES'26)",
      text: "Karia, K., & Patel, M. Bottleneck-Mamba 3D U-Net Baseline for Lesion Segmentation in ISLES’26 Ischemic Stroke: Limited by Precision in Segmenting Small and Multifocal Lesions. In Stroke and Neurovascular Diseases Workshop on Imaging and Treatment CHallenges."
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
            <span className="text-black">Academic </span>
            <span className="text-[#801214]">References</span>
          </>
        }
        subtitle="Foundational Literature & Associated Workshop Publications (ISLES'26 / MICCAI)"
        description="Core peer-reviewed methodologies and baseline analyses underpinning the HyperScale-UNet architecture."
      />

      {/* MAIN CONTENT ZONE: Fully Utilizing Vertical Canvas for Focused, Crisp Citations */}
      <main className="relative z-20 flex-1 min-h-0 w-full max-w-[94rem] 2xl:max-w-[102rem] mx-auto py-3 sm:py-4 flex flex-col justify-center">
        <div className="w-full space-y-4 sm:space-y-5 lg:space-y-6">
          {citations.map((cite, idx) => {
            const isCopied = copiedIndex === idx;

            return (
              <div
                key={cite.id}
                className="group bg-white border-2 border-[#801214]/25 hover:border-[#801214] rounded-2xl p-5 sm:p-6 lg:p-7 shadow-md hover:shadow-xl transition-all duration-300 flex items-start gap-4 sm:gap-6 text-left hover:-translate-y-0.5"
              >
                {/* Reference Number */}
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-[#801214] text-white flex items-center justify-center font-mono font-black text-lg sm:text-xl shrink-0 shadow-sm mt-0.5">
                  [{cite.id}]
                </div>

                {/* Pure Citation Content & Venue */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="text-xs sm:text-sm font-mono font-bold text-[#801214] uppercase tracking-wider">
                    {cite.venue}
                  </div>
                  <p className="text-base sm:text-lg md:text-xl text-zinc-900 font-semibold leading-relaxed group-hover:text-black transition-colors">
                    {cite.text}
                  </p>
                </div>

                {/* Copy Citation Action */}
                <button
                  onClick={() => handleCopy(cite.text, idx)}
                  title="Copy citation"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono font-bold text-zinc-500 hover:text-[#801214] px-3.5 py-2 rounded-xl border-2 border-zinc-200 hover:border-[#801214] bg-zinc-50 hover:bg-white transition-all shrink-0 mt-0.5 shadow-xs"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">Copied</span>
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
      </main>

      {/* REUSABLE STANDARDIZED SLIDE FOOTER */}
      <SlideFooter slideNumber="04" />
    </div>
  );
}
