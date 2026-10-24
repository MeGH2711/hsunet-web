import React, { useState, useEffect, useMemo } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
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

  const [selectedSubject, setSelectedSubject] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Derive current view from pathname
  const currentView = useMemo(() => {
    const p = location.pathname.toLowerCase();
    if (p.startsWith("/hsunet/overview")) return "overview";
    if (p.startsWith("/hsunet/curves") || p.startsWith("/curves") || p.startsWith("/training")) return "curves";
    if (p.startsWith("/hsunet/metrics") || p.startsWith("/metrics") || p.startsWith("/table")) return "metrics";
    return "visuals";
  }, [location.pathname]);

  // Navigate to corresponding /hsunet route
  const handleViewChange = (view) => {
    if (view === "overview") {
      navigate("/hsunet/overview");
    } else if (view === "curves" || view === "training") {
      navigate("/hsunet/curves");
    } else if (view === "metrics" || view === "table") {
      navigate("/hsunet/metrics");
    } else {
      navigate("/hsunet/visuals");
    }
  };

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

        // Check if a specific case is requested via query (?case=...) or URL path
        const urlParams = new URLSearchParams(window.location.search);
        const queryCase = urlParams.get("case");
        const pathMatch = window.location.pathname.match(
          /^\/hsunet\/visuals\/([^/]+)/i
        );
        const pathCase = pathMatch ? pathMatch[1] : null;
        const targetId = queryCase || pathCase;

        let initial = null;
        if (targetId) {
          initial = json.cases.find(
            (c) =>
              c.case_id.toLowerCase() === targetId.toLowerCase() ||
              c.subject.toLowerCase() === targetId.toLowerCase()
          );
        }
        if (!initial) {
          initial =
            json.cases.find((c) => c.case_id === "ISLES_1170") ||
            json.cases[0];
        }
        setSelectedSubject(initial);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load dashboard data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Synchronize selected subject when URL path (/hsunet/visuals/:caseId) or search param (?case=...) changes
  useEffect(() => {
    if (!data?.cases || data.cases.length === 0) return;

    const queryCase = searchParams.get("case");
    const pathMatch = location.pathname.match(/^\/hsunet\/visuals\/([^/]+)/i);
    const pathCase = pathMatch ? pathMatch[1] : null;
    const targetId = queryCase || pathCase;

    if (targetId) {
      const match = data.cases.find(
        (c) =>
          c.case_id.toLowerCase() === targetId.toLowerCase() ||
          c.subject.toLowerCase() === targetId.toLowerCase()
      );
      if (match && match.case_id !== selectedSubject?.case_id) {
        setSelectedSubject(match);
      }
    }
  }, [location.pathname, searchParams, data, selectedSubject]);

  // Handler for subject selection from components
  const handleSelectSubject = (subject, shouldNavigateToVisuals = false) => {
    setSelectedSubject(subject);
    if (shouldNavigateToVisuals) {
      navigate("/hsunet/visuals");
    }
  };

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
      list = list.filter(
        (c) => (c.split || "").toLowerCase() === selectedSplit.toLowerCase()
      );
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
          <h2 className="text-sm font-semibold text-white">
            Failed to Load Dashboard Data
          </h2>
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
        setCurrentView={handleViewChange}
        selectedSubject={selectedSubject}
        setSelectedSubject={(c) => {
          setSelectedSubject(c);
          if (currentView !== "visuals") {
            navigate("/hsunet/visuals");
          }
        }}
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

      {/* Main Routed View Area */}
      <main className="flex-1 h-full min-h-0 overflow-hidden bg-black flex flex-col">
        <Routes>
          {/* Main /hsunet routes */}
          <Route
            path="/hsunet/visuals"
            element={
              <SubjectInspector
                subject={selectedSubject}
                onSelectSubject={handleSelectSubject}
              />
            }
          />
          <Route
            path="/hsunet/visuals/:caseId"
            element={
              <SubjectInspector
                subject={selectedSubject}
                onSelectSubject={handleSelectSubject}
              />
            }
          />
          <Route
            path="/hsunet/overview"
            element={
              <OverviewView
                data={data}
                onSelectSubject={(c) => handleSelectSubject(c, true)}
                onGoToInspector={() => navigate("/hsunet/visuals")}
                onGoToTraining={() => navigate("/hsunet/curves")}
              />
            }
          />
          <Route
            path="/hsunet/curves"
            element={<TrainingView trainingData={data?.training} />}
          />
          <Route
            path="/hsunet/metrics"
            element={
              <CaseTableView
                cases={data?.cases || []}
                onSelectSubject={(c) => handleSelectSubject(c, true)}
                onGoToInspector={() => navigate("/hsunet/visuals")}
              />
            }
          />

          {/* Root and route redirects */}
          <Route path="/" element={<Navigate to="/hsunet/visuals" replace />} />
          <Route
            path="/hsunet"
            element={<Navigate to="/hsunet/visuals" replace />}
          />
          <Route
            path="/visuals"
            element={<Navigate to="/hsunet/visuals" replace />}
          />
          <Route
            path="/overview"
            element={<Navigate to="/hsunet/overview" replace />}
          />
          <Route
            path="/curves"
            element={<Navigate to="/hsunet/curves" replace />}
          />
          <Route
            path="/metrics"
            element={<Navigate to="/hsunet/metrics" replace />}
          />
          <Route
            path="/inspector"
            element={<Navigate to="/hsunet/visuals" replace />}
          />
          <Route
            path="/training"
            element={<Navigate to="/hsunet/curves" replace />}
          />
          <Route
            path="/table"
            element={<Navigate to="/hsunet/metrics" replace />}
          />
          <Route path="*" element={<Navigate to="/hsunet/visuals" replace />} />
        </Routes>
      </main>
    </div>
  );
}
