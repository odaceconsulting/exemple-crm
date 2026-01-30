# Règles Métier du Dashboard Principal

Ce document liste toutes les règles métier, formules de calcul et explications identifiées dans la page Dashboard principale du CRM.

---

## 1. Indicateurs Clés de Performance (KPIs)

### 1.1 Chiffre d'Affaires (CA)

**Règle métier :** Le chiffre d'affaires représente le montant total des ventes réalisées sur une période donnée.

**Formule de calcul :**
```
CA = Σ(Montant des factures payées)
```

**Évolution mensuelle :**
```
Évolution (%) = ((CA_mois_actuel - CA_mois_précédent) / CA_mois_précédent) × 100
```

**Explication :**
- Le CA est calculé en sommant tous les montants des factures ayant le statut "paid" (payées)
- L'évolution est comparée au mois précédent
- Une évolution positive est affichée en vert avec un indicateur "up"
- Une évolution négative est affichée en rouge avec un indicateur "down"

**Exemple :**
- CA mois actuel : €245,750
- CA mois précédent : €218,500
- Évolution : ((245,750 - 218,500) / 218,500) × 100 = +12.5%

---

### 1.2 Nouveaux Leads

**Règle métier :** Compte le nombre de nouveaux contacts/leads créés dans le système sur une période donnée.

**Formule de calcul :**
```
Nouveaux Leads = COUNT(Leads créés dans la période)
```

**Évolution mensuelle :**
```
Évolution (%) = ((Leads_mois_actuel - Leads_mois_précédent) / Leads_mois_précédent) × 100
```

**Explication :**
- Un lead est comptabilisé à sa date de création (`createdAt`)
- Seuls les leads avec le statut "new" ou "contacted" sont comptés
- L'évolution permet de suivre la croissance du portefeuille de prospects

**Exemple :**
- Leads mois actuel : 142
- Leads mois précédent : 131
- Évolution : ((142 - 131) / 131) × 100 = +8.2%

---

### 1.3 Taux de Conversion

**Règle métier :** Mesure le pourcentage de leads convertis en opportunités gagnées (won).

**Formule de calcul :**
```
Taux de Conversion (%) = (Nombre d'opportunités gagnées / Nombre total d'opportunités) × 100
```

**Évolution mensuelle :**
```
Évolution (%) = Taux_actuel - Taux_précédent
```

**Explication :**
- Une opportunité est considérée comme "gagnée" si son statut est "won"
- Le taux de conversion mesure l'efficacité du processus commercial
- Un taux élevé indique une bonne qualification des leads

**Exemple :**
- Opportunités totales : 100
- Opportunités gagnées : 25
- Taux de conversion : (25 / 100) × 100 = 25%
- Taux précédent : 27.1%
- Évolution : 25% - 27.1% = -2.1%

---

### 1.4 Clients Actifs

**Règle métier :** Compte le nombre de clients ayant une activité récente (factures, projets, interactions).

**Formule de calcul :**
```
Clients Actifs = COUNT(Clients avec statut = 'active' ET dernière interaction < 90 jours)
```

**Évolution mensuelle :**
```
Évolution (%) = ((Clients_actifs_mois_actuel - Clients_actifs_mois_précédent) / Clients_actifs_mois_précédent) × 100
```

**Explication :**
- Un client est considéré comme actif s'il a :
  - Le statut "active"
  - Une dernière interaction datant de moins de 90 jours
  - Au moins une facture ou un projet en cours dans les 6 derniers mois

**Exemple :**
- Clients actifs mois actuel : 86
- Clients actifs mois précédent : 81
- Évolution : ((86 - 81) / 81) × 100 = +5.4%

---

## 2. Prévisions Commerciales (Pipeline Forecast)

### 2.1 Prévision Pondérée par Probabilité

**Règle métier :** Calcule la prévision de revenus pour les 3 prochains mois en pondérant chaque opportunité par sa probabilité de succès.

**Formule de calcul :**
```
Pour chaque opportunité ouverte :
  Prévision pondérée = (Montant de l'opportunité × Probabilité) / 100

Pour chaque mois (M0, M1, M2) :
  Prévision_mois = Σ(Prévision pondérée des opportunités se clôturant ce mois)
```

**Détails du calcul :**
```javascript
monthlyForecast[mois] += (opportunité.montant × opportunité.probabilité) / 100
```

