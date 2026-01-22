# CRM Template - Documentation Complète

## 📋 Vue d'ensemble

Ce template CRM professionnel est une application web complète conçue pour gérer tous les aspects d'une relation client, inspirée par HubSpot et Odoo, avec un système intégré de Gestion Électronique de Documents (GED).

## 🏗️ Architecture

### Structure des fichiers

```
src/
├── app/
│   ├── components/          # Composants React
│   │   ├── Dashboard.tsx
│   │   ├── Companies.tsx
│   │   ├── Contacts.tsx
│   │   ├── Pipeline.tsx
│   │   ├── Documents.tsx
│   │   ├── Invoicing.tsx
│   │   ├── Projects.tsx
│   │   ├── HR.tsx
│   │   ├── Marketing.tsx
│   │   └── ui/              # Composants UI réutilisables
│   ├── services/            # Logique métier
│   │   ├── authService.ts
│   │   ├── apiService.ts
│   │   ├── dataService.ts
│   │   └── index.ts
│   ├── types/               # Types TypeScript
│   │   └── index.ts
│   ├── utils/               # Utilitaires
│   │   └── helpers.ts
│   ├── config/              # Configuration
│   │   └── index.ts
│   └── App.tsx              # Composant racine
└── main.tsx                 # Point d'entrée
```

## 🔑 Fonctionnalités Principales

### 1. Tableau de Bord (Dashboard)
- KPIs en temps réel (CA, leads, conversions, clients)
- Graphiques de performance (ventes, conversions, pipeline)
- Calendrier des rendez-vous
- Notifications et alertes
- Widgets personnalisables

### 2. Gestion Commerciale
- **Compagnies**: Fiches entreprises complètes avec historique
- **Contacts**: Gestion des interlocuteurs et historique d'interactions
- **Pipeline**: Kanban commercial avec étapes personnalisables
- **Leads**: Capture, scoring automatique et qualification
- **Devis**: Générateur avec templates et signature électronique
- **Relances**: Système automatisé de rappels

### 3. Gestion Électronique de Documents (GED)
- Upload avec drag-and-drop
- Classement automatique par type, client, projet, date
- OCR intégré pour documents scannés
- Versioning et historique des modifications
- Droits d'accès granulaires par profil
- Recherche intelligente avec OCR
- Workflows d'approbation documentaire
- Classification IA automatique

### 4. Gestion Financière
- **Facturation**: Création, envoi, suivi des factures
- **Avoirs**: Gestion des avoirs et notes de crédit
- **Paiements**: Suivi des encaissements et paiements
- **Comptabilité**: Écritures comptables automatiques
- **Tableau de bord financier**: CA, trésorerie, prévisions

### 5. Gestion de Projets
- Planification et ressources
- Timesheets avec validation
- Suivi des prestations et livrables
- Gantt et calendrier visuels
- Budget et dépenses tracking
- Risques et alertes

### 6. Ressources Humaines
- Fiches collaborateurs avec compétences
- Planning d'équipe et affectation
- Documents RH (contrats, bulletins, formations)
- Gestion des congés
- Paie et avantages

### 7. Marketing
- Campagnes multi-canaux (email, SMS, WhatsApp, réseaux sociaux)
- Suivi ROI et performance
- Intégration WhatsApp pour rendez-vous automatisés
- Newsletter et gestion abonnés
- Templates de communication

## 🔐 Système d'Authentification et Permissions

### Rôles d'utilisateurs
- **Admin**: Accès complet + paramètres système
- **Manager**: Gestion d'équipe + approbations
- **User**: Accès standard aux modules
- **Guest**: Accès en lecture seule

### Permissions granulaires
```typescript
interface Permission {
  role: UserRole;
  module: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'admin';
  conditions?: Record<string, any>;
}
```

## 🔌 Intégrations API

### Email (SendGrid)
```typescript
apiIntegrationService.sendEmail(
  ['recipient@example.com'],
  'Sujet',
  '<html>Contenu HTML</html>',
  [{ filename: 'document.pdf', content: '...' }]
);
```

### SMS (Twilio)
```typescript
apiIntegrationService.sendSMS(
  '+33612345678',
  'Message SMS'
);
```

### WhatsApp Business
```typescript
apiIntegrationService.sendWhatsappMessage(
  '+33612345678',
  'Message WhatsApp',
  'template_name',
  { variable1: 'value1' }
);
```

### Calendrier (Google Calendar)
```typescript
apiIntegrationService.createCalendarEvent(
  'Titre réunion',
  new Date('2026-01-25T10:00:00'),
  new Date('2026-01-25T11:00:00'),
  ['participant@example.com'],
  'Description réunion'
);
```

### Signature Électronique (DocuSign)
```typescript
apiIntegrationService.sendForSignature(
  'document_id',
  'recipient@example.com',
  'Nom Prénom',
  new Date('2026-02-01')
);
```

### OCR (Google Vision)
```typescript
apiIntegrationService.extractTextFromImage('image_url');
```

### Classification IA
```typescript
apiIntegrationService.classifyDocument('document_url');
```

### Comptabilité (QuickBooks)
```typescript
apiIntegrationService.syncWithAccounting(invoiceData);
```

## 📊 Services de Données

### Data Service
```typescript
// Gestion des données CRUD
dataService.getCompanies();
dataService.createCompany({ name: '...' });
dataService.updateCompany(id, { name: '...' });
dataService.deleteCompany(id);
```

### Report Service
```typescript
// Génération de rapports
reportService.generateSalesReport(startDate, endDate);
reportService.generateFinancialReport(startDate, endDate);
reportService.generateProjectReport(projectId);
reportService.generateMarketingReport();
reportService.generateHRReport();
```

