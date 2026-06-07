import { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';
import type { Location } from '../data/mockData';

interface AddressSelectorProps {
  locations: Location[];
  selectedLocation: Location | null;
  onSelectLocation: (location: Location) => void;
}

export default function AddressSelector({
  locations,
  selectedLocation,
  onSelectLocation,
}: AddressSelectorProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!selectedLocation) return null;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm transition-all hover:shadow-md"
        style={{
          backgroundColor: '#e6faf5',
          color: '#0d9488',
          fontFamily: 'Afacad Flux, sans-serif',
        }}
      >
        <MapPin size={14} strokeWidth={2} />
        <span className="max-w-[180px] truncate">{selectedLocation.address}</span>
        <ChevronDown
          size={16}
          strokeWidth={2}
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-2 w-72 rounded-2xl shadow-xl z-50 overflow-hidden border"
          style={{ backgroundColor: 'white', borderColor: '#f3f4f6' }}
        >
          <div
            className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider"
            style={{
              color: '#6b7280',
              fontFamily: 'Afacad Flux, sans-serif',
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #f3f4f6',
            }}
          >
            Seleziona ubicazione
          </div>

          <div className="max-h-64 overflow-y-auto">
            {locations.map(location => {
              const isSelected = location.id === selectedLocation.id;
              const hiveCount = location.hives.length;

              return (
                <button
                  key={location.id}
                  onClick={() => {
                    onSelectLocation(location);
                    setOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 flex items-start gap-3"
                  style={{
                    backgroundColor: isSelected ? '#f5f0f8' : 'transparent',
                  }}
                >
                  <div
                    className="mt-0.5 rounded-lg p-1.5 flex-shrink-0"
                    style={{ backgroundColor: isSelected ? '#e9d5ff' : '#f3f4f6' }}
                  >
                    <MapPin
                      size={12}
                      strokeWidth={2.5}
                      color={isSelected ? '#6B2D8C' : '#9ca3af'}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-semibold text-sm"
                        style={{
                          color: isSelected ? '#6B2D8C' : '#374151',
                          fontFamily: 'Comfortaa, sans-serif',
                        }}
                      >
                        {location.name}
                      </span>
                      {isSelected && (
                        <Check size={14} strokeWidth={2.5} color="#6B2D8C" />
                      )}
                    </div>
                    <p
                      className="text-xs text-gray-500 mt-0.5"
                      style={{ fontFamily: 'Afacad Flux, sans-serif' }}
                    >
                      {location.address}
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: '#6b7280', fontFamily: 'Afacad Flux, sans-serif' }}
                    >
                      {hiveCount} {hiveCount === 1 ? 'alveare' : 'alveari'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {locations.length === 0 && (
            <div
              className="px-4 py-6 text-center text-sm text-gray-400"
              style={{ fontFamily: 'Afacad Flux, sans-serif' }}
            >
              Nessuna ubicazione registrata
            </div>
          )}
        </div>
      )}
    </div>
  );
}
