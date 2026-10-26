import React from "react";
import PresentationDropup from "./PresentationDropup";

/**
 * SlideFooter - Standardized Footer for Presentation Slides
 * Displays university affiliation on the left, and official slide number badge
 * followed by the 3 vertical dots dropup menu on the right.
 */
export default function SlideFooter({
  slideNumber,
  affiliation = "School of Engineering and Applied Science • Ahmedabad University • Megh Patel & Konark Karia",
}) {
  return (
    <footer className="relative z-20 shrink-0 flex items-center justify-between text-xs sm:text-sm text-[#801214] pt-2.5 sm:pt-3 border-t-2 border-[#801214]/20 w-full select-none">
      {/* Affiliation / Presenters */}
      <div className="flex items-center gap-2 font-semibold">
        <span className="w-2 h-2 rounded-full bg-[#801214]" />
        <span>{affiliation}</span>
      </div>

      {/* Right side: Slide Number Badge + 3-Dots Dropup Menu */}
      <div className="flex items-center gap-2">
        {slideNumber && (
          <div className="flex items-center gap-1.5 bg-[#801214] text-white px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full font-mono text-xs sm:text-sm font-bold shadow-lg border border-[#801214]">
            <span className="text-white/80 text-[10px] sm:text-xs uppercase font-sans tracking-wider">
              Slide
            </span>
            <span className="text-white font-black">{slideNumber}</span>
          </div>
        )}

        {/* Dropup menu with 3 vertical dots */}
        <PresentationDropup />
      </div>
    </footer>
  );
}
