import { useId, useRef, useState, type ReactNode } from 'react';
import { Button } from './core.js';
import { Icon } from './Icon.js';
import { Logo } from './Logo.js';

export interface NavigationItem { label: string; href: string }
export interface NavigationProps { items: NavigationItem[]; activeHref?: string; logo?: ReactNode; homeHref?: string }
export function Navigation({ items, activeHref, logo, homeHref = '#' }: NavigationProps) {
  const [open, setOpen] = useState(false); const menuId = useId(); const toggleRef = useRef<HTMLButtonElement>(null);
  return <nav className="tw-nav" aria-label="Main navigation" onKeyDown={(event) => { if (event.key === 'Escape' && open) { setOpen(false); toggleRef.current?.focus(); } }}><a className="tw-nav__brand" href={homeHref} aria-label="Tinker Works home">{logo ?? <Logo variant="compact" />}</a><button ref={toggleRef} className="tw-nav__toggle" type="button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls={menuId} onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'} /></button><div className="tw-nav__items" id={menuId} data-open={open}>{items.map((item) => <a key={item.href} href={item.href} aria-current={activeHref === item.href ? 'page' : undefined} onClick={() => setOpen(false)}>{item.label}<span aria-hidden="true">↗</span></a>)}</div></nav>;
}

export interface PaginationProps { page: number; totalPages: number; onPageChange: (page: number) => void }
export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const total = Math.max(1, Math.floor(totalPages)); const current = Math.min(total, Math.max(1, Math.floor(page)));
  return <nav className="tw-pagination" aria-label="Pagination"><Button variant="secondary" size="sm" disabled={current <= 1} aria-label="Previous page" onClick={() => onPageChange(current - 1)}><Icon name="arrow-left" size={18} /></Button><span className="tw-pagination__index" aria-live="polite" aria-atomic="true"><span className="tw-sr-only">Page </span>{String(current).padStart(2, '0')}<span className="tw-pagination__divider" aria-hidden="true"> / </span><span className="tw-sr-only"> of </span>{String(total).padStart(2, '0')}</span><Button variant="secondary" size="sm" disabled={current >= total} aria-label="Next page" onClick={() => onPageChange(current + 1)}><Icon name="arrow-right" size={18} /></Button></nav>;
}
