import React, { useState } from 'react';
import {
  FileCheck2,
  Printer,
  X,
  Copy,
  Check,
  Building2,
  Calendar,
  CreditCard,
  User,
  ShieldCheck,
  FileText,
  Trash2,
} from 'lucide-react';
import { LedgerEntry, MoneyReceipt } from '../types';
import { formatBDT, numberToTakaWords } from '../utils/numberToWords';

interface MoneyReceiptModalProps {
  entry: LedgerEntry;
  existingReceipt: MoneyReceipt | null;
  onConfirmIssue: (receipt: MoneyReceipt) => void;
  onDeleteReceipt?: () => void;
  onClose: () => void;
}

export const MoneyReceiptModal: React.FC<MoneyReceiptModalProps> = ({
  entry,
  existingReceipt,
  onConfirmIssue,
  onDeleteReceipt,
  onClose,
}) => {
  const isExisting = !!existingReceipt;

  const defaultReceiptNo =
    existingReceipt?.receiptNumber ||
    `NQ-MR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const [receiptNumber, setReceiptNumber] = useState(defaultReceiptNo);
  const [issuedBy, setIssuedBy] = useState(
    existingReceipt?.issuedBy || 'Mohammad Rahman (Nest Quest Admin)'
  );
  const [remarks, setRemarks] = useState(
    existingReceipt?.remarks ||
      (entry.type === 'income'
        ? 'Payment received in full and credited to personal accounts. Thank you.'
        : 'Payment made and disbursed against provided service/goods. Verified.')
  );
  const [copied, setCopied] = useState(false);

  const isIncome = entry.type === 'income';
  const amountWords =
    existingReceipt?.amountInWords || numberToTakaWords(entry.amount);

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `
=== NEST QUEST MONEY RECEIPT ===
Receipt No: ${receiptNumber}
Date: ${entry.date} ${entry.time || ''}
Type: ${isIncome ? 'Money Received (Income)' : 'Payment Made (Expense)'}
${isIncome ? 'Received From' : 'Paid To'}: ${entry.partyName}
Amount: ৳ ${formatBDT(entry.amount)} (${amountWords})
Payment Mode: ${entry.paymentMethod}
Category: ${entry.category}
Note: ${entry.note}
Issued By: ${issuedBy}
Status: Verified & Acknowledged
================================
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveAndIssue = () => {
    const finalReceipt: MoneyReceipt = {
      receiptNumber,
      issuedAt: `${entry.date} ${entry.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      issuedBy,
      partyName: entry.partyName,
      amount: entry.amount,
      amountInWords: amountWords,
      paymentMethod: entry.paymentMethod,
      purpose: entry.note,
      remarks,
    };
    onConfirmIssue(finalReceipt);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-4">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                {isExisting ? 'Official Money Receipt' : 'Create & Issue Money Receipt'}
              </h3>
              <p className="text-[11px] text-slate-300">
                {isExisting
                  ? `Receipt #${existingReceipt.receiptNumber}`
                  : 'Manual Receipt Generation for Personal Ledger'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isExisting && (
              <>
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1 transition"
                  title="Copy Receipt text summary"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg bg-brand-700 hover:bg-brand-600 text-white text-xs font-bold inline-flex items-center gap-1 transition shadow-sm"
                  title="Print this receipt voucher"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Voucher Container */}
        <div className="p-6 sm:p-8 bg-slate-50 flex-1 overflow-y-auto print-area">
          <div className="bg-white rounded-2xl border-2 border-slate-300 p-6 sm:p-8 shadow-sm relative overflow-hidden">
            {/* Watermark Stamp Background */}
            <div className="absolute right-4 bottom-16 opacity-5 pointer-events-none select-none text-slate-900 font-extrabold text-8xl rotate-[-25deg]">
              RECEIPT
            </div>

            {/* Header */}
            <div className="border-b-2 border-brand-800 pb-5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-800 text-white flex items-center justify-center font-bold text-xl shadow-sm">
                  <Building2 className="w-7 h-7 text-emerald-300" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                    NEST QUEST <span className="text-brand-700">REALTY</span>
                  </h2>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Verified Bangladesh Real Estate & Personal Expense Tracker
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Dhaka, Bangladesh • Web: nest-quest.vercel.app
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-200">
                <div
                  className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-1 ${
                    isIncome
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}
                >
                  {isIncome ? 'Money Receipt (টাকা প্রাপ্তি রসিদ)' : 'Payment Voucher (টাকা প্রদান ভাউচার)'}
                </div>
                <p className="text-xs font-mono font-bold text-slate-700">
                  VOUCHER NO: <span className="text-brand-800">{receiptNumber}</span>
                </p>
                <p className="text-[11px] text-slate-500 flex items-center sm:justify-end gap-1 mt-0.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Date: {entry.date} {entry.time ? `• ${entry.time}` : ''}
                </p>
              </div>
            </div>

            {/* Main Receipt Content Grid */}
            <div className="space-y-4 text-xs">
              {/* Received from / Paid to */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                  {isIncome ? 'Received With Thanks From:' : 'Paid / Disbursed To:'}
                </span>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-700 shrink-0" />
                  <span className="text-base font-extrabold text-slate-900">
                    {entry.partyName}
                  </span>
                </div>
              </div>

              {/* Amount Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1 p-3.5 rounded-xl bg-brand-50/70 border border-brand-200">
                  <span className="text-brand-900/70 font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                    Amount (in Figures)
                  </span>
                  <p className="text-xl sm:text-2xl font-black text-brand-900 tracking-tight">
                    ৳ {formatBDT(entry.amount)}
                  </p>
                </div>

                <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-center">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                    Amount (in Words)
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 italic">
                    "{amountWords}"
                  </p>
                </div>
              </div>

              {/* Note / Purpose */}
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold uppercase tracking-wider text-[10px] mb-1">
                  <FileText className="w-3.5 h-3.5 text-amber-700" />
                  On Account Of / Particulars (Note)
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {entry.note}
                </p>
              </div>

              {/* Mode and Category */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-bold text-[10px] block uppercase">
                    Payment Method
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-1">
                    <CreditCard className="w-3.5 h-3.5 text-brand-700" />
                    {entry.paymentMethod}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-bold text-[10px] block uppercase">
                    Ledger Category
                  </span>
                  <div className="font-bold text-slate-800 mt-1">
                    {entry.category}
                  </div>
                </div>
              </div>

              {/* Remarks if any */}
              {isExisting ? (
                <div className="text-[11px] text-slate-500 italic bg-white p-2 border border-slate-100 rounded-lg">
                  <strong className="not-italic text-slate-700">Remarks: </strong>
                  {remarks}
                </div>
              ) : (
                <div className="no-print pt-2 space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Receipt Remarks & Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="e.g. Cleared via BRAC Bank PLC Escrow / Cheque #..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-brand-600 bg-white"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">
                        Voucher Number
                      </label>
                      <input
                        type="text"
                        value={receiptNumber}
                        onChange={(e) => setReceiptNumber(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">
                        Issued / Received By
                      </label>
                      <input
                        type="text"
                        value={issuedBy}
                        onChange={(e) => setIssuedBy(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Signatures & Seal */}
              <div className="pt-6 mt-4 border-t border-dashed border-slate-300 flex items-end justify-between">
                <div className="text-center w-36">
                  <div className="h-9 border-b border-slate-400 flex items-center justify-center text-slate-300 text-[10px] italic">
                    Customer Signature
                  </div>
                  <p className="text-[10px] font-semibold text-slate-500 mt-1 uppercase">
                    {entry.partyName}
                  </p>
                </div>

                {/* Digital Verified Stamp */}
                <div className="hidden sm:flex flex-col items-center justify-center p-2 rounded-xl border-2 border-emerald-500/60 bg-emerald-50/50 text-emerald-800">
                  <div className="flex items-center gap-1 text-[10px] font-black tracking-wider uppercase">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    NEST QUEST VERIFIED
                  </div>
                  <span className="text-[9px] text-emerald-700 font-mono font-bold">
                    SYSTEM ACKNOWLEDGED
                  </span>
                </div>

                <div className="text-center w-40">
                  <div className="h-9 border-b border-slate-400 flex items-center justify-center text-brand-800 font-serif italic text-xs font-bold">
                    {issuedBy.split(' ')[0] || 'Tamim'}
                  </div>
                  <p className="text-[10px] font-semibold text-slate-500 mt-1 uppercase">
                    Authorized Signatory
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Controls */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
          <div>
            {isExisting && onDeleteReceipt && (
              <button
                type="button"
                onClick={onDeleteReceipt}
                className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold inline-flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Money Receipt
              </button>
            )}
            {!isExisting && (
              <p className="text-[11px] text-slate-500">
                💡 Money receipts are created <span className="font-bold text-slate-700">only when you manually confirm</span>.
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              {isExisting ? 'Close' : 'Cancel'}
            </button>

            {!isExisting && (
              <button
                type="button"
                onClick={handleSaveAndIssue}
                className="px-5 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white text-xs font-extrabold shadow-sm transition inline-flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-emerald-300" />
                Confirm & Create Money Receipt
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
