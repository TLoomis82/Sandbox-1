// ─────────────────────────────────────────────────────────────────────────────
// Content for the "Services" tab (titled "Work with me" on the page).
// Every "In practice" line points to work shown elsewhere on this site, worded
// without client names, figures, or internal product names.
// ─────────────────────────────────────────────────────────────────────────────

export type Service = {
  id: string;
  /** Short label for the icon tile. */
  icon: "prototype" | "web" | "revenue" | "simplify" | "experience" | "api" | "research" | "ai" | "lead";
  title: string;
  pitch: string;
  deliverables: string[];
  proof: string;
};

export const services: Service[] = [
  {
    id: "prototypes",
    icon: "prototype",
    title: "Prototypes that sell the idea",
    pitch: "Working software in days, not slide decks. Stakeholders click through real screens with your real data, so decisions happen in the first meeting.",
    deliverables: ["Clickable, coded prototypes", "Real data, not lorem ipsum", "Executive-ready demo and walkthrough"],
    proof: "A hackathon prototype I built convinced a company to form an official data team, with me leading it.",
  },
  {
    id: "websites",
    icon: "web",
    title: "Websites and web apps",
    pitch: "Fast, polished sites with the details people remember: maps, motion, and interfaces that feel effortless on every screen.",
    deliverables: ["Design and build in React", "Interactive maps and 3D", "Responsive, accessible, and quick to load"],
    proof: "This site, plus redesigned shops, back offices, and CRMs for distributors and real estate agents.",
  },
  {
    id: "revenue",
    icon: "revenue",
    title: "Turn existing data into revenue",
    pitch: "Most companies already own the data for their next product. I find where it can earn: premium insights, benchmarks, churn and upsell signals.",
    deliverables: ["Data opportunity assessment", "Monetizable product concepts", "Signals tied to the metrics your buyers report"],
    proof: "Built a customer 360 strategy to spot churn and upsell early, and a hackathon prototype on real data that started a data team.",
  },
  {
    id: "simplify",
    icon: "simplify",
    title: "Simplify what people see",
    pitch: "Too much data hides the few numbers that matter. I find out which ones your users care about, then cut everything else.",
    deliverables: ["Interviews on which data users rely on", "A short list of the numbers that matter", "Clean screens built around them"],
    proof: "Asked 60 users what they needed, then rebuilt a cluttered back office around it. Adoption reached 90%.",
  },
  {
    id: "experiences",
    icon: "experience",
    title: "Memorable data experiences",
    pitch: "Dashboards people actually open. Executive views, live maps, and spatial views that turn numbers into a story.",
    deliverables: ["Executive dashboards with drill-down", "Map and 3D visualizations", "Data storytelling for big screens"],
    proof: "Executive data experiences and spatial prototypes built on real operational data.",
  },
  {
    id: "apis",
    icon: "api",
    title: "Connect your tools and APIs",
    pitch: "Your CRM, support desk, product analytics, and monitoring all know something different. I connect them and surface only what your users need.",
    deliverables: ["Integrations across your SaaS stack", "Third-party data enrichment", "The few numbers that matter, front and center"],
    proof: "Connected Salesforce, Intercom, product usage, Datadog, and first-party data in one prototype, plus third-party data.",
  },
  {
    id: "research",
    icon: "research",
    title: "Research-driven redesigns",
    pitch: "I talk to your users, watch the analytics, and redesign around what they actually do. Then I measure whether it worked.",
    deliverables: ["User interviews and usability testing", "Analytics and event tracking setup", "Before and after results"],
    proof: "Interviews with 60 users led to 90% adoption; a data-driven CRM redesign lifted usage 300%.",
  },
  {
    id: "ai",
    icon: "ai",
    title: "AI that answers real questions",
    pitch: "Let leaders ask a question in plain English and get an answer from your own data, and use AI to prototype in days instead of months.",
    deliverables: ["Natural-language query demos", "AI-assisted prototypes on real data", "Help choosing where AI is worth it"],
    proof: "Built a plain-English analytics demo for an executive workshop, and prototype daily with AI tools.",
  },
  {
    id: "leadership",
    icon: "lead",
    title: "Fractional product leadership",
    pitch: "A senior product lead without the full-time hire. Roadmaps, priorities, and the executive story, plus hands-on help shipping it.",
    deliverables: ["Product strategy and roadmap", "Executive presentations", "Team coaching on discovery and delivery"],
    proof: "Head of Product, Director of UX, and Senior Data Product Manager roles, plus product work at Apple.",
  },
];

/** "Where I come in": what a team gets from each discipline alone, and from all three in one person. */
export type RoleId = "design" | "data" | "code" | "all";
export const roles: Record<RoleId, { label: string; title: string; detail: string }> = {
  design: {
    label: "Design",
    title: "Design on its own",
    detail: "Polished screens built on guesses about the data underneath. They look right in the mockup and fall apart with real numbers.",
  },
  data: {
    label: "Data",
    title: "Data on its own",
    detail: "Correct numbers in dashboards nobody opens, because no one asked who the numbers were for or what they would do next.",
  },
  code: {
    label: "Product & code",
    title: "Product and code on their own",
    detail: "Fast delivery of the wrong thing. The backlog moves, but no one talked to users or checked what the data could support.",
  },
  all: {
    label: "Me",
    title: "All three, in one person",
    detail:
      "I started as an engineer, led UX and product for years, and now lead a data team. I can interview your users, design the screen, wire up the data, and put a working prototype in front of your executives. Fewer handoffs means less gets lost.",
  },
};

