import type { Profile } from "../data/types";

export type View = "map" | "resume";

type Props = {
  profile: Profile;
  view: View;
  onViewChange: (v: View) => void;
};

export function TopBar({ profile, view, onViewChange }: Props) {
  return (
    <header className="topbar">
      <button className="topbar__id glass" onClick={() => onViewChange("map")} aria-label="Home">
        <img className="topbar__avatar" src="/profile.jpg" alt="" />
        <span className="topbar__name">{profile.name}</span>
      </button>

      <div className="segmented glass" role="tablist" aria-label="View">
        <span className="segmented__thumb" data-pos={view === "map" ? 0 : 1} />
        <button role="tab" aria-selected={view === "map"} onClick={() => onViewChange("map")}>
          Map
        </button>
        <button role="tab" aria-selected={view === "resume"} onClick={() => onViewChange("resume")}>
          Resume
        </button>
      </div>

      <a className="btn btn--primary topbar__contact" href={`mailto:${profile.email}`}>
        Get in touch
      </a>
    </header>
  );
}
