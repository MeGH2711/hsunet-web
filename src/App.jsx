import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import SubjectInspector from "./components/SubjectInspector";
import OverviewView from "./components/OverviewView";
import TrainingView from "./components/TrainingView";
import CaseTableView from "./components/CaseTableView";
import { Loader2, AlertCircle } from "lucide-react";

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentView, setCurrentView] = useState("inspector"); // "inspector", "overview", "training", "table"
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSite, setSelectedSite] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedSplit, setSelectedSplit] = useState("all");
  const [onlyWithVisuals, setOnlyWithVisuals] = useState(false); // Default to false so all 1,453 subjects can be browsed
  const [sortBy, setSortBy] = useState("dice-desc");

  useEffect(() => {
    fetch("/data/dashboard_data.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json);
        // Default to ISLES_1170 or first case
        const initial =
          json.cases.find((c) => c.case_id === "ISLES_1170") ||
          json.cases[0];
        setSelectedSubject(initial);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load dashboard data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filtered and sorted cases
  const filteredCases = useMemo(() => {
    if (!data?.cases) return [];
    let list = [...data.cases];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.subject.toLowerCase().includes(q) ||
          c.case_id.toLowerCase().includes(q) ||
          (c.split && c.split.toLowerCase().includes(q))
      );
    }

    // Site filter
    if (selectedSite !== "all") {
      list = list.filter((c) => c.site === selectedSite);
    }

    // Size filter
    if (selectedSize !== "all") {
      list = list.filter((c) => c.size_category === selectedSize);
    }

    // Split filter
    if (selectedSplit !== "all") {
      list = list.filter((c) => (c.split || "").toLowerCase() === selectedSplit.toLowerCase());
    }

    // Only with pre-rendered visuals toggle
    if (onlyWithVisuals) {
      list = list.filter((c) => c.has_visuals);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === "dice-desc") return b.dice - a.dice;
      if (sortBy === "dice-asc") return a.dice - b.dice;
      if (sortBy === "vol-desc") return b.ref_vol_ml - a.ref_vol_ml;
      if (sortBy === "vol-asc") return a.ref_vol_ml - b.ref_vol_ml;
      if (sortBy === "id-asc") return a.subject.localeCompare(b.subject);
      return 0;
    });

    return list;
  }, [data, searchQuery, selectedSite, selectedSize, onlyWithVisuals, sortBy]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-white font-sans">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <p className="text-xs tracking-wider uppercase text-zinc-400 font-medium">
            Loading HS-UNet Studio...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-white font-sans p-6">
        <div className="max-w-md text-center border border-zinc-800 bg-zinc-950 p-6 rounded-xl space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <h2 className="text-sm font-semibold text-white">Failed to Load Dashboard Data</h2>
          <p className="text-xs text-zinc-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-white font-sans">
      {/* Sidebar Navigation & Live Filters */}
      <Sidebar
        data={data}
        currentView={currentView}
        setCurrentView={setCurrentView}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSite={selectedSite}
        setSelectedSite={setSelectedSite}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedSplit={selectedSplit}
        setSelectedSplit={setSelectedSplit}
        onlyWithVisuals={onlyWithVisuals}
        setOnlyWithVisuals={setOnlyWithVisuals}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filteredCases={filteredCases}
      />

      {/* Main View Area */}
      <main className="flex-1 h-full min-h-0 overflow-hidden bg-black flex flex-col">
        {currentView === "inspector" && (
          <SubjectInspector
            subject={selectedSubject}
            onSelectSubject={setSelectedSubject}
          />
        )}

        {currentView === "overview" && (
          <OverviewView
            data={data}
            onSelectSubject={setSelectedSubject}
            onGoToInspector={() => setCurrentView("inspector")}
          />
        )}

        {currentView === "training" && (
          <TrainingView trainingData={data?.training} />
        )}

        {currentView === "table" && (
          <CaseTableView
            cases={data?.cases || []}
            onSelectSubject={setSelectedSubject}
            onGoToInspector={() => setCurrentView("inspector")}
          />
        )}
      </main>
    </div>
  );
}
