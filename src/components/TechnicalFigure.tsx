import type { HTMLAttributes, ReactNode, Ref } from 'react';

export interface TechnicalFigureProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  caption?: ReactNode;
  figure?: string;
  ref?: Ref<HTMLElement>;
}

/** A shared frame for caller-owned artwork, images, and explanatory content. */
export function TechnicalFigure({ children, caption, figure = 'FIG. 001', className = '', ...props }: TechnicalFigureProps) {
  return (
    <figure className={`tw-figure ${className}`} {...props}>
      <div className="tw-figure__content">{children}</div>
      {caption != null && (
        <figcaption className="tw-figure__caption">
          {figure && <span className="tw-figure__number">{figure}</span>}
          <div className="tw-figure__caption-body">{caption}</div>
        </figcaption>
      )}
    </figure>
  );
}
