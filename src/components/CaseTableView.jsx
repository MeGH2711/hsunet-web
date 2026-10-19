import React, { useState } from "react";
import { Table as TableIcon, Search, Eye, Download, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { cn, getDiceBg, formatNumber } from "../lib/utils";

export default function CaseTableView({ cases, onSelectSubject, onGoToInspector }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [tableSearch, setTableSearch] = useState("");
  const [sortField, setSortField] = useState("dice");
  const [sortAsc, setSortAsc] = useState(false);

  // Filter
  const filtered = cases.filter((c) => {
    if (!tableSearch) return true;
    const q = tableSearch.toLowerCase();
    return (
      c.subject.toLowerCase().includes(q) ||
      c.case_id.toLowerCase().includes(q) ||
      c.site.toLowerCase().includes(q) ||
      c.size_category.toLowerCase().includes(q)
    );
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let va = a[sortField];
    let vb = b[sortField];
    if (va === null || va === undefined) return 1;
    if (vb === null || vb === undefined) return -1;
    if (va < vb) return sortAsc ? -1 : 1;
    if (va > vb) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

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
    link.setAttribute("download", "hsunet_case_metrics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-black text-white p-6 space-y-4">
      {/* Table Header Controls */}
      <div className="border border-zinc-800 bg-zinc-950/70 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <TableIcon className="w-5 h-5 text-emerald-400" />
              Complete Case Metrics Database ({cases.length} Total Subjects)
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Individual subject segmentation metrics computed against neuroradiologist manual ground truths.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => {
                  setTableSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Filter table cases..."
                className="bg-zinc-900 border border-zinc-800 text-white text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-zinc-600 font-light"
              />
            </div>

            <button
              onClick={exportCSV}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs rounded-lg text-zinc-300 hover:text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
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
                <th className="py-3 px-3 text-center">Visuals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 font-light">
              {paginated.map((c) => (
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
                  <td className="py-2.5 px-2 text-zinc-300">
                    {c.site}
                  </td>
                  <td className="py-2.5 px-2 text-zinc-400">
                    {c.size_category}
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
                        "px-2 py-1 rounded text-[11px] font-medium transition-all flex items-center justify-center gap-1 mx-auto",
                        c.has_visuals
                          ? "bg-zinc-800 hover:bg-white hover:text-black text-cyan-300 border border-zinc-700"
                          : "text-zinc-600 hover:text-zinc-400"
                      )}
                    >
                      <Eye className="w-3 h-3" />
                      {c.has_visuals ? "View Slices" : "Details"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs text-zinc-400">
          <div>
            Showing {(page - 1) * pageSize + 1} -{" "}
            {Math.min(page * pageSize, sorted.length)} of {sorted.length} cases
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-zinc-300">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
