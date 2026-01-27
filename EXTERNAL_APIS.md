# APIs Externes Requises - Projet CRM Template

## Vue d'ensemble
Ce document liste toutes les APIs externes que le projet intégrera, organisées par module fonctionnel et par priorité.

---

## 📄 Module GED (Gestion Électronique de Documents)

### OCR et Reconnaissance de Document
Ces APIs seront utilisées pour extraire du texte et des données des documents scannés.

| API | Fournisseur | Use Case | Plan | Lien |
|-----|-----------|----------|------|------|
| **Google Cloud Vision API** | Google Cloud | OCR, reconnaissance de texte, détection de formulaires | Pay-as-you-go | https://cloud.google.com/vision |
| **AWS Textract** | Amazon Web Services | OCR, extraction de formulaires et tables | Pay-as-you-go | https://aws.amazon.com/textract/ |
| **Microsoft Azure Computer Vision** | Microsoft Azure | OCR multilingue, reconnaissance de documents | Pay-as-you-go | https://azure.microsoft.com/fr-fr/services/cognitive-services/computer-vision/ |
| **Tesseract.js** | Open Source (JavaScript) | OCR côté client (léger) | Gratuit | https://tesseract.projectnaptha.com/ |
| **Adobe Document Services - PDF Extract API** | Adobe | Extraction de données PDF avancée | Freemium | https://developer.adobe.com/document-services/ |

### Signature Numérique et Archivage
Nécessaires pour la validation légale des documents.

| API | Fournisseur | Use Case | Plan | Lien |
|-----|-----------|----------|------|------|
| **Yousign** | Yousign (FR) | Signature électronique, archivage légal France | Abonnement | https://www.yousign.fr/ |
| **DocuSign** | DocuSign | Signature numérique internationale | Freemium | https://www.docusign.com/ |
| **SignNow** | SignNow | Signature électronique simple | Freemium | https://www.signnow.com/ |

### Stockage Cloud
Pour archivage et sauvegarde sécurisée des documents.

| API | Fournisseur | Use Case | Plan | Lien |
|-----|-----------|----------|------|------|
| **AWS S3** | Amazon Web Services | Stockage de documents, archivage | Pay-as-you-go | https://aws.amazon.com/s3/ |
| **Google Cloud Storage** | Google Cloud | Stockage de documents, intégration avec Vision API | Pay-as-you-go | https://cloud.google.com/storage |
| **Azure Blob Storage** | Microsoft Azure | Stockage de documents, intégration avec Computer Vision | Pay-as-you-go | https://azure.microsoft.com/fr-fr/services/storage/blobs/ |
| **Scaleway Object Storage** | Scaleway (FR) | Alternative européenne à S3 | Pay-as-you-go | https://www.scaleway.com/fr/object-storage/ |

### Automatisation et Orchestration
n8n sera le centre d'orchestration pour les workflows OCR.

| API | Fournisseur | Use Case | Plan | Lien |
|-----|-----------|----------|------|------|
| **n8n** | n8n (Open Source) | Orchestration des workflows OCR, automatisation GED | Gratuit (self-hosted) / Cloud | https://n8n.io/ |

---

## 📧 Module Communications et Notifications

### Email et Notifications
Pour l'envoi de documents, confirmations et alertes.

| API | Fournisseur | Use Case | Plan | Lien |
|-----|-----------|----------|------|------|
| **SendGrid** | Twilio SendGrid | Envoi d'emails transactionnels | Pay-as-you-go | https://sendgrid.com/ |
| **Mailgun** | Mailgun | API d'email robuste | Pay-as-you-go | https://www.mailgun.com/ |
| **Resend** | Resend | Email moderne pour applications | Freemium | https://resend.com/ |

### SMS et Notifications Push
Pour alertes urgentes et confirmations à deux facteurs.

| API | Fournisseur | Use Case | Plan | Lien |
|-----|-----------|----------|------|------|
| **Twilio SMS** | Twilio | Envoi de SMS | Pay-as-you-go | https://www.twilio.com/sms |
| **OVHcloud SMS** | OVHcloud (FR) | Alternative française pour SMS | Pay-as-you-go | https://www.ovhcloud.com/fr/sms/ |

---