### Validation Service
```typescript
// Validation des données
validationService.validateEmail('email@example.com');
validationService.validatePhone('+33612345678');
validationService.validateAmount(1000);
```

### Filter Service
```typescript
// Filtrage et tri
filterService.filterByStatus(items, 'active');
filterService.sortByField(items, 'name', 'asc');
filterService.groupByField(items, 'category');
filterService.paginateItems(items, page, pageSize);
```

## 🛠️ Utilitaires Helpers

### Utils généraux
```typescript
// Gestion des IDs
utils.generateId();
utils.generateUUID();

// Copie en presse-papiers
await utils.copyToClipboard('texte à copier');

// Clonage et fusion
utils.deepClone(objet);
utils.mergeObjects(objet1, objet2);

// Délai
await utils.delay(1000);

// Retry avec backoff
await utils.retry(() => apiCall(), maxAttempts, baseDelay);

// Calculs financiers
utils.calculateTax(100, 20);
utils.calculateTotal(100, 20, 10);
utils.calculateROI(1000, 1200);

// Débounce et throttle
const debounced = utils.debounce(function, 300);
const throttled = utils.throttle(function, 1000);
```

### String Utils
```typescript
stringUtils.capitalize('hello');
stringUtils.slugify('Hello World');
stringUtils.truncate('Texte long', 10);
```

### Date Utils
```typescript
dateUtils.addDays(new Date(), 7);
dateUtils.addMonths(new Date(), 1);
dateUtils.getDaysDifference(date1, date2);
dateUtils.isOverdue(dueDate);
dateUtils.formatDate(new Date());
```

## 📝 Types TypeScript

### Company
```typescript
interface Company {
  id: string;
  name: string;
  siret: string;
  siren: string;
  industry: string;
  address: Address;
  email: string;
  phone: string;
  status: Status;
  employees: number;
  annualRevenue: number;
  // ... autres propriétés
}
```

### Contact
```typescript
interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  companyId: string;
  leadScore: number;
  preferences: ContactPreferences;
  // ... autres propriétés
}
```

### Document (GED)
```typescript
interface Document {
  id: string;
  name: string;
  fileName: string;
  documentType: DocumentType;
  category: DocumentCategory;
  ocrText?: string;
  version: number;
  versions?: DocumentVersion[];
  accessControl: AccessRight[];
  approvalWorkflow?: ApprovalWorkflow;
  // ... autres propriétés
}
```

### Invoice
```typescript
interface Invoice {
  id: string;
  number: string;
  companyId: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  // ... autres propriétés
}
```

### Project
```typescript
interface Project {
  id: string;
  name: string;
  companyId: string;
  status: 'planning' | 'active' | 'completed';
  budget: number;
  spent: number;
  progress: number;
  tasks: Task[];
  team: ProjectTeamMember[];
  // ... autres propriétés
}
```

## ⚙️ Configuration

### System Config
```typescript
systemConfig = {
  companyName: 'CRM Pro Template',
  defaultCurrency: 'EUR',
  defaultLanguage: 'fr',
  taxRate: 20,
  businessHours: { /* ... */ },
  apiIntegrations: [ /* ... */ ]
}
```

### Module Config
Configuration des modules actifs, icônes et permissions requises.

### Workflow Config
Configuration des workflows d'approbation pour documents et factures.

### Reminder Config
Configuration des rappels et notifications par type.

## 🎨 Thème et Styles

### Couleurs
- Primary: #0066CC (Bleu)
- Secondary: #00A3FF
- Success: #22C55E (Vert)
- Warning: #F59E0B (Orange)
- Danger: #EF4444 (Rouge)

### Responsive Design
- Mobile breakpoint: 768px
- Tablet breakpoint: 1024px
- Desktop: > 1024px

## 📦 Export et Importation de Données

### CSV Export
```typescript
exportService.exportToCSV(data, 'filename');
```

### JSON Export
```typescript
exportService.exportToJSON(data, 'filename');
```

### PDF Export
```typescript
exportService.generatePDF(content, 'filename');
```

## 🔍 Recherche Globale

```typescript
// Recherche dans toutes les entités
const results = await searchService.globalSearch('query', filters);

// Recherche spécialisée
searchService.searchCompanies(companies, 'query');
searchService.searchContacts(contacts, 'query');
searchService.searchInvoices(invoices, 'query');
searchService.searchDocuments(documents, 'query');
```

## 📱 Responsive Design

L'application est optimisée pour tous les appareils:
- **Mobile**: Vue complète optimisée
- **Tablette**: Mise en page adaptative
- **Desktop**: Interface complète avec tous les détails

## 🚀 Démarrage Rapide

1. **Installation des dépendances**
   ```bash
   npm install
   ```

2. **Lancer l'environnement de développement**
   ```bash
   npm run dev
   ```

3. **Build pour production**
   ```bash
   npm run build
   ```

## 🔐 Sécurité

- Authentification sécurisée avec gestion de sessions
- Permissions granulaires par rôle et module
- Validation des données en front et back-end
- Sanitisation des entrées utilisateur
- Protection contre CSRF
- Chiffrement des données sensibles

## 📈 Performance

- Lazy loading des composants
- Optimisation des images
- Cache des données
- Compression des assets
- Code splitting automatique

## 📞 Support et Maintenance

Pour toute question ou amélioration, consultez la documentation technique ou contactez l'équipe de support.

## 📄 Licence

CRM Template - Tous droits réservés © 2026
