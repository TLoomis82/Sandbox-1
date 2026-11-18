import { useCallback, useEffect, useMemo, useState } from "react";
import { jobs as rawJobs, profile } from "./data/experience";
import type { Job, PortfolioItem } from "./data/types";
import { jobStart } from "./lib/dates";
import { tourStopMs } from "./lib/readingTime";
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
import { ServicesView } from "./components/ServicesView";
import { SideProjectsView } from "./components/SideProjectsView";
import { StoryMaker } from "./components/StoryMaker";

/** Views reachable by URL hash, so recruiters and clients can be sent straight there. */
const HASH_VIEWS: Record<string, View> = { "#resume": "resume", "#services": "services", "#side": "side", "#story": "side" };

const bounds = yearBounds(rawJobs);
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
  const [view, setView] = useState<View>(() => HASH_VIEWS[location.hash] ?? "map");
  const [intro, setIntro] = useState(() => !HASH_VIEWS[location.hash]);
  const [filters, setFilters] = useState<Filters>(allFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ item: PortfolioItem; job: Job } | null>(null);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [tourPaused, setTourPaused] = useState(false);
  // `welcome` drives the app--welcome class (holds the intro back);
  // `welcomeMounted` keeps the overlay alive through its exit animation.
  const [welcome, setWelcome] = useState(shouldShowWelcome);
  const [welcomeMounted, setWelcomeMounted] = useState(welcome);
  // Mobile home screen: the text has scrolled away and the globe is in full view.
  const [globeView, setGlobeView] = useState(false);
  const exitWelcome = useCallback(() => setWelcome(false), []);
  const endWelcome = useCallback(() => setWelcomeMounted(false), []);
  // The Story Maker plays full screen over the Side Projects page; #story links straight to it.
  const [story, setStory] = useState(() => location.hash === "#story");
  const openStory = useCallback(() => setStory(true), []);
  const closeStory = useCallback(() => {
    setStory(false);
    setView("side");
    setIntro(false);
  }, []);

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
    history.replaceState(null, "", view === "map" ? location.pathname : `#${view}`);
  }, [view]);

  // Guided tour: oldest role to newest. The timeline's progress bar times each
  // stop and calls nextStop when it fills, so pausing freezes the countdown.
  useEffect(() => {
    if (tourStep === null) return;
    const job = chronological[tourStep];
    if (!job) {
      setTourStep(null);
      setTourPaused(false);
      setSelectedId(null);
      return;
    }
    setSelectedId(job.id);
  }, [tourStep, chronological]);

  const startTour = () => {
    setFilters(allFilters());
    setView("map");
    setIntro(false);
    setTourPaused(false);
    setTourStep(0);
  };
  const stopTour = useCallback(() => {
    setTourStep(null);
    setTourPaused(false);
  }, []);
  const nextStop = useCallback(() => setTourStep((s) => (s === null ? null : s + 1)), []);
  const prevStop = useCallback(() => setTourStep((s) => (s === null ? null : Math.max(0, s - 1))), []);
  const toggleTourPause = useCallback(() => setTourPaused((p) => !p), []);

  // Clicking anything interactive during the tour (a role, a portfolio card, a
  // link, a pin) means the visitor wants to look closer: pause until they press play.
  useEffect(() => {
    if (tourStep === null) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".timeline")) return; // the tour's own controls and bars
      if (target.closest("a, button, [role='tab'], input, .marker")) setTourPaused(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [tourStep]);

  // Keyboard: ← / → move between stops, space pauses, Esc ends the tour.
  useEffect(() => {
    if (tourStep === null) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (lightbox || target.closest("input, textarea, select")) return;
      if (e.key === "ArrowRight") nextStop();
      else if (e.key === "ArrowLeft") prevStop();
      // A focused button already handles space itself; don't toggle twice.
      else if (e.key === " " && !target.closest("button")) toggleTourPause();
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tourStep, lightbox, nextStop, prevStop, toggleTourPause]);

  // Picking something by hand ends the tour.
  const select = useCallback(
    (id: string | null) => {
      stopTour();
      setSelectedId(id);
    },
    [stopTour],
  );
  // During the tour, picking a company (pin, "same building" link) jumps the
  // tour there and pauses it; clicking empty map pauses rather than ending it.
  const selectDuringTour = (id: string | null) => {
    if (tourStep === null) return select(id);
    setTourPaused(true);
    if (id) setTourStep(chronological.findIndex((j) => j.id === id));
  };
  const closePanel = useCallback(() => select(null), [select]);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const changeView = (v: View) => {
    stopTour();
    setIntro(false);
    setView(v);
  };
  // The name in the top bar always leads back to the opening screen.
  const goHome = () => {
    select(null);
    setLightbox(null);
    setFilters(allFilters());
    setView("map");
    setIntro(true);
  };

  return (
    <div
      className={`app ${intro ? "app--intro" : ""} ${intro && globeView ? "app--globe" : ""} ${welcome ? "app--welcome" : ""} ${selected && view === "map" ? "app--panel" : ""}`}
    >
      {welcomeMounted && <Welcome profile={profile} onExit={exitWelcome} onDone={endWelcome} />}

      <MapView
        jobs={jobs}
        visibleIds={visibleIds}
        selectedId={selectedId}
        onSelect={selectDuringTour}
        dark={dark}
        intro={intro}
      />

      <Intro
        profile={profile}
        visible={intro}
        onTour={startTour}
        onExplore={() => setIntro(false)}
        onResume={() => changeView("resume")}
        onServices={() => changeView("services")}
        onGlobeView={setGlobeView}
      />

      <TopBar profile={profile} view={view} onViewChange={changeView} onHome={goHome} />

      {view === "map" && (
        <>
          <Timeline
            jobs={chronological}
            visibleIds={visibleIds}
            selectedId={selectedId}
            // During the tour, clicking a bar jumps the tour there instead of ending it.
            onSelect={(id) =>
              tourStep === null ? select(id) : setTourStep(chronological.findIndex((j) => j.id === id))
            }
            filters={filters}
            bounds={bounds}
            onFiltersChange={setFilters}
            tour={{
              step: tourStep,
              paused: tourPaused,
              // Longer on companies with more to read and more work to look at.
              stepMs: tourStep !== null && chronological[tourStep] ? tourStopMs(chronological[tourStep]) : 8000,
              onStart: startTour,
              onPrev: prevStop,
              onNext: nextStop,
              onTogglePause: toggleTourPause,
              onStop: () => select(null),
            }}
          />
          <ExperiencePanel
            job={selected}
            siblings={siblings}
            email={profile.email}
            onSelect={selectDuringTour}
            onClose={closePanel}
            onOpenItem={(item, job) => {
              // Opening work pauses the tour rather than ending it.
              if (tourStep !== null) setTourPaused(true);
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

      {view === "services" && (
        <ServicesView
          profile={profile}
          onSeeWork={() => {
            setView("map");
            setIntro(false);
          }}
        />
      )}

      {view === "side" && <SideProjectsView onOpenStory={openStory} />}
      {story && <StoryMaker email={profile.email} onClose={closeStory} />}

      <Lightbox item={lightbox?.item ?? null} job={lightbox?.job ?? null} email={profile.email} onClose={closeLightbox} />
    </div>
  );
}
