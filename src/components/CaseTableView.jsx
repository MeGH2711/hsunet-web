import React, { useState, useMemo } from "react";
import {
  Table as TableIcon,
  Search,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
  RotateCcw,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  Image as ImageIcon,
  Layers,
  Sparkles,
  Building2
} from "lucide-react";
import { cn, getDiceBg, formatNumber, getSplitBadge, getSplitDot } from "../lib/utils";

export default function CaseTableView({ cases = [], onSelectSubject, onGoToInspector }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [tableSearch, setTableSearch] = useState("");
  const [scanFilter, setScanFilter] = useState("all"); // "all", "available", "unavailable"
  const [splitFilter, setSplitFilter] = useState("all"); // "all", "Training", "Validation", "Test"
  const [siteFilter, setSiteFilter] = useState("all"); // "all", or site code
  const [scaleFilter, setScaleFilter] = useState("all"); // "all", "Small", "Medium", "Large"
  const [tierFilter, setTierFilter] = useState("all"); // "all", "excellent", "good", "moderate", "challenging"

  const [sortField, setSortField] = useState("dice");
  const [sortAsc, setSortAsc] = useState(false);

  // Compute stats for filter labels
  const availableCount = useMemo(() => cases.filter((c) => c.has_visuals).length, [cases]);
  const unavailableCount = cases.length - availableCount;
  const sites = useMemo(() => Array.from(new Set(cases.map((c) => c.site).filter(Boolean))).sort(), [cases]);

  // Check if any filters are active
  const isFiltered =
    tableSearch.trim() !== "" ||
    scanFilter !== "all" ||
    splitFilter !== "all" ||
    siteFilter !== "all" ||
    scaleFilter !== "all" ||
    tierFilter !== "all";

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (tableSearch.trim()) count++;
    if (scanFilter !== "all") count++;
    if (splitFilter !== "all") count++;
    if (siteFilter !== "all") count++;
    if (scaleFilter !== "all") count++;
    if (tierFilter !== "all") count++;
    return count;
  }, [tableSearch, scanFilter, splitFilter, siteFilter, scaleFilter, tierFilter]);

  const handleResetFilters = () => {
    setTableSearch("");
    setScanFilter("all");
    setSplitFilter("all");
    setSiteFilter("all");
    setScaleFilter("all");
    setTierFilter("all");
    setPage(1);
  };

  // Filter cases
  const filtered = useMemo(() => {
    return cases.filter((c) => {
      // 1. Text search
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase().trim();
        const matches =
          c.subject.toLowerCase().includes(q) ||
          c.case_id.toLowerCase().includes(q) ||
          c.site.toLowerCase().includes(q) ||
          c.size_category.toLowerCase().includes(q) ||
          (c.split && c.split.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // 2. Scan availability filter
      if (scanFilter === "available" && !c.has_visuals) return false;
      if (scanFilter === "unavailable" && c.has_visuals) return false;

      // 3. Subject split filter
      if (splitFilter !== "all" && (c.split || "").toLowerCase() !== splitFilter.toLowerCase()) return false;

      // 4. Site filter
      if (siteFilter !== "all" && c.site !== siteFilter) return false;

      // 5. Scale category filter
      if (scaleFilter !== "all" && c.size_category !== scaleFilter) return false;

      // 6. Performance dice tier filter
      if (tierFilter !== "all") {
        if (tierFilter === "excellent" && c.dice < 0.85) return false;
        if (tierFilter === "good" && (c.dice < 0.70 || c.dice >= 0.85)) return false;
        if (tierFilter === "moderate" && (c.dice < 0.50 || c.dice >= 0.70)) return false;
        if (tierFilter === "challenging" && c.dice >= 0.50) return false;
      }

      return true;
    });
  }, [cases, tableSearch, scanFilter, splitFilter, siteFilter, scaleFilter, tierFilter]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let va = a[sortField];
      let vb = b[sortField];

      // Handle boolean for has_visuals
      if (sortField === "has_visuals") {
        va = a.has_visuals ? 1 : 0;
        vb = b.has_visuals ? 1 : 0;
      }

      if (va === null || va === undefined) return 1;
      if (vb === null || vb === undefined) return -1;
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortAsc]);

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = useMemo(() => {
    return sorted.slice((page - 1) * pageSize, page * pageSize);
  }, [sorted, page, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const exportCSV = () => {
    const headers = [
      "case_id",
      "subject",
      "split",
      "scans_available",
      "site",
      "size_category",
      "dice",
      "iou",
      "hd95",
      "ref_vol_ml",
      "pred_vol_ml",
      "abs_vol_diff_ml",
      "recall",
      "precision",
      "specificity",
      "time_sec"
    ];
    const rows = sorted.map((c) => [
      c.case_id,
      c.subject,
      c.split || "Test",
      c.has_visuals ? "Available" : "Unavailable",
      c.site,
      c.size_category,
      c.dice,
      c.iou,
      c.hd95 ?? "",
      c.ref_vol_ml,
      c.pred_vol_ml,
      c.abs_vol_diff_ml,
      c.recall,
      c.precision,
      c.specificity,
      c.time_sec
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hsunet_case_metrics_${scanFilter}_${splitFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 h-full min-h-0 overflow-y-auto bg-black text-white p-6 space-y-4">
      {/* Table Header & Comprehensive Filter Controls */}
      <div className="border border-zinc-800 bg-zinc-950/70 rounded-xl p-5 space-y-4 shadow-lg shrink-0">
        {/* Top Row: Title, Quick Count & Search / Export */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <TableIcon className="w-5 h-5 text-emerald-400" />
                Complete Case Metrics Database
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-zinc-900 border border-zinc-800 text-zinc-300">
                {cases.length} Total Subjects
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Multi-center lesion segmentation evaluation metrics against neuroradiologist manual ground truths.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => {
                  setTableSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search Subject ID, Case, Split..."
                className="bg-zinc-900 border border-zinc-800 text-white text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-zinc-500 placeholder-zinc-500 font-light w-64"
              />
              {tableSearch && (
                <button
                  onClick={() => {
                    setTableSearch("");
                    setPage(1);
                  }}
                  className="absolute right-2.5 top-2 text-zinc-500 hover:text-zinc-300 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Export CSV Button */}
            <button
              onClick={exportCSV}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs rounded-lg text-zinc-300 hover:text-white transition-colors"
              title="Download currently filtered table data as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV ({sorted.length})</span>
            </button>
          </div>
        </div>

        {/* Structured Filter Card Container */}
        <div className="pt-3.5 border-t border-zinc-800/80 space-y-3">
          {/* Filters Header Bar with Active Filter Counter and Reset Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded-md bg-zinc-900 border border-zinc-800 text-cyan-400">
                <Filter className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-zinc-200 tracking-wider font-mono">
                DATASET FILTERS
              </span>
              {activeFiltersCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-cyan-950/60 border border-cyan-800/60 text-cyan-300">
                  {activeFiltersCount} Active {activeFiltersCount === 1 ? "Filter" : "Filters"}
                </span>
              ) : (
                <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
                  (Showing all records)
                </span>
              )}
            </div>

            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-rose-950/40 border border-rose-800/60 text-rose-300 hover:bg-rose-900/60 transition-colors shadow-sm"
                title="Reset all search queries and active filter dropdowns"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Structured Filter Controls Grid (5 Distinct Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {/* 1. 3D Scan Availability Pill Switcher */}
            <div className="bg-zinc-900/50 border border-zinc-800/90 rounded-lg p-2.5 space-y-2 flex flex-col justify-between shadow-sm">
              <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-mono font-medium flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>3D Scan Visuals</span>
              </label>
              <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-md border border-zinc-800/90 text-xs">
                <button
                  onClick={() => { setScanFilter("all"); setPage(1); }}
                  className={cn(
                    "py-1 px-1 rounded text-[11px] font-mono transition-all text-center truncate",
                    scanFilter === "all" ? "bg-white text-black font-bold shadow-sm" : "text-zinc-400 hover:text-white"
                  )}
                  title={`All cases (${cases.length})`}
                >
                  All ({cases.length})
                </button>
                <button
                  onClick={() => { setScanFilter("available"); setPage(1); }}
                  className={cn(
                    "py-1 px-1 rounded text-[11px] font-mono transition-all text-center flex items-center justify-center gap-1 truncate",
                    scanFilter === "available"
                      ? "bg-emerald-500 text-black font-bold shadow-sm"
                      : "text-zinc-400 hover:text-emerald-400"
                  )}
                  title={`Available 3D scans (${availableCount})`}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", scanFilter === "available" ? "bg-black" : "bg-emerald-400")} />
                  <span className="truncate">Avail ({availableCount})</span>
                </button>
                <button
                  onClick={() => { setScanFilter("unavailable"); setPage(1); }}
                  className={cn(
                    "py-1 px-1 rounded text-[11px] font-mono transition-all text-center truncate",
                    scanFilter === "unavailable" ? "bg-zinc-800 text-white font-medium border border-zinc-700 shadow-sm" : "text-zinc-400 hover:text-zinc-300"
                  )}
                  title={`Unavailable (${unavailableCount})`}
                >
                  None ({unavailableCount})
                </button>
              </div>
            </div>

            {/* 2. Dataset Split Dropdown */}
            <div className="bg-zinc-900/50 border border-zinc-800/90 rounded-lg p-2.5 space-y-2 flex flex-col justify-between shadow-sm">
              <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-mono font-medium flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-violet-400" />
                <span>Dataset Split</span>
              </label>
              <select
                value={splitFilter}
                onChange={(e) => { setSplitFilter(e.target.value); setPage(1); }}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-violet-500 font-mono cursor-pointer hover:border-zinc-700 transition-colors"
              >
                <option value="all">All Splits</option>
                <option value="Training">Training (929)</option>
                <option value="Validation">Validation (233)</option>
                <option value="Test">Test (291)</option>
              </select>
            </div>

            {/* 3. Acquisition Site Dropdown */}
            <div className="bg-zinc-900/50 border border-zinc-800/90 rounded-lg p-2.5 space-y-2 flex flex-col justify-between shadow-sm">
              <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-mono font-medium flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Clinical Site</span>
              </label>
              <select
                value={siteFilter}
                onChange={(e) => { setSiteFilter(e.target.value); setPage(1); }}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-amber-500 font-mono cursor-pointer hover:border-zinc-700 transition-colors"
              >
                <option value="all">All Sites ({sites.length})</option>
                {sites.map((s) => (
                  <option key={s} value={s}>
                    Site {s}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Lesion Scale Dropdown */}
            <div className="bg-zinc-900/50 border border-zinc-800/90 rounded-lg p-2.5 space-y-2 flex flex-col justify-between shadow-sm">
              <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-mono font-medium flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" />
                <span>Lesion Scale</span>
              </label>
              <select
                value={scaleFilter}
                onChange={(e) => { setScaleFilter(e.target.value); setPage(1); }}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-rose-500 font-mono cursor-pointer hover:border-zinc-700 transition-colors"
              >
                <option value="all">All Scales</option>
                <option value="Small">Small (&lt; 1.5 mL)</option>
                <option value="Medium">Medium (1.5 - 15 mL)</option>
                <option value="Large">Large (&gt; 15 mL)</option>
              </select>
            </div>

            {/* 5. Performance Tier Dropdown */}
            <div className="bg-zinc-900/50 border border-zinc-800/90 rounded-lg p-2.5 space-y-2 flex flex-col justify-between shadow-sm">
              <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-mono font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Model Performance</span>
              </label>
              <select
                value={tierFilter}
                onChange={(e) => { setTierFilter(e.target.value); setPage(1); }}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 font-mono cursor-pointer hover:border-zinc-700 transition-colors"
              >
                <option value="all">All Performance Tiers</option>
                <option value="excellent">Excellent (DSC ≥ 0.85)</option>
                <option value="good">Good (0.70 ≤ DSC &lt; 0.85)</option>
                <option value="moderate">Moderate (0.50 ≤ DSC &lt; 0.70)</option>
                <option value="challenging">Challenging (DSC &lt; 0.50)</option>
              </select>
            </div>
          </div>

          {/* Active Filter Tags & Bottom Status Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-zinc-800/60 text-xs">
            {/* Left: Summary Count & Removable Active Filter Badges */}
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-zinc-400 font-mono">
                Showing <strong className="text-white font-semibold">{sorted.length}</strong> of{" "}
                <span className="text-zinc-400">{cases.length}</span> subjects
              </span>
              {isFiltered && (
                <span className="text-[11px] font-mono text-zinc-500">
                  ({cases.length - sorted.length} filtered out)
                </span>
              )}

              {/* Removable Active Filter Pills */}
              {isFiltered && (
                <div className="flex items-center flex-wrap gap-1.5 ml-1">
                  {tableSearch.trim() && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-zinc-900 border border-zinc-700 text-zinc-200">
                      Query: "{tableSearch}"
                      <button onClick={() => { setTableSearch(""); setPage(1); }} className="hover:text-rose-400 ml-0.5 font-bold">✕</button>
                    </span>
                  )}
                  {scanFilter !== "all" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-cyan-950/40 border border-cyan-800/60 text-cyan-300">
                      Visuals: {scanFilter}
                      <button onClick={() => { setScanFilter("all"); setPage(1); }} className="hover:text-rose-400 ml-0.5 font-bold">✕</button>
                    </span>
                  )}
                  {splitFilter !== "all" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-violet-950/40 border border-violet-800/60 text-violet-300">
                      Split: {splitFilter}
                      <button onClick={() => { setSplitFilter("all"); setPage(1); }} className="hover:text-rose-400 ml-0.5 font-bold">✕</button>
                    </span>
                  )}
                  {siteFilter !== "all" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-amber-950/40 border border-amber-800/60 text-amber-300">
                      Site: {siteFilter}
                      <button onClick={() => { setSiteFilter("all"); setPage(1); }} className="hover:text-rose-400 ml-0.5 font-bold">✕</button>
                    </span>
                  )}
                  {scaleFilter !== "all" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-rose-950/40 border border-rose-800/60 text-rose-300">
                      Scale: {scaleFilter}
                      <button onClick={() => { setScaleFilter("all"); setPage(1); }} className="hover:text-rose-400 ml-0.5 font-bold">✕</button>
                    </span>
                  )}
                  {tierFilter !== "all" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-emerald-950/40 border border-emerald-800/60 text-emerald-300">
                      Tier: {tierFilter}
                      <button onClick={() => { setTierFilter("all"); setPage(1); }} className="hover:text-rose-400 ml-0.5 font-bold">✕</button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Right: Quick Page Size Selector */}
            <div className="flex items-center space-x-2 font-mono text-xs">
              <span className="text-[11px] text-zinc-400">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-md px-2.5 py-1 focus:outline-none focus:border-zinc-600 font-mono cursor-pointer hover:border-zinc-700 transition-colors"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={250}>250</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="border border-zinc-800 bg-zinc-950 rounded-xl overflow-hidden flex flex-col shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 font-medium">
                <th
                  onClick={() => handleSort("subject")}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1 font-mono">
                    Subject ID <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("case_id")}
                  className="py-3 px-3 cursor-pointer hover:text-white font-mono"
                >
                  Case ID
                </th>
                <th
                  onClick={() => handleSort("split")}
                  className="py-3 px-2 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1 font-mono">
                    Split <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("site")}
                  className="py-3 px-2 cursor-pointer hover:text-white"
                >
                  Site
                </th>
                <th
                  onClick={() => handleSort("size_category")}
                  className="py-3 px-2 cursor-pointer hover:text-white"
                >
                  Scale
                </th>
                <th
                  onClick={() => handleSort("has_visuals")}
                  className="py-3 px-3 text-center cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-center gap-1 font-mono">
                    Scans Available <ArrowUpDown className="w-3 h-3 text-cyan-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("dice")}
                  className="py-3 px-3 cursor-pointer hover:text-white font-mono"
                >
                  <div className="flex items-center gap-1">
                    Dice (DSC) <ArrowUpDown className="w-3 h-3 text-cyan-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("iou")}
                  className="py-3 px-2 cursor-pointer hover:text-white font-mono"
                >
                  IoU
                </th>
                <th
                  onClick={() => handleSort("hd95")}
                  className="py-3 px-2 cursor-pointer hover:text-white font-mono"
                >
                  HD95 (mm)
                </th>
                <th
                  onClick={() => handleSort("ref_vol_ml")}
                  className="py-3 px-2 cursor-pointer hover:text-white font-mono"
                >
                  GT Vol (mL)
                </th>
                <th
                  onClick={() => handleSort("pred_vol_ml")}
                  className="py-3 px-2 cursor-pointer hover:text-white font-mono"
                >
                  Pred Vol (mL)
                </th>
                <th
                  onClick={() => handleSort("recall")}
                  className="py-3 px-2 cursor-pointer hover:text-white font-mono"
                >
                  Recall
                </th>
                <th
                  onClick={() => handleSort("precision")}
                  className="py-3 px-2 cursor-pointer hover:text-white font-mono"
                >
                  Precision
                </th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 font-light">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Filter className="w-8 h-8 text-zinc-600 mb-1" />
                      <p className="text-sm font-medium text-zinc-400">No subjects match the selected filters</p>
                      <p className="text-xs text-zinc-600 max-w-sm">
                        Try clearing or relaxing your filter conditions or search query.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-2 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-white rounded-lg transition-colors"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((c) => (
                  <tr
                    key={c.case_id}
                    className="hover:bg-zinc-900/50 transition-colors group"
                  >
                    <td className="py-2.5 px-3 font-mono font-medium text-white">
                      {c.subject}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-400">
                      {c.case_id}
                    </td>
                    <td className="py-2.5 px-2">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-mono font-medium border inline-flex items-center gap-1",
                          getSplitBadge(c.split)
                        )}
                      >
                        <span className={cn("w-1.5 h-1.5 rounded-full", getSplitDot(c.split))} />
                        {c.split || "Test"}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-zinc-300">
                      {c.site}
                    </td>
                    <td className="py-2.5 px-2 text-zinc-400">
                      {c.size_category}
                    </td>
                    {/* Scans Availability Column */}
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-mono font-medium border inline-flex items-center gap-1",
                          c.has_visuals
                            ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                            : "bg-zinc-900 border-zinc-800 text-zinc-500"
                        )}
                        title={
                          c.has_visuals
                            ? "Pre-rendered 2D slice volumes and overlays available for instant interactive viewing"
                            : "Evaluation metrics computed; slices dynamically served or metadata-only"
                        }
                      >
                        <span className={cn("w-1.5 h-1.5 rounded-full", c.has_visuals ? "bg-emerald-400" : "bg-zinc-600")} />
                        {c.has_visuals ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[11px] font-medium border",
                          getDiceBg(c.dice)
                        )}
                      >
                        {c.dice.toFixed(4)}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-mono text-zinc-300">
                      {c.iou.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-2 font-mono text-zinc-300">
                      {c.hd95 !== null ? c.hd95.toFixed(2) : "N/A"}
                    </td>
                    <td className="py-2.5 px-2 font-mono text-emerald-400">
                      {c.ref_vol_ml.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-2 font-mono text-cyan-400">
                      {c.pred_vol_ml.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-2 font-mono text-zinc-300">
                      {(c.recall * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-2 font-mono text-zinc-300">
                      {(c.precision * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => {
                          onSelectSubject(c);
                          onGoToInspector();
                        }}
                        className={cn(
                          "px-2.5 py-1 rounded text-[11px] font-medium transition-all flex items-center justify-center gap-1 mx-auto",
                          c.has_visuals
                            ? "bg-zinc-800 hover:bg-white hover:text-black text-cyan-300 border border-zinc-700 shadow-sm"
                            : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800"
                        )}
                        title={c.has_visuals ? "Inspect 2D/3D slice viewer" : "Inspect subject metrics"}
                      >
                        <Eye className="w-3 h-3" />
                        {c.has_visuals ? "View Slices" : "Details"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
          <div>
            Showing{" "}
            <span className="font-mono text-white">
              {sorted.length > 0 ? (page - 1) * pageSize + 1 : 0}
            </span>{" "}
            -{" "}
            <span className="font-mono text-white">
              {Math.min(page * pageSize, sorted.length)}
            </span>{" "}
            of <span className="font-mono text-white">{sorted.length}</span> cases
            {isFiltered && (
              <span className="text-zinc-500 ml-1">
                (filtered from {cases.length} total)
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-zinc-300">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
