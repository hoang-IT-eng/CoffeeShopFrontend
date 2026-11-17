import React from 'react';

const PATHS = {
  roastery: (
    <>
      <path d="M5 10h11a3 3 0 0 1 0 6h-1.2" />
      <path d="M5 10v4a5 5 0 0 0 5 5h1a5 5 0 0 0 5-5v-4H5Z" />
      <path d="M3.5 19h13" />
      <path d="M8.5 4.2c0 1.4-1.2 1.8-1.2 3.1M12.5 4.2c0 1.4-1.2 1.8-1.2 3.1" />
    </>
  ),
  dashboard: (
    <>
      <rect x="3.5" y="3.5" width="7.2" height="8.5" rx="1.6" />
      <rect x="13.3" y="3.5" width="7.2" height="5.2" rx="1.6" />
      <rect x="13.3" y="11.3" width="7.2" height="9.2" rx="1.6" />
      <rect x="3.5" y="14.6" width="7.2" height="5.9" rx="1.6" />
    </>
  ),
  pos: (
    <>
      <rect x="3.5" y="4" width="17" height="12" rx="2" />
      <path d="M2.5 19.5h19" />
      <path d="M8 8.5h4M8 11.8h2.5M15.5 8.5h1.5M15.5 11.8h1.5" />
    </>
  ),
  kds: (
    <>
      <rect x="3.5" y="4.5" width="5" height="15" rx="1.3" />
      <rect x="9.5" y="4.5" width="5" height="11" rx="1.3" />
      <rect x="15.5" y="4.5" width="5" height="13" rx="1.3" />
    </>
  ),
  floor: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 11.5h9.5M13.5 4v16" />
      <circle cx="8.8" cy="7.8" r="1.4" />
      <circle cx="17" cy="15.5" r="1.6" />
    </>
  ),
  menu: (
    <>
      <path d="M5.5 4.5h11A2 2 0 0 1 18.5 6.5v13H7a1.5 1.5 0 0 1-1.5-1.5v-13.5Z" />
      <path d="M5.5 17.5H18.5" />
      <path d="M9 8.5h6M9 12h4.5" />
    </>
  ),
  inventory: (
    <>
      <path d="M12 3.3 20 7.6v8.8l-8 4.3-8-4.3V7.6l8-4.3Z" />
      <path d="M4 7.6 12 12l8-4.4M12 12v8.7" />
    </>
  ),
  shift: (
    <>
      <rect x="3.5" y="6" width="17" height="13" rx="2" />
      <path d="M3.5 11.5h17" />
      <path d="M10 15.2h4" />
      <path d="M8 6V4.2M16 6V4.2" />
    </>
  ),
  payments: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 14.5h3.5M15.5 14.5h1.5" />
    </>
  ),
  reports: (
    <>
      <path d="M4 19.5h16" />
      <path d="M6.5 16V11M11 16V7M15.5 16v-6.5M19 16V5" />
    </>
  ),
  customers: (
    <>
      <circle cx="9.5" cy="8.5" r="3.2" />
      <path d="M4 18.8a5.6 5.6 0 0 1 11 0" />
      <path d="M16 6.8a2.8 2.8 0 0 1 0 5.2M19.8 18.5a4.6 4.6 0 0 0-3.3-4.1" />
    </>
  ),
  users: (
    <>
      <rect x="4.5" y="3.8" width="15" height="16.4" rx="2" />
      <circle cx="12" cy="10" r="2.6" />
      <path d="M8 16.8a4.2 4.2 0 0 1 8 0" />
    </>
  ),
  storefront: (
    <>
      <path d="M4 9.5 5.8 4.5h12.4L20 9.5" />
      <path d="M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0" />
      <path d="M5.5 11.5v8h13v-8M10 19.5v-4.5h4v4.5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.2 4.2" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  check: <path d="m5 12.5 4.4 4.4L19 7.3" />,
  close: <path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5" />,
  menuBars: <path d="M4 7h16M4 12h16M4 17h16" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.5v4.8l3.2 1.9" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4.2 20.4 19H3.6L12 4.2Z" />
      <path d="M12 9.8v4.2M12 16.6h.01" />
    </>
  ),
  bean: (
    <>
      <ellipse cx="12" cy="12" rx="6.2" ry="8.2" transform="rotate(-24 12 12)" />
      <path d="M9.2 5.4c.5 4.2 5.1 8.8 5.6 13.2" />
    </>
  ),
  pourover: (
    <>
      <path d="M5.5 5h13l-4.2 7.5h-4.6L5.5 5Z" />
      <path d="M7.5 12.5h9M8.5 19.5h7l-.8-7h-5.4l-.8 7Z" />
      <path d="M18.5 6.5h1.5a1.5 1.5 0 0 1 0 3h-2.5" />
    </>
  ),
  qr: (
    <>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <path d="M14 14h3v3h-3zM17 17h3v3h-3zM18 14h2M14 19h2" />
    </>
  ),
  cash: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6 9.5h.01M18 14.5h.01" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3 10h18M7 15h4" />
    </>
  ),
  print: (
    <>
      <path d="M7 8V4.5h10V8" />
      <rect x="4" y="8" width="16" height="8" rx="2" />
      <rect x="7" y="13.5" width="10" height="6" rx="1" />
    </>
  ),
  download: (
    <>
      <path d="M12 4.5v10.5M8 11.5l4 4 4-4" />
      <path d="M4.5 18.5h15" />
    </>
  ),
  merge: (
    <>
      <path d="M6 5v5a4 4 0 0 0 4 4h8" />
      <path d="m15 11 3 3-3 3" />
      <path d="M6 19v-5" />
    </>
  ),
  trash: (
    <>
      <path d="M4.5 7h15M9.5 7V4.8h5V7" />
      <path d="M6.8 7l.8 12.2h8.8L17.2 7" />
      <path d="M10.2 11v5M13.8 11v5" />
    </>
  ),
  edit: (
    <>
      <path d="M15.8 4.6 19.4 8.2 8.6 19H5v-3.6L15.8 4.6Z" />
      <path d="m13.8 6.6 3.6 3.6" />
    </>
  ),
  refresh: (
    <>
      <path d="M19.5 10A7.8 7.8 0 0 0 6.2 6.8L4.5 8.5M4.5 4.8v3.7h3.7" />
      <path d="M4.5 14a7.8 7.8 0 0 0 13.3 3.2l1.7-1.7M19.5 19.2v-3.7h-3.7" />
    </>
  ),
  arrowRight: <path d="M5 12h14m-5-5 5 5-5 5" />,
  arrowLeft: <path d="M19 12H5m5-5-5 5 5 5" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6" />
    </>
  ),
  moon: <path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.8 7.8 0 1 0 10 10Z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M3.8 12h16.4M12 3.8c2.3 2.3 3.5 5.1 3.5 8.2s-1.2 5.9-3.5 8.2c-2.3-2.3-3.5-5.1-3.5-8.2S9.7 6.1 12 3.8Z" />
    </>
  ),
  trendUp: <path d="m4 16 5.2-5.2 3.6 3.6L20 7.2M15 7.2h5v5" />,
  trendDown: <path d="m4 8 5.2 5.2 3.6-3.6L20 16.8M15 16.8h5v-5" />,
  sliders: (
    <>
      <path d="M4 7h9M17 7h3M13 5v4" />
      <path d="M4 12h3M11 12h9M7 10v4" />
      <path d="M4 17h11M19 17h1M15 15v4" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3.8h12v16.4l-2.4-1.6-2.4 1.6-2.4-1.6-2.4 1.6L6 20.2V3.8Z" />
      <path d="M9 8.5h6M9 12h6M9 15.5h4" />
    </>
  ),
  shield: <path d="M12 3.5 19 6.5v5.3c0 4.4-2.9 7.5-7 8.9-4.1-1.4-7-4.5-7-8.9V6.5l7-3Z" />,
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 5.5L20 7" />
    </>
  ),
  phone: (
    <path d="M6.6 4.5h3l1.3 3.6-1.9 1.6a12.4 12.4 0 0 0 5.3 5.3l1.6-1.9 3.6 1.3v3a1.8 1.8 0 0 1-2 1.8A15.3 15.3 0 0 1 4.8 6.5a1.8 1.8 0 0 1 1.8-2Z" />
  ),
  logout: (
    <>
      <path d="M10 4.5H6a1.8 1.8 0 0 0-1.8 1.8v11.4A1.8 1.8 0 0 0 6 19.5h4" />
      <path d="M14.5 8 19 12l-4.5 4M9.5 12H19" />
    </>
  ),
  bolt: <path d="M13 3.5 5.5 13h5.6l-.9 7.5 7.8-9.5h-5.6L13 3.5Z" />
};

export function OpsIcon({ name, size = 18, className = '', strokeWidth = 1.8 }) {
  const content = PATHS[name] || PATHS.roastery;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {content}
    </svg>
  );
}

export default OpsIcon;
