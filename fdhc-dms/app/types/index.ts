// app/types/index.ts
// Manufactured Housing DMS - Core Types

// Enums
export type UserRole = 'admin' | 'manager' | 'sales_rep' | 'bdc';
export type LeadStatus = 'NEW' | 'CONTACTING' | 'QUALIFIED' | 'APPOINTMENT_SET' | 'SHOWN' | 'WORKING' | 'CLOSED_WON' | 'CLOSED_LOST' | 'DEAD';
export type LandStatus = 'OWNS_LAND' | 'BUYING_LAND' | 'NEEDS_PARK' | 'UNDECIDED';
export type HomeCategory = 'single_wide' | 'double_wide' | 'triple_wide' | 'modular';
export type HomeStatus = 'factory_order' | 'in_production' | 'in_transit' | 'on_lot' | 'reserved' | 'sold' | 'delivered';
export type DealStatus = 'PROSPECT' | 'DESKING' | 'APPLICATION' | 'APPROVED' | 'DELIVERY_SCHEDULED' | 'DELIVERED' | 'FUNDED' | 'DEAD';
export type LoanType = 'CHATTEL' | 'LAND_HOME_FHA' | 'LAND_HOME_CONV' | 'CASH';
export type ActivityType = 'PHONE_CALL' | 'EMAIL' | 'SMS' | 'APPOINTMENT' | 'SITE_VISIT' | 'DESKING' | 'NOTE' | 'STATUS_CHANGE';
export type ActivityDirection = 'INBOUND' | 'OUTBOUND';
export type ActivityOutcome = 'NO_ANSWER' | 'VOICEMAIL' | 'CONNECTED' | 'APPOINTMENT_SET' | 'NOT_INTERESTED' | 'CALLBACK_REQUESTED' | 'DEAL_MADE' | 'FOLLOW_UP_LATER';
export type LedgerEntryType = 'SALE_REVENUE' | 'COGS_HOME' | 'COGS_OPTIONS' | 'COGS_FREIGHT' | 'COGS_SETUP' | 'COGS_SITE_PREP' | 'PACK_EARNED' | 'COMMISSION' | 'TAX_COLLECTED';

// Organization
export interface Organization {
  id: string;
  name: string;
  slug: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// User Profile
export interface Profile {
  id: string;
  org_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  is_online: boolean;
  handles_land_home: boolean;
  lead_capacity: number;
  lead_weight: number;
  last_assignment_at: string | null;
  last_active_at: string | null;
  created_at: string;
  updated_at: string;
}

// Lead
export interface Lead {
  id: string;
  org_id: string;
  assigned_to: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string;
  alt_phone: string | null;
  source: string;
  source_detail: string | null;
  landing_page: string | null;
  utm_data: Record<string, any> | null;
  land_status: LandStatus;
  land_location: string | null;
  target_move_in: string | null;
  status: LeadStatus;
  score: number;
  contact_attempts: number;
  last_contact_at: string | null;
  next_follow_up_at: string | null;
  appointment_at: string | null;
  custom_fields: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Joined fields
  assigned_profile?: Profile;
}

// Home Inventory
export interface HomeInventory {
  id: string;
  org_id: string;
  serial_number: string | null;
  hud_label_number: string | null;
  manufacturer: string;
  model_name: string;
  year: number | null;
  category: HomeCategory;
  square_feet: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  base_invoice: number;
  pack_amount: number;
  holdback_amount: number;
  freight_cost: number;
  setup_cost: number;
  list_price: number;
  status: HomeStatus;
  factory_order_date: string | null;
  estimated_arrival: string | null;
  actual_arrival: string | null;
  specs: Record<string, any>;
  images: string[];
  created_at: string;
  updated_at: string;
}

// Deal
export interface Deal {
  id: string;
  org_id: string;
  lead_id: string;
  home_id: string | null;
  assigned_to: string | null;
  status: DealStatus;
  loan_type: LoanType | null;
  lender_name: string | null;
  base_home_price: number | null;
  factory_options_price: number;
  freight_cost: number;
  setup_cost: number;
  site_prep_price: number;
  site_prep_breakdown: Record<string, any>;
  trade_in_value: number;
  trade_in_description: string | null;
  down_payment: number;
  down_payment_percent: number | null;
  loan_amount: number | null;
  interest_rate: number | null;
  term_months: number | null;
  monthly_payment: number | null;
  gross_profit: number | null;
  pack_earned: number | null;
  commission_amount: number | null;
  application_date: string | null;
  approval_date: string | null;
  delivery_date: string | null;
  funding_date: string | null;
  desking_config: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Joined fields
  lead?: Lead;
  home?: HomeInventory;
  assigned_profile?: Profile;
}

// Activity
export interface Activity {
  id: string;
  org_id: string;
  lead_id: string | null;
  deal_id: string | null;
  user_id: string | null;
  type: ActivityType;
  direction: ActivityDirection | null;
  outcome: ActivityOutcome | null;
  notes: string | null;
  scheduled_at: string | null;
  completed_at: string | null;
  duration_seconds: number | null;
  metadata: Record<string, any>;
  created_at: string;
  // Joined fields
  user?: Profile;
  lead?: Lead;
  deal?: Deal;
}

// Ledger
export interface LedgerEntry {
  id: string;
  org_id: string;
  deal_id: string;
  entry_type: LedgerEntryType;
  description: string;
  amount: number;
  debit_credit: 'DEBIT' | 'CREDIT';
  entry_date: string;
  posted_at: string;
  posted_by: string | null;
  metadata: Record<string, any>;
}

// Lead Form Data
export interface LeadFormData {
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  source: string;
  land_status: LandStatus;
  land_location?: string;
  target_move_in?: string;
  notes?: string;
}

// Desking Scenario
export interface DeskingScenario {
  id: number;
  name: string;
  type: 'CHATTEL' | 'LAND_HOME';
  downPercent: number;
  termYears: number;
  rate: number;
  includeSitePrep: boolean;
}

// Desking Costs
export interface DeskingCosts {
  basePrice: number;
  optionsPrice: number;
  freightSetup: number;
  sitePrep: number;
  tradeIn: number;
}

// Calculated Deal Numbers
export interface DealCalculations {
  totalCost: number;
  downPaymentAmount: number;
  amountFinanced: number;
  monthlyPayment: number;
}

// Credit Tier
export type CreditTier = 'excellent' | 'good' | 'fair' | 'poor' | 'subprime';

// Lender Program
export interface LenderProgram {
  lender: string;
  name: string;
  type: LoanType;
  minCreditScore: number;
  maxDebtToIncome: number;
  minDownPayment: number;
  maxTermMonths: number;
  rateTiers: Record<CreditTier, number>;
  requiresLandOwned: boolean;
}

// Purchase Agreement Status
export type PurchaseAgreementStatus = 'DRAFT' | 'PENDING_SIGNATURE' | 'SIGNED' | 'CANCELLED' | 'EXPIRED';

// Purchase Agreement
export interface PurchaseAgreement {
  id: string;
  org_id: string;
  deal_id: string;
  lead_id: string;
  agreement_number: string;
  status: PurchaseAgreementStatus;
  
