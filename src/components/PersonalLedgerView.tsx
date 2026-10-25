import React, { useState, useMemo, useEffect } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Search,
  Filter,
  FileCheck2,
  FileText,
  Calendar,
  CreditCard,
  Edit3,
  Trash2,
  Printer,
  Sparkles,
  User,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  Download,
  Info,
} from 'lucide-react';
import { LedgerEntry, LedgerEntryType, MoneyReceipt } from '../types';
import { INITIAL_LEDGER_ENTRIES } from '../data/mockData';
import { formatBDT, numberToTakaWords } from '../utils/numberToWords';
import { MoneyReceiptModal } from './MoneyReceiptModal';

interface PersonalLedgerViewProps {
  onBackToProfile?: () => void;
  embedded?: boolean;
}

const STORAGE_KEY = 'nest_quest_personal_ledger_entries';

const CATEGORIES = [
  'Client Payment',
  'Property Advance',
  'Legal/Advisory',
  'Construction & Interior',
  'Land Tax & Mutation Fee',
  'Brokerage & Commission',
  'Personal Expense',
  'Other',
];

const PAYMENT_METHODS: LedgerEntry['paymentMethod'][] = [
  'Bank Transfer',
  'Cash',
  'bKash/Nagad',
  'Cheque',
  'Other',
];

