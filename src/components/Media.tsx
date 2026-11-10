import { useState } from "react";
import { LockIcon } from "./icons";

type Props = {
  src?: string;
  alt: string;
  /** Shown when there is no image or it fails to load. */
  label: string;
  accent: string;
  locked?: boolean;
  className?: string;
};

/** Portfolio image with a branded gradient fallback, so missing files never show a broken image. */
export function Media({ src, alt, label, accent, locked, className = "" }: Props) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed && !locked;
  return (
    <div className={`media ${className}`} style={{ "--job": accent } as React.CSSProperties}>
      {showImage ? (
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
      ) : locked ? (
        <div className="media__locked">
          <LockIcon />
          <span>Under NDA</span>
        </div>
      ) : (
        <span className="media__label">{label}</span>
      )}
    </div>
  );
}
