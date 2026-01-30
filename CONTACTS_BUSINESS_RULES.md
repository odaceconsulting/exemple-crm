# Règles Métier de la Page Contacts

Ce document liste toutes les règles métier, formules de calcul et explications identifiées dans la page Contacts du CRM.

---

## 1. Validation et Création de Contact

### 1.1 Validation des Champs Obligatoires

**Règle métier :** Vérifie que les champs obligatoires sont remplis avant de créer ou modifier un contact.

**Champs obligatoires :**
- `firstName` (Prénom) : doit être non vide
- `lastName` (Nom) : doit être non vide
- `email` (Email) : doit être non vide et valide
- `position` (Fonction) : doit être non vide
- `company` (Entreprise) : doit être non vide

**Formule de validation :**
```
Validation = TRUE si :
  firstName ≠ '' ET
  lastName ≠ '' ET
  email ≠ '' ET
  email est valide (format email) ET
  position ≠ '' ET
  company ≠ ''
```

**Explication :**
- Les champs personnels (prénom, nom) sont obligatoires pour identifier le contact
- L'email est obligatoire pour les communications
- La fonction et l'entreprise sont nécessaires pour le contexte professionnel
- Si la validation échoue, la création/modification est bloquée
- Les autres champs (téléphone, mobile, adresse, LinkedIn) sont optionnels

**Exemple :**
- Prénom : "Jean" ✓
- Nom : "Dupont" ✓
- Email : "jean.dupont@acme.com" ✓
- Fonction : "Directeur Commercial" ✓
- Entreprise : "Acme Corp" ✓
- Validation : ✅ Réussie

---

### 1.2 Génération d'ID pour Nouveau Contact

**Règle métier :** Génère un identifiant unique pour chaque nouveau contact créé.

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

**Règle métier :** Détecte les contacts en doublon basé sur la combinaison Prénom + Nom + Email (insensible à la casse).

**Formule de calcul :**
```
Pour chaque contact :
  key = `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${email.toLowerCase()}`
  
  Si key existe déjà dans seen :
    contact est un doublon
  Sinon :
    Ajouter key à seen
    contact n'est pas un doublon
```

**Explication :**
- La comparaison est effectuée en minuscules pour ignorer la casse
- Les doublons sont identifiés par la combinaison unique : Prénom + Nom + Email
- Plus strict que pour les compagnies (qui utilisent seulement le nom)
- Permet de détecter les mêmes personnes avec des variations d'écriture

**Exemple :**
- Contact 1 : "Jean", "Dupont", "jean.dupont@acme.com"
- Contact 2 : "JEAN", "DUPONT", "JEAN.DUPONT@ACME.COM"
- Résultat : Doublon détecté (même combinaison en minuscules)

---

### 2.2 Fusion des Doublons

**Règle métier :** Supprime les doublons et conserve une seule occurrence de chaque contact.

**Formule de calcul :**
```
Contacts uniques = FILTER(contacts où contact ∉ doublons)

Statistiques :
  Nombre de doublons = COUNT(doublons)
  Nombre de contacts conservés = COUNT(contacts uniques)
```

**Explication :**
- La première occurrence trouvée est conservée
- Les doublons suivants sont supprimés
- Les statistiques sont affichées après le dédoublonnage
- Action irréversible (sauf si annulée avant confirmation)

**Exemple :**
- Total contacts : 200
- Doublons détectés : 25
- Contacts conservés : 175

---

## 3. Import/Export CSV

### 3.1 Export vers CSV

**Règle métier :** Exporte tous les contacts au format CSV avec les colonnes définies.

**Format CSV :**
```
Colonnes : Prénom, Nom, Email, Téléphone, Mobile, Poste, Entreprise, Adresse, Statut

Format de chaque ligne :
  "Prénom","Nom","Email","Téléphone","Mobile","Poste","Entreprise","Adresse","Statut"
```

**Formule de génération :**
```
CSV = [Headers] + [Lignes]

Où :
  Headers = ['Prénom', 'Nom', 'Email', 'Téléphone', 'Mobile', 'Poste', 'Entreprise', 'Adresse', 'Statut']
  
  Pour chaque contact :
    Ligne = [
      contact.firstName,
      contact.lastName,
      contact.email,
      contact.phone,
      contact.mobile,
      contact.position,
      contact.company,
      contact.address,
      contact.status
    ]
    
    CSV ligne = Ligne.map(cell => `"${cell}"`).join(',')
```

