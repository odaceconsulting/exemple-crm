# Règles Métier de la Page Devis

Ce document liste toutes les règles métier, formules de calcul et explications identifiées dans la page Devis du CRM.

---

## 1. Calculs Financiers des Articles

### 1.1 Calcul du Total d'un Article (avec Remise)

**Règle métier :** Calcule le montant total d'un article en appliquant la remise sur le prix unitaire multiplié par la quantité.

**Formule de calcul :**
```
Total_article = Quantité × Prix_unitaire × (1 - Remise% / 100)
```

**Détails du calcul :**
```javascript
total = item.quantity * item.unitPrice * (1 - (item.discount || 0) / 100)
```

**Explication :**
- La remise est exprimée en pourcentage (0-100%)
- La remise est appliquée avant le calcul du total
- Si aucune remise n'est spécifiée, elle est considérée comme 0%
- Le résultat est arrondi selon la précision du système

**Exemple :**
- Quantité : 5
- Prix unitaire : €2,000
- Remise : 10%
- Total : 5 × 2,000 × (1 - 10/100) = 5 × 2,000 × 0.9 = €9,000

---

### 1.2 Calcul du Montant Brut HT

**Règle métier :** Calcule le montant brut hors taxes avant application des remises.

**Formule de calcul :**
```
Montant_brut_HT = Σ(Quantité × Prix_unitaire) pour chaque article
```

**Détails du calcul :**
```javascript
montantBrutHT = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
```

**Explication :**
- Somme de tous les articles sans tenir compte des remises
- Utilisé pour afficher le montant avant négociation
- Permet de visualiser l'impact des remises

**Exemple :**
- Article 1 : 5 × €2,000 = €10,000
- Article 2 : 5 × €500 = €2,500
- Montant brut HT : €12,500

---

### 1.3 Calcul de la Remise Totale

**Règle métier :** Calcule le montant total des remises appliquées sur tous les articles.

**Formule de calcul :**
```
Remise_totale = Σ(Quantité × Prix_unitaire × Remise% / 100) pour chaque article
```

**Détails du calcul :**
```javascript
remiseTotale = items.reduce((sum, item) => 
  sum + (item.quantity * item.unitPrice * ((item.discount || 0) / 100)), 0
)
```

**Explication :**
- Calculée uniquement si au moins un article a une remise > 0%
- Affichée en rouge pour indiquer une réduction
- Permet de voir l'économie totale réalisée par le client

**Exemple :**
- Article 1 : 5 × €2,000 × 10% = €1,000
- Article 2 : 5 × €500 × 0% = €0
- Remise totale : €1,000

---

### 1.4 Calcul du Montant Net HT

**Règle métier :** Calcule le montant hors taxes après application des remises.

**Formule de calcul :**
```
Montant_net_HT = Σ(Quantité × Prix_unitaire × (1 - Remise% / 100)) pour chaque article
```

**Détails du calcul :**
```javascript
montantNetHT = items.reduce((sum, item) => 
  sum + (item.quantity * item.unitPrice * (1 - (item.discount || 0) / 100)), 0
)
```

**Explication :**
- Montant sur lequel la TVA sera calculée
- Correspond à la somme des totaux de chaque article
- Utilisé comme base pour les calculs fiscaux

**Exemple :**
- Article 1 : 5 × €2,000 × 0.9 = €9,000
- Article 2 : 5 × €500 × 1.0 = €2,500
- Montant net HT : €11,500

---

### 1.5 Calcul de la TVA

**Règle métier :** Calcule le montant de la Taxe sur la Valeur Ajoutée à partir du montant net HT.

**Formule de calcul :**
```
TVA = Montant_net_HT × (Taux_TVA / 100)
```

**Détails du calcul :**
```javascript
tva = montantNetHT * (taxRate / 100)
```

**Explication :**
- Le taux de TVA est configurable par devis (par défaut 20%)
- La TVA est calculée sur le montant net HT (après remises)
- Le taux peut varier selon le type de produit/service ou la législation

**Exemple :**
- Montant net HT : €11,500
- Taux TVA : 20%
- TVA : 11,500 × (20 / 100) = €2,300

---

### 1.6 Calcul du Montant TTC

**Règle métier :** Calcule le montant total toutes taxes comprises.

**Formule de calcul :**
```
Montant_TTC = Montant_net_HT × (1 + Taux_TVA / 100)
```

**Détails du calcul :**
```javascript
montantTTC = montantNetHT * (1 + taxRate / 100)
```

