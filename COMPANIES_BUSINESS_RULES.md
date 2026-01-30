# Règles Métier de la Page Compagnies

Ce document liste toutes les règles métier, formules de calcul et explications identifiées dans la page Compagnies du CRM.

---

## 1. Validation et Création de Compagnie

### 1.1 Validation des Champs Obligatoires

**Règle métier :** Vérifie que les champs obligatoires sont remplis avant de créer ou modifier une compagnie.

**Champs obligatoires :**
- `name` (Nom de l'entreprise) : doit être non vide
- `email` (Email) : doit être non vide et valide

**Formule de validation :**
```
Validation = TRUE si :
  name ≠ '' ET
  email ≠ '' ET
  email est valide (format email)
```

**Explication :**
- Le nom de l'entreprise est obligatoire pour identifier la compagnie
- L'email est obligatoire pour les communications
- Si la validation échoue, la création/modification est bloquée
- Les autres champs sont optionnels mais recommandés

**Exemple :**
- Nom : "Acme Corporation" ✓
- Email : "contact@acme.com" ✓
- Validation : ✅ Réussie

---

### 1.2 Génération d'ID pour Nouvelle Compagnie

**Règle métier :** Génère un identifiant unique pour chaque nouvelle compagnie créée.

**Formule de calcul :**
```
Nouvel ID = MAX(IDs existants) + 1

OU lors de l'import CSV :
Nouvel ID = MAX(IDs existants) + index + 1
```

**Explication :**
- L'ID est un nombre entier unique
- Lors de la création manuelle : ID = max ID + 1
- Lors de l'import CSV : ID = max ID + index de la ligne + 1
- Garantit l'unicité des identifiants

**Exemple :**
- IDs existants : [1, 2, 3, 5]
- Nouvel ID : MAX(1, 2, 3, 5) + 1 = 5 + 1 = 6

---

## 2. Dédoublonnage

### 2.1 Détection des Doublons

**Règle métier :** Détecte les compagnies en doublon basé sur le nom (insensible à la casse).

**Formule de calcul :**
```
Pour chaque compagnie :
  key = name.toLowerCase()
  
  Si key existe déjà dans seen :
    compagnie est un doublon
  Sinon :
    Ajouter key à seen
    compagnie n'est pas un doublon
```

**Explication :**
- La comparaison est effectuée en minuscules pour ignorer la casse
- Les doublons sont identifiés par le nom exact (après normalisation)
- Permet de nettoyer la base de données des entrées dupliquées

**Exemple :**
- Compagnie 1 : "Acme Corporation"
- Compagnie 2 : "ACME CORPORATION"
- Résultat : Doublon détecté (même nom en minuscules)

---

### 2.2 Fusion des Doublons

**Règle métier :** Supprime les doublons et conserve une seule occurrence de chaque compagnie.

**Formule de calcul :**
```
Compagnies uniques = FILTER(compagnies où compagnie ∉ doublons)

Statistiques :
  Nombre de doublons = COUNT(doublons)
  Nombre de compagnies conservées = COUNT(compagnies uniques)
```

**Explication :**
- La première occurrence trouvée est conservée
- Les doublons suivants sont supprimés
- Les statistiques sont affichées après le dédoublonnage
- Action irréversible (sauf si annulée avant confirmation)

**Exemple :**
- Total compagnies : 100
- Doublons détectés : 15
- Compagnies conservées : 85

---

## 3. Import/Export CSV

### 3.1 Export vers CSV

**Règle métier :** Exporte toutes les compagnies au format CSV avec les colonnes définies.

**Format CSV :**
```
Colonnes : Nom, Secteur, Chiffre d'affaires, Salariés, Email, Téléphone, Site web, Adresse, Statut

Format de chaque ligne :
  "Nom","Secteur","CA","Salariés","Email","Téléphone","Site web","Adresse","Statut"
```

**Formule de génération :**
```
CSV = [Headers] + [Lignes]

Où :
  Headers = ['Nom', 'Secteur', 'Chiffre d\'affaires', 'Salariés', 'Email', 'Téléphone', 'Site web', 'Adresse', 'Statut']
  
  Pour chaque compagnie :
    Ligne = [
      company.name,
      company.industry,
      company.revenue,
      company.employees,
      company.email,
      company.phone,
      company.website,
      company.address,
      company.status
    ]
    
    CSV ligne = Ligne.map(cell => `"${cell}"`).join(',')
```

**Explication :**
- Les valeurs sont encapsulées dans des guillemets pour gérer les virgules dans les données
- Le nom du fichier inclut la date : `companies_YYYY-MM-DD.csv`
- Format compatible avec Excel et autres outils de tableur

---

### 3.2 Import depuis CSV

**Règle métier :** Importe des compagnies depuis un fichier CSV avec validation et création automatique.

**Format attendu :**
```
Ligne 1 : Headers (ignorée)
Lignes suivantes : Données des compagnies

Format : "Nom","Secteur","CA","Salariés","Email","Téléphone","Site web","Adresse","Statut"
```

**Formule de traitement :**
```
Pour chaque ligne (sauf la première) :
  values = line.split(',').map(v => v.replace(/"/g, '').trim())
  
  Nouvelle compagnie = {
    id: MAX(IDs existants) + index + 1,
    name: values[0],
    industry: values[1],
    revenue: values[2],
    employees: values[3],
    email: values[4],
    phone: values[5],
    website: values[6],
    address: values[7],
    status: values[8] || 'prospect',
    contactPerson: '',
    lastContact: Date actuelle (ISO format),
    opportunities: 0,
    quotes: 0,
    invoices: 0,
    projects: 0,
    watchlist: false
  }
```

**Explication :**
- Les guillemets sont supprimés des valeurs
- Les espaces en début/fin sont supprimés (trim)
- Le statut par défaut est "prospect" si non spécifié
- Les champs numériques (opportunités, devis, etc.) sont initialisés à 0
- La date de dernier contact est définie à la date actuelle

**Exemple :**
- CSV ligne : `"Acme Corp","Technologie","€5M","120","contact@acme.com","+33 1 23 45 67 89","www.acme.com","Paris","active"`
- Résultat : Compagnie créée avec tous les champs remplis

---

## 4. Recherche et Filtrage

### 4.1 Recherche par Nom ou Secteur

**Règle métier :** Recherche des compagnies par nom ou secteur d'activité (insensible à la casse).

**Formule de calcul :**
```
Résultats = FILTER(compagnies où 
  name.toLowerCase().includes(query.toLowerCase()) OU
  industry.toLowerCase().includes(query.toLowerCase())
)
```

**Explication :**
- La recherche est insensible à la casse
- Recherche partielle (contient la chaîne)
- Recherche simultanée dans le nom et le secteur
- Mise à jour en temps réel lors de la saisie

**Exemple :**
- Query : "tech"
- Résultats : "TechStart SAS", "Digital Solutions" (secteur Technologie)

---

### 4.2 Filtrage par Statut

**Règle métier :** Filtre les compagnies selon leur statut (active, prospect, inactive).

**Formule de calcul :**
```
Compagnies filtrées = FILTER(compagnies où status = statut_sélectionné)
```

**Explication :**
- Les statuts possibles : 'active', 'prospect', 'inactive'
- Utilisé dans la vue Kanban pour organiser les compagnies
- Permet de visualiser rapidement l'état de chaque compagnie

---

## 5. Segmentation

### 5.1 Filtrage par Tags

**Règle métier :** Filtre les compagnies selon les tags sélectionnés.

**Formule de calcul :**
```
Compagnies filtrées = FILTER(compagnies où 
  company.tags contient AU MOINS UN tag de selectedTags
)
```

**Explication :**
- Les tags permettent de catégoriser les compagnies
- Plusieurs tags peuvent être sélectionnés simultanément
- Une compagnie correspond si elle a au moins un des tags sélectionnés
- Tags disponibles : Premium, VIP, Startup, Enterprise, PME, Secteur Public

---

### 5.2 Création de Tag

**Règle métier :** Permet de créer un nouveau tag personnalisé.

**Validation :**
```
Validation = TRUE si :
  newTag.trim() ≠ '' ET
  newTag n'existe pas déjà dans allTags
```

**Formule d'ajout :**
```
allTags = [...allTags, newTag]
```

**Explication :**
- Le tag ne peut pas être vide (après trim)
- Le tag doit être unique
- Une fois créé, le tag est disponible pour toutes les compagnies

---

### 5.3 Listes Dynamiques

**Règle métier :** Crée des listes dynamiques de compagnies basées sur des critères.

**Formule de calcul :**
```
Compagnies dans liste = FILTER(compagnies où 
  critères de la liste sont satisfaits
)

Exemples de listes :
  - "Clients Actifs" : status = 'active'
  - "Prospects Chauds" : status = 'prospect' ET scoringValue >= 70
  - "À Relancer" : lastContact < Date actuelle - 30 jours
```

**Explication :**
- Les listes sont dynamiques (recalculées automatiquement)
- Basées sur des critères définis
- Permettent de segmenter rapidement le portefeuille
- Listes prédéfinies : Clients Actifs, Prospects Chauds, À Relancer, En Négociation, Partenaires Clés

---

### 5.4 Critères Personnalisés

**Règle métier :** Permet de définir des critères de filtrage personnalisés en langage naturel ou logique.

**Format des critères :**
```
Exemples :
  - "Secteur = Technologie ET Scoring >= 80 ET CA >= 5M"
  - "Status = active OU Status = prospect"
  - "Employees > 100 ET Revenue > 10M"
```

**Explication :**
- Permet une segmentation très flexible
- Supporte les opérateurs logiques : ET, OU, NON
- Supporte les comparaisons : =, >, <, >=, <=
- Les critères sont évalués dynamiquement

---

## 6. Communication

### 6.1 Gestion des Templates

**Règle métier :** Gère des modèles de communication (email et SMS) réutilisables.

**Structure d'un template :**
```
Template = {
  id: string,
  name: string,
  category: 'email' | 'sms',
  content: string
}
```

**Explication :**
- Les templates permettent de standardiser les communications
- Catégories : Email ou SMS
- Le contenu peut contenir des variables (ex: [nom], [entreprise])
- Templates prédéfinis : "Bienvenue Client", "Suivi emails", "Promotion SMS"

---

### 6.2 Campagne Email

**Règle métier :** Crée et planifie une campagne d'emails vers plusieurs compagnies.

**Paramètres de campagne :**
```
Campagne = {
  campaignName: string,
  template: string (ID du template),
  subject: string,
  recipients: 'all' | 'selected',
  scheduledDate: string (YYYY-MM-DD),
  scheduledTime: string (HH:mm)
}
```

**Formule de sélection des destinataires :**
```
Si recipients = 'all' :
  Destinataires = TOUTES les compagnies
  
Si recipients = 'selected' :
  Destinataires = FILTER(compagnies où id ∈ selectedEmailCompanies)
```

**Explication :**
- Permet d'envoyer à toutes les compagnies ou à une sélection
- Planification possible avec date et heure
- Utilise un template pour le contenu
- Sujet personnalisable

---

### 6.3 Envoi de SMS

**Règle métier :** Envoie des SMS vers plusieurs compagnies avec limitation de caractères.

**Limitation de caractères :**
```
Longueur max par SMS : 160 caractères

Nombre de SMS nécessaires = CEIL(message.length / 160)
```

**Formule de sélection des destinataires :**
```
Si recipients = 'all' :
  Destinataires = TOUTES les compagnies avec téléphone valide
  
Si recipients = 'selected' :
  Destinataires = FILTER(compagnies où 
    id ∈ selectedSmsCompanies ET
    phone ≠ ''
  )
```

**Explication :**
- Limite de 160 caractères par SMS (standard GSM)
- Si le message dépasse 160 caractères, plusieurs SMS sont nécessaires
- Seules les compagnies avec un numéro de téléphone valide sont incluses
- Planification possible avec date et heure

**Exemple :**
- Message : 245 caractères
- Nombre de SMS : CEIL(245 / 160) = 2 SMS

---

## 7. Statistiques et KPIs

### 7.1 Total Compagnies

**Règle métier :** Compte le nombre total de compagnies dans la base.

**Formule de calcul :**
```
Total Compagnies = COUNT(toutes les compagnies)
```

**Explication :**
- Indicateur global du portefeuille
- Mis à jour en temps réel
- Utilisé pour les rapports et analyses

---

### 7.2 Compagnies Actives

**Règle métier :** Compte le nombre de compagnies avec le statut "active".

**Formule de calcul :**
```
Compagnies Actives = COUNT(compagnies où status = 'active')
```

**Explication :**
- Représente les clients actifs
- Indicateur de santé du portefeuille
- Utilisé pour mesurer la rétention client

---

### 7.3 Prospects

**Règle métier :** Compte le nombre de compagnies avec le statut "prospect".

**Formule de calcul :**
```
Prospects = COUNT(compagnies où status = 'prospect')
```

**Explication :**
- Représente les prospects en cours de qualification
- Indicateur du pipeline commercial
- Utilisé pour mesurer la croissance potentielle

---

### 7.4 Compagnies Inactives

**Règle métier :** Compte le nombre de compagnies avec le statut "inactive".

**Formule de calcul :**
```
Compagnies Inactives = COUNT(compagnies où status = 'inactive')
```

**Explication :**
- Représente les compagnies sans activité récente
- Indicateur de risque de perte de clients
- Utilisé pour identifier les compagnies à relancer

---

## 8. Scoring

### 8.1 Score de Compagnie

**Règle métier :** Le score mesure la qualité et le potentiel d'une compagnie (0-100).

**Formule d'affichage :**
```
Score affiché = scoringValue (0-100)

Barre de progression (%) = scoringValue
```

**Explication :**
- Le score est un indicateur de qualité (0-100)
- Peut être calculé automatiquement ou défini manuellement
- Utilisé pour prioriser les actions commerciales
- Affiché visuellement avec une barre de progression

**Interprétation :**
- 0-30 : Faible potentiel
- 31-60 : Potentiel moyen
- 61-80 : Bon potentiel
- 81-100 : Excellent potentiel

---

## 9. Gestion des Statuts

### 9.1 Statuts Disponibles

**Règle métier :** Les compagnies peuvent avoir trois statuts différents.

**Statuts :**
- `active` : Compagnie cliente active
- `prospect` : Prospect en cours de qualification
- `inactive` : Compagnie inactive ou sans relation récente

**Couleurs associées :**
- `active` : Vert (bg-emerald-100 text-emerald-700)
- `prospect` : Jaune/Ambre (bg-amber-100 text-amber-700)
- `inactive` : Gris/Rouge (bg-gray-100 text-gray-700)

**Explication :**
- Le statut détermine la position de la compagnie dans le cycle commercial
- Utilisé pour le filtrage et la segmentation
- Peut être modifié manuellement ou automatiquement selon des règles

---

## 10. Historique et Métriques

### 10.1 Nombre d'Opportunités

**Règle métier :** Compte le nombre d'opportunités associées à une compagnie.

**Formule de calcul :**
```
Opportunités = company.opportunities (nombre stocké)
```

**Explication :**
- Représente le nombre d'opportunités commerciales en cours ou passées
- Utilisé pour mesurer l'activité commerciale
- Affiché dans l'onglet Historique

---

### 10.2 Nombre de Devis et Factures

**Règle métier :** Calcule le total des devis et factures associés à une compagnie.

**Formule de calcul :**
```
Total Devis & Factures = (company.quotes || 0) + (company.invoices || 0)
```

**Explication :**
- Somme des devis et factures
- Indicateur de l'activité commerciale réelle
- Utilisé pour mesurer la conversion

---

### 10.3 Chiffre d'Affaires Généré

**Règle métier :** Affiche le chiffre d'affaires associé à une compagnie.

**Formule de calcul :**
```
CA Généré = company.revenue (valeur stockée)
```

**Explication :**
- Représente le CA annuel ou total de la compagnie
- Format : "€X.XM" ou "€X,XXX"
- Utilisé pour mesurer la valeur du client

---

### 10.4 Nombre de Projets

**Règle métier :** Compte le nombre de projets associés à une compagnie.

**Formule de calcul :**
```
Projets = company.projects || 0
```

**Explication :**
- Représente le nombre de projets en cours ou terminés
- Indicateur de l'engagement client
- Utilisé pour mesurer la relation à long terme

---

## 11. Relations

### 11.1 Filiales

**Règle métier :** Gère la liste des filiales d'une compagnie.

**Format de stockage :**
```
subsidiaries: string[] (tableau de noms de filiales)
```

**Format d'entrée :**
```
Entrée utilisateur : "Filiale 1, Filiale 2, Filiale 3"
Traitement : split(',').map(s => s.trim()).filter(s => s)
Résultat : ['Filiale 1', 'Filiale 2', 'Filiale 3']
```

**Explication :**
- Les filiales sont séparées par des virgules
- Les espaces sont supprimés automatiquement
- Les entrées vides sont filtrées
- Permet de visualiser la structure organisationnelle

---

### 11.2 Partenaires

**Règle métier :** Gère la liste des partenaires d'une compagnie.

**Format de stockage :**
```
partners: string[] (tableau de noms de partenaires)
```

**Format d'entrée :**
```
Entrée utilisateur : "Partenaire 1, Partenaire 2"
Traitement : split(',').map(p => p.trim()).filter(p => p)
Résultat : ['Partenaire 1', 'Partenaire 2']
```

**Explication :**
- Même format que les filiales
- Permet de documenter les relations commerciales
- Utilisé pour l'analyse de réseau

---

### 11.3 Organigramme

**Règle métier :** Stocke l'URL de l'organigramme de la compagnie.

**Format :**
```
orgChart: string (URL de l'image ou document)
```

**Validation :**
```
Validation = TRUE si :
  orgChart est une URL valide OU
  orgChart = '' (optionnel)
```

**Explication :**
- Permet de référencer un organigramme externe
- Format : URL complète (https://...)
- Affiché comme lien cliquable dans l'interface

---

## 12. Enrichissement

### 12.1 SIREN/SIRET

**Règle métier :** Stocke le numéro SIREN/SIRET de la compagnie pour l'enrichissement de données.

**Format :**
```
sirenSiret: string (format : "123 456 789 00012")
```

**Explication :**
- Le SIREN/SIRET permet d'identifier légalement une entreprise en France
- Utilisé pour l'enrichissement automatique de données depuis des bases externes
- Format avec espaces pour la lisibilité
- Validation optionnelle (format 14 chiffres pour SIRET)

---

### 12.2 Watchlist (Veille)

**Règle métier :** Permet de marquer une compagnie comme étant sous surveillance.

**Format :**
```
watchlist: boolean (true = sous veille, false = normal)
```

**Explication :**
- Les compagnies en watchlist nécessitent une attention particulière
- Utilisé pour prioriser les actions
- Peut déclencher des alertes automatiques
- Indicateur visuel dans l'interface

---

## 13. Vues d'Affichage

### 13.1 Vue Grille

**Règle métier :** Affiche les compagnies sous forme de cartes en grille.

**Disposition :**
```
Colonnes : 1 (mobile), 2 (tablette), 3 (desktop)
```

**Informations affichées :**
- Logo ou icône par défaut
- Nom de la compagnie
- Secteur d'activité
- Chiffre d'affaires
- Nombre d'employés
- Email
- Téléphone
- Statut
- Date de dernier contact

---

### 13.2 Vue Liste

**Règle métier :** Affiche les compagnies sous forme de tableau.

**Colonnes du tableau :**
- Compagnie (avec logo)
- Secteur
- Chiffre d'affaires
- Employés
- Contact
- Email
- Statut
- Actions

**Tri :**
- Par défaut : ordre d'ajout
- Tri possible par colonne (non implémenté dans le code actuel)

---

### 13.3 Vue Kanban

**Règle métier :** Affiche les compagnies organisées par statut en colonnes.

**Colonnes :**
- Actifs (status = 'active')
- Prospects (status = 'prospect')
- Inactifs (status = 'inactive')

**Compteur par colonne :**
```
Nombre par statut = COUNT(compagnies où status = statut_colonne)
```

**Explication :**
- Permet de visualiser rapidement la répartition des compagnies
- Chaque colonne affiche le nombre de compagnies
- Organisation visuelle du pipeline

---

## 14. Suppression de Compagnie

### 14.1 Confirmation de Suppression

**Règle métier :** Demande une confirmation avant de supprimer une compagnie.

**Processus :**
```
1. Clic sur "Supprimer"
2. Affichage d'une boîte de dialogue de confirmation
3. Si confirmé : suppression définitive
4. Si annulé : retour à l'état précédent
```

**Explication :**
- Action irréversible
- Protection contre les suppressions accidentelles
- Message d'avertissement clair
- Possibilité d'annuler avant confirmation

---

### 14.2 Suppression Effective

**Règle métier :** Supprime définitivement une compagnie de la base.

**Formule de calcul :**
```
Compagnies restantes = FILTER(compagnies où id ≠ deleteTarget)
```

**Explication :**
- La compagnie est retirée de la liste
- Toutes les données associées sont supprimées
- Action irréversible
- Les statistiques sont mises à jour automatiquement

---

## Notes Importantes

1. **Validation des emails :** 
   - Format basique vérifié (présence de @)
   - Validation complète peut être ajoutée avec regex

2. **Gestion des valeurs nulles :** 
   - Les valeurs nulles ou non définies sont traitées comme valeurs par défaut
   - Les champs numériques utilisent 0 comme valeur par défaut
   - Les tableaux utilisent [] comme valeur par défaut

3. **Format des dates :** 
   - Format ISO : YYYY-MM-DD
   - Format d'affichage : DD/MM/YYYY (format français)

4. **Format des montants :** 
   - Format d'affichage : "€X.XM" ou "€X,XXX"
   - Stockage : string (pour flexibilité)

5. **Performance :** 
   - Les recherches sont effectuées en temps réel
   - Les filtres sont appliqués côté client
   - Pour de grandes bases, une pagination peut être nécessaire

6. **Sécurité :** 
   - Validation des entrées utilisateur
   - Protection contre les injections (CSV)
   - Sanitization des données avant affichage

---

## Références

- Fichier source principal : `src/app/components/Companies.tsx`
- Types de données : `src/app/types/index.ts`
- Services de données : `src/app/services/dataService.ts`

---

*Document généré le : 2026-01-23*
*Version : 1.0*