**Explication :**
- Seules les opportunités avec statut "open" sont prises en compte
- La date de clôture prévue (`expectedCloseDate`) détermine le mois de prévision
- La probabilité est exprimée en pourcentage (0-100%)
- Cette méthode donne une prévision plus réaliste que la simple somme des montants

**Exemple :**
- Opportunité 1 : €50,000, probabilité 75%, clôture prévue M0 → Contribution : €37,500
- Opportunité 2 : €30,000, probabilité 50%, clôture prévue M1 → Contribution : €15,000
- Prévision M0 : €37,500
- Prévision M1 : €15,000

---

### 2.2 Taux de Conversion du Pipeline

**Règle métier :** Calcule le pourcentage d'opportunités gagnées par rapport au total des opportunités.

**Formule de calcul :**
```
Taux de Conversion = (Nombre d'opportunités gagnées / Nombre total d'opportunités) × 100
```

**Explication :**
- Les opportunités gagnées sont celles avec le statut "won"
- Le taux de conversion mesure l'efficacité globale du processus de vente
- Utilisé pour les prévisions et l'analyse de performance

**Exemple :**
- Total opportunités : 100
- Opportunités gagnées : 25
- Taux de conversion : (25 / 100) × 100 = 25%

---

### 2.3 Durée Moyenne du Cycle de Vente

**Règle métier :** Calcule le nombre moyen de jours entre la création d'une opportunité et sa clôture (gagnée).

**Formule de calcul :**
```
Durée moyenne = Σ(Durée de chaque opportunité gagnée) / Nombre d'opportunités gagnées

Où Durée = actualCloseDate - createdAt (en jours)
```

**Explication :**
- Seules les opportunités avec statut "won" sont prises en compte
- Si `salesCycleDuration` est disponible, il est utilisé directement
- Sinon, la durée est calculée à partir des dates de création et de clôture
- Permet d'estimer le temps nécessaire pour convertir un lead en client

**Exemple :**
- Opportunité 1 : 30 jours
- Opportunité 2 : 45 jours
- Opportunité 3 : 25 jours
- Durée moyenne : (30 + 45 + 25) / 3 = 33.3 jours ≈ 33 jours

---

## 3. Calculs Financiers

### 3.1 Total Facturé

**Règle métier :** Somme de tous les montants des factures émises, quel que soit leur statut de paiement.

**Formule de calcul :**
```
Total Facturé = Σ(Montant total de chaque facture)

Où Montant total = subtotal + tax - discount
```

**Explication :**
- Inclut toutes les factures avec statut : "draft", "sent", "paid", "partial", "overdue"
- Le montant total d'une facture = sous-total + TVA - remise
- Représente l'engagement financier total envers les clients

---

### 3.2 Total Payé

**Règle métier :** Somme des montants des factures entièrement payées.

**Formule de calcul :**
```
Total Payé = Σ(Montant des factures avec paymentStatus = 'paid')
```

**Explication :**
- Seules les factures avec `paymentStatus = 'paid'` sont comptabilisées
- Représente les revenus réellement encaissés
- Utilisé pour le calcul du cash-flow réel

---

### 3.3 Total Impayé

**Règle métier :** Somme des montants des factures non encore payées.

**Formule de calcul :**
```
Total Impayé = Σ(Montant des factures avec paymentStatus = 'unpaid' OU 'partial')
```

**Explication :**
- Inclut les factures non payées et partiellement payées
- Permet d'identifier le montant à recouvrer
- Important pour la gestion de trésorerie

---

### 3.4 Total En Retard (Overdue)

**Règle métier :** Somme des montants des factures dont la date d'échéance est dépassée et qui ne sont pas encore payées.

**Formule de calcul :**
```
Total En Retard = Σ(Montant des factures où dueDate < Date actuelle ET paymentStatus ≠ 'paid')
```

**Explication :**
- Une facture est en retard si :
  - `dueDate < Date actuelle`
  - ET `paymentStatus` est "unpaid" ou "partial"
- Indicateur critique pour la gestion de trésorerie
- Nécessite une action de relance

---

### 3.5 Temps Moyen de Paiement

**Règle métier :** Calcule le nombre moyen de jours entre l'émission d'une facture et son paiement.

**Formule de calcul :**
```
Temps moyen = Σ(Durée de paiement de chaque facture payée) / Nombre de factures payées

Où Durée = paymentDate - issueDate (en jours)
```