**Explication :**
- Montant final que le client devra payer
- Inclut la TVA calculée sur le montant net HT
- Utilisé pour l'affichage client et les documents officiels

**Exemple :**
- Montant net HT : €11,500
- Taux TVA : 20%
- Montant TTC : 11,500 × (1 + 20/100) = 11,500 × 1.2 = €13,800

---

## 2. Génération et Gestion des Devis

### 2.1 Génération du Numéro de Devis

**Règle métier :** Génère automatiquement un numéro unique pour chaque nouveau devis.

**Formule de calcul :**
```
Numéro_devis = "DEVIS-" + Année + "-" + Numéro_séquentiel_formaté
```

**Détails du calcul :**
```javascript
quoteNumber = `DEVIS-2026-${String(quotes.length + 1).padStart(3, '0')}`
```

**Explication :**
- Format : DEVIS-YYYY-NNN (ex: DEVIS-2026-001)
- Le numéro séquentiel est complété avec des zéros à gauche (3 chiffres)
- L'année est fixée à 2026 dans le code (devrait être dynamique)
- Le numéro est incrémenté automatiquement

**Exemple :**
- Premier devis : DEVIS-2026-001
- Deuxième devis : DEVIS-2026-002
- 100ème devis : DEVIS-2026-100

---

### 2.2 Calcul de la Date d'Expiration

**Règle métier :** Calcule automatiquement la date d'expiration du devis à partir de la date de création et d'un nombre de jours de validité.

**Formule de calcul :**
```
Date_expiration = Date_création + Nombre_jours_validité
```

**Détails du calcul :**
```javascript
const expiryDate = new Date();
expiryDate.setDate(expiryDate.getDate() + parseInt(expiryDays));
```

**Explication :**
- Par défaut, la validité est de 30 jours
- La date d'expiration peut être modifiée manuellement
- Utilisée pour déterminer si un devis est expiré
- Un devis expiré ne peut plus être accepté

**Exemple :**
- Date de création : 20/01/2026
- Validité : 30 jours
- Date d'expiration : 19/02/2026

---

### 2.3 Filtrage par Statut

**Règle métier :** Filtre les devis selon leur statut.

**Formule de calcul :**
```
Devis_filtrés = {
  Si filtre = 'all' : Tous les devis
  Sinon : Devis où status = filtre
}
```

**Détails du calcul :**
```javascript
const filteredQuotes = filterStatus === 'all'
  ? quotes
  : quotes.filter(q => q.status === filterStatus);
```

**Explication :**
- Les statuts possibles sont : 'draft', 'sent', 'accepted', 'rejected', 'expired'
- Le filtre 'all' affiche tous les devis sans distinction
- Permet de visualiser rapidement les devis par état

**Exemple :**
- Filtre 'draft' : Affiche uniquement les brouillons
- Filtre 'accepted' : Affiche uniquement les devis acceptés
- Filtre 'all' : Affiche tous les devis

---

## 3. Indicateurs de Performance (KPI)

### 3.1 Nombre de Devis par Statut

**Règle métier :** Compte le nombre de devis pour chaque statut.

**Formule de calcul :**
```
Nombre_devis_statut = Nombre de devis où status = statut_cible
```

**Détails du calcul :**
```javascript
const draftQuotes = quotes.filter(q => q.status === 'draft').length;
const sentQuotes = quotes.filter(q => q.status === 'sent').length;
const acceptedQuotes = quotes.filter(q => q.status === 'accepted').length;
```

**Explication :**
- Utilisé pour les cartes KPI en haut de la page
- Permet un suivi rapide de l'état du pipeline de devis
- Mis à jour en temps réel lors des modifications

**Exemple :**
- Brouillons : 3 devis
- Envoyés : 5 devis
- Acceptés : 12 devis

---

### 3.2 Valeur Totale des Devis

**Règle métier :** Calcule la valeur totale TTC de tous les devis non rejetés et non expirés.

**Formule de calcul :**
```
Valeur_totale = Σ(Montant_HT × (1 + Taux_TVA / 100)) pour chaque devis
Où status ≠ 'rejected' ET status ≠ 'expired'
```

**Détails du calcul :**
```javascript
const totalValue = quotes
  .filter(q => q.status !== 'rejected' && q.status !== 'expired')
  .reduce((sum, q) => sum + (q.totalAmount * (1 + q.taxRate / 100)), 0);
```

