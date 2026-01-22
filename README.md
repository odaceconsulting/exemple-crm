
# CRM Template Pro - Template CRM Professionnel Complet

Un template CRM moderne et fonctionnel inspiré par HubSpot et Odoo, avec un système complet de Gestion Électronique de Documents (GED) intégré.

## 🎯 Vue d'ensemble

Ce template CRM offre une solution complète pour gérer tous les aspects d'une relation client :

- ✅ **Tableau de Bord** - KPIs en temps réel et analytics
- ✅ **Gestion Commerciale** - Companies, Contacts, Pipeline, Leads, Devis
- ✅ **GED Avancée** - Document management avec OCR, versioning, approbations
- ✅ **Facturation** - Invoicing, avoirs, paiements
- ✅ **Projets** - Planning, timesheets, Gantt
- ✅ **RH** - Collaborateurs, planning, documents
- ✅ **Marketing** - Campagnes multi-canaux, WhatsApp, newsletter
- ✅ **Paramètres** - Configuration système, intégrations, utilisateurs

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 16+ 
- npm ou yarn

### Installation

```bash
# Cloner le projet
git clone <votre-repo>
cd "CRM Template"

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build pour Production

```bash
npm run build
```

## 📁 Structure du Projet

```
src/
├── app/
│   ├── components/          # Composants React
│   │   ├── Dashboard.tsx
│   │   ├── Companies.tsx
│   │   ├── Contacts.tsx
│   │   ├── Pipeline.tsx
│   │   ├── Documents.tsx     # GED avancée
│   │   ├── Invoicing.tsx
│   │   ├── Projects.tsx
│   │   ├── HR.tsx
│   │   ├── Marketing.tsx
│   │   ├── Settings.tsx
│   │   └── ui/               # UI Components (Radix UI)
│   ├── services/             # Services métier
│   │   ├── authService.ts
│   │   ├── apiService.ts
│   │   ├── dataService.ts
│   │   └── index.ts
│   ├── types/                # Types TypeScript
│   │   └── index.ts
│   ├── utils/                # Utilitaires
│   │   └── helpers.ts
│   ├── config/               # Configuration
│   │   └── index.ts
│   └── App.tsx               # Composant racine
├── main.tsx                  # Point d'entrée
└── vite.config.ts
```

## 🔑 Fonctionnalités Principales

### 1. Dashboard Personnalisable
- Widgets KPI en temps réel
- Graphiques de performance
- Calendrier intégré
- Notifications et alertes
- Recherche globale

### 2. Gestion Commerciale Complète
- **Companies**: Fiches entreprises avec historique
- **Contacts**: Interlocuteurs avec scoring
- **Pipeline**: Kanban commercial
- **Leads**: Capture et qualification
- **Devis**: Générateur avec signature électronique

### 3. GED Avancée
- Upload drag-and-drop
- Classement automatique
- OCR intégré
- Versioning des documents
- Droits d'accès granulaires
- Workflows d'approbation
- Classification IA

### 4. Gestion Financière
- Facturation complète
- Suivi paiements
- Avoirs et notes de crédit
- Dashboard financier
- Prévisions de trésorerie

### 5. Gestion de Projets
- Planning et ressources
- Timesheets
- Gantt et calendrier
- Budget tracking
- Suivi des livrables

### 6. RH & Administration
- Fiches collaborateurs
- Planning d'équipe
- Documents RH
- Gestion des congés

### 7. Marketing & Communication
- Campagnes multi-canaux
- Email, SMS, WhatsApp
- Suivi ROI
- Newsletter
- Intégration réseaux sociaux

## 🔐 Système d'Authentification & Permissions

### Rôles Disponibles
- **Admin** - Accès complet + paramètres
- **Manager** - Gestion d'équipe + approbations
- **User** - Accès standard
- **Guest** - Lecture seule

### Permissions Granulaires
```typescript
interface Permission {
  role: UserRole;
  module: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'admin';
}
```

## 🔌 Intégrations API

### Intégrations Incluses
- **Email** - SendGrid
- **SMS** - Twilio
- **WhatsApp** - WhatsApp Business API
- **Calendrier** - Google Calendar
- **Paiements** - Stripe
- **Signature** - DocuSign
- **OCR** - Google Vision
- **Comptabilité** - QuickBooks

### Utilisation

```typescript
// Email
await apiIntegrationService.sendEmail(
  ['recipient@example.com'],
  'Subject',
  '<html>Content</html>'
);

