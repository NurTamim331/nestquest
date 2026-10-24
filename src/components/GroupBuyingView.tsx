import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  MessageSquare,
  Plus,
  Send,
  Phone,
  Video,
  Info,
  MapPin,
  Calendar,
  FileText,
  Vote,
  Sparkles,
  Search,
  Building2,
} from 'lucide-react';
import { GroupBuy, Property } from '../types';

interface GroupBuyingViewProps {
  groups: GroupBuy[];
  properties: Property[];
  selectedPropertyForGroup?: Property | null;
  onJoinGroup: (groupId: string, sharePercent: number, investedLac: number) => void;
  onSendGroupMessage: (groupId: string, text: string) => void;
  onCreateGroup: (
    name: string,
    property: Property,
    minInvestmentText: string,
    creatorSharePercent: number
  ) => void;
  onVoteInGroup: (groupId: string) => void;
}

export const GroupBuyingView: React.FC<GroupBuyingViewProps> = ({
  groups,
  properties,
  selectedPropertyForGroup,
  onJoinGroup,
  onSendGroupMessage,
  onCreateGroup,
  onVoteInGroup,
}) => {
  const [subView, setSubView] = useState<'select-group' | 'initiated-success' | 'group-chats'>(
    'select-group'
  );
  const [activeGroupId, setActiveGroupId] = useState<string>(groups[0]?.id || 'grp-1');
  const [searchGroupQuery, setSearchGroupQuery] = useState('');
  const [messageText, setMessageText] = useState('');

  // Create new group form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupPropId, setNewGroupPropId] = useState(
    selectedPropertyForGroup?.id || properties[0]?.id || 'prop-1'
  );
  const [newGroupRange, setNewGroupRange] = useState('৳ 45L - ৳ 85L');
  const [newGroupShare, setNewGroupShare] = useState(25);

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];
  const targetProperty =
    selectedPropertyForGroup ||
    properties.find((p) => p.id === activeGroup?.propertyId) ||
    properties[0];

  const filteredGroups = groups.filter(
    (g) =>
      !searchGroupQuery.trim() ||
      g.name.toLowerCase().includes(searchGroupQuery.toLowerCase()) ||
      g.location.toLowerCase().includes(searchGroupQuery.toLowerCase()) ||
      g.propertyTitle.toLowerCase().includes(searchGroupQuery.toLowerCase())
  );

  const handleSelectAndInitiate = (group: GroupBuy) => {
    setActiveGroupId(group.id);
    setSubView('initiated-success');
  };

  const handleCreateNewGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const prop = properties.find((p) => p.id === newGroupPropId) || properties[0];
    onCreateGroup(newGroupName.trim(), prop, newGroupRange, newGroupShare);
    setNewGroupName('');
    setShowCreateForm(false);
    setSubView('initiated-success');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeGroup) return;
    onSendGroupMessage(activeGroup.id, messageText.trim());
    setMessageText('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Sub-View Switcher Tabs (Lets user view all 3 Figma Group Buying screens on Page 27) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
              SRS 4.10 • Co-Ownership & Shared Equity
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Group Property Buying & Collaboration Hub
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSubView('select-group')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                subView === 'select-group'
                  ? 'bg-brand-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              1. Select / Join Group
            </button>
            <button
              type="button"
              onClick={() => setSubView('initiated-success')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                subView === 'initiated-success'
                  ? 'bg-brand-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              2. Initiation Status
            </button>
            <button
              type="button"
              onClick={() => setSubView('group-chats')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                subView === 'group-chats'
                  ? 'bg-brand-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              3. Group Chats & Voting
            </button>
          </div>
        </div>

        {/* SCREEN 1: SELECT A GROUP TO BUY (Exact Match to Figma Page 27 Top Left) */}
        {subView === 'select-group' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Select a Group to Buy</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Choose one of your co-investment groups to proceed with group buying for{' '}
                  <span className="font-bold text-brand-800 underline">
                    {targetProperty?.title}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition self-start"
              >
                <Plus className="w-4 h-4" />
                Create New Buying Group
              </button>
            </div>

            {/* Optional Create New Group Drawer */}
            {showCreateForm && (
              <form
                onSubmit={handleCreateNewGroupSubmit}
                className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-4"
              >
                <h3 className="text-sm font-extrabold text-brand-900">
                  Create a New Co-Ownership Group
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Group Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="e.g., Uttara Doctors Syndicate"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Property
                    </label>
                    <select
                      value={newGroupPropId}
                      onChange={(e) => setNewGroupPropId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                    >
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.priceDisplay})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Share Budget Range
                    </label>
                    <input
                      type="text"
                      value={newGroupRange}
                      onChange={(e) => setNewGroupRange(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Initial Share (%)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="80"
                      value={newGroupShare}
                      onChange={(e) => setNewGroupShare(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-brand-800 text-white text-xs font-bold"
                  >
                    Create & Initiate Group Buy
                  </button>
                </div>
              </form>
            )}

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchGroupQuery}
                onChange={(e) => setSearchGroupQuery(e.target.value)}
                placeholder="Search groups by name or Dhaka location..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            {/* 3 KPI Stat Cards (Exact Match to Figma Page 27 Top Left: 5, 4, 26) */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-brand-800 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-slate-900">{groups.length + 2}</p>
                  <p className="text-[11px] text-slate-500">Total Groups</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-brand-800 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-slate-900">4</p>
                  <p className="text-[11px] text-slate-500">Active Deals</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-brand-800 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-slate-900">26</p>
                  <p className="text-[11px] text-slate-500">Co-Investors</p>
                </div>
              </div>
            </div>

            {/* Your Groups List (Matches DPI, GEG, BIC in Figma Page 27) */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Your Groups
              </h3>
              <div className="space-y-3">
                {filteredGroups.map((group) => {
                  const totalShareAllocated = group.members.reduce(
                    (acc, m) => acc + m.sharePercent,
                    0
                  );
                  return (
                    <div
                      key={group.id}
                      className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-brand-600 bg-white shadow-sm transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-brand-800 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow">
                          {group.code}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                              {group.name}
                            </h4>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-brand-800 text-[10px] font-bold">
                              {group.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Target Property: <strong>{group.propertyTitle}</strong> (
                            {group.targetDisplay})
                          </p>

                          <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                            <span className="inline-flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-brand-700" />
                              <strong>
                                {group.members.length}/{group.maxMembers}
                              </strong>{' '}
                              Members
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-brand-700" />
                              {group.location}
                            </span>
                            <span className="text-brand-800 font-bold">
                              Share Range: {group.minInvestmentText}
                            </span>
                            <span className="inline-flex items-center gap-1 text-slate-400">
                              <Calendar className="w-3.5 h-3.5" />
                              {group.createdDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {totalShareAllocated < 100 && (
                          <button
                            type="button"
                            onClick={() => onJoinGroup(group.id, 15, 45)}
                            className="px-3.5 py-2 rounded-xl border border-brand-600 text-brand-800 hover:bg-brand-50 text-xs font-bold transition"
                          >
                            + Commit 15% Share
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleSelectAndInitiate(group)}
                          className="px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition"
                        >
                          Select & Initiate Buy →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 2: GROUP BUYING INITIATED SUCCESSFULLY! (Exact Match to Figma Page 27 Top Right) */}
        {subView === 'initiated-success' && activeGroup && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
            {/* Green Success Header Banner */}
            <div className="bg-gradient-to-r from-brand-800 via-emerald-700 to-brand-800 text-white p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 ring-4 ring-white/30">
                <CheckCircle2 className="w-9 h-9 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold">Group Buying Initiated Successfully!</h2>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                Your group buying request & draft co-ownership breakdown have been sent to all
                members
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              {/* Property Summary Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Selected Property
                </p>
                <p className="text-base font-extrabold text-slate-900 mt-0.5">
                  {activeGroup.propertyTitle}
                </p>
                <p className="text-xs text-slate-500">
                  {activeGroup.location} • Total Value: {activeGroup.targetDisplay}
                </p>
              </div>

              {/* Selected Group Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-brand-800 text-white font-extrabold text-xs flex items-center justify-center">
                  {activeGroup.code}
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Selected Group
                  </p>
                  <p className="text-sm font-extrabold text-slate-900">{activeGroup.name}</p>
                  <p className="text-xs text-slate-500">
                    {activeGroup.members.length} Active Co-Investors
                  </p>
                </div>
              </div>

              {/* Notifications Sent to All Members Info Box */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-blue-950">
                    Notifications Sent to All Members
                  </h3>
                  <p className="text-xs text-blue-800 mt-0.5">
                    All {activeGroup.members.length} members of &ldquo;{activeGroup.name}&rdquo;
                    have been notified via in-app alert & email about this property purchase.
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] font-bold">
                    <span className="text-emerald-700">✓ 3 Confirmed Shares</span>
                    <span className="text-amber-700">• 1 Awaiting Final Vote</span>
                  </div>
                </div>
              </div>

              {/* New Group Chat Automatically Created Info Box */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-brand-950">
                    New Group Chat & Legal Agreement Draft Created
                  </h3>
                  <p className="text-xs text-brand-800 mt-0.5">
                    A dedicated group chat and fractional share deed draft have been created for
                    this property purchase. Collaborate, vote on offers, and track member payments.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubView('group-chats')}
                  className="flex-1 py-3 px-5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold shadow flex items-center justify-center gap-2 transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  Open Group Chat & Share Tracker
                </button>
                <button
                  type="button"
                  onClick={() => setSubView('select-group')}
                  className="py-3 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
                >
                  Back to All Groups
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 3: GROUP CHATS & CO-OWNERSHIP TRACKER (Exact Match to Figma Page 27 Bottom) */}
        {subView === 'group-chats' && activeGroup && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Group Chats</h2>
                <p className="text-xs text-slate-500">
                  Collaborate with other buyers for group property purchases, share allocation &
                  voting
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSubView('select-group');
                  setShowCreateForm(true);
                }}
                className="px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Create New Group
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
              {/* Left Sidebar: Group Thread List */}
              <div className="lg:col-span-4 border-r border-slate-200 p-4 space-y-3 bg-slate-50/40">
                {groups.map((grp) => {
                  const isSelected = grp.id === activeGroup.id;
                  const lastMsg = grp.messages[grp.messages.length - 1];
                  return (
                    <button
                      key={grp.id}
                      type="button"
                      onClick={() => setActiveGroupId(grp.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 ${
                        isSelected
                          ? 'bg-emerald-50/90 border-brand-700 shadow-sm'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-brand-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {grp.code}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-extrabold text-slate-900 truncate">
                            {grp.name}
                          </h3>
                          <span className="text-[10px] text-slate-400">
                            {lastMsg?.time || 'Active'}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-brand-700 truncate">
                          {grp.propertyTitle}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {lastMsg ? `${lastMsg.senderName}: ${lastMsg.text}` : 'No messages yet'}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-brand-800 text-[10px] font-bold">
                            {grp.targetDisplay}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                            {grp.members.length} Members
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Active Group Chat + Co-Ownership Share & Voting Bar */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                {/* Chat Top Header */}
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-800 text-white font-bold text-xs flex items-center justify-center">
                      {activeGroup.code}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        {activeGroup.propertyTitle}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {activeGroup.name} • {activeGroup.members.length} Co-Investors •{' '}
                        {activeGroup.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500">
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-slate-100"
                      title="Group Audio Call"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-slate-100"
                      title="Group Video Meeting"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-slate-100"
                      title="Co-Ownership Deed Draft"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Fractional Share Breakdown & Live Resolution Vote Banner */}
                <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-brand-700" />
                      Co-Ownership Share Distribution ({activeGroup.targetDisplay})
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      ✓ Draft Co-Ownership Deed Generated
                    </span>
                  </div>

                  {/* Member Share Pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {activeGroup.members.map((m) => (
                      <div
                        key={m.id}
                        className="p-2 rounded-lg bg-white border border-slate-200 text-xs"
                      >
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span className="truncate">{m.name}</span>
                          <span className="text-brand-700">{m.sharePercent}%</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-0.5">
                          <span>{m.investedText}</span>
                          <span
                            className={`font-semibold ${
                              m.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'
                            }`}
                          >
                            {m.paymentStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Group Decision Voting Box */}
                  <div className="p-3 rounded-xl bg-white border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <Vote className="w-4 h-4 text-brand-700 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-800">{activeGroup.votes.topic}</p>
                        <p className="text-[11px] text-slate-500">
                          Current Tally: {activeGroup.votes.yesCount} of{' '}
                          {activeGroup.votes.totalCount} members voted YES
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={activeGroup.votes.userVoted}
                      onClick={() => onVoteInGroup(activeGroup.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition ${
                        activeGroup.votes.userVoted
                          ? 'bg-emerald-100 text-brand-800'
                          : 'bg-brand-800 hover:bg-brand-700 text-white'
                      }`}
                    >
                      {activeGroup.votes.userVoted ? '✓ Vote Recorded' : 'Vote Approve'}
                    </button>
                  </div>
                </div>

                {/* Chat Messages Area */}
                <div className="p-5 space-y-4 max-h-72 overflow-y-auto flex-1 bg-white">
                  {activeGroup.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.isOwn ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[11px] font-bold text-slate-700">
                          {msg.senderName}
                        </span>
                        <span className="text-[10px] text-slate-400">({msg.senderRole})</span>
                        {msg.badge && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-brand-800 text-[9px] font-bold">
                            {msg.badge}
                          </span>
                        )}
                      </div>
                      <div
                        className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          msg.isOwn
                            ? 'bg-brand-800 text-white rounded-br-none'
                            : 'bg-slate-100 text-slate-800 rounded-bl-none'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span
                          className={`block text-[10px] mt-1 text-right ${
                            msg.isOwn ? 'text-emerald-200' : 'text-slate-400'
                          }`}
                        >
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Message Input Box */}
                <form
                  onSubmit={handleSendChat}
                  className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Write a message to co-investors or share an offer update..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
