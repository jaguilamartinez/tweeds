import type { CSSProperties } from 'react';
import { MathMark, ThemeProvider, useReveal } from '@tinker-works/ui';
import './math-mark-study.css';

const examples = [
  { symbol: 'plus', tone: 'orange', name: 'Plus', caption: 'Equal arms and square ends.' },
  { symbol: 'minus', tone: 'lime', name: 'Minus', caption: 'Lime on charcoal keeps the shape clear.' },
  { symbol: 'asterisk', tone: 'orange', name: 'Asterisk', caption: 'A filled asterisk with square ends.' },
] as const;

const at = (milliseconds: number) => ({ '--tw-reveal-at': `${milliseconds}ms` }) as CSSProperties;

function SpecimenDrawing({ symbol, tone, delay }: { symbol: 'plus' | 'minus' | 'asterisk'; tone: 'orange' | 'lime'; delay: number }) {
  return (
    <div className="pb-math-mark-study__drawing" aria-hidden="true">
      <span className="pb-math-mark-study__bounds" />
      <MathMark symbol={symbol} tone={tone} size={128} className="tw-register" style={at(delay)} />
    </div>
  );
}

/** Brand-graphic examples shared by the playbook and component reference. */
export function MathMarkStudy() {
  const reveal = useReveal<HTMLDivElement>({ threshold: 0.3 });
  return (
    <div className="pb-math-mark-study" ref={reveal.ref}>
      <div className="pb-math-mark-study__specimens">
        {examples.map(({ symbol, tone, name, caption }, index) => (
          <figure key={symbol}>
            {symbol === 'minus'
              ? <ThemeProvider theme="ink"><SpecimenDrawing symbol={symbol} tone={tone} delay={index * 140} /></ThemeProvider>
              : <SpecimenDrawing symbol={symbol} tone={tone} delay={index * 140} />}
            <figcaption><h3>{name}</h3><p>{caption}</p></figcaption>
          </figure>
        ))}
      </div>
      <div className="pb-math-mark-study__editorial">
        <MathMark symbol="asterisk" tone="orange" size={120} className="tw-register" style={at(520)} />
        <div><h3>Working notes</h3><p>Keep the drawings and observations behind each change.</p></div>
      </div>
    </div>
  );
}
