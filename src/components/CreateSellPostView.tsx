import React, { useState } from 'react';
import {
  Info,
  Upload,
  ShieldAlert,
  CheckCircle2,
  FileText,
  MapPin,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { NavTab, Property } from '../types';

interface CreateSellPostViewProps {
  onAddProperty: (newProp: Property) => void;
  setActiveTab: (tab: NavTab) => void;
}

export const CreateSellPostView: React.FC<CreateSellPostViewProps> = ({
  onAddProperty,
  setActiveTab,
}) => {
  const [title, setTitle] = useState('');
  const [areaName, setAreaName] = useState<Property['areaName']>('Gulshan');
  const [address, setAddress] = useState('');
  const [sqft, setSqft] = useState('1950');
  const [beds, setBeds] = useState('3');
  const [baths, setBaths] = useState('3');
  const [propType, setPropType] = useState<Property['type']>('Apartment');
  const [priceCrore, setPriceCrore] = useState('2.65');
  const [yearBuilt, setYearBuilt] = useState('2024');
  const [description, setDescription] = useState('');
  const [allowGroupBuy, setAllowGroupBuy] = useState(true);

  const [selectedCoverUrl, setSelectedCoverUrl] = useState(
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  );
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([
    'RS_Khatian_Gulshan_Signed.pdf',
    'Mutation_Namjari_Certificate_2025.pdf',
    'SubKabala_Title_Deed.pdf',
  ]);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleDocUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const names = Array.from(files).map((f) => f.name);
    setUploadedDocs((prev) => [...prev, ...names]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = parseFloat(priceCrore) || 2.5;
    const numericSqft = parseInt(sqft, 10) || 1850;

    const coordsMap: Record<Property['areaName'], [number, number]> = {
      Gulshan: [23.7955, 90.4155],
      Banani: [23.794, 90.405],
      Dhanmondi: [23.7465, 90.3765],
      Uttara: [23.868, 90.398],
      Bashundhara: [23.818, 90.431],
      Mirpur: [23.806, 90.368],
    };

    const newProp: Property = {
      id: `prop-${Date.now().toString().slice(-4)}`,
      title: title.trim() || `Modern ${beds}BHK ${propType} in ${areaName}`,
      areaName,
      address: address.trim() || `Road 45, ${areaName}, Dhaka`,
      priceCrore: numericPrice,
      priceDisplay:
        numericPrice >= 1
          ? `৳ ${numericPrice.toFixed(2)} Crore`
          : `৳ ${Math.round(numericPrice * 100)} Lac`,
      type: propType,
      beds: parseInt(beds, 10) || 3,
      baths: parseInt(baths, 10) || 3,
      sqft: numericSqft,
      floor: '5th Floor',
      parking: 2,
      facing: 'South',
      yearBuilt: parseInt(yearBuilt, 10) || 2024,
      verificationScore: 84,
      status: 'Pending Verification',
      rating: 4.8,
      views: 1,
      postedAgo: 'Just Now',
      images: [selectedCoverUrl],
      coordinates: coordsMap[areaName],
      sellerName: 'Nur Uddin Tamim',
      sellerRole: 'Verified Seller',
      sellerPhone: '+880 1712-345678',
      sellerEmail: 'tamim@nestquest.com',
      sellerVerified: true,
      description:
        description.trim() ||
        'Newly listed property on Nest Quest with complete encrypted Khatian and Mutation (Namjari) documentation submitted for Admin and Lawyer verification.',
      amenities: ['24/7 CCTV Security', 'Backup Generator', 'Covered Parking', 'Lift'],
      aiEstimate: {
        minCrore: Number((numericPrice * 0.94).toFixed(2)),
        maxCrore: Number((numericPrice * 1.06).toFixed(2)),
        rangeText: `৳ ${(numericPrice * 0.94).toFixed(2)} - ${(numericPrice * 1.06).toFixed(2)} Cr`,
        pricePerSqft: Math.round((numericPrice * 10000000) / numericSqft),
        confidence: 91,
        appreciationNote: `AI Estimation confirms fair pricing for ${areaName} based on ${numericSqft} sq.ft area.`,
      },
      riskAssessment: {
        floodRisk: 'Low',
        crimeRate: 'Low',
        noiseLevel: 'Medium',
        connectivity: 'Excellent',
        gasWaterSupply: '24/7 Active',
        safetyScore: 8.6,
      },
      nearbyServices: [],
      legalDocuments: uploadedDocs.map((fileName, idx) => ({
        id: `doc-new-${idx}`,
        docType:
          idx === 0
            ? 'Khatian (CS/RS/BS)'
            : idx === 1
            ? 'Mutation (Namjari)'
            : 'Title Deed (Dalil)',
        fileName,
        uploadedAt: '2026-02-09',
        status: 'Pending Review',
      })),
      allowGroupBuy,
    };

    onAddProperty(newProp);
    setSubmittedSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {submittedSuccess && (
          <div className="mb-6 p-6 rounded-2xl bg-emerald-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-extrabold">
                  Sell Post Submitted for Admin & Legal Verification!
                </h2>
                <p className="text-xs text-emerald-100 mt-1">
                  Your property and encrypted Khatian/Namjari documents have been added to the
                  verification queue. You can approve it right now in the Admin Dashboard or Lawyer
                  Portal!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className="px-4 py-2 rounded-xl bg-emerald-400 text-brand-950 text-xs font-extrabold hover:bg-emerald-300 transition"
              >
                Approve in Admin Panel →
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('buy')}
                className="px-4 py-2 rounded-xl bg-brand-800 text-white text-xs font-bold hover:bg-brand-700 transition"
              >
                View Listings
              </button>
            </div>
          </div>
        )}

        {/* Main Card (Exact Match to Figma Page 28 & Mobile Page 34) */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8"
        >
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Create Sell Post</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              List your property for sale on Nest Quest marketplace
            </p>
          </div>

          {/* Blue Admin Approval Required Alert (Exact Text from Figma Page 28 & 34) */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-blue-950">
                Admin Approval Required
              </h2>
              <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                Your property listing will be reviewed by our admin team before going live. This
                typically takes 24-48 hours. The admin will verify your legal documents for initial
                validation. Complete verification will be done by our legal team before any
                transaction proceeds.
              </p>
            </div>
          </div>

          {/* SECTION 1: PROPERTY IMAGES (Matches Figma Page 28) */}
          <div className="space-y-3">
            <label className="block text-sm font-extrabold text-slate-900">
              Property Images <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500">
              Upload high-quality images of your property. First image will be used as the cover
              photo. (Minimum 1 required, Maximum 4 allowed)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <label className="border-2 border-dashed border-slate-300 hover:border-brand-600 rounded-2xl p-6 text-center cursor-pointer bg-slate-50/70 transition flex flex-col items-center justify-center h-44">
                <Upload className="w-7 h-7 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-700">Upload Property Photos</span>
                <span className="text-[11px] text-slate-400 mt-1">
                  Supported formats: JPG, PNG, WEBP. Maximum file size: 5MB per image.
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedCoverUrl(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>

              <div className="space-y-2">
                <img
                  src={selectedCoverUrl}
                  alt="Cover Preview"
                  className="w-full h-32 object-cover rounded-xl border border-slate-200"
                />
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-slate-500 font-medium">Quick Sample Photo:</span>
                  {[
                    {
                      label: 'Gulshan Flat',
                      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                    },
                    {
                      label: 'Banani Villa',
                      url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
                    },
                    {
                      label: 'Modern Duplex',
                      url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80',
                    },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setSelectedCoverUrl(preset.url)}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-brand-50 text-brand-800 font-semibold"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: PROPERTY DETAILS (Exact Fields from Figma Page 28 Top Right) */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <h2 className="text-base font-extrabold text-slate-900">Property Details</h2>

            <div className="nq-field">
              <label
                htmlFor="sell-title"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Property Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="sell-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Modern 3BHK Apartment in Gulshan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <div className="error-msg">Please enter a clear property title.</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="sell-zone"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Dhaka Area / Zone <span className="text-rose-500">*</span>
                </label>
                <select
                  id="sell-zone"
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value as Property['areaName'])}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-600"
                >
                  <option value="Gulshan">Gulshan</option>
                  <option value="Banani">Banani</option>
                  <option value="Dhanmondi">Dhanmondi</option>
                  <option value="Uttara">Uttara</option>
                  <option value="Bashundhara">Bashundhara</option>
                  <option value="Mirpur">Mirpur</option>
                </select>
              </div>

              <div className="sm:col-span-2 nq-field">
                <label
                  htmlFor="sell-address"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Full Street Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="sell-address"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g., Road 45, Gulshan 2, Dhaka"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="sell-sqft"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Area (sq ft) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="sell-sqft"
                  type="number"
                  required
                  min="300"
                  value={sqft}
                  onChange={(e) => setSqft(e.target.value)}
                  placeholder="e.g., 1850"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="sell-beds"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Bedrooms <span className="text-rose-500">*</span>
                </label>
                <input
                  id="sell-beds"
                  type="number"
                  required
                  min="1"
                  max="12"
                  value={beds}
                  onChange={(e) => setBeds(e.target.value)}
                  placeholder="e.g., 3"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="sell-baths"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Bathrooms <span className="text-rose-500">*</span>
                </label>
                <input
                  id="sell-baths"
                  type="number"
                  required
                  min="1"
                  max="12"
                  value={baths}
                  onChange={(e) => setBaths(e.target.value)}
                  placeholder="e.g., 3"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="sell-type"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Property Type <span className="text-rose-500">*</span>
                </label>
                <select
                  id="sell-type"
                  value={propType}
                  onChange={(e) => setPropType(e.target.value as Property['type'])}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="House">House</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Land">Land</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="sell-price"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Price (in Crore BDT) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="sell-price"
                  type="number"
                  step="0.05"
                  required
                  value={priceCrore}
                  onChange={(e) => setPriceCrore(e.target.value)}
                  placeholder="e.g., 2.50"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-brand-800"
                />
              </div>

              <div>
                <label
                  htmlFor="sell-year"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Year Built
                </label>
                <input
                  id="sell-year"
                  type="number"
                  value={yearBuilt}
                  onChange={(e) => setYearBuilt(e.target.value)}
                  placeholder="e.g., 2024"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="sell-desc" className="block text-xs font-bold text-slate-700 mb-1">
                Property Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="sell-desc"
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of the property, amenities, facing, and road width..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <label className="inline-flex items-center gap-2 text-xs font-bold text-brand-800 cursor-pointer">
              <input
                type="checkbox"
                checked={allowGroupBuy}
                onChange={(e) => setAllowGroupBuy(e.target.checked)}
                className="rounded text-brand-700"
              />
              Allow Group Buying (Co-Ownership fractional purchase) for this property
            </label>
          </div>

          {/* SECTION 3: LEGAL DOCUMENTS (Exact Match to Figma Page 28 Middle Left) */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Legal Documents <span className="text-rose-500">*</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload property ownership and legal documents (Khatian, Mutation / Namjari, Deed,
                Khajna Tax Receipt)
              </p>
            </div>

            {/* Amber Maximum Document Privacy Notice from Figma */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-amber-950">Maximum Document Privacy</h3>
                <p className="text-xs text-amber-900/90 mt-0.5 leading-relaxed">
                  These legal documents will <strong>NOT</strong> be displayed on your public
                  property listing. They will only be visible to our admin team for initial
                  validation and to assigned lawyers during verification. Your documents are stored
                  encrypted with strict role-based access control.
                </p>
              </div>
            </div>

            <label className="border-2 border-dashed border-slate-300 hover:border-brand-600 rounded-2xl p-6 text-center cursor-pointer bg-slate-50/70 transition flex flex-col items-center justify-center">
              <Upload className="w-6 h-6 text-brand-700 mb-1.5" />
              <span className="text-xs font-bold text-slate-800">
                Upload Khatian, Mutation (Namjari) & Title Deed PDFs
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                Supported formats: PDF, JPG, PNG (Encrypted AES-256 Vault)
              </span>
              <input
                type="file"
                multiple
                accept=".pdf,image/*"
                onChange={handleDocUploadChange}
                className="hidden"
              />
            </label>

            {/* Attached Encrypted Files List */}
            <div className="space-y-2">
              {uploadedDocs.map((docName, i) => (
                <div
                  key={i}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <FileText className="w-4 h-4 text-brand-700" />
                    <span>{docName}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-brand-800 text-[10px] font-bold">
                    Encrypted & Ready
                  </span>
                </div>
              ))}
            </div>

            {/* Green "What Happens Next?" Box from Figma Page 28 */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
              <h3 className="text-xs font-extrabold text-brand-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                What Happens Next?
              </h3>
              <ol className="text-xs text-brand-900/90 space-y-1 list-decimal list-inside">
                <li>Your post will be submitted to the admin verification queue.</li>
                <li>
                  Admin will verify your legal documents for initial validation (24-48 hours).
                </li>
                <li>If approved, your property will go live on the Nest Quest marketplace.</li>
                <li>
                  Complete legal verification will be done by verified lawyers when a buyer shows
                  interest.
                </li>
              </ol>
            </div>
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 py-3.5 px-6 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-sm font-bold shadow-md transition flex items-center justify-center gap-2"
            >
              Submit for Admin Approval
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('buy')}
              className="py-3.5 px-8 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-bold transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
