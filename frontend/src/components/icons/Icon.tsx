import type { ReactElement, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const home = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z" />
  </svg>
)
const search = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)
const heart = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-7-4.5-9.3-9.2C.9 8.6 2.6 5 6 5c2 0 3.4 1 4 2.2C10.6 6 12 5 14 5c3.4 0 5.1 3.6 3.3 6.8C19 16.5 12 21 12 21Z" />
  </svg>
)
const heartFill = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21s-7-4.5-9.3-9.2C.9 8.6 2.6 5 6 5c2 0 3.4 1 4 2.2C10.6 6 12 5 14 5c3.4 0 5.1 3.6 3.3 6.8C19 16.5 12 21 12 21Z" />
  </svg>
)
const user = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
)
const card = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
    <path d="M2.5 10h19M6 15h3" />
  </svg>
)
const gift = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M3 10h18v3H3z" />
    <path d="M5 13v8h14v-8M12 8v13M12 8c-2 0-4-1-4-3s2-2 3-1 1 4 1 4Zm0 0c2 0 4-1 4-3s-2-2-3-1-1 4-1 4Z" />
  </svg>
)
const play = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 4.5v15a1 1 0 0 0 1.5.87l13-7.5a1 1 0 0 0 0-1.74l-13-7.5A1 1 0 0 0 6 4.5Z" />
  </svg>
)
const plus = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
)
const flag = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22V3l12 4-3 4 3 4-12 1" />
  </svg>
)
const film = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 8h18M3 16h18M8 4v16M16 4v16" />
  </svg>
)
const shield = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
  </svg>
)
const chart = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M3 21h18M6 17v-5M10 17v-9M14 17v-7M18 17v-12" />
  </svg>
)
const org = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <rect x="3" y="17" width="6" height="4" rx="1" />
    <rect x="15" y="17" width="6" height="4" rx="1" />
    <path d="M12 7v4M6 17v-2h12v2" />
  </svg>
)
const db = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <ellipse cx="12" cy="5" rx="8" ry="3" />
    <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
  </svg>
)
const list = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)
const logout = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M16 8l4 4-4 4M20 12H9" />
  </svg>
)
const close = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)
const check = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12 5 5L20 7" />
  </svg>
)
const arrow = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
)
const star = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="currentColor">
    <path d="m12 2 3 7 7.5.6-5.7 4.9 1.8 7.3L12 17.8 5.4 21.8l1.8-7.3L1.5 9.6 9 9z" />
  </svg>
)
const edit = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20h4l11-11-4-4L4 16zM14 6l4 4" />
  </svg>
)
const trash = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />
  </svg>
)
const filter = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M3 5h18l-7 9v6l-4-2v-4z" />
  </svg>
)
const tv = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="4" width="18" height="12" rx="1" />
    <path d="M8 20h8" />
  </svg>
)
const phone = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="7" y="2" width="10" height="20" rx="2" />
  </svg>
)
const tablet = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="5" y="2" width="14" height="20" rx="2" />
  </svg>
)
const pc = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="4" width="18" height="12" rx="1" />
    <path d="M9 20h6M12 16v4" />
  </svg>
)

export const Icon = {
  home,
  search,
  heart,
  heartFill,
  user,
  card,
  gift,
  play,
  plus,
  flag,
  film,
  shield,
  chart,
  org,
  db,
  list,
  logout,
  close,
  check,
  arrow,
  star,
  edit,
  trash,
  filter,
  device: { tv, phone, tablet, pc },
}

export type IconComponent = (p: IconProps) => ReactElement
