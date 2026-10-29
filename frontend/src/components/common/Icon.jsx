const PATHS = {
  pin: <><path d="M12 21s-7-6.1-7-11a7 7 0 0114 0c0 4.9-7 11-7 11z" /><circle cx="12" cy="10" r="2.6" /></>,
  phone: <path d="M4 5c0 8.3 6.7 15 15 15l3-4-6-3-2 2c-2.5-1.2-4.8-3.5-6-6l2-2-3-6H4z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="3.6" /><circle cx="17.2" cy="6.8" r=".8" /></>,
  play: <path d="M8 5l11 7-11 7z" />,
  check: <path d="M5 13l4 4L19 7" />,
  left: <path d="M15 5l-7 7 7 7" />,
  right: <path d="M9 5l7 7-7 7" />,
};
export default function Icon({ name, className, strokeWidth = 1.8 }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}