  // Client Info (auto-populated from lead)
  client_first_name: string;
  client_last_name: string;
  client_email: string | null;
  client_phone: string;
  client_address: string | null;
  client_city: string | null;
  client_state: string | null;
  client_zip: string | null;
  
  // Home Info (auto-populated from deal/home)
  home_id: string | null;
  manufacturer: string | null;
  model_name: string | null;
  serial_number: string | null;
  year: number | null;
  
  // Financial Terms (auto-populated from deal)
  base_home_price: number;
  factory_options_price: number;
  freight_cost: number;
  setup_cost: number;
  site_prep_price: number;
  trade_in_value: number;
  down_payment: number;
  loan_amount: number;
  monthly_payment: number;
  
  // Agreement Terms
  deposit_amount: number;
  deposit_paid: boolean;
  deposit_paid_date: string | null;
  deposit_payment_method: string | null;
  
  // Important Dates
  agreement_date: string;
  expiration_date: string;
  expected_delivery_date: string | null;
  
  // Site Information
  site_address: string | null;
  site_city: string | null;
  site_state: string | null;
  site_zip: string | null;
  
  // Special Terms & Notes
  special_terms: string | null;
  included_options: string[];
  excluded_items: string[];
  
  // Signatures
  client_signature_url: string | null;
  client_signed_at: string | null;
  sales_rep_signature_url: string | null;
  sales_rep_signed_at: string | null;
  manager_signature_url: string | null;
  manager_signed_at: string | null;
  
  // Document
  document_url: string | null;
  document_generated_at: string | null;
  
  created_by: string;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  deal?: Deal;
  lead?: Lead;
  home?: HomeInventory;
  created_by_profile?: Profile;
}

// Purchase Agreement Template
export interface PurchaseAgreementTemplate {
  id: string;
  org_id: string;
  name: string;
  description: string | null;
  content: string;
  is_default: boolean;
  state_specific: string | null;
  created_at: string;
  updated_at: string;
}

// Purchase Agreement Form Data
export interface PurchaseAgreementFormData {
  deal_id: string;
  deposit_amount: number;
  deposit_payment_method: string;
  site_address?: string;
  site_city?: string;
  site_state?: string;
  site_zip?: string;
  expected_delivery_date?: string;
  special_terms?: string;
  included_options?: string[];
}
