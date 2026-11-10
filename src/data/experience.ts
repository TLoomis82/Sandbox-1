// ─────────────────────────────────────────────────────────────────────────────
// Everything the site shows comes from this file: map pins, career path,
// timeline, experience panels, portfolio, and the resume page.
//
// Sources: VisualCV resume (titles, dates, metrics, portfolio) and LinkedIn
// export. The Senior Data Product Manager role is written without client names,
// figures, or internal product names; its work samples are marked confidential.
//
// Locations: give a street `address` (geocoded at runtime) or exact lng/lat.
// Jobs with neither stay off the map but still appear on the timeline/resume.
//
// Portfolio images: save them in /public/portfolio/ with the file names used
// below. Until a file exists, its card renders as a styled placeholder.
// ─────────────────────────────────────────────────────────────────────────────
import type { Job, Profile } from "./types";

export const profile: Profile = {
  name: "Tyler Grant Loomis",
  eyebrow: "Product · Data · Design",
  headline: "Senior Data Product Manager",
  tagline:
    "I turn fragmented enterprise data into decisions people can act on, and I design the experience that gets them there.",
  location: "Prosper, TX",
  email: "tybo82@gmail.com",
  linkedin: "https://www.linkedin.com/in/tyler-grant-loomis-msim-6648581b/",
  summary:
    "Product leader with 20 years across engineering, UX, and data, from the Apple Online Store in Cupertino to enterprise data platforms today. I started as an engineer, grew into UX and product leadership, and now run data products that bring operational, IoT, and third-party data together for executive decisions. I prototype in code, often with AI tools, so ideas get tested with real users and real data before they are built at scale.",
  stats: [
    { value: "20", label: "years building products" },
    { value: "300%", label: "usage lift from a UX redesign" },
    { value: "200%", label: "mobile growth from a mobile-first strategy" },
    { value: "90%", label: "adoption of a redesigned back office" },
  ],
  skills: [
    {
      group: "Data & AI",
      items: ["Databricks lakehouse", "Medallion data modeling", "SQL", "Predictive analytics", "Claude", "ChatGPT", "Gemini"],
    },
    {
      group: "Product",
      items: ["Product strategy", "Roadmaps", "Executive storytelling", "Agile and Scrum", "Aha!", "Jira"],
    },
    {
      group: "UX & Research",
      items: ["User interviews", "Maze testing", "Lean UX", "Personas and journey maps", "Figma", "Sketch", "Balsamiq"],
    },
    {
      group: "Analytics",
      items: ["Google Analytics 4", "Tag Manager", "Pendo", "Mixpanel", "Amplitude", "Datadog", "Server-side tracking"],
    },
  ],
  education: [
    {
      school: "Arizona State University, W. P. Carey School of Business",
      degree: "M.S., Information Management",
      years: "2010 – 2011",
    },
    {
      school: "University of Arizona, Eller College of Management",
      degree: "B.S., Business Administration, Management Information Systems",
      years: "2004 – 2006",
    },
  ],
};