/** "Where projects stall": one stop per project stage. */
export const stalls = [
  {
    stage: "Idea",
    stall: "Everyone in the room pictures something different, so the idea never gets a yes.",
    fix: "I build a working prototype on your real data, so the room reacts to the same thing.",
    proof: "A hackathon prototype I built led to an official data team, with me leading it.",
  },
  {
    stage: "Research",
    stall: "The team guesses what users want, and the guesses become the roadmap.",
    fix: "I talk to the people who will use it and find the data they actually rely on.",
    proof: "Interviews with 60 users shaped a back office that reached 90% adoption.",
  },
  {
    stage: "Design",
    stall: "Every stakeholder adds a number, and the screen turns into a wall of data.",
    fix: "I cut it down to the few numbers that drive a decision, and put them first.",
    proof: "Agents had to dig for their data. The redesign lifted usage over 300%.",
  },
  {
    stage: "Build",
    stall: "Design, data, and engineering hand work back and forth, and detail is lost each time.",
    fix: "I speak all three and prototype in code, so the build matches what was agreed.",
    proof: "I've worked as an engineer, a UX lead, a head of product, and a data product manager.",
  },
  {
    stage: "Launch",
    stall: "It ships, and nobody can say whether it worked.",
    fix: "Usage tracking from day one, with clear before and after results.",
    proof: "Alongside the CRM redesign, a mobile-first strategy grew mobile usage 200%.",
  },
  {
    stage: "Grow",
    stall: "Data keeps piling up without paying for itself.",
    fix: "I find where it can earn: churn and upsell signals, benchmarks, and new data products.",
    proof: "Built the first customer 360 strategy to spot churn and upsell early.",
  },
];

/** "Find your starting point": a situation maps to services and an engagement. */
export const starters = [
  {
    id: "idea",
    label: "An idea that needs buy-in",
    services: ["prototypes", "experiences"],
    engagement: "Sprint",
    plan: "In the first two weeks we pick the one question that decides the idea, and I build a prototype that answers it with your data.",
  },
  {
    id: "data",
    label: "Data nobody uses",
    services: ["simplify", "revenue"],
    engagement: "Sprint",
    plan: "In the first two weeks I talk to the people who should be using it, and show you the few numbers worth putting in front of them.",
  },
  {
    id: "confusing",
    label: "A product people find confusing",
    services: ["research", "websites"],
    engagement: "Project",
    plan: "In the first two weeks I interview users and review your analytics, then bring a redesign direction you can click through.",
  },
  {
    id: "tools",
    label: "Tools that don't talk to each other",
    services: ["apis", "experiences"],
    engagement: "Project",
    plan: "In the first two weeks we map what each tool knows, and I connect the two that matter most into one working view.",
  },
  {
    id: "lead",
    label: "A team that needs product leadership",
    services: ["leadership", "ai"],
    engagement: "Fractional",
    plan: "In the first two weeks I meet the team, review the roadmap, and bring back the priorities I would change and why.",
  },
];

export const steps = [
  { title: "Discover", detail: "A working session on your goals, your users, and the data you already have. You leave with a clear opportunity, not a proposal deck." },
  { title: "Prototype", detail: "Within days you click through a working version built on your real data, so feedback is about the product, not a mockup." },
  { title: "Build", detail: "We turn the winning prototype into production: data model, integrations, and an interface people want to use." },
  { title: "Measure", detail: "Usage and outcome tracking from day one, so you can see the return and decide what comes next." },
];

export const engagements = [
  {
    name: "Sprint",
    length: "2 to 3 weeks",
    summary: "One focused question answered with a working prototype.",
    includes: ["Discovery session", "Coded prototype on your data", "Recommendation and next steps"],
    intro: "I'd like to talk about a 2 to 3 week Sprint.",
    questions: [
      "Your name and role",
      "Company and website",
      "The one question you want answered",
      "Who needs to say yes, and what would convince them",
      "Data you already have (tools, exports, APIs)",
      "Ideal start date",
    ],
  },
  {
    name: "Project",
    length: "1 to 3 months",
    summary: "A product, site, or data model designed and delivered end to end.",
    includes: ["Everything in a Sprint", "Production build and integrations", "Launch and measurement plan"],
    featured: true,
    intro: "I'd like to talk about a 1 to 3 month Project.",
    questions: [
      "Your name and role",
      "Company and website",
      "What you want built (product, site, dashboard, integration)",
      "Who will use it, and what they struggle with today",
      "Tools and data it needs to connect to",
      "What success looks like at launch",
      "Target launch date",
      "Budget range, if you have one",
    ],
  },
  {
    name: "Fractional",
    length: "Ongoing",
    summary: "Senior product and data leadership a few days a month.",
    includes: ["Roadmap and priorities", "Executive storytelling", "Hands-on prototyping as needed"],
    intro: "I'd like to talk about Fractional product and data leadership.",
    questions: [
      "Your name and role",
      "Company and website",
      "Team size, and who I would work with",
      "The biggest product or data challenge right now",
      "What you'd want off your plate in the first 90 days",
      "Days per month you have in mind",
      "Ideal start date",
    ],
  },
];

export const toolkit = [
  "React",
  "TypeScript",
  "Mapbox",
  "Databricks",
  "SQL",
  "Salesforce",
  "Intercom",
  "Datadog",
  "Google Analytics 4",
  "Mixpanel",
  "Amplitude",
  "Figma",
  "Claude",
  "ChatGPT",
];
