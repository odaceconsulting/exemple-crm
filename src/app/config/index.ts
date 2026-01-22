import { SystemSettings, ApiIntegration } from '@/app/types';

// Configuration système
export const systemConfig: SystemSettings = {
  companyName: 'CRM Pro Template',
  companyLogo: '/logo.png',
  defaultCurrency: 'EUR',
  defaultLanguage: 'fr',
  taxRate: 20,
  fiscalYearStart: 1,
  businessHours: {
    monday: { start: '08:00', end: '18:00', enabled: true },
    tuesday: { start: '08:00', end: '18:00', enabled: true },
    wednesday: { start: '08:00', end: '18:00', enabled: true },
    thursday: { start: '08:00', end: '18:00', enabled: true },
    friday: { start: '08:00', end: '18:00', enabled: true },
    saturday: { start: '09:00', end: '13:00', enabled: false },
    sunday: { start: '00:00', end: '00:00', enabled: false }
  },
  apiIntegrations: [
    {
      id: '1',
      name: 'SendGrid Email',
      type: 'email',
      status: 'active',
      config: {
        apiKey: 'process.env.SENDGRID_API_KEY',
        sender: 'noreply@crmpro.com'
      }
    },
    {
      id: '2',
      name: 'Twilio SMS',
      type: 'sms',
      status: 'active',
      config: {
        accountSid: 'process.env.TWILIO_ACCOUNT_SID',
        authToken: 'process.env.TWILIO_AUTH_TOKEN',
        phoneNumber: '+1234567890'
      }
    },
    {
      id: '3',
      name: 'WhatsApp Business API',
      type: 'whatsapp',
      status: 'active',
      config: {
        businessAccountId: 'process.env.WHATSAPP_BUSINESS_ID',
        accessToken: 'process.env.WHATSAPP_ACCESS_TOKEN',
        phoneNumberId: 'process.env.WHATSAPP_PHONE_ID'
      }
    },
    {
      id: '4',
      name: 'Google Calendar',
      type: 'calendar',
      status: 'active',
      config: {
        apiKey: 'process.env.GOOGLE_API_KEY',
        clientId: 'process.env.GOOGLE_CLIENT_ID',
        scope: ['calendar']
      }
    },
    {
      id: '5',
      name: 'Stripe Payment',
      type: 'payment',
      status: 'active',
      config: {
        publishableKey: 'process.env.STRIPE_PUBLISHABLE_KEY',
        secretKey: 'process.env.STRIPE_SECRET_KEY'
      }
    },
    {
      id: '6',
      name: 'DocuSign Signature',
      type: 'other',
      status: 'active',
      config: {
        integrationKey: 'process.env.DOCUSIGN_INTEGRATION_KEY',
        userId: 'process.env.DOCUSIGN_USER_ID',
        accountId: 'process.env.DOCUSIGN_ACCOUNT_ID'
      }
    },
    {
      id: '7',
      name: 'QuickBooks Accounting',
      type: 'accounting',
      status: 'active',
      config: {
        realmId: 'process.env.QUICKBOOKS_REALM_ID',
        clientId: 'process.env.QUICKBOOKS_CLIENT_ID',
        clientSecret: 'process.env.QUICKBOOKS_CLIENT_SECRET'
      }
    }
  ]
};

// Configuration de l'UI
export const uiConfig = {
  theme: {
    primary: '#0066CC',
    secondary: '#00A3FF',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    dark: '#1F2937',
    light: '#F9FAFB',
    border: '#E5E7EB',
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      light: '#9CA3AF'
    }
  },
  layout: {
    sidebarWidth: 256,
    sidebarCollapsedWidth: 80,
    headerHeight: 64,
    mobileBreakpoint: 768,
    tabletBreakpoint: 1024
  },
  animations: {
    duration: 300,
    easing: 'ease-in-out'
  }
};

