import { useState, useRef, useEffect, useMemo } from 'react';
import {
  MapPin, ChevronDown, Check, AlertTriangle, ShieldCheck, Bug,
  Calendar, ChevronLeft, ChevronRight, Camera, FlaskConical, AlertCircle
} from 'lucide-react';
import { mockLocations, varroaHistory } from '../data/mockData';
import type { Location, Hive, VarroaDetection } from '../data/mockData';

const DAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

function formatDateCard(date: Date): { day: string; num: string } {
  return {
    day: DAYS_SHORT[date.getDay()],
    num: String(date.getDate()).padStart(2, '0'),
  };
}

export default function DailyReport() {
  // Location and hive selection
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(mockLocations[0] ?? null);
  const [selectedHive, setSelectedHive] = useState<Hive | null>(
    mockLocations[0]?.hives[0] ?? null
  );
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  // Calendar state
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const calendarRef = useRef<HTMLDivElement>(null);

  // Generate days for current month
  const daysInMonth = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const days: Date[] = [];

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }

    return days;
  }, []);

  const currentPeriod = useMemo(() => {
    const str = new Date().toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
    return str.charAt(0).toUpperCase() + str.slice(1);
  }, []);

  // Scroll to selected date on mount
  useEffect(() => {
    if (calendarRef.current) {
      const todayEl = calendarRef.current.querySelector(`[data-date="${selectedDate}"]`);
      if (todayEl) {
        todayEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [selectedDate]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setLocationDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get detection data for selected hive and date
  const detectionReport = useMemo<VarroaDetection | null>(() => {
    if (!selectedHive) return null;
    const history = varroaHistory[selectedHive.id] || [];
    return history.find(d => d.date === selectedDate) || null;
  }, [selectedHive, selectedDate]);

  // Handle location change
  const handleLocationChange = (location: Location) => {
    setSelectedLocation(location);
    setSelectedHive(location.hives[0] ?? null);
    setLocationDropdownOpen(false);
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  // Check if date is today
  const isToday = (dateStr: string) => {
    return dateStr === new Date().toISOString().split('T')[0];
  };

  // Today's date string for header
  const todayStr = new Date().toLocaleDateString('it-IT', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Get varroa status for hive summary
  const getHiveVarroaStatus = (hive: Hive) => {
    const history = varroaHistory[hive.id] || [];
    const recentDetections = history.filter(d => d.detected).length;
    if (recentDetections > 5) return 'critical';
    if (recentDetections > 2) return 'warning';
    return 'healthy';
  };

  if (!selectedLocation || !selectedHive) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f7f4ef' }}>
        <p className="text-gray-400" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
          Nessun dato disponibile
        </p>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-8 pb-12 space-y-5 pt-6">
      {/* Header with Location Selector */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-gray-400 text-sm capitalize" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
            {todayStr}
          </p>
          <h1
            className="font-bold text-gray-800 text-3xl mt-1 leading-tight"
            style={{ fontFamily: 'Comfortaa, sans-serif' }}
          >
            Report Varroa
          </h1>
        </div>

        {/* Location Selector */}
        <div ref={locationDropdownRef} className="relative">
          <button
            onClick={() => setLocationDropdownOpen(prev => !prev)}
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
                transform: locationDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>

          {locationDropdownOpen && (
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
                {mockLocations.map(location => {
                  const isSelected = location.id === selectedLocation.id;

                  return (
                    <button
                      key={location.id}
                      onClick={() => handleLocationChange(location)}
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
                          {isSelected && <Check size={14} strokeWidth={2.5} color="#6B2D8C" />}
                        </div>
                        <p
                          className="text-xs text-gray-500 mt-0.5"
                          style={{ fontFamily: 'Afacad Flux, sans-serif' }}
                        >
                          {location.address}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Scrollable Calendar - AT TOP */}
      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: 'white' }}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #f3f4f6' }}>
          <div className="flex items-center gap-2">
            <Calendar size={16} color="#6B2D8C" />
            <span
              className="font-semibold text-sm"
              style={{ color: '#374151', fontFamily: 'Comfortaa, sans-serif' }}
            >
              {currentPeriod}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => calendarRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={18} color="#6b7280" />
            </button>
            <button
              onClick={() => calendarRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight size={18} color="#6b7280" />
            </button>
          </div>
        </div>

        <div
          ref={calendarRef}
          className="flex gap-2 px-4 py-3 overflow-x-auto scroll-smooth"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#e5e7eb transparent' }}
        >
          {daysInMonth.map(date => {
            const dateStr = date.toISOString().split('T')[0];
            const { day, num } = formatDateCard(date);
            const isSelected = dateStr === selectedDate;
            const isTodayDate = isToday(dateStr);

            const history = varroaHistory[selectedHive.id] || [];
            const dayDetection = history.find(d => d.date === dateStr);
            const hasDetection = dayDetection?.detected;

            const isFuture = date > new Date();

            return (
              <button
                key={dateStr}
                data-date={dateStr}
                onClick={() => !isFuture && setSelectedDate(dateStr)}
                disabled={isFuture}
                className={`flex flex-col items-center px-3 py-2 rounded-xl transition-all min-w-[52px] ${isSelected ? 'scale-105' : ''
                  } ${isFuture ? 'opacity-40 cursor-not-allowed' : ''}`}
                style={{
                  backgroundColor: isSelected ? '#6B2D8C' : isTodayDate ? '#f5f0f8' : 'transparent',
                  boxShadow: isSelected ? '0 4px 12px rgba(107, 45, 140, 0.25)' : 'none',
                }}
              >
                <span
                  className="text-xs font-medium"
                  style={{
                    color: isSelected ? 'white' : '#9ca3af',
                    fontFamily: 'Afacad Flux, sans-serif',
                  }}
                >
                  {day}
                </span>
                <span
                  className="text-base font-bold mt-0.5"
                  style={{
                    color: isSelected ? 'white' : '#374151',
                    fontFamily: 'Comfortaa, sans-serif',
                  }}
                >
                  {num}
                </span>
                {hasDetection && (
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1"
                    style={{ backgroundColor: isSelected ? 'white' : '#ef4444' }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-column layout: Hive Selector LEFT + Report RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT COLUMN - Hive Selector */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: 'white' }}>
            <div
              className="px-4 py-3"
              style={{ borderBottom: '1px solid #f3f4f6' }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: '#6b7280', fontFamily: 'Afacad Flux, sans-serif' }}
              >
                Seleziona Alveare
              </p>
            </div>

            <div className="p-2 space-y-1">
              {selectedLocation.hives.map(hive => {
                const isSelected = selectedHive.id === hive.id;
                const status = getHiveVarroaStatus(hive);

                return (
                  <button
                    key={hive.id}
                    onClick={() => {
                      setSelectedHive(hive);
                      setSelectedDate(new Date().toISOString().split('T')[0]);
                    }}
                    className="w-full flex items-center gap-3 rounded-xl px-3 py-3 transition-all text-left"
                    style={{
                      backgroundColor: isSelected ? '#f5f0f8' : 'transparent',
                      border: `1.5px solid ${isSelected ? '#6B2D8C' : '#f3f4f6'}`,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: isSelected ? '#e9d5ff' : '#f9fafb' }}
                    >
                      <span style={{ fontSize: '18px' }}>
                        {status === 'healthy' ? '🐝' : status === 'warning' ? '⚠️' : '🚨'}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold text-sm"
                        style={{
                          color: isSelected ? '#6B2D8C' : '#374151',
                          fontFamily: 'Comfortaa, sans-serif',
                        }}
                      >
                        {hive.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: status === 'healthy' ? '#22c55e' : status === 'warning' ? '#f59e0b' : '#ef4444',
                          }}
                        />
                        <span
                          className="text-xs"
                          style={{ color: '#6b7280', fontFamily: 'Afacad Flux, sans-serif' }}
                        >
                          Salute: {hive.health_score}%
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <Check size={16} strokeWidth={2.5} color="#6B2D8C" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Dynamic Report */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl shadow-sm overflow-hidden h-full" style={{ backgroundColor: 'white' }}>
            {detectionReport ? (
              detectionReport.detected ? (
                // Case B: Varroa Detected
                <div className="h-full flex flex-col">
                  {/* Header with warning */}
                  <div
                    className="px-5 py-4"
                    style={{ backgroundColor: '#fef3c7', borderBottom: '1px solid #fde68a' }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="rounded-xl p-2 flex-shrink-0"
                        style={{ backgroundColor: 'white' }}
                      >
                        <AlertTriangle size={20} color="#d97706" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p
                          className="font-bold text-sm"
                          style={{ color: '#92400e', fontFamily: 'Comfortaa, sans-serif' }}
                        >
                          Varroa Rilevata
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: '#b45309', fontFamily: 'Afacad Flux, sans-serif' }}
                        >
                          {new Date(selectedDate + 'T00:00:00').toLocaleDateString('it-IT', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                          })}
                          {' '}— Confidenza: {detectionReport.confidence}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Detection details */}
                  <div className="px-5 py-4 flex-1 space-y-4">
                    {/* Severity and count */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div
                        className="rounded-xl px-3 py-2 flex items-center gap-2"
                        style={{
                          backgroundColor: detectionReport.severity === 'high' ? '#fee2e2' :
                            detectionReport.severity === 'medium' ? '#fef3c7' : '#fef9e7',
                        }}
                      >
                        <Bug size={14} color="#b45309" />
                        <span
                          className="text-xs font-semibold"
                          style={{
                            color: detectionReport.severity === 'high' ? '#b91c1c' :
                              detectionReport.severity === 'medium' ? '#b45309' : '#a16207',
                            fontFamily: 'Afacad Flux, sans-serif',
                          }}
                        >
                          {detectionReport.miteCount} {detectionReport.miteCount === 1 ? 'acaro' : 'acari'} rilevati
                        </span>
                      </div>
                    </div>

                    {/* Notes */}
                    {detectionReport.notes && (
                      <div
                        className="rounded-xl px-4 py-3"
                        style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}
                      >
                        <p
                          className="text-sm"
                          style={{ color: '#78350f', fontFamily: 'Afacad Flux, sans-serif' }}
                        >
                          {detectionReport.notes}
                        </p>
                      </div>
                    )}

                    {/* Image Gallery */}
                    {detectionReport.images.length > 0 && (
                      <div>
                        <p
                          className="text-xs font-semibold uppercase tracking-wide mb-2"
                          style={{ color: '#6b7280', fontFamily: 'Afacad Flux, sans-serif' }}
                        >
                          Immagini di rilevamento
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {detectionReport.images.slice(0, 2).map((img, idx) => (
                            <div
                              key={idx}
                              className="relative rounded-xl overflow-hidden aspect-[4/3]"
                              style={{ backgroundColor: '#f3f4f6' }}
                            >
                              <img
                                src={img}
                                alt={`Rilevamento ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div
                                className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg px-2 py-1"
                                style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                              >
                                <Camera size={12} color="white" />
                                <span
                                  className="text-xs text-white"
                                  style={{ fontFamily: 'Afacad Flux, sans-serif' }}
                                >
                                  Scan {idx + 1}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Case A: No Varroa Detected
                <div className="h-full flex items-center justify-center px-5 py-8">
                  <div className="flex flex-col items-center text-center">
                    <div
                      className="rounded-2xl p-4 mb-4"
                      style={{ backgroundColor: '#dcfce7' }}
                    >
                      <ShieldCheck size={48} color="#15803d" strokeWidth={2} />
                    </div>
                    <p
                      className="font-bold text-lg"
                      style={{ color: '#15803d', fontFamily: 'Comfortaa, sans-serif' }}
                    >
                      Nessuna minaccia rilevata
                    </p>
                    <p
                      className="text-sm mt-2 max-w-xs"
                      style={{ color: '#166534', fontFamily: 'Afacad Flux, sans-serif' }}
                    >
                      La salute dell'arnia è ottimale. Il monitoraggio non ha rilevato presenza di varroa.
                    </p>
                    <div
                      className="mt-4 flex items-center gap-2 rounded-xl px-4 py-2"
                      style={{ backgroundColor: '#f0fdf4' }}
                    >
                      <span className="text-xs text-gray-500" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
                        Confidenza:
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: '#15803d', fontFamily: 'Comfortaa, sans-serif' }}
                      >
                        {detectionReport.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              )
            ) : (
              // Empty state: no data for selected date
              <div className="h-full flex items-center justify-center px-5 py-8">
                <div className="flex flex-col items-center text-center">
                  <div
                    className="rounded-2xl p-4 mb-4"
                    style={{ backgroundColor: '#f3f4f6' }}
                  >
                    <AlertCircle size={48} color="#9ca3af" strokeWidth={2} />
                  </div>
                  <p
                    className="font-semibold text-gray-600"
                    style={{ fontFamily: 'Comfortaa, sans-serif' }}
                  >
                    Nessun dato disponibile
                  </p>
                  <p
                    className="text-sm mt-2 text-gray-400"
                    style={{ fontFamily: 'Afacad Flux, sans-serif' }}
                  >
                    Non ci sono rilevazioni per questa data
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