**Explication :**
- Exclut les devis rejetés et expirés du calcul
- Calcule la valeur TTC de chaque devis
- Utilisé pour mesurer le pipeline commercial
- Affiché en milliers (k) pour la lisibilité

**Exemple :**
- Devis 1 : €12,500 HT × 1.2 = €15,000 TTC
- Devis 2 : €17,000 HT × 1.2 = €20,400 TTC
- Valeur totale : €35,400

---

### 3.3 Nombre Total de Devis

**Règle métier :** Compte le nombre total de devis, tous statuts confondus.

**Formule de calcul :**
```
Total_devis = Nombre total de devis dans la liste
```

**Détails du calcul :**
```javascript
const totalQuotes = quotes.length;
```

**Explication :**
- Compte tous les devis sans distinction de statut
- Utilisé comme indicateur global de volume
- Permet de suivre l'activité commerciale

**Exemple :**
- Total devis : 25

---

## 4. Analytics et Statistiques

### 4.1 Taux de Conversion Global

**Règle métier :** Calcule le pourcentage de devis acceptés parmi les devis envoyés.

**Formule de calcul :**
```
Taux_conversion = (Nombre_devis_acceptés / Nombre_devis_envoyés_ou_acceptés) × 100
```

**Détails du calcul :**
```javascript
const conversionRate = (quotes.filter(q => q.status === 'accepted').length / 
  quotes.filter(q => q.status === 'sent' || q.status === 'accepted').length) * 100;
```

**Explication :**
- Mesure l'efficacité du processus commercial
- Un taux élevé indique une bonne qualité des devis
- Utilisé pour identifier les opportunités d'amélioration
- Arrondi à 1 décimale

**Exemple :**
- Devis envoyés ou acceptés : 20
- Devis acceptés : 12
- Taux de conversion : (12 / 20) × 100 = 60%

---

### 4.2 Taux de Signature

**Règle métier :** Calcule le pourcentage de signatures électroniques complétées.

**Formule de calcul :**
```
Taux_signature = (Nombre_signatures_complétées / Nombre_signatures_demandées) × 100
```

**Détails du calcul :**
```javascript
const totalSignatures = quotes.reduce((sum, q) => 
  sum + (q.tracking?.eSignatures?.length || 0), 0);
const signedSignatures = quotes.reduce((sum, q) => 
  sum + (q.tracking?.eSignatures?.filter(s => s.status === 'signed').length || 0), 0);
const signatureRate = totalSignatures > 0 
  ? (signedSignatures / totalSignatures) * 100 
  : 0;
```

**Explication :**
- Mesure l'efficacité du processus de signature électronique
- Un taux élevé indique une bonne acceptation client
- Utilisé pour optimiser le processus de signature
- Retourne 0% si aucune signature n'a été demandée

**Exemple :**
- Signatures demandées : 15
- Signatures complétées : 10
- Taux de signature : (10 / 15) × 100 = 66.7%

---

### 4.3 Montant Moyen des Devis

**Règle métier :** Calcule le montant moyen HT de tous les devis.

**Formule de calcul :**
```
Montant_moyen = (Σ Montant_HT de tous les devis) / Nombre_total_devis
```

**Détails du calcul :**
```javascript
const averageAmount = quotes.reduce((sum, q) => sum + q.totalAmount, 0) / quotes.length;
```

**Explication :**
- Indicateur de la taille moyenne des transactions
- Utilisé pour analyser le mix commercial
- Permet d'identifier les tendances de prix
- Formaté avec séparateurs de milliers

**Exemple :**
- Total montants : €250,000
- Nombre de devis : 25
- Montant moyen : €10,000

---

### 4.4 Valeur Totale (Analytics)

**Règle métier :** Calcule la somme de tous les montants HT des devis.

**Formule de calcul :**
```
Valeur_totale = Σ Montant_HT de tous les devis
```

**Détails du calcul :**
```javascript
const totalValue = quotes.reduce((sum, q) => sum + q.totalAmount, 0);
```

**Explication :**
- Différent de la valeur totale KPI (qui exclut rejetés/expirés)
- Inclut tous les devis sans exception
- Utilisé pour les analyses globales
- Formaté avec séparateurs de milliers

**Exemple :**
- Devis 1 : €12,500
- Devis 2 : €17,000
- Devis 3 : €9,000
- Valeur totale : €38,500

---

### 4.5 Montant Minimum et Maximum

**Règle métier :** Identifie le montant HT le plus petit et le plus grand parmi tous les devis.

**Formule de calcul :**
```
Montant_min = MIN(Montant_HT de tous les devis)
Montant_max = MAX(Montant_HT de tous les devis)
```

