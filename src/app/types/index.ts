// Enums et Types communs
export type UserRole = 'admin' | 'manager' | 'user' | 'guest';
export type Status = 'active' | 'inactive' | 'archived' | 'draft';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

// ========== COMPANIES / COMPAGNIES ==========
export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Company {
  id: string;
  name: string;
  siret: string;
  siren: string;
  legalForm: string;
  industry: string;
  address: Address;
  phone: string;
  email: string;
  website: string;
  employees: number;
  annualRevenue: number;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  logo?: string;
  description: string;
  tags: string[];
  metadata?: Record<string, any>;
}

export interface CompanyHistory {
  id: string;
  companyId: string;
  action: string;
  details: string;
  userId: string;
  timestamp: Date;
}

// ========== CONTACTS ==========
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobile: string;
  jobTitle: string;
  department: string;
  companyId: string;
  company?: Company;
  address?: Address;
  profileImage?: string;
  status: Status;
  leadScore: number;
  preferences: ContactPreferences;
  lastInteraction: Date;
  nextFollowUp: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactPreferences {
  preferredCommunication: 'email' | 'phone' | 'sms' | 'whatsapp';
  communicationFrequency: 'daily' | 'weekly' | 'monthly';
  newsletter: boolean;
  doNotContact: boolean;
}

export interface Interaction {
  id: string;
  contactId: string;
  type: 'email' | 'phone' | 'meeting' | 'sms' | 'note' | 'task';
  subject: string;
  description: string;
  duration?: number;
  result: string;
  nextAction?: string;
  userId: string;
  timestamp: Date;
  attachments?: string[];
}

// ========== PIPELINE COMMERCIAL & LEADS ==========
export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: string;
  probability: number;
  successCriteria?: string;
}

export interface Opportunity {
  id: string;
  name: string;
  companyId: string;
  contactId: string;
  amount: number;
  currency: string;
  stage: string; // PipelineStage id
  stageChangedAt: Date;
  expectedCloseDate: Date;
  actualCloseDate?: Date;
  probability: number;
  status: 'open' | 'won' | 'lost';
  priority: Priority;
  description: string;
  owner: string; // userId
  tags: string[];
  customFields?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  source: 'website' | 'email' | 'phone' | 'event' | 'referral' | 'social' | 'other';
  campaignId?: string;
  score: number; // 0-100
  status: 'new' | 'contacted' | 'qualified' | 'disqualified' | 'converted';
  lastTouched: Date;
  nextAction?: string;
  owner?: string; // userId
  notes: string;
  createdAt: Date;
}

