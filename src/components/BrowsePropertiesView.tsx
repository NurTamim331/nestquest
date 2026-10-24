import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Heart,
  Eye,
  Star,
  CheckCircle2,
  LayoutGrid,
  List,
  Layers,
  Clock,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { Property } from '../types';

interface BrowsePropertiesViewProps {
  properties: Property[];
  initialSearchQuery?: string;
  initialVerifiedOnly?: boolean;
  onSelectProperty: (property: Property) => void;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
}

const LOCATIONS = ['Gulshan', 'Banani', 'Dhanmondi', 'Uttara', 'Bashundhara'] as const;
const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Commercial', 'Land'] as const;

export const BrowsePropertiesView: React.FC<BrowsePropertiesViewProps> = ({
  properties,
  initialSearchQuery = '',
  initialVerifiedOnly = false,
  onSelectProperty,
  wishlistIds,
  onToggleWishlist,
  compareIds,
  onToggleCompare,
}) => {
  const [searchText, setSearchText] = useState(initialSearchQuery);
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [maxPriceCrore, setMaxPriceCrore] = useState<number>(5.0);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(initialVerifiedOnly);
  const [groupBuyOnly, setGroupBuyOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'score'>(
    'relevance'
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleClearFilters = () => {
    setSearchText('');
    setSelectedLocation('All');
    setSelectedType('All');
    setMaxPriceCrore(5.0);
    setVerifiedOnly(false);
    setGroupBuyOnly(false);
    setSortBy('relevance');
  };

  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        const matchesQuery =
          !searchText.trim() ||
          p.title.toLowerCase().includes(searchText.toLowerCase()) ||
          p.address.toLowerCase().includes(searchText.toLowerCase()) ||
          p.areaName.toLowerCase().includes(searchText.toLowerCase());

        const matchesLoc = selectedLocation === 'All' || p.areaName === selectedLocation;
        const matchesType = selectedType === 'All' || p.type === selectedType;
        const matchesPrice = p.priceCrore <= maxPriceCrore;
        const matchesVerified = !verifiedOnly || p.status === 'Verified';
        const matchesGroup = !groupBuyOnly || p.allowGroupBuy;

        return (
          matchesQuery &&
          matchesLoc &&
          matchesType &&
          matchesPrice &&
          matchesVerified &&
          matchesGroup
        );
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceCrore - b.priceCrore;
        if (sortBy === 'price-desc') return b.priceCrore - a.priceCrore;
        if (sortBy === 'score') return b.verificationScore - a.verificationScore;
        return b.views - a.views;
      });
  }, [
    properties,
    searchText,
    selectedLocation,
    selectedType,
    maxPriceCrore,
    verifiedOnly,
    groupBuyOnly,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Green Header Banner (Exact Match to Figma Page 26) */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold">Browse Properties</h1>
          <p className="text-emerald-100 text-sm mt-1">
            Explore 5,234 verified properties for sale across Dhaka with legal & risk transparency
          </p>

          {/* Search Bar inside Banner */}
          <div className="mt-6 bg-white rounded-xl p-2 shadow-lg max-w-4xl flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search location, road, or property title..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-brand-800 hover:bg-brand-700 text-white text-sm font-semibold transition"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Left Sidebar Filters + Right Property Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar Filters (Matches Figma Page 26) */}
        <aside className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm sticky top-24 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-base">Filters</h2>
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-semibold text-brand-700 hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Location Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2.5">
                <MapPin className="w-3.5 h-3.5 text-brand-700" />
                Location
              </h3>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedLocation('All')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    selectedLocation === 'All'
                      ? 'bg-brand-800 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  All Dhaka Locations
                </button>
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setSelectedLocation(loc)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition ${
                      selectedLocation === loc
                        ? 'bg-brand-800 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type Filter */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Property Type
              </h3>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedType('All')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    selectedType === 'All'
                      ? 'bg-brand-800 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  All Types
                </button>
                {PROPERTY_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition ${
                      selectedType === type
                        ? 'bg-brand-800 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Price Range
                </h3>
                <span className="text-xs font-bold text-brand-800">
                  Up to ৳ {maxPriceCrore.toFixed(2)} Cr
                </span>
              </div>
              <input
                type="range"
                min="0.8"
                max="5.0"
                step="0.1"
                value={maxPriceCrore}
                onChange={(e) => setMaxPriceCrore(parseFloat(e.target.value))}
                className="w-full accent-brand-700 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Min: ৳ 80 Lac</span>
                <span>Max: ৳ 5.0 Cr</span>
              </div>
            </div>

            {/* Verification & Co-ownership Checkboxes */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded text-brand-700 focus:ring-brand-600"
                />
                <span>Verified Documents Only</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={groupBuyOnly}
                  onChange={(e) => setGroupBuyOnly(e.target.checked)}
                  className="rounded text-brand-700 focus:ring-brand-600"
                />
                <span>Group Buying Eligible</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Right Property Listings Area */}
        <div className="lg:col-span-9">
          {/* Top Bar */}
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3 mb-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-800">
                5,234 properties found{' '}
                <span className="text-xs font-normal text-slate-500">
                  (Showing {filteredProperties.length} active matches)
                </span>
              </span>
              <div className="hidden sm:flex items-center border border-slate-200 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md ${
                    viewMode === 'grid'
                      ? 'bg-brand-800 text-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md ${
                    viewMode === 'list'
                      ? 'bg-brand-800 text-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-600"
              >
                <option value="relevance">Most Popular</option>
                <option value="score">Verification Score (High → Low)</option>
                <option value="price-asc">Price (Low → High)</option>
                <option value="price-desc">Price (High → Low)</option>
              </select>
            </div>
          </div>

          {/* Cards Grid / List */}
          {filteredProperties.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <p className="text-base font-bold text-slate-800">
                No properties match your current filter selection.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Try clearing filters or increasing your price range.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-4 px-5 py-2.5 rounded-xl bg-brand-800 text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredProperties.map((prop) => {
                const isSaved = wishlistIds.includes(prop.id);
                const isCompared = compareIds.includes(prop.id);
                return (
                  <div
                    key={prop.id}
                    className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition ${
                      viewMode === 'list' ? 'flex flex-col sm:flex-row' : 'flex flex-col'
                    }`}
                  >
                    {/* Image Section */}
                    <div
                      className={`relative overflow-hidden ${
                        viewMode === 'list' ? 'sm:w-72 h-52 sm:h-auto shrink-0' : 'h-52'
                      }`}
                    >
                      <img
                        src={prop.images[0]}
                        alt={prop.title}
                        className="w-full h-full object-cover hover:scale-105 transition duration-500"
                      />

                      {/* Status Badge (Top Left) */}
                      {prop.status === 'Verified' ? (
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-brand-800 text-[11px] font-bold shadow">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Verified
                        </span>
                      ) : (
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold shadow">
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          {prop.status}
                        </span>
                      )}

                      {/* Wishlist Heart Button (Top Right) */}
                      <button
                        type="button"
                        onClick={() => onToggleWishlist(prop.id)}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow transition ${
                          isSaved
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/90 text-slate-700 hover:bg-white'
                        }`}
                        title="Save to Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>

                      {/* Rating & Views Bar (Bottom of Image, Matches Figma Page 26) */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-bold">
                        <span className="px-2 py-0.5 rounded bg-slate-900/80 text-amber-300 inline-flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {prop.rating}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-900/80 text-white inline-flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {prop.views}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                            {prop.title}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                          <span className="truncate">{prop.address}</span>
                        </p>

                        <div className="mt-3 flex items-baseline justify-between">
                          <span className="text-lg font-extrabold text-brand-800">
                            {prop.priceDisplay}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            Score: <strong className="text-brand-700">{prop.verificationScore}%</strong>
                          </span>
                        </div>

                        {/* Specs Row */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                          <span className="inline-flex items-center gap-1">
                            <BedDouble className="w-3.5 h-3.5 text-slate-400" /> {prop.beds}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Bath className="w-3.5 h-3.5 text-slate-400" /> {prop.baths}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Maximize2 className="w-3.5 h-3.5 text-slate-400" /> {prop.sqft} sqft
                          </span>
                        </div>

                        {prop.allowGroupBuy && (
                          <div className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-bold text-brand-800 bg-brand-50 px-2 py-0.5 rounded">
                            <Users className="w-3 h-3" /> Co-ownership Group Buy Available
                          </div>
                        )}
                      </div>

                      {/* Footer Actions (Matches Figma Page 26) */}
                      <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400">{prop.postedAgo}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onToggleCompare(prop.id)}
                            title="Add to Compare"
                            className={`p-1.5 rounded-lg border text-xs transition ${
                              isCompared
                                ? 'border-brand-700 bg-brand-50 text-brand-800 font-bold'
                                : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            <Layers className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onSelectProperty(prop)}
                            className="px-3.5 py-1.5 rounded-lg bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold transition"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
