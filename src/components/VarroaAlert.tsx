import { useState } from 'react';
import { AlertTriangle, X, ZoomIn, Bug } from 'lucide-react';

interface VarroaAlertProps {
  hiveName: string;
  cropImages: string[];
}

export default function VarroaAlert({ hiveName, cropImages }: VarroaAlertProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <>
      <div
        className="rounded-[32px] p-6 flex items-center justify-between gap-4 shadow-lg"
        style={{ backgroundColor: '#ff823a' }}
      >
        <div className="flex items-center gap-4">
          <div className="bg-white/20 rounded-2xl p-3 flex-shrink-0">
            <Bug size={28} strokeWidth={2.5} color="white" />
          </div>
          <div>
            <p className="font-bold text-white text-lg leading-tight" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
              Varroa Mite Detected
            </p>
            <p className="text-white/90 text-sm mt-0.5" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
              AI flagged suspicious specimens in <strong>{hiveName}</strong> — last night's scan
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex-shrink-0 flex items-center gap-2 bg-white text-sm font-semibold rounded-2xl px-5 py-2.5 transition-all hover:scale-105 active:scale-95 shadow"
          style={{ color: '#ff823a', fontFamily: 'Afacad Flux, sans-serif' }}
        >
          <ZoomIn size={16} strokeWidth={2.5} />
          View Proof
        </button>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
          onClick={() => { setShowModal(false); setSelectedImg(null); }}
        >
          <div
            className="relative w-full max-w-2xl rounded-[32px] p-8 shadow-2xl"
            style={{ backgroundColor: '#fff8f4' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => { setShowModal(false); setSelectedImg(null); }}
              className="absolute top-5 right-5 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
            >
              <X size={18} strokeWidth={2.5} color="#555" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-2xl p-2.5" style={{ backgroundColor: '#ff823a' }}>
                <AlertTriangle size={20} strokeWidth={2.5} color="white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-xl" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                  Suspicious Bees — Evidence
                </h2>
                <p className="text-gray-500 text-sm" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
                  30KB micro-crops from overnight AI scan · {hiveName}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {cropImages.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(src)}
                  className="group relative rounded-2xl overflow-hidden aspect-square shadow-md hover:scale-105 transition-transform"
                >
                  <img
                    src={src}
                    alt={`Varroa evidence crop ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <ZoomIn size={24} strokeWidth={2} color="white" className="opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                  </div>
                  <div
                    className="absolute bottom-2 left-2 rounded-xl px-2 py-0.5 text-xs font-semibold text-white"
                    style={{ backgroundColor: '#ff823a', fontFamily: 'Afacad Flux, sans-serif' }}
                  >
                    Bee #{i + 1}
                  </div>
                </button>
              ))}
            </div>

            <div
              className="rounded-2xl p-4 flex items-start gap-3"
              style={{ backgroundColor: '#fff0e8' }}
            >
              <Bug size={18} strokeWidth={2} style={{ color: '#ff823a', marginTop: 2, flexShrink: 0 }} />
              <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Afacad Flux, sans-serif' }}>
                The AI detected a <strong>Varroa destructor</strong> mite (the small red-brown oval parasite) attached to the bee's abdomen. Treatment is recommended within 48 hours to prevent colony spread.
              </p>
            </div>
          </div>

          {selectedImg && (
            <div
              className="fixed inset-0 z-60 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
              onClick={() => setSelectedImg(null)}
            >
              <img
                src={selectedImg}
                alt="Full size evidence"
                className="max-w-[90vw] max-h-[85vh] rounded-3xl shadow-2xl object-contain"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
