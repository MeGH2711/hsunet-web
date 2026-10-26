import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Grid,
  X,
  Keyboard,
  ArrowLeft,
  Sparkles,
  Layers,
  HelpCircle
} from "lucide-react";
import { SLIDES_CONFIG, PRESENTATION_METADATA } from "./slidesData";
import { PresentationContext } from "./PresentationContext";
import SlideTitle from "./SlideTitle";
import SlideIntroduction from "./SlideIntroduction";
import SlideArchitecture from "./SlideArchitecture";
import SlideReferences from "./SlideReferences";
import SlideConclusion from "./SlideConclusion";

const SLIDE_COMPONENTS = {
  title: SlideTitle,
  introduction: SlideIntroduction,
  architecture: SlideArchitecture,
  references: SlideReferences,
  conclusion: SlideConclusion,
};

export default function PresentationView({ model = "hsunet", onExit }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const s = parseInt(params.get("slide"), 10);
      if (!isNaN(s) && s >= 1 && s <= SLIDES_CONFIG.length) {
        return s - 1;
      }
    } catch (_) {}
    return 0;
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playInterval, setPlayInterval] = useState(8000); // 8s per slide
  const [showSlideDrawer, setShowSlideDrawer] = useState(false);
  const [showKeyHints, setShowKeyHints] = useState(false);
  const [timerProgress, setTimerProgress] = useState(0);

  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const progressTimerRef = useRef(null);

  const totalSlides = SLIDES_CONFIG.length;
  const currentConfig = SLIDES_CONFIG[currentSlideIndex];
  const ActiveSlideComponent = SLIDE_COMPONENTS[currentConfig.id] || SlideTitle;

  // Slide navigation handlers (no loop)
  const goToNextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1 < totalSlides ? prev + 1 : prev));
    setTimerProgress(0);
  }, [totalSlides]);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 >= 0 ? prev - 1 : 0));
    setTimerProgress(0);
  }, []);

  const goToSlide = (index) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlideIndex(index);
      setShowSlideDrawer(false);
      setTimerProgress(0);
    }
  };

  const togglePlay = useCallback(() => {
    setIsPlaying((prevPlaying) => {
      if (!prevPlaying && currentSlideIndex >= totalSlides - 1) {
        setCurrentSlideIndex(0);
      }
      return !prevPlaying;
    });
  }, [currentSlideIndex, totalSlides]);

  // Toggle native HTML5 fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch((err) => {
          console.warn("Fullscreen error:", err);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Fullscreen state listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
        case " ":
          e.preventDefault();
          goToNextSlide();
          break;
        case "ArrowLeft":
        case "PageUp":
        case "Backspace":
          e.preventDefault();
          goToPrevSlide();
          break;
        case "Home":
          e.preventDefault();
          goToSlide(0);
          break;
        case "End":
          e.preventDefault();
          goToSlide(totalSlides - 1);
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "p":
        case "P":
          e.preventDefault();
          togglePlay();
          break;
        case "g":
        case "G":
          e.preventDefault();
          setShowSlideDrawer((prev) => !prev);
          break;
        case "?":
          e.preventDefault();
          setShowKeyHints((prev) => !prev);
          break;
        case "Escape":
          if (showSlideDrawer) {
            setShowSlideDrawer(false);
          } else if (showKeyHints) {
            setShowKeyHints(false);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextSlide, goToPrevSlide, togglePlay, totalSlides, showSlideDrawer, showKeyHints]);

  // Autoplay timer
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      setTimerProgress(0);
      return;
    }

    const intervalStep = 100;
    let elapsed = 0;

    progressTimerRef.current = setInterval(() => {
      elapsed += intervalStep;
      const pct = Math.min(100, (elapsed / playInterval) * 100);
      setTimerProgress(pct);
      if (elapsed >= playInterval) {
        elapsed = 0;
        setTimerProgress(0);
        setCurrentSlideIndex((prev) => {
          if (prev + 1 < totalSlides) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }
    }, intervalStep);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying, playInterval, totalSlides]);

  const presentationContextValue = {
    currentSlideIndex,
    totalSlides,
    goToNextSlide,
    goToPrevSlide,
    goToSlide,
    isPlaying,
    togglePlay,
    isFullscreen,
    toggleFullscreen,
    showSlideDrawer,
    setShowSlideDrawer,
    showKeyHints,
    setShowKeyHints,
    onExit,
    currentConfig,
  };

  return (
    <PresentationContext.Provider value={presentationContextValue}>
      <div
        ref={containerRef}
        className={`relative w-full h-full flex flex-col bg-white text-[#801214] select-none overflow-hidden ${
          isFullscreen ? "p-0" : ""
        }`}
      >
        {/* Autoplay Top Progress Bar */}
        {isPlaying && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#801214]/15 z-50 overflow-hidden">
            <div
              className="h-full bg-[#801214] transition-all duration-100 ease-linear shadow-md"
              style={{ width: `${timerProgress}%` }}
            />
          </div>
        )}

        {/* MAIN SLIDE STAGE CANVAS */}
        <main className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center bg-white">
          <div className="w-full h-full transition-all duration-300">
            <ActiveSlideComponent />
          </div>
        </main>

      {/* SLIDE GRID DRAWER / OVERVIEW MODAL in Light Theme */}
      {showSlideDrawer && (
        <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col p-6 md:p-12 animate-in fade-in duration-200 text-[#801214]">
          <div className="flex items-center justify-between pb-4 border-b-2 border-[#801214]/20">
            <div>
              <h3 className="text-xl font-black text-black">Presentation Slides Overview</h3>
              <p className="text-xs text-zinc-600">Click any slide to jump directly to it</p>
            </div>
            <button
              onClick={() => setShowSlideDrawer(false)}
              className="p-2 rounded-lg bg-[#801214]/10 hover:bg-[#801214] text-[#801214] hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-auto pt-6 max-w-5xl mx-auto w-full">
            {SLIDES_CONFIG.map((slide, index) => {
              const isActive = index === currentSlideIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(index)}
                  className={`text-left rounded-2xl p-6 border-2 transition-all group ${
                    isActive
                      ? "bg-white border-[#801214] shadow-2xl scale-[1.02]"
                      : "bg-[#faf5f5] border-[#801214]/20 hover:border-[#801214] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-black px-2.5 py-1 rounded-full bg-[#801214] text-white">
                      Slide {String(index + 1).padStart(2, "0")}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-mono font-bold text-[#801214] bg-[#801214]/10 px-2 py-0.5 rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-black text-black group-hover:text-[#801214] transition">
                    {slide.navTitle}
                  </h4>
                  <p className="text-xs text-zinc-600 font-medium mt-1">{slide.category}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* KEYBOARD SHORTCUTS MODAL in Light Theme */}
      {showKeyHints && (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#801214] rounded-2xl p-6 max-w-md w-full shadow-2xl text-[#801214]">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#801214]/20">
              <h4 className="text-base font-black text-black flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-[#801214]" />
                Keyboard Shortcuts
              </h4>
              <button
                onClick={() => setShowKeyHints(false)}
                className="p-1 rounded text-zinc-400 hover:text-[#801214]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 py-4 text-xs font-medium">
              <div className="flex items-center justify-between">
                <span className="text-zinc-600">Next Slide</span>
                <span className="px-2 py-1 rounded bg-[#801214]/10 font-mono text-[#801214] font-bold">
                  → / Space / PgDown
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600">Previous Slide</span>
                <span className="px-2 py-1 rounded bg-[#801214]/10 font-mono text-[#801214] font-bold">
                  ← / Backspace / PgUp
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600">Toggle Fullscreen</span>
                <span className="px-2 py-1 rounded bg-[#801214]/10 font-mono text-[#801214] font-bold">F</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600">Toggle Autoplay</span>
                <span className="px-2 py-1 rounded bg-[#801214]/10 font-mono text-[#801214] font-bold">P</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600">Slide Drawer</span>
                <span className="px-2 py-1 rounded bg-[#801214]/10 font-mono text-[#801214] font-bold">G</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600">First / Last Slide</span>
                <span className="px-2 py-1 rounded bg-[#801214]/10 font-mono text-[#801214] font-bold">
                  Home / End
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowKeyHints(false)}
              className="w-full py-2 bg-[#801214] hover:bg-[#9e171a] text-white rounded-xl text-xs font-bold transition shadow-md"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  </PresentationContext.Provider>
  );
}
