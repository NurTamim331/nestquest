import React, { useState, useEffect } from 'react';
import {
  NavTab,
  UserRole,
  Property,
  GroupBuy,
  Lawyer,
  LawyerAppointment,
  Advisor,
  DealTransaction,
  DealStageName,
  FraudAlert,
} from './types';
import {
  INITIAL_PROPERTIES,
  INITIAL_GROUPS,
  INITIAL_LAWYERS,
  INITIAL_APPOINTMENTS,
  INITIAL_ADVISORS,
  INITIAL_DEALS,
  INITIAL_FRAUD_ALERTS,
} from './data/mockData';
import { UserInvalidFallback } from './utils/webGuidance';
import { Navbar } from './components/Navbar';
import { HeroHomeView } from './components/HeroHomeView';
import { BrowsePropertiesView } from './components/BrowsePropertiesView';
import { PropertyDetailsView } from './components/PropertyDetailsView';
import { SmartMapView } from './components/SmartMapView';
import { GroupBuyingView } from './components/GroupBuyingView';
import { CreateSellPostView } from './components/CreateSellPostView';
import { LawyersView } from './components/LawyersView';
import { AdvisorsView } from './components/AdvisorsView';
import { UserProfileView } from './components/UserProfileView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AuthView } from './components/AuthView';
import { FooterAndModals } from './components/FooterAndTeamModal';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [currentRole, setCurrentRole] = useState<UserRole>('buyer');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // Core Application State
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<Property>(INITIAL_PROPERTIES[0]);
  const [selectedPropertyForGroup, setSelectedPropertyForGroup] = useState<Property | null>(
    INITIAL_PROPERTIES[0]
  );

  const [groups, setGroups] = useState<GroupBuy[]>(INITIAL_GROUPS);
  const [lawyers] = useState<Lawyer[]>(INITIAL_LAWYERS);
  const [appointments, setAppointments] = useState<LawyerAppointment[]>(INITIAL_APPOINTMENTS);
  const [advisors] = useState<Advisor[]>(INITIAL_ADVISORS);
  const [deals, setDeals] = useState<DealTransaction[]>(INITIAL_DEALS);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>(INITIAL_FRAUD_ALERTS);

  const [wishlistIds, setWishlistIds] = useState<string[]>(['prop-1', 'prop-3']);
  const [compareIds, setCompareIds] = useState<string[]>(['prop-1', 'prop-2']);
  const [searchFilterQuery, setSearchFilterQuery] = useState<string>('');
  const [searchVerifiedOnly, setSearchVerifiedOnly] = useState<boolean>(false);

  // Modals state
  const [teamModalOpen, setTeamModalOpen] = useState<boolean>(false);
  const [compareModalOpen, setCompareModalOpen] = useState<boolean>(false);

  // Initialize modern-web-guidance form validation fallback & ARIA sync
  useEffect(() => {
    UserInvalidFallback.init(document);
  }, []);

  const handleSelectProperty = (prop: Property) => {
    setSelectedProperty(prop);
    setActiveTab('property-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchNavigate = (query: string, verifiedOnly: boolean) => {
    setSearchFilterQuery(query);
    setSearchVerifiedOnly(verifiedOnly);
    setActiveTab('buy');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleWishlist = (propId: string) => {
    setWishlistIds((prev) =>
      prev.includes(propId) ? prev.filter((id) => id !== propId) : [...prev, propId]
    );
  };

  const handleToggleCompare = (propId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(propId)) {
        return prev.filter((id) => id !== propId);
      }
      const next = [...prev, propId];
      setCompareModalOpen(true);
      return next;
    });
  };

  const handleAddProperty = (newProp: Property) => {
    setProperties((prev) => [newProp, ...prev]);
    setSelectedProperty(newProp);
  };

  const handleApproveProperty = (propertyId: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? {
              ...p,
              status: 'Verified',
              verificationScore: Math.max(p.verificationScore, 94),
              legalDocuments: p.legalDocuments.map((d) => ({
                ...d,
                status: 'Verified',
                verifiedBy: 'Admin Mohammad Rahman & Adv. Rafiqul Islam',
              })),
            }
          : p
      )
    );
  };

  const handleRejectProperty = (propertyId: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, status: 'Rejected' } : p))
    );
  };

  const handleResolveFraudAlert = (alertId: string) => {
    setFraudAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'Resolved' } : a))
    );
  };

  const handleCompleteAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: 'Completed' } : apt))
    );
  };

  const handleBookAppointment = (newApt: LawyerAppointment) => {
    setAppointments((prev) => [newApt, ...prev]);
  };

  const handleAdvanceDealStage = (dealId: string, nextStage: DealStageName) => {
    const stageOrder: DealStageName[] = [
      'Selected',
      'Legal Check',
      'Negotiation',
      'Payment',
      'Registration',
      'Handover',
    ];
    const targetIdx = stageOrder.indexOf(nextStage);

    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId
          ? {
              ...d,
              currentStage: nextStage,
              timeline: d.timeline.map((step, idx) => ({
                ...step,
                done: idx <= targetIdx,
                date: idx <= targetIdx && step.date === 'Pending' ? 'Feb 09, 2026' : step.date,
              })),
            }
          : d
      )
    );
  };

  const handleJoinGroup = (groupId: string, sharePercent: number, investedLac: number) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const alreadyIn = g.members.some((m) => m.name === 'Nur Uddin Tamim');
        if (alreadyIn) return g;
        return {
          ...g,
          members: [
            ...g.members,
            {
              id: `m-${Date.now()}`,
              name: 'Nur Uddin Tamim',
              role: 'Co-Investor',
              sharePercent,
              investedText: `৳ ${investedLac} Lac`,
              paymentStatus: 'Committed',
              avatarInitials: 'NT',
            },
          ],
        };
      })
    );
  };

  const handleSendGroupMessage = (groupId: string, text: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              messages: [
                ...g.messages,
                {
                  id: `msg-${Date.now()}`,
                  senderName: 'Nur Uddin Tamim',
                  senderRole: 'Lead Co-Investor',
                  text,
                  time: 'Just Now',
                  isOwn: true,
                },
              ],
            }
          : g
      )
    );
  };

  const handleCreateGroup = (
    name: string,
    property: Property,
    minInvestmentText: string,
    creatorSharePercent: number
  ) => {
    const code = name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 3);
    const investedLac = Math.round(property.priceCrore * creatorSharePercent);

    const newGroup: GroupBuy = {
      id: `grp-${Date.now()}`,
      name,
      code: code || 'NQG',
      propertyId: property.id,
      propertyTitle: property.title,
      location: `${property.areaName}, Dhaka`,
      targetAmountCrore: property.priceCrore,
      targetDisplay: property.priceDisplay,
      minInvestmentText,
      maxMembers: 5,
      createdDate: 'Feb 09, 2026',
      status: 'Open for Co-Investors',
      agreementGenerated: true,
      votes: {
        topic: `Approve Legal Check & Offer for ${property.title}`,
        yesCount: 1,
        totalCount: 1,
      },
      members: [
        {
          id: `m-${Date.now()}`,
          name: 'Nur Uddin Tamim',
          role: 'Group Creator',
          sharePercent: creatorSharePercent,
          investedText: `৳ ${investedLac} Lac`,
          paymentStatus: 'Paid',
          avatarInitials: 'NT',
        },
      ],
      messages: [
        {
          id: `msg-init-${Date.now()}`,
          senderName: 'Nur Uddin Tamim',
          senderRole: `Group Creator (${creatorSharePercent}%)`,
          text: `Welcome to ${name}! I have initiated co-ownership group buying for ${property.title}.`,
          time: 'Just Now',
          isOwn: true,
        },
      ],
    };

    setGroups((prev) => [newGroup, ...prev]);
  };

  const handleVoteInGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              votes: {
                ...g.votes,
                yesCount: g.votes.yesCount + 1,
                userVoted: true,
              },
            }
          : g
      )
    );
  };

  const comparedProperties = properties.filter((p) => compareIds.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        wishlistIds={wishlistIds}
        compareIds={compareIds}
        unreadCount={3}
        onOpenCompare={() => setCompareModalOpen(true)}
        onOpenTeamModal={() => setTeamModalOpen(true)}
        isLoggedIn={isLoggedIn}
      />

      <main className="flex-1">
        {activeTab === 'home' && (
          <HeroHomeView
            properties={properties}
            onSelectProperty={handleSelectProperty}
            onSearchNavigate={handleSearchNavigate}
            setActiveTab={setActiveTab}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onOpenTeamModal={() => setTeamModalOpen(true)}
          />
        )}

        {activeTab === 'buy' && (
          <BrowsePropertiesView
            properties={properties}
            initialSearchQuery={searchFilterQuery}
            initialVerifiedOnly={searchVerifiedOnly}
            onSelectProperty={handleSelectProperty}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            compareIds={compareIds}
            onToggleCompare={handleToggleCompare}
          />
        )}

        {activeTab === 'property-details' && (
          <PropertyDetailsView
            property={
              properties.find((p) => p.id === selectedProperty.id) || selectedProperty
            }
            onBack={() => setActiveTab('buy')}
            setActiveTab={setActiveTab}
            isSaved={wishlistIds.includes(selectedProperty.id)}
            onToggleWishlist={handleToggleWishlist}
            onInitiateGroupBuyForProperty={(prop) => {
              setSelectedPropertyForGroup(prop);
              setActiveTab('group-buying');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'smart-map' && (
          <SmartMapView properties={properties} onSelectProperty={handleSelectProperty} />
        )}

        {activeTab === 'group-buying' && (
          <GroupBuyingView
            groups={groups}
            properties={properties}
            selectedPropertyForGroup={selectedPropertyForGroup}
            onJoinGroup={handleJoinGroup}
            onSendGroupMessage={handleSendGroupMessage}
            onCreateGroup={handleCreateGroup}
            onVoteInGroup={handleVoteInGroup}
          />
        )}

        {activeTab === 'sell' && (
          <CreateSellPostView onAddProperty={handleAddProperty} setActiveTab={setActiveTab} />
        )}

        {activeTab === 'lawyers' && (
          <LawyersView
            lawyers={lawyers}
            appointments={appointments}
            properties={properties}
            onVerifyPropertyByLawyer={handleApproveProperty}
            onCompleteAppointment={handleCompleteAppointment}
            onBookAppointment={handleBookAppointment}
          />
        )}

        {activeTab === 'advisors' && (
          <AdvisorsView
            advisors={advisors}
            deals={deals}
            onAdvanceDealStage={handleAdvanceDealStage}
          />
        )}

        {activeTab === 'profile' && (
          <UserProfileView
            properties={properties}
            wishlistIds={wishlistIds}
            onSelectProperty={handleSelectProperty}
            setActiveTab={setActiveTab}
            onLogout={() => {
              setIsLoggedIn(false);
              setActiveTab('auth');
            }}
            onOpenTeamModal={() => setTeamModalOpen(true)}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboardView
            properties={properties}
            fraudAlerts={fraudAlerts}
            onApproveProperty={handleApproveProperty}
            onRejectProperty={handleRejectProperty}
            onResolveFraudAlert={handleResolveFraudAlert}
          />
        )}

        {activeTab === 'auth' && (
          <AuthView
            onSuccessAuth={(role) => {
              setIsLoggedIn(true);
              setCurrentRole(role);
              if (role === 'lawyer') setActiveTab('lawyers');
              else if (role === 'advisor') setActiveTab('advisors');
              else setActiveTab('profile');
            }}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      <FooterAndModals
        setActiveTab={setActiveTab}
        teamModalOpen={teamModalOpen}
        onCloseTeamModal={() => setTeamModalOpen(false)}
        onOpenTeamModal={() => setTeamModalOpen(true)}
        compareModalOpen={compareModalOpen}
        onCloseCompareModal={() => setCompareModalOpen(false)}
        comparedProperties={comparedProperties}
        onRemoveCompare={(id) =>
          setCompareIds((prev) => prev.filter((item) => item !== id))
        }
        onSelectProperty={handleSelectProperty}
      />
    </div>
  );
}
export default App;
