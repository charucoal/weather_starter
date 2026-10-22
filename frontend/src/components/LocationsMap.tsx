import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { formatTemperature } from './format';
import type { Location } from '../types';

const SINGAPORE_CENTER: [number, number] = [1.3521, 103.8198];
const DEFAULT_ZOOM = 11;
const FIT_BOUNDS_MAX_ZOOM = 13;
const DOT_SIZE = 14;

interface LocationsMapProps {
  locations: Location[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  interactive: boolean;
  className?: string;
}

function areaLabel(location: Location): string {
  return location.weather.area || `${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)}`;
}

function dotIcon(isSelected: boolean): L.DivIcon {
  const dotClass = isSelected ? 'bg-sky-400' : 'bg-white';
  return L.divIcon({
    html: `<div class="h-full w-full rounded-full border-2 border-white/90 shadow shadow-black/40 ${dotClass}"></div>`,
    className: '',
    iconSize: [DOT_SIZE, DOT_SIZE],
    iconAnchor: [DOT_SIZE / 2, DOT_SIZE / 2],
  });
}

function FitBounds({ locations }: { locations: Location[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length === 0) {
      map.setView(SINGAPORE_CENTER, DEFAULT_ZOOM);
      return;
    }
    const bounds = L.latLngBounds(locations.map((l) => [l.latitude, l.longitude]));
    map.fitBounds(bounds, { padding: [32, 32], maxZoom: FIT_BOUNDS_MAX_ZOOM });
  }, [map, locations]);

  return null;
}

export function LocationsMap({
  locations,
  selectedId,
  onSelect,
  interactive,
  className = '',
}: LocationsMapProps) {
  return (
    <MapContainer
      center={SINGAPORE_CENTER}
      zoom={DEFAULT_ZOOM}
      className={className}
      dragging={interactive}
      scrollWheelZoom={interactive}
      zoomControl={interactive}
      doubleClickZoom={interactive}
      touchZoom={interactive}
      attributionControl={interactive}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FitBounds locations={locations} />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
          icon={dotIcon(location.id === selectedId)}
          eventHandlers={{ click: () => onSelect(location.id) }}
        >
          <Tooltip className="weather-marker-label" direction="top" offset={[0, -DOT_SIZE / 2]} permanent>
            {areaLabel(location)} &middot; {formatTemperature(location.weather.temperature_c)}
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
