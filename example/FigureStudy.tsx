import { useId } from 'react';
import { useReveal } from '@tinker-works/ui';

/** An authored drawing for documentation examples, separate from the UI library. Pass drafted={false} when a surrounding root already reveals it. */
export function FigureStudy({ drafted = true }: { drafted?: boolean }) {
  const id = useId();
  const reveal = useReveal<SVGSVGElement>({ threshold: 0.4 });
  const titleId = `${id}-title`;
  const gridId = `${id}-grid`;

  return (
    <svg ref={drafted ? reveal.ref : undefined} viewBox="0 0 640 360" role="img" aria-labelledby={titleId} focusable="false">
      <title id={titleId}>Two interface regions joined by a highlighted connection, with alignment guides and selected content.</title>
      <defs>
        <pattern id={gridId} width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r=".65" fill="currentColor" />
        </pattern>
      </defs>
      <rect x="24" y="24" width="592" height="312" fill={`url(#${gridId})`} opacity=".2" />
      <g className="tw-draft" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <g opacity=".35" strokeWidth=".8" strokeDasharray="8 4 2 4">
          <path d="M42 72H598M42 280H598M80 38V322M320 38V322M560 38V322" />
          <path d="m72 62 182 1m132-1 182 1" />
        </g>

        <path d="M79 73 163 71.8 246 73.3 245.6 280 80 280.8Z" fill="var(--tw-color-bg)" />
        <path d="M77 69.5 182 70.4 248 72M248 78 247.6 279 192 283" opacity=".5" strokeWidth=".7" />
        <path d="M80 103H246M96 88H132M210 88H231M96 124H178M96 141H215M96 158H203" />
        <path d="M92 181 232 179.6 234 216 93 217.4Z" fill="var(--tw-color-discovery)" fillOpacity=".75" stroke="none" />
        <path d="M96 190H181M96 204H161" stroke="var(--tw-color-ink)" />
        <path d="M96 240H215M96 254H189" />
        <path d="M100 270 109 279M109 270 118 279M118 270 127 279" opacity=".6" strokeWidth=".8" />

        <path d="M394 73 478 72.2 560.5 73 559.4 280.6 394 279.8Z" fill="var(--tw-color-bg)" />
        <path d="M391 70.5 494 70 563 72M562.8 79 562 281 510 283" opacity=".5" strokeWidth=".7" />
        <path d="M394 103H560M410 88H451M528 88H545M410 124H499M410 139H475" />
        <path d="M410 159 543 158.6 543.3 243 410 243.8Z" />
        <path d="M420 231C434 220 436 199 450 205S470 218 483 194 512 197 531 173" />
        <path d="M420 169V232H532" opacity=".45" strokeDasharray="3 4" />
        <path d="M410 262H457M514 262H543" />

        <path d="M247 199C280 200 273 162 319 162S354 199 393 199" stroke="var(--tw-color-accent)" strokeWidth="2" />
        <path d="M250 203C282 205 279 168 319 166S355 203 391 202" strokeWidth=".65" opacity=".5" />
        <path d="m384 193 10 6-10 6" stroke="var(--tw-color-accent)" strokeWidth="1.8" />
        <circle cx="246" cy="199" r="4.5" fill="var(--tw-color-accent)" />
        <circle cx="320" cy="162" r="5" fill="var(--tw-color-bg)" />
        <path d="M306 162H314M326 162H334M320 148V156M320 168V176" strokeWidth=".8" />
        <path d="M312 139C331 128 348 128 359 138M357 130l3 8-9-1" opacity=".7" strokeWidth=".8" />

        <g opacity=".65" strokeWidth=".8">
          <path d="M69 72H89M79 62V82M550 280H570M560 270V290" />
          <path d="M80 300H246M80 295V305M246 295V305M394 300H560M394 295V305M560 295V305" />
          <path d="M236 218 261 242H284M404 159 379 131H362" />
        </g>
      </g>
    </svg>
  );
}
