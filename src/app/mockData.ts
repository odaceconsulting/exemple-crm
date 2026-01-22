// Données d'exemple pour démonstration et test
// À remplacer par des données réelles depuis votre API

import { Company, Contact, Invoice, Quote, Document, Project, Employee, Campaign, Opportunity } from '@/app/types';

// ===== COMPANIES =====
export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    siret: '12345678901234',
    siren: '123456789',
    legalForm: 'SARL',
    industry: 'Technology',
    address: {
      street: '123 Rue de l\'Innovation',
      city: 'Paris',
      postalCode: '75001',
      country: 'France'
    },
    phone: '+33 1 23 45 67 89',
    email: 'contact@acme.com',
    website: 'https://acme.com',
    employees: 250,
    annualRevenue: 2500000,
    status: 'active',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2026-01-20'),
    description: 'Leader en solutions technologiques innovantes',
    tags: ['tech', 'innovation', 'partenaire']
  },
  {
    id: '2',
    name: 'TechStart SAS',
    siret: '98765432101234',
    siren: '987654321',
    legalForm: 'SAS',
    industry: 'Software',
    address: {
      street: '456 Avenue des Startups',
      city: 'Lyon',
      postalCode: '69000',
      country: 'France'
    },
    phone: '+33 4 72 12 34 56',
    email: 'hello@techstart.fr',
    website: 'https://techstart.fr',
    employees: 45,
    annualRevenue: 850000,
    status: 'active',
    createdAt: new Date('2024-06-10'),
    updatedAt: new Date('2026-01-22'),
    description: 'Startup en développement de solutions web',
    tags: ['startup', 'web', 'développement']
  },
  {
    id: '3',
    name: 'Global Industries',
    siret: '56789012345678',
    siren: '567890123',
    legalForm: 'SA',
    industry: 'Manufacturing',
    address: {
      street: '789 Zone Industrielle',
      city: 'Marseille',
      postalCode: '13000',
      country: 'France'
    },
    phone: '+33 4 91 11 22 33',
    email: 'info@globalind.com',
    website: 'https://globalindustries.com',
    employees: 500,
    annualRevenue: 5000000,
    status: 'active',
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2026-01-21'),
    description: 'Groupe industriel européen',
    tags: ['industrie', 'fabrication', 'export']
  }
];

// ===== CONTACTS =====
export const mockContacts: Contact[] = [
  {
    id: '1',
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie.dupont@acme.com',
    phone: '+33 1 23 45 67 89',
    mobile: '+33 6 12 34 56 78',
    jobTitle: 'Directrice Générale',
    department: 'Management',
    companyId: '1',
    company: mockCompanies[0],
    profileImage: 'https://via.placeholder.com/150?text=MD',
    status: 'active',
    leadScore: 95,
    preferences: {
      preferredCommunication: 'email',
      communicationFrequency: 'weekly',
      newsletter: true,
      doNotContact: false
    },
    lastInteraction: new Date('2026-01-20'),
    nextFollowUp: new Date('2026-01-25'),
    tags: ['decision-maker', 'vip', 'contract-2025'],
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2026-01-20')
  },
  {
    id: '2',
    firstName: 'Jean',
    lastName: 'Martin',
    email: 'jean.martin@techstart.fr',
    phone: '+33 4 72 12 34 56',
    mobile: '+33 6 98 76 54 32',
    jobTitle: 'Responsable Commercial',
    department: 'Sales',
    companyId: '2',
    company: mockCompanies[1],
    status: 'active',
    leadScore: 78,
    preferences: {
      preferredCommunication: 'phone',
      communicationFrequency: 'daily',
      newsletter: false,
      doNotContact: false
    },
    lastInteraction: new Date('2026-01-19'),
    nextFollowUp: new Date('2026-01-23'),
    tags: ['influenceur', 'project-manager'],
    createdAt: new Date('2024-06-10'),
    updatedAt: new Date('2026-01-19')
  },
  {
    id: '3',
    firstName: 'Sophie',
    lastName: 'Bernard',
    email: 'sophie.bernard@globalind.com',
    phone: '+33 4 91 11 22 33',
    mobile: '+33 6 55 44 33 22',
    jobTitle: 'Acheteuse Senior',
    department: 'Procurement',
    companyId: '3',
    company: mockCompanies[2],
    status: 'active',
    leadScore: 85,
    preferences: {
      preferredCommunication: 'email',
      communicationFrequency: 'weekly',
      newsletter: true,
      doNotContact: false
    },
    lastInteraction: new Date('2026-01-18'),
    nextFollowUp: new Date('2026-01-28'),
    tags: ['budget-holder', 'procurement'],
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2026-01-18')
  }
];

