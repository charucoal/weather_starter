import { useEffect, useState } from 'react';
import { useStore } from '../state/store';
import { LocationsMap } from './LocationsMap';
import { TileShell } from './Tiles';
import { CloseIcon, ExpandIcon, LocationIcon } from './icons';

export function MapTile() {
  const { locations, selectedId, select } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isExpanded) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsExpanded(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isExpanded]);

  return (
    <>
      <TileShell
        icon={<LocationIcon className="h-3.5 w-3.5" />}
        title="Map"
        className="col-span-2"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs text-[var(--text-tertiary)]">
            {locations.length} location{locations.length === 1 ? '' : 's'}
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            aria-label="Expand map"
            className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--text-tertiary)] transition hover:bg-[var(--divider)] hover:text-[var(--text-primary)]"
          >
            <ExpandIcon />
          </button>
        </div>
        {locations.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-[var(--surface-border)] bg-[var(--divider)] text-center text-xs text-[var(--text-faint)]">
            Add a location to see it on the map.
          </div>
        ) : isExpanded ? (
          <div className="h-40 w-full rounded-xl bg-[var(--divider)]" />
        ) : (
          <LocationsMap
            locations={locations}
            selectedId={selectedId}
            onSelect={select}
            interactive={false}
            className="h-40 w-full overflow-hidden rounded-xl"
          />
        )}
      </TileShell>

      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="relative flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--surface-border)] bg-[var(--surface-bg)] p-4 shadow-[var(--card-shadow)] backdrop-blur-[var(--surface-blur)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="label-caps text-sm font-semibold tracking-[0.14em] text-[var(--text-tertiary)]">
                Map
              </h2>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                aria-label="Close map"
                className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--text-tertiary)] transition hover:bg-[var(--divider)] hover:text-[var(--text-primary)]"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden rounded-xl">
              <LocationsMap
                locations={locations}
                selectedId={selectedId}
                onSelect={select}
                interactive={true}
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
