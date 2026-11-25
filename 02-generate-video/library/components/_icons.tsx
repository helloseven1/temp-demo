// 图标公共片段
const ICON_PATHS: Record<string, React.ReactNode> = {
  expert: <><circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-3.6 3-6 7-6s7 2.4 7 6"/></>,
  target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l4.5 4.5"/></>,
  lock: <><rect x="5" y="10" width="14" height="10" rx="2.5"/><path d="M8.5 10V7a3.5 3.5 0 0 1 7 0v3"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5.5l3.5 2"/></>,
  coins: <><ellipse cx="9" cy="7" rx="5" ry="2.4"/><path d="M4 7v4c0 1.3 2.2 2.4 5 2.4s5-1.1 5-2.4V7"/><ellipse cx="15" cy="14" rx="5" ry="2.4"/></>,
  doc: <><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h4M9 12h6M9 16h6"/></>,
  brain: <><path d="M12 6a3 3 0 0 0-5.6-1.5A3 3 0 0 0 4 10a3 3 0 0 0 1.2 4.5A3 3 0 0 0 12 17zM12 6a3 3 0 0 1 5.6-1.5A3 3 0 0 1 20 10a3 3 0 0 1-1.2 4.5A3 3 0 0 1 12 17z"/></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5"/>,
  cross: <path d="M6 6l12 12M18 6L6 18"/>,
  pen: <><path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14.5 6.5l3 3"/></>,
  box: <><path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/></>,
  whale: <><path d="M3 14c2-4 8-6 13-5 3 .6 5 2 5 4.5S18 19 13 19C8 19 4 17 3 14z"/><path d="M3 14c-1-2 0-4 1-5"/><circle cx="17" cy="12.5" r=".8"/></>,
  flag: <path d="M5 21V4M5 5h11l-2 3.5L16 12H5"/>,
  bulb: <><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2h5c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></>,
};
const Icon: React.FC<{ name: string; color: string; size?: number }> = ({ name, color, size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {ICON_PATHS[name] ?? ICON_PATHS.bulb}
  </svg>
);
const AC = (s: any, a?: string): string => s.accents[a || 'blue'] || s.accents.blue;
const BOX = (s: any): React.CSSProperties => ({ position: 'absolute', fontFamily: s.font, boxSizing: 'border-box' });
