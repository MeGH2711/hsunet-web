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
import PresentationView from "./components/presentation/PresentationView";
import { Loader2, AlertCircle } from "lucide-react";

export default function App() {
  const [hsunetData, setHsunetData] = useState(null);
  const [ensembleData, setEnsembleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSubject, setSelectedSubject] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Active model based on current route
  const activeModel = useMemo(() => {
    return location.pathname.toLowerCase().startsWith("/ensemble")
      ? "ensemble"
      : "hsunet";
  }, [location.pathname]);

  // Current active dataset
  const data = activeModel === "ensemble" ? ensembleData : hsunetData;

  // Derive current view from pathname
  const currentView = useMemo(() => {
    const p = location.pathname.toLowerCase();
    if (p.includes("/presentation") || p.includes("/slides")) return "presentation";
    if (p.includes("/overview")) return "overview";
    if (p.includes("/curves") || p.includes("/training")) return "curves";
    if (p.includes("/metrics") || p.includes("/table")) return "metrics";
    return "visuals";
  }, [location.pathname]);

  // Navigate to corresponding route for active model
  const handleViewChange = (view) => {
    if (view === "presentation" || view === "slides") {
      navigate(`/${activeModel}/presentation`);
    } else if (view === "overview") {
      navigate(`/${activeModel}/overview`);
    } else if (view === "curves" || view === "training") {
      if (activeModel === "ensemble") {
        navigate(`/ensemble/overview`);
      } else {
        navigate(`/hsunet/curves`);
      }
    } else if (view === "metrics" || view === "table") {
      navigate(`/${activeModel}/metrics`);
    } else {
      const caseId =
        selectedSubject?.case_id ||
        searchParams.get("case") ||
        "ISLES_1170";
      navigate(`/${activeModel}/visuals?case=${caseId}`);
    }
  };

  // Switch between models (HS-UNet vs Ensemble)
  const handleModelChange = (newModel) => {
    if (newModel === activeModel) return;
    let targetView = currentView;
    if (newModel === "ensemble" && targetView === "curves") {
      targetView = "overview";
    }
    const currentCaseId =
      selectedSubject?.case_id ||
      searchParams.get("case") ||
      "ISLES_1170";
    if (targetView === "visuals") {
      navigate(`/${newModel}/visuals?case=${currentCaseId}`);
    } else {
      navigate(`/${newModel}/${targetView}`);
    }
  };

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSite, setSelectedSite] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedSplit, setSelectedSplit] = useState("all");
  const [onlyWithVisuals, setOnlyWithVisuals] = useState(false); // Default to false so all 1,453 subjects can be browsed
  const [sortBy, setSortBy] = useState("dice-desc");

  // Load both HS-UNet and Ensemble datasets in parallel for instantaneous switching
  useEffect(() => {
    Promise.all([
      fetch("/data/dashboard_data.json").then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      }),
      fetch("/data/dashboard_data_ensemble.json").then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      }),
    ])
      .then(([hsuJson, ensJson]) => {
        setHsunetData(hsuJson);
        setEnsembleData(ensJson);

        const currentDataset = window.location.pathname
          .toLowerCase()
          .startsWith("/ensemble")
          ? ensJson
          : hsuJson;

        // Check if a specific case is requested via query (?case=...) or URL path
        const urlParams = new URLSearchParams(window.location.search);
        const queryCase = urlParams.get("case");
        const pathMatch = window.location.pathname.match(
          /^\/(?:hsunet|ensemble)\/visuals\/([^/]+)/i
        );
        const pathCase = pathMatch ? pathMatch[1] : null;
        const targetId = queryCase || pathCase;

        let initial = null;
        if (targetId) {
          initial = currentDataset.cases.find(
            (c) =>
              c.case_id.toLowerCase() === targetId.toLowerCase() ||
              c.subject.toLowerCase() === targetId.toLowerCase()
          );
        }
        if (!initial) {
          initial =
            currentDataset.cases.find((c) => c.case_id === "ISLES_1170") ||
            currentDataset.cases[0];
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

  // Sync selected subject when active model changes
  useEffect(() => {
    if (!data?.cases || !selectedSubject) return;
    const match = data.cases.find(
      (c) => c.case_id.toLowerCase() === selectedSubject.case_id.toLowerCase()
    );
    if (match && match !== selectedSubject) {
      setSelectedSubject(match);
    }
  }, [activeModel, data]);

  // Synchronize selected subject when URL path or search param (?case=...) changes
  useEffect(() => {
    if (!data?.cases || data.cases.length === 0) return;

    const queryCase = searchParams.get("case");
    const pathMatch = location.pathname.match(
      /^\/(?:hsunet|ensemble)\/visuals\/([^/]+)/i
    );
    const pathCase = pathMatch ? pathMatch[1] : null;
    const targetId = queryCase || pathCase;

    if (targetId) {
      const match = data.cases.find(
        (c) =>
          c.case_id.toLowerCase() === targetId.toLowerCase() ||
          c.subject.toLowerCase() === targetId.toLowerCase()
      );
      if (match) {
        if (!selectedSubject || selectedSubject.case_id !== match.case_id || selectedSubject !== match) {
          setSelectedSubject(match);
        }
      }
      // If accessed via /visuals/:caseId path, normalize to ?case=...
      if (pathCase && (!queryCase || queryCase.toLowerCase() !== pathCase.toLowerCase())) {
        navigate(`/${activeModel}/visuals?case=${match ? match.case_id : pathCase}`, {
          replace: true,
        });
      }
    } else if (currentView === "visuals") {
      // Missing ?case in visuals view: ensure the URL reflects the active subject
      const defaultCase =
        selectedSubject ||
        data.cases.find((c) => c.case_id === "ISLES_1170") ||
        data.cases[0];
      if (defaultCase) {
        if (!selectedSubject || selectedSubject.case_id !== defaultCase.case_id) {
          setSelectedSubject(defaultCase);
        }
        navigate(`/${activeModel}/visuals?case=${defaultCase.case_id}`, {
          replace: true,
        });
      }
    }
  }, [location.pathname, searchParams, data, activeModel, currentView]);

  // Handler for subject selection from components
  const handleSelectSubject = (subject, forceVisuals = true) => {
    if (!subject) return;
    setSelectedSubject(subject);
    if (forceVisuals || currentView === "visuals") {
      navigate(`/${activeModel}/visuals?case=${subject.case_id}`);
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
            Loading {activeModel === "ensemble" ? "ISLES Ensemble Studio" : "HS-UNet Studio"}...
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
      {/* Sidebar Navigation & Live Filters - Hidden in Presentation View */}
      {currentView !== "presentation" && currentView !== "slides" && (
        <Sidebar
          data={data}
          model={activeModel}
          onModelChange={handleModelChange}
          currentView={currentView}
          setCurrentView={handleViewChange}
          selectedSubject={selectedSubject}
          setSelectedSubject={(c) => handleSelectSubject(c, true)}
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
      )}

      {/* Main Routed View Area */}
      <main className="flex-1 h-full min-h-0 overflow-hidden bg-black flex flex-col">
        <Routes>
          {/* ==================== HS-UNET ROUTES ==================== */}
          <Route
            path="/hsunet/visuals"
            element={
              <SubjectInspector
                subject={selectedSubject}
                onSelectSubject={handleSelectSubject}
                model="hsunet"
              />
            }
          />
          <Route
            path="/hsunet/visuals/:caseId"
            element={
              <SubjectInspector
                subject={selectedSubject}
                onSelectSubject={handleSelectSubject}
                model="hsunet"
              />
            }
          />
          <Route
            path="/hsunet/overview"
            element={
              <OverviewView
                data={hsunetData}
                model="hsunet"
                onSelectSubject={(c) => handleSelectSubject(c, true)}
                onGoToInspector={(c) => { if (c) handleSelectSubject(c, true); }}
                onGoToTraining={() => navigate("/hsunet/curves")}
              />
            }
          />
          <Route
            path="/hsunet/curves"
            element={<TrainingView trainingData={hsunetData?.training} />}
          />
          <Route
            path="/hsunet/metrics"
            element={
              <CaseTableView
                cases={hsunetData?.cases || []}
                onSelectSubject={(c) => handleSelectSubject(c, true)}
                onGoToInspector={(c) => { if (c) handleSelectSubject(c, true); }}
              />
            }
          />
          <Route
            path="/hsunet/presentation"
            element={
              <PresentationView
                model="hsunet"
                onExit={() => {
                  const caseId = selectedSubject?.case_id || "ISLES_1170";
                  navigate(`/hsunet/visuals?case=${caseId}`);
                }}
              />
            }
          />

          {/* ==================== ENSEMBLE ROUTES (NO CURVES) ==================== */}
          <Route
            path="/ensemble/visuals"
            element={
              <SubjectInspector
                subject={selectedSubject}
                onSelectSubject={handleSelectSubject}
                model="ensemble"
              />
            }
          />
          <Route
            path="/ensemble/visuals/:caseId"
            element={
              <SubjectInspector
                subject={selectedSubject}
                onSelectSubject={handleSelectSubject}
                model="ensemble"
              />
            }
          />
          <Route
            path="/ensemble/overview"
            element={
              <OverviewView
                data={ensembleData}
                model="ensemble"
                onSelectSubject={(c) => handleSelectSubject(c, true)}
                onGoToInspector={(c) => { if (c) handleSelectSubject(c, true); }}
                onGoToTraining={null}
              />
            }
          />
          <Route
            path="/ensemble/metrics"
            element={
              <CaseTableView
                cases={ensembleData?.cases || []}
                onSelectSubject={(c) => handleSelectSubject(c, true)}
                onGoToInspector={(c) => { if (c) handleSelectSubject(c, true); }}
              />
            }
          />
          <Route
            path="/ensemble/presentation"
            element={
              <PresentationView
                model="ensemble"
                onExit={() => {
                  const caseId = selectedSubject?.case_id || "ISLES_1170";
                  navigate(`/ensemble/visuals?case=${caseId}`);
                }}
              />
            }
          />
          <Route
            path="/ensemble/curves"
            element={<Navigate to="/ensemble/overview" replace />}
          />
          <Route
            path="/ensemble"
            element={<Navigate to={`/ensemble/visuals?case=${selectedSubject?.case_id || "ISLES_1170"}`} replace />}
          />

          {/* ==================== PRESENTATION DIRECT ROUTES ==================== */}
          <Route
            path="/presentation"
            element={
              <PresentationView
                model={activeModel}
                onExit={() => {
                  const caseId = selectedSubject?.case_id || "ISLES_1170";
                  navigate(`/${activeModel}/visuals?case=${caseId}`);
                }}
              />
            }
          />
          <Route
            path="/slides"
            element={<Navigate to={`/${activeModel}/presentation`} replace />}
          />

          {/* ==================== LEGACY & ROOT REDIRECTS ==================== */}
          <Route path="/" element={<Navigate to={`/hsunet/visuals?case=${selectedSubject?.case_id || "ISLES_1170"}`} replace />} />
          <Route
            path="/hsunet"
            element={<Navigate to={`/hsunet/visuals?case=${selectedSubject?.case_id || "ISLES_1170"}`} replace />}
          />
          <Route
            path="/visuals"
            element={<Navigate to={`/hsunet/visuals?case=${selectedSubject?.case_id || "ISLES_1170"}`} replace />}
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
            element={<Navigate to={`/hsunet/visuals?case=${selectedSubject?.case_id || "ISLES_1170"}`} replace />}
          />
          <Route
            path="/training"
            element={<Navigate to="/hsunet/curves" replace />}
          />
          <Route
            path="/table"
            element={<Navigate to="/hsunet/metrics" replace />}
          />
          <Route path="*" element={<Navigate to={`/hsunet/visuals?case=${selectedSubject?.case_id || "ISLES_1170"}`} replace />} />
        </Routes>
      </main>
    </div>
  );
}
