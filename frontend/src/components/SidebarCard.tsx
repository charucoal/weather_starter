import { useStore } from '../state/store';
import { CloseIcon, CloudIcon, HomeIcon } from './icons';
import { formatTemperature, formatTime } from './format';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { Location } from '../types';

interface SidebarCardProps {
  location: Location;
  isHome: boolean;
}

export function SidebarCard({ location, isHome }: SidebarCardProps) {
  const { selectedId, select, remove } = useStore();
  const isSelected = selectedId === location.id;
  const observed = formatTime(location.weather.observed_at);
  const area =
    location.weather.area || `${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)}`;
  const condition = location.weather.condition || '-';
  const temperature = formatTemperature(location.weather.temperature_c);
  const high = formatTemperature(location.weather.forecast_high_c);
  const low = formatTemperature(location.weather.forecast_low_c);

  const onSelect = () => select(location.id);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  };
  const onDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    void remove(location.id);
  };
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      aria-pressed={isSelected}
      className={`relative w-full cursor-pointer overflow-hidden rounded-[var(--radius-card)] border text-left shadow-[var(--card-shadow)] backdrop-blur-[var(--surface-blur)] transition ${
        isSelected
          ? 'border-[var(--location-card-selected-border)] bg-[var(--location-card-selected-bg)] shadow-[var(--location-card-shadow-selected)]'
          : 'border-[var(--location-card-border)] bg-[var(--location-card-bg)] hover:bg-[var(--location-card-bg-hover)]'
      }`}
    >
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Remove ${area}`}
        className="absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full text-[var(--text-faint)] transition hover:bg-[var(--surface-border)] hover:text-[var(--text-primary)]"
      >
        <CloseIcon className="h-3 w-3" />
      </button>
      <div className="flex items-start justify-between gap-3 px-4 pt-3">
        <div className="min-w-0">
          <div className="truncate text-lg font-semibold leading-tight text-[var(--text-primary)]">
            {area}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[var(--text-tertiary)]">
            {isHome ? (
              <>
                <span>My Location</span>
                <span className="text-[var(--text-faint)]">·</span>
                <HomeIcon className="h-3 w-3" />
                <span>Home</span>
              </>
            ) : observed ? (
              <span>{observed}</span>
            ) : (
              <span className="text-[var(--text-faint)]">Not refreshed</span>
            )}
          </div>
        </div>
        <div className="pr-5 text-3xl font-light tabular-nums text-[var(--text-secondary)]">
          {temperature}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-[var(--divider)] px-4 py-2 text-xs">
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <CloudIcon className="h-4 w-4 text-[var(--text-tertiary)]" />
          <span>{condition}</span>
        </div>
        <div className="text-[var(--text-tertiary)] tabular-nums">
          H:{high} L:{low}
        </div>
      </div>
    </div>
  );
}
