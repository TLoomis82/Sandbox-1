export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  /** Path under /public (e.g. "/portfolio/neolife-club-app.jpg") or a full URL. Missing files fall back to a styled card. */
  image?: string;
  /** Every image in the piece, in order. `image` is the cover and the one the full-size view opens on. */
  gallery?: string[];
  /** Short label per gallery image, same order as `gallery`. */
  captions?: string[];
  /** Problem → approach → solution → outcome, shown beside the images. */
  caseStudy?: {
    problem: string;
    approach: string[];
    solution: string[];
    outcome?: string;
  };
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
  /**
   * Set when this role was a promotion from the previous one at the same company.
   * `true` shows "Promoted"; a string also gives the reason.
   */
  promotion?: true | string;
  /** Title promoted from, when that earlier role isn't listed as its own position. */
  promotedFrom?: string;
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
    /** Floor to highlight on the 3D building when this job is selected (1 = ground). */
    floor?: number;
    /** Worked remotely; the pin marks the company's office. */
    remote?: boolean;
    /** Omit lng/lat (and address) to keep the job off the map; it still shows on the timeline and resume. */
    lng?: number;
    lat?: number;
  };
  /** Most recent position first. */
  positions: Position[];
  /** Press coverage of the company or its products, shown as "In the news". */
  press?: { title: string; outlet: string; date: string; url: string }[];
};

export type Profile = {
  name: string;
  eyebrow: string;
  headline: string;
  tagline: string;
  location: string;
  email: string;
  linkedin?: string;
  /** Shown as plain text so it stays readable in the printed PDF. */
  website?: string;
  summary: string;
  stats: Metric[];
  /** Front-page "What sets me apart": strongest data accomplishments, rotated one at a time. */
  dataWins: { title: string; detail: string }[];
  skills: { group: string; items: string[] }[];
  education: { school: string; degree: string; years: string }[];
};
