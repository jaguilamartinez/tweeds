import { useId, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { Icon } from './Icon.js';
import { useReveal } from '../motion.js';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary' | 'tertiary' | 'signal'; size?: 'sm' | 'md' | 'lg'; loading?: boolean; icon?: ReactNode; ref?: Ref<HTMLButtonElement> }
export function Button({ variant = 'primary', size = 'md', loading = false, icon, children, disabled, className = '', type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={`tw-button tw-button--${variant} tw-button--${size} ${className}`} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>{loading && <Spinner />}<span className="tw-button__label">{children}</span>{!loading && icon && <span className="tw-button__icon" aria-hidden="true">{icon}</span>}</button>;
}

/** A ticking asterisk: three bars turn a sixth of a revolution at a time, like clockwork. */
function Spinner() {
  return <svg className="tw-spinner" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path className="tw-spinner__asterisk" d="M8 1.5v13M2.37 4.75l11.26 6.5M2.37 11.25l11.26-6.5" />
    <circle className="tw-spinner__ring" cx="8" cy="8" r="6.25" />
  </svg>;
}

export interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> { arrow?: boolean }
export function TextLink({ arrow = true, className = '', children, ...props }: TextLinkProps) {
  return <a className={`tw-text-link ${className}`} {...props}><span className="tw-text-link__label">{children}</span>{arrow && <Icon name="arrow-up-right" size={17} />}</a>;
}

export interface TagProps extends HTMLAttributes<HTMLSpanElement> { tone?: 'neutral' | 'orange' | 'lime'; status?: boolean }
export function Tag({ tone = 'neutral', status = false, className = '', children, ...props }: TagProps) {
  return <span className={`tw-tag tw-tag--${tone} ${className}`} {...props}>{status && <span className="tw-tag__status" aria-hidden="true" />}{children}</span>;
}

export interface CardProps extends HTMLAttributes<HTMLElement> {}
export function Card({ className = '', children, ...props }: CardProps) {
  return <article className={`tw-card ${className}`} {...props}>{children}</article>;
}

export interface AlertProps extends HTMLAttributes<HTMLDivElement> { tone?: 'info' | 'error' | 'success'; title: string }
export function Alert({ tone = 'info', title, children, className = '', ...props }: AlertProps) {
  const titleId = useId();
  const reveal = useReveal<HTMLDivElement>();
  return <div ref={reveal.ref} className={`tw-alert tw-alert--${tone} ${className}`} role={tone === 'error' ? 'alert' : 'status'} aria-labelledby={titleId} {...props}><span className="tw-alert__mark tw-register" aria-hidden="true">{tone === 'success' ? <Icon name="check" size={18} /> : tone === 'error' ? '!' : 'i'}</span><div><p className="tw-alert__title" id={titleId}>{title}</p>{children && <div className="tw-alert__body">{children}</div>}</div></div>;
}

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> { title: string; action?: ReactNode }
export function EmptyState({ title, children, action, className = '', ...props }: EmptyStateProps) {
  const reveal = useReveal<HTMLSpanElement>();
  return <div className={`tw-empty-state ${className}`} {...props}><span ref={reveal.ref} className="tw-empty-state__mark" aria-hidden="true"><Icon name="layers" size={30} className="tw-draft" /></span><h3>{title}</h3>{children && <div className="tw-empty-state__body">{children}</div>}{action && <div className="tw-empty-state__action">{action}</div>}</div>;
}
