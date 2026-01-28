import { Company, Contact, Invoice, Quote, Project, Employee, Campaign, Opportunity } from '@/app/types';

// Service de gestion de données
export const dataService = {
  // Companies
  getCompanies: (): Company[] => {
    // Mock data - à remplacer par appel API
    return [];
  },

  createCompany: (company: Partial<Company>): Company => {
    console.log('Creating company:', company);
    return {} as Company;
  },

  updateCompany: (id: string, company: Partial<Company>): Company => {
    console.log('Updating company:', id, company);
    return {} as Company;
  },

  deleteCompany: (id: string): void => {
    console.log('Deleting company:', id);
  },

  // Contacts
  getContacts: (): Contact[] => {
    return [];
  },

  createContact: (contact: Partial<Contact>): Contact => {
    console.log('Creating contact:', contact);
    return {} as Contact;
  },

  updateContact: (id: string, contact: Partial<Contact>): Contact => {
    console.log('Updating contact:', id, contact);
    return {} as Contact;
  },

  deleteContact: (id: string): void => {
    console.log('Deleting contact:', id);
  },

  // Invoices
  getInvoices: (): Invoice[] => {
    return [];
  },

  createInvoice: (invoice: Partial<Invoice>): Invoice => {
    console.log('Creating invoice:', invoice);
    return {} as Invoice;
  },

  updateInvoice: (id: string, invoice: Partial<Invoice>): Invoice => {
    console.log('Updating invoice:', id, invoice);
    return {} as Invoice;
  },

  deleteInvoice: (id: string): void => {
    console.log('Deleting invoice:', id);
  },

  // Projects
  getProjects: (): Project[] => {
    return [];
  },

  createProject: (project: Partial<Project>): Project => {
    console.log('Creating project:', project);
    return {} as Project;
  },

  updateProject: (id: string, project: Partial<Project>): Project => {
    console.log('Updating project:', id, project);
    return {} as Project;
  },

  deleteProject: (id: string): void => {
    console.log('Deleting project:', id);
  },

  // Employees
  getEmployees: (): Employee[] => {
    return [];
  },

  createEmployee: (employee: Partial<Employee>): Employee => {
    console.log('Creating employee:', employee);
    return {} as Employee;
  },

  updateEmployee: (id: string, employee: Partial<Employee>): Employee => {
    console.log('Updating employee:', id, employee);
    return {} as Employee;
  },

  deleteEmployee: (id: string): void => {
    console.log('Deleting employee:', id);
  },
};

// Service de rapports
export const reportService = {
  generateSalesReport: (startDate: Date, endDate: Date) => {
    return {
      period: { startDate, endDate },
      totalRevenue: 245750,
      invoicesCount: 42,
      quotesCount: 28,
      conversionRate: 24.8,
      topClients: [
        { name: 'Acme Corporation', revenue: 45000 },
        { name: 'TechStart SAS', revenue: 38500 },
        { name: 'Global Industries', revenue: 32000 }
      ],
      revenueByMonth: [
        { month: 'Jan', revenue: 45000 },
        { month: 'Fév', revenue: 52000 },
        { month: 'Mar', revenue: 48750 }
      ]
    };
  },

  generateFinancialReport: (startDate: Date, endDate: Date) => {
    return {
      period: { startDate, endDate },
      totalInvoiced: 245750,
      totalPaid: 198600,
      totalUnpaid: 47150,
      totalOverdue: 12300,
      averagePaymentTime: 28, // jours
      paymentMetrics: {
        onTimePercentage: 78,
        latePercentage: 22
      }
    };
  },

  generateProjectReport: (projectId: string) => {
    return {
      projectId,
      name: 'Project digitale transformation',
      budget: 150000,
      spent: 98500,
      progress: 65,
      timeline: {
        planned: '2026-06-30',
        forecast: '2026-06-15',
        status: 'on-track'
      },
      resources: {
        allocated: 8,
        available: 12
      },
      risks: [
        { name: 'Retard livraison composant', severity: 'high', mitigation: 'En cours' }
      ]
    };
  },

  generateMarketingReport: (campaignId?: string) => {
    return {
      campaignId,
      period: 'January 2026',
      campaigns: 5,
      totalReach: 125000,
      totalEngagement: 8500,
      engagementRate: 6.8,
      conversions: 340,
      roi: 3.2,
      topPerformers: [
        { name: 'Email Campaign Q1', engagement: 3200, roi: 4.2 },
        { name: 'Social Media Campaign', engagement: 3100, roi: 2.8 },
        { name: 'Newsletter Weekly', engagement: 1200, roi: 2.1 }
      ]
    };
  },

  generateHRReport: () => {
    return {
      totalEmployees: 42,
      activeEmployees: 40,
      onLeave: 2,
      turnoverRate: 5,
      averageTenure: 4.2, // années
      departmentBreakdown: [
        { name: 'Sales', count: 12 },
        { name: 'Technology', count: 15 },
        { name: 'Marketing', count: 8 },
        { name: 'HR', count: 4 },
        { name: 'Finance', count: 3 }
      ],
      topSkills: [
        { skill: 'JavaScript', count: 8 },
        { skill: 'Sales Management', count: 6 },
        { skill: 'Python', count: 5 }
      ]
    };
  },
};