## 💰 Module Invoicing (Facturation et Paiements)

### Traitement des Paiements
Pour l'intégration de paiements en ligne.

| API | Fournisseur | Use Case | Plan | Lien |
|-----|-----------|----------|------|------|
| **Stripe** | Stripe | Paiements par carte, webhooks | Pay-as-you-go | https://stripe.com/ |
| **PayPal** | PayPal | Paiements PayPal, virements | Pay-as-you-go | https://www.paypal.com/en/webapps/mpp/paypal-rest-api |
| **Square** | Square | Paiements, facturation | Pay-as-you-go | https://squareup.com/fr/fr |

### Facturation et Comptabilité
Pour génération et gestion de factures.

| API | Fournisseur | Use Case | Plan | Lien |
|-----|-----------|----------|------|------|
| **Facturio.fr** | Facturio (FR) | Génération de factures français | Freemium | https://www.facturio.fr/ |
| **Weezevent** | Weezevent (FR) | Gestion de factures, invoicing | Abonnement | https://www.weezevent.com/ |

---

## 👥 Module HR (Ressources Humaines)

### Calendrier et Planification
Pour synchronisation avec calendriers externes.

| API | Fournisseur | Use Case | Plan | Lien |
|-----|-----------|----------|------|------|
| **Google Calendar API** | Google | Synchronisation calendrier, congés | Gratuit | https://developers.google.com/calendar |
| **Microsoft Graph API** | Microsoft | Calendrier Outlook, Teams | Gratuit | https://docs.microsoft.com/en-us/graph/api/ |
| **Calendly** | Calendly | Planification de réunions | Freemium | https://calendly.com/ |

### Vidéoconférence et Réunions
Pour intégration de réunions virtuelles.

| API | Fournisseur | Use Case | Plan | Lien |
|-----|-----------|----------|------|------|
| **Zoom API** | Zoom | Création de réunions, webinars | Freemium | https://marketplace.zoom.us/ |
| **Google Meet API** | Google | Réunions vidéo | Gratuit | https://developers.google.com/meet |
| **Microsoft Teams API** | Microsoft | Réunions Teams, intégration | Gratuit | https://docs.microsoft.com/en-us/microsoftteams/platform/tabs/how-to/tabs-in-sharepoint |

---

## 📊 Module Analytics et Reporting

### Analyse et Reporting
Pour tableaux de bord et analyses.

| API | Fournisseur | Use Case | Plan | Lien |
|-----|-----------|----------|------|------|
| **Google Analytics 4** | Google | Tracking utilisation application | Gratuit | https://marketingplatform.google.com/about/analytics/ |
| **Mixpanel** | Mixpanel | Analytics avancés, funnels | Freemium | https://mixpanel.com/ |
| **Amplitude** | Amplitude | Product analytics, cohort analysis | Freemium | https://amplitude.com/ |

---

## 🔐 Module Authentification et Sécurité

### Authentication et SSO
Pour connexion sécurisée et intégration Active Directory.

| API | Fournisseur | Use Case | Plan | Lien |
|-----|-----------|----------|------|------|
| **Auth0** | Auth0 | SSO, OAuth2, authentification | Freemium | https://auth0.com/ |
| **Okta** | Okta | Enterprise SSO, MFA | Freemium | https://www.okta.com/ |
| **Microsoft Entra ID (Azure AD)** | Microsoft | SSO entreprise, intégration Office | Gratuit/Payant | https://www.microsoft.com/en-us/security/business/identity-access/microsoft-entra-id |

### Authentification Multi-Facteur (MFA)
Pour sécurité renforcée.

| API | Fournisseur | Use Case | Plan | Lien |
|-----|-----------|----------|------|------|
| **Authy** | Twilio Authy | MFA, TOTP, SMS 2FA | Gratuit | https://authy.com/ |
| **Google Authenticator API** | Google | TOTP authentication | Gratuit | https://www.google.com/search?q=google+authenticator+api |

---

## 🗺️ Localisation et Données

### Maps et Géolocalisation
Pour adresses, itinéraires et localisation.

