import React, { useState } from 'react';
import {
  Heart,
  MessageSquare,
  Bell,
  Menu,
  X,
  ShieldCheck,
  Building2,
  Scale,
  Briefcase,
  UserCheck,
  Sparkles,
  LogIn,
  Layers,
  Wallet,
} from 'lucide-react';
import { NavTab, UserRole } from '../types';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  wishlistIds: string[];
  compareIds: string[];
  unreadCount: number;
  onOpenCompare: () => void;
  onOpenTeamModal: () => void;
  isLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
  wishlistIds,
  compareIds,
  unreadCount,
  onOpenCompare,
  onOpenTeamModal,
  isLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'buy', label: 'Buy' },
    { id: 'sell', label: 'Sell' },
    { id: 'smart-map', label: 'Smart Map' },
    { id: 'lawyers', label: 'Lawyers' },
    { id: 'advisors', label: 'Advisors' },
    { id: 'group-buying', label: 'Group Buying' },
  ];

  const handleNav = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleSwitch = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'admin') {
      handleNav('admin');
    } else if (role === 'lawyer') {
      handleNav('lawyers');
    } else if (role === 'advisor') {
      handleNav('advisors');
    } else if (role === 'seller') {
      handleNav('sell');
    } else {
      handleNav('buy');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Developer & Quick Role Switcher Bar */}
      <div className="bg-brand-950 text-emerald-100 text-xs py-1.5 px-4 border-b border-brand-900">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-800 text-emerald-200 font-semibold">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              UIU CSE 3412 • Team Vanguard
            </span>
            <span className="hidden sm:inline text-emerald-200/90">
              Engineered & Brought to Life by{' '}
              <button
                type="button"
                onClick={onOpenTeamModal}
                className="font-bold text-white underline decoration-emerald-400 hover:text-emerald-300"
              >
                Md Nur Uddin Tamim
              </button>
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] text-emerald-300/80 hidden md:inline mr-1">
              Interactive Role View:
            </span>
            {(
              [
                { id: 'buyer', label: 'Buyer/Seller', icon: UserCheck },
                { id: 'lawyer', label: 'Lawyer Portal', icon: Scale },
                { id: 'advisor', label: 'Advisor Portal', icon: Briefcase },
                { id: 'admin', label: 'Admin Panel', icon: ShieldCheck },
              ] as const
            ).map((r) => {
              const Icon = r.icon;
              const isActive =
                currentRole === r.id || (r.id === 'buyer' && currentRole === 'seller');
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleSwitch(r.id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition ${
                    isActive
                      ? 'bg-emerald-500 text-brand-950 font-bold shadow-sm'
                      : 'bg-brand-900/80 text-emerald-200 hover:bg-brand-800'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar matching Figma */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-800 flex items-center justify-center text-white shadow-sm group-hover:bg-brand-700 transition">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-brand-900 block leading-none">
              NEST QUEST
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-600 block mt-0.5">
              Verified Realty BD
            </span>
          </div>
        </button>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const active =
              activeTab === item.id ||
              (item.id === 'buy' && activeTab === 'property-details');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                  active
                    ? 'bg-brand-50 text-brand-800 font-bold'
                    : 'text-slate-600 hover:text-brand-800 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => handleNav('admin')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1 ${
              activeTab === 'admin'
                ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200'
                : 'text-slate-600 hover:text-brand-800 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-brand-700" />
            Admin
          </button>
          {currentRole === 'admin' && (
            <button
              type="button"
              onClick={() => handleNav('ledger')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1 ${
                activeTab === 'ledger'
                  ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-300'
                  : 'text-slate-600 hover:text-brand-800 hover:bg-slate-50'
              }`}
            >
              <Wallet className="w-4 h-4 text-brand-700" />
              Admin Ledger
            </button>
          )}
        </nav>

        {/* Right Action Icons & Profile Pill (Matches Figma Header) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Compare Drawer Trigger */}
          <button
            type="button"
            onClick={onOpenCompare}
            title="Compare Properties"
            className="relative p-2 rounded-lg text-slate-600 hover:text-brand-800 hover:bg-slate-100 transition"
          >
            <Layers className="w-5 h-5" />
            {compareIds.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-brand-700 text-white text-[10px] font-bold flex items-center justify-center">
                {compareIds.length}
              </span>
            )}
          </button>

          {/* Wishlist Trigger */}
          <button
            type="button"
            onClick={() => handleNav('profile')}
            title="Saved Wishlist Properties"
            className="relative p-2 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition"
          >
            <Heart className="w-5 h-5" />
            {wishlistIds.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {wishlistIds.length}
              </span>
            )}
          </button>

          {/* Messages / Group Chat Trigger */}
          <button
            type="button"
            onClick={() => handleNav('group-buying')}
            title="Messages & Negotiation Chats"
            className="relative p-2 rounded-lg text-slate-600 hover:text-brand-800 hover:bg-slate-100 transition hidden sm:inline-flex"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotifOpen(!notifOpen)}
              title="Notifications & Deal Alerts"
              className="relative p-2 rounded-lg text-slate-600 hover:text-brand-800 hover:bg-slate-100 transition"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    System Notifications
                  </span>
                  <span className="text-[11px] bg-emerald-100 text-brand-800 px-2 py-0.5 rounded-full font-semibold">
                    {unreadCount} New
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto text-xs">
                  <div className="px-4 py-2.5 hover:bg-slate-50">
                    <p className="font-semibold text-slate-800">
                      ✓ Document Verification Complete
                    </p>
                    <p className="text-slate-500 mt-0.5">
                      Advocate Rafiqul Islam verified RS Khatian for Gulshan-2 3BHK.
                    </p>
                  </div>
                  <div className="px-4 py-2.5 hover:bg-slate-50">
                    <p className="font-semibold text-slate-800">
                      👥 Group Buy Update: Dhaka Property Investors
                    </p>
                    <p className="text-slate-500 mt-0.5">
                      Sarah Ahmed committed 25% share (৳ 62.5 Lac).
                    </p>
                  </div>
                  <div className="px-4 py-2.5 hover:bg-slate-50">
                    <p className="font-semibold text-amber-700">
                      ⚠️ Fraud Alert Blocked in Gulshan
                    </p>
                    <p className="text-slate-500 mt-0.5">
                      AI Engine flagged anomalous listing 71% below market price.
                    </p>
                  </div>
                </div>
                <div className="px-4 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setNotifOpen(false);
                      handleNav('profile');
                    }}
                    className="w-full text-center text-xs font-semibold text-brand-700 hover:underline py-1"
                  >
                    View All in Profile →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge (Nur Uddin Tamim as in Figma) */}
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => handleNav('profile')}
              className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border transition ${
                activeTab === 'profile'
                  ? 'border-brand-600 bg-brand-50'
                  : 'border-slate-200 hover:border-brand-500 bg-white'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-brand-800 text-white text-xs font-bold flex items-center justify-center">
                NT
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-none">
                  Nur Uddin Tamim
                </p>
                <p className="text-[10px] text-emerald-700 font-medium leading-none mt-0.5">
                  ✓ Verified Member
                </p>
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleNav('auth')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-800 text-white text-xs font-semibold hover:bg-brand-700 transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}

          {/* Sign In / Register Screen Preview Button */}
          <button
            type="button"
            onClick={() => handleNav('auth')}
            className="hidden xl:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-brand-200 text-brand-800 hover:bg-brand-50 text-xs font-semibold transition"
          >
            Auth Screens
          </button>

          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer (Matches Figma Mobile Menu on Page 35) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-brand-900 text-white px-4 pt-3 pb-5 space-y-2 border-t border-brand-800">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                activeTab === item.id
                  ? 'bg-emerald-500 text-brand-950 font-bold'
                  : 'text-emerald-100 hover:bg-brand-800'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-brand-800 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleNav('profile')}
              className="flex-1 py-2 px-3 rounded-lg bg-brand-800 text-xs font-semibold text-center"
            >
              My Profile (Tamim)
            </button>
            <button
              type="button"
              onClick={() => handleNav('admin')}
              className="flex-1 py-2 px-3 rounded-lg bg-amber-500 text-brand-950 text-xs font-bold text-center"
            >
              Admin Dashboard
            </button>
            <button
              type="button"
              onClick={() => handleNav('auth')}
              className="w-full py-2 px-3 rounded-lg border border-emerald-400/40 text-xs font-semibold text-center"
            >
              Login / Registration Screens
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
