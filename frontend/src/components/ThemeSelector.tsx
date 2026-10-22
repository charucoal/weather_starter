import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../state/theme';
import { CheckIcon, ChevronDownIcon } from './icons';

export function ThemeSelector() {
  const { themeId, themes, setThemeId } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTheme = themes.find((theme) => theme.id === themeId);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="fixed right-4 top-4 z-40">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 rounded-full border border-[var(--surface-border)] bg-[var(--surface-bg)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] backdrop-blur-[var(--surface-blur)] hover:bg-[var(--location-card-bg-hover)]"
      >
        <span>{activeTheme?.label ?? 'Theme'}</span>
        <ChevronDownIcon className={`h-3.5 w-3.5 transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 min-w-[9rem] overflow-hidden rounded-[var(--radius-card)] border border-[var(--surface-border)] bg-[var(--surface-bg)] p-1 shadow-[var(--card-shadow)] backdrop-blur-[var(--surface-blur)]"
        >
          {themes.map((theme) => {
            const isActive = theme.id === themeId;
            return (
              <li key={theme.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    setThemeId(theme.id);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-1.5 text-left text-xs ${
                    isActive
                      ? 'bg-[var(--location-card-bg-hover)] text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--location-card-bg-hover)]'
                  }`}
                >
                  <span>{theme.label}</span>
                  {isActive && <CheckIcon className="h-3.5 w-3.5" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
