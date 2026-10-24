import React, { useState } from 'react';
import {
  CheckCircle2,
  CreditCard,
  Bell,
  Eye,
  Heart,
  Users,
  Home,
  LogOut,
  Edit3,
  Landmark,
  FileText,
  ShoppingBag,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { NavTab, Property } from '../types';

interface UserProfileViewProps {
  properties: Property[];
  wishlistIds: string[];
  onSelectProperty: (property: Property) => void;
  setActiveTab: (tab: NavTab) => void;
  onLogout: () => void;
  onOpenTeamModal: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  properties,
  wishlistIds,
  onSelectProperty,
  setActiveTab,
  onLogout,
  onOpenTeamModal,
}) => {
  const [bankInfoModalOpen, setBankInfoModalOpen] = useState(false);
  const [bankName, setBankName] = useState('BRAC Bank PLC — Gulshan Branch');
  const [accountNo, setAccountNo] = useState('1501-2044-8899-01');
  const [nidNumber, setNidNumber] = useState('1234567890123');
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  const savedProperties = properties.filter((p) => wishlistIds.includes(p.id));

  const transactions = [
    {
      id: 'tx-1',
      title: 'Modern Apartment in Banani',
      location: 'Banani, Dhaka',
      image:
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=300&q=80',
      type: 'Purchase',
      price: '৳ 85 Lac',
      date: 'Dec 15, 2025',
      status: 'Completed',
    },
    {
      id: 'tx-2',
      title: 'Residential Plot in Uttara',
      location: 'Uttara Sector 4, Dhaka',
      image:
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=300&q=80',
      type: 'Sale',
      price: '৳ 2.2 Cr',
      date: 'Nov 28, 2025',
      status: 'Completed',
    },
    {
      id: 'tx-3',
      title: 'Commercial Space in Gulshan',
      location: 'Gulshan-2, Dhaka',
      image:
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80',
      type: 'Purchase',
      price: '৳ 3.5 Cr',
      date: 'Nov 10, 2025',
      status: 'Pending',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Main Profile Header Card (Exact Match to Figma Page 30 Top & Mobile Page 35) */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Green Banner */}
          <div className="h-32 bg-gradient-to-r from-brand-800 via-emerald-700 to-brand-900 relative z-0">
            <div className="absolute right-4 top-4">
              <button
                type="button"
                onClick={onOpenTeamModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-950/85 border border-emerald-400/40 text-emerald-200 text-xs font-bold hover:bg-brand-950 transition shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Lead Full-Stack Developer of Nest Quest
              </button>
            </div>
          </div>

          <div className="px-6 sm:px-8 pb-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="-mt-12 w-24 h-24 rounded-full bg-brand-900 border-4 border-white text-white flex items-center justify-center text-2xl font-extrabold shadow-lg shrink-0">
                  NT
                </div>
                <div className="pt-2 sm:pt-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-extrabold text-slate-900">
                      Nur Uddin Tamim
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-brand-800 text-xs font-bold">
                      ✓ Verified Buyer & Seller
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    ✉️ tamim123@gmail.com • 📅 Member since January 2025 • UIU ID: 011 231 0331
                  </p>
                </div>
              </div>

              {/* 3 Action Buttons from Figma Page 30 & 35 (LOGOUT, Bank Information, Update Profile) */}
              <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  LOGOUT
                </button>
                <button
                  type="button"
                  onClick={() => setBankInfoModalOpen(!bankInfoModalOpen)}
                  className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition"
                >
                  <Landmark className="w-3.5 h-3.5" />
                  Bank Information
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileSavedToast(true);
                    setTimeout(() => setProfileSavedToast(false), 3000);
                  }}
                  className="px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Update Profile
                </button>
              </div>
            </div>

            {profileSavedToast && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-brand-800">
                ✓ Profile & NID verification details synced!
              </div>
            )}

            {/* Optional Bank & NID Drawer */}
            {bankInfoModalOpen && (
              <div className="mt-5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Escrow Bank & Branch
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    National ID (NID)
                  </label>
                  <input
                    type="text"
                    value={nidNumber}
                    onChange={(e) => setNidNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>
            )}

            {/* 3 Identity & Notification Info Boxes (Exact Match to Figma Page 30 & 35) */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-brand-800 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold">ID Verification</p>
                  <p className="text-sm font-extrabold text-emerald-700">✓ Verified</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold">NID Number</p>
                  <p className="text-sm font-extrabold text-slate-900 font-mono">{nidNumber}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold">Notifications</p>
                  <p className="text-sm font-extrabold text-slate-900">3 Unread</p>
                </div>
              </div>
            </div>

            {/* 4 Counter Boxes (42, 12, 2, 5 — Exact Match to Figma Page 30) */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                <Eye className="w-5 h-5 text-brand-700 mx-auto mb-1" />
                <p className="text-xl font-extrabold text-slate-900">42</p>
                <p className="text-[11px] text-slate-500">Properties Viewed</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                <Heart className="w-5 h-5 text-rose-500 mx-auto mb-1" />
                <p className="text-xl font-extrabold text-slate-900">
                  {10 + savedProperties.length}
                </p>
                <p className="text-[11px] text-slate-500">Saved Properties</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                <Users className="w-5 h-5 text-brand-700 mx-auto mb-1" />
                <p className="text-xl font-extrabold text-slate-900">2</p>
                <p className="text-[11px] text-slate-500">Groups Joined</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                <Home className="w-5 h-5 text-brand-700 mx-auto mb-1" />
                <p className="text-xl font-extrabold text-slate-900">5</p>
                <p className="text-[11px] text-slate-500">Active Listings</p>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS SECTION (Exact Match to Figma Page 30) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-base font-extrabold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('group-buying')}
              className="text-left p-4 rounded-2xl border border-slate-200 hover:border-brand-600 hover:bg-brand-50/40 transition group"
            >
              <Users className="w-5 h-5 text-brand-700 mb-2" />
              <h3 className="text-sm font-bold text-slate-900">My Groups</h3>
              <p className="text-xs text-slate-500 mt-1">
                View and manage co-ownership groups you joined
              </p>
              <span className="inline-block mt-3 text-xs font-bold text-brand-700 group-hover:underline">
                View Details →
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sell')}
              className="text-left p-4 rounded-2xl border border-slate-200 hover:border-brand-600 hover:bg-brand-50/40 transition group"
            >
              <FileText className="w-5 h-5 text-blue-600 mb-2" />
              <h3 className="text-sm font-bold text-slate-900">Sell Post Responses</h3>
              <p className="text-xs text-slate-500 mt-1">
                Check buyer offers & verification status on your listings
              </p>
              <span className="inline-block mt-3 text-xs font-bold text-brand-700 group-hover:underline">
                View Details →
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('advisors')}
              className="text-left p-4 rounded-2xl border border-slate-200 hover:border-brand-600 hover:bg-brand-50/40 transition group"
            >
              <ShoppingBag className="w-5 h-5 text-emerald-600 mb-2" />
              <h3 className="text-sm font-bold text-slate-900">Buy Interest Responses</h3>
              <p className="text-xs text-slate-500 mt-1">
                View seller & advisor responses to your buy inquiries
              </p>
              <span className="inline-block mt-3 text-xs font-bold text-brand-700 group-hover:underline">
                View Details →
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('buy')}
              className="text-left p-4 rounded-2xl border border-slate-200 hover:border-brand-600 hover:bg-brand-50/40 transition group"
            >
              <Heart className="w-5 h-5 text-rose-500 mb-2" />
              <h3 className="text-sm font-bold text-slate-900">Saved Properties</h3>
              <p className="text-xs text-slate-500 mt-1">
                View your bookmarked wishlist properties ({savedProperties.length})
              </p>
              <span className="inline-block mt-3 text-xs font-bold text-brand-700 group-hover:underline">
                View Details →
              </span>
            </button>
          </div>
        </div>

        {/* SAVED WISHLIST PROPERTIES */}
        {savedProperties.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-slate-900 mb-4">
              Saved Wishlist Properties ({savedProperties.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedProperties.map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => onSelectProperty(prop)}
                  className="cursor-pointer p-3 rounded-xl border border-slate-200 hover:border-brand-600 flex items-center gap-3 transition"
                >
                  <img
                    src={prop.images[0]}
                    alt={prop.title}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 truncate">{prop.title}</h3>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-brand-700" />
                      {prop.areaName}
                    </p>
                    <p className="text-xs font-extrabold text-brand-800 mt-1">
                      {prop.priceDisplay}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRANSACTION HISTORY TABLE (Exact Match to Figma Page 30) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-base font-extrabold text-slate-900 mb-4">Transaction History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px]">
                  <th className="py-3 px-3">Property</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={tx.image}
                          alt={tx.title}
                          className="w-12 h-10 rounded-lg object-cover shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{tx.title}</p>
                          <p className="text-[11px] text-slate-500">{tx.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          tx.type === 'Purchase'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-purple-50 text-purple-700'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-extrabold text-slate-900">{tx.price}</td>
                    <td className="py-3.5 px-3 text-slate-500">{tx.date}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          tx.status === 'Completed'
                            ? 'bg-emerald-100 text-brand-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        ✓ {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectProperty(properties[0])}
                        className="font-bold text-brand-700 hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
