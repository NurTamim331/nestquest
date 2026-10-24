import React, { useEffect, useRef } from 'react';
import {
  Building2,
  Sparkles,
  CheckCircle2,
  Code2,
  Palette,
  GraduationCap,
  Layers,
  Trash2,
} from 'lucide-react';
import { NavTab, Property } from '../types';
import { TEAM_CREDITS } from '../data/mockData';
import { attachDialogLightDismiss } from '../utils/webGuidance';

interface FooterAndModalsProps {
  setActiveTab: (tab: NavTab) => void;
  teamModalOpen: boolean;
  onCloseTeamModal: () => void;
  onOpenTeamModal: () => void;
  compareModalOpen: boolean;
  onCloseCompareModal: () => void;
  comparedProperties: Property[];
  onRemoveCompare: (id: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const FooterAndModals: React.FC<FooterAndModalsProps> = ({
  setActiveTab,
  teamModalOpen,
  onCloseTeamModal,
  onOpenTeamModal,
  compareModalOpen,
  onCloseCompareModal,
  comparedProperties,
  onRemoveCompare,
  onSelectProperty,
}) => {
  const teamDialogRef = useRef<HTMLDialogElement | null>(null);
  const compareDialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    return attachDialogLightDismiss(teamDialogRef.current, onCloseTeamModal);
  }, [onCloseTeamModal]);

  useEffect(() => {
    return attachDialogLightDismiss(compareDialogRef.current, onCloseCompareModal);
  }, [onCloseCompareModal]);

  useEffect(() => {
    const dialog = teamDialogRef.current;
    if (!dialog) return;
    if (teamModalOpen && !dialog.open) {
      dialog.showModal();
    } else if (!teamModalOpen && dialog.open) {
      dialog.close();
    }
  }, [teamModalOpen]);

  useEffect(() => {
    const dialog = compareDialogRef.current;
    if (!dialog) return;
    if (compareModalOpen && !dialog.open) {
      dialog.showModal();
    } else if (!compareModalOpen && dialog.open) {
      dialog.close();
    }
  }, [compareModalOpen]);

