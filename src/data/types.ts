export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  /** Path under /public (e.g. "/portfolio/neolife-club-app.jpg") or a full URL. Missing files fall back to a styled card. */
  image?: string;
  /** Optional link to a live project, case study, or Figma file. */
  link?: string;
  tags?: string[];
  /** Work under NDA: shown as a locked case study with a "walkthrough on request" note. */
  confidential?: boolean;
};

export type Metric = { value: string; label: string };

export type Position = {
  id: string;
  title: string;
  /** "YYYY-MM" */
  start: string;
  /** "YYYY-MM", or null for a current role. */
  end: string | null;
  summary?: string;
  metrics?: Metric[];
  highlights: string[];
  skills?: string[];
  portfolio: PortfolioItem[];
};

export type Job = {
  id: string;
  company: string;
  /** Short label used inside the map pin when there is no logo. */
  monogram: string;
  /** Brand accent used for the pin, timeline bar, and panel. */
  color: string;
  /** Path under /public or a full URL. Optional. */
  logo?: string;
  url?: string;
  location: {
    building: string;
    city: string;
    /** Street address. Geocoded with Mapbox at runtime when lng/lat are omitted. */
    address?: string;
    /** Omit lng/lat (and address) to keep the job off the map; it still shows on the timeline and resume. */
    lng?: number;
    lat?: number;
  };
  /** Most recent position first. */
  positions: Position[];
};

export type Profile = {
  name: string;
  eyebrow: string;
  headline: string;
  tagline: string;
  location: string;
  email: string;
  linkedin?: string;
  summary: string;
  stats: Metric[];
  skills: { group: string; items: string[] }[];
  education: { school: string; degree: string; years: string }[];
};