// Service de validation et nettoyage de données
export const validationService = {
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePhone: (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  },

  validateCompanyName: (name: string): boolean => {
    return name.trim().length >= 2;
  },

  validateInvoiceNumber: (number: string): boolean => {
    return number.trim().length > 0;
  },

  validateAmount: (amount: number): boolean => {
    return amount > 0;
  },

  sanitizeInput: (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  },

  formatPhone: (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
    }
    return phone;
  },

  formatCurrency: (amount: number, currency: string = 'EUR'): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  formatDate: (date: Date): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  },
};

// Service de filtrage et tri
export const filterService = {
  filterByStatus: <T extends { status: string }>(items: T[], status: string): T[] => {
    if (status === 'all') return items;
    return items.filter((item) => item.status === status);
  },

  filterByDate: <T extends { createdAt: Date }>(
    items: T[],
    startDate: Date,
    endDate: Date
  ): T[] => {
    return items.filter(
      (item) =>
        item.createdAt >= startDate && item.createdAt <= endDate
    );
  },

  sortByField: <T extends Record<string, any>>(
    items: T[],
    field: string,
    direction: 'asc' | 'desc' = 'asc'
  ): T[] => {
    return [...items].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (typeof aValue === 'string') {
        return direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  },

  groupByField: <T extends Record<string, any>>(
    items: T[],
    field: string
  ): Record<string, T[]> => {
    return items.reduce(
      (acc, item) => {
        const key = item[field];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      },
      {} as Record<string, T[]>
    );
  },

  paginateItems: <T>(items: T[], page: number, pageSize: number): T[] => {
    const startIndex = (page - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  },
};

// Service de cache
export const cacheService = {
  cache: new Map<string, { data: any; timestamp: number }>(),
  cacheDuration: 5 * 60 * 1000, // 5 minutes

  get: <T>(key: string): T | null => {
    const cached = cacheService.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cacheService.cacheDuration) {
      cacheService.cache.delete(key);
      return null;
    }

    return cached.data as T;
  },

  set: (key: string, data: any): void => {
    cacheService.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  },

  clear: (key?: string): void => {
    if (key) {
      cacheService.cache.delete(key);
    } else {
      cacheService.cache.clear();
    }
  },
};

// ======= Catalogue (produits / services) =======
export interface CatalogItem {
  id: number;
  name: string;
  description?: string;
  unitPrice: number;
  defaultQuantity?: number;
  defaultDiscount?: number; // percent
  vatRate?: number; // percent
  currency?: string;
}

const CATALOG_KEY = 'app_catalog_items_v1';

export const catalogService = {
  getCatalog: (): CatalogItem[] => {
    try {
      const raw = localStorage.getItem(CATALOG_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as CatalogItem[];
    } catch (e) {
      console.error('Failed to read catalog from localStorage', e);
      return [];
    }
  },

  saveCatalog: (items: CatalogItem[]) => {
    try {
      localStorage.setItem(CATALOG_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save catalog to localStorage', e);
    }
  },

  addCatalogItem: (item: Omit<CatalogItem, 'id'>) => {
    const items = catalogService.getCatalog();
    const id = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
    const newItem: CatalogItem = { id, ...item } as CatalogItem;
    items.push(newItem);
    catalogService.saveCatalog(items);
    return newItem;
  },

  updateCatalogItem: (id: number, patch: Partial<CatalogItem>) => {
    const items = catalogService.getCatalog();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...patch };
    catalogService.saveCatalog(items);
    return items[idx];
  },

  deleteCatalogItem: (id: number) => {
    let items = catalogService.getCatalog();
    items = items.filter(i => i.id !== id);
    catalogService.saveCatalog(items);
  }
};
