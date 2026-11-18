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
    "Product leader with 20 years across engineering, UX, and data, from the Apple Online Store in Cupertino to enterprise data platforms today. I started as an engineer, grew into UX and product leadership, and now lead a data team that turns operational, IoT, and third-party data into products and decisions. I prototype in code, often with AI tools, so ideas get tested with real users and real data before they are built at scale.",
  stats: [
    { value: "20", label: "years building products" },
    { value: "5", label: "data sources unified in one prototype" },
    { value: "300%", label: "usage lift from a data-driven redesign" },
    { value: "90%", label: "adoption after research with 60 users" },
  ],
  // Only things actually done: kept to what a recruiter could ask about in an interview.
  dataWins: [
    {
      title: "A hackathon prototype that started a data team",
      detail:
        "Connected Salesforce, Intercom, product usage, Datadog, and our own data in a working prototype on real data. The company formed an official data team and asked me to lead it.",
    },
    {
      title: "A designer who became a data product manager",
      detail:
        "Most data products are built for the people who build them. I design them for the people who use them, which is how a data-driven redesign lifted usage 300%.",
    },
    {
      title: "I ask users which data matters before building",
      detail:
        "Interviews with 60 users showed which numbers they actually needed. The simpler back office built around them reached 90% adoption.",
    },
    {
      title: "Working software in the room, not slides",
      detail:
        "I build coded prototypes on real data, so executives react to the actual product, not a mockup.",
    },
    {
      title: "Outside data that answers bigger questions",
      detail:
        "Brought third-party data in next to first-party data to answer questions neither could answer alone.",
    },
    {
      title: "Data that points to revenue",
      detail:
        "Built the first customer 360 strategy to spot churn and upsell opportunities early, using event analytics from both the app and the server.",
    },
  ],
  skills: [
    {
      group: "Data & AI",
      items: ["Data product strategy", "Data prototyping", "Databricks", "SQL", "Third-party data", "Predictive analytics", "Claude", "ChatGPT", "Gemini"],
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
      building: "SmartRent HQ, Fourth Floor",
      city: "Phoenix, AZ",
      address: "6811 E Mayo Blvd, Phoenix, AZ 85054",
      floor: 4,
      remote: true,
    },
    positions: [
      {
        id: "smartrent-dpm",
        title: "Senior Data Product Manager",
        start: "2026-04",
        end: null,
        promotion:
          "At a company hackathon, I built a working prototype that joined Salesforce, Intercom, product usage, Datadog, and SmartRent's own data, using real data, to show what the business could see once its sources were connected. SmartRent formed an official data team from that work and asked me to lead it.",
        summary:
          "Lead the data team formed from my hackathon prototype, turning operational, IoT, and third-party data into products and stories for enterprise property owners and their executives.",
        highlights: [
          "Prototyped executive data experiences that connect high-level trends to the detail behind them.",
          "Built spatial prototypes that put operational data in a physical context.",
          "Connected internal and third-party data APIs into a single prototype experience, so questions that spanned several systems could be answered in one place.",
          "Validated every insight in an executive demo against live production data before it was shown.",
          "Audited product counts across systems against live data and corrected the figures before they reached leadership.",
          "Evaluated third-party data vendors on coverage, licensing, and cost.",
          "Turned CEO-level requirements into a prototype roadmap.",
          "Studied how public REITs report performance, to frame product metrics in the leading and lagging indicators owners already track.",
          "Built a natural-language analytics demo so executives could ask questions of company data in plain English.",
          "Created executive demos and presentations that turn product data into a clear story.",
          "Prototype in code with AI tools, so executives and customers react to working software instead of slides.",
        ],
        skills: ["Databricks", "SQL", "Mapbox", "React", "Claude"],
        portfolio: [
          {
            id: "sr-portfolio-intel",
            title: "Executive Data Experience",
            description: "Executive views that connect high-level trends to the detail behind them.",
            tags: ["Data product", "Executive UX", "Mapbox"],
            confidential: true,
          },
          {
            id: "sr-digital-twin",
            title: "Spatial Data Prototype",
            description: "Operational data shown in a physical context.",
            tags: ["Spatial", "Prototype"],
            confidential: true,
          },
          {
            id: "sr-nl-analytics",
            title: "Natural-Language Analytics Demo",
            description: "Plain-English questions answered from company data, built for an executive workshop.",
            tags: ["AI", "Analytics", "Demo"],
            confidential: true,
          },
          {
            id: "sr-immersive",
            title: "Large-Format Data Storytelling",
            description: "Data storytelling built for in-person executive sessions.",
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
            title: "Property Dashboard",
            description: "Property manager dashboard for device health, work orders, leak activity, and unit status.",
            image: "/portfolio/smartrent-dashboard.jpg",
            tags: ["Dashboard", "IoT", "Design system"],
          },
          {
            id: "sr-shop",
            title: "Device Shop",
            description: "In-app storefront for locks, thermostats, hubs, and sensors, with quotes for new properties.",
            image: "/portfolio/smartrent-shop.jpg",
            tags: ["E-commerce", "Web"],
          },
          {
            id: "sr-access-code",
            title: "Self-Guided Tour: Entry",
            description: "Step 1 of a self-guided tour: a temporary front-entry code with clear lock instructions.",
            image: "/portfolio/smartrent-access-code.jpg",
            tags: ["Mobile", "Self-guided tours"],
          },
          {
            id: "sr-amenities",
            title: "Self-Guided Tour: Amenities",
            description: "Step 4 of a self-guided tour: the amenities a prospect can unlock, each with its own access code.",
            image: "/portfolio/smartrent-amenities.jpg",
            tags: ["Mobile", "Self-guided tours"],
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
      remote: true,
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
            title: "Agent CRM Redesign",
            description:
              "Dashboard, MLS search, and listing detail rebuilt around an agent's day instead of a database's tables.",
            image: "/portfolio/elm-crm-redesign.jpg",
            // Pairs from the redesign deck: odd PDF pages are befores, even pages afters.
            gallery: [
              "/portfolio/elm-crm-dashboard-before.jpg",
              "/portfolio/elm-crm-redesign.jpg",
              "/portfolio/elm-crm-listings-before.jpg",
              "/portfolio/elm-crm-listings-after.jpg",
              "/portfolio/elm-crm-property-before.jpg",
              "/portfolio/elm-crm-property-after.jpg",
            ],
            captions: [
              "Dashboard: before",
              "Dashboard: after",
              "MLS search: before",
              "MLS search: after",
              "Listing detail: before",
              "Listing detail: after",
            ],
            caseStudy: {
              problem:
                "The agent CRM had grown one screen at a time. A tall sidebar of nested links and brokerage menus sat on every page. The dashboard opened on a row of tiles that each led somewhere else instead of answering anything, MLS search was a spreadsheet of columns beside a long form of filters, and opening a listing took agents away from the results they were working through. Agents had to dig for the data they needed, and the data they cared about most often wasn't shown at all.",
              approach: [
                "Watched how agents actually used each screen with UserIQ and Google Analytics 4: what they opened, what they skipped, and where they gave up.",
                "Interviewed targeted groups of agents to test each redesign idea before it was built.",
                "Studied competing CRMs and consumer real estate apps to set the bar for search and listing views.",
              ],
              solution: [
                "Dashboard: opens on the agent's day, with new leads, current clients, today's tasks, and progress toward their GCI goal up top, then the lead list, calendar, client activity, tasks, and performance below.",
                "MLS search: photo-first results with price, address, status, and property-type tags; location, price, type, beds, and baths in a single filter bar; saved searches one click away; and a list or map view.",
                "Listing detail: opens beside the results instead of replacing them, with photos, key facts, features, map, history, neighborhood, schools, private notes, and actions like creating a CMA, plus previous and next to keep moving through the list.",
                "Navigation: the sidebar became a slim icon rail, giving the work the full width of the screen.",
              ],
              outcome:
                "The redesign increased usage by over 300%, and a mobile-first strategy alongside it grew mobile usage by 200%.",
            },
            tags: ["User research", "CRM", "Redesign"],
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
      // No office address; pinned at the city center.
      building: "Commissions.io",
      city: "Prosper, TX",
      remote: true,
      lng: -96.8011,
      lat: 33.2362,
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
            description: "Low-fidelity Balsamiq wireframe of the distributor home and content sharing.",
            image: "/portfolio/commissions-balsamiq.jpg",
            tags: ["Balsamiq", "Wireframes"],
          },
          {
            id: "commissions-sketch",
            title: "Sketch Mockups",
            description: "Mid-fidelity mobile mockups for a mood and food tracker.",
            image: "/portfolio/commissions-sketch.jpg",
            tags: ["Sketch", "Mobile"],
          },
          {
            id: "commissions-hifi",
            title: "High-Fidelity Designs",
            description: "Final mobile design for distributor goals, bonus progress, and performance.",
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
        start: "2014-11",
        end: "2016-10",
        promotion:
          "Joined to lead the existing mobile app projects. Talking with customers again and again showed me where the experience was letting them down, so I started designing new ones. Two months in, that work became its own role as Director of UX.",
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
        ],
        skills: ["iOS", "Android", "Mixpanel", "Node.js"],
        portfolio: [
          {
            id: "neolife-club-app",
            title: "NeoLife Club App",
            description: "Consumer iOS app for product highlights, shopping, and a 30-day fitness challenge.",
            image: "/portfolio/neolife-club-app.jpg",
            tags: ["iOS", "Android"],
          },
          {
            id: "neolife-back-office",
            title: "Shop Redesign",
            description: "Redesigned distributor shop: product pages, category browsing, and the logged-in home.",
            image: "/portfolio/neolife-back-office.jpg",
            // Pages 2–5 of the redesign deck; opens on page 3 (the cover).
            gallery: [
              "/portfolio/neolife-shop-p2.jpg",
              "/portfolio/neolife-back-office.jpg",
              "/portfolio/neolife-shop-p4.jpg",
              "/portfolio/neolife-shop-p5.jpg",
            ],
            tags: ["Redesign", "E-commerce"],
          },
          {
            id: "neolife-before-after",
            title: "Back Office Redesign",
            description:
              "Research with 60 distributors turned a cluttered portal into a clean back office built around what they actually use.",
            image: "/portfolio/neolife-before-after.jpg",
            gallery: [
              "/portfolio/neolife-before-after.jpg",
              "/portfolio/neolife-product-before-after.jpg",
              "/portfolio/neolife-home-before.jpg",
              "/portfolio/neolife-home-after.jpg",
              "/portfolio/neolife-product-before.jpg",
              "/portfolio/neolife-product-after.jpg",
            ],
            captions: [
              "Home: before and after",
              "Product page: before and after",
              "Home: before",
              "Home: after",
              "Product page: before",
              "Product page: after",
            ],
            caseStudy: {
              problem:
                "The distributor back office had grown into a portal of banners, promotions, news, tools, and dozens of links, all competing for the same attention. Distributors logged in to check one thing, like how close they were to their next bonus, and had to hunt for it. Product pages had the same problem: dense copy, PDF links, and a pricing table stood between a distributor and the order.",
              approach: [
                "Interviewed a sample of 60 distributors about what they look for when they log in, what they act on, and what they ignore.",
                "Ranked every element on the home and product pages by how often distributors used it and how much it mattered to their business.",
                "Kept what made the list on the page and moved everything else into clear menus, so nothing was lost, just out of the way.",
              ],
              solution: [
                "Home: a personal overview with the five numbers distributors check most (PPV, BV, QPV, GPV, and legs), plus goal tracking that shows progress to the next bonus at a glance.",
                "Navigation: seven plain sections replace the crowded link bar and sidebar of buttons.",
                "Product pages: one hero image with price and options up front, visual highlights in place of walls of text, and Fast Facts, Ingredients, and the science one tap away.",
              ],
              outcome:
                "90% of distributors adopted the redesigned back office, and purchasing and fulfillment became noticeably faster.",
            },
            tags: ["User research", "Redesign", "Information architecture"],
          },
        ],
      },
      {
        id: "neolife-tpm",
        title: "International Technical Product Manager, Mobile Apps",
        start: "2014-09",
        end: "2014-11",
        summary: "Brought in to lead NeoLife's existing mobile app projects.",
        highlights: [
          "Took over the in-flight mobile app projects and kept them on track.",
          "Talked with customers to learn where the apps and site were falling short, which set up the move into UX leadership.",
        ],
        portfolio: [],
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
    press: [
      {
        // Headline taken from the article URL; check it against the live page.
        title: "Zeality injects immersive social VR content into mobile apps",
        outlet: "SiliconANGLE",
        date: "2017-03",
        url: "https://siliconangle.com/2017/03/01/zeality-injects-immersive-social-vr-content-mobile-apps/",
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
        promotion:
          "Promoted from Mobile UAT Lead for bringing valuable product ideas, deep product knowledge, and clear value to the mobile apps team.",
        summary:
          "Managed concurrent software projects spanning core platform, big data, and visualization on aggressive timelines.",
        highlights: [
          "Brought the Apple Store app to iPad, giving customers a shopping experience designed for the larger screen.",
          "Led the first iBeacon experience inside Apple's retail stores: as customers moved between display tables, details for the products on the nearest table appeared on their iPhone. It went live ahead of Major League Baseball's ballpark rollout of the same technology.",
          "Collected requirements, managed risk, and drove change with engineering and business development managers.",
          "Presented functional documentation to site managers.",
          "Owned customer support escalations through to resolution.",
        ],
        portfolio: [
          {
            id: "apple-ibeacon",
            title: "iBeacon in Apple Stores",
            description:
              "The first iBeacon experience in Apple retail: product details followed customers to whichever display table they were nearest.",
            image: "/portfolio/apple-ibeacon.svg",
            caseStudy: {
              problem:
                "In a busy store, customers moving from table to table had to find a specialist or search the app to learn about the products in front of them.",
              approach: [
                "Led the product effort to bring Apple's new iBeacon technology into its own retail stores for the first time.",
                "Worked with engineering and retail teams to map beacons to the iPad, iPhone, MacBook, and iMac display tables and decide what each table should show.",
              ],
              solution: [
                "Beacons at each display table let the Apple Store app know which table a customer was closest to: iPad, iPhone, MacBook, or iMac.",
                "The details for that table's products appeared on the customer's iPhone and updated as they walked to the next one.",
              ],
              outcome:
                "One of the first large-scale retail uses of iBeacon, live ahead of Major League Baseball's ballpark rollout of the same technology.",
            },
            tags: ["iBeacon", "Retail", "iOS", "Illustration"],
          },
          {
            id: "apple-store-ipad",
            title: "Apple Store App for iPad",
            description:
              "Introduced the Apple Store app on iPad, with browsing, configuring, and in-store pickup designed for the larger screen. Images: Apple.",
            image: "/portfolio/apple-store-ipad-product.jpg",
            gallery: ["/portfolio/apple-store-ipad-product.jpg", "/portfolio/apple-store-ipad-pickup.jpg"],
            captions: ["Configure and buy", "Personal Pickup: live store availability"],
            tags: ["iPad", "E-commerce", "Retail"],
          },
        ],
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
      // Three roles from LinkedIn; the VisualCV resume merges them into one.
      {
        id: "infosys-amex-lead",
        title: "Project Manager / Lead Business Systems Analyst / Test Manager",
        start: "2010-07",
        end: "2011-10",
        promotion: true,
        summary: "Built as-is, to-be, and end-to-end workflows to define requirements for prototypes and enhancements.",
        highlights: [
          "Carried business needs through design, development, testing, and release.",
          "Reported project status, charters, and SDLC documentation to stakeholders.",
          "Identified high-level process and system changes from business partner and client input.",
        ],
        portfolio: [],
      },
      {
        id: "infosys-amex-senior",
        title: "Senior Systems Engineer / Senior Business Systems Analyst",
        start: "2008-04",
        end: "2010-07",
        promotion: true,
        highlights: [],
        portfolio: [],
      },
      {
        id: "infosys-amex-se",
        title: "Software Engineer / Business Systems Analyst",
        start: "2007-01",
        end: "2008-04",
        highlights: [],
        portfolio: [],
      },
    ],
  },
  {
    id: "infosys",
    company: "Infosys",
    monogram: "I",
    // Infosys blue. Its only public icon is a cropped "Info" wordmark, so the pin keeps the letter.
    color: "#007CC3",
    location: {
      // No. 350, Hebbal, Electronics City, Hootagalli, Mysuru 570027. Pinned by hand
      // on the campus: the geocoder lands several blocks southwest of it.
      building: "Infosys Global Education Centre",
      city: "Mysuru, India",
      lng: 76.594419,
      lat: 12.358908,
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
