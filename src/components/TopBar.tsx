import type { Profile } from "../data/types";

export type View = "map" | "resume" | "services" | "side";

const TABS: { view: View; label: string }[] = [
  { view: "map", label: "Map" },
  { view: "resume", label: "Resume" },
  { view: "services", label: "Services" },
  { view: "side", label: "Side Projects" },
];

/** "Side Projects" drops its second word on narrow phones. */
function TabLabel({ label }: { label: string }) {
  const [first, ...rest] = label.split(" ");
  if (!rest.length) return <>{label}</>;
  return (
    <>
      {first}
      <span className="tab-long"> {rest.join(" ")}</span>
    </>
  );
}

type Props = {
  profile: Profile;
  view: View;
  onViewChange: (v: View) => void;
  onHome: () => void;
};

export function TopBar({ profile, view, onViewChange, onHome }: Props) {
  const index = TABS.findIndex((t) => t.view === view);
  return (
    <header className="topbar">
      <button className="topbar__id glass" data-track="Top bar: name (home)" onClick={onHome} aria-label="Home" title="Home">
        <img className="topbar__avatar" src="/profile.jpg" alt="" />
        <span className="topbar__name">{profile.name}</span>
      </button>

      <div
        className="segmented glass"
        role="tablist"
        aria-label="View"
        style={{ "--tabs": TABS.length } as React.CSSProperties}
      >
        <span className="segmented__thumb" style={{ transform: `translateX(${index * 100}%)` }} />
        {TABS.map((t) => (
          <button key={t.view} role="tab" aria-selected={view === t.view} onClick={() => onViewChange(t.view)}>
            <TabLabel label={t.label} />
          </button>
        ))}
      </div>

      <a className="btn btn--primary topbar__contact" data-track="Top bar: Get in touch" href={`mailto:${profile.email}`}>
        Get in touch
      </a>
    </header>
  );
}