**Explication :**
- Seules les factures payées sont prises en compte
- Permet d'évaluer la rapidité de paiement des clients
- Utilisé pour les prévisions de trésorerie

**Exemple :**
- Facture 1 : émission 01/01, paiement 15/01 → 14 jours
- Facture 2 : émission 05/01, paiement 20/01 → 15 jours
- Temps moyen : (14 + 15) / 2 = 14.5 jours

---

### 3.6 Pourcentage de Paiement à l'Échéance

**Règle métier :** Calcule le pourcentage de factures payées avant ou à la date d'échéance.

**Formule de calcul :**
```
Paiement à l'échéance (%) = (Nombre de factures payées avant dueDate / Nombre total de factures payées) × 100
```

**Explication :**
- Une facture est considérée comme payée à temps si `paymentDate <= dueDate`
- Indicateur de qualité de la relation client
- Un pourcentage élevé indique de bons délais de paiement

---

## 4. Performance de l'Équipe Commerciale

### 4.1 Chiffre d'Affaires par Collaborateur

**Règle métier :** Calcule le CA généré par chaque membre de l'équipe commerciale.

**Formule de calcul :**
```
CA_collaborateur = Σ(Montant des factures payées où owner = collaborateur.id)
```

**Explication :**
- Le CA est attribué au propriétaire de la facture (`owner`)
- Permet de comparer la performance individuelle
- Utilisé pour les commissions et bonus

---

### 4.2 Nombre de Leads par Collaborateur

**Règle métier :** Compte le nombre de leads gérés par chaque collaborateur.

**Formule de calcul :**
```
Leads_collaborateur = COUNT(Leads où owner = collaborateur.id)
```

**Explication :**
- Un lead est attribué au collaborateur via le champ `owner`
- Mesure l'activité de prospection
- Permet d'identifier les collaborateurs les plus actifs

---

### 4.3 Taux de Conversion par Collaborateur

**Règle métier :** Calcule le pourcentage de conversion des leads en opportunités gagnées pour chaque collaborateur.

**Formule de calcul :**
```
Taux de Conversion = (Opportunités gagnées par le collaborateur / Opportunités totales du collaborateur) × 100
```

**Explication :**
- Mesure l'efficacité de chaque commercial
- Permet d'identifier les meilleurs performeurs
- Utilisé pour le coaching et la formation

**Exemple :**
- Collaborateur A : 20 opportunités totales, 6 gagnées → 30%
- Collaborateur B : 15 opportunités totales, 3 gagnées → 20%

---

## 5. Gestion des Ressources Humaines

### 5.1 Collaborateurs Actifs

**Règle métier :** Compte le nombre d'employés ayant le statut "active".

**Formule de calcul :**
```
Collaborateurs Actifs = COUNT(Employés où status = 'active')
```

**Explication :**
- Un employé est actif s'il a le statut "active"
- Exclut les employés en congé, inactifs ou terminés
- Utilisé pour le calcul des ratios de productivité

---

### 5.2 Collaborateurs en Congé

**Règle métier :** Compte le nombre d'employés actuellement en congé.

**Formule de calcul :**
```
Collaborateurs en Congé = COUNT(Employés où status = 'on_leave' OU 
  (Date actuelle entre startDate et endDate d'un congé approuvé))
```

**Explication :**
- Un employé est en congé si :
  - Son statut est "on_leave"
  - OU il a un congé approuvé dont la date actuelle est entre `startDate` et `endDate`
- Important pour la planification des ressources

---

### 5.3 Collaborateurs Inactifs

**Règle métier :** Compte le nombre d'employés ayant le statut "inactive" ou "terminated".

**Formule de calcul :**
```
Collaborateurs Inactifs = COUNT(Employés où status = 'inactive' OU status = 'terminated')
```

**Explication :**
- Les employés inactifs ne sont plus comptabilisés dans les effectifs actifs
- Utilisé pour les statistiques RH et les rapports de gestion

---

## 6. Métriques Marketing

### 6.1 Taux d'Ouverture (Open Rate)

**Règle métier :** Pourcentage d'emails ouverts par rapport aux emails délivrés.

**Formule de calcul :**
```
Taux d'Ouverture (%) = (Nombre d'emails ouverts / Nombre d'emails délivrés) × 100
```

**Explication :**
- Un email est considéré comme ouvert si l'événement "opened" est enregistré
- Les emails non délivrés (bounced) sont exclus du calcul
- Indicateur de l'efficacité du sujet et du timing de l'email