// ===== INVOICES =====
export const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'FAC-2026-001',
    companyId: '1',
    contactId: '1',
    issueDate: new Date('2026-01-10'),
    dueDate: new Date('2026-02-10'),
    items: [
      {
        id: '1',
        description: 'Consultation Services',
        quantity: 10,
        unitPrice: 150,
        discount: 0,
        tax: 300,
        total: 1800
      },
      {
        id: '2',
        description: 'Software License',
        quantity: 5,
        unitPrice: 500,
        discount: 50,
        tax: 200,
        total: 2450
      }
    ],
    subtotal: 4250,
    tax: 500,
    discount: 50,
    totalAmount: 4700,
    currency: 'EUR',
    status: 'sent',
    paymentStatus: 'paid',
    paymentMethod: 'bank_transfer',
    paymentDate: new Date('2026-01-15'),
    notes: 'Merci pour votre confiance',
    owner: 'user1',
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-15')
  },
  {
    id: '2',
    number: 'FAC-2026-002',
    companyId: '2',
    contactId: '2',
    issueDate: new Date('2026-01-15'),
    dueDate: new Date('2026-02-15'),
    items: [
      {
        id: '3',
        description: 'Development Services (40 hours)',
        quantity: 40,
        unitPrice: 100,
        discount: 0,
        tax: 800,
        total: 4800
      }
    ],
    subtotal: 4000,
    tax: 800,
    discount: 0,
    totalAmount: 4800,
    currency: 'EUR',
    status: 'sent',
    paymentStatus: 'pending',
    notes: 'Facture pour le projet Q1 2026',
    owner: 'user1',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-20')
  }
];

// ===== QUOTES =====
export const mockQuotes: Quote[] = [
  {
    id: '1',
    number: 'DEVIS-2026-001',
    opportunityId: 'opp1',
    companyId: '1',
    contactId: '1',
    issueDate: new Date('2026-01-18'),
    expiryDate: new Date('2026-02-18'),
    dueDate: new Date('2026-02-10'),
    totalAmount: 8500,
    currency: 'EUR',
    tax: 1700,
    discount: 0,
    items: [
      {
        id: '1',
        description: 'Consulting Package',
        quantity: 1,
        unitPrice: 8500,
        discount: 0,
        tax: 1700,
        total: 10200
      }
    ],
    status: 'sent',
    templateId: 'template1',
    notes: 'Devis valable 1 mois',
    owner: 'user1',
    createdAt: new Date('2026-01-18'),
    updatedAt: new Date('2026-01-18')
  }
];

// ===== DOCUMENTS =====
export const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Contrat_Acme_2026.pdf',
    fileName: 'Contrat_Acme_2026.pdf',
    fileSize: 2500000,
    mimeType: 'application/pdf',
    fileUrl: '/documents/Contrat_Acme_2026.pdf',
    documentType: 'contract',
    category: 'commercial',
    relatedTo: [
      { type: 'company', id: '1' },
      { type: 'contact', id: '1' }
    ],
    uploadedBy: 'user1',
    uploadedAt: new Date('2026-01-20'),
    expiryDate: new Date('2027-01-20'),
    status: 'active',
    ocrText: 'Contrat commercial entre Acme Corporation et...',
    tags: ['contrat', 'signé', 'important'],
    version: 2,
    accessControl: [
      {
        id: '1',
        role: 'admin',
        permission: 'admin'
      },
      {
        id: '2',
        role: 'manager',
        permission: 'edit'
      }
    ],
    metadata: {
      signatories: 2,
      signedDate: '2026-01-20'
    }
  }
];

