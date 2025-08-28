// Core application types with strict TypeScript definitions
// Adapted from React V2 for Angular V3

export type Section = 'owner-details' | 'firm-details' | 'account-setup' | 'funding' | 'trustees' | 'beneficiaries';

export type EntityType = 'member' | 'account';

export type MemberId = 'john-smith' | 'mary-smith' | 'smith-trust';
export type AccountId = 'joint-account' | 'individual-account' | 'trust-account' | 'roth-ira-account' | 'traditional-ira-account';

// Comprehensive form field types
export interface PersonalDetails {
  firstName: string;
  middleInitial?: string;
  lastName: string;
  dateOfBirth: Date | null;
  ssn: string;
  phoneHome: string;
  phoneMobile?: string;
  email: string;
  homeAddress: string;
  mailingAddress?: string;
  citizenship: CitizenshipType;
  employmentStatus: EmploymentStatus;
  annualIncome: IncomeRange;
  netWorth: NetWorthRange;
  fundsSource: string;
}

export interface FirmDetails {
  totalNetWorth: NetWorthRange;
  liquidNetWorth: NetWorthRange;
  averageAnnualIncome: IncomeRange;
  incomeSource: IncomeSourceType;
  investmentExperience: ExperienceLevel;
  stocksExperience: ExperienceLevel;
  bondsExperience: ExperienceLevel;
  optionsExperience: ExperienceLevel;
  liquidityNeeds: LiquidityNeed;
  emergencyFund: boolean;
  scenario1: ScenarioResponse;
}

export interface AccountSetup {
  accountType: AccountType;
  investmentObjective: InvestmentObjective;
  riskTolerance: RiskTolerance;
  initialDeposit?: string;
}

export interface TrustDetails {
  trustName: string;
  trustType: TrustType;
  trustEffectiveDate: Date | null;
  trustEin: string;
  trustState: string;
  trustPurpose: string;
  trusteeName: string;
  trusteePhone: string;
  trusteeAddress: string;
  hasSuccessorTrustee?: boolean;
}

export interface FundingInstance {
  type: FundingType;
  typeName: string;
  name: string;
  amount: string;
  frequency?: string;
  fromFirm?: string;
  transferType?: string;
  bankName?: string;
  transferDate?: Date;
  startDate?: Date;
  originalIndex?: number;
  contributionMethod?: string;
}

export interface FundingData {
  fundingInstances: {
    [key: string]: FundingInstance[];
    acat: FundingInstance[];
    ach: FundingInstance[];
    'initial-ach': FundingInstance[];
    withdrawal: FundingInstance[];
    contribution: FundingInstance[];
  };
}

// Enum-like string literal types
export type CitizenshipType = 'us-citizen' | 'permanent-resident' | 'foreign-national';
export type EmploymentStatus = 'employed' | 'self-employed' | 'retired' | 'unemployed' | 'student' | 'trust';
export type IncomeRange = 'under-25k' | '25k-50k' | '50k-100k' | '100k-250k' | '250k-500k' | 'over-500k';
export type NetWorthRange = 'under-100k' | '100k-250k' | '250k-500k' | '500k-1m' | '1m-5m' | 'over-5m';
export type IncomeSourceType = 'salary' | 'business' | 'investments' | 'retirement' | 'other';
export type ExperienceLevel = 'none' | 'limited' | 'good' | 'extensive';
export type LiquidityNeed = 'none' | 'low' | 'moderate' | 'high';
export type ScenarioResponse = 'sell-all' | 'sell-some' | 'hold' | 'buy-more';
export type AccountType = 'individual-taxable' | 'joint-taxable' | 'ira' | 'roth-ira' | 'traditional-ira' | 'trust';
export type InvestmentObjective = 'growth' | 'income' | 'balanced' | 'preservation';
export type RiskTolerance = 'conservative' | 'moderate' | 'aggressive';
export type TrustType = 'revocable-living' | 'irrevocable' | 'charitable-remainder' | 'charitable-lead' | 'grantor' | 'non-grantor' | 'testamentary';
export type FundingType = 'acat' | 'ach' | 'initial-ach' | 'withdrawal' | 'contribution';
export type FundingFrequency = 'one-time' | 'monthly' | 'quarterly' | 'annually';

// Form data structure - flexible to allow partial data
export interface FormData {
  [entityId: string]: Partial<PersonalDetails & FirmDetails & AccountSetup & FundingData & TrustDetails> & Record<string, any>;
}

// Completion tracking
export interface SectionCompletion {
  [section: string]: boolean;
}

export interface CompletionStatus {
  members: {
    [memberId: string]: SectionCompletion;
  };
  accounts: {
    [accountId: string]: SectionCompletion;
  };
}

// Navigation types
export interface NavigationTarget {
  section: Section;
  memberId: string;
  accountId: string;
}

// Validation and error handling
export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// Required fields mapping
export interface RequiredFields {
  [section: string]: string[];
}

// API simulation types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface SaveRequest {
  entityId: string;
  entityType: EntityType;
  section: Section;
  data: Partial<PersonalDetails | FirmDetails | AccountSetup | FundingData>;
}

// Application state for Angular
export interface AppState {
  currentSection: Section;
  currentMember: string;
  currentAccount: string;
  isReviewMode: boolean;
  formData: FormData;
  completionStatus: CompletionStatus;
  loading: boolean;
  error: string | null;
}