export const PersonalLedgerView: React.FC<PersonalLedgerViewProps> = ({
  onBackToProfile,
  embedded = false,
}) => {
  // Load from localStorage or fallback to INITIAL_LEDGER_ENTRIES
  const [entries, setEntries] = useState<LedgerEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved ledger entries:', e);
    }
    return INITIAL_LEDGER_ENTRIES;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.warn('Failed to save ledger entries to localStorage:', e);
    }
  }, [entries]);

  // Filters & Search
  const [filterType, setFilterType] = useState<
    'all' | 'income' | 'expense' | 'has-receipt' | 'no-receipt'
  >('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  // Active receipt modal
  const [activeReceiptModal, setActiveReceiptModal] = useState<{
    entry: LedgerEntry;
    isGeneratingNew: boolean;
  } | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Entry Form state
  const todayStr = new Date().toISOString().split('T')[0];
  const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const [formType, setFormType] = useState<LedgerEntryType>('income');
  const [formParty, setFormParty] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formNote, setFormNote] = useState('');
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formPaymentMethod, setFormPaymentMethod] = useState<LedgerEntry['paymentMethod']>('Bank Transfer');
  const [formDate, setFormDate] = useState(todayStr);
  const [formTime, setFormTime] = useState(nowTimeStr);
  const [formGenerateReceipt, setFormGenerateReceipt] = useState(false);

  // Reset Form
  const resetForm = () => {
    setFormType('income');
    setFormParty('');
    setFormAmount('');
    setFormNote('');
    setFormCategory(CATEGORIES[0]);
    setFormPaymentMethod('Bank Transfer');
    setFormDate(todayStr);
    setFormTime(nowTimeStr);
    setFormGenerateReceipt(false);
    setEditingEntryId(null);
  };

  const handleOpenAddModal = (defaultType: LedgerEntryType = 'income') => {
    resetForm();
    setFormType(defaultType);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (entry: LedgerEntry) => {
    setEditingEntryId(entry.id);
    setFormType(entry.type);
    setFormParty(entry.partyName);
    setFormAmount(entry.amount.toString());
    setFormNote(entry.note);
    setFormCategory(entry.category);
    setFormPaymentMethod(entry.paymentMethod);
    setFormDate(entry.date);
    setFormTime(entry.time || nowTimeStr);
    setFormGenerateReceipt(false);
    setIsFormOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(formAmount.replace(/,/g, ''));
    if (!formParty.trim()) {
      alert('Please enter the client / recipient party name.');
      return;
    }
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount in Taka.');
      return;
    }
    if (!formNote.trim()) {
      alert('Please provide a note describing this payment.');
      return;
    }

    if (editingEntryId) {
      // Edit existing
      setEntries((prev) =>
        prev.map((item) => {
          if (item.id === editingEntryId) {
            const updatedReceipt = item.receipt
              ? {
                  ...item.receipt,
                  partyName: formParty.trim(),
                  amount: amountNum,
                  amountInWords: numberToTakaWords(amountNum),
                  paymentMethod: formPaymentMethod,
                  purpose: formNote.trim(),
                }
              : null;

            return {
              ...item,
              type: formType,
              partyName: formParty.trim(),
              amount: amountNum,
              note: formNote.trim(),
              category: formCategory,
              paymentMethod: formPaymentMethod,
              date: formDate,
              time: formTime,
              receipt: updatedReceipt,
            };
          }
          return item;
        })
      );
      showToast('✓ Ledger entry updated successfully.');
    } else {
      // Create new
      const newId = `led-${Date.now()}`;
      let createdReceipt: MoneyReceipt | null = null;

      if (formGenerateReceipt) {
        createdReceipt = {
          receiptNumber: `NQ-MR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          issuedAt: `${formDate} ${formTime}`,
          issuedBy: 'Mohammad Rahman (Admin)',
          partyName: formParty.trim(),
          amount: amountNum,
          amountInWords: numberToTakaWords(amountNum),
          paymentMethod: formPaymentMethod,
          purpose: formNote.trim(),
          remarks: 'Created manually upon entry confirmation.',
        };
      }

      const newEntry: LedgerEntry = {
        id: newId,
        type: formType,
        partyName: formParty.trim(),
        amount: amountNum,
        note: formNote.trim(),
        category: formCategory,
        paymentMethod: formPaymentMethod,
        date: formDate,
        time: formTime,
        receipt: createdReceipt,
        createdAt: Date.now(),
      };

      setEntries((prev) => [newEntry, ...prev]);
      showToast(
        formGenerateReceipt
          ? '✓ Entry recorded and official Money Receipt generated!'
          : '✓ Entry recorded in your ledger! (No receipt made yet, create manually anytime)'
      );
    }

    setIsFormOpen(false);
    resetForm();
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this ledger entry?')) {
      setEntries((prev) => prev.filter((item) => item.id !== id));
      showToast('Entry removed from ledger.');
    }
  };

  // Receipt creation / deletion handlers
  const handleOpenReceipt = (entry: LedgerEntry) => {
    setActiveReceiptModal({
      entry,
      isGeneratingNew: !entry.receipt,
    });
  };

  const handleSaveReceiptFromModal = (receipt: MoneyReceipt) => {
    if (!activeReceiptModal) return;
    const entryId = activeReceiptModal.entry.id;

    setEntries((prev) =>
      prev.map((item) => (item.id === entryId ? { ...item, receipt } : item))
    );

    setActiveReceiptModal(null);
    showToast(`✓ Official Money Receipt #${receipt.receiptNumber} generated!`);
  };

  const handleDeleteReceiptFromModal = () => {
    if (!activeReceiptModal) return;
    if (window.confirm('Are you sure you want to delete this money receipt? The ledger entry will remain.')) {
      const entryId = activeReceiptModal.entry.id;
      setEntries((prev) =>
        prev.map((item) => (item.id === entryId ? { ...item, receipt: null } : item))
      );
      setActiveReceiptModal(null);
      showToast('Money receipt deleted. Entry is now marked as "No Receipt".');
    }
  };

  const handleResetToDemo = () => {
    if (window.confirm('Reset ledger with sample records (Client X payment, Legal fee, etc.)?')) {
      setEntries(INITIAL_LEDGER_ENTRIES);
      showToast('Reset to default ledger records.');
    }
  };

  // Filtered & Sorted Entries
  const filteredEntries = useMemo(() => {
    return entries
      .filter((item) => {
        // Type filter
        if (filterType === 'income' && item.type !== 'income') return false;
        if (filterType === 'expense' && item.type !== 'expense') return false;
        if (filterType === 'has-receipt' && !item.receipt) return false;
        if (filterType === 'no-receipt' && !!item.receipt) return false;

        // Category filter
        if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchParty = item.partyName.toLowerCase().includes(q);
          const matchNote = item.note.toLowerCase().includes(q);
          const matchCategory = item.category.toLowerCase().includes(q);
          const matchAmount = item.amount.toString().includes(q);
          const matchReceipt = item.receipt?.receiptNumber.toLowerCase().includes(q) || false;
          if (!matchParty && !matchNote && !matchCategory && !matchAmount && !matchReceipt) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.createdAt - a.createdAt;
        if (sortBy === 'oldest') return a.createdAt - b.createdAt;
        if (sortBy === 'highest') return b.amount - a.amount;
        if (sortBy === 'lowest') return a.amount - b.amount;
        return 0;
      });
  }, [entries, filterType, categoryFilter, searchQuery, sortBy]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    let totalInflow = 0;
    let totalOutflow = 0;
    let receiptsCount = 0;

    entries.forEach((item) => {
      if (item.type === 'income') totalInflow += item.amount;
      if (item.type === 'expense') totalOutflow += item.amount;
      if (item.receipt) receiptsCount++;
    });

    const netBalance = totalInflow - totalOutflow;

    return {
      totalInflow,
      totalOutflow,
      netBalance,
      receiptsCount,
      totalCount: entries.length,
    };
  }, [entries]);

  // Export as CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Type', 'Party Name', 'Amount (BDT)', 'Category', 'Payment Method', 'Receipt No', 'Note'];
    const rows = filteredEntries.map((e) => [
      e.id,
      e.date,
      e.type === 'income' ? 'Received (Income)' : 'Paid (Expense)',
      `"${e.partyName.replace(/"/g, '""')}"`,
      e.amount,
      `"${e.category}"`,
      e.paymentMethod,
      e.receipt ? e.receipt.receiptNumber : 'No Receipt',
      `"${e.note.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nest_Quest_Personal_Ledger_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✓ Ledger exported as CSV file.');
  };

  const content = (
    <div className="space-y-6">
      {/* Toast alert */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            {toastMessage}
          </div>
        )}

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-brand-900 text-xs font-bold inline-flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-brand-700" />
                  Admin Personal Expense Tracker & Ledger
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  Admin Mohammad Rahman • Private Ledger
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Admin Purchases & Personal Ledger (খতিয়ান ও ব্যক্তিগত হিসাব)
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                Private Admin Tracker: Keep track of every payment: either someone paid you or you paid someone else, alongside your personal notes. 
                Money receipts are made only when you manually generate them.
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {onBackToProfile && (
                <button
                  type="button"
                  onClick={onBackToProfile}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
                >
                  ← Back to Admin Dashboard
                </button>
              )}

              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 transition"
                title="Export filtered records as CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                Export CSV
              </button>

              <button
                type="button"
                onClick={() => handleOpenAddModal('expense')}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition"
              >
                <ArrowUpRight className="w-4 h-4" />
                I Paid Someone
              </button>

              <button
                type="button"
                onClick={() => handleOpenAddModal('income')}
                className="px-4 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition"
              >
                <ArrowDownLeft className="w-4 h-4 text-emerald-300" />
                Someone Paid Me
              </button>
            </div>
          </div>

          {/* 4 KPI Summary Cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Received */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Total Received (Income)
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-emerald-950">
                ৳ {formatBDT(metrics.totalInflow)}
              </p>
              <p className="text-[11px] text-emerald-700 mt-1">
                Payments made by clients & others to you
              </p>
            </div>

            {/* Total Paid */}
            <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                  Total Paid (Expenses)
                </span>
                <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-rose-950">
                ৳ {formatBDT(metrics.totalOutflow)}
              </p>
              <p className="text-[11px] text-rose-700 mt-1">
                Payments you made to others & services
              </p>
            </div>

            {/* Net Balance */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Net Ledger Balance
                </span>
                <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-emerald-300" />
                </div>
              </div>
              <p
                className={`text-2xl font-black tracking-tight ${
                  metrics.netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                ৳ {formatBDT(metrics.netBalance)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Cash in Hand / Bank Surplus
              </p>
            </div>

            {/* Receipts Created */}
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                  Money Receipts
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <FileCheck2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-blue-950">
                {metrics.receiptsCount} <span className="text-xs font-bold text-blue-700">/ {metrics.totalCount} Entries</span>
              </p>
              <p className="text-[11px] text-blue-700 mt-1">
                Issued manually on demand
              </p>
            </div>
          </div>
        </div>

        {/* Filters, Search & View Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'all', label: `All (${entries.length})` },
                  {
                    id: 'income',
                    label: `Received (${entries.filter((e) => e.type === 'income').length})`,
                  },
                  {
                    id: 'expense',
                    label: `Paid (${entries.filter((e) => e.type === 'expense').length})`,
                  },
                  {
                    id: 'has-receipt',
                    label: `Has Receipt (${metrics.receiptsCount})`,
                  },
                  {
                    id: 'no-receipt',
                    label: `No Receipt (${entries.length - metrics.receiptsCount})`,
                  },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterType(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    filterType === tab.id
                      ? 'bg-brand-800 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Category Filter and Reset */}
            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:border-brand-600"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:border-brand-600"
              >
                <option value="newest">Newest Date</option>
                <option value="oldest">Oldest Date</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>

              <button
                type="button"
                onClick={handleResetToDemo}
                title="Reset to default sample entries"
                className="text-[11px] text-slate-400 hover:text-slate-600 underline px-1"
              >
                Reset Demo
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name (e.g., Client X), note contents, amount, category, or receipt #..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-600 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Ledger Entries List */}
        <div className="space-y-3">
          {filteredEntries.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-800">No Ledger Entries Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No transactions matched your current search and filter criteria. You can add one right now!
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenAddModal('income')}
                  className="px-4 py-2 rounded-xl bg-brand-800 text-white text-xs font-bold"
                >
                  + Add Client Payment
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilterType('all');
                    setCategoryFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const isIncome = entry.type === 'income';

              return (
                <div
                  key={entry.id}
                  className={`bg-white rounded-2xl border p-5 transition shadow-sm hover:shadow-md ${
                    isIncome
                      ? 'border-emerald-100 hover:border-emerald-300'
                      : 'border-rose-100 hover:border-rose-300'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Direction indicator + Party + Amount */}
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                          isIncome
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowDownLeft className="w-6 h-6" />
                        ) : (
                          <ArrowUpRight className="w-6 h-6" />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              isIncome
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {isIncome ? 'Payment Received' : 'Payment Made'}
                          </span>
                          <span className="text-[11px] font-bold text-slate-400">
                            {entry.date} {entry.time ? `• ${entry.time}` : ''}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            {entry.category}
                          </span>
                          <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            {entry.paymentMethod}
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap items-baseline gap-2">
                          <h3 className="text-base font-extrabold text-slate-900">
                            {entry.partyName}
                          </h3>
                          <span className="text-xs text-slate-400">
                            {isIncome ? '(Paid to you)' : '(You paid them)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Amount & Receipt status badge */}
                    <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 sm:gap-6 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                      <div className="text-left lg:text-right">
                        <div
                          className={`text-xl font-black tracking-tight ${
                            isIncome ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {isIncome ? '+' : '-'} ৳ {formatBDT(entry.amount)}
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {numberToTakaWords(entry.amount)}
                        </p>
                      </div>

                      {/* Money Receipt Status */}
                      <div className="flex items-center gap-2">
                        {entry.receipt ? (
                          <button
                            type="button"
                            onClick={() => handleOpenReceipt(entry)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold inline-flex items-center gap-1.5 transition shadow-sm"
                            title="View or print official money receipt"
                          >
                            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Receipt: {entry.receipt.receiptNumber}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenReceipt(entry)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 transition border border-slate-200"
                            title="Money receipt not created yet. Click to manually generate one."
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-500" />
                            <span>+ Create Money Receipt</span>
                          </button>
                        )}

                        {/* Edit & Delete Action Buttons */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(entry)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-800 hover:bg-slate-100 transition"
                          title="Edit transaction note or amount"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* USER NOTE: Highlighted prominently as requested */}
                  <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800 leading-relaxed whitespace-pre-wrap">
                        {entry.note}
                      </p>
                      {entry.receipt?.remarks && (
                        <p className="text-[11px] text-slate-500 mt-1 italic">
                          Receipt Remark: {entry.receipt.remarks}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Informative Guidance Footer */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-brand-700 shrink-0" />
            <span>
              All transactions and notes are stored securely in your browser's local state. You can generate professional printable Money Receipts for any entry whenever required.
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 shrink-0">
            Total Ledger Entries: {entries.length}
          </div>
        </div>

      {/* CREATE / EDIT TRANSACTION MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                    {editingEntryId ? 'Edit Ledger Entry' : 'Record New Transaction'}
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Personal Expense & Purchases Tracker
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  resetForm();
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 text-xs">
              {/* Type Switcher: Income vs Expense */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[11px]">
                  Transaction Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormType('income')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition ${
                      formType === 'income'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/30'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                    Someone Paid Me (Income)
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormType('expense')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition ${
                      formType === 'expense'
                        ? 'border-rose-600 bg-rose-50 text-rose-800 ring-2 ring-rose-500/30'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4 text-rose-600" />
                    I Paid Someone (Expense)
                  </button>
                </div>
              </div>

              {/* Party Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {formType === 'income'
                    ? 'Client / Person Who Paid You *'
                    : 'Recipient / Person You Paid *'}
                </label>
                <input
                  type="text"
                  required
                  value={formParty}
                  onChange={(e) => setFormParty(e.target.value)}
                  placeholder={
                    formType === 'income'
                      ? 'e.g. Client X, Mr. Habib, Buyer Kamrul'
                      : 'e.g. Advocate Rafiq, Sub-Registry Office, Interior Contractor'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-600 bg-white"
                />
              </div>

              {/* Amount (৳) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Amount in BDT (৳) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-extrabold text-slate-400 text-sm">
                    ৳
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    step="any"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="e.g. 200000"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:border-brand-600 bg-white"
                  />
                </div>
                {formAmount && !isNaN(Number(formAmount)) && Number(formAmount) > 0 && (
                  <p className="text-[11px] text-brand-800 font-semibold mt-1">
                    In Words: {numberToTakaWords(Number(formAmount))}
                  </p>
                )}
              </div>

              {/* Note (Crucial field per user request) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Note / Description *</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    (Detailed record of this transaction)
                  </span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  placeholder={
                    formType === 'income'
                      ? 'e.g. Client X made 200000 of payment to me for Dhanmondi apartment token advance.'
                      : 'e.g. Paid 35,000 to lawyer for document vetting and RS Khatian verification.'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-600 bg-white leading-relaxed"
                />
              </div>

              {/* Category & Payment Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-600 bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={formPaymentMethod}
                    onChange={(e) => setFormPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-600 bg-white"
                  >
                    {PAYMENT_METHODS.map((pm) => (
                      <option key={pm} value={pm}>
                        {pm}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Time (Optional)
                  </label>
                  <input
                    type="text"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="14:30"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-600 bg-white"
                  />
                </div>
              </div>

              {/* Money Receipt Manual Creation Checkbox */}
              {!editingEntryId && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="genReceiptNow"
                    checked={formGenerateReceipt}
                    onChange={(e) => setFormGenerateReceipt(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-brand-800 focus:ring-brand-700"
                  />
                  <label htmlFor="genReceiptNow" className="text-[11px] text-slate-700 select-none cursor-pointer">
                    <span className="font-bold text-slate-900 block">
                      Generate official Money Receipt immediately?
                    </span>
                    Default is false: A receipt will only be created if you click "Create Money Receipt" manually.
                  </label>
                </div>
              )}

              {/* Form Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white text-xs font-extrabold shadow-sm transition inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  {editingEntryId ? 'Update Entry' : 'Save to Ledger'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFICIAL MONEY RECEIPT MODAL */}
      {activeReceiptModal && (
        <MoneyReceiptModal
          entry={activeReceiptModal.entry}
          existingReceipt={activeReceiptModal.entry.receipt || null}
          onConfirmIssue={handleSaveReceiptFromModal}
          onDeleteReceipt={activeReceiptModal.entry.receipt ? handleDeleteReceiptFromModal : undefined}
          onClose={() => setActiveReceiptModal(null)}
        />
      )}
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">{content}</div>
    </div>
  );
};
