import type { Profile } from "../data/types";

export type View = "map" | "resume" | "services";

const TABS: { view: View; label: string }[] = [
  { view: "map", label: "Map" },
  { view: "resume", label: "Resume" },
  { view: "services", label: "Services" },
];

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
      <button className="topbar__id glass" onClick={onHome} aria-label="Home" title="Home">
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
            {t.label}
          </button>
        ))}
      </div>

      <a className="btn btn--primary topbar__contact" href={`mailto:${profile.email}`}>
        Get in touch
      </a>
    </header>
  );
}