// ===== PROJECTS =====
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Digital Transformation Initiative',
    code: 'PROJ-2026-001',
    description: 'Project de transformation numérique pour Acme Corporation',
    companyId: '1',
    contactId: '1',
    status: 'active',
    priority: 'high',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-06-30'),
    budget: 150000,
    spent: 45000,
    currency: 'EUR',
    manager: 'user2',
    team: [
      {
        userId: 'user2',
        role: 'Project Manager',
        allocatedHours: 160,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-06-30')
      },
      {
        userId: 'user3',
        role: 'Developer',
        allocatedHours: 400,
        startDate: new Date('2026-01-15'),
        endDate: new Date('2026-06-30')
      }
    ],
    tasks: [],
    timesheets: [],
    deliverables: [],
    attachments: [],
    progress: 30,
    createdAt: new Date('2025-12-01'),
    updatedAt: new Date('2026-01-20')
  }
];

// ===== EMPLOYEES =====
export const mockEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Rousseau',
    email: 'alice.rousseau@crmpro.com',
    phone: '+33 1 11 11 11 11',
    hireDate: new Date('2020-03-15'),
    birthDate: new Date('1985-06-20'),
    address: {
      street: '10 Rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
      country: 'France'
    },
    jobTitle: 'Senior Developer',
    department: 'Technology',
    status: 'active',
    employmentType: 'full-time',
    skills: [
      { id: '1', name: 'TypeScript', level: 'expert', yearsOfExperience: 5, endorsements: 12 },
      { id: '2', name: 'React', level: 'advanced', yearsOfExperience: 4, endorsements: 10 }
    ],
    certifications: [],
    availability: [],
    documents: [],
    createdAt: new Date('2020-03-15'),
    updatedAt: new Date('2026-01-20')
  }
];

// ===== CAMPAIGNS =====
export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Email Campaign Q1 2026',
    type: 'email',
    channel: 'email',
    status: 'running',
    objective: 'Increase lead generation',
    targetAudience: {
      filters: [
        { field: 'industry', operator: 'equals', value: 'Technology' }
      ],
      targetCount: 150
    },
    budget: 2000,
    currency: 'EUR',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-03-31'),
    template: 'template_email_q1',
    metrics: {
      sent: 145,
      delivered: 143,
      opened: 89,
      clicked: 34,
      converted: 8,
      bounced: 2,
      openRate: 62.2,
      clickRate: 23.7,
      conversionRate: 5.5,
      roi: 3.2
    },
    owner: 'user4',
    createdAt: new Date('2025-12-20'),
    updatedAt: new Date('2026-01-20')
  }
];

// ===== OPPORTUNITIES =====
export const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    name: 'Acme Corp - Digital Transformation',
    companyId: '1',
    contactId: '1',
    amount: 150000,
    currency: 'EUR',
    stage: 'proposal',
    stageChangedAt: new Date('2026-01-10'),
    expectedCloseDate: new Date('2026-02-28'),
    probability: 75,
    status: 'open',
    priority: 'high',
    description: 'Grande opportunité de transformation digitale',
    owner: 'user1',
    tags: ['digital', 'high-value', 'enterprise'],
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-20')
  },
  {
    id: '2',
    name: 'TechStart - Software Development',
    companyId: '2',
    contactId: '2',
    amount: 45000,
    currency: 'EUR',
    stage: 'negotiation',
    stageChangedAt: new Date('2026-01-15'),
    expectedCloseDate: new Date('2026-02-15'),
    probability: 60,
    status: 'open',
    priority: 'medium',
    description: 'Projet de développement logiciel',
    owner: 'user1',
    tags: ['development', 'startup', 'mid-market'],
    createdAt: new Date('2025-12-15'),
    updatedAt: new Date('2026-01-19')
  }
];

// Export all mock data
export const mockData = {
  companies: mockCompanies,
  contacts: mockContacts,
  invoices: mockInvoices,
  quotes: mockQuotes,
  documents: mockDocuments,
  projects: mockProjects,
  employees: mockEmployees,
  campaigns: mockCampaigns,
  opportunities: mockOpportunities
};

export default mockData;
