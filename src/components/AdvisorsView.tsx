import React, { useState } from 'react';
import {
  Briefcase,
  Star,
  CheckCircle2,
  MapPin,
  Phone,
  MessageSquare,
  ArrowLeft,
  Send,
  FileText,
  Clock,
  TrendingUp,
  ShieldCheck,
  Award,
  DollarSign,
} from 'lucide-react';
import { Advisor, DealStageName, DealTransaction } from '../types';

interface AdvisorsViewProps {
  advisors: Advisor[];
  deals: DealTransaction[];
  onAdvanceDealStage: (dealId: string, nextStage: DealStageName) => void;
}

const DEAL_STAGES: DealStageName[] = [
  'Selected',
  'Legal Check',
  'Negotiation',
  'Payment',
  'Registration',
  'Handover',
];

export const AdvisorsView: React.FC<AdvisorsViewProps> = ({
  advisors,
  deals,
  onAdvanceDealStage,
}) => {
  const [subMode, setSubMode] = useState<
    'list' | 'advisor-detail' | 'hired-chat' | 'completed-transactions' | 'advisor-portal-profile'
  >('list');
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor>(advisors[0]);

  // Interactive Chat Messages for "My Hired Advisors" (Exact Match to Figma Page 29 Bottom)
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'c1',
      sender: 'Nur Uddin Tamim',
      isOwn: true,
      text: 'Hi Dr. Karim, I need your help with the Gulshan apartment purchase.',
      time: '10:15 AM',
    },
    {
      id: 'c2',
      sender: 'Dr. Karim Ahmed',
      isOwn: false,
      text: 'Hello! I would be happy to help. What specific concerns do you have?',
      time: '10:16 AM',
    },
    {
      id: 'c3',
      sender: 'Nur Uddin Tamim',
      isOwn: true,
      text: "I'm concerned about the rooftop access and parking allocation. The seller mentioned 2 slots, but I want to verify the deed clause.",
      time: '10:18 AM',
    },
    {
      id: 'c4',
      sender: 'Dr. Karim Ahmed',
      isOwn: false,
      text: "That's a valid concern. Could you share the property documents with me? I'll do a thorough review and negotiate the Sub-Kabala parking clause.",
      time: '10:20 AM',
    },
  ]);

  const handleSendAdvisorMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = {
      id: `c-${Date.now()}`,
      sender: 'Nur Uddin Tamim',
      isOwn: true,
      text: chatInput.trim(),
      time: 'Just Now',
    };
    setChatMessages((prev) => [
      ...prev,
      userMsg,
      {
        id: `c-reply-${Date.now()}`,
        sender: selectedAdvisor.name,
        isOwn: false,
        text: 'Thank you, Tamim! I have logged your note in our Deal Negotiation Tracker and will update the seller shortly.',
        time: 'Just Now',
      },
    ]);
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Sub-Navigation Bar to Explore All 5 Figma Advisor Screens */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-800 text-white flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Property Advisors & Deal Flow Management
              </h1>
              <p className="text-xs text-slate-500">
                SRS 4.9 & 4.12 • Verified Real Estate Advisors, Negotiation Chat & 6-Stage Deal
                Tracking
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSubMode('list')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                subMode === 'list'
                  ? 'bg-brand-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Advisors Directory
            </button>
            <button
              type="button"
              onClick={() => setSubMode('advisor-detail')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                subMode === 'advisor-detail'
                  ? 'bg-brand-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Dr. Karim Profile
            </button>
            <button
              type="button"
              onClick={() => setSubMode('hired-chat')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                subMode === 'hired-chat'
                  ? 'bg-brand-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              My Hired Advisors Chat
            </button>
            <button
              type="button"
              onClick={() => setSubMode('completed-transactions')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                subMode === 'completed-transactions'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-brand-900 border border-emerald-200'
              }`}
            >
              Advisor Deal Dashboard
            </button>
            <button
              type="button"
              onClick={() => setSubMode('advisor-portal-profile')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                subMode === 'advisor-portal-profile'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-brand-900 border border-emerald-200'
              }`}
            >
              Advisor Portal Profile
            </button>
          </div>
        </div>

        {/* SCREEN 1: PROPERTY ADVISORS LIST (Exact Match to Figma Page 29 Middle Left & Mobile Page 35) */}
        {subMode === 'list' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Property Advisors</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Connect with verified property advisors to guide your purchase & negotiate fair
                  prices
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubMode('hired-chat')}
                className="px-4 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold inline-flex items-center gap-2 self-start sm:self-auto shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                My Hired Advisors
              </button>
            </div>

            {/* 4 KPI Stat Boxes (6, 4.8, 2,130+, 100%) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <p className="text-2xl font-extrabold text-brand-800">6</p>
                <p className="text-xs text-slate-500 mt-0.5">Available Advisors</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <p className="text-2xl font-extrabold text-amber-500">4.8 ★</p>
                <p className="text-xs text-slate-500 mt-0.5">Average Rating</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <p className="text-2xl font-extrabold text-brand-800">2,130+</p>
                <p className="text-xs text-slate-500 mt-0.5">Successful Deals</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <p className="text-2xl font-extrabold text-emerald-600">100%</p>
                <p className="text-xs text-slate-500 mt-0.5">Verified Advisors</p>
              </div>
            </div>

            {/* Advisor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {advisors.map((adv) => (
                <div
                  key={adv.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={adv.image}
                          alt={adv.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-brand-600"
                        />
                        <div>
                          <h3 className="text-base font-extrabold text-slate-900">{adv.name}</h3>
                          <p className="text-xs font-bold text-amber-600 flex items-center gap-1 mt-0.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {adv.rating} ({adv.reviewsCount} reviews)
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {adv.experienceYears} years experience • {adv.location}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-brand-800 text-[10px] font-bold">
                        Available
                      </span>
                    </div>

                    <div className="mt-4">
                      <p className="text-[11px] text-slate-400 uppercase font-bold">
                        Specialization
                      </p>
                      <span className="inline-block mt-1 px-3 py-1 rounded-lg bg-emerald-50 text-brand-800 text-xs font-bold">
                        {adv.specialization}
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-[10px] text-slate-400">Deals Closed</p>
                        <p className="text-sm font-extrabold text-slate-900">{adv.dealsClosed}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Hourly Rate</p>
                        <p className="text-sm font-extrabold text-brand-800">
                          ৳ {adv.feeBdt.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Response</p>
                        <p className="text-xs font-bold text-slate-800">{adv.responseTime}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {adv.languages.map((lang) => (
                        <span
                          key={lang}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAdvisor(adv);
                        setSubMode('advisor-detail');
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold transition shadow-sm"
                    >
                      Hire Advisor
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAdvisor(adv);
                        setSubMode('hired-chat');
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700"
                      title="Chat with Advisor"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCREEN 2: ADVISOR BIO & AREAS OF EXPERTISE (Exact Match to Figma Page 29 Middle Right — Dr. Karim Ahmed) */}
        {subMode === 'advisor-detail' && (
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => setSubMode('list')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-800 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Advisors
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 4 Cols: Profile Card */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center space-y-4">
                <img
                  src={selectedAdvisor.image}
                  alt={selectedAdvisor.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-emerald-100 shadow"
                />
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">{selectedAdvisor.name}</h2>
                  <p className="text-xs font-bold text-amber-600 mt-1">
                    ★ {selectedAdvisor.rating} ({selectedAdvisor.reviewsCount} reviews)
                  </p>
                  <span className="inline-block mt-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-brand-800 text-[11px] font-bold">
                    ● Available Now
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-100 text-left space-y-2.5 text-xs text-slate-600">
                  <p>
                    🏅 <strong>{selectedAdvisor.experienceYears} years experience</strong>
                  </p>
                  <p>📍 {selectedAdvisor.location}</p>
                  <p>⚡ Response time: {selectedAdvisor.responseTime}</p>
                  <p className="text-brand-800 font-bold">
                    💵 Fee: ৳ {selectedAdvisor.feeBdt.toLocaleString()} / session
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSubMode('hired-chat')}
                  className="w-full py-3 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold shadow transition"
                >
                  Hire & Open Negotiation Chat
                </button>
              </div>

              {/* Right 8 Cols: About, Specialization & Areas of Expertise */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
                  <h3 className="text-base font-extrabold text-slate-900">About</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedAdvisor.bio}</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
                  <h3 className="text-base font-extrabold text-slate-900">Specialization</h3>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-brand-800 text-xs font-bold">
                    <Award className="w-4 h-4" />
                    {selectedAdvisor.specialization}
                  </span>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-extrabold text-slate-900">Areas of Expertise</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedAdvisor.areasOfExpertise.map((area) => (
                      <div
                        key={area}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs font-bold text-slate-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />
                        {area}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 3: MY HIRED ADVISORS CHAT (Exact Match to Figma Page 29 Bottom) */}
        {subMode === 'hired-chat' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSubMode('list')}
                className="p-2 rounded-lg hover:bg-slate-200 text-slate-600"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">My Hired Advisors</h2>
                <p className="text-xs text-slate-500">
                  Chat with your property advisors & log negotiation offers
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
              {/* Left Sidebar: Hired Advisors List */}
              <div className="lg:col-span-4 border-r border-slate-200 p-4 space-y-3 bg-slate-50/30">
                <p className="text-xs font-bold text-slate-500 px-1">
                  Your Advisors (2 active advisors)
                </p>
                {advisors.slice(0, 2).map((adv) => (
                  <button
                    key={adv.id}
                    type="button"
                    onClick={() => setSelectedAdvisor(adv)}
                    className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 ${
                      selectedAdvisor.id === adv.id
                        ? 'bg-emerald-50 border-brand-700'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={adv.image}
                      alt={adv.name}
                      className="w-11 h-11 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-extrabold text-slate-900 truncate">
                          {adv.name}
                        </p>
                        <span className="text-[10px] text-slate-400">2:30 PM</span>
                      </div>
                      <p className="text-[11px] font-bold text-amber-600">★ {adv.rating}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {adv.id === 'adv-1'
                          ? 'I will review the documents and get back to you.'
                          : 'The ROI analysis looks promising. Let us discuss.'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Right Column: Active Chat Thread */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedAdvisor.image}
                      alt={selectedAdvisor.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        {selectedAdvisor.name} ✓
                      </h3>
                      <p className="text-xs text-slate-500">
                        ★ {selectedAdvisor.rating} • {selectedAdvisor.specialization}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-1 max-h-80 overflow-y-auto bg-white">
                  {chatMessages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.isOwn ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          m.isOwn
                            ? 'bg-brand-700 text-white rounded-br-none'
                            : 'bg-slate-100 text-slate-800 rounded-bl-none'
                        }`}
                      >
                        <p>{m.text}</p>
                        <span
                          className={`block text-[10px] mt-1 text-right ${
                            m.isOwn ? 'text-emerald-200' : 'text-slate-400'
                          }`}
                        >
                          {m.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={handleSendAdvisorMessage}
                  className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask your advisor about valuation, negotiation, or deed clauses..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 4: ADVISOR DASHBOARD — COMPLETED TRANSACTIONS & DEAL FLOW (Exact Match to Figma Page 33 Top) */}
        {subMode === 'completed-transactions' && (
          <div className="space-y-6">
            <div className="bg-amber-50/60 rounded-2xl border border-amber-200/80 p-6 shadow-sm">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Completed Transactions & Deal Flow Tracker
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Successfully closed property deals, financial breakdown, and 6-stage process
                timeline
              </p>

              {/* 4 KPI Cards (Matches Figma Page 33 Top: 6, ৳12.41 Cr, ৳2.85 Lac, 23 Days) */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-brand-700 text-white rounded-2xl p-5 shadow">
                  <CheckCircle2 className="w-6 h-6 text-emerald-300 mb-2" />
                  <p className="text-xs text-emerald-100">Total Transactions</p>
                  <p className="text-2xl font-extrabold mt-0.5">6</p>
                  <p className="text-[10px] text-emerald-200 mt-1">This Month</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <DollarSign className="w-6 h-6 text-blue-600 mb-2" />
                  <p className="text-xs text-slate-500">Total Transaction Value</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-0.5">৳12.41 Cr</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <FileText className="w-6 h-6 text-amber-600 mb-2" />
                  <p className="text-xs text-slate-500">Legal & Advisory Fees</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-0.5">৳2.85 Lac</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <Clock className="w-6 h-6 text-emerald-600 mb-2" />
                  <p className="text-xs text-slate-500">Avg. Process Time</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-0.5">23 Days</p>
                </div>
              </div>
            </div>

            {/* Deals List with Financial Summary & 6-Stage Process Timeline */}
            <div className="space-y-6">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">{deal.code}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-brand-800 text-[11px] font-bold">
                          Stage: {deal.currentStage}
                        </span>
                        <span className="text-xs text-amber-500 font-bold">★★★★★</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        ✓ {deal.completedDocsCount} Verified Legal Documents Attached
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] text-slate-400">Total Property Value</p>
                      <p className="text-xl font-extrabold text-brand-800">
                        {deal.totalValueText}
                      </p>
                    </div>
                  </div>

                  {/* Property, Buyer, Seller Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Property</p>
                      <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                        {deal.propertyTitle}
                      </p>
                      <p className="text-[11px] text-slate-500">{deal.location}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Buyer</p>
                      <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                        {deal.buyerName}
                      </p>
                      <p className="text-[11px] text-slate-500">{deal.buyerPhone}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Seller</p>
                      <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                        {deal.sellerName}
                      </p>
                      <p className="text-[11px] text-slate-500">{deal.sellerPhone}</p>
                    </div>
                  </div>

                  {/* Financial Summary + 6-Stage Process Timeline (Exact Match to Figma Page 33) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2 text-xs">
                      <h4 className="font-extrabold text-slate-900 mb-2">
                        💲 Financial Summary
                      </h4>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Property Price:</span>
                        <span className="font-bold">{deal.financialSummary.propertyPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Registration Fee:</span>
                        <span className="font-bold">{deal.financialSummary.registrationFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Stamp Duty:</span>
                        <span className="font-bold">{deal.financialSummary.stampDuty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Legal & Advisor Fee:</span>
                        <span className="font-bold">
                          {deal.financialSummary.legalAndAdvisorFee}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-blue-200 flex justify-between text-sm font-extrabold text-brand-800">
                        <span>Total Cost:</span>
                        <span>{deal.financialSummary.totalCost}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-extrabold text-slate-900">
                          📋 6-Stage Deal Flow Timeline (SRS 4.12)
                        </h4>
                      </div>
                      {deal.timeline.map((step) => (
                        <div key={step.stage} className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                step.done ? 'bg-emerald-600' : 'bg-slate-300'
                              }`}
                            />
                            <strong
                              className={step.done ? 'text-slate-900' : 'text-slate-400'}
                            >
                              {step.stage}
                            </strong>
                          </span>
                          <span
                            className={`text-[11px] font-semibold ${
                              step.done ? 'text-emerald-700' : 'text-amber-600'
                            }`}
                          >
                            {step.date}
                          </span>
                        </div>
                      ))}

                      {/* Interactive Stage Advancement Button */}
                      <div className="pt-2 border-t border-emerald-200 flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 w-full">
                          Move Deal Stage:
                        </span>
                        {DEAL_STAGES.map((stg) => (
                          <button
                            key={stg}
                            type="button"
                            onClick={() => onAdvanceDealStage(deal.id, stg)}
                            className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                              deal.currentStage === stg
                                ? 'bg-brand-800 text-white'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-100'
                            }`}
                          >
                            {stg}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCREEN 5: ADVISOR PORTAL PROFILE PAGE (Exact Match to Figma Page 33 Bottom — Karim Hassan) */}
        {subMode === 'advisor-portal-profile' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="h-32 bg-gradient-to-r from-brand-800 via-emerald-700 to-brand-900 relative z-0" />
            <div className="px-6 sm:px-10 pb-8 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end gap-5 mb-6">
                <div className="-mt-12 w-24 h-24 rounded-full bg-brand-700 border-4 border-white text-white flex items-center justify-center text-2xl font-extrabold shadow-lg shrink-0">
                  KH
                </div>
                <div className="flex-1 pt-2 sm:pt-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-extrabold text-slate-900">Karim Hassan</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-brand-800 text-xs font-bold">
                      ✓ Senior Real Estate Advisor
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Advisor ID: ADV001 | License: REA-BD-2018-4567 • karim.hassan@nestquest.com •
                    +880 1712-567890
                  </p>
                </div>
              </div>

              {/* 6 Stats Row from Figma Page 33 Bottom (342, 45, 287, 589, 94.8%, ৳450M) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 py-5 border-y border-slate-100 text-center">
                <div>
                  <p className="text-xl font-extrabold text-slate-900">342</p>
                  <p className="text-[11px] text-slate-500">Total Clients</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-brand-800">45</p>
                  <p className="text-[11px] text-slate-500">Active Deals</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-emerald-700">287</p>
                  <p className="text-[11px] text-slate-500">Completed</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-slate-900">589</p>
                  <p className="text-[11px] text-slate-500">Consultations</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-emerald-600">94.8%</p>
                  <p className="text-[11px] text-slate-500">Success Rate</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-brand-800">৳450M</p>
                  <p className="text-[11px] text-slate-500">Portfolio Value</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <h3 className="font-extrabold text-sm text-slate-900">Professional Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-slate-400">Advisor ID</p>
                      <p className="font-bold text-slate-800">ADV001</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Designation</p>
                      <p className="font-bold text-slate-800">Senior Real Estate Advisor</p>
                    </div>
                    <div>
                      <p className="text-slate-400">License Number</p>
                      <p className="font-bold text-slate-800">REA-BD-2018-4567</p>
                    </div>
                    <div>
                      <p className="text-slate-400">License Authority</p>
                      <p className="font-bold text-slate-800">
                        Bangladesh Real Estate Regulatory Authority
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col items-center justify-center text-center">
                  <p className="text-xs font-bold text-slate-600">Rating & Reviews</p>
                  <p className="text-4xl font-extrabold text-slate-900 mt-1">
                    4.9 <span className="text-amber-400 text-2xl">★★★★★</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Based on 156 verified buyer reviews</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
