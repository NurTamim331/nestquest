import React, { useState } from 'react';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import { NavTab, UserRole } from '../types';

interface AuthViewProps {
  onSuccessAuth: (role: UserRole) => void;
  setActiveTab: (tab: NavTab) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccessAuth, setActiveTab }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<'user' | 'lawyer' | 'advisor'>('user');
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState('Nur Uddin Tamim');
  const [email, setEmail] = useState('tamim@nestquest.com');
  const [nid, setNid] = useState('1234567890123');
  const [phone, setPhone] = useState('+880 1712-345678');
  const [city, setCity] = useState('Dhaka');
  const [password, setPassword] = useState('Tamim@2026');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mappedRole: UserRole =
      selectedRole === 'lawyer' ? 'lawyer' : selectedRole === 'advisor' ? 'advisor' : 'buyer';
    onSuccessAuth(mappedRole);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-5xl w-full">
        {/* Top Mode Toggle */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`px-5 py-2 rounded-xl text-xs font-extrabold transition ${
              mode === 'login'
                ? 'bg-brand-800 text-white shadow'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            Login Page (Figma Page 24)
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`px-5 py-2 rounded-xl text-xs font-extrabold transition ${
              mode === 'register'
                ? 'bg-brand-800 text-white shadow'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            Registration Page (Figma Page 25)
          </button>
        </div>

        {/* Split Screen Card (Exact Match to Figma Pages 24 & 25) */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* LEFT COLUMN: Form */}
          <div className="lg:col-span-6 p-7 sm:p-10">
            <h1 className="text-2xl font-extrabold text-slate-900">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {mode === 'login'
                ? 'Sign in to access your property marketplace'
                : 'Join Nest Quest to start your property journey'}
            </p>

            {/* Role Selector Tabs ("I am a: User | Lawyer | Advisor") */}
            <div className="mt-5">
              <p className="text-xs font-bold text-slate-600 mb-2">I am a</p>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'user', label: 'User' },
                    { id: 'lawyer', label: 'Lawyer' },
                    { id: 'advisor', label: 'Advisor' },
                  ] as const
                ).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(r.id)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      selectedRole === r.id
                        ? 'bg-brand-700 text-white border-brand-700 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {mode === 'login' ? (
              /* SIGN-IN FORM (modern-web-guidance: autofill-sign-in-form & validate-input-after-interaction) */
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="nq-field">
                  <label htmlFor="email" className="block text-xs font-bold text-slate-700">
                    Email Address
                  </label>
                  <span id="email-hint" className="hint block">
                    Format: you@example.com
                  </span>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      spellCheck={false}
                      autoComplete="username"
                      enterKeyHint="next"
                      aria-describedby="email-hint"
                      aria-errormessage="email-error"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
                    />
                  </div>
                  <div id="email-error" className="error-msg">
                    <span aria-hidden="true">❌</span> Please enter a valid email address.
                  </div>
                </div>

                <div className="nq-field">
                  <label
                    htmlFor="current-password"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="current-password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      enterKeyHint="done"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="inline-flex items-center gap-1.5 text-slate-600 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-brand-700" />
                    Remember me
                  </label>
                  <button
                    type="button"
                    className="font-semibold text-brand-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-sm font-bold shadow-md transition"
                >
                  Sign In
                </button>
              </form>
            ) : (
              /* SIGN-UP FORM (modern-web-guidance: autofill-sign-up-form & validate-input-after-interaction) */
              <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
                <div className="nq-field">
                  <label
                    htmlFor="signup-name"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="signup-name"
                      name="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      autoComplete="name"
                      enterKeyHint="next"
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>

                <div className="nq-field">
                  <label
                    htmlFor="signup-email"
                    className="block text-xs font-bold text-slate-700"
                  >
                    Email Address
                  </label>
                  <span id="signup-email-hint" className="hint block">
                    Format: you@example.com
                  </span>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      id="signup-email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      spellCheck={false}
                      autoComplete="username"
                      enterKeyHint="next"
                      aria-describedby="signup-email-hint"
                      aria-errormessage="signup-email-error"
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div id="signup-email-error" className="error-msg">
                    <span aria-hidden="true">❌</span> Please enter a valid email address.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="signup-nid"
                      className="block text-xs font-bold text-slate-700 mb-1"
                    >
                      National ID (NID)
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        id="signup-nid"
                        name="nid"
                        inputMode="numeric"
                        value={nid}
                        onChange={(e) => setNid(e.target.value)}
                        placeholder="Enter your NID No"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="signup-phone"
                      className="block text-xs font-bold text-slate-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        id="signup-phone"
                        name="phone"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+880 1712-345678"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="signup-city"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    City
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="signup-city"
                      name="city"
                      autoComplete="address-level2"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>

                <div className="nq-field">
                  <label
                    htmlFor="new-password"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    Password
                  </label>
                  <ul id="password-rules" className="rules-list list-disc list-inside text-[11px]">
                    <li>At least 8 characters, 1 uppercase, 1 number & 1 special character</li>
                  </ul>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="new-password"
                      name="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      minLength={8}
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}"
                      aria-describedby="password-rules"
                      enterKeyHint="done"
                      className="w-full pl-10 pr-10 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <label className="inline-flex items-center gap-2 text-xs text-slate-600">
                  <input type="checkbox" required defaultChecked className="rounded text-brand-700" />
                  <span>
                    I agree to the <strong className="text-brand-700">Terms of Service</strong> and{' '}
                    <strong className="text-brand-700">Privacy Policy</strong>
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-sm font-bold shadow-md transition"
                >
                  Create Account
                </button>
              </form>
            )}

            {/* Third-Party Federated Login (Matches Figma Page 24) */}
            <div className="mt-5">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200" />
                <span className="flex-shrink mx-3 text-[11px] text-slate-400">
                  Or continue with
                </span>
                <div className="flex-grow border-t border-slate-200" />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => onSuccessAuth('buyer')}
                  className="py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2"
                >
                  <span className="text-blue-600 font-extrabold">G</span> Google
                </button>
                <button
                  type="button"
                  onClick={() => onSuccessAuth('buyer')}
                  className="py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2"
                >
                  <span className="text-blue-700 font-extrabold">f</span> Facebook
                </button>
              </div>
            </div>

            <div className="mt-5 text-center space-y-1 text-xs">
              <p className="text-slate-500">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="font-bold text-brand-700 hover:underline"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
              <p className="text-slate-400">
                Are you an admin?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('admin')}
                  className="font-bold text-brand-700 hover:underline"
                >
                  Login to Admin Portal
                </button>
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Emerald Green Feature Showcase (Exact Match to Figma Pages 24 & 25) */}
          <div className="lg:col-span-6 relative bg-brand-900 text-white p-8 sm:p-12 flex flex-col justify-center overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-800/90 via-brand-900/95 to-brand-950/95" />

            <div className="relative space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                Bangladesh&apos;s Most Trusted Property Platform
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                {mode === 'login' ? 'Find Your Perfect Property' : 'Join Nest Quest Today'}
              </h2>
              <p className="text-sm text-emerald-100/90 leading-relaxed">
                {mode === 'login'
                  ? 'Discover verified properties with smart insights, legal assistance, and AI-powered price estimation.'
                  : "Start your property journey with Bangladesh's most trusted smart property marketplace."}
              </p>

              <ul className="space-y-3.5 text-xs sm:text-sm text-emerald-50">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Verified properties with complete legal documentation (Khatian & Namjari)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Get instant lawyer and property advisor assistance</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Smart maps with flood risk, safety, and connectivity insights</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Join group buying for shared co-ownership property investment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
