import { useEffect, useRef, type RefObject } from 'react';

const finePointer = '(hover: hover) and (pointer: fine)';
const reducedMotion = '(prefers-reduced-motion: reduce)';

/**
 * Tracks a fine pointer over a drawing sheet. Sets --pb-pointer-x/y in pixels and, unless
 * reduced motion is requested, --pb-tilt-x/y from -1 to 1 for depth. Touch input is ignored.
 */
export function usePointerField<T extends HTMLElement>(field: RefObject<T | null>, { tilt = false } = {}) {
  useEffect(() => {
    const element = field.current;
    if (!element || !window.matchMedia(finePointer).matches) return;
    const depth = tilt && !window.matchMedia(reducedMotion).matches;
    let frame = 0;
    let latest: PointerEvent | null = null;
    const draw = () => {
      frame = 0;
      if (!latest) return;
      const bounds = element.getBoundingClientRect();
      const x = latest.clientX - bounds.left;
      const y = latest.clientY - bounds.top;
      element.style.setProperty('--pb-pointer-x', `${x.toFixed(1)}px`);
      element.style.setProperty('--pb-pointer-y', `${y.toFixed(1)}px`);
      if (depth) {
        element.style.setProperty('--pb-tilt-x', (x / bounds.width * 2 - 1).toFixed(3));
        element.style.setProperty('--pb-tilt-y', (y / bounds.height * 2 - 1).toFixed(3));
      }
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      latest = event;
      element.dataset.pointer = 'in';
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const leave = () => {
      element.dataset.pointer = 'out';
      element.style.setProperty('--pb-tilt-x', '0');
      element.style.setProperty('--pb-tilt-y', '0');
    };
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', leave);
    };
  }, [field, tilt]);
}

const coordinate = (value: number) => `${value < 0 ? '−' : ''}${String(Math.abs(Math.round(value))).padStart(4, '0')}`;

/**
 * Shows the pointer position on the sheet in pixels from the content origin, and moves a
 * marker along the ruler. The readout is decorative; it is hidden from assistive technology.
 */
export function CursorReadout({ sheet, origin, ruler }: { sheet: RefObject<HTMLElement | null>; origin: RefObject<HTMLElement | null>; ruler: RefObject<HTMLElement | null> }) {
  const x = useRef<HTMLElement>(null);
  const y = useRef<HTMLElement>(null);
  useEffect(() => {
    const area = sheet.current;
    if (!area || !window.matchMedia(finePointer).matches) return;
    let frame = 0;
    let latest: PointerEvent | null = null;
    const draw = () => {
      frame = 0;
      const content = origin.current;
      const scale = ruler.current;
      if (!latest || !content || !scale) return;
      const bounds = content.getBoundingClientRect();
      const style = getComputedStyle(content);
      const left = bounds.left + parseFloat(style.paddingLeft);
      if (x.current) x.current.textContent = coordinate(latest.clientX - left);
      if (y.current) y.current.textContent = coordinate(latest.clientY - bounds.top - parseFloat(style.paddingTop));
      scale.style.setProperty('--pb-ruler-x', `${(latest.clientX - scale.getBoundingClientRect().left).toFixed(1)}px`);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      latest = event;
      if (ruler.current) ruler.current.dataset.pointer = 'in';
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const leave = () => { if (ruler.current) ruler.current.dataset.pointer = 'out'; };
    area.addEventListener('pointermove', move);
    area.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(frame);
      area.removeEventListener('pointermove', move);
      area.removeEventListener('pointerleave', leave);
    };
  }, [sheet, origin, ruler]);

  return <span className="pb-readout" aria-hidden="true">
    <span>X <b ref={x}>0000</b></span>
    <span>Y <b ref={y}>0000</b></span>
  </span>;
}