export const jobs: Job[] = [
  {
    id: "smartrent",
    company: "SmartRent",
    monogram: "SR",
    color: "#0A84FF",
    url: "https://smartrent.com",
    location: {
      // Remote role, pinned at company HQ.
      building: "SmartRent HQ",
      city: "Scottsdale, AZ",
      address: "18835 N Thompson Peak Pkwy, Scottsdale, AZ 85255",
    },
    positions: [
      {
        id: "smartrent-dpm",
        title: "Senior Data Product Manager",
        start: "2026-04",
        end: null,
        summary:
          "Own data products that unify operational, IoT, and third-party data into one trusted view for enterprise property owners and their executives.",
        highlights: [
          "Lead an executive portfolio intelligence product that rolls up health, risk, and opportunity, with drill-down from portfolio to building to unit to the next action.",
          "Defined the move from fragmented product and warehouse data to a governed lakehouse with bronze, silver, and gold layers, so every metric has one source of truth.",
          "Solved cross-product property identity where no shared key existed, so one property reads as one property across product lines.",
          "Brought third-party market and parcel data in next to first-party data to show footprint, whitespace, and peer benchmarks.",
          "Mapped leading operational signals to the financial outcomes owners report, tying product metrics to NOI.",
          "Built natural-language analytics experiences that let executives ask questions of governed data in plain English.",
          "Prototype in code with AI tools, so executives and customers react to working software instead of slides.",
        ],
        skills: ["Databricks", "SQL", "Data modeling", "Mapbox", "React", "Claude"],
        portfolio: [
          {
            id: "sr-portfolio-intel",
            title: "Portfolio Intelligence Platform",
            description:
              "Executive view of portfolio health with drill-down to the building, the unit, and the next action.",
            tags: ["Data product", "Executive UX", "Mapbox"],
            confidential: true,
          },
          {
            id: "sr-digital-twin",
            title: "3D Property Digital Twin",
            description: "Interactive 3D map of a property with live device telemetry layered onto real buildings.",
            tags: ["3D", "IoT", "Prototype"],
            confidential: true,
          },
          {
            id: "sr-lakehouse",
            title: "Lakehouse Data Model",
            description:
              "Medallion data model that turns raw product and device data into governed, executive-ready metrics.",
            tags: ["Databricks", "Data modeling"],
            confidential: true,
          },
          {
            id: "sr-nl-analytics",
            title: "Natural-Language Analytics",
            description: "Plain-English questions answered from governed data, built for executive workshops.",
            tags: ["AI", "Analytics"],
            confidential: true,
          },
          {
            id: "sr-immersive",
            title: "Immersive Briefing Experience",
            description: "Data storytelling built for a 180° wall display in an executive briefing center.",
            tags: ["Immersive", "Storytelling"],
            confidential: true,
          },
        ],
      },
      {
        id: "smartrent-ux",
        title: "Lead UX Product Designer",
        start: "2022-10",
        end: "2026-04",
        summary: "Led UX across web, mobile, and native apps for the core product line.",
        metrics: [{ value: "20%", label: "fewer development inefficiencies from event-driven analytics" }],
        highlights: [
          "Optimized interfaces and experiences across web, mobile, and native apps for core products.",
          "Pitched UX proposals to executive teams with wireframes, high-fidelity designs, and prototypes.",
          "Built a data-driven discovery practice that gave designers better inputs at the start of every project.",
          "Validated design ideas against business models with Google Analytics 4 and Maze testing with clients.",
          "Contributed design system components that the client base adopted.",
          "Implemented client-side event analytics, cutting development inefficiencies by 20%.",
          "Won a company-wide design workshop challenge; the solution is now being built.",
        ],
        skills: ["Figma", "Design systems", "GA4", "Maze"],
        portfolio: [
          {
            id: "sr-dashboard",
            title: "Operations Dashboard",
            description: "Dashboard design for the core property operations platform.",
            image: "/portfolio/smartrent-dashboard.jpg",
            tags: ["Dashboard", "Design system"],
          },
        ],
      },
    ],
  },
  {
    id: "elm-street",
    company: "Elm Street Technology",
    monogram: "ES",
    color: "#30D158",
    location: {
      building: "Elm Street Technology",
      city: "Frisco, TX",
      address: "10601 Clarence Dr, Frisco, TX 75034",
    },
    positions: [
      {
        id: "elm-street-ux",
        title: "UX Lead",
        start: "2019-05",
        end: "2022-09",
        summary: "Led UX for web and mobile product delivery platforms used by real estate professionals.",
        metrics: [
          { value: "300%", label: "increase in usage from a new UX" },
          { value: "200%", label: "growth in mobile usage" },
        ],
        highlights: [
          "Designed a new UX that increased usage by over 300%.",
          "Created a mobile-first strategy that grew mobile usage by 200%.",
          "Championed client-side and server-side event analytics and built the first customer 360 strategy to spot churn and upsell early.",
          "Interviewed targeted user groups to test UX hypotheses, and used UserIQ and Google Analytics 4 to find improvements.",
          "Wrote functional specs and task lists for developers and presented proposals to executives.",
        ],
        skills: ["Figma", "UserIQ", "GA4", "Customer 360"],
        portfolio: [
          {
            id: "elm-crm",
            title: "CRM Redesign",
            description: "Before and after redesign of the agent CRM dashboard.",
            image: "/portfolio/elm-crm-redesign.jpg",
            tags: ["CRM", "Redesign"],
          },
        ],
      },
    ],
  },
  {
    id: "epicpay",
    company: "EpicPay",
    monogram: "EP",
    color: "#FF9F0A",
    location: {
      building: "EpicPay",
      city: "Frisco, TX",
      lng: -96.8236,
      lat: 33.1507,
    },
    positions: [
      {
        id: "epicpay-pm",
        title: "Project Manager",
        start: "2019-02",
        end: "2019-05",
        summary: "Managed web redesign, mobile planning, software development, marketing collateral, and UI/UX.",
        highlights: [
          "Directed designers and developers building B2C and B2B platforms with a strong UI/UX focus.",
          "Ran Agile delivery with Scrum and Kanban to improve cross-team communication and release quality.",
        ],
        portfolio: [],
      },
    ],
  },
  {
    id: "commissions-io",
    company: "Commissions.io",
    monogram: "C",
    color: "#BF5AF2",
    location: {
      // TODO: add a city or address to put this on the map.
      building: "Stealth startup",
      city: "",
    },
    positions: [
      {
        id: "commissions-head",
        title: "Head of Product Management",
        start: "2017-10",
        end: "2019-01",
        summary: "Stealth startup rethinking how the direct sales industry runs.",
        highlights: [
          "Owned end-to-end web and mobile products, from first sketch to launch.",
          "Directed design and engineering teams, including vendors around the world, building B2B and B2C apps.",
          "Built Agile roadmaps that tied product opportunities to financial value.",
        ],
        skills: ["Balsamiq", "Sketch", "Agile"],
        portfolio: [
          {
            id: "commissions-wireframes",
            title: "Wireframes",
            description: "Low-fidelity Balsamiq wireframes for the distributor experience.",
            image: "/portfolio/commissions-balsamiq.jpg",
            tags: ["Balsamiq", "Wireframes"],
          },
          {
            id: "commissions-sketch",
            title: "Sketch Mockups",
            description: "Mid-fidelity mockups exploring the mobile app structure.",
            image: "/portfolio/commissions-sketch.jpg",
            tags: ["Sketch", "Mobile"],
          },
          {
            id: "commissions-hifi",
            title: "High-Fidelity Designs",
            description: "Final visual design for bonus tracking and distributor progress.",
            image: "/portfolio/commissions-hifi.jpg",
            tags: ["Visual design", "Mobile"],
          },
        ],
      },
    ],
  },
  {
    id: "razor-solutions",
    company: "Razor Solutions",
    monogram: "RS",
    color: "#64D2FF",
    location: {
      building: "2470 First St",
      city: "Livermore, CA",
      address: "2470 First St, Livermore, CA 94550",
    },
    positions: [
      {
        id: "razor-consultant",
        title: "Product Manager Consultant",
        start: "2017-09",
        end: "2017-10",
        highlights: [
          "Consulted the Shopkick app team on faster requirements, user stories, and wireframes in Aha! and Jira.",
        ],
        portfolio: [],
      },
    ],
  },
  {
    id: "razorthink",
    company: "Razorthink",
    monogram: "R",
    color: "#5E5CE6",
    location: {
      building: "2470 First St",
      city: "Livermore, CA",
      address: "2470 First St, Livermore, CA 94550",
    },
    positions: [
      {
        id: "razorthink-director",
        title: "Director of Product Management",
        start: "2016-12",
        end: "2017-08",
        summary: "AI platform that predicts customer behavior from big data.",
        highlights: [
          "Partnered with the C-suite to turn customer needs and emerging technology into product designs.",
          "Built Agile roadmaps for B2B applications and set product mix goals from KPI performance.",
          "Pitched new product concepts to the CEO with wireframes and mockups, framed as revenue streams.",
          "Interviewed clients to create personas and journey maps.",
          "Researched competitive behavior with Product Hunt and BetaList.",
        ],
        skills: ["AI products", "Aha!", "Jira"],
        portfolio: [],
      },
    ],
  },
  {
    id: "neolife",
    company: "NeoLife International",
    monogram: "N",
    color: "#FF6482",
    location: {
      building: "NeoLife International HQ",
      city: "Fremont, CA",
      address: "3500 Gateway Blvd, Fremont, CA 94538",
    },
    positions: [
      {
        id: "neolife-ux",
        title: "Director of UX",
        start: "2014-09",
        end: "2016-10",
        summary: "Led web and mobile UX for a global health and wellness brand.",
        metrics: [
          { value: "90%", label: "adoption of the redesigned back office" },
          { value: "2", label: "mobile apps launched on iOS and Android" },
        ],
        highlights: [
          "Owned two iOS and Android apps as the subject matter expert from inception through rollout.",
          "Redesigned the back office website, improving purchasing and fulfillment, with 90% adoption.",
          "Moved the platform from ASP to Node.js, speeding up delivery of new features.",
          "Presented roadmaps to executives and launched product demos at industry events.",
          "Promoted from International Technical Product Manager for Mobile Apps in under a year.",
        ],
        skills: ["iOS", "Android", "Mixpanel", "Node.js"],
        portfolio: [
          {
            id: "neolife-club-app",
            title: "NeoLife Club App",
            description: "Consumer mobile app for the NeoLife member community.",
            image: "/portfolio/neolife-club-app.jpg",
            tags: ["iOS", "Android"],
          },
          {
            id: "neolife-back-office",
            title: "Back Office Redesign",
            description: "Mobile back office for purchasing and fulfillment, adopted by 90% of users.",
            image: "/portfolio/neolife-back-office.jpg",
            tags: ["Redesign", "E-commerce"],
          },
          {
            id: "neolife-before-after",
            title: "Site Redesign",
            description: "Before and after redesign of the e-commerce site.",
            image: "/portfolio/neolife-before-after.jpg",
            tags: ["Web", "E-commerce"],
          },
        ],
      },
    ],
  },
  {
    id: "zeality",
    company: "Zeality",
    monogram: "Z",
    color: "#FF453A",
    location: {
      building: "Zeality Inc.",
      city: "Pleasanton, CA",
      lng: -121.8747,
      lat: 37.6624,
    },
    positions: [
      {
        id: "zeality-pm",
        title: "Product Manager",
        start: "2014-06",
        end: "2016-01",
        summary: "VR/360°, AR, and cognitive computing for fan engagement in media, entertainment, and sports.",
        highlights: [],
        portfolio: [],
      },
    ],
  },
  {
    id: "apple",
    company: "Apple",
    monogram: "A",
    color: "#8E8E93",
    url: "https://apple.com",
    location: {
      building: "1 Infinite Loop",
      city: "Cupertino, CA",
      lng: -122.03118,
      lat: 37.33182,
    },
    positions: [
      {
        id: "apple-tpm",
        title: "Technical Product Manager, Mobile Apps",
        start: "2013-04",
        end: "2014-06",
        summary:
          "Managed concurrent software projects spanning core platform, big data, and visualization on aggressive timelines.",
        highlights: [
          "Collected requirements, managed risk, and drove change with engineering and business development managers.",
          "Presented functional documentation to site managers.",
          "Owned customer support escalations through to resolution.",
        ],
        portfolio: [],
      },
      {
        id: "apple-uat",
        title: "Lead Mobile QA/UAT Coordinator, Apple Online Store",
        start: "2012-04",
        end: "2013-04",
        summary: "Ran user acceptance testing for mobile and web products on the Apple Online Store.",
        highlights: [
          "Coordinated UI testing across QA, staging, behind covers, launch, and post-launch.",
          "Analyzed PRDs, BRDs, FSDs, process diagrams, use cases, and comps.",
          "Built test plans, cases, and scripts for launches, enhancements, and expansions.",
          "Tracked defects and inconsistencies that shaped product needs and requirements.",
        ],
        portfolio: [],
      },
    ],
  },
  {
    id: "infosys-amex",
    company: "Infosys · American Express",
    monogram: "IA",
    color: "#00C7BE",
    location: {
      building: "American Express",
      city: "Phoenix, AZ",
      address: "18850 N 56th St, Phoenix, AZ 85054",
    },
    positions: [
      {
        id: "infosys-amex-lead",
        title: "Project Manager / Lead Business Systems Analyst / Test Manager",
        start: "2007-01",
        end: "2011-10",
        summary: "Built as-is, to-be, and end-to-end workflows to define requirements for prototypes and enhancements.",
        highlights: [
          "Carried business needs through design, development, testing, and release.",
          "Reported project status, charters, and SDLC documentation to stakeholders.",
          "Identified high-level process and system changes from business partner and client input.",
        ],
        portfolio: [],
      },
    ],
  },
  {
    id: "infosys",
    company: "Infosys",
    monogram: "I",
    color: "#AC8E68",
    location: {
      // Approximate: Infosys Mysuru campus.
      building: "Infosys Global Education Centre",
      city: "Mysuru, India",
      lng: 76.595,
      lat: 12.355,
    },
    positions: [
      {
        id: "infosys-trainee",
        title: "Software Engineer Trainee",
        start: "2006-07",
        end: "2007-01",
        highlights: [
          "Completed intensive training in Unix, Oracle, and Java.",
          "Led a team that built a web-enabled banking application.",
        ],
        portfolio: [],
      },
    ],
  },
];
