type P = { size?: number };

export const CloseIcon = ({ size = 16 }: P) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export const PlayIcon = ({ size = 14 }: P) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
    <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" fill="currentColor" />
  </svg>
);

export const StopIcon = ({ size = 14 }: P) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
    <rect x="6" y="6" width="12" height="12" rx="2.5" fill="currentColor" />
  </svg>
);

export const PauseIcon = ({ size = 14 }: P) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
    <rect x="6" y="4.5" width="4" height="15" rx="1.5" fill="currentColor" />
    <rect x="14" y="4.5" width="4" height="15" rx="1.5" fill="currentColor" />
  </svg>
);

export const PrevIcon = ({ size = 14 }: P) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
    <rect x="4" y="5" width="3" height="14" rx="1.2" fill="currentColor" />
    <path d="M20 5.7v12.6a1 1 0 0 1-1.55.83L9.6 13.17a1 1 0 0 1 0-1.66l8.85-5.95A1 1 0 0 1 20 5.7z" fill="currentColor" />
  </svg>
);

export const NextIcon = ({ size = 14 }: P) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
    <rect x="17" y="5" width="3" height="14" rx="1.2" fill="currentColor" />
    <path d="M4 5.7v12.6a1 1 0 0 0 1.55.83l8.85-5.96a1 1 0 0 0 0-1.66L5.55 5.56A1 1 0 0 0 4 5.7z" fill="currentColor" />
  </svg>
);

export const PromotedIcon = ({ size = 14 }: P) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
    <path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" stroke="currentColor" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** A house, for remote roles. */
export const RemoteIcon = ({ size = 14 }: P) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
    <path d="M4 11l8-6.5 8 6.5M6.5 9.5V19h11V9.5" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LockIcon = ({ size = 22 }: P) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
    <rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="2.2" fill="none" />
  </svg>
);

export const ArrowIcon = ({ size = 14 }: P) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
    <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