**Exemple :**
- Emails délivrés : 143
- Emails ouverts : 89
- Taux d'ouverture : (89 / 143) × 100 = 62.2%

---

### 6.2 Taux de Clic (Click Rate)

**Règle métier :** Pourcentage de destinataires ayant cliqué sur au moins un lien dans l'email.

**Formule de calcul :**
```
Taux de Clic (%) = (Nombre de clics / Nombre d'emails délivrés) × 100
```

**Explication :**
- Mesure l'engagement avec le contenu de l'email
- Un taux élevé indique un contenu pertinent
- Utilisé pour optimiser les campagnes email

**Exemple :**
- Emails délivrés : 143
- Clics : 34
- Taux de clic : (34 / 143) × 100 = 23.7%

---

### 6.3 Taux de Conversion Marketing

**Règle métier :** Pourcentage de destinataires ayant effectué une action souhaitée (achat, inscription, etc.).

**Formule de calcul :**
```
Taux de Conversion (%) = (Nombre de conversions / Nombre d'emails délivrés) × 100
```

**Explication :**
- Une conversion est une action définie comme objectif de la campagne
- Mesure l'efficacité globale de la campagne
- Utilisé pour calculer le ROI

**Exemple :**
- Emails délivrés : 143
- Conversions : 8
- Taux de conversion : (8 / 143) × 100 = 5.5%

---

### 6.4 Retour sur Investissement (ROI)

**Règle métier :** Calcule le retour sur investissement d'une campagne marketing.

**Formule de calcul :**
```
ROI = ((Revenus générés - Coût de la campagne) / Coût de la campagne) × 100
```

**Explication :**
- Le ROI mesure la rentabilité d'une campagne
- Un ROI positif indique que la campagne est rentable
- Utilisé pour décider de l'allocation du budget marketing

**Exemple :**
- Coût de la campagne : €2,000
- Revenus générés : €8,400
- ROI : ((8,400 - 2,000) / 2,000) × 100 = 320%

---

## 7. Calculs de Facturation

### 7.1 Calcul de la TVA

**Règle métier :** Calcule le montant de la TVA à partir du montant HT et du taux de TVA.

**Formule de calcul :**
```
TVA = Montant HT × (Taux TVA / 100)
```

**Explication :**
- Le taux de TVA standard en France est de 20%
- Le taux peut varier selon le type de produit/service
- La TVA est ajoutée au montant HT pour obtenir le montant TTC

**Exemple :**
- Montant HT : €1,000
- Taux TVA : 20%
- TVA : 1,000 × (20 / 100) = €200

---

### 7.2 Calcul de la Remise

**Règle métier :** Calcule le montant de la remise à partir du montant et du pourcentage de remise.

**Formule de calcul :**
```
Remise = Montant × (Pourcentage remise / 100)
```

**Explication :**
- La remise peut être appliquée sur le total ou sur des lignes individuelles
- La remise est soustraite du montant avant l'ajout de la TVA
- Utilisée pour les négociations commerciales

**Exemple :**
- Montant : €1,000
- Remise : 10%
- Montant de la remise : 1,000 × (10 / 100) = €100

---

### 7.3 Calcul du Total d'une Facture

**Règle métier :** Calcule le montant total TTC d'une facture en incluant la TVA et en déduisant les remises.

**Formule de calcul :**
```
Sous-total = Σ((Quantité × Prix unitaire) - Remise ligne) pour chaque ligne

Montant HT = Sous-total - Remise globale

TVA = Montant HT × (Taux TVA / 100)

Total TTC = Montant HT + TVA
```

**Explication :**
- Le calcul se fait ligne par ligne puis au niveau global
- La TVA est calculée sur le montant HT après remises
- Le total TTC est le montant à facturer au client

**Exemple :**
- Ligne 1 : 10 × €150 - €0 = €1,500
- Ligne 2 : 5 × €500 - €50 = €2,450
- Sous-total : €3,950
- Remise globale : €50
- Montant HT : €3,900
- TVA (20%) : €780
- Total TTC : €4,680

---

## 8. Répartition du Pipeline Commercial

### 8.1 Distribution par Étape

**Règle métier :** Répartit les opportunités selon leur étape dans le pipeline.

**Formule de calcul :**
```
Pourcentage_étape = (Nombre d'opportunités à l'étape / Nombre total d'opportunités) × 100
```

