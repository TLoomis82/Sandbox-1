/**
 * Google Analytics 4. The tag in index.html loads gtag with automatic page
 * views off, because the tabs are URL hashes (#resume, #side), which GA4 would
 * otherwise fold into one page. Each tab is reported as its own path instead.
 *
 * Events (each parameter needs a matching custom dimension in GA4 to show in reports):
 *   select_company  company_name, source       a company picked on the map, timeline, or resume
 *   open_work       company_name, work_title   a work sample opened
 *   button_click    button_name, tab           any element with a data-track attribute
 *   story_progress  scene_number, scene_name   furthest scene reached in The Story Maker
 */
type Gtag = (...args: unknown[]) => void;

const PATHS: Record<string, { path: string; title: string }> = {
  map: { path: "/", title: "Career map" },
  resume: { path: "/resume", title: "Resume" },
  services: { path: "/services", title: "Services" },
  side: { path: "/side-projects", title: "Side projects" },
  story: { path: "/story-maker", title: "The Story Maker" },
};

let currentPage = "map";

/** Sends an event; a no-op when gtag is blocked (ad blockers) or missing (local tests). */
export function track(name: string, params: Record<string, string | number> = {}) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", name, params);
}

export function trackView(view: string) {
  const page = PATHS[view];
  if (!page) return;
  currentPage = view;
  track("page_view", {
    page_path: page.path,
    page_title: `Tyler Grant Loomis · ${page.title}`,
    page_location: location.origin + page.path,
  });
}

// One listener for every tracked button: tag an element with data-track="Name" and it reports itself.
document.addEventListener(
  "click",
  (e) => {
    const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track]");
    if (el) track("button_click", { button_name: el.dataset.track!, tab: currentPage });
  },
  { capture: true },
);
