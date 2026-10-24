import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  MapPin,
  Scale,
  Users,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  ArrowRight,
  BedDouble,
  Bath,
  Maximize2,
  Heart,
  Eye,
  Star,
  AlertTriangle,
  Calculator,
  Award,
} from 'lucide-react';
import { NavTab, Property } from '../types';

interface HeroHomeViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onSearchNavigate: (query: string, verifiedOnly: boolean) => void;
  setActiveTab: (tab: NavTab) => void;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onOpenTeamModal: () => void;
}

export const HeroHomeView: React.FC<HeroHomeViewProps> = ({
  properties,
  onSelectProperty,
  onSearchNavigate,
  setActiveTab,
  wishlistIds,
  onToggleWishlist,
  onOpenTeamModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [budgetCrore, setBudgetCrore] = useState<number>(2.8);
  const [preferredArea, setPreferredArea] = useState<string>('All');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchNavigate(searchQuery, verifiedOnly);
  };

  // AI Budget Recommendation filter (Requirement 4.6)
  const budgetRecommendations = properties.filter((p) => {
    const withinBudget = p.priceCrore <= budgetCrore + 0.35;
    const areaMatch = preferredArea === 'All' || p.areaName === preferredArea;
    return withinBudget && areaMatch && p.status === 'Verified';
  });

  return (
    <div>
      {/* HERO SECTION (Exact Match to Figma Pages 24 & 25) */}
      <section className="relative bg-brand-950 text-white overflow-hidden">
        {/* Background Architectural Image with Forest Green Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1800&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-900/95 to-brand-900/75" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 lg:pt-20 lg:pb-24">
          <div className="max-w-3xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-800/90 border border-emerald-400/30 text-xs font-medium text-emerald-100 mb-6 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Platform</span>
              <span className="text-emerald-400">•</span>
              <span className="inline-flex items-center gap-1 text-amber-300 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                4.9 Rating
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Discover Your
              <span className="block text-emerald-400 mt-1">Perfect Home</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-emerald-100/90 max-w-2xl leading-relaxed">
              Verified properties with legal support, AI-powered pricing, and complete
              transparency. Your dream property in Bangladesh is just a search away.
            </p>

            {/* Search Card inside Hero (Exact Match to Figma) */}
            <form
              onSubmit={handleHeroSearch}
              className="mt-8 bg-white rounded-2xl p-3 sm:p-4 shadow-2xl border border-emerald-500/20 max-w-2xl text-slate-800"
            >
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <MapPin className="w-5 h-5 text-brand-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search location (e.g., Gulshan, Banani, Dhanmondi, Uttara)..."
                    enterKeyHint="search"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-brand-800 hover:bg-brand-700 text-white font-semibold text-sm shadow-md transition"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>

              {/* Bottom Filter Bar inside White Search Box */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <button
                  type="button"
                  onClick={() => setActiveTab('buy')}
                  className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-brand-800"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-brand-700" />
                  Advanced Filters
                </button>

                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer select-none font-medium text-brand-800">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="rounded text-brand-700 focus:ring-brand-600"
                    />
                    Verified Only
                  </label>
                  <button
                    type="button"
                    onClick={() => onSearchNavigate('', false)}
                    className="font-medium text-slate-500 hover:text-brand-800"
                  >
                    New Listings
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Bottom Stats Counter Strip (Exact Match to Figma Page 25 & Mobile Page 34) */}
          <div className="mt-12 pt-8 border-t border-emerald-800/60 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl">
            <div className="bg-brand-900/60 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-white">5000+</p>
                <p className="text-xs text-emerald-200/80">Properties</p>
              </div>
            </div>

            <div className="bg-brand-900/60 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-white">100%</p>
                <p className="text-xs text-emerald-200/80">Verified</p>
              </div>
            </div>

            <div className="bg-brand-900/60 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-white">200+</p>
                <p className="text-xs text-emerald-200/80">Legal Experts</p>
              </div>
            </div>

            <div className="bg-brand-900/60 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-white">98%</p>
                <p className="text-xs text-emerald-200/80">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESSENTIAL FEATURES SECTION (From Mobile Screen Page 34 & SRS Chapter 3.6) */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
              Why Nest Quest
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
              Essential Features Built for Trust & Transparency
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Solving Bangladesh’s biggest real estate challenges: fake listings, unclear pricing,
              Khatian/Namjari confusion, and unverified brokers.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              onClick={() => setActiveTab('lawyers')}
              className="cursor-pointer group rounded-2xl p-6 bg-slate-50 hover:bg-brand-50/60 border border-slate-200 hover:border-brand-300 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-800 text-white flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Document & Lawyer Verification
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Every listing’s Khatian, Mutation (Namjari), Title Deed, and Khajna tax receipts are
                encrypted and vetted by Supreme Court lawyers & admins.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-700">
                Explore Legal Portal <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div
              onClick={() => setActiveTab('smart-map')}
              className="cursor-pointer group rounded-2xl p-6 bg-slate-50 hover:bg-brand-50/60 border border-slate-200 hover:border-brand-300 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-800 text-white flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Smart Map & Area Risk Insights
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Interactive map with flood & waterlogging indicators, crime safety scores, noise
                levels, and nearby hospitals, schools, and police stations.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-700">
                Open Smart Map <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div
              onClick={() => setActiveTab('group-buying')}
              className="cursor-pointer group rounded-2xl p-6 bg-slate-50 hover:bg-brand-50/60 border border-slate-200 hover:border-brand-300 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-800 text-white flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Group Buying (Co-Ownership)
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Co-invest in high-value properties with verified buyers. Define share percentages,
                generate legal co-ownership agreements, and vote in group chat.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-700">
                Join a Buying Group <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div
              onClick={() => setActiveTab('advisors')}
              className="cursor-pointer group rounded-2xl p-6 bg-slate-50 hover:bg-brand-50/60 border border-slate-200 hover:border-brand-300 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-800 text-white flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                AI Price Estimator & Deal Tracker
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Data-driven fair price estimation, automatic fraud alerts for anomalous prices, and
                6-stage Deal Flow tracking with licensed advisors.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-700">
                Consult Advisors <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED VERIFIED PROPERTIES SECTION */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
                100% Khatian & Namjari Checked
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Featured Verified Properties in Dhaka
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('buy')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-800 text-white text-xs font-semibold hover:bg-brand-700 transition self-start sm:self-auto"
            >
              View All {properties.length} Listings
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.slice(0, 3).map((prop) => {
              const isSaved = wishlistIds.includes(prop.id);
              return (
                <div
                  key={prop.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                    {/* Top Left Verified Badge */}
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-brand-800 text-xs font-bold shadow">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {prop.status} ({prop.verificationScore}%)
                    </span>

                    {/* Top Right Wishlist Button */}
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(prop.id)}
                      aria-label="Save to Wishlist"
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow transition ${
                        isSaved
                          ? 'bg-rose-500 text-white'
                          : 'bg-white/90 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>

                    {/* Bottom Overlay Rating & Views */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-semibold">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-900/80 text-amber-300 inline-flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {prop.rating}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-900/80 text-white inline-flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {prop.views}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
                        {prop.title}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                        {prop.address}
                      </p>

                      <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-xl font-extrabold text-brand-800">
                          {prop.priceDisplay}
                        </span>
                        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                          AI Est: {prop.aiEstimate.rangeText}
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <BedDouble className="w-4 h-4 text-slate-400" /> {prop.beds} Bed
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Bath className="w-4 h-4 text-slate-400" /> {prop.baths} Bath
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Maximize2 className="w-4 h-4 text-slate-400" /> {prop.sqft} sqft
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">{prop.postedAgo}</span>
                      <button
                        type="button"
                        onClick={() => onSelectProperty(prop)}
                        className="px-4 py-2 rounded-lg bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold transition"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI PRICE ESTIMATION & BUDGET RECOMMENDATION WIDGET (SRS Requirement 4.6) */}
      <section className="py-14 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                  <Calculator className="w-4 h-4" />
                  SRS 4.6 • AI Budget Recommendation Engine
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                  Not Sure Where to Buy Within Your Budget?
                </h2>
                <p className="text-sm text-emerald-100/90 leading-relaxed">
                  Adjust your target budget below. Our estimation model analyzes historical Dhaka
                  land prices, flood/noise risk scores, and nearby services to suggest verified
                  properties with confidence scores.
                </p>

                <div className="bg-brand-950/70 border border-emerald-500/30 rounded-2xl p-5 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span className="text-emerald-200">Your Maximum Budget:</span>
                      <span className="text-emerald-400 text-base font-extrabold">
                        ৳ {budgetCrore.toFixed(2)} Crore
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.8"
                      max="4.5"
                      step="0.1"
                      value={budgetCrore}
                      onChange={(e) => setBudgetCrore(parseFloat(e.target.value))}
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-emerald-300/70 mt-1">
                      <span>৳ 80 Lac</span>
                      <span>৳ 2.5 Cr</span>
                      <span>৳ 4.5 Cr</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-emerald-200 mb-1.5">
                      Preferred Dhaka Zone:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {['All', 'Gulshan', 'Banani', 'Dhanmondi', 'Uttara'].map((zone) => (
                        <button
                          key={zone}
                          type="button"
                          onClick={() => setPreferredArea(zone)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                            preferredArea === zone
                              ? 'bg-emerald-400 text-brand-950 font-bold'
                              : 'bg-brand-800 text-emerald-100 hover:bg-brand-700'
                          }`}
                        >
                          {zone}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white text-slate-900 rounded-2xl p-5 sm:p-6 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      AI Matched Properties & Area Insights
                    </h3>
                    <p className="text-xs text-slate-500">
                      Showing verified properties matching ৳ {budgetCrore.toFixed(2)} Cr budget
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-brand-800 text-xs font-bold">
                    {budgetRecommendations.length} Matches
                  </span>
                </div>

                {budgetRecommendations.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">
                      No individual listings under ৳ {budgetCrore.toFixed(2)} Cr in {preferredArea}.
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Tip: Try Group Buying (Co-ownership) to buy a share starting from ৳ 40 Lac!
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('group-buying')}
                      className="mt-3 px-4 py-2 rounded-lg bg-brand-800 text-white text-xs font-bold"
                    >
                      Explore Group Buying Shares
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {budgetRecommendations.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl border border-slate-200 hover:border-brand-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition bg-slate-50/60"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-16 h-16 rounded-lg object-cover shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-brand-800">
                                {item.aiEstimate.confidence}% AI Confidence
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{item.address}</p>
                            <div className="flex items-center gap-3 mt-1 text-[11px] font-semibold text-slate-600">
                              <span className="text-brand-800 font-bold">{item.priceDisplay}</span>
                              <span>•</span>
                              <span>Fair Est: {item.aiEstimate.rangeText}</span>
                              <span>•</span>
                              <span className="text-emerald-700">
                                Safety: {item.riskAssessment.safetyScore}/10
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onSelectProperty(item)}
                          className="px-3.5 py-2 rounded-lg bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold shrink-0 self-start sm:self-center"
                        >
                          Inspect
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEVELOPER & TEAM VANGUARD HIGHLIGHT BANNER */}
      <section className="py-10 bg-emerald-50/70 border-t border-emerald-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
              Project Credits • UIU CSE 3412 (System Analysis & Design Lab)
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Engineered & Brought to Life by{' '}
              <span className="text-brand-800 underline decoration-emerald-400">
                Md Nur Uddin Tamim
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Original UI/UX prototype designed in Figma by Team Vanguard (Tamim, Tanveer, Rakib,
              Rithik & Afnan). Full-stack web architecture, interactive GIS map, verification engine,
              and deployment engineered by <strong>Md Nur Uddin Tamim (011 231 0331)</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenTeamModal}
            className="px-5 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold shadow-sm shrink-0 transition"
          >
            View Full Team & Project Credits
          </button>
        </div>
      </section>
    </div>
  );
};
