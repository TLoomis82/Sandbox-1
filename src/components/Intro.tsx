import type { Profile } from "../data/types";
import { PlayIcon } from "./icons";

type Props = {
  profile: Profile;
  visible: boolean;
  onTour: () => void;
  onExplore: () => void;
  onResume: () => void;
};

export function Intro({ profile, visible, onTour, onExplore, onResume }: Props) {
  return (
    <section className={`intro ${visible ? "" : "intro--hidden"}`} aria-hidden={!visible}>
      <div className="intro__content">
        <div className="intro__who">
          <img className="intro__photo" src="/profile.jpg" alt="" />
          <p className="intro__eyebrow">{profile.eyebrow}</p>
        </div>
        <h1 className="intro__name">{profile.name}</h1>
        <p className="intro__headline">{profile.headline}</p>
        <p className="intro__tagline">{profile.tagline}</p>
        <div className="intro__actions">
          <button className="btn btn--primary btn--large" onClick={onTour} tabIndex={visible ? 0 : -1}>
            <PlayIcon /> Take the tour
          </button>
          <button className="btn btn--glass btn--large" onClick={onExplore} tabIndex={visible ? 0 : -1}>
            Explore the map
          </button>
          <button className="btn btn--link" onClick={onResume} tabIndex={visible ? 0 : -1}>
            View resume
          </button>
        </div>
        <dl className="intro__stats">
          {profile.stats.map((s) => (
            <div key={s.label}>
              <dt>{s.value}</dt>
              <dd>{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
