import React, { useState } from 'react';
import {
  ShieldCheck,
  Home,
  Clock,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lock,
  TrendingUp,
  UserCheck,
  Search,
} from 'lucide-react';
import { FraudAlert, Property } from '../types';

interface AdminDashboardViewProps {
  properties: Property[];
  fraudAlerts: FraudAlert[];
  onApproveProperty: (propertyId: string) => void;
  onRejectProperty: (propertyId: string) => void;
  onResolveFraudAlert: (alertId: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  properties,
  fraudAlerts,
  onApproveProperty,
  onRejectProperty,
  onResolveFraudAlert,
}) => {
  const [adminTab, setAdminTab] = useState<
    | 'dashboard'
    | 'seller-posts'
    | 'fraud-reports'
    | 'admin-profile'
    | 'admin-login-preview'
  >('dashboard');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const pendingProps = properties.filter((p) => p.status !== 'Verified');
  const openFraudAlerts = fraudAlerts.filter((f) => f.status !== 'Resolved');

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Admin Navigation Bar (Matches Figma Page 31 Top Header) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'seller-posts', label: `Seller Posts (${pendingProps.length} Pending)` },
                {
                  id: 'fraud-reports',
                  label: `Reports & Fraud Alerts (${openFraudAlerts.length})`,
                },
                { id: 'admin-profile', label: 'Admin Profile (Mohammad Rahman)' },
                { id: 'admin-login-preview', label: 'Admin Login Screen' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAdminTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  adminTab === tab.id
                    ? 'bg-brand-800 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <div className="w-7 h-7 rounded-full bg-brand-800 text-white flex items-center justify-center text-[11px]">
              MR
            </div>
            <span>Admin: Mohammad Rahman</span>
          </div>
        </div>

        {/* TAB 1: ADMIN DASHBOARD (Exact Match to Figma Page 31 Top) */}
        {adminTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h1 className="text-2xl font-extrabold text-slate-900">Admin Dashboard</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Manage and monitor all property transactions, approvals, and user activities
              </p>

              {/* 4 KPI Cards (5,234 | 47 | 128 | 12,453 — Exact Match to Figma Page 31) */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-700 text-white flex items-center justify-center">
                      <Home className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" /> +12%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Total Properties</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                    {(5227 + properties.length).toLocaleString()}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">Pending Approvals</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                    {46 + pendingProps.length}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" /> +8%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Active Buy Requests</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-0.5">128</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" /> +15%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Total Users</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-0.5">12,453</p>
                </div>
              </div>

              {/* Today's Activity & Pending Actions (Exact Match to Figma Page 31) */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Activity */}
                <div className="p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h2 className="text-base font-extrabold text-slate-900">
                    Today&apos;s Activity
                  </h2>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="py-3 flex items-center justify-between">
                      <span className="text-slate-600 font-medium">New Property Listings</span>
                      <span className="font-extrabold text-slate-900 text-sm">23</span>
                    </div>
                    <div className="py-3 flex items-center justify-between">
                      <span className="text-slate-600 font-medium">New Buy Requests</span>
                      <span className="font-extrabold text-slate-900 text-sm">18</span>
                    </div>
                    <div className="py-3 flex items-center justify-between">
                      <span className="text-slate-600 font-medium">Completed Transactions</span>
                      <span className="font-extrabold text-slate-900 text-sm">5</span>
                    </div>
                    <div className="py-3 flex items-center justify-between">
                      <span className="text-slate-600 font-medium">New User Registrations</span>
                      <span className="font-extrabold text-slate-900 text-sm">42</span>
                    </div>
                  </div>
                </div>

                {/* Pending Actions */}
                <div className="p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h2 className="text-base font-extrabold text-slate-900">Pending Actions</h2>

                  <button
                    type="button"
                    onClick={() => setAdminTab('seller-posts')}
                    className="w-full text-left p-3.5 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 flex items-center justify-between transition"
                  >
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">
                        Seller Post Approvals
                      </p>
                      <p className="text-[11px] text-amber-800">Requires immediate attention</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-200 text-amber-950 text-xs font-extrabold">
                      {46 + pendingProps.length}
                    </span>
                  </button>

                  <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">
                        Cancellation Requests
                      </p>
                      <p className="text-[11px] text-rose-700">5 high priority</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-rose-200 text-rose-900 text-xs font-extrabold">
                      12
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAdminTab('seller-posts')}
                    className="w-full text-left p-3.5 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200 flex items-center justify-between transition"
                  >
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">
                        Document Verifications
                      </p>
                      <p className="text-[11px] text-blue-700">Awaiting admin / lawyer review</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-blue-200 text-blue-900 text-xs font-extrabold">
                      28
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Seller Post Approval & Fraud Alert Preview inside Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Seller Post Approval Queue */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Seller Post Verification Queue
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                    {pendingProps.length} Actionable Now
                  </span>
                </div>

                {pendingProps.length === 0 ? (
                  <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs font-bold text-brand-800">
                    ✓ All submitted Seller Posts have been approved and published!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingProps.map((prop) => (
                      <div
                        key={prop.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-extrabold text-slate-900">{prop.title}</h4>
                            <p className="text-xs text-slate-500">
                              {prop.address} • {prop.priceDisplay} • Seller: {prop.sellerName}
                            </p>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                            {prop.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {prop.legalDocuments.map((d) => (
                            <span
                              key={d.id}
                              className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-semibold text-slate-700"
                            >
                              🔒 {d.docType}: {d.fileName}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => onApproveProperty(prop.id)}
                            className="flex-1 py-2 px-3 rounded-lg bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approve & Publish
                          </button>
                          <button
                            type="button"
                            onClick={() => onRejectProperty(prop.id)}
                            className="py-2 px-3 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center justify-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Fraud Detection & Alerts (SRS 4.13) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      AI Fraud Detection & Anomaly Alerts (SRS 4.13)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Automated scanning for price anomalies & duplicate Khatian deeds
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                    {openFraudAlerts.length} Flagged
                  </span>
                </div>

                <div className="space-y-3">
                  {fraudAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-xl border space-y-2 ${
                        alert.status === 'Resolved'
                          ? 'bg-slate-50 border-slate-200 opacity-75'
                          : 'bg-rose-50/50 border-rose-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          <h4 className="text-xs font-extrabold text-slate-900">
                            {alert.propertyTitle}
                          </h4>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            alert.status === 'Resolved'
                              ? 'bg-emerald-100 text-brand-800'
                              : 'bg-rose-200 text-rose-900'
                          }`}
                        >
                          {alert.status}
                        </span>
                      </div>
                      <p className="text-xs text-rose-900 leading-relaxed">{alert.reason}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                        <span>
                          Listed: <strong>{alert.listedPriceText}</strong> vs Market Est:{' '}
                          <strong>{alert.estimatedMarketText}</strong>
                        </span>
                        {alert.status !== 'Resolved' && (
                          <button
                            type="button"
                            onClick={() => onResolveFraudAlert(alert.id)}
                            className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px]"
                          >
                            Block & Resolve Alert
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2 & 3: Dedicated Seller Posts or Fraud Reports View */}
        {(adminTab === 'seller-posts' || adminTab === 'fraud-reports') && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900">
              {adminTab === 'seller-posts'
                ? 'All Property Verification & Seller Submissions'
                : 'Fraud Detection & Security Audit Logs'}
            </h2>
            <div className="space-y-3">
              {properties.map((prop) => (
                <div
                  key={prop.id}
                  className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-16 h-14 rounded-lg object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{prop.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            prop.status === 'Verified'
                              ? 'bg-emerald-100 text-brand-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {prop.status} ({prop.verificationScore}%)
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {prop.address} • {prop.priceDisplay} • Seller: {prop.sellerName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {prop.status !== 'Verified' ? (
                      <button
                        type="button"
                        onClick={() => onApproveProperty(prop.id)}
                        className="px-4 py-2 rounded-xl bg-brand-800 text-white text-xs font-bold"
                      >
                        ✓ Approve Now
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700">
                        ✓ Published & Verified
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ADMIN PROFILE (Exact Match to Figma Page 31 Bottom — Mohammad Rahman) */}
        {adminTab === 'admin-profile' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="h-32 bg-gradient-to-r from-brand-800 via-emerald-700 to-brand-900 relative z-0" />
            <div className="px-6 sm:px-10 pb-8 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end gap-5 mb-6">
                <div className="-mt-12 w-24 h-24 rounded-full bg-brand-700 border-4 border-white text-white flex items-center justify-center text-2xl font-extrabold shadow-lg shrink-0">
                  MR
                </div>
                <div className="pt-2 sm:pt-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-extrabold text-slate-900">Mohammad Rahman</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                      🛡️ Super Administrator
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Admin ID: ADM001 • admin@nestquest.com • +880 1711-000000 • Dhaka, Bangladesh •
                    Last login: 2 hours ago
                  </p>
                </div>
              </div>

              {/* 4 Stats Row from Figma Page 31 Bottom (2,847 | 1,523 | 342 | 45) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-y border-slate-100 text-center">
                <div>
                  <p className="text-xl font-extrabold text-slate-900">2,847</p>
                  <p className="text-[11px] text-slate-500">Total Actions</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-brand-800">1,523</p>
                  <p className="text-[11px] text-slate-500">Approved Listings</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-amber-600">342</p>
                  <p className="text-[11px] text-slate-500">Reviewed Issues</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-blue-600">45</p>
                  <p className="text-[11px] text-slate-500">System Updates</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Details */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <h3 className="font-extrabold text-sm text-slate-900">Account Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-slate-400">Admin ID</p>
                      <p className="font-bold text-slate-800">ADM001</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Role</p>
                      <p className="font-bold text-slate-800">Super Administrator</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Join Date</p>
                      <p className="font-bold text-slate-800">January 15, 2023</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Account Status</p>
                      <p className="font-bold text-emerald-700">✓ Active</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-400">Office Address</p>
                      <p className="font-bold text-slate-800">
                        NestQuest Headquarters, Gulshan-2, Dhaka 1212
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <h3 className="font-extrabold text-sm text-slate-900">Security</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">Two-Factor Authentication</p>
                      <p className="text-slate-500 text-[11px]">Enabled for high-risk actions</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                      className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                        twoFactorEnabled
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {twoFactorEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between">
                    <span className="text-slate-500">Last Password Change</span>
                    <span className="font-bold text-slate-800">November 15, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Failed Login Attempts</span>
                    <span className="font-bold text-slate-800">0</span>
                  </div>
                </div>
              </div>

              {/* System Permissions */}
              <div className="mt-6 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                <h3 className="font-extrabold text-sm text-slate-900 mb-2">System Permissions</h3>
                <p className="text-xs text-slate-600 mb-3">
                  You have full administrative access to all platform features:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    '✓ User Management',
                    '✓ Property Management',
                    '✓ Encrypted Khatian Access',
                    '✓ Fraud Alert Enforcement',
                  ].map((perm) => (
                    <span
                      key={perm}
                      className="px-3 py-1 rounded-lg bg-white border border-emerald-200 text-brand-800 text-xs font-bold"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ADMIN LOGIN SCREEN PREVIEW (Exact Match to Figma Page 30 Bottom) */}
        {adminTab === 'admin-login-preview' && (
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-5">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Admin Login</h2>
              <p className="text-xs text-slate-500 mt-1">Sign in to access the admin dashboard</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAdminTab('dashboard');
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="admin-email"
                  type="email"
                  defaultValue="admin@nestquest.com"
                  autocomplete="username"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  defaultValue="AdminSecret2026!"
                  autocomplete="current-password"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="inline-flex items-center gap-1.5 text-slate-600">
                  <input type="checkbox" defaultChecked className="rounded text-brand-700" />
                  Remember me
                </label>
                <span className="text-brand-700 font-semibold cursor-pointer">
                  Forgot password?
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow transition"
              >
                Sign In
              </button>
            </form>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-brand-900">
              <Lock className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
              <p>
                <strong>Security Notice:</strong> This is a secure admin area. All access attempts
                are logged and monitored.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
