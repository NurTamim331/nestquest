export type UserRole = 'buyer' | 'seller' | 'lawyer' | 'advisor' | 'admin';

export type NavTab =
  | 'home'
  | 'buy'
  | 'property-details'
  | 'sell'
  | 'smart-map'
  | 'lawyers'
  | 'advisors'
  | 'group-buying'
  | 'profile'
  | 'admin'
  | 'auth';

export interface LegalDocumentItem {
  id: string;
  docType: 'Khatian (CS/RS/BS)' | 'Mutation (Namjari)' | 'Title Deed (Dalil)' | 'Land Tax (Khajna) Receipt';
  fileName: string;
  uploadedAt: string;
  status: 'Verified' | 'Pending Review' | 'Flagged';
  verifiedBy?: string;
  notes?: string;
}

export interface NearbyService {
  name: string;
  category: 'Hospital' | 'School' | 'Police Station' | 'Metro / Transit' | 'Fire Station' | 'Shopping';
  distance: string;
  coordinates: [number, number];
}

export interface Property {
  id: string;
  title: string;
  areaName: 'Gulshan' | 'Banani' | 'Dhanmondi' | 'Uttara' | 'Bashundhara' | 'Mirpur';
  address: string;
  priceCrore: number; // e.g., 2.50 = 2.50 Crore, 0.85 = 85 Lac
  priceDisplay: string; // e.g., "৳ 2.50 Crore" or "৳ 85 Lac"
  type: 'Apartment' | 'Villa' | 'House' | 'Commercial' | 'Land';
  beds: number;
  baths: number;
  sqft: number;
  floor: string;
  parking: number;
  facing: string;
  yearBuilt: number;
  verificationScore: number; // 0 - 100
  status: 'Verified' | 'Pending Verification' | 'Flagged' | 'Rejected';
  rating: number;
  views: number;
  postedAgo: string;
  images: string[];
  coordinates: [number, number];
  sellerName: string;
  sellerRole: string;
  sellerPhone: string;
  sellerEmail: string;
  sellerVerified: boolean;
  description: string;
  amenities: string[];
  aiEstimate: {
    minCrore: number;
    maxCrore: number;
    rangeText: string;
    pricePerSqft: number;
    confidence: number;
    appreciationNote: string;
  };
  riskAssessment: {
    floodRisk: 'Low' | 'Medium' | 'High';
    crimeRate: 'Low' | 'Medium' | 'High';
    noiseLevel: 'Low' | 'Medium' | 'High';
    connectivity: 'Excellent' | 'Good' | 'Moderate';
    gasWaterSupply: '24/7 Active' | 'Scheduled' | 'Limited';
    safetyScore: number; // out of 10, e.g., 8.5
  };
  nearbyServices: NearbyService[];
  legalDocuments: LegalDocumentItem[];
  allowGroupBuy?: boolean;
}

export interface GroupMember {
  id: string;
  name: string;
  role: string;
  sharePercent: number;
  investedText: string;
  paymentStatus: 'Paid' | 'Committed' | 'Pending';
  avatarInitials: string;
}

export interface GroupChatMessage {
  id: string;
  senderName: string;
  senderRole: string;
  text: string;
  time: string;
  isOwn?: boolean;
  badge?: string;
}

export interface GroupBuy {
  id: string;
  name: string;
  code: string;
  propertyId: string;
  propertyTitle: string;
  location: string;
  targetAmountCrore: number;
  targetDisplay: string;
  minInvestmentText: string;
  maxMembers: number;
  createdDate: string;
  status: 'Open for Co-Investors' | 'Verification in Progress' | 'Fully Subscribed';
  members: GroupMember[];
  messages: GroupChatMessage[];
  agreementGenerated: boolean;
  votes: {
    topic: string;
    yesCount: number;
    totalCount: number;
    userVoted?: boolean;
  };
}

export interface Lawyer {
  id: string;
  name: string;
  barCouncilId: string;
  specialization: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  casesHandled: number;
  successRate: string;
  consultationFeeBdt: number;
  location: string;
  officeAddress: string;
  phone: string;
  email: string;
  availableNow: boolean;
  verified: boolean;
  image: string;
  bio: string;
  languages: string[];
  services: string[];
}

export interface LawyerAppointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  propertyTitle: string;
  location: string;
  propertyType: string;
  serviceType: 'Document Verification' | 'Legal Processing' | 'Deed Drafting';
  date: string;
  time: string;
  duration: string;
  mode: 'In-Person' | 'Online Video';
  urgent: boolean;
  status: 'Scheduled' | 'Completed' | 'Rescheduled';
  notes: string;
}

export interface Advisor {
  id: string;
  name: string;
  licenseNo: string;
  designation: string;
  specialization: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  dealsClosed: number;
  successRate: string;
  portfolioValue: string;
  feeBdt: number;
  responseTime: string;
  location: string;
  phone: string;
  email: string;
  verified: boolean;
  available: boolean;
  image: string;
  bio: string;
  languages: string[];
  areasOfExpertise: string[];
}

export type DealStageName =
  | 'Selected'
  | 'Legal Check'
  | 'Negotiation'
  | 'Payment'
  | 'Registration'
  | 'Handover';

export interface DealTransaction {
  id: string;
  code: string;
  propertyId: string;
  propertyTitle: string;
  location: string;
  category: 'Residential' | 'Commercial' | 'High Value (2Cr+)';
  totalValueText: string;
  buyerName: string;
  buyerPhone: string;
  sellerName: string;
  sellerPhone: string;
  lawyerName: string;
  advisorName: string;
  currentStage: DealStageName;
  completedDocsCount: number;
  financialSummary: {
    propertyPrice: string;
    registrationFee: string;
    stampDuty: string;
    legalAndAdvisorFee: string;
    totalCost: string;
  };
  timeline: {
    stage: DealStageName;
    date: string;
    done: boolean;
  }[];
}

export interface FraudAlert {
  id: string;
  propertyId: string;
  propertyTitle: string;
  location: string;
  listedPriceText: string;
  estimatedMarketText: string;
  reason: string;
  severity: 'High' | 'Medium';
  status: 'Flagged' | 'Under Investigation' | 'Resolved';
  detectedAt: string;
}

export interface TeamMemberCredit {
  name: string;
  studentId: string;
  role: string;
  contribution: string;
  isLeadDeveloper?: boolean;
}
