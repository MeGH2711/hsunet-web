import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Grid,
  Maximize2,
  Minimize2,
  Keyboard,
  ArrowLeft,
  X
} from "lucide-react";
import { usePresentation } from "./PresentationContext";

/**
 * PresentationDropup - 3 Vertical Dots Dropup Menu for Slide Controls
 * Positioned in the bottom right directly after the slide number.
 * Opens upwards with complete slide controls, navigation, and shortcuts.
 */
export default function PresentationDropup() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const presentation = usePresentation();

  // Close dropup on outside click or ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!presentation) return null;

  const {
    currentSlideIndex,
    totalSlides,
    goToNextSlide,
    goToPrevSlide,
    isPlaying,
    togglePlay,
    isFullscreen,
    toggleFullscreen,
    setShowSlideDrawer,
    setShowKeyHints,
    onExit,
    currentConfig,
  } = presentation;

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      {/* 3 Vertical Dots Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all shadow-md border ${
          isOpen
            ? "bg-[#801214] text-white border-[#801214]"
            : "bg-white hover:bg-[#801214] text-[#801214] hover:text-white border-[#801214]/30 hover:border-[#801214]"
        }`}
        title="Presentation Controls (Menu)"
        aria-label="Presentation Controls Menu"
        aria-expanded={isOpen}
      >
        <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>

      {/* Dropup Menu (Pops upwards above button) */}
      {isOpen && (
        <div className="absolute bottom-full mb-2.5 right-0 z-50 w-72 bg-white/98 backdrop-blur-md border-2 border-[#801214]/30 rounded-2xl shadow-2xl p-3 text-[#801214] select-none animate-in fade-in slide-in-from-bottom-2 duration-150">
          {/* Header Row */}
          <div className="flex items-center justify-between pb-2 border-b border-[#801214]/15">
            <div className="flex items-center gap-1.5 font-mono text-xs font-black text-black">
              <span className="w-2 h-2 rounded-full bg-[#801214]" />
              <span>
                Slide {String(currentSlideIndex + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-md hover:bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-black transition"
              title="Close Menu"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Slide Navigation Bar */}
          <div className="flex items-center justify-between py-2 border-b border-[#801214]/15">
            <button
              onClick={() => {
                goToPrevSlide();
              }}
              disabled={currentSlideIndex === 0}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-[#801214] hover:text-white text-zinc-700 text-xs font-bold disabled:opacity-30 disabled:pointer-events-none transition"
              title="Previous Slide"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            <span className="text-xs font-mono font-bold text-zinc-600 truncate max-w-[120px] text-center" title={currentConfig?.navTitle}>
              {currentConfig?.navTitle || `Slide ${currentSlideIndex + 1}`}
            </span>

            <button
              onClick={() => {
                goToNextSlide();
              }}
              disabled={currentSlideIndex === totalSlides - 1}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-[#801214] hover:text-white text-zinc-700 text-xs font-bold disabled:opacity-30 disabled:pointer-events-none transition"
              title="Next Slide"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Menu Action Items */}
          <div className="py-1.5 space-y-1">
            {/* Autoplay Toggle */}
            <button
              onClick={() => {
                togglePlay();
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-[#801214]/10 text-xs font-bold transition text-left"
            >
              <div className="flex items-center gap-2 text-zinc-800">
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-[#801214]" />
                ) : (
                  <Play className="w-4 h-4 text-[#801214]" />
                )}
                <span>{isPlaying ? "Pause Autoplay" : "Start Autoplay"}</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-[10px] font-mono text-zinc-500">P</kbd>
            </button>

            {/* Slide Overview Grid */}
            <button
              onClick={() => {
                setShowSlideDrawer(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-[#801214]/10 text-xs font-bold transition text-left"
            >
              <div className="flex items-center gap-2 text-zinc-800">
                <Grid className="w-4 h-4 text-[#801214]" />
                <span>All Slides Grid</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-[10px] font-mono text-zinc-500">G</kbd>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => {
                toggleFullscreen();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-[#801214]/10 text-xs font-bold transition text-left"
            >
              <div className="flex items-center gap-2 text-zinc-800">
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 text-[#801214]" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-[#801214]" />
                )}
                <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-[10px] font-mono text-zinc-500">F</kbd>
            </button>

            {/* Keyboard Shortcuts Hint */}
            <button
              onClick={() => {
                setShowKeyHints(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-[#801214]/10 text-xs font-bold transition text-left"
            >
              <div className="flex items-center gap-2 text-zinc-800">
                <Keyboard className="w-4 h-4 text-[#801214]" />
                <span>Shortcuts Guide</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-[10px] font-mono text-zinc-500">?</kbd>
            </button>

            {/* Return to Studio (if available) */}
            {onExit && (
              <>
                <div className="border-t border-[#801214]/15 my-1" />
                <button
                  onClick={() => {
                    onExit();
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-xs font-bold transition text-left text-[#801214]"
                >
                  <div className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4 text-[#801214]" />
                    <span>Return to Studio</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400">Exit</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
