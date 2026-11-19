/**
 * Google Analytics 4. The tag in index.html loads gtag with automatic page
 * views off, because the tabs are URL hashes (#resume, #side), which GA4 would
 * otherwise fold into one page. Each tab is reported as its own path instead.
 */
type Gtag = (...args: unknown[]) => void;

const PATHS: Record<string, { path: string; title: string }> = {
  map: { path: "/", title: "Career map" },
  resume: { path: "/resume", title: "Resume" },
  services: { path: "/services", title: "Services" },
  side: { path: "/side-projects", title: "Side projects" },
  story: { path: "/story-maker", title: "The Story Maker" },
};

export function trackView(view: string) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  const page = PATHS[view];
  if (!gtag || !page) return; // blocked by an ad blocker, or an unknown view
  gtag("event", "page_view", {
    page_path: page.path,
    page_title: `Tyler Grant Loomis · ${page.title}`,
    page_location: location.origin + page.path,
  });
}
