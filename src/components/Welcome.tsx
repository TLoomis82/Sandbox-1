import { useEffect, useState } from "react";
import type { Profile } from "../data/types";

const SEEN_KEY = "welcome-seen-v1";
const HOLD_MS = 2800;
const EXIT_MS = 1100;

type Stage = "enter" | "exit" | "done";

/** True on a visitor's first load; later visits go straight to the site. */
export function shouldShowWelcome(): boolean {
  // `?welcome` replays it, handy for testing or demoing.
  if (new URLSearchParams(location.search).has("welcome")) return true;
  if (location.hash === "#resume") return false;
  try {
    return localStorage.getItem(SEEN_KEY) !== "1";
  } catch {
    return true;
  }
}

type Props = {
  profile: Profile;
  /** Fires as the welcome starts dissolving, so the site can animate in underneath. */
  onExit: () => void;
  onDone: () => void;
};

export function Welcome({ profile, onExit, onDone }: Props) {
  const [stage, setStage] = useState<Stage>("enter");
  const firstName = profile.name.split(" ")[0];

  // Hold, then exit. Clicking or pressing any key skips ahead.
  useEffect(() => {
    if (stage === "enter") {
      const t = setTimeout(() => setStage("exit"), HOLD_MS);
      const skip = () => setStage("exit");
      window.addEventListener("keydown", skip);
      return () => {
        clearTimeout(t);
        window.removeEventListener("keydown", skip);
      };
    }
    if (stage === "exit") {
      onExit();
      try {
        localStorage.setItem(SEEN_KEY, "1");
      } catch {
        // Storage unavailable; the welcome just shows again next visit.
      }
      const t = setTimeout(() => {
        setStage("done");
        onDone();
      }, EXIT_MS);
      return () => clearTimeout(t);
    }
  }, [stage, onExit, onDone]);

  if (stage === "done") return null;

  return (
    <div
      className={`welcome welcome--${stage}`}
      onClick={() => stage === "enter" && setStage("exit")}
      role="dialog"
      aria-label={`Welcome from ${profile.name}`}
    >
      <div className="welcome__inner">
        <div className="welcome__photo">
          <img src="/profile.jpg" alt={profile.name} />
        </div>
        <p className="welcome__hello">Hi, I'm {firstName}.</p>
        <p className="welcome__line">Welcome. Let me show you where I've been and what I've built.</p>
        <p className="welcome__skip">Click anywhere to continue</p>
      </div>
    </div>
  );
}
