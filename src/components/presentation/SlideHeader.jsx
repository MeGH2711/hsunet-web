import React from "react";
import { PRESENTATION_METADATA } from "./slidesData";

/**
 * SlideHeader - Standardized Header for Presentation Slides
 * Replaces redundant top pill badges with direct slide titles & subtitles,
 * freeing up maximum vertical canvas space for primary slide content.
 */
export default function SlideHeader({
  title,
  subtitle,
  description,
  logoUrl = PRESENTATION_METADATA.logoUrl,
  className = "",
}) {
  return (
    <header className={`relative z-30 w-full shrink-0 flex items-center justify-between gap-4 pt-3 sm:pt-4 md:pt-5 pb-3 sm:pb-4 border-b-2 border-[#801214]/20 select-none ${className}`}>
      {/* Title, Subtitle & Optional Context Description */}
      <div className="flex-1 min-w-0 text-left space-y-0.5 sm:space-y-1">
        <h2 className="text-2xl sm:text-3xl md:text-3.5xl lg:text-4xl font-black tracking-tight leading-tight">
          {title}
        </h2>
        {subtitle && (
          <div className="text-xs sm:text-sm md:text-base lg:text-lg text-[#801214] font-extrabold tracking-normal">
            {subtitle}
          </div>
        )}
        {description && (
          <p className="hidden md:block text-xs sm:text-sm text-zinc-600 font-semibold leading-snug">
            {description}
          </p>
        )}
      </div>

      {/* Top-Right Ahmedabad University Logo */}
      <div className="shrink-0 flex items-center pl-2">
        <img
          src={logoUrl}
          alt="Ahmedabad University Logo"
          className="h-12 sm:h-14 md:h-16 lg:h-24 w-auto object-contain block select-none transition-transform duration-300 hover:scale-105"
        />
      </div>
    </header>
  );
}
