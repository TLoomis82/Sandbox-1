import { useCallback, useEffect, useMemo, useState } from "react";
import { jobs as rawJobs, profile } from "./data/experience";
import type { Job, PortfolioItem } from "./data/types";
import { jobStart } from "./lib/dates";
import { applyFilters, yearBounds, type Filters } from "./lib/filters";
import { isLocated, placeKey } from "./lib/places";
import { useGeocodedJobs } from "./lib/useGeocodedJobs";
import { MapView } from "./components/MapView";
import { TopBar, type View } from "./components/TopBar";
import { Intro } from "./components/Intro";
import { Timeline } from "./components/Timeline";
import { ExperiencePanel } from "./components/ExperiencePanel";
import { Lightbox } from "./components/Lightbox";
import { ResumeView } from "./components/ResumeView";
import { Welcome, shouldShowWelcome } from "./components/Welcome";

const bounds = yearBounds(rawJobs);
const TOUR_STEP_MS = 7000;
const allFilters = (): Filters => ({ companies: new Set(), years: bounds });

function useDarkMode() {
  const query = "(prefers-color-scheme: dark)";
  const [dark, setDark] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setDark(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return dark;
}

export default function App() {
  const dark = useDarkMode();
  const jobs = useGeocodedJobs(rawJobs);
  const [view, setView] = useState<View>(() => (location.hash === "#resume" ? "resume" : "map"));
  const [intro, setIntro] = useState(() => location.hash !== "#resume");
  const [filters, setFilters] = useState<Filters>(allFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ item: PortfolioItem; job: Job } | null>(null);
  const [tourStep, setTourStep] = useState<number | null>(null);
  // `welcome` drives the app--welcome class (holds the intro back);
  // `welcomeMounted` keeps the overlay alive through its exit animation.
  const [welcome, setWelcome] = useState(shouldShowWelcome);
  const [welcomeMounted, setWelcomeMounted] = useState(welcome);
  const exitWelcome = useCallback(() => setWelcome(false), []);
  const endWelcome = useCallback(() => setWelcomeMounted(false), []);

  const visible = useMemo(() => applyFilters(jobs, filters), [jobs, filters]);
  const visibleIds = useMemo(() => new Set(visible.map((j) => j.id)), [visible]);
  const chronological = useMemo(() => [...jobs].sort((a, b) => jobStart(a) - jobStart(b)), [jobs]);
  const selected = jobs.find((j) => j.id === selectedId) ?? null;

  const siblings = useMemo(() => {
    if (!selected || !isLocated(selected)) return [];
    const key = placeKey(selected);
    return jobs.filter((j) => j.id !== selected.id && isLocated(j) && placeKey(j) === key);
  }, [jobs, selected]);

  // Close the panel if the selected company gets filtered out.
  useEffect(() => {
    if (selectedId && !visibleIds.has(selectedId)) setSelectedId(null);
  }, [visibleIds, selectedId]);

  useEffect(() => {
    history.replaceState(null, "", view === "resume" ? "#resume" : location.pathname);
  }, [view]);

  // Guided tour: oldest role to newest, one stop every few seconds.
  useEffect(() => {
    if (tourStep === null) return;
    const job = chronological[tourStep];
    if (!job) {
      setTourStep(null);
      setSelectedId(null);
      return;
    }
    setSelectedId(job.id);
    const t = setTimeout(() => setTourStep((s) => (s === null ? null : s + 1)), TOUR_STEP_MS);
    return () => clearTimeout(t);
  }, [tourStep, chronological]);

  const startTour = () => {
    setFilters(allFilters());
    setView("map");
    setIntro(false);
    setTourStep(0);
  };
  const select = useCallback((id: string | null) => {
    setTourStep(null);
    setSelectedId(id);
  }, []);
  const closePanel = useCallback(() => select(null), [select]);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const changeView = (v: View) => {
    setTourStep(null);
    setIntro(false);
    setView(v);
  };

  return (
    <div
      className={`app ${intro ? "app--intro" : ""} ${welcome ? "app--welcome" : ""} ${selected && view === "map" ? "app--panel" : ""}`}
    >
      {welcomeMounted && <Welcome profile={profile} onExit={exitWelcome} onDone={endWelcome} />}

      <MapView
        jobs={jobs}
        visibleIds={visibleIds}
        selectedId={selectedId}
        onSelect={select}
        dark={dark}
        intro={intro}
      />

      <Intro
        profile={profile}
        visible={intro}
        onTour={startTour}
        onExplore={() => setIntro(false)}
        onResume={() => changeView("resume")}
      />

      <TopBar profile={profile} view={view} onViewChange={changeView} />

      {view === "map" && (
        <>
          <Timeline
            jobs={chronological}
            visibleIds={visibleIds}
            selectedId={selectedId}
            onSelect={select}
            filters={filters}
            bounds={bounds}
            onFiltersChange={setFilters}
            tourStep={tourStep}
            onTourToggle={() => (tourStep === null ? startTour() : select(null))}
          />
          <ExperiencePanel
            job={selected}
            siblings={siblings}
            email={profile.email}
            onSelect={select}
            onClose={closePanel}
            onOpenItem={(item, job) => {
              setTourStep(null);
              setLightbox({ item, job });
            }}
          />
        </>
      )}

      {view === "resume" && (
        <ResumeView
          profile={profile}
          jobs={jobs}
          onShowOnMap={(id) => {
            setFilters(allFilters());
            setView("map");
            setSelectedId(id);
          }}
        />
      )}

      <Lightbox item={lightbox?.item ?? null} job={lightbox?.job ?? null} email={profile.email} onClose={closeLightbox} />
    </div>
  );
}
