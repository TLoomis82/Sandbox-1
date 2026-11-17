import { useEffect, useState } from "react";
import type { Job } from "../data/types";

/** Explicit `logo`, else the file scripts/fetch-logos.sh saves for this job. */
export const logoUrl = (job: Job) => job.logo ?? `/logos/${job.id}.png`;

/** Company logo that falls back to the monogram if the file is missing or fails to load. */
export function CompanyLogo({ job, className = "" }: { job: Job; className?: string }) {
  const [ok, setOk] = useState(true);
  useEffect(() => setOk(true), [job.id]);
  return (
    <div className={`${className} ${ok ? "has-logo" : ""}`}>
      {ok ? <img src={logoUrl(job)} alt="" onError={() => setOk(false)} /> : job.monogram}
    </div>
  );
}