**Détails du calcul :**
```javascript
const minAmount = Math.min(...quotes.map(q => q.totalAmount));
const maxAmount = Math.max(...quotes.map(q => q.totalAmount));
```

**Explication :**
- Indique la plage de valeurs des devis
- Permet d'identifier les écarts de montants
- Utilisé pour analyser la diversité du portefeuille
- Formaté avec séparateurs de milliers

**Exemple :**
- Montant minimum : €3,000
- Montant maximum : €25,000

---

### 4.6 Valeur par Statut

**Règle métier :** Calcule la valeur totale HT des devis pour chaque statut.

**Formule de calcul :**
```
Valeur_statut = Σ Montant_HT des devis où status = statut_cible
```

**Détails du calcul :**
```javascript
const total = quotes.filter(q => q.status === item.status)
  .reduce((sum, q) => sum + q.totalAmount, 0);
```

**Explication :**
- Permet d'analyser la valeur par état du pipeline
- Identifie où se trouve la valeur dans le processus
- Utilisé pour prioriser les actions commerciales
- Formaté avec séparateurs de milliers

**Exemple :**
- Valeur des devis acceptés : €150,000
- Valeur des devis envoyés : €80,000
- Valeur des brouillons : €30,000

---

### 4.7 Moyenne par Statut

**Règle métier :** Calcule le montant moyen HT des devis pour chaque statut.

**Formule de calcul :**
```
Moyenne_statut = Valeur_statut / Nombre_devis_statut
```

**Détails du calcul :**
```javascript
const total = quotes.filter(q => q.status === item.status)
  .reduce((sum, q) => sum + q.totalAmount, 0);
const count = quotes.filter(q => q.status === item.status).length;
const average = count > 0 ? total / count : 0;
```

**Explication :**
- Indique la taille moyenne des devis par statut
- Permet de comparer les montants moyens entre statuts
- Utilisé pour identifier les tendances
- Formaté avec séparateurs de milliers
- Retourne 0 si aucun devis n'existe pour le statut

**Exemple :**
- Valeur des devis acceptés : €150,000
- Nombre de devis acceptés : 12
- Moyenne : €150,000 / 12 = €12,500

---

## 5. Règles de Validation et Contraintes

### 5.1 Validation de la Création de Devis

**Règle métier :** Un devis ne peut être créé que si les champs obligatoires sont remplis et qu'au moins un article est présent.

**Conditions de validation :**
```
- Entreprise : Obligatoire (non vide)
- Contact : Obligatoire (non vide)
- Articles : Au moins un article avec description non vide
```

**Détails de la validation :**
```javascript
if (newQuoteForm.company && newQuoteForm.contact && 
    newQuoteForm.items.some(i => i.description)) {
  // Création du devis
} else {
  alert('Veuillez remplir les champs requis et ajouter au moins un article');
}
```

**Explication :**
- Empêche la création de devis incomplets
- Assure la cohérence des données
- Améliore la qualité des devis générés

---

### 5.2 Contraintes sur les Remises

**Règle métier :** Les remises sont limitées entre 0% et 100%.

**Contraintes :**
```
Remise_min = 0%
Remise_max = 100%
```

**Détails de la validation :**
```javascript
<Input
  type="number"
  min="0"
  max="100"
  step="0.01"
  value={item.discount || 0}
/>
```

**Explication :**
- Empêche les remises négatives ou supérieures à 100%
- Permet une précision de 0.01% pour les remises décimales
- Assure la cohérence des calculs financiers

---

### 5.3 Contraintes sur le Taux de TVA

**Règle métier :** Le taux de TVA est limité entre 0% et 100%.

**Contraintes :**
```
Taux_TVA_min = 0%
Taux_TVA_max = 100%
```

**Détails de la validation :**
```javascript
<Input
  type="number"
  min="0"
  max="100"
  step="0.01"
  value={taxRate}
/>
```

**Explication :**
- Permet différents taux de TVA selon la législation
- Supporte les taux réduits (5.5%, 10%) et le taux standard (20%)
- Permet une précision de 0.01% pour les taux décimales

---

### 5.4 Contraintes sur les Quantités

**Règle métier :** Les quantités doivent être supérieures ou égales à 1.

**Contraintes :**
```
Quantité_min = 1
```

**Détails de la validation :**
```javascript
<Input
  type="number"
  min="1"
  value={item.quantity}
/>
```

