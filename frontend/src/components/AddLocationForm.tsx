import { useState } from 'react';
import type { FormEvent } from 'react';
import { useStore } from '../state/store';
import { PlusIcon } from './icons';

export function AddLocationForm() {
  const { isAdding, setAdding, create } = useStore();
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const cancel = () => {
    setLatitude('');
    setLongitude('');
    setSubmitError(null);
    setAdding(false);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await create({ latitude: Number(latitude), longitude: Number(longitude) });
      setLatitude('');
      setLongitude('');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not add location');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAdding) {
    return (
      <button
        type="button"
        onClick={() => setAdding(true)}
        className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-card)] border border-[var(--surface-border)] bg-[var(--location-card-bg)] px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] backdrop-blur-[var(--surface-blur)] hover:bg-[var(--location-card-bg-hover)]"
      >
        <PlusIcon />
        <span>Add Location</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-2.5 rounded-[var(--radius-card)] border border-[var(--surface-border)] bg-[var(--surface-bg)] p-3 shadow-[var(--card-shadow)] backdrop-blur-[var(--surface-blur)]"
    >
      <p className="label-caps text-[11px] font-semibold tracking-[0.14em] text-[var(--text-tertiary)]">
        New coordinate
      </p>
      <div className="grid grid-cols-2 gap-2">
        <label className="grid gap-1">
          <span className="text-[11px] text-[var(--text-tertiary)]">Latitude</span>
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="1.3508"
            required
            className="rounded-md border border-[var(--surface-border)] bg-[var(--surface-bg)] px-2 py-1.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)]"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-[11px] text-[var(--text-tertiary)]">Longitude</span>
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="103.8390"
            required
            className="rounded-md border border-[var(--surface-border)] bg-[var(--surface-bg)] px-2 py-1.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)]"
          />
        </label>
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={cancel}
          className="rounded-md px-2.5 py-1.5 text-xs font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Adding…' : 'Add'}
        </button>
      </div>
      {submitError && (
        <p className="rounded-md border border-[var(--error-border)] bg-[var(--error-bg)] px-2.5 py-1.5 text-xs text-[var(--error-text)]">
          {submitError}
        </p>
      )}
    </form>
  );
}
