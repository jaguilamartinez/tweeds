import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  label?: string;
}

export function Tabs({ items, defaultValue, value, onValueChange, label = 'Sections' }: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? items[0]?.id);
  const baseId = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const requestedValue = value ?? uncontrolledValue;
  const selected = items.find(item => item.id === requestedValue)?.id ?? items[0]?.id;

  useEffect(() => {
    // Commit a visible fallback so reordering cannot revive an obsolete value.
    // An empty loading interval keeps the last selection until items return.
    if (value === undefined && selected !== undefined && selected !== uncontrolledValue) {
      setUncontrolledValue(selected);
    }
  }, [value, selected, uncontrolledValue]);

  function select(id: string) {
    if (value === undefined) setUncontrolledValue(id);
    onValueChange?.(id);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let target: number;
    switch (event.key) {
      case 'ArrowRight': target = (index + 1) % items.length; break;
      case 'ArrowLeft': target = (index - 1 + items.length) % items.length; break;
      case 'Home': target = 0; break;
      case 'End': target = items.length - 1; break;
      default: return;
    }
    event.preventDefault();
    refs.current[target]?.focus();
    select(items[target].id);
  }

  function itemId(id: string) {
    return `${baseId}-${encodeURIComponent(id)}`;
  }

  if (!items.length) return null;

  return (
    <div className="tw-tabs">
      <div className="tw-tabs__list" role="tablist" aria-label={label}>
        {items.map((item, index) => {
          const id = itemId(item.id);
          return (
            <button
              key={item.id}
              ref={node => { refs.current[index] = node; }}
              type="button"
              role="tab"
              id={`${id}-tab`}
              aria-controls={`${id}-panel`}
              aria-selected={selected === item.id}
              tabIndex={selected === item.id ? 0 : -1}
              className="tw-tabs__tab"
              onClick={() => select(item.id)}
              onKeyDown={event => handleKeyDown(event, index)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map(item => {
        const id = itemId(item.id);
        return (
          <div
            key={item.id}
            role="tabpanel"
            id={`${id}-panel`}
            aria-labelledby={`${id}-tab`}
            className="tw-tabs__panel"
            tabIndex={0}
            hidden={selected !== item.id}
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
}
