import { useEffect, useRef } from "react";
import { PlayIcon } from "./icons";
import { StoryPoster } from "./StoryPoster";

type Props = { onOpenStory: () => void };

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Side projects: creative work outside of data and product. */
export function SideProjectsView({ onOpenStory }: Props) {
  const scroller = useRef<HTMLElement>(null);

  // Parallax: each banner's layers move with that banner's own position on screen.
  useEffect(() => {
    const el = scroller.current;
    if (!el || reducedMotion()) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.querySelectorAll<HTMLElement>(".sp-banner").forEach((b) => {
          const r = b.getBoundingClientRect();
          const off = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
          b.style.setProperty("--off", off.toFixed(3));
        });
      });
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Tilt the poster toward the pointer.
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || reducedMotion()) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--tx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    e.currentTarget.style.setProperty("--ty", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const onLeave = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--tx", "0");
    e.currentTarget.style.setProperty("--ty", "0");
  };

  return (
    <main className="side" ref={scroller}>
      <header className="side__head">
        <p className="eyebrow">Side projects</p>
        <h1>Stories, outside the day job.</h1>
        <p className="muted">Creative work that has nothing to do with data, and everything to do with how I like to build an experience.</p>
      </header>

      <section className="sp-banner sp-banner--story" onPointerMove={onMove} onPointerLeave={onLeave}>
        <div className="sp-banner__bg" style={{ backgroundImage: "url(/side/story-maker-poster.jpg)" }} aria-hidden />
        <div className="sp-banner__rays" aria-hidden />
        <div className="sp-banner__motes" aria-hidden>
          {Array.from({ length: 18 }, (_, i) => (
            <span key={i} style={{ "--i": i } as React.CSSProperties} />
          ))}
        </div>
        <div className="sp-banner__inner">
          <button className="sp-poster" onClick={onOpenStory} aria-label="Open The Story Maker" data-track="Story Maker: poster">
            <StoryPoster />
          </button>
          <div className="sp-banner__text">
            <p className="sp-banner__kicker">Original screenplay</p>
            <h2>The Story Maker</h2>
            <p>
              An imaginative young boy, reeling from the loss of his father, finds solace in a giant wolf that stalks
              the woods beside his home.
            </p>
            <p className="sp-banner__comps">
              <em>Pete's Dragon</em> meets <em>Bridge to Terabithia</em>.
            </p>
            <button className="btn btn--primary btn--large" onClick={onOpenStory} data-track="Story Maker: Enter the story">
              <PlayIcon /> Enter the story
            </button>
            <p className="sp-banner__note">A scroll-driven trailer. Best with sound off and the lights low.</p>
          </div>
        </div>
      </section>

      <section className="sp-banner sp-banner--soon">
        <div className="sp-banner__inner sp-banner__inner--soon">
          <p className="sp-banner__kicker">Next</p>
          <h2>More on the way</h2>
          <p className="muted">The next side project is in the works.</p>
        </div>
      </section>
    </main>
  );
}
