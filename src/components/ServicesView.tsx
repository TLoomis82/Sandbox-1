import { useEffect, useRef, useState } from "react";
import type { Profile } from "../data/types";
import { engagements, services, starters, steps, toolkit, type Service } from "../data/services";
import { ArrowIcon } from "./icons";
import { ClarityCompare, CountUp, RoleVenn, StallTrack } from "./ServicesWidgets";

type Props = {
  profile: Profile;
  onSeeWork: () => void;
};

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function ServicesView({ profile, onSeeWork }: Props) {
  const scroller = useRef<HTMLElement>(null);
  const contact = `mailto:${profile.email}?subject=${encodeURIComponent("Project inquiry")}`;
  const [starterId, setStarterId] = useState<string | null>(null);
  const starter = starters.find((s) => s.id === starterId) ?? null;
  // The picker's email asks the same questions as the matching engagement.
  const starterPlan = starter && engagements.find((e) => e.name === starter.engagement);
  const starterMail =
    starter &&
    starterPlan &&
    engagementMail(profile.email, {
      ...starterPlan,
      intro: `We have ${starter.label.toLowerCase()}, and a ${starter.engagement} sounds like the right start.`,
    });

  // Parallax: expose scroll position as --scroll so layers can move at their own speed.
  // --progress (0 to 1) drives the reading bar along the top; it works even with reduced motion.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const still = reducedMotion();
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!still) {
          el.style.setProperty("--scroll", String(el.scrollTop));
          // The results band's parallax is measured from the band itself, so it
          // stays in range however far down the page the band sits.
          const band = el.querySelector<HTMLElement>(".svc-proof");
          if (band) {
            const off = band.offsetTop + band.offsetHeight / 2 - (el.scrollTop + el.clientHeight / 2);
            el.style.setProperty("--proof-off", String(Math.round(off)));
          }
        }
        el.style.setProperty("--progress", String(el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight)));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Reveal sections as they scroll into view.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const targets = el.querySelectorAll(".reveal");
    if (reducedMotion() || !("IntersectionObserver" in window)) {
      targets.forEach((t) => t.setAttribute("data-visible", ""));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute("data-visible", "");
            io.unobserve(e.target);
          }
        }),
      { root: el, threshold: 0.15 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <main className="services" ref={scroller}>
      <div className="svc-progress" aria-hidden />
      {/* Hero: layers drift at different speeds as you scroll. */}
      <section className="svc-hero">
        <div className="svc-hero__layer svc-hero__orb svc-hero__orb--a" aria-hidden />
        <div className="svc-hero__layer svc-hero__orb svc-hero__orb--b" aria-hidden />
        <div className="svc-hero__layer svc-hero__orb svc-hero__orb--c" aria-hidden />
        <DataNetwork />
        <div className="svc-hero__content">
          <p className="intro__eyebrow">Work with me</p>
          <h1>Your data already knows your next product.</h1>
          <p className="svc-hero__lede">
            I sit where design, data, and code meet. I find out what your users need from your data, then build it
            so they use it. Contract, project, or fractional.
          </p>
          <div className="intro__actions">
            <a className="btn btn--primary btn--large" href={contact}>
              Start a project <ArrowIcon />
            </a>
            <button className="btn btn--glass btn--large" onClick={onSeeWork}>
              See the work
            </button>
          </div>
        </div>
        <button
          className="svc-hero__scroll"
          onClick={() => document.getElementById("svc-start")?.scrollIntoView({ behavior: "smooth" })}
        >
          Scroll to explore
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </section>

      <section className="svc-section" id="svc-start">
        <header className="svc-section__head reveal">
          <p className="eyebrow">Where I come in</p>
          <h2>Most projects hire for one of these. I bring all three.</h2>
          <p className="muted">Hover or tap each circle to see what goes missing without the other two.</p>
        </header>
        <div className="reveal">
          <RoleVenn />
        </div>
      </section>

      <section className="svc-section">
        <header className="svc-section__head reveal">
          <p className="eyebrow">Where projects stall</p>
          <h2>Every stage has a place it gets stuck.</h2>
          <p className="muted">Drag along the project, or pick a stage.</p>
        </header>
        <div className="reveal">
          <StallTrack />
        </div>
      </section>

      <section className="svc-section">
        <header className="svc-section__head reveal">
          <p className="eyebrow">Less, on purpose</p>
          <h2>The most valuable thing I do is take data away.</h2>
          <p className="muted">
            Users rarely need more numbers. They need the right three. Drag the handle to see the difference.
          </p>
        </header>
        <div className="reveal">
          <ClarityCompare />
        </div>
      </section>

      <section className="svc-section">
        <header className="svc-section__head reveal">
          <p className="eyebrow">What I do</p>
          <h2>Nine ways I can help</h2>
          <p className="muted">Each one comes from work I've already shipped. Not sure where to start? Pick what you have.</p>
        </header>
        <div className="starter reveal" role="group" aria-label="Find your starting point">
          {starters.map((s) => (
            <button
              key={s.id}
              className="starter__chip"
              aria-pressed={starterId === s.id}
              onClick={() => setStarterId((id) => (id === s.id ? null : s.id))}
            >
              {s.label}
            </button>
          ))}
        </div>
        {starter && (
          <div className="starter__plan" key={starter.id} aria-live="polite">
            <div>
              <p className="eyebrow">Start with a {starter.engagement.toLowerCase()}</p>
              <p>{starter.plan}</p>
            </div>
            <a className="btn btn--primary" href={starterMail!}>
              Start here <ArrowIcon />
            </a>
          </div>
        )}
        <div className={`svc-grid ${starter ? "svc-grid--picked" : ""}`}>
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} picked={!!starter?.services.includes(s.id)} />
          ))}
        </div>
      </section>

      <section className="svc-proof">
        <div className="svc-proof__bg" aria-hidden />
        <div className="svc-proof__inner reveal">
          <p className="eyebrow">Results, not decks</p>
          <dl>
            {profile.stats.map((s) => (
              <div key={s.label}>
                <dt>
                  <CountUp value={s.value} />
                </dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="svc-section">
        <header className="svc-section__head reveal">
          <p className="eyebrow">How it works</p>
          <h2>From idea to proof in days</h2>
        </header>
        <ol className="svc-steps">
          {steps.map((s, i) => (
            <li key={s.title} className="svc-step reveal" style={{ "--d": `${i * 90}ms` } as React.CSSProperties}>
              <span className="svc-step__num">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="svc-section">
        <header className="svc-section__head reveal">
          <p className="eyebrow">Ways to work together</p>
          <h2>Pick the shape that fits</h2>
        </header>
        <div className="svc-plans">
          {engagements.map((e, i) => (
            <article
              key={e.name}
              className={`svc-plan reveal ${e.featured ? "svc-plan--featured" : ""}`}
              style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
            >
              {e.featured && <span className="svc-plan__badge">End to end</span>}
              <h3>{e.name}</h3>
              <p className="svc-plan__length">{e.length}</p>
              <p>{e.summary}</p>
              <ul>
                {e.includes.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <p className="svc-plan__note">Opens an email with a few questions to fill in.</p>
              <a
                className={`btn ${e.featured ? "btn--primary" : "btn--plain"}`}
                href={engagementMail(profile.email, e)}
              >
                Ask about a {e.name.toLowerCase()}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="svc-section svc-section--tight">
        <header className="svc-section__head reveal">
          <p className="eyebrow">Toolkit</p>
          <h2>Comfortable in your stack</h2>
        </header>
        <div className="svc-marquee" aria-label={toolkit.join(", ")}>
          <div className="svc-marquee__track" aria-hidden>
            {[...toolkit, ...toolkit].map((t, i) => (
              <span key={i} className="svc-chip">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="svc-cta reveal">
        <h2>Have data that isn't pulling its weight?</h2>
        <p>Tell me what you're working with. I'll reply with where I think the opportunity is, no strings attached.</p>
        <a className="btn btn--primary btn--large" href={contact}>
          Tell me about your data <ArrowIcon />
        </a>
        <p className="svc-cta__email">
          or email <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </p>
      </section>
    </main>
  );
}

/** A pre-written email with the questions to answer, so the first reply can be a real plan. */
function engagementMail(email: string, e: (typeof engagements)[number]) {
  const body = [
    "Hi Tyler,",
    "",
    e.intro,
    "",
    ...e.questions.flatMap((q) => [`${q}:`, "", ""]),
    "Anything else I should know:",
    "",
    "",
    "Thanks,",
  ].join("\n");
  return `mailto:${email}?subject=${encodeURIComponent(`${e.name} inquiry`)}&body=${encodeURIComponent(body)}`;
}

function ServiceCard({ service, index, picked }: { service: Service; index: number; picked: boolean }) {
  // Tilt toward the pointer, with a soft light that follows it.
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || reducedMotion()) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.setProperty("--rx", `${(0.5 - y) * 7}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 9}deg`);
  };
  const onLeave = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };
  return (
    <article
      className={`svc-card reveal ${picked ? "svc-card--picked" : ""}`}
      style={{ "--d": `${(index % 3) * 90}ms` } as React.CSSProperties}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <span className={`svc-card__icon svc-card__icon--${service.icon}`}>
        <ServiceIcon name={service.icon} />
      </span>
      <h3>{service.title}</h3>
      <p className="svc-card__pitch">{service.pitch}</p>
      <ul className="svc-card__list">
        {service.deliverables.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
      <p className="svc-card__proof">
        <span>In practice</span>
        {service.proof}
      </p>
    </article>
  );
}

/** Decorative connected nodes in the hero, drifting slower than the orbs. */
function DataNetwork() {
  const nodes = [
    [120, 140], [300, 80], [460, 210], [640, 120], [820, 240], [980, 100],
    [200, 360], [420, 430], [610, 340], [790, 460], [1000, 370], [1120, 220],
  ];
  const links = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 11], [0, 6], [6, 7], [7, 8],
    [8, 9], [9, 10], [10, 11], [2, 8], [3, 8], [4, 10], [1, 6],
  ];
  return (
    <svg className="svc-hero__layer svc-hero__net" viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {links.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 6 : 4} style={{ "--i": i } as React.CSSProperties} />
      ))}
    </svg>
  );
}

function ServiceIcon({ name }: { name: Service["icon"] }) {
  const p = {
    stroke: "currentColor",
    strokeWidth: 2,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths: Record<Service["icon"], React.ReactNode> = {
    prototype: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="2" {...p} />
        <path d="M8 21h8M12 17v4M7 9l2 2-2 2M11 13h5" {...p} />
      </>
    ),
    web: (
      <>
        <circle cx="12" cy="12" r="9" {...p} />
        <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" {...p} />
      </>
    ),
    revenue: <path d="M4 19l5-6 4 3 7-9M15 7h5v5" {...p} />,
    simplify: (
      <>
        <path d="M4 5h16l-6 7v6l-4 2v-8z" {...p} />
      </>
    ),
    experience: (
      <>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" {...p} />
      </>
    ),
    api: (
      <>
        <circle cx="5" cy="12" r="2.5" {...p} />
        <circle cx="19" cy="5" r="2.5" {...p} />
        <circle cx="19" cy="19" r="2.5" {...p} />
        <path d="M7.3 11l9.4-5M7.3 13l9.4 5" {...p} />
      </>
    ),
    research: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" {...p} />
        <path d="M15.5 15.5L21 21M8 10.5h5M10.5 8v5" {...p} />
      </>
    ),
    ai: (
      <>
        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" {...p} />
        <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" {...p} />
      </>
    ),
    lead: (
      <>
        <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z" {...p} />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      {paths[name]}
    </svg>
  );
}
