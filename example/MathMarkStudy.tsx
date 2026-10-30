import { MathMark, ThemeProvider } from '@tinker-works/ui';
import './math-mark-study.css';

const examples = [
  { symbol: 'plus', tone: 'orange', name: 'Plus', caption: 'Equal arms and square ends.' },
  { symbol: 'minus', tone: 'lime', name: 'Minus', caption: 'Lime on charcoal keeps the shape clear.' },
  { symbol: 'asterisk', tone: 'orange', name: 'Asterisk', caption: 'A filled asterisk with square ends.' },
] as const;

function SpecimenDrawing({ symbol, tone }: { symbol: 'plus' | 'minus' | 'asterisk'; tone: 'orange' | 'lime' }) {
  return (
    <div className="pb-math-mark-study__drawing" aria-hidden="true">
      <span className="pb-math-mark-study__bounds" />
      <MathMark symbol={symbol} tone={tone} size={128} />
    </div>
  );
}

/** Brand-graphic examples shared by the playbook and component reference. */
export function MathMarkStudy() {
  return (
    <div className="pb-math-mark-study">
      <div className="pb-math-mark-study__specimens">
        {examples.map(({ symbol, tone, name, caption }) => (
          <figure key={symbol}>
            {symbol === 'minus'
              ? <ThemeProvider theme="ink"><SpecimenDrawing symbol={symbol} tone={tone} /></ThemeProvider>
              : <SpecimenDrawing symbol={symbol} tone={tone} />}
            <figcaption><h3>{name}</h3><p>{caption}</p></figcaption>
          </figure>
        ))}
      </div>
      <div className="pb-math-mark-study__editorial">
        <MathMark symbol="asterisk" tone="orange" size={120} />
        <div><h3>Working notes</h3><p>Keep the drawings and observations behind each change.</p></div>
      </div>
    </div>
  );
}
