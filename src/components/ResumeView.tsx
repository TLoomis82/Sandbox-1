import type { Job, Profile } from "../data/types";
import { formatRange, jobDuration, showsTenure } from "../lib/dates";
import { PromotedIcon } from "./icons";

type Props = {
  profile: Profile;
  jobs: Job[];
  onShowOnMap: (jobId: string) => void;
};

export function ResumeView({ profile, jobs, onShowOnMap }: Props) {
  return (
    <main className="resume">
      <article className="resume__page">
        <header className="resume__header">
          <div className="resume__identity">
            <img className="resume__photo" src="/profile.jpg" alt={profile.name} />
            <div>
              <h1>{profile.name}</h1>
              <p className="resume__headline">{profile.headline}</p>
            </div>
          </div>
          <div className="resume__contact">
            <span>{profile.location}</span>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener">
                {profile.website.replace(/^https?:\/\//, "")}
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener">
                LinkedIn
              </a>
            )}
          </div>
        </header>

        <div className="resume__actions no-print">
          <button className="btn btn--primary" onClick={() => window.print()}>
            Download PDF
          </button>
        </div>

        <p className="resume__summary">{profile.summary}</p>

        <dl className="resume__stats">
          {profile.stats.map((s) => (
            <div key={s.label}>
              <dt>{s.value}</dt>
              <dd>{s.label}</dd>
            </div>
          ))}
        </dl>

        <section>
          <h2 className="eyebrow">Experience</h2>
          {jobs.map((job) => (
            <div key={job.id} className="resume__job">
              <div className="resume__job-head">
                <h3>
                  {/* Dot and name stay on one line; only the city wraps below on narrow screens. */}
                  <span className="resume__company">
                    <span className="resume__dot" style={{ background: job.color }} />
                    {job.company}
                  </span>
                  {job.location.city && (
                    <span className="resume__city">
                      {job.location.city}
                      {job.location.remote && " · Remote"}
                      {showsTenure(job) && (
                        <>
                          {" · "}
                          <span className="nowrap">{jobDuration(job)}</span>
                        </>
                      )}
                    </span>
                  )}
                </h3>
                <button className="btn btn--plain btn--small no-print" onClick={() => onShowOnMap(job.id)}>
                  {job.location.lng != null || job.location.address ? "View on map" : "View details"}
                </button>
              </div>
              {job.positions.map((p) => (
                <div key={p.id} className="resume__position">
                  <div className="resume__position-head">
                    <strong>
                      {p.title}
                      {p.promotion && (
                        <span className="resume__promoted">
                          <PromotedIcon size={10} /> Promoted
                        </span>
                      )}
                    </strong>
                    <span className="muted">{formatRange(p)}</span>
                  </div>
                  {p.summary && <p className="resume__role-summary">{p.summary}</p>}
                  {p.highlights.length > 0 && (
                    <ul>
                      {p.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ))}
        </section>

        <div className="resume__cols">
          <section>
            <h2 className="eyebrow">Skills</h2>
            {profile.skills.map((s) => (
              <p key={s.group}>
                <strong>{s.group}:</strong> {s.items.join(", ")}
              </p>
            ))}
          </section>
          <section>
            <h2 className="eyebrow">Education</h2>
            {profile.education.map((e) => (
              <p key={e.school}>
                <strong>{e.school}</strong>
                <br />
                {e.degree} · <span className="muted">{e.years}</span>
              </p>
            ))}
          </section>
        </div>
      </article>
    </main>
  );
}
