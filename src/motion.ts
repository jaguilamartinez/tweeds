import { useCallback, useRef, type RefCallback } from 'react';

export interface RevealOptions {
  /** Fraction of the root that must be visible before its verbs play. */
  threshold?: number;
}

export interface Reveal<T extends Element> {
  /** Attach to the reveal root that contains `tw-draft`, `tw-mark`, and the other verb classes. */
  ref: RefCallback<T>;
  /** Plays the drafting sequence again from its first frame. */
  replay: () => void;
}

const shapes = 'path, line, polyline, polygon, circle, ellipse, rect';
const leafVerbs = '.tw-mark, .tw-register, .tw-measure, .tw-type';

type Geometry = SVGGraphicsElement & Pick<SVGGeometryElement, 'getTotalLength' | 'getPointAtLength'>;
const isGeometry = (element: Element): element is Geometry => typeof (element as Geometry).getTotalLength === 'function';

function motionAllowed(element: Element) {
  return typeof IntersectionObserver === 'function'
    && typeof element.getAnimations === 'function'
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    && !element.closest('[data-tw-motion="off"]');
}

/** Length of the stroke as it is dashed. A non-scaling stroke is dashed in screen space. */
function strokeLength(shape: Geometry, style: CSSStyleDeclaration) {
  const length = shape.getTotalLength();
  const matrix = style.vectorEffect === 'non-scaling-stroke' ? shape.getScreenCTM() : null;
  if (!matrix) return length;
  const steps = Math.min(64, Math.max(8, Math.ceil(length / 4)));
  let total = 0;
  let previous = shape.getPointAtLength(0).matrixTransform(matrix);
  for (let step = 1; step <= steps; step += 1) {
    const point = shape.getPointAtLength(length * step / steps).matrixTransform(matrix);
    total += Math.hypot(point.x - previous.x, point.y - previous.y);
    previous = point;
  }
  // Sampling cuts corners; a slightly long dash only delays the pen.
  return total * 1.02 + 1;
}

/** Marks each shape in a `tw-draft` group to be drawn or faded, in document order. */
function prepareStrokes(root: Element) {
  for (const group of root.querySelectorAll('.tw-draft')) {
    const members = group.matches(shapes) ? [group] : [...group.querySelectorAll(shapes)];
    let order = 0;
    for (const shape of members) {
      if (shape.closest('.tw-draft') !== group) continue;
      const verb = shape.closest(leafVerbs);
      if (verb && group.contains(verb)) continue;
      const style = getComputedStyle(shape);
      const target = shape as SVGElement;
      // Classify once: while a verb is held on its first frame, the computed dash is the animated one.
      const drawn = target.dataset.twStroke
        ? target.dataset.twStroke === 'draw'
        : isGeometry(shape) && style.stroke !== 'none' && style.stroke !== '' && style.strokeDasharray === 'none';
      target.dataset.twStroke = drawn ? 'draw' : 'fade';
      target.style.setProperty('--tw-reveal-order', String(order++));
      if (drawn && isGeometry(shape)) target.style.setProperty('--tw-stroke-length', `${strokeLength(shape, style).toFixed(1)}px`);
    }
  }
}

function verbAnimations(root: Element) {
  return root.getAnimations({ subtree: true })
    .filter(animation => typeof CSSAnimation === 'function' && animation instanceof CSSAnimation && animation.animationName.startsWith('tw-'));
}

/**
 * Plays the drafting verbs inside a root once, when it scrolls into view, then leaves the
 * authored drawing at rest. Reduced motion, print, and a `motion="off"` theme show the still image.
 */
export function useReveal<T extends Element>({ threshold = 0.2 }: RevealOptions = {}): Reveal<T> {
  const node = useRef<T | null>(null);
  const run = useRef(0);

  const play = useCallback((element: T) => {
    const current = ++run.current;
    prepareStrokes(element);
    element.setAttribute('data-tw-reveal', 'play');
    void Promise.allSettled(verbAnimations(element).map(animation => animation.finished)).then(() => {
      if (run.current === current && element.getAttribute('data-tw-reveal') === 'play') element.setAttribute('data-tw-reveal', 'done');
    });
  }, []);

  const ref = useCallback((element: T | null) => {
    node.current = element;
    if (!element || !motionAllowed(element)) return;
    prepareStrokes(element);
    element.setAttribute('data-tw-reveal', 'pending');
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      play(element);
    }, { threshold });
    observer.observe(element);
    return () => {
      observer.disconnect();
      run.current += 1;
      element.removeAttribute('data-tw-reveal');
    };
  }, [play, threshold]);

  const replay = useCallback(() => {
    const element = node.current;
    if (!element || !motionAllowed(element)) return;
    // Remove the verbs and read them back so the next run starts from its first frame.
    element.setAttribute('data-tw-reveal', 'done');
    verbAnimations(element);
    play(element);
  }, [play]);

  return { ref, replay };
}