**Explication :**
- Empêche les quantités nulles ou négatives
- Assure la cohérence des calculs
- Améliore l'expérience utilisateur

---

### 5.5 Contraintes sur les Prix

**Règle métier :** Les prix unitaires doivent être supérieurs ou égaux à 0.

**Contraintes :**
```
Prix_unitaire_min = 0
```

**Détails de la validation :**
```javascript
<Input
  type="number"
  min="0"
  step="0.01"
  value={item.unitPrice}
/>
```

**Explication :**
- Permet les prix gratuits (0) pour les articles promotionnels
- Empêche les prix négatifs
- Permet une précision de 0.01€ pour les prix décimales

---

## 6. Règles de Gestion des Statuts

### 6.1 Statuts Disponibles

**Règle métier :** Un devis peut avoir l'un des statuts suivants.

**Statuts possibles :**
- `draft` : Brouillon (en cours de création)
- `sent` : Envoyé au client
- `accepted` : Accepté par le client
- `rejected` : Rejeté par le client
- `expired` : Expiré (date d'expiration dépassée)

**Explication :**
- Chaque statut a une couleur et une icône associées
- Les statuts déterminent les actions possibles
- Un devis ne peut avoir qu'un seul statut à la fois

---

### 6.2 Exclusion des Devis Rejetés et Expirés

**Règle métier :** Les devis rejetés et expirés sont exclus de certains calculs de valeur.

**Règle d'exclusion :**
```
Pour le calcul de la valeur totale KPI :
  Exclure si status = 'rejected' OU status = 'expired'
```

**Détails de l'exclusion :**
```javascript
const totalValue = quotes
  .filter(q => q.status !== 'rejected' && q.status !== 'expired')
  .reduce((sum, q) => sum + (q.totalAmount * (1 + q.taxRate / 100)), 0);
```

**Explication :**
- Les devis rejetés et expirés ne contribuent plus au pipeline
- Permet une vision réaliste de la valeur commerciale active
- Utilisé uniquement pour le KPI de valeur totale

---

## 7. Règles de Gestion des Articles

### 7.1 Ajout d'Articles depuis le Catalogue

**Règle métier :** Les articles peuvent être ajoutés depuis le catalogue avec leurs paramètres par défaut.

**Paramètres appliqués :**
```
- Description : Nom de l'article du catalogue
- Quantité : Quantité par défaut du catalogue (ou 1 si non définie)
- Prix unitaire : Prix unitaire du catalogue
- Remise : Remise par défaut du catalogue (ou 0% si non définie)
```

**Détails de l'ajout :**
```javascript
const item = catalog.find(c => c.id === catalogItemId);
const newItem = {
  id: newId,
  description: item.name,
  quantity: item.defaultQuantity || 1,
  unitPrice: item.unitPrice,
  discount: item.defaultDiscount || 0,
  total: 0
};
```

**Explication :**
- Accélère la création de devis
- Assure la cohérence des prix
- Permet de personnaliser les paramètres après ajout

---

### 7.2 Suppression d'Articles

**Règle métier :** Un devis doit toujours contenir au moins un article.

**Contrainte :**
```
Nombre_articles_min = 1
```

**Détails de la validation :**
```javascript
disabled={items.length === 1}
```

**Explication :**
- Empêche la création de devis vides
- Assure la cohérence des données
- Améliore l'expérience utilisateur

---

## 8. Règles de Formatage et Affichage

### 8.1 Formatage des Montants

**Règle métier :** Les montants sont formatés avec séparateurs de milliers et symbole euro.

**Format :**
```
Montant_formaté = "€" + Montant.toLocaleString('fr-FR')
```

**Détails du formatage :**
```javascript
€{amount.toLocaleString('fr-FR')}
```

**Explication :**
- Utilise le format français (espace comme séparateur de milliers)
- Améliore la lisibilité des montants
- Cohérent avec les standards français

**Exemple :**
- Montant : 12500
- Formaté : €12 500

---

### 8.2 Formatage des Dates

**Règle métier :** Les dates sont formatées selon le format français.

**Format :**
```
Date_formatée = Date.toLocaleDateString('fr-FR')
```

**Détails du formatage :**
```javascript
new Date(date).toLocaleDateString('fr-FR')
```

**Explication :**
- Format : JJ/MM/AAAA
- Cohérent avec les standards français
- Améliore la lisibilité

**Exemple :**
- Date : 2026-01-20
- Formatée : 20/01/2026

---

### 8.3 Formatage des Pourcentages

**Règle métier :** Les pourcentages sont affichés avec le symbole % et arrondis selon le contexte.

**Format :**
```
Pourcentage_formaté = Valeur.toFixed(décimales) + "%"
```

**Détails du formatage :**
```javascript
const rate = (value / total) * 100;
rate.toFixed(1) + "%"
```

**Explication :**
- Arrondi à 1 décimale pour les taux
- Améliore la lisibilité
- Cohérent avec les standards d'affichage

**Exemple :**
- Taux : 66.6667
- Formaté : 66.7%

---

## 9. Règles de Recherche et Filtrage

### 9.1 Recherche de Devis

**Règle métier :** La recherche filtre les devis selon le texte saisi.

**Critères de recherche :**
```
Recherche dans :
- Numéro de devis
- Nom de l'entreprise
- Nom du contact
- Email
- Téléphone
```

**Détails de la recherche :**
```javascript
const filteredQuotes = quotes.filter(q => 
  q.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
  q.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
  q.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
  (q.email && q.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
  (q.phone && q.phone.includes(searchQuery))
);
```

**Explication :**
- Recherche insensible à la casse
- Recherche dans plusieurs champs simultanément
- Permet de trouver rapidement un devis

---

## 10. Règles de Gestion des Workflows

### 10.1 Circuit d'Approbation

**Règle métier :** Un devis peut avoir un circuit d'approbation avec plusieurs niveaux.

**Statuts d'approbation :**
- `pending` : En attente d'approbation
- `approved` : Approuvé
- `rejected` : Rejeté

**Explication :**
- Chaque approbateur a un rôle (Manager, Directeur, etc.)
- Les approbations sont enregistrées dans l'historique
- Les commentaires peuvent être ajoutés lors de l'approbation

---

### 10.2 Historique des Actions

**Règle métier :** Toutes les actions importantes sur un devis sont enregistrées dans l'historique.

**Actions enregistrées :**
- Création du devis
- Envoi du devis
- Approbation/Rejet
- Modification
- Changement de statut

**Explication :**
- Permet de tracer toutes les modifications
- Améliore la traçabilité
- Facilite l'audit

---

## 11. Règles de Suivi et Tracking

### 11.1 Suivi des Ouvertures

**Règle métier :** Le système enregistre chaque ouverture du devis par le client.

**Informations enregistrées :**
- Date et heure d'ouverture
- Adresse IP du client
- Informations sur l'appareil

**Explication :**
- Permet de mesurer l'engagement client
- Identifie les devis consultés
- Aide à prioriser les relances

---

### 11.2 Suivi des Emails

**Règle métier :** Le système suit l'envoi et l'ouverture des emails contenant le devis.

**Métriques suivies :**
- Nombre d'ouvertures
- Nombre de clics
- Statut de l'email (sent, bounced, failed)

**Explication :**
- Mesure l'efficacité de la communication
- Identifie les problèmes de livraison
- Aide à optimiser les relances

---

### 11.3 Gestion des Relances

**Règle métier :** Des relances peuvent être planifiées pour suivre les devis.

**Types de relances :**
- Email
- Appel téléphonique
- Réunion

**Statuts :**
- `pending` : En attente
- `completed` : Complétée
- `cancelled` : Annulée

**Explication :**
- Permet de planifier le suivi commercial
- Améliore le taux de conversion
- Assure un suivi régulier

---

### 11.4 Signatures Électroniques

**Règle métier :** Des demandes de signature électronique peuvent être envoyées pour les devis.

**Statuts de signature :**
- `pending` : En attente
- `signed` : Signé
- `rejected` : Rejeté
- `expired` : Expiré

**Explication :**
- Accélère le processus de validation
- Améliore l'expérience client
- Facilite la gestion documentaire

---

## 12. Règles de Génération PDF

### 12.1 Templates PDF Disponibles

**Règle métier :** Plusieurs templates PDF peuvent être utilisés pour générer le devis.

**Templates disponibles :**
- Template standard
- Charte ODACE
- CGV (Conditions Générales de Vente)

**Explication :**
- Permet de personnaliser l'apparence
- Adapte le document selon le contexte
- Respecte les standards de l'entreprise

---

## Conclusion

Ce document recense toutes les règles métier identifiées dans la page Devis. Ces règles régissent les calculs financiers, la gestion des statuts, les validations, les analytics et toutes les fonctionnalités liées aux devis dans le CRM.

Pour toute question ou clarification sur ces règles, veuillez consulter le code source dans `src/app/components/Quotes.tsx`.