export interface Quote {
  id: string;
  number: string;
  opportunityId: string;
  companyId: string;
  contactId: string;
  issueDate: Date;
  expiryDate: Date;
  dueDate: Date;
  totalAmount: number;
  currency: string;
  tax: number;
  discount: number;
  items: QuoteItem[];
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  templateId?: string;
  signatureUrl?: string;
  signedAt?: Date;
  notes: string;
  owner: string; // userId
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

// ========== GED - GESTION ÉLECTRONIQUE DE DOCUMENTS ==========
export type DocumentType = 'contract' | 'invoice' | 'quote' | 'proposal' | 'report' | 'receipt' | 'other';
export type DocumentCategory = 'commercial' | 'financial' | 'rh' | 'legal' | 'technical' | 'marketing' | 'other';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'awaiting_revision';

export interface Document {
  id: string;
  name: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileUrl: string;
  documentType: DocumentType;
  category: DocumentCategory;
  relatedTo: {
    type: 'company' | 'contact' | 'opportunity' | 'invoice' | 'project';
    id: string;
  }[];
  uploadedBy: string; // userId
  uploadedAt: Date;
  expiryDate?: Date;
  status: Status;
  ocrText?: string;
  tags: string[];
  version: number;
  versions?: DocumentVersion[];
  accessControl: AccessRight[];
  approvalWorkflow?: ApprovalWorkflow;
  metadata?: Record<string, any>;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  fileUrl: string;
  uploadedAt: Date;
  uploadedBy: string;
  changeLog: string;
}

export interface AccessRight {
  id: string;
  userId?: string;
  role?: UserRole;
  permission: 'view' | 'download' | 'edit' | 'share' | 'delete' | 'admin';
  grantedAt: Date;
  expiresAt?: Date;
}

export interface ApprovalWorkflow {
  id: string;
  documentId: string;
  steps: ApprovalStep[];
  status: ApprovalStatus;
  createdAt: Date;
  completedAt?: Date;
}

export interface ApprovalStep {
  id: string;
  stepNumber: number;
  approverUserId: string;
  status: ApprovalStatus;
  comments?: string;
  actionDate?: Date;
}

// ========== FACTURATION & FINANCIER ==========
export interface Invoice {
  id: string;
  number: string;
  quoteId?: string;
  companyId: string;
  contactId: string;
  issueDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  paymentStatus: 'unpaid' | 'partial' | 'paid' | 'refunded';
  paymentMethod?: string;
  paymentDate?: Date;
  notes: string;
  owner: string; // userId
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
  projectId?: string;
}

export interface CreditNote {
  id: string;
  number: string;
  invoiceId: string;
  amount: number;
  reason: string;
  issueDate: Date;
  notes: string;
  status: 'draft' | 'issued' | 'applied';
  createdAt: Date;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  paymentDate: Date;
  method: 'bank_transfer' | 'card' | 'check' | 'cash' | 'other';
  reference: string;
  notes: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface FinancialDashboard {
  totalRevenue: number;
  totalInvoiced: number;
  totalPaid: number;
  totalUnpaid: number;
  totalOverdue: number;
  cashFlow: CashFlowData[];
  revenueByMonth: RevenueData[];
  topClients: ClientRevenue[];
  paymentMetrics: PaymentMetrics;
}

export interface CashFlowData {
  date: Date;
  inflow: number;
  outflow: number;
  balance: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  target: number;
  invoices: number;
}

export interface ClientRevenue {
  companyId: string;
  companyName: string;
  totalAmount: number;
  invoiceCount: number;
}

export interface PaymentMetrics {
  averagePaymentTime: number; // en jours
  paymentOnTimePercentage: number;
  daysPayableOutstanding: number;
}

// ========== PROJETS & PRESTATIONS ==========
export interface Project {
  id: string;
  name: string;
  code: string;
  description: string;
  companyId: string;
  contactId?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  priority: Priority;
  startDate: Date;
  endDate: Date;
  budget: number;
  spent: number;
  currency: string;
  manager: string; // userId
  team: ProjectTeamMember[];
  tasks: Task[];
  timesheets: Timesheet[];
  deliverables: Deliverable[];
  attachments: string[];
  progress: number; // 0-100
  ganttData?: GanttTask[];
  customFields?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectTeamMember {
  userId: string;
  role: string;
  allocatedHours: number;
  startDate: Date;
  endDate: Date;
}

export interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  assignedTo: string; // userId
  status: 'todo' | 'in_progress' | 'in_review' | 'completed' | 'blocked';
  priority: Priority;
  startDate: Date;
  dueDate: Date;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  dependencies?: string[]; // Task ids
  subtasks?: Task[];
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Timesheet {
  id: string;
  projectId: string;
  userId: string;
  date: Date;
  hours: number;
  taskId?: string;
  description: string;
  billable: boolean;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
}

export interface Deliverable {
  id: string;
  projectId: string;
  name: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'delivered' | 'accepted' | 'rejected' | 'in_review';
  fileUrl?: string;
  submittedAt?: Date;
  submittedBy?: string;
  acceptedAt?: Date;
  acceptedBy?: string;
  comments?: string;
}

export interface GanttTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  dependencies?: string[];
  type: 'task' | 'milestone' | 'group';
  resources?: string[];
}

// ========== RESSOURCES HUMAINES ==========
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hireDate: Date;
  birthDate: Date;
  address: Address;
  profileImage?: string;
  jobTitle: string;
  department: string;
  manager?: string; // userId
  reportingTo?: string; // userId
  status: 'active' | 'on_leave' | 'inactive' | 'terminated';
  employmentType: 'full-time' | 'part-time' | 'contractor' | 'intern';
  skills: Skill[];
  certifications: Certification[];
  availability: Availability[];
  documents: EmployeeDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
  endorsements: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialUrl?: string;
}

export interface Availability {
  id: string;
  employeeId: string;
  startDate: Date;
  endDate: Date;
  type: 'available' | 'unavailable' | 'leave' | 'training';
  hoursPerWeek: number;
  notes: string;
}

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  name: string;
  category: 'contract' | 'salary' | 'training' | 'evaluation' | 'other';
  fileUrl: string;
  uploadedAt: Date;
  expireDate?: Date;
}

export interface Leave {
  id: string;
  employeeId: string;
  type: 'vacation' | 'sick' | 'unpaid' | 'parental' | 'sabbatical';
  startDate: Date;
  endDate: Date;
  days: number;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  notes: string;
  createdAt: Date;
}

export interface Payroll {
  id: string;
  employeeId: string;
  period: string;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  paymentDate: Date;
  status: 'draft' | 'processed' | 'paid';
}

