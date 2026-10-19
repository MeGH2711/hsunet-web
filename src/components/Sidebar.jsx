import React from "react";
import {
  Search,
  Filter,
  Activity,
  Layers,
  LineChart,
  Table as TableIcon,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  Sparkles,
  CheckCircle2,
  XCircle,
  BrainCircuit,
  Maximize2
} from "lucide-react";
import { cn, getDiceBg } from "../lib/utils";

export default function Sidebar({
  data,
  currentView,
  setCurrentView,
  selectedSubject,
  setSelectedSubject,
  searchQuery,
  setSearchQuery,
  selectedSite,
  setSelectedSite,
  selectedSize,
  setSelectedSize,
  onlyWithVisuals,
  setOnlyWithVisuals,
  sortBy,
  setSortBy,
  filteredCases,
}) {
  const sites = data?.summary?.sites || [];
  const sizes = data?.summary?.size_categories || [];

  return (
    <aside className="w-80 md:w-96 bg-black border-r border-zinc-800/80 flex flex-col h-screen select-none shrink-0 overflow-hidden">
      {/* Brand & App Title */}
      <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-white shadow-inner">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wider uppercase text-white flex items-center gap-1.5">
              HS-UNet Studio
              <span className="text-[10px] px-1.5 py-0.2 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded font-mono">
                v1.0
              </span>
            </h1>
            <p className="text-[11px] text-zinc-400 font-light tracking-wide">
              Neurovascular ISLES-22
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Overview, Inspector, Training, Table) */}
      <div className="px-3 pt-3 pb-2 border-b border-zinc-800/80 grid grid-cols-4 gap-1">
        <button
          onClick={() => setCurrentView("inspector")}
          className={cn(
            "flex flex-col items-center justify-center py-2 px-1 rounded-md text-[11px] font-medium transition-all",
            currentView === "inspector"
              ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
              : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
          )}
          title="Subject Visual Inspector"
        >
          <Layers className="w-4 h-4 mb-1" />
          Visuals
        </button>

        <button
          onClick={() => setCurrentView("overview")}
          className={cn(
            "flex flex-col items-center justify-center py-2 px-1 rounded-md text-[11px] font-medium transition-all",
            currentView === "overview"
              ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
              : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
          )}
          title="Global Benchmark Overview"
        >
          <Activity className="w-4 h-4 mb-1" />
          Overview
        </button>

        <button
          onClick={() => setCurrentView("training")}
          className={cn(
            "flex flex-col items-center justify-center py-2 px-1 rounded-md text-[11px] font-medium transition-all",
            currentView === "training"
              ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
              : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
          )}
          title="Training Curves & Logs"
        >
          <LineChart className="w-4 h-4 mb-1" />
          Curves
        </button>

        <button
          onClick={() => setCurrentView("table")}
          className={cn(
            "flex flex-col items-center justify-center py-2 px-1 rounded-md text-[11px] font-medium transition-all",
            currentView === "table"
              ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
              : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
          )}
          title="All Cases Table"
        >
          <TableIcon className="w-4 h-4 mb-1" />
          Metrics
        </button>
      </div>

      {/* Filter & Search Bar Section */}
      <div className="p-3 border-b border-zinc-800/80 space-y-2 bg-zinc-950/40">
        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Subject ID or Case ID..."
            className="w-full bg-zinc-900/80 border border-zinc-800 text-white text-xs rounded-md pl-8 pr-3 py-1.5 focus:outline-none focus:border-zinc-500 placeholder-zinc-500 font-light"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2 text-zinc-500 hover:text-zinc-300 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Dropdowns row */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-zinc-400 block mb-0.5 uppercase tracking-wider font-medium">
              Site
            </label>
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-zinc-600 font-light"
            >
              <option value="all">All Sites ({data?.summary?.total_cases || 0})</option>
              {sites.map((s) => (
                <option key={s} value={s}>
                  Site {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-zinc-400 block mb-0.5 uppercase tracking-wider font-medium">
              Size
            </label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-zinc-600 font-light"
            >
              <option value="all">All Sizes</option>
              {sizes.map((sz) => (
                <option key={sz} value={sz}>
                  {sz}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort & Visual Toggle Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="onlyVisuals"
              checked={onlyWithVisuals}
              onChange={(e) => setOnlyWithVisuals(e.target.checked)}
              className="accent-white w-3.5 h-3.5 rounded bg-zinc-900 border-zinc-700 cursor-pointer"
            />
            <label
              htmlFor="onlyVisuals"
              className="text-[11px] text-zinc-300 font-light cursor-pointer flex items-center gap-1"
            >
              <Eye className="w-3 h-3 text-cyan-400" />
              Pre-Cached Only ({data?.sampled_case_ids?.length || 0})
            </label>
          </div>

          <div className="flex items-center space-x-1.5">
            <SlidersHorizontal className="w-3 h-3 text-zinc-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-[11px] text-zinc-400 focus:outline-none cursor-pointer font-light hover:text-white"
            >
              <option value="dice-desc" className="bg-zinc-900 text-white">DSC (High to Low)</option>
              <option value="dice-asc" className="bg-zinc-900 text-white">DSC (Low to High)</option>
              <option value="vol-desc" className="bg-zinc-900 text-white">Volume (High)</option>
              <option value="vol-asc" className="bg-zinc-900 text-white">Volume (Low)</option>
              <option value="id-asc" className="bg-zinc-900 text-white">Subject ID</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subject List Header */}
      <div className="px-3 py-1.5 bg-black border-b border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
        <span>
          MATCHING CASES ({filteredCases.length})
        </span>
        <span className="text-[10px] text-zinc-500">
          DSC | HD95
        </span>
      </div>

      {/* Scrollable Subject Items */}
      <div className="flex-1 overflow-y-auto divide-y divide-zinc-900/80">
        {filteredCases.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs">
            No subjects match the selected filters.
          </div>
        ) : (
          filteredCases.map((c) => {
            const isSelected = selectedSubject?.case_id === c.case_id;
            return (
              <button
                key={c.case_id}
                onClick={() => {
                  setSelectedSubject(c);
                  if (currentView !== "inspector") {
                    setCurrentView("inspector");
                  }
                }}
                className={cn(
                  "w-full text-left px-3 py-2.5 transition-colors flex items-center justify-between group",
                  isSelected
                    ? "bg-zinc-900/90 border-l-2 border-white text-white"
                    : "hover:bg-zinc-950 text-zinc-300"
                )}
              >
                <div className="flex flex-col min-w-0 pr-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-medium text-white truncate group-hover:text-white">
                      {c.subject}
                    </span>
                    {c.has_visuals && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" title="Visual Slices Ready" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] text-zinc-400 mt-0.5">
                    <span className="font-mono">{c.case_id}</span>
                    <span>•</span>
                    <span>{c.site}</span>
                    <span>•</span>
                    <span>{c.ref_vol_ml.toFixed(1)} mL</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <div
                    className={cn(
                      "px-2 py-0.5 rounded text-[11px] font-mono font-medium border",
                      getDiceBg(c.dice)
                    )}
                  >
                    {c.dice.toFixed(3)}
                  </div>
                  <ChevronRight
                    className={cn(
                      "w-3.5 h-3.5 transition-transform",
                      isSelected ? "text-white translate-x-0.5" : "text-zinc-600 group-hover:text-zinc-400"
                    )}
                  />
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950 flex items-center justify-between text-[11px] text-zinc-400 font-light">
        <span>Evaluated: 1,453 Cases</span>
        <span className="text-zinc-300 font-mono">Epoch 100 Best</span>
      </div>
    </aside>
  );
}
