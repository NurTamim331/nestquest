import React, { useState } from 'react';
import {
  Scale,
  Search,
  Star,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  FileCheck2,
  ArrowLeft,
  Building2,
  AlertCircle,
  Award,
} from 'lucide-react';
import { Lawyer, LawyerAppointment, Property } from '../types';

interface LawyersViewProps {
  lawyers: Lawyer[];
  appointments: LawyerAppointment[];
  properties: Property[];
  onVerifyPropertyByLawyer: (propertyId: string) => void;
  onCompleteAppointment: (appointmentId: string) => void;
  onBookAppointment: (newApt: LawyerAppointment) => void;
}

export const LawyersView: React.FC<LawyersViewProps> = ({
  lawyers,
  appointments,
  properties,
  onVerifyPropertyByLawyer,
  onCompleteAppointment,
  onBookAppointment,
}) => {
  const [subMode, setSubMode] = useState<'directory' | 'profile' | 'lawyer-dashboard'>(
    'directory'
  );
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer>(lawyers[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Booking form state in profile
  const [bookingPropTitle, setBookingPropTitle] = useState(
    'Luxurious 3 BHK Apartment in Gulshan'
  );
  const [bookingService, setBookingService] = useState<
    'Document Verification' | 'Legal Processing' | 'Deed Drafting'
  >('Document Verification');
  const [bookingDate, setBookingDate] = useState('Friday, February 13, 2026');
  const [bookingTime, setBookingTime] = useState('11:00 AM');
  const [bookingBookedToast, setBookingBookedToast] = useState(false);

  const filteredLawyers = lawyers.filter((lw) => {
    const matchesSearch =
      !searchQuery.trim() ||
      lw.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lw.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lw.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAvail = !onlyAvailable || lw.availableNow;
    return matchesSearch && matchesAvail;
  });

  const pendingProperties = properties.filter((p) => p.status !== 'Verified');

  const handleBookConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: LawyerAppointment = {
      id: `apt-${Date.now().toString().slice(-4)}`,
      clientName: 'Nur Uddin Tamim',
      clientPhone: '+880 1712-345678',
      clientEmail: 'tamim@nestquest.com',
      propertyTitle: bookingPropTitle,
      location: 'Gulshan / Banani, Dhaka',
      propertyType: 'Apartment',
      serviceType: bookingService,
      date: bookingDate,
      time: bookingTime,
      duration: '60 min',
      mode: 'In-Person',
      urgent: true,
      status: 'Scheduled',
      notes: `Requested ${bookingService} with ${selectedLawyer.name} for ${bookingPropTitle}.`,
    };
    onBookAppointment(newApt);
    setBookingBookedToast(true);
    setTimeout(() => setBookingBookedToast(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Portal Switcher (Lets user view Buyer Lawyer Directory, Lawyer Profile, and Nest Quest Legal Portal from Page 32) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-800 text-white flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Nest Quest Legal & Document Verification Center
              </h1>
              <p className="text-xs text-slate-500">
                SRS 4.8 • Verified Supreme Court & Judge Court Property Lawyers
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSubMode('directory')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                subMode === 'directory'
                  ? 'bg-brand-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Available Lawyers List
            </button>
            <button
              type="button"
              onClick={() => setSubMode('profile')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                subMode === 'profile'
                  ? 'bg-brand-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Lawyer Profile ({selectedLawyer.name.split(' ').slice(0, 2).join(' ')})
            </button>
            <button
              type="button"
              onClick={() => setSubMode('lawyer-dashboard')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                subMode === 'lawyer-dashboard'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              ⚖️ Nest Quest Legal (Lawyer Dashboard)
            </button>
          </div>
        </div>

        {/* VIEW 1: AVAILABLE LAWYERS LIST (Exact Match to Figma Page 29 Top Left & Mobile Page 35) */}
        {subMode === 'directory' && (
          <div className="space-y-6">
            {/* Green Header Banner */}
            <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 rounded-2xl p-6 sm:p-8 text-white shadow-md">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-extrabold">Available Lawyers</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-300/40 text-emerald-200 text-xs font-bold">
                  • Verified Bar Council Members
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                Connect with lawyers who are currently available for immediate consultation &
                Khatian/Namjari verification
              </p>

              {/* Search Bar */}
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by lawyer name, specialization, or Dhaka area..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-slate-900 text-xs focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setOnlyAvailable(!onlyAvailable)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                    onlyAvailable
                      ? 'bg-emerald-400 text-brand-950'
                      : 'bg-brand-950/70 text-emerald-100 border border-emerald-600'
                  }`}
                >
                  {onlyAvailable ? '✓ Showing Available Now' : 'Filter: Available Now'}
                </button>
              </div>
            </div>

            {/* 4 KPI Stat Boxes (Matches Figma Page 29: 7, 4.8, 14 yrs, 98%) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-sm">
                <p className="text-2xl font-extrabold text-brand-800">7</p>
                <p className="text-xs text-slate-500 mt-0.5">Available Lawyers</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-sm">
                <p className="text-2xl font-extrabold text-amber-500">4.8 ★</p>
                <p className="text-xs text-slate-500 mt-0.5">Avg Rating</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-sm">
                <p className="text-2xl font-extrabold text-brand-800">14 yrs</p>
                <p className="text-xs text-slate-500 mt-0.5">Avg Experience</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-sm">
                <p className="text-2xl font-extrabold text-emerald-600">98%</p>
                <p className="text-xs text-slate-500 mt-0.5">Success Rate</p>
              </div>
            </div>

            {/* Lawyer Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredLawyers.map((lw) => (
                <div
                  key={lw.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col justify-between"
                >
                  <div>
                    <div className="p-4 pb-0 flex items-center justify-between">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          lw.availableNow
                            ? 'bg-emerald-100 text-brand-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {lw.availableNow ? '● Available Now' : 'In Chamber'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                        ✓ Verified
                      </span>
                    </div>

                    <div className="p-4 text-center">
                      <img
                        src={lw.image}
                        alt={lw.name}
                        className="w-24 h-24 rounded-2xl object-cover mx-auto shadow-md border-2 border-brand-100"
                      />
                      <h3 className="mt-3 text-base font-extrabold text-slate-900">{lw.name}</h3>
                      <p className="text-xs font-semibold text-brand-700 mt-0.5">
                        {lw.specialization}
                      </p>

                      <div className="mt-3 flex items-center justify-center gap-3 text-xs text-slate-600">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {lw.rating} ({lw.reviewsCount})
                        </span>
                        <span>•</span>
                        <span>{lw.experienceYears} Years</span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 text-left space-y-1.5 text-xs text-slate-600">
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                          {lw.location}
                        </p>
                        <p className="flex items-center justify-between">
                          <span className="text-slate-500">Cases Verified:</span>
                          <strong className="text-slate-800">{lw.casesHandled}+</strong>
                        </p>
                        <p className="flex items-center justify-between">
                          <span className="text-slate-500">Consultation Fee:</span>
                          <strong className="text-brand-800">
                            ৳ {lw.consultationFeeBdt.toLocaleString()}
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLawyer(lw);
                        setSubMode('profile');
                      }}
                      className="w-full py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold transition shadow-sm"
                    >
                      View Profile & Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: LAWYER DETAILED PROFILE (Exact Match to Figma Page 29 Top Right — Advocate Rafiqul Islam) */}
        {subMode === 'profile' && (
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => setSubMode('directory')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-800 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Available Lawyers
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 8 Cols: Lawyer Header + About + Legal Checklist Services */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <img
                      src={selectedLawyer.image}
                      alt={selectedLawyer.name}
                      className="w-24 h-24 rounded-2xl object-cover shadow-md border-2 border-brand-600"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl font-extrabold text-slate-900">
                          {selectedLawyer.name}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-brand-800 text-xs font-bold">
                          ✓ Verified Advocate
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-brand-700 mt-0.5">
                        {selectedLawyer.specialization}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Bar Council ID: <span className="font-mono">{selectedLawyer.barCouncilId}</span>{' '}
                        • {selectedLawyer.location} • {selectedLawyer.experienceYears} Years
                        Experience
                      </p>

                      {/* 3 KPI Pills (4.9, 450, 98%) */}
                      <div className="mt-4 grid grid-cols-3 gap-3 max-w-md">
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
                          <p className="text-base font-extrabold text-amber-700">
                            ★ {selectedLawyer.rating}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {selectedLawyer.reviewsCount} Reviews
                          </p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                          <p className="text-base font-extrabold text-slate-900">
                            {selectedLawyer.casesHandled}
                          </p>
                          <p className="text-[10px] text-slate-500">Cases Handled</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                          <p className="text-base font-extrabold text-brand-800">
                            {selectedLawyer.successRate}
                          </p>
                          <p className="text-[10px] text-slate-500">Success Rate</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-500">Languages:</span>
                    {selectedLawyer.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* About Section */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-extrabold text-slate-900">About</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedLawyer.bio}</p>

                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-2">
                    Legal Verification & Document Services Offered
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedLawyer.services.map((srv) => (
                      <div
                        key={srv}
                        className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-2 text-xs font-bold text-brand-900"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        {srv}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 4 Cols: Contact Info & Consultation Booking Form (Matches Figma Page 29 Top Right) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900">Contact Information</h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-2.5">
                      <Phone className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-400">Phone & WhatsApp</p>
                        <p className="font-bold text-slate-800">{selectedLawyer.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Mail className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-400">Email</p>
                        <p className="font-bold text-slate-800">{selectedLawyer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Building2 className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-400">Office Chamber</p>
                        <p className="font-bold text-slate-800">{selectedLawyer.officeAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <a
                      href={`tel:${selectedLawyer.phone}`}
                      className="py-2.5 px-3 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call Now
                    </a>
                    <button
                      type="button"
                      onClick={() => setBookingBookedToast(true)}
                      className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Message
                    </button>
                  </div>
                </div>

                {/* Book Consultation / Document Check Form */}
                <form
                  onSubmit={handleBookConsultation}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Consultation & Vetting
                    </h3>
                    <span className="text-sm font-extrabold text-brand-800">
                      ৳ {selectedLawyer.consultationFeeBdt.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Select Service Type
                    </label>
                    <select
                      value={bookingService}
                      onChange={(e) =>
                        setBookingService(e.target.value as typeof bookingService)
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                    >
                      <option value="Document Verification">
                        Khatian & Namjari Document Verification
                      </option>
                      <option value="Legal Processing">
                        Deed Registration & Legal Processing
                      </option>
                      <option value="Deed Drafting">Co-Ownership Agreement Drafting</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Property for Review
                    </label>
                    <select
                      value={bookingPropTitle}
                      onChange={(e) => setBookingPropTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                    >
                      {properties.map((p) => (
                        <option key={p.id} value={p.title}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="text"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Time Slot
                      </label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                      >
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:30 AM">11:30 AM</option>
                        <option value="03:00 PM">03:00 PM</option>
                        <option value="05:00 PM">05:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold shadow transition"
                  >
                    Book Legal Appointment
                  </button>

                  {bookingBookedToast && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-brand-900 font-semibold">
                      ✓ Appointment booked! View it live in the Lawyer Portal Dashboard.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: NEST QUEST LEGAL — LAWYER DASHBOARD & TODAY'S APPOINTMENTS (Exact Match to Figma Page 32) */}
        {subMode === 'lawyer-dashboard' && (
          <div className="space-y-6">
            {/* Warm Legal Portal Header Card (Matches Figma Page 32 Bottom) */}
            <div className="bg-amber-50/70 rounded-2xl border border-amber-200/80 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-200/60">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
                    Nest Quest Legal • Lawyer Portal
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                    Welcome back, Adv. Rahman Ahmed
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Manage your legal consultations, Khatian/Namjari verifications, and property
                    transactions
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-amber-200">
                  <div className="w-9 h-9 rounded-full bg-brand-800 text-white font-bold text-xs flex items-center justify-center">
                    RA
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">Adv. Rahman Ahmed</p>
                    <p className="text-emerald-700 font-medium">Senior Legal Advisor</p>
                  </div>
                </div>
              </div>

              {/* 3 KPI Stat Cards (24 Active Cases, 12 Pending Verifications, 5 Today's Appointments) */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-sm">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                      <Scale className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">Active Cases</p>
                  </div>
                  <span className="text-3xl font-extrabold text-slate-900">24</span>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-sm">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">Pending Verifications</p>
                  </div>
                  <span className="text-3xl font-extrabold text-slate-900">
                    {12 + pendingProperties.length}
                  </span>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-sm">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">
                      Today&apos;s Appointments
                    </p>
                  </div>
                  <span className="text-3xl font-extrabold text-slate-900">
                    {appointments.length + 3}
                  </span>
                </div>
              </div>
            </div>

            {/* TODAY'S APPOINTMENTS SECTION (Exact Match to Figma Page 32 Top) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Today&apos;s Appointments
                  </h3>
                  <p className="text-xs text-slate-500">Thursday, January 15, 2026</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className="text-brand-800">{appointments.length} Scheduled</span>
                  <span className="text-rose-600">
                    {appointments.filter((a) => a.urgent).length} Urgent
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className={`rounded-2xl border p-5 transition ${
                      apt.status === 'Completed'
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {/* Time Badge Box (Matches Green 10:00 AM box in Figma Page 32) */}
                        <div
                          className={`w-24 py-3 px-2 rounded-xl text-center shrink-0 ${
                            apt.urgent
                              ? 'bg-brand-800 text-white'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          <Clock className="w-4 h-4 mx-auto mb-1 opacity-80" />
                          <p className="text-xs font-extrabold">{apt.time}</p>
                          <p className="text-[10px] opacity-80">{apt.duration}</p>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-base font-extrabold text-slate-900">
                              {apt.clientName}
                            </h4>
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-brand-800 text-[10px] font-bold">
                              Client
                            </span>
                            {apt.urgent && (
                              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-extrabold">
                                URGENT
                              </span>
                            )}
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                              ● {apt.mode}
                            </span>
                          </div>

                          <p className="text-xs font-bold text-brand-700">{apt.serviceType}</p>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                            <span>📞 {apt.clientPhone}</span>
                            <span>✉️ {apt.clientEmail}</span>
                          </div>

                          <div className="pt-1">
                            <p className="text-xs font-bold text-slate-800">
                              🏢 {apt.propertyTitle}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              📍 {apt.location} • {apt.propertyType}
                            </p>
                          </div>

                          <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-xs text-amber-900">
                            📋 {apt.notes}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar (Mark As Completed, Reschedule, Cancel) */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={apt.status === 'Completed'}
                        onClick={() => onCompleteAppointment(apt.id)}
                        className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                          apt.status === 'Completed'
                            ? 'bg-emerald-100 text-brand-800'
                            : 'bg-brand-700 hover:bg-brand-800 text-white shadow-sm'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {apt.status === 'Completed'
                          ? 'Consultation & Vetting Completed'
                          : 'Mark As Completed'}
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                      >
                        Reschedule
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PENDING PROPERTY LEGAL VERIFICATIONS QUEUE */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Encrypted Khatian & Namjari Verification Queue
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review seller-uploaded land registry files and issue Lawyer Verification Badge
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                  {pendingProperties.length} Pending Review
                </span>
              </div>

              {pendingProperties.length === 0 ? (
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs font-bold text-brand-800">
                  ✓ All uploaded property Khatian & Namjari records have been verified!
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingProperties.map((prop) => (
                    <div
                      key={prop.id}
                      className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/60"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{prop.title}</h4>
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                            {prop.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {prop.address} • Listed by {prop.sellerName} ({prop.priceDisplay})
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {prop.legalDocuments.map((d) => (
                            <span
                              key={d.id}
                              className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] font-medium text-slate-700"
                            >
                              📄 {d.docType}: {d.fileName}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onVerifyPropertyByLawyer(prop.id)}
                        className="px-4 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold shrink-0 shadow-sm transition"
                      >
                        ✓ Verify Legal Docs & Approve
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
