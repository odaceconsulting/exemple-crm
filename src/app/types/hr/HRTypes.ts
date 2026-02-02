// Employee Types
export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    managerId?: string;
    hireDate: string;
    contractType: 'CDI' | 'CDD' | 'Stage' | 'Freelance';
    status: 'active' | 'inactive' | 'on_leave';
    salary: number;
    photo?: string;
    address: string;
    birthDate: string;
    emergencyContact: {
        name: string;
        phone: string;
        relationship: string;
    };
}

export interface Contract {
    id: string;
    employeeId: string;
    type: 'CDI' | 'CDD' | 'Stage' | 'Freelance';
    startDate: string;
    endDate?: string;
    salary: number;
    position: string;
    department: string;
    workingHours: number;
    documentUrl?: string;
    status: 'active' | 'expired' | 'terminated';
}

export interface OrgNode {
    id: string;
    employeeId: string;
    name: string;
    position: string;
    department: string;
    children: OrgNode[];
    photo?: string;
}

// Leave Types
export interface LeaveRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid';
    startDate: string;
    endDate: string;
    days: number;
    reason?: string;
    status: 'pending' | 'approved' | 'rejected';
    validatedBy?: string;
    validatedAt?: string;
    comments?: string;
    createdAt: string;
}

export interface LeaveCounter {
    employeeId: string;
    employeeName: string;
    vacation: {
        total: number;
        used: number;
        remaining: number;
    };
    sick: {
        total: number;
        used: number;
        remaining: number;
    };
    personal: {
        total: number;
        used: number;
        remaining: number;
    };
    year: number;
}

export interface LeaveAlert {
    id: string;
    type: 'expiring_soon' | 'low_balance' | 'pending_approval' | 'conflict';
    employeeId: string;
    employeeName: string;
    message: string;
    severity: 'info' | 'warning' | 'error';
    createdAt: string;
}

// Reporting Types
export interface HeadcountStats {
    total: number;
    byDepartment: { department: string; count: number }[];
    byContractType: { type: string; count: number }[];
    byStatus: { status: string; count: number }[];
    newHires: number;
    departures: number;
}

export interface TurnoverData {
    period: string;
    turnoverRate: number;
    departures: number;
    averageHeadcount: number;
    departuresByReason: { reason: string; count: number }[];
}

export interface PayrollMassData {
    totalPayroll: number;
    byDepartment: { department: string; amount: number }[];
    averageSalary: number;
    medianSalary: number;
    evolution: { month: string; amount: number }[];
}

export interface AgePyramidData {
    ageRanges: {
        range: string;
        male: number;
        female: number;
    }[];
}

// --- RECRUITMENT TYPES ---

export interface JobOffer {
    id: string;
    title: string;
    department: string;
    location: string;
    type: 'CDI' | 'CDD' | 'Stage' | 'Freelance';
    status: 'published' | 'draft' | 'closed';
    postedDate: string;
    candidatesCount: number;
    description: string;
    requirements: string[];
}

export interface Candidate {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
    appliedDate: string;
    cvUrl?: string;
    score?: number;
    tags: string[];
    jobId: string;
    notes?: string;
}

export interface Interview {
    id: string;
    candidateId: string;
    candidateName: string;
    date: string;
    interviewer: string;
    type: 'phone' | 'video' | 'onsite';
    status: 'scheduled' | 'completed' | 'cancelled';
    feedback?: string;
}

// --- EVALUATION TYPES ---

export interface Evaluation {
    id: string;
    employeeId: string;
    employeeName: string;
    type: 'annual' | 'quarterly' | 'probation';
    status: 'scheduled' | 'in-progress' | 'completed' | 'signed';
    date: string;
    reviewer: string;
    score?: number; // 0-100
    strengths?: string[];
    improvements?: string[];
    goalsMet?: boolean;
}

export interface Objective {
    id: string;
    employeeId: string;
    title: string;
    description: string;
    type: 'individual' | 'team' | 'company';
    status: 'not-started' | 'in-progress' | 'completed' | 'at-risk';
    progress: number; // 0-100
    dueDate: string;
    weight?: number; // Importance
}

// --- TRAINING TYPES ---

export interface Training {
    id: string;
    title: string;
    provider: string;
    duration: string;
    format: 'online' | 'onsite' | 'hybrid';
    cost: number;
    category: string;
    description: string;
    skills: string[];
    nextSession: string;
}

export interface TrainingEnrollment {
    id: string;
    trainingId: string;
    employeeId: string;
    status: 'requested' | 'approved' | 'in-progress' | 'completed' | 'cancelled';
    progress?: number;
    startDate?: string;
    endDate?: string;
    certificateUrl?: string;
}

// --- PAYROLL TYPES ---

export interface PayrollVariable {
    id: string;
    employeeId: string;
    employeeName: string;
    period: string; // YYYY-MM
    type: 'bonus' | 'overtime' | 'deduction' | 'commission';
    amount: number;
    description: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface Payslip {
    id: string;
    employeeId: string;
    employeeName: string;
    period: string;
    grossSalary: number;
    netSalary: number;
    paymentDate: string;
    status: 'draft' | 'generated' | 'paid';
    pdfUrl?: string;
}

// --- EXPENSE TYPES ---

export interface ExpenseReport {
    id: string;
    employeeId: string;
    employeeName: string;
    date: string;
    category: 'transport' | 'meals' | 'accommodation' | 'supplies' | 'other';
    amount: number;
    description: string;
    status: 'pending' | 'approved' | 'rejected' | 'reimbursed';
    receiptUrl?: string;
    submittedAt?: string;
    approvedBy?: string;
}