| API | Fournisseur | Use Case | Plan | Lien |
|-----|-----------|----------|------|------|
| **Google Maps API** | Google | Cartes, géocodage, adresses | Pay-as-you-go | https://developers.google.com/maps |
| **OpenStreetMap / Nominatim** | Open Source | Alternative gratuite pour géocodage | Gratuit | https://nominatim.openstreetmap.org/ |

---

## 🔗 Intégrations Supplémentaires

### Webhooks et Intégrations
Pour connecter avec d'autres services.

| API | Fournisseur | Use Case | Plan | Lien |
|-----|-----------|----------|------|------|
| **Zapier** | Zapier | Automatisation, webhooks | Freemium | https://zapier.com/ |
| **Make (Integromat)** | Make | Automatisation, flux de travail | Freemium | https://www.make.com/ |
| **Pipedream** | Pipedream | Intégrations API, webhooks | Freemium | https://pipedream.com/ |

---

## 📋 Tableau Récapitulatif - Priorités et Coûts

### ⭐ PRIORITÉ 1 - ESSENTIEL (MVP)

| API | Catégorie | Coût Estimé/Mois |
|-----|-----------|------------------|
| **n8n (self-hosted)** | Automatisation GED | 0€ (self-hosted) |
| **Google Cloud Vision API** | OCR | 1-50€ |
| **AWS S3 ou Scaleway S3** | Stockage | 5-20€ |
| **SendGrid** | Email | 10€+ |
| **Auth0** | SSO/Auth | 0€ (freemium) |

**Coût mensuel estimé MVP:** 15-80€

---

### ⭐⭐ PRIORITÉ 2 - IMPORTANT

| API | Catégorie | Coût Estimé/Mois |
|-----|-----------|------------------|
| **Stripe** | Paiements | 0€ (frais par transaction) |
| **Google Calendar API** | RH/Calendrier | 0€ |
| **Microsoft Graph API** | Intégrations | 0€ |
| **Yousign** | Signature | 50-200€ |
| **n8n Cloud** | Automatisation | 0-100€ |

**Coût mensuel estimé:** 50-300€

---

### ⭐⭐⭐ PRIORITÉ 3 - OPTIONNEL

| API | Catégorie | Coût Estimé/Mois |
|-----|-----------|------------------|
| **AWS Textract / Azure Computer Vision** | OCR avancé | 20-100€ |
| **Zoom API** | Vidéoconférence | 15-100€ |
| **Mixpanel / Amplitude** | Analytics | 0-200€ |
| **DocuSign** | Signature alternative | 100-500€ |

**Coût mensuel estimé:** 135-900€

---

## 🚀 Recommandations de Déploiement

### Infrastructure minimale recommandée

```
Environnement de DEV/TEST:
├── n8n (self-hosted Docker)
├── Google Cloud Vision API (freemium tier)
├── Scaleway Object Storage (gratuit jusqu'à 75GB)
├── SendGrid (freemium: 100 emails/jour)
└── Auth0 (freemium: jusqu'à 7000 utilisateurs)

Environnement de PRODUCTION:
├── n8n Cloud ou self-hosted (HA)
├── Google Cloud Vision + AWS Textract (fallback)
├── AWS S3 ou Scaleway S3 (selon région)
├── SendGrid (plan payant pour volume)
├── Auth0 ou Okta (selon besoins SSO)
├── Stripe (paiements)
└── Yousign (signature légale France)
```

---

## 📝 Prochaines Étapes

1. **Phase 1 (Semaines 1-2):** Configurer n8n, créer comptes Google Cloud et Scaleway
2. **Phase 2 (Semaines 3-4):** Implémenter Auth0, SendGrid, Google Vision API
3. **Phase 3 (Semaines 5-6):** Ajouter Stripe, Google Calendar API
4. **Phase 4 (Semaines 7+):** Intégrer Yousign, AWS Textract, autres services

---

## 📚 Documentation des Intégrations

Voir les dossiers respectifs pour la documentation détaillée:
- `/docs/apis/ged-ocr.md` - Configuration OCR et n8n
- `/docs/apis/authentication.md` - Authentification et SSO
- `/docs/apis/payments.md` - Intégration paiements
- `/docs/apis/communication.md` - Email et notifications

---

**Dernière mise à jour:** 27 janvier 2026  
**Responsable:** Équipe DevOps/Architecture