// SMS
await apiIntegrationService.sendSMS(
  '+33612345678',
  'Message'
);

// WhatsApp
await apiIntegrationService.sendWhatsappMessage(
  '+33612345678',
  'Message',
  'template_name'
);
```

## 📊 Services & Utilitaires

### Data Service
```typescript
dataService.getCompanies();
dataService.createCompany({ name: '...' });
dataService.updateCompany(id, { name: '...' });
```

### Report Service
```typescript
reportService.generateSalesReport(startDate, endDate);
reportService.generateFinancialReport(startDate, endDate);
reportService.generateProjectReport(projectId);
```

### Export Service
```typescript
exportService.exportToCSV(data, 'filename');
exportService.exportToJSON(data, 'filename');
exportService.generatePDF(content, 'filename');
```

### Search Service
```typescript
const results = await searchService.globalSearch('query');
searchService.searchCompanies(companies, 'query');
searchService.searchInvoices(invoices, 'query');
```

### Helpers Utilities
```typescript
utils.generateId();
utils.calculateTax(100, 20);
utils.formatCurrency(1000, 'EUR');
stringUtils.capitalize('hello');
dateUtils.addDays(new Date(), 7);
```

## 🎨 Thème & Personnalisation

### Couleurs Primaires
- Primary: #0066CC
- Secondary: #00A3FF
- Success: #22C55E
- Warning: #F59E0B
- Danger: #EF4444

### Responsive Design
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 📝 Types TypeScript

Tous les types sont définis dans `src/app/types/index.ts` :

- `Company` - Entreprise
- `Contact` - Contact
- `Document` - Document GED
- `Invoice` - Facture
- `Quote` - Devis
- `Project` - Projet
- `Employee` - Collaborateur
- `Campaign` - Campagne marketing
- `User` - Utilisateur
- Et 30+ autres types...

## ⚙️ Configuration

### System Config
```typescript
systemConfig = {
  companyName: 'CRM Pro Template',
  defaultCurrency: 'EUR',
  defaultLanguage: 'fr',
  taxRate: 20,
  apiIntegrations: [...]
}
```

### Module Config
Configuration des modules actifs, icônes, permissions.

### Workflow Config
Configuration des workflows d'approbation.

### Reminder Config
Configuration des rappels et notifications.

## 🔍 Recherche Globale

L'application inclut une recherche globale qui permet de chercher dans :
- Companies
- Contacts
- Invoices
- Documents (avec OCR)
- Projects
- Et plus...

## 📱 Responsive Design

L'application est 100% responsive :
- ✅ Mobile optimisé
- ✅ Tablet adaptatif
- ✅ Desktop complet

## 🚀 Performance

- Lazy loading des composants
- Code splitting automatique
- Cache optimisé
- Compression des assets
- Animations fluides

## 📚 Documentation

Pour une documentation complète, consultez [DOCUMENTATION.md](DOCUMENTATION.md)

## 🔒 Sécurité

- Authentification sécurisée
- Permissions granulaires
- Validation des données
- Sanitisation des entrées
- Protection CSRF
- Chiffrement des données sensibles

## 📦 Dépendances Principales

- **React 18** - UI Library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - UI Components
- **Lucide React** - Icons
- **Recharts** - Charts & Graphs
- **Vite** - Build tool

## 🛠️ Scripts Disponibles

```bash
npm run dev      # Lancer le serveur de dev
npm run build    # Build pour production
npm run preview  # Prévisualiser le build
npm i            # Installer les dépendances
```

## 📄 Licence

CRM Template Pro - Tous droits réservés © 2026

## 📞 Support

Pour toute question ou besoin de support :
- Consultez la [DOCUMENTATION.md](DOCUMENTATION.md)
- Vérifiez les types dans `src/app/types/index.ts`
- Explorez les services dans `src/app/services/`

---

**Dernière mise à jour:** 22 Janvier 2026
**Version:** 1.0.0

Avec ce template, vous avez une base complète et extensible pour construire un système CRM professionnel ! 🚀
