import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Heart,
  Share2,
  BedDouble,
  Bath,
  Maximize2,
  Car,
  Compass,
  Calendar,
  Building,
  Sparkles,
  Phone,
  MessageSquare,
  Users,
  Scale,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  Send,
} from 'lucide-react';
import { NavTab, Property } from '../types';
import { attachDialogLightDismiss } from '../utils/webGuidance';

interface PropertyDetailsViewProps {
  property: Property;
  onBack: () => void;
  setActiveTab: (tab: NavTab) => void;
  isSaved: boolean;
  onToggleWishlist: (id: string) => void;
  onInitiateGroupBuyForProperty: (property: Property) => void;
}

export const PropertyDetailsView: React.FC<PropertyDetailsViewProps> = ({
  property,
  onBack,
  setActiveTab,
  isSaved,
  onToggleWishlist,
  onInitiateGroupBuyForProperty,
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [offerAmount, setOfferAmount] = useState(property.priceCrore.toFixed(2));
  const [offerMessage, setOfferMessage] = useState('');
  const [offerSentToast, setOfferSentToast] = useState(false);

  // 3-Step Buy & Legal Verification Flow from Figma Mobile Page 34
  const [buyStep, setBuyStep] = useState<0 | 1 | 2 | 3>(0);
  const [buyerFullName, setBuyerFullName] = useState('Nur Uddin Tamim');
  const [buyerEmail, setBuyerEmail] = useState('tamim@nestquest.com');
  const [buyerPhone, setBuyerPhone] = useState('+880 1712-345678');
  const [paymentMethod, setPaymentMethod] = useState('Bank Escrow / Pay Order');

  const buyDialogRef = useRef<HTMLDialogElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    return attachDialogLightDismiss(buyDialogRef.current, () => setBuyStep(0));
  }, []);

  const openBuyModal = () => {
    setBuyStep(1);
    if (buyDialogRef.current && !buyDialogRef.current.open) {
      buyDialogRef.current.showModal();
    }
  };

  const closeBuyModal = () => {
    setBuyStep(0);
    if (buyDialogRef.current?.open) {
      buyDialogRef.current.close();
    }
  };

  // Initialize Leaflet Mini-Map for Location & Nearby Services
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current).setView(property.coordinates, 15);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Custom Emerald Property Marker
    const propIcon = L.divIcon({
      className: 'custom-prop-marker',
      html: `<div style="background:#166534;color:white;padding:4px 8px;border-radius:9999px;font-weight:700;font-size:11px;box-shadow:0 4px 10px rgba(0,0,0,0.3);border:2px solid white;white-space:nowrap;">${property.priceDisplay}</div>`,
      iconSize: [90, 28],
      iconAnchor: [45, 14],
    });

    L.marker(property.coordinates, { icon: propIcon })
      .addTo(map)
      .bindPopup(`<b>${property.title}</b><br/>${property.address}`);

    // Nearby Services Markers
    property.nearbyServices.forEach((srv) => {
      const srvColor =
        srv.category === 'Hospital'
          ? '#dc2626'
          : srv.category === 'Police Station'
          ? '#2563eb'
          : '#d97706';

      const srvIcon = L.divIcon({
        className: 'custom-srv-marker',
        html: `<div style="background:${srvColor};color:white;padding:2px 6px;border-radius:6px;font-weight:600;font-size:10px;border:1.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);white-space:nowrap;">${srv.category}</div>`,
        iconSize: [70, 20],
        iconAnchor: [35, 10],
      });

      L.marker(srv.coordinates, { icon: srvIcon })
        .addTo(map)
        .bindPopup(`<b>${srv.name}</b><br/>${srv.category} (${srv.distance})`);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [property]);

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setOfferSentToast(true);
    setOfferMessage('');
    setTimeout(() => setOfferSentToast(false), 4500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-800 mb-6 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN (8 Cols): Gallery, Specs, Legal Checklist, Map & Risk Report */}
          <div className="lg:col-span-8 space-y-6">
            {/* Image Gallery Card (Matches Figma Page 26 & Mobile Page 34) */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="relative h-72 sm:h-96 bg-slate-900">
                <img
                  src={property.images[activeImageIdx] || property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />

                {/* Top Right Share & Wishlist Buttons */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(window.location.href)}
                    className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow"
                    title="Share Property"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleWishlist(property.id)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center shadow transition ${
                      isSaved
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/90 hover:bg-white text-slate-700'
                    }`}
                    title="Save to Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Prev / Next Controls if multiple images */}
                {property.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImageIdx((prev) =>
                          prev === 0 ? property.images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-slate-800 flex items-center justify-center shadow"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImageIdx((prev) => (prev + 1) % property.images.length)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-slate-800 flex items-center justify-center shadow"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image Counter Pill */}
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/80 text-white text-xs font-semibold">
                  {activeImageIdx + 1} / {property.images.length}
                </span>
              </div>

              {/* Thumbnails Strip */}
              {property.images.length > 1 && (
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2.5 overflow-x-auto">
                  {property.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition shrink-0 ${
                        activeImageIdx === idx
                          ? 'border-brand-700 ring-2 ring-brand-500/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Title, Price, Verification Reliability Bar & Key Features */}
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-brand-800 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {property.status}
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        ID: {property.id.toUpperCase()}
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      {property.title}
                    </h1>
                    <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-4 h-4 text-brand-700" />
                      {property.address}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-2xl sm:text-3xl font-extrabold text-brand-800">
                      {property.priceDisplay}
                    </p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[11px] font-bold">
                      Negotiable
                    </span>
                  </div>
                </div>

                {/* Verification Score Bar (Matches Figma Page 26 & 34) */}
                <div className="mt-5 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-6 h-6 text-brand-700 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Property Verification & Reliability Score
                      </p>
                      <p className="text-[11px] text-slate-600">
                        Khatian, Mutation (Namjari) & Ownership verified by Admin & Legal Team
                      </p>
                    </div>
                  </div>
                  <div className="sm:w-48">
                    <div className="flex justify-between text-xs font-bold text-brand-800 mb-1">
                      <span>Verified Score</span>
                      <span>{property.verificationScore}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-emerald-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-700 rounded-full"
                        style={{ width: `${property.verificationScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Key Features Grid (Matches Figma Page 26) */}
                <div className="mt-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Key Features
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <BedDouble className="w-4 h-4 text-brand-700 mx-auto mb-1" />
                      <p className="text-sm font-bold text-slate-900">{property.beds}</p>
                      <p className="text-[11px] text-slate-500">Bedrooms</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <Bath className="w-4 h-4 text-brand-700 mx-auto mb-1" />
                      <p className="text-sm font-bold text-slate-900">{property.baths}</p>
                      <p className="text-[11px] text-slate-500">Bathrooms</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <Maximize2 className="w-4 h-4 text-brand-700 mx-auto mb-1" />
                      <p className="text-sm font-bold text-slate-900">{property.sqft}</p>
                      <p className="text-[11px] text-slate-500">Sq. Ft.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <Building className="w-4 h-4 text-brand-700 mx-auto mb-1" />
                      <p className="text-sm font-bold text-slate-900">
                        ৳ {property.aiEstimate.pricePerSqft.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-slate-500">Per Sq. Ft.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <Car className="w-4 h-4 text-brand-700 mx-auto mb-1" />
                      <p className="text-sm font-bold text-slate-900">{property.parking}</p>
                      <p className="text-[11px] text-slate-500">Parking</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <Building className="w-4 h-4 text-brand-700 mx-auto mb-1" />
                      <p className="text-sm font-bold text-slate-900">{property.floor}</p>
                      <p className="text-[11px] text-slate-500">Floor Level</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <Compass className="w-4 h-4 text-brand-700 mx-auto mb-1" />
                      <p className="text-sm font-bold text-slate-900">{property.facing}</p>
                      <p className="text-[11px] text-slate-500">Facing</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <Calendar className="w-4 h-4 text-brand-700 mx-auto mb-1" />
                      <p className="text-sm font-bold text-slate-900">{property.yearBuilt}</p>
                      <p className="text-[11px] text-slate-500">Year Built</p>
                    </div>
                  </div>
                </div>

                {/* Property Description & Amenities */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h2 className="text-base font-bold text-slate-900 mb-2">
                    Property Overview
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {property.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {property.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-700" />
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* LOCATION & NEARBY SERVICES MINI-MAP (Matches Figma Page 26 Right Top Card) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Location & Nearby Services
                  </h2>
                  <p className="text-xs text-slate-500">
                    Interactive OpenStreetMap showing nearby hospitals, police stations & schools
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('smart-map')}
                  className="text-xs font-bold text-brand-700 hover:underline"
                >
                  Open Full Smart Map →
                </button>
              </div>

              <div
                ref={mapContainerRef}
                className="w-full h-64 rounded-xl overflow-hidden border border-slate-200"
              />

              {property.nearbyServices.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.nearbyServices.map((srv, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-800">{srv.name}</p>
                        <p className="text-[11px] text-slate-500">{srv.category}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-bold text-brand-800">
                        {srv.distance}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* NATURAL & AREA HAZARD REPORT (Matches Figma Page 26 Bottom Right Card) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-1">
                Area Risk & Hazard Assessment Report
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Verified environmental, utility, and safety metrics for {property.areaName}
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Flood & Monsoon Waterlogging Risk
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Based on Dhaka WASA & historical elevation data
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      property.riskAssessment.floodRisk === 'Low'
                        ? 'bg-emerald-100 text-brand-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {property.riskAssessment.floodRisk} Risk
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Crime & Neighborhood Safety
                    </p>
                    <p className="text-[11px] text-slate-500">
                      24/7 patrol zone & diplomatic/residential security rating
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-brand-800 text-xs font-bold">
                    {property.riskAssessment.crimeRate} Crime
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Noise & Traffic Index</p>
                    <p className="text-[11px] text-slate-500">
                      Average daytime decibel reading on adjacent road
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                    {property.riskAssessment.noiseLevel}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Water & Gas Supply Reliability
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Titas Gas & deep tube-well WASA connection status
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-brand-800 text-xs font-bold">
                    {property.riskAssessment.gasWaterSupply}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-brand-900 text-white flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Overall Area Safety & Livability Score
                    </p>
                    <p className="text-xs text-emerald-100 mt-0.5">
                      Composite rating across safety, health, and connectivity
                    </p>
                  </div>
                  <span className="text-2xl font-extrabold text-emerald-400">
                    {property.riskAssessment.safetyScore} / 10
                  </span>
                </div>
              </div>
            </div>

            {/* LEGAL DOCUMENT VERIFICATION CHECKLIST (SRS 4.5 & 4.8) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-brand-700" />
                  <h2 className="text-base font-bold text-slate-900">
                    Legal Document Verification Log
                  </h2>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Encrypted Vault Storage
                </span>
              </div>

              <div className="space-y-2.5">
                {property.legalDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{doc.docType}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            doc.status === 'Verified'
                              ? 'bg-emerald-100 text-brand-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          ✓ {doc.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {doc.verifiedBy
                          ? `Verified by ${doc.verifiedBy}`
                          : 'Awaiting Lawyer Inspection'}{' '}
                        {doc.notes ? `• "${doc.notes}"` : ''}
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Uploaded: {doc.uploadedAt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (4 Cols): AI Price Estimation, Contact Seller & Purchase Options */}
          <div className="lg:col-span-4 space-y-6">
            {/* AI Price Estimation Card (Matches Figma Page 26 Right Column) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">AI Price Estimation</h2>
                  <p className="text-[11px] text-slate-500">Data-driven valuation model</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-slate-600">
                    Estimated Market Value
                  </span>
                  <span className="text-base font-extrabold text-brand-800">
                    {property.aiEstimate.rangeText}
                  </span>
                </div>
                <div className="w-full h-2 bg-emerald-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-brand-700 rounded-full"
                    style={{ width: `${property.aiEstimate.confidence}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[11px] text-slate-600">
                  <span>Listed Price: {property.priceDisplay}</span>
                  <span className="font-bold text-emerald-700">
                    {property.aiEstimate.confidence}% Confidence
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Price per sq.ft</span>
                  <span className="font-bold text-slate-800">
                    ৳ {property.aiEstimate.pricePerSqft.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Location & Connectivity</span>
                  <span className="font-semibold text-emerald-700">9.2 / 10</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Legal Document Integrity</span>
                  <span className="font-semibold text-emerald-700">
                    {property.verificationScore}%
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
                {property.aiEstimate.appreciationNote}
              </div>
            </div>

            {/* Contact Seller & Offer Negotiation Card (Matches Figma Page 26) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-3">
                Contact Seller & Make Offer
              </h2>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-800 text-white font-bold text-sm flex items-center justify-center">
                  {property.sellerName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{property.sellerName}</p>
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    ✓ {property.sellerRole}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSendOffer} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Offer Price (in Crore BDT)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold text-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Message to Seller / Advisor
                  </label>
                  <textarea
                    rows={2}
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    placeholder="I am interested in scheduling a visit and reviewing the deed..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  Contact Agent & Log Offer
                </button>
              </form>

              {offerSentToast && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-brand-900 font-semibold">
                  ✓ Offer of ৳ {offerAmount} Cr logged in Deal Negotiation Tracker & sent to{' '}
                  {property.sellerName}!
                </div>
              )}
            </div>

            {/* Purchase Options Card (Matches Figma Page 26 & Mobile Page 34) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-slate-900">Purchase Options</h2>
              <button
                type="button"
                onClick={openBuyModal}
                className="w-full py-3 px-4 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow transition"
              >
                <ShieldCheck className="w-4 h-4" />
                Buy Individually (Legal Escrow Checkout)
              </button>

              <button
                type="button"
                onClick={() => onInitiateGroupBuyForProperty(property)}
                className="w-full py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-brand-900 border border-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <Users className="w-4 h-4 text-brand-700" />
                Buy as a Group (Co-Ownership Shares)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('lawyers')}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <Scale className="w-4 h-4 text-brand-700" />
                Hire Lawyer for Custom Vetting
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Step Property Purchase & Lawyer Verification Modal (Matches Figma Mobile Page 34 Bottom Left & Center) */}
      <dialog
        ref={buyDialogRef}
        {...({ closedby: 'any' } as any)}
        aria-labelledby="buyModalTitle"
        className="nq-dialog w-full max-w-lg bg-white text-slate-900"
      >
        <div className="p-6">
          {/* Stepper Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div className="flex items-center gap-2 text-xs font-bold">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  buyStep >= 1 ? 'bg-brand-800 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                1
              </span>
              <span>Property Details</span>
              <span className="text-slate-300">→</span>
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  buyStep >= 2 ? 'bg-brand-800 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                2
              </span>
              <span>Payment Setup</span>
              <span className="text-slate-300">→</span>
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  buyStep === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                ✓
              </span>
              <span>Confirmation</span>
            </div>
            <button
              type="button"
              onClick={closeBuyModal}
              className="text-xs font-bold text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
          </div>

          {buyStep === 1 && (
            <div className="space-y-4">
              <h3 id="buyModalTitle" className="text-lg font-extrabold text-slate-900">
                Property Summary & Buyer Information
              </h3>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <p className="font-bold text-sm text-slate-900">{property.title}</p>
                  <p className="text-xs text-slate-500">{property.address}</p>
                  <p className="text-sm font-extrabold text-brand-800 mt-1">
                    Property Price: {property.priceDisplay}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={buyerFullName}
                    onChange={(e) => setBuyerFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={closeBuyModal}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setBuyStep(2)}
                  className="px-5 py-2 rounded-lg bg-brand-800 text-white text-xs font-bold"
                >
                  Next: Payment & Legal Escrow →
                </button>
              </div>
            </div>
          )}

          {buyStep === 2 && (
            <div className="space-y-4">
              <h3 id="buyModalTitle" className="text-lg font-extrabold text-slate-900">
                Payment Setup & Legal Escrow Protection
              </h3>
              <p className="text-xs text-slate-600">
                Your booking deposit is held in escrow until your assigned lawyer completes final
                Sub-Registry & Khatian verification.
              </p>

              <div className="space-y-2">
                {[
                  'Bank Escrow / Pay Order (Bangladesh Bank Verified)',
                  'RTGS / BEFTN Property Transfer',
                  'bKash / SSLCommerz Booking Token (৳ 50,000)',
                ].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs font-semibold ${
                      paymentMethod === method
                        ? 'border-brand-700 bg-brand-50 text-brand-900'
                        : 'border-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="text-brand-700"
                    />
                    {method}
                  </label>
                ))}
              </div>

              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setBuyStep(1)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setBuyStep(3)}
                  className="px-5 py-2 rounded-lg bg-brand-800 text-white text-xs font-bold"
                >
                  Submit Payment Details
                </button>
              </div>
            </div>
          )}

          {buyStep === 3 && (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 id="buyModalTitle" className="text-xl font-extrabold text-slate-900">
                Payment Details Submitted!
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Transaction ID: TXN-2026-NQ-78945 • Submitted by {buyerFullName}
              </p>

              {/* Awaiting Lawyer Verification Notice (Exact Match to Figma Mobile Page 34) */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-left">
                <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Awaiting Lawyer Verification
                </p>
                <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                  Your property lawyer (Advocate Rafiqul Islam) will now review and verify all
                  documents necessary to complete the purchase of your selected property. The
                  assigned lawyer will verify all documents, validate the transaction legitimacy,
                  and ensure legal compliance before the purchase is finalized.
                </p>
              </div>

              <button
                type="button"
                onClick={closeBuyModal}
                className="w-full py-2.5 rounded-xl bg-brand-800 text-white text-xs font-bold"
              >
                Done & Track in Profile
              </button>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
};