// ========== MARKETING & COMMUNICATION ==========
export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'social' | 'whatsapp' | 'multi-channel';
  channel: 'email' | 'sms' | 'whatsapp' | 'facebook' | 'instagram' | 'linkedin' | 'twitter';
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'cancelled';
  objective: string;
  targetAudience: CampaignSegment;
  budget: number;
  currency: string;
  startDate: Date;
  endDate?: Date;
  template?: string;
  metrics: CampaignMetrics;
  owner: string; // userId
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignSegment {
  filters: SegmentFilter[];
  targetCount: number;
}

export interface SegmentFilter {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greater' | 'less';
  value: string | number;
}

export interface CampaignMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  bounced: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  roi: number;
}

export interface Newsletter {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
  subscribers: number;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  template: string;
  owner: string; // userId
  createdAt: Date;
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: 'campaign' | 'transactional' | 'newsletter' | 'welcome' | 'reminder';
  subject: string;
  htmlContent: string;
  previewText: string;
  variables: string[];
  status: 'active' | 'archived';
  createdAt: Date;
}

export interface WhatsappTemplate {
  id: string;
  name: string;
  category: 'reminder' | 'notification' | 'appointment' | 'other';
  content: string;
  variables: string[];
  language: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface SocialMediaPost {
  id: string;
  campaignId?: string;
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter';
  content: string;
  scheduledFor: Date;
  publishedAt?: Date;
  images: string[];
  hashtags: string[];
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  metrics?: SocialMetrics;
  createdAt: Date;
}

export interface SocialMetrics {
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  engagement: number;
  reach: number;
}

// ========== SYSTÈME D'UTILISATEURS ET PERMISSIONS ==========
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImage?: string;
  role: UserRole;
  department?: string;
  status: Status;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  settings?: UserSettings;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  defaultView?: string;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  inApp: boolean;
  whatsapp: boolean;
  frequency: 'instant' | 'daily' | 'weekly';
}

export interface Permission {
  id: string;
  role: UserRole;
  module: string;
  action: string; // 'create', 'read', 'update', 'delete'
  conditions?: Record<string, any>;
}

// ========== NOTIFICATIONS & TÂCHES ==========
export interface Notification {
  id: string;
  userId: string;
  type: 'reminder' | 'alert' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  actionUrl?: string;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
}

export interface Reminder {
  id: string;
  userId: string;
  relatedTo: {
    type: 'contact' | 'opportunity' | 'invoice' | 'task' | 'meeting';
    id: string;
  };
  reminderDate: Date;
  reminderType: 'email' | 'sms' | 'whatsapp' | 'push';
  message: string;
  status: 'pending' | 'sent' | 'dismissed';
  sentAt?: Date;
}

// ========== ACTIVITÉ & AUDIT ==========
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: Record<string, any>;
  after?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

// ========== PARAMÈTRES SYSTÈME ==========
export interface SystemSettings {
  companyName: string;
  companyLogo?: string;
  defaultCurrency: string;
  defaultLanguage: string;
  taxRate: number;
  fiscalYearStart: number;
  businessHours: BusinessHours;
  apiIntegrations: ApiIntegration[];
}

export interface BusinessHours {
  monday: TimeRange;
  tuesday: TimeRange;
  wednesday: TimeRange;
  thursday: TimeRange;
  friday: TimeRange;
  saturday?: TimeRange;
  sunday?: TimeRange;
}

export interface TimeRange {
  start: string; // HH:mm
  end: string; // HH:mm
  enabled: boolean;
}

export interface ApiIntegration {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp' | 'calendar' | 'payment' | 'accounting' | 'other';
  status: 'active' | 'inactive';
  config: Record<string, any>;
  lastSyncAt?: Date;
  credentials?: Record<string, any>;
}

// ========== TABLEAU DE BORD PERSONNALISÉ ==========
export interface Dashboard {
  id: string;
  userId: string;
  name: string;
  isDefault: boolean;
  widgets: DashboardWidget[];
  layout: 'grid' | 'masonry';
  refreshInterval: number; // en secondes
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardWidget {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'calendar' | 'list' | 'custom';
  title: string;
  config: WidgetConfig;
  position: { x: number; y: number; width: number; height: number };
  dataSource?: string;
  refreshInterval?: number;
}

export interface WidgetConfig {
  metric?: string;
  timeRange?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  filters?: Record<string, any>;
  chartType?: string;
  columns?: string[];
  sortBy?: string;
  [key: string]: any;
}

// ========== RAPPORTS ==========
export interface Report {
  id: string;
  name: string;
  type: 'sales' | 'financial' | 'project' | 'hr' | 'marketing' | 'custom';
  schedule?: ReportSchedule;
  recipients: string[]; // email addresses
  format: 'pdf' | 'excel' | 'html';
  generatedAt?: Date;
  dataRange: DateRange;
  filters?: Record<string, any>;
  createdBy: string; // userId
  createdAt: Date;
}

export interface ReportSchedule {
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
  nextRun: Date;
  timezone: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}