**Explication :**
- Les valeurs sont encapsulées dans des guillemets pour gérer les virgules dans les données
- Le nom du fichier inclut la date : `contacts_YYYY-MM-DD.csv`
- Format compatible avec Excel et autres outils de tableur
- Tous les contacts sont exportés, pas de filtrage

---

### 3.2 Import depuis CSV

**Règle métier :** Importe des contacts depuis un fichier CSV avec validation et création automatique.

**Format attendu :**
```
Ligne 1 : Headers (ignorée)
Lignes suivantes : Données des contacts

Format : "Prénom","Nom","Email","Téléphone","Mobile","Poste","Entreprise","Adresse","Statut"
```

**Formule de traitement :**
```
Pour chaque ligne (sauf la première) :
  values = line.split(',').map(v => v.replace(/"/g, '').trim())
  
  Nouveau contact = {
    id: MAX(IDs existants) + index + 1,
    firstName: values[0],
    lastName: values[1],
    email: values[2],
    phone: values[3],
    mobile: values[4],
    position: values[5],
    company: values[6],
    address: values[7],
    status: values[8] || 'lead',
    lastContact: Date actuelle (ISO format),
    score: 50 (valeur par défaut)
  }
```

**Explication :**
- Les guillemets sont supprimés des valeurs
- Les espaces en début/fin sont supprimés (trim)
- Le statut par défaut est "lead" si non spécifié
- Le score par défaut est 50 (milieu de l'échelle)
- La date de dernier contact est définie à la date actuelle

**Exemple :**
- CSV ligne : `"Jean","Dupont","jean.dupont@acme.com","+33 1 23 45 67 89","+33 6 12 34 56 78","Directeur Commercial","Acme Corp","Paris","client"`
- Résultat : Contact créé avec tous les champs remplis

---

## 4. Recherche et Filtrage

### 4.1 Recherche Multi-Critères

**Règle métier :** Recherche des contacts par prénom, nom, entreprise ou poste (insensible à la casse).

**Formule de calcul :**
```
Résultats = FILTER(contacts où 
  `${firstName} ${lastName}`.toLowerCase().includes(query.toLowerCase()) OU
  company.toLowerCase().includes(query.toLowerCase()) OU
  position.toLowerCase().includes(query.toLowerCase())
)
```

**Explication :**
- La recherche est insensible à la casse
- Recherche partielle (contient la chaîne)
- Recherche simultanée dans plusieurs champs :
  - Nom complet (prénom + nom)
  - Entreprise
  - Poste/fonction
- Mise à jour en temps réel lors de la saisie

**Exemple :**
- Query : "directeur"
- Résultats : Tous les contacts avec "Directeur" dans leur fonction ou nom

---

### 4.2 Filtrage par Statut

**Règle métier :** Filtre les contacts selon leur statut (lead, client, partner).

**Formule de calcul :**
```
Contacts filtrés = FILTER(contacts où status = statut_sélectionné)
```

**Explication :**
- Les statuts possibles : 'lead', 'client', 'partner'
- Utilisé dans la vue Kanban pour organiser les contacts
- Permet de visualiser rapidement la répartition des contacts
- Chaque colonne affiche le nombre de contacts

---

## 5. Communication

### 5.1 Gestion des Templates

**Règle métier :** Gère des modèles de communication (email et SMS) réutilisables.

**Structure d'un template :**
```
Template = {
  id: number,
  name: string,
  category: 'email' | 'sms',
  content: string
}
```

**Explication :**
- Les templates permettent de standardiser les communications
- Catégories : Email ou SMS
- Le contenu peut contenir des variables (ex: [nom], [entreprise])
- Templates prédéfinis : "Bienvenue", "Suivi", "Promotion SMS"

---

### 5.2 Campagne Email

**Règle métier :** Crée et planifie une campagne d'emails vers plusieurs contacts.

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
  Destinataires = TOUS les contacts
  
Si recipients = 'selected' :
  Destinataires = FILTER(contacts où id ∈ selectedEmailContacts)
```

**Explication :**
- Permet d'envoyer à tous les contacts ou à une sélection
- Planification possible avec date et heure
- Utilise un template pour le contenu
- Sujet personnalisable
- Aperçu de la campagne avant envoi

---

### 5.3 Envoi de SMS

**Règle métier :** Envoie des SMS vers plusieurs contacts avec limitation de caractères.

**Limitation de caractères :**
```
Longueur max par SMS : 160 caractères

Nombre de SMS nécessaires = CEIL(message.length / 160)
```

**Formule de sélection des destinataires :**
```
Si recipients = 'all' :
  Destinataires = TOUS les contacts avec mobile valide
  
Si recipients = 'selected' :
  Destinataires = FILTER(contacts où 
    id ∈ selectedSmsContacts ET
    (mobile ≠ '' OU phone ≠ '')
  )
```

**Explication :**
- Limite de 160 caractères par SMS (standard GSM)
- Si le message dépasse 160 caractères, plusieurs SMS sont nécessaires
- Seuls les contacts avec un numéro de téléphone valide sont inclus
- Priorité au mobile, sinon téléphone fixe
- Planification possible avec date et heure

**Exemple :**
- Message : 245 caractères
- Nombre de SMS : CEIL(245 / 160) = 2 SMS

---

## 6. Statistiques et KPIs

### 6.1 Total Contacts

**Règle métier :** Compte le nombre total de contacts dans la base.

**Formule de calcul :**
```
Total Contacts = COUNT(tous les contacts)
```

**Explication :**
- Indicateur global du portefeuille de contacts
- Mis à jour en temps réel
- Utilisé pour les rapports et analyses

---

### 6.2 Contacts Clients

**Règle métier :** Compte le nombre de contacts avec le statut "client".

**Formule de calcul :**
```
Clients = COUNT(contacts où status = 'client')
```

**Explication :**
- Représente les contacts clients actifs
- Indicateur de santé du portefeuille
- Utilisé pour mesurer la rétention client

---

### 6.3 Leads

**Règle métier :** Compte le nombre de contacts avec le statut "lead".

**Formule de calcul :**
```
Leads = COUNT(contacts où status = 'lead')
```

**Explication :**
- Représente les prospects en cours de qualification
- Indicateur du pipeline commercial
- Utilisé pour mesurer la croissance potentielle

---

### 6.4 Partenaires

**Règle métier :** Compte le nombre de contacts avec le statut "partner".

**Formule de calcul :**
```
Partenaires = COUNT(contacts où status = 'partner')
```

**Explication :**
- Représente les contacts partenaires
- Indicateur des relations stratégiques
- Utilisé pour mesurer le réseau de partenaires

---

## 7. Scoring

### 7.1 Score de Contact (Lead Score)

**Règle métier :** Le score mesure la qualité et le potentiel d'un contact (0-100).

**Formule d'affichage :**
```
Score affiché = contact.score (0-100)

Barre de progression (%) = score
```

**Explication :**
- Le score est un indicateur de qualité (0-100)
- Peut être calculé automatiquement ou défini manuellement
- Utilisé pour prioriser les actions commerciales
- Affiché visuellement avec une barre de progression

**Interprétation :**
- 0-59 : Faible potentiel (rouge)
- 60-79 : Potentiel moyen (orange)
- 80-100 : Excellent potentiel (vert)

---

### 7.2 Couleur du Score

**Règle métier :** Détermine la couleur d'affichage du score selon sa valeur.

**Formule de calcul :**
```
Couleur = 
  SI score >= 80 : Vert (text-green-600, bg-green-500)
  SI score >= 60 : Orange (text-orange-600, bg-orange-500)
  SINON : Rouge (text-red-600, bg-red-500)
```

**Explication :**
- Permet une identification visuelle rapide de la qualité du contact
- Vert : Contact de haute qualité, priorité élevée
- Orange : Contact de qualité moyenne, suivi normal
- Rouge : Contact de faible qualité, nécessite qualification

---

## 8. Gestion des Statuts

### 8.1 Statuts Disponibles

**Règle métier :** Les contacts peuvent avoir trois statuts différents.

**Statuts :**
- `lead` : Prospect en cours de qualification
- `client` : Contact client actif
- `partner` : Contact partenaire

**Couleurs associées :**
- `client` : Vert (bg-green-100 text-green-700)
- `lead` : Bleu (bg-blue-100 text-blue-700)
- `partner` : Orange (bg-orange-100 text-orange-700)

**Explication :**
- Le statut détermine la position du contact dans le cycle commercial
- Utilisé pour le filtrage et la segmentation
- Peut être modifié manuellement ou automatiquement selon des règles
- Affiché avec des emojis pour identification visuelle rapide

---

## 9. Génération d'Initiales

### 9.1 Calcul des Initiales pour Avatar

**Règle métier :** Génère les initiales d'un contact pour l'affichage dans l'avatar.

**Formule de calcul :**
```
Initiales = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
```

**Explication :**
- Prend la première lettre du prénom et du nom
- Convertit en majuscules
- Utilisé pour l'avatar si aucune photo n'est disponible
- Format : "JD" pour "Jean Dupont"

**Exemple :**
- Prénom : "Jean"
- Nom : "Dupont"
- Initiales : "JD"

---

## 10. Lien WhatsApp

### 10.1 Génération du Lien WhatsApp

**Règle métier :** Génère un lien WhatsApp pour contacter directement un contact.

**Formule de calcul :**
```
Numéro nettoyé = mobile.replace(/\s+/g, '')
Lien WhatsApp = `https://wa.me/${Numéro nettoyé}`
```

**Explication :**
- Supprime tous les espaces du numéro de téléphone
- Format du lien : `https://wa.me/33612345678`
- Le numéro doit être au format international (avec indicatif pays)
- Ouvre WhatsApp Web ou l'application avec le contact pré-rempli

**Exemple :**
- Mobile : "+33 6 12 34 56 78"
- Numéro nettoyé : "+33612345678"
- Lien : "https://wa.me/+33612345678"

---

## 11. Vues d'Affichage

### 11.1 Vue Grille

**Règle métier :** Affiche les contacts sous forme de cartes en grille.

**Disposition :**
```
Colonnes : 1 (mobile), 2 (tablette), 3 (desktop)
```

**Informations affichées :**
- Avatar (photo ou initiales)
- Nom complet (prénom + nom)
- Poste/fonction
- Entreprise
- Email
- Mobile
- Lien WhatsApp
- Statut
- Score (avec barre de progression)

---

### 11.2 Vue Liste

**Règle métier :** Affiche les contacts sous forme de tableau.

**Colonnes du tableau :**
- Contact (avec avatar et date dernier contact)
- Poste
- Entreprise
- Email
- Téléphone
- WhatsApp (lien)
- Statut
- Score (avec barre de progression)
- Actions

**Tri :**
- Par défaut : ordre d'ajout
- Tri possible par colonne (non implémenté dans le code actuel)

---

### 11.3 Vue Kanban

**Règle métier :** Affiche les contacts organisés par statut en colonnes.

**Colonnes :**
- Leads (status = 'lead')
- Clients (status = 'client')
- Partenaires (status = 'partner')

**Compteur par colonne :**
```
Nombre par statut = COUNT(contacts filtrés où status = statut_colonne)
```

**Explication :**
- Permet de visualiser rapidement la répartition des contacts
- Chaque colonne affiche le nombre de contacts
- Organisation visuelle du pipeline
- Filtrage automatique par statut

---

## 12. Gestion de la Photo

### 12.1 Upload de Photo

**Règle métier :** Permet de télécharger une photo de profil pour un contact.

**Validation :**
```
Validation = TRUE si :
  file.type commence par 'image/' ET
  file.size <= 5MB
```

**Format accepté :**
```
Types : PNG, JPG, GIF
Taille max : 5MB
```

**Explication :**
- La photo est convertie en base64 pour stockage
- Aperçu immédiat après sélection
- Si aucune photo, les initiales sont affichées
- Format recommandé : carré (1:1) pour meilleur rendu

---

### 12.2 Affichage de la Photo

**Règle métier :** Affiche la photo du contact ou les initiales si absente.

**Formule d'affichage :**
```
SI contact.photo existe :
  Afficher photo
SINON :
  Afficher avatar avec initiales
```

**Explication :**
- Priorité à la photo si disponible
- Sinon, affichage d'un avatar avec les initiales
- Couleur de fond : bleu (bg-blue-100)
- Couleur du texte : bleu foncé (text-blue-600)

---

## 13. Suppression de Contact

### 13.1 Confirmation de Suppression

**Règle métier :** Demande une confirmation avant de supprimer un contact.

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

### 13.2 Suppression Effective

**Règle métier :** Supprime définitivement un contact de la base.

**Formule de calcul :**
```
Contacts restants = FILTER(contacts où id ≠ deleteTarget)
```

**Explication :**
- Le contact est retiré de la liste
- Toutes les données associées sont supprimées
- Action irréversible
- Les statistiques sont mises à jour automatiquement

---

## 14. Formatage des Dates

### 14.1 Affichage de la Date de Dernier Contact

**Règle métier :** Formate la date de dernier contact au format français.

**Formule de formatage :**
```
Date formatée = new Date(contact.lastContact).toLocaleDateString('fr-FR')
```

**Format de sortie :**
```
Format : DD/MM/YYYY
Exemple : 20/01/2026
```

**Explication :**
- Format français standard (jour/mois/année)
- Utilisé pour l'affichage dans les listes
- Format d'entrée : ISO (YYYY-MM-DD)

---

## 15. Historique des Interactions

### 15.1 Types d'Interactions

**Règle métier :** Enregistre l'historique des interactions avec un contact.

**Types d'interactions :**
- `Email` : Envoi d'email
- `SMS` : Envoi de SMS
- `Appel` : Appel téléphonique
- Autres types possibles

**Structure :**
```
Interaction = {
  id: number,
  type: 'Email' | 'SMS' | 'Appel',
  subject: string,
  date: string (YYYY-MM-DD HH:mm),
  status: 'Envoyé' | 'Ouvert' | 'Cliqué'
}
```

**Explication :**
- Permet de suivre toutes les communications avec un contact
- Statuts possibles selon le type d'interaction
- Utilisé pour mesurer l'engagement
- Affiché dans l'onglet "Interactions"

---

## 16. Qualification du Contact

### 16.1 Onglets de Qualification

**Règle métier :** Organise les informations de qualification en onglets.

**Onglets disponibles :**
1. **Général** : Informations de base, coordonnées, score
2. **Rattachement** : Liaison compagnie, historique, multi-entreprises
3. **Interactions** : Emails, appels, réunions, notes
4. **Qualification** : Lead scoring, statut, source, intérêts

**Explication :**
- Permet d'organiser les informations par catégorie
- Facilite la navigation dans les détails du contact
- Chaque onglet contient des informations spécifiques

---

## Notes Importantes

1. **Validation des emails :** 
   - Format basique vérifié (présence de @)
   - Validation complète peut être ajoutée avec regex

2. **Gestion des valeurs nulles :** 
   - Les valeurs nulles ou non définies sont traitées comme valeurs par défaut
   - Le score par défaut est 50
   - Le statut par défaut est "lead"

3. **Format des dates :** 
   - Format ISO : YYYY-MM-DD
   - Format d'affichage : DD/MM/YYYY (format français)

4. **Format des numéros de téléphone :** 
   - Format international recommandé : +33 X XX XX XX XX
   - Les espaces sont supprimés pour les liens WhatsApp

5. **Performance :** 
   - Les recherches sont effectuées en temps réel
   - Les filtres sont appliqués côté client
   - Pour de grandes bases, une pagination peut être nécessaire

6. **Sécurité :** 
   - Validation des entrées utilisateur
   - Protection contre les injections (CSV)
   - Sanitization des données avant affichage

7. **Limites de fichiers :** 
   - Photo : 5MB maximum
   - Formats acceptés : PNG, JPG, GIF

---

## Références

- Fichier source principal : `src/app/components/Contacts.tsx`
- Types de données : `src/app/types/index.ts`
- Services de données : `src/app/services/dataService.ts`

---

*Document généré le : 2026-01-23*
*Version : 1.0*