  return (
    <>
      {/* FOOTER */}
      <footer className="bg-brand-950 text-emerald-100 border-t border-brand-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-brand-900">
            {/* Brand Column */}
            <div className="md:col-span-4 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-brand-950 flex items-center justify-center font-extrabold">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-lg font-extrabold text-white tracking-tight">
                  NEST QUEST
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                Smart Property Marketplace for Bangladesh. Bringing verified Khatian & Namjari
                records, AI price estimation, flood & safety smart maps, lawyer assistance, and
                group co-ownership into one trusted platform.
              </p>
              <p className="text-[11px] text-emerald-300/70">
                Disclaimer: Nest Quest supports informed property decision-making and legal
                verification workflows; it does not replace official Bangladesh government land
                registry authorities (land.gov.bd).
              </p>
            </div>

            {/* Quick Platform Links */}
            <div className="md:col-span-3 space-y-2 text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider mb-3">
                Platform Modules
              </h3>
              <ul className="space-y-2 text-emerald-200/85">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveTab('buy')}
                    className="hover:text-white"
                  >
                    Browse Verified Properties
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveTab('smart-map')}
                    className="hover:text-white"
                  >
                    Smart Map & Flood/Crime Layers
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveTab('group-buying')}
                    className="hover:text-white"
                  >
                    Group Buying (Co-Ownership)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveTab('lawyers')}
                    className="hover:text-white"
                  >
                    Verified Lawyers & Legal Portal
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveTab('advisors')}
                    className="hover:text-white"
                  >
                    Property Advisors & Deal Tracker
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveTab('admin')}
                    className="hover:text-white"
                  >
                    Admin Verification & Fraud Engine
                  </button>
                </li>
              </ul>
            </div>

            {/* Project & Team Vanguard Attribution Card */}
            <div className="md:col-span-5 bg-brand-900/70 border border-emerald-500/25 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-300">
                  <GraduationCap className="w-4 h-4" />
                  UIU • CSE 3412 (Section D) • Team Vanguard
                </span>
                <button
                  type="button"
                  onClick={onOpenTeamModal}
                  className="text-[11px] font-bold text-white underline decoration-emerald-400 hover:text-emerald-300"
                >
                  Full Credits →
                </button>
              </div>

              <div className="p-3 rounded-xl bg-brand-950/90 border border-emerald-400/30">
                <p className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" />
                  Engineered & Brought to Life By:
                </p>
                <p className="text-sm font-extrabold text-white mt-0.5">
                  Md Nur Uddin Tamim{' '}
                  <span className="text-xs font-mono text-emerald-300">(ID: 011 231 0331)</span>
                </p>
                <p className="text-[11px] text-emerald-200/80 mt-0.5">
                  Full-Stack Web Implementation, Interactive GIS Smart Map, Verification Workflow &
                  Role Portals
                </p>
              </div>

              <div className="text-[11px] text-emerald-200/85 space-y-1">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-emerald-400" />
                  Original Figma UI/UX Design & SRS Team (Team Vanguard):
                </p>
                <p>
                  • Md. Tasnim Islam Tanveer (011 231 0328) • Md Nur Uddin Tamim (011 231 0331)
                </p>
                <p>
                  • Md Rakib Hossain (011 231 0308) • Rithik Linkon Penaru (011 231 0597) •
                  Mohammed Afnan (011 231 0310)
                </p>
                <p className="text-emerald-300/80 pt-0.5">
                  Course Instructor: <strong>Sidratul Muntaha</strong> (System Analysis & Design
                  Lab)
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-300/70">
            <p>© 2026 Nest Quest Bangladesh. Built with 100% Free & Open-Source Technologies.</p>
            <p>
              Developed by <strong className="text-white">Md Nur Uddin Tamim</strong> • Team
              Vanguard
            </p>
          </div>
        </div>
      </footer>

      {/* MODAL 1: TEAM VANGUARD & DEVELOPER CREDITS (modern-web-guidance: light-dismiss-a-dialog) */}
      <dialog
        ref={teamDialogRef}
        {...({ closedby: 'any' } as any)}
        aria-labelledby="teamCreditsDialogTitle"
        className="nq-dialog w-full max-w-2xl bg-white text-slate-900"
      >
        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-brand-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                United International University (UIU) • CSE 3412
              </span>
              <h2 id="teamCreditsDialogTitle" className="text-xl font-extrabold text-slate-900 mt-1">
                Nest Quest — Team Vanguard & Engineering Credits
              </h2>
              <p className="text-xs text-slate-500">
                Course: System Analysis and Design Laboratory (Section D) • Instructor: Sidratul
                Muntaha
              </p>
            </div>
            <button
              type="button"
              onClick={onCloseTeamModal}
              className="text-slate-400 hover:text-slate-700 font-bold text-sm"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {TEAM_CREDITS.map((member) => (
              <div
                key={member.studentId}
                className={`p-4 rounded-2xl border ${
                  member.isLeadDeveloper
                    ? 'bg-emerald-50/90 border-brand-600 shadow-sm'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-slate-900">{member.name}</h3>
                    {member.isLeadDeveloper && (
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-800 text-white text-[10px] font-extrabold">
                        ★ Lead Developer (Brought Project to Life)
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono font-bold text-brand-800 bg-white px-2.5 py-0.5 rounded border border-slate-200">
                    ID: {member.studentId}
                  </span>
                </div>
                <p className="text-xs font-bold text-brand-700 mt-1">{member.role}</p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {member.contribution}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onCloseTeamModal}
              className="px-5 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>

      {/* MODAL 2: PROPERTY COMPARISON MODAL (SRS 3.6.1 & Class Diagram Buyer.addToCompare) */}
      <dialog
        ref={compareDialogRef}
        {...({ closedby: 'any' } as any)}
        aria-labelledby="compareDialogTitle"
        className="nq-dialog w-full max-w-4xl bg-white text-slate-900"
      >
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-700" />
              <h2 id="compareDialogTitle" className="text-lg font-extrabold text-slate-900">
                Property Side-by-Side Comparison ({comparedProperties.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={onCloseCompareModal}
              className="text-slate-400 hover:text-slate-700 font-bold text-sm"
            >
              ✕
            </button>
          </div>

          {comparedProperties.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <p className="text-sm font-bold text-slate-700">No properties added to compare yet.</p>
              <p className="text-xs text-slate-500">
                Click the layer/compare icon on any property card in Browse Properties to compare
                prices, verification scores, and flood risks side-by-side.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-3 text-slate-400 uppercase">Feature</th>
                    {comparedProperties.map((p) => (
                      <th key={p.id} className="py-3 px-3 min-w-[200px]">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-extrabold text-slate-900">{p.title}</span>
                          <button
                            type="button"
                            onClick={() => onRemoveCompare(p.id)}
                            className="text-rose-500 hover:text-rose-700"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-600">Listed Price</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="py-2.5 px-3 font-extrabold text-brand-800 text-sm">
                        {p.priceDisplay}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-600">AI Fair Estimate</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="py-2.5 px-3 font-semibold text-emerald-700">
                        {p.aiEstimate.rangeText} ({p.aiEstimate.confidence}% conf.)
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-600">Verification Score</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="py-2.5 px-3 font-bold">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-brand-800">
                          ✓ {p.verificationScore}% ({p.status})
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-600">Size & Layout</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="py-2.5 px-3">
                        {p.sqft} sqft • {p.beds} Bed • {p.baths} Bath
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-600">Flood & Safety Score</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="py-2.5 px-3">
                        Flood: <strong>{p.riskAssessment.floodRisk}</strong> • Safety:{' '}
                        <strong>{p.riskAssessment.safetyScore}/10</strong>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-600">Action</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="py-2.5 px-3">
                        <button
                          type="button"
                          onClick={() => {
                            onCloseCompareModal();
                            onSelectProperty(p);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-brand-800 text-white font-bold"
                        >
                          Inspect Details
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
};
