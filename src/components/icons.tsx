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
