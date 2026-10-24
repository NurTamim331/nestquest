import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Sparkles,
  ShieldCheck,
  Waves,
  Volume2,
  Wifi,
  CheckCircle2,
  Building2,
  Eye,
  Layers,
} from 'lucide-react';
import { Property } from '../types';

interface SmartMapViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

export const SmartMapView: React.FC<SmartMapViewProps> = ({
  properties,
  onSelectProperty,
}) => {
  const [selectedProperty, setSelectedProperty] = useState<Property>(properties[0]);
  const [showAmenitiesLayer, setShowAmenitiesLayer] = useState<boolean>(true);
  const [showRiskZonesLayer, setShowRiskZonesLayer] = useState<boolean>(true);
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('All');

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const visibleProperties = properties.filter(
    (p) => selectedZoneFilter === 'All' || p.areaName === selectedZoneFilter
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Center on Dhaka (Gulshan/Banani/Dhanmondi)
    const map = L.map(mapContainerRef.current).setView(
      selectedProperty ? selectedProperty.coordinates : [23.7937, 90.4066],
      13
    );
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Optional Risk Zone Circles (Flood / Safety insight zones)
    if (showRiskZonesLayer) {
      // High safety diplomatic zone in Gulshan-2 / Banani
      L.circle([23.7947, 90.412], {
        color: '#16a34a',
        fillColor: '#22c55e',
        fillOpacity: 0.14,
        radius: 1100,
      })
        .addTo(map)
        .bindPopup(
          '<b>Gulshan-Banani Diplomatic Safe Zone</b><br/>Flood Risk: Low • Safety Score: 8.8/10'
        );

      // Moderate waterlogging watch zone in eastern low-lying pocket
      L.circle([23.8195, 90.435], {
        color: '#d97706',
        fillColor: '#f59e0b',
        fillOpacity: 0.16,
        radius: 950,
      })
        .addTo(map)
        .bindPopup(
          '<b>Monsoon Drainage Watch Layer</b><br/>Flood Risk: Medium • Ongoing WASA upgrade'
        );
    }

    // Render Property Pins matching Figma red/emerald pin aesthetic
    visibleProperties.forEach((prop, idx) => {
      const isSelected = selectedProperty?.id === prop.id;
      const pinColor = isSelected ? '#dc2626' : '#166534';

      const markerIcon = L.divIcon({
        className: 'nq-smart-map-pin',
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
            <div style="background:${pinColor};color:white;padding:4px 10px;border-radius:9999px;font-weight:800;font-size:11px;box-shadow:0 4px 12px rgba(0,0,0,0.35);border:2px solid white;white-space:nowrap;">
              Property ${idx + 1}: ${prop.priceDisplay}
            </div>
            <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid ${pinColor};margin-top:-1px;"></div>
          </div>
        `,
        iconSize: [130, 36],
        iconAnchor: [65, 36],
      });

      const marker = L.marker(prop.coordinates, { icon: markerIcon }).addTo(map);
      marker.on('click', () => {
        setSelectedProperty(prop);
        map.flyTo(prop.coordinates, 15, { duration: 0.8 });
      });
    });

    // Render Nearby Hospitals / Police / Schools Layer if enabled
    if (showAmenitiesLayer) {
      properties.forEach((prop) => {
        prop.nearbyServices.forEach((srv) => {
          const srvIcon = L.divIcon({
            className: 'nq-poi-pin',
            html: `<div style="background:#1e293b;color:#f8fafc;padding:2px 7px;border-radius:6px;font-size:10px;font-weight:600;border:1px solid #94a3b8;white-space:nowrap;">🏥 ${srv.name}</div>`,
            iconSize: [110, 22],
            iconAnchor: [55, 11],
          });
          L.marker(srv.coordinates, { icon: srvIcon })
            .addTo(map)
            .bindPopup(`<b>${srv.name}</b><br/>${srv.category} (${srv.distance})`);
        });
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [visibleProperties, selectedProperty, showAmenitiesLayer, showRiskZonesLayer, properties]);

  return (
    <div className="min-h-screen bg-slate-50 pb-14">
      {/* Green Header Banner (Exact Match to Figma Page 28 Smart Map) */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Smart map</h1>
            <p className="text-emerald-100 text-sm mt-0.5">
              Find your dream Property with AI Price Estimation, Flood/Crime Risk Layers & Nearby
              POIs
            </p>
          </div>

          {/* Interactive Layer Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAmenitiesLayer(!showAmenitiesLayer)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                showAmenitiesLayer
                  ? 'bg-emerald-400 text-brand-950 border-emerald-300'
                  : 'bg-brand-950/60 text-emerald-100 border-emerald-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Hospitals, Schools & Police
            </button>

            <button
              type="button"
              onClick={() => setShowRiskZonesLayer(!showRiskZonesLayer)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                showRiskZonesLayer
                  ? 'bg-emerald-400 text-brand-950 border-emerald-300'
                  : 'bg-brand-950/60 text-emerald-100 border-emerald-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Flood & Safety Zones
            </button>
          </div>
        </div>
      </div>

      {/* Zone Quick Selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 px-2">Dhaka Zone:</span>
            {['All', 'Gulshan', 'Banani', 'Dhanmondi', 'Uttara', 'Bashundhara'].map((zone) => (
              <button
                key={zone}
                type="button"
                onClick={() => setSelectedZoneFilter(zone)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedZoneFilter === zone
                    ? 'bg-brand-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {zone}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 font-medium pr-2">
            Click any property pin on the map to inspect AI Price & Area Risk
          </span>
        </div>

        {/* Map + Exact Figma Floating AI Price & Risk Assessment Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Map Canvas */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-2 shadow-md">
            <div
              ref={mapContainerRef}
              className="w-full h-[540px] rounded-xl overflow-hidden"
            />
          </div>

          {/* Right / Floating Inspection Card (Exact Match to Figma Page 28 Smart Map Popup) */}
          <div className="lg:col-span-4 space-y-4">
            {selectedProperty && (
              <div className="bg-white rounded-2xl border-2 border-brand-700/30 p-5 shadow-xl space-y-5">
                {/* Selected Property Header */}
                <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
                  <img
                    src={selectedProperty.images[0]}
                    alt={selectedProperty.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-extrabold">
                        Selected Pin
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-brand-800 text-[10px] font-bold">
                        ✓ {selectedProperty.verificationScore}% Verified
                      </span>
                    </div>
                    <h2 className="text-sm font-extrabold text-slate-900 mt-1 truncate">
                      {selectedProperty.title}
                    </h2>
                    <p className="text-xs text-slate-500 truncate">{selectedProperty.address}</p>
                    <p className="text-sm font-extrabold text-brand-800 mt-0.5">
                      Listed: {selectedProperty.priceDisplay}
                    </p>
                  </div>
                </div>

                {/* AI Price Estimation Box (Exact Match to Figma Page 28) */}
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-2.5">
                    <Sparkles className="w-4 h-4 text-brand-700" />
                    AI Price Estimation
                  </h3>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Estimated Market Value</span>
                      <span className="text-sm font-extrabold text-brand-800">
                        {selectedProperty.aiEstimate.rangeText}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-brand-700 rounded-full"
                        style={{ width: `${selectedProperty.aiEstimate.confidence}%` }}
                      />
                    </div>
                    <div className="mt-3 p-2.5 rounded-lg bg-blue-50/90 border border-blue-200 text-[11px] text-blue-900 leading-relaxed">
                      <strong>Investment Potential:</strong>{' '}
                      {selectedProperty.aiEstimate.appreciationNote}
                    </div>
                  </div>
                </div>

                {/* Risk Assessment Box (Exact Match to Figma Page 28) */}
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2.5">
                    Risk Assessment
                  </h3>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <Waves className="w-4 h-4 text-blue-600" />
                        <span>Flood</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-brand-800 text-[11px] font-bold">
                        {selectedProperty.riskAssessment.floodRisk}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <ShieldCheck className="w-4 h-4 text-rose-600" />
                        <span>Crime</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-brand-800 text-[11px] font-bold">
                        {selectedProperty.riskAssessment.crimeRate}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <Volume2 className="w-4 h-4 text-amber-600" />
                        <span>Noise</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[11px] font-bold">
                        {selectedProperty.riskAssessment.noiseLevel}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <Wifi className="w-4 h-4 text-emerald-600" />
                        <span>Transit</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-brand-800 text-[11px] font-bold">
                        {selectedProperty.riskAssessment.connectivity}
                      </span>
                    </div>
                  </div>

                  {/* Overall Safety Score Progress Bar */}
                  <div className="mt-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-700">Overall Safety Score</span>
                      <span className="text-brand-800 text-sm">
                        {selectedProperty.riskAssessment.safetyScore}/10
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-emerald-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-700 rounded-full"
                        style={{
                          width: `${selectedProperty.riskAssessment.safetyScore * 10}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => onSelectProperty(selectedProperty)}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow transition"
                >
                  <Eye className="w-4 h-4" />
                  Inspect Full Property Details
                </button>
              </div>
            )}

            {/* Quick Property Pin Selector List */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                All Mapped Properties ({visibleProperties.length})
              </h3>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {visibleProperties.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProperty(p)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${
                      selectedProperty?.id === p.id
                        ? 'border-brand-700 bg-brand-50/80 font-bold text-brand-900'
                        : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="truncate pr-2">
                      {idx + 1}. {p.title}
                    </span>
                    <span className="text-brand-800 font-extrabold shrink-0">
                      {p.priceDisplay}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