**Explication :**
- Les étapes typiques sont : Prospection, Qualification, Négociation, Conclusion
- Chaque étape a une probabilité de succès associée
- Permet d'identifier les goulots d'étranglement dans le processus

**Exemple :**
- Total opportunités : 100
- Prospection : 35 → 35%
- Qualification : 28 → 28%
- Négociation : 22 → 22%
- Conclusion : 15 → 15%

---

## 9. Répartition des Clients

### 9.1 Distribution par Type d'Entreprise

**Règle métier :** Répartit les clients selon leur taille ou type d'entreprise.

**Formule de calcul :**
```
Pourcentage_type = (Nombre de clients du type / Nombre total de clients) × 100
```

**Explication :**
- Les types peuvent être : PME, ETI, Startups, Grandes Entreprises
- La classification peut se baser sur le nombre d'employés ou le CA annuel
- Permet d'analyser le portefeuille client

**Exemple :**
- Total clients : 100
- PME : 32 → 32%
- ETI : 28 → 28%
- Startups : 18 → 18%
- Grandes Entreprises : 22 → 22%

---

## 10. Règles de Filtrage et Recherche

### 10.1 Détection de Filtres Actifs

**Règle métier :** Détermine si des filtres sont actuellement appliqués sur les données.

**Formule de calcul :**
```
Filtres actifs = TRUE si :
  - searchQuery ≠ '' OU
  - type ≠ 'all' OU
  - status ≠ 'all' OU
  - dateRange ≠ 'all' OU
  - minValue ≠ '' OU
  - maxValue ≠ ''
```

**Explication :**
- Un indicateur visuel (badge rouge) est affiché lorsqu'au moins un filtre est actif
- Permet à l'utilisateur de savoir que les données affichées sont filtrées
- Un bouton "Réinitialiser" permet de supprimer tous les filtres

---

### 10.2 Filtrage par Plage de Montant

**Règle métier :** Filtre les opportunités/factures selon une plage de montant.

**Formule de calcul :**
```
Élément inclus si : minValue ≤ Montant ≤ maxValue
```

**Explication :**
- Permet de rechercher des opportunités ou factures dans une fourchette de montant
- Utile pour l'analyse de portefeuille
- Les valeurs sont en euros (€)

---

## 11. Création d'Opportunité

### 11.1 Validation des Champs Requis

**Règle métier :** Vérifie que les champs obligatoires sont remplis avant de créer une opportunité.

**Formule de calcul :**
```
Validation = TRUE si :
  - title ≠ '' ET
  - company ≠ ''
```

**Explication :**
- Le titre et l'entreprise sont obligatoires
- Le montant et la date de clôture sont optionnels
- Si la validation échoue, un message d'erreur est affiché
- Une nouvelle opportunité est créée avec :
  - `probability` = 20% (par défaut)
  - `stage` = 'prospection' (par défaut)
  - `priority` = 'medium' (par défaut)

---

## 12. Calculs de Progression

### 12.1 Progression d'un Projet

**Règle métier :** Calcule le pourcentage d'avancement d'un projet.

**Formule de calcul :**
```
Progression (%) = (Tâches complétées / Nombre total de tâches) × 100

OU

Progression (%) = (Montant dépensé / Budget total) × 100
```

**Explication :**
- La progression peut être calculée selon plusieurs méthodes
- Basée sur les tâches : nombre de tâches complétées
- Basée sur le budget : montant dépensé par rapport au budget
- Utilisée pour suivre l'avancement et identifier les retards

---

## Notes Importantes

1. **Arrondissements :** Les pourcentages sont généralement arrondis à 1 décimal près, sauf indication contraire.

2. **Périodes de calcul :** Les KPIs sont calculés sur une base mensuelle, avec comparaison au mois précédent.

3. **Données en temps réel :** Les calculs sont effectués à partir des données disponibles dans le système au moment de l'affichage.

4. **Gestion des valeurs nulles :** Les valeurs nulles ou vides sont traitées comme 0 dans les calculs.

5. **Devise :** Tous les montants sont en euros (€) par défaut, sauf indication contraire.

---

## Références

- Fichier source principal : `src/app/components/Dashboard.tsx`
- Services de données : `src/app/services/dataService.ts`
- Utilitaires : `src/app/utils/helpers.ts`
- Types de données : `src/app/types/index.ts`

---

*Document généré le : 2026-01-23*
*Version : 1.0*