// Configuration des formulaires
export const formConfig = {
  defaultValidation: {
    required: true,
    minLength: 3,
    maxLength: 255
  },
  fields: {
    email: {
      type: 'email',
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    phone: {
      type: 'tel',
      required: true,
      pattern: /^[\d\s\-\+\(\)]{10,}$/
    },
    amount: {
      type: 'number',
      required: true,
      min: 0
    },
    date: {
      type: 'date',
      required: true
    },
    textarea: {
      maxLength: 1000
    }
  }
};

// Configuration des notifications
export const notificationConfig = {
  defaultDuration: 5000, // ms
  positions: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
  types: {
    success: {
      bg: '#D1FAE5',
      text: '#065F46',
      border: '#6EE7B7'
    },
    error: {
      bg: '#FEE2E2',
      text: '#7F1D1D',
      border: '#FECACA'
    },
    warning: {
      bg: '#FEF3C7',
      text: '#78350F',
      border: '#FDE68A'
    },
    info: {
      bg: '#DBEAFE',
      text: '#0C2340',
      border: '#93C5FD'
    }
  }
};

// Configuration des modules
export const moduleConfig = {
  modules: [
    {
      id: 'dashboard',
      name: 'Tableau de Bord',
      icon: 'LayoutDashboard',
      enabled: true,
      requiredRole: 'user'
    },
    {
      id: 'companies',
      name: 'Compagnies',
      icon: 'Building2',
      enabled: true,
      requiredRole: 'user'
    },
    {
      id: 'contacts',
      name: 'Contacts',
      icon: 'Users',
      enabled: true,
      requiredRole: 'user'
    },
    {
      id: 'pipeline',
      name: 'Pipeline Commercial',
      icon: 'TrendingUp',
      enabled: true,
      requiredRole: 'user'
    },
    {
      id: 'documents',
      name: 'GED',
      icon: 'FolderOpen',
      enabled: true,
      requiredRole: 'user'
    },
    {
      id: 'invoicing',
      name: 'Facturation',
      icon: 'FileText',
      enabled: true,
      requiredRole: 'user'
    },
    {
      id: 'projects',
      name: 'Projets',
      icon: 'Briefcase',
      enabled: true,
      requiredRole: 'user'
    },
    {
      id: 'hr',
      name: 'RH',
      icon: 'UserSquare2',
      enabled: true,
      requiredRole: 'manager'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: 'Mail',
      enabled: true,
      requiredRole: 'user'
    },
    {
      id: 'settings',
      name: 'Paramètres',
      icon: 'Settings',
      enabled: true,
      requiredRole: 'admin'
    }
  ]
};

// Configuration des rapports
export const reportConfig = {
  types: [
    {
      id: 'sales',
      name: 'Rapport Ventes',
      description: 'Analyse des ventes et du pipeline',
      frequency: ['once', 'daily', 'weekly', 'monthly'],
      metrics: ['totalRevenue', 'invoicesCount', 'conversionRate', 'topClients']
    },
    {
      id: 'financial',
      name: 'Rapport Financier',
      description: 'État financier et trésorerie',
      frequency: ['once', 'weekly', 'monthly', 'quarterly'],
      metrics: ['totalInvoiced', 'totalPaid', 'totalUnpaid', 'paymentMetrics']
    },
    {
      id: 'project',
      name: 'Rapport Projet',
      description: 'Suivi des projets et ressources',
      frequency: ['once', 'weekly', 'monthly'],
      metrics: ['budget', 'spent', 'progress', 'timeline', 'risks']
    },
    {
      id: 'marketing',
      name: 'Rapport Marketing',
      description: 'Performance des campagnes',
      frequency: ['once', 'daily', 'weekly', 'monthly'],
      metrics: ['reach', 'engagement', 'conversions', 'roi']
    },
    {
      id: 'hr',
      name: 'Rapport RH',
      description: 'Ressources humaines et effectifs',
      frequency: ['once', 'monthly', 'quarterly'],
      metrics: ['totalEmployees', 'turnoverRate', 'departmentBreakdown']
    }
  ]
};

// Configuration du stockage local
export const storageConfig = {
  keys: {
    user: 'crm_user',
    theme: 'crm_theme',
    language: 'crm_language',
    preferences: 'crm_preferences',
    cache: 'crm_cache',
    drafts: 'crm_drafts'
  },
  maxSize: 5 * 1024 * 1024, // 5MB
  ttl: 24 * 60 * 60 * 1000 // 24 heures
};

// Configuration des droits d'accès par défaut
export const accessControlConfig = {
  defaultRolePermissions: {
    admin: ['create', 'read', 'update', 'delete', 'admin'],
    manager: ['create', 'read', 'update', 'delete'],
    user: ['read', 'create'],
    guest: ['read']
  },
  documentAccess: {
    admin: ['view', 'download', 'edit', 'share', 'delete', 'admin'],
    manager: ['view', 'download', 'edit', 'share'],
    user: ['view', 'download'],
    guest: ['view']
  }
};

// Configuration des workflows d'approbation
export const workflowConfig = {
  documentApproval: {
    steps: [
      {
        name: 'Service responsable',
        sequence: 1,
        requiredRoles: ['manager']
      },
      {
        name: 'Direction générale',
        sequence: 2,
        requiredRoles: ['admin']
      }
    ],
    timeoutDays: 7,
    notificationFrequency: 2 // tous les 2 jours
  },
  invoiceApproval: {
    steps: [
      {
        name: 'Validation facture',
        sequence: 1,
        requiredRoles: ['user']
      },
      {
        name: 'Approbation manager',
        sequence: 2,
        requiredRoles: ['manager']
      },
      {
        name: 'Approbation financier',
        sequence: 3,
        requiredRoles: ['admin']
      }
    ],
    timeoutDays: 5,
    notificationFrequency: 1
  }
};

// Configuration des rappels et notifications
export const reminderConfig = {
  types: {
    email: {
      enabled: true,
      delayMinutes: 0
    },
    sms: {
      enabled: true,
      delayMinutes: 5
    },
    whatsapp: {
      enabled: true,
      delayMinutes: 10
    },
    push: {
      enabled: true,
      delayMinutes: 0
    }
  },
  defaultReminders: [
    {
      trigger: 'invoice_due',
      daysBeforeDue: 1,
      channels: ['email']
    },
    {
      trigger: 'invoice_overdue',
      daysAfterDue: 1,
      channels: ['email', 'sms']
    },
    {
      trigger: 'meeting_upcoming',
      minutesBefore: 15,
      channels: ['email', 'push']
    },
    {
      trigger: 'task_due',
      daysBefore: 1,
      channels: ['email', 'push']
    }
  ]
};

export default {
  systemConfig,
  uiConfig,
  formConfig,
  notificationConfig,
  moduleConfig,
  reportConfig,
  storageConfig,
  accessControlConfig,
  workflowConfig,
  reminderConfig
};
