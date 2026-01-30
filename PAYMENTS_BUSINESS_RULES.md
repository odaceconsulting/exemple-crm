# Règles Métier de la Page Paiements

Ce document liste toutes les règles métier, formules de calcul et explications identifiées dans la page Paiements du CRM.

---

## 1. Calculs de Montants Globaux

### 1.1 Total des Paiements

**Règle métier :** Calcule le montant total de tous les paiements enregistrés, quel que soit leur statut.

**Formule de calcul :**
```
Total_paiements = Σ(Montant de tous les paiements)
```

**Détails du calcul :**
```javascript
const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
```

**Explication :**
- Somme de tous les paiements sans distinction de statut
- Représente le volume total de paiements gérés
- Utilisé comme indicateur global de l'activité
- Formaté avec séparateurs de milliers

**Exemple :**
- Paiement 1 : €15,000
- Paiement 2 : €8,500
- Paiement 3 : €22,000
- Paiement 4 : €5,500
- Total : €51,000

---

### 1.2 Montant Payé

**Règle métier :** Calcule le montant total des paiements confirmés (statut 'paid').

**Formule de calcul :**
```
Montant_payé = Σ(Montant des paiements où status = 'paid')
```

**Détails du calcul :**
```javascript
const paidAmount = payments
  .filter(p => p.status === 'paid')
  .reduce((sum, p) => sum + p.amount, 0);
```

**Explication :**
- Seuls les paiements avec statut 'paid' sont comptabilisés
- Représente les revenus réellement encaissés
- Utilisé pour mesurer la trésorerie disponible
- Formaté avec séparateurs de milliers

**Exemple :**
- Paiement 1 : €15,000 (payé)
- Paiement 2 : €8,500 (payé)
- Montant payé : €23,500

---

### 1.3 Montant en Attente

**Règle métier :** Calcule le montant total des paiements en attente de confirmation.

**Formule de calcul :**
```
Montant_en_attente = Σ(Montant des paiements où status = 'pending')
```

**Détails du calcul :**
```javascript
const pendingAmount = payments
  .filter(p => p.status === 'pending')
  .reduce((sum, p) => sum + p.amount, 0);
```

**Explication :**
- Paiements enregistrés mais non encore confirmés
- Représente les créances à court terme
- Utilisé pour la prévision de trésorerie
- Formaté avec séparateurs de milliers

**Exemple :**
- Paiement 1 : €22,000 (en attente)
- Montant en attente : €22,000

---

## 2. Paiements Partiels

### 2.1 Calcul du Montant Partiel Payé

**Règle métier :** Calcule le montant total des paiements partiels enregistrés.

**Formule de calcul :**
```
Total_paiements_partiels = Σ(Montant_partiel des paiements ayant un paiement partiel)
```

**Détails du calcul :**
```javascript
const totalPartialPayments = payments
  .filter(p => p.partialAmount)
  .reduce((sum, p) => sum + (p.partialAmount || 0), 0);
```

**Explication :**
- Seuls les paiements avec un `partialAmount` défini sont comptabilisés
- Représente le montant total des acomptes versés
- Utilisé pour suivre les paiements échelonnés
- Formaté avec séparateurs de milliers

**Exemple :**
- Paiement 1 : partialAmount = €5,000
- Paiement 2 : partialAmount = €3,000
- Total paiements partiels : €8,000

---

### 2.2 Calcul du Reste à Payer

**Règle métier :** Calcule le montant restant à payer pour un paiement partiel.

**Formule de calcul :**
```
Reste_à_payer = Montant_total - Montant_partiel
```

**Détails du calcul :**
```javascript
const remainingAmount = payment.amount - (payment.partialAmount || 0);
```

**Explication :**
- Calculé pour chaque paiement ayant un paiement partiel
- Représente le solde restant à payer
- Utilisé pour suivre l'avancement des paiements
- Formaté avec séparateurs de milliers

**Exemple :**
- Montant total : €12,500
- Montant partiel : €5,000
- Reste à payer : €12,500 - €5,000 = €7,500

---

### 2.3 Validation d'un Paiement Partiel

**Règle métier :** Un paiement partiel ne peut être enregistré que si le montant est valide.

**Conditions de validation :**
```
- Montant_partiel > 0
- Montant_partiel < Montant_total
```

**Détails de la validation :**
```javascript
const partial = parseFloat(partialAmount);
if (partial <= 0 || partial >= selectedPayment.amount) return;
```

**Explication :**
- Empêche les paiements partiels négatifs ou nuls
- Empêche les paiements partiels supérieurs ou égaux au montant total
- Assure la cohérence des calculs
- Améliore l'expérience utilisateur

**Exemple :**
- Montant total : €12,500
- Paiement partiel valide : €5,000 (0 < 5,000 < 12,500)
- Paiement partiel invalide : €12,500 (égal au montant total)
- Paiement partiel invalide : €15,000 (supérieur au montant total)

---

## 3. Trop-Perçus

### 3.1 Calcul du Total des Trop-Perçus

**Règle métier :** Calcule le montant total des surpaiements enregistrés.

**Formule de calcul :**
```
Total_trop_perçus = Σ(Montant_trop_perçu des paiements ayant un trop-perçu)
```

**Détails du calcul :**
```javascript
const totalOverpayments = payments
  .filter(p => p.overpaymentAmount)
  .reduce((sum, p) => sum + (p.overpaymentAmount || 0), 0);
```

**Explication :**
- Seuls les paiements avec un `overpaymentAmount` défini sont comptabilisés
- Représente le montant total des surpaiements
- Utilisé pour gérer les remboursements
- Formaté avec séparateurs de milliers

**Exemple :**
- Paiement 1 : overpaymentAmount = €500
- Paiement 2 : overpaymentAmount = €200
- Total trop-perçus : €700

---

### 3.2 Enregistrement d'un Trop-Perçu

**Règle métier :** Enregistre un trop-perçu sur un paiement et marque le paiement comme payé.

**Règle d'enregistrement :**
```
Lors de l'enregistrement d'un trop-perçu :
  - overpaymentAmount : Montant du trop-perçu
  - status : Devient 'paid'
```

**Détails de l'enregistrement :**
```javascript
const handleOverpayment = (id: number, overpaidAmount: number) => {
  setPayments(payments.map(p =>
    p.id === id 
      ? { 
          ...p, 
          overpaymentAmount: overpaidAmount,
          status: 'paid'
        } 
      : p
  ));
};
```

**Explication :**
- Un trop-perçu indique que le client a payé plus que le montant dû
- Le paiement est automatiquement marqué comme payé
- Le montant du trop-perçu est conservé pour gestion des remboursements
- Permet de gérer les cas de surpaiement

**Exemple :**
- Paiement : €12,500, status 'pending'
- Trop-perçu : €500
- Résultat : status 'paid', overpaymentAmount = €500

---

## 4. Rapprochement des Paiements

### 4.1 Taux d'Appariement

**Règle métier :** Calcule le pourcentage de paiements appariés avec les relevés bancaires.

**Formule de calcul :**
```
Taux_appariement = (Nombre_paiements_appariés / Nombre_total_paiements) × 100
```

**Détails du calcul :**
```javascript
const matchedPayments = payments.filter(p => p.reconciliationStatus === 'matched').length;
const unmatchedPayments = payments.filter(p => p.reconciliationStatus === 'unmatched').length;
const matchingRate = payments.length > 0 
  ? Math.round((matchedPayments / payments.length) * 100) 
  : 0;
```

**Explication :**
- Mesure l'efficacité du rapprochement
- Un taux élevé indique une bonne correspondance entre paiements et relevés
- Utilisé pour identifier les problèmes de rapprochement
- Arrondi à l'entier le plus proche

**Exemple :**
- Total paiements : 20
- Paiements appariés : 15
- Taux d'appariement : (15 / 20) × 100 = 75%

---

### 4.2 Appariement d'un Paiement

**Règle métier :** Marque un paiement comme apparié avec une transaction bancaire.

**Règle d'appariement :**
```
Lors de l'appariement :
  - reconciliationStatus : Devient 'matched'
  - reconciliationDate : Date actuelle
```

**Détails de l'appariement :**
```javascript
const matchPayment = (id: number) => {
  setPayments(payments.map(p =>
    p.id === id 
      ? { 
          ...p, 
          reconciliationStatus: 'matched',
          reconciliationDate: new Date().toISOString().split('T')[0]
        } 
      : p
  ));
};
```

**Explication :**
- Indique que le paiement correspond à une transaction du relevé bancaire
- La date d'appariement est enregistrée pour traçabilité
- Permet de suivre l'état du rapprochement
- Utilisé pour la réconciliation bancaire

**Exemple :**
- Paiement : INV-2026-001, reconciliationStatus 'pending'
- Après appariement : reconciliationStatus 'matched', reconciliationDate '2026-01-25'

---

### 4.3 Désappariement d'un Paiement

**Règle métier :** Retire l'appariement d'un paiement.

**Règle de désappariement :**
```
Lors du désappariement :
  - reconciliationStatus : Devient 'unmatched'
```

**Détails du désappariement :**
```javascript
const unmatchPayment = (id: number) => {
  setPayments(payments.map(p =>
    p.id === id 
      ? { 
          ...p, 
          reconciliationStatus: 'unmatched'
        } 
      : p
  ));
};
```

**Explication :**
- Permet de corriger un appariement erroné
- Le paiement redevient non apparié
- Utilisé pour réviser les rapprochements
- La date d'appariement n'est pas supprimée (historique conservé)

---

## 5. Calculs par Méthode de Paiement

### 5.1 Total par Méthode de Paiement

**Règle métier :** Calcule le montant total des paiements pour chaque méthode de paiement.

**Formule de calcul :**
```
Total_méthode = Σ(Montant des paiements où method = méthode_cible)
```

**Détails du calcul :**
```javascript
const methodPayments = payments.filter(p => p.method === method);
const methodTotal = methodPayments.reduce((sum, p) => sum + p.amount, 0);
```

**Explication :**
- Calculé pour chaque méthode de paiement
- Permet d'analyser les préférences de paiement des clients
- Utilisé pour optimiser les méthodes de paiement acceptées
- Formaté avec séparateurs de milliers

**Méthodes disponibles :**
- `card` : Carte Bancaire
- `bank` : Virement Bancaire
- `check` : Chèque
- `cash` : Espèces
- `transfer` : Transfert

**Exemple :**
- Carte Bancaire : €15,000
- Virement Bancaire : €22,000
- Chèque : €5,500
- Total Carte Bancaire : €15,000

---

### 5.2 Nombre de Paiements par Méthode

**Règle métier :** Compte le nombre de paiements pour chaque méthode.

**Formule de calcul :**
```
Nombre_paiements_méthode = Nombre de paiements où method = méthode_cible
```

**Détails du calcul :**
```javascript
const methodCount = methodPayments.length;
```

**Explication :**
- Utilisé pour analyser la fréquence d'utilisation de chaque méthode
- Permet d'identifier les méthodes les plus populaires
- Utilisé pour les statistiques et rapports

**Exemple :**
- Carte Bancaire : 5 paiements
- Virement Bancaire : 3 paiements
- Chèque : 2 paiements

---

### 5.3 Nombre de Paiements Confirmés par Méthode

**Règle métier :** Compte le nombre de paiements confirmés pour chaque méthode.

**Formule de calcul :**
```
Nombre_confirmés_méthode = Nombre de paiements où method = méthode_cible ET status = 'paid'
```

**Détails du calcul :**
```javascript
const confirmedCount = methodPayments.filter(p => p.status === 'paid').length;
```

**Explication :**
- Permet d'analyser le taux de confirmation par méthode
- Utilisé pour identifier les méthodes les plus fiables
- Aide à optimiser les processus de paiement

**Exemple :**
- Carte Bancaire : 4 confirmés sur 5
- Virement Bancaire : 3 confirmés sur 3
- Chèque : 1 confirmé sur 2

---

## 6. Gestion des Fournisseurs

### 6.1 Total Dû aux Fournisseurs

**Règle métier :** Calcule le montant total dû à tous les fournisseurs.

**Formule de calcul :**
```
Total_dû_fournisseurs = Σ(Montant_total de tous les fournisseurs)
```

**Détails du calcul :**
```javascript
const totalDueToSuppliers = suppliers.reduce((sum, s) => sum + s.totalAmount, 0);
```

**Explication :**
- Somme de tous les montants dus aux fournisseurs
- Représente les dettes fournisseurs
- Utilisé pour la gestion de trésorerie
- Formaté avec séparateurs de milliers

**Exemple :**
- Fournisseur 1 : €50,000
- Fournisseur 2 : €35,000
- Fournisseur 3 : €22,000
- Total dû : €107,000

---

### 6.2 Nombre de Fournisseurs Actifs

**Règle métier :** Compte le nombre de fournisseurs avec le statut 'active'.

**Formule de calcul :**
```
Nombre_fournisseurs_actifs = Nombre de fournisseurs où status = 'active'
```

**Détails du calcul :**
```javascript
const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
```

**Explication :**
- Utilisé pour mesurer l'activité des fournisseurs
- Permet de distinguer les fournisseurs actifs des inactifs
- Utilisé pour les statistiques et rapports

**Exemple :**
- Total fournisseurs : 3
- Fournisseurs actifs : 2
- Fournisseurs inactifs : 1

---

## 7. Gestion des Factures Fournisseurs

### 7.1 Total des Factures Fournisseurs

**Règle métier :** Calcule le montant total de toutes les factures reçues des fournisseurs.

**Formule de calcul :**
```
Total_factures = Σ(Montant de toutes les factures fournisseurs)
```

**Détails du calcul :**
```javascript
const totalInvoices = invoices.reduce((sum, i) => sum + i.amount, 0);
```

**Explication :**
- Somme de toutes les factures fournisseurs
- Représente l'engagement financier envers les fournisseurs
- Utilisé pour la gestion de trésorerie
- Formaté avec séparateurs de milliers

**Exemple :**
- Facture 1 : €15,000
- Facture 2 : €8,500
- Facture 3 : €22,000
- Total : €45,500

---

### 7.2 Nombre de Factures par Statut

**Règle métier :** Compte le nombre de factures pour chaque statut.

**Formule de calcul :**
```
Nombre_factures_statut = Nombre de factures où status = statut_cible
```

**Statuts possibles :**
- `paid` : Payée
- `sent` : Envoyée (en attente)
- `overdue` : En retard
- `draft` : Brouillon

**Détails du calcul :**
```javascript
const paidInvoices = invoices.filter(i => i.status === 'paid').length;
const sentInvoices = invoices.filter(i => i.status === 'sent').length;
const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;
```

**Explication :**
- Utilisé pour suivre l'état des factures fournisseurs
- Permet d'identifier les factures en retard
- Utilisé pour la gestion de trésorerie

**Exemple :**
- Payées : 1 facture
- En attente : 1 facture
- En retard : 1 facture

---

## 8. Gestion des Ordres de Paiement

### 8.1 Total des Ordres de Paiement

**Règle métier :** Calcule le montant total de tous les ordres de paiement.

**Formule de calcul :**
```
Total_ordres = Σ(Montant de tous les ordres de paiement)
```

**Détails du calcul :**
```javascript
const totalOrders = paymentOrders.reduce((sum, o) => sum + o.amount, 0);
```

**Explication :**
- Somme de tous les ordres de paiement
- Représente les paiements planifiés
- Utilisé pour la prévision de trésorerie
- Formaté avec séparateurs de milliers

**Exemple :**
- Ordre 1 : €15,000
- Ordre 2 : €8,500
- Ordre 3 : €22,000
- Total : €45,500

---

### 8.2 Nombre d'Ordres par Statut

**Règle métier :** Compte le nombre d'ordres de paiement pour chaque statut.

**Formule de calcul :**
```
Nombre_ordres_statut = Nombre d'ordres où status = statut_cible
```

**Statuts possibles :**
- `pending` : En attente d'approbation
- `approved` : Approuvé
- `paid` : Payé
- `cancelled` : Annulé

**Détails du calcul :**
```javascript
const pendingOrders = paymentOrders.filter(o => o.status === 'pending').length;
const approvedOrders = paymentOrders.filter(o => o.status === 'approved').length;
const paidOrders = paymentOrders.filter(o => o.status === 'paid').length;
```

**Explication :**
- Utilisé pour suivre le workflow des ordres de paiement
- Permet d'identifier les ordres en attente d'approbation
- Utilisé pour la gestion de trésorerie

**Exemple :**
- En attente : 1 ordre
- Approuvés : 1 ordre
- Payés : 1 ordre

---

## 9. Gestion des Échéanciers

### 9.1 Calcul du Montant par Tranche

**Règle métier :** Calcule le montant de chaque tranche d'un échéancier.

**Formule de calcul :**
```
Montant_tranche = Montant_total / Nombre_tranches
```

**Détails du calcul :**
```javascript
const installmentAmount = schedule.totalAmount / schedule.numberOfInstallments;
```

**Explication :**
- Le montant total est divisé équitablement entre les tranches
- Utilisé pour planifier les paiements échelonnés
- Permet de répartir un paiement sur plusieurs dates
- Formaté avec séparateurs de milliers

**Exemple :**
- Montant total : €30,000
- Nombre de tranches : 3
- Montant par tranche : €30,000 / 3 = €10,000

---

### 9.2 Calcul de la Progression de l'Échéancier

**Règle métier :** Calcule le pourcentage de progression d'un échéancier.

**Formule de calcul :**
```
Progression = (Tranches_payées / Nombre_total_tranches) × 100
```

**Détails du calcul :**
```javascript
const progress = (schedule.paidInstallments / schedule.numberOfInstallments) * 100;
```

**Explication :**
- Mesure l'avancement du paiement échelonné
- Utilisé pour afficher une barre de progression
- Permet de suivre l'état des paiements
- Arrondi selon le contexte d'affichage

**Exemple :**
- Nombre total de tranches : 3
- Tranches payées : 1
- Progression : (1 / 3) × 100 = 33.3%

---

### 9.3 Calcul du Total des Échéanciers

**Règle métier :** Calcule le montant total de tous les échéanciers.

**Formule de calcul :**
```
Total_échéanciers = Σ(Montant_total de tous les échéanciers)
```

**Détails du calcul :**
```javascript
const totalSchedules = schedules.reduce((sum, s) => sum + s.totalAmount, 0);
```

**Explication :**
- Somme de tous les montants totaux des échéanciers
- Représente l'engagement financier total en paiements échelonnés
- Utilisé pour la prévision de trésorerie
- Formaté avec séparateurs de milliers

**Exemple :**
- Échéancier 1 : €30,000
- Échéancier 2 : €12,000
- Total : €42,000

---

## 10. Gestion des Comptes Bancaires

### 10.1 Bilan Total des Comptes Bancaires

**Règle métier :** Calcule la somme des soldes de tous les comptes bancaires.

**Formule de calcul :**
```
Bilan_total = Σ(Solde de tous les comptes bancaires)
```

**Détails du calcul :**
```javascript
const totalBalance = bankAccounts.reduce((sum, b) => sum + b.balance, 0);
```

**Explication :**
- Somme de tous les soldes bancaires
- Représente la trésorerie totale disponible
- Utilisé pour la gestion de trésorerie
- Formaté avec séparateurs de milliers

**Exemple :**
- Compte Principal : €250,000
- Compte Épargne : €150,000
- Compte Investissement : €500,000
- Bilan total : €900,000

---

### 10.2 Nombre de Comptes Actifs

**Règle métier :** Compte le nombre de comptes bancaires avec le statut 'active'.

**Formule de calcul :**
```
Nombre_comptes_actifs = Nombre de comptes où status = 'active'
```

**Détails du calcul :**
```javascript
const activeAccounts = bankAccounts.filter(b => b.status === 'active').length;
```

**Explication :**
- Utilisé pour mesurer l'activité des comptes
- Permet de distinguer les comptes actifs des inactifs
- Utilisé pour les statistiques et rapports

**Exemple :**
- Total comptes : 3
- Comptes actifs : 3
- Comptes inactifs : 0

---

## 11. Gestion de Caisse

### 11.1 Solde Total des Caisses

**Règle métier :** Calcule la somme des soldes de toutes les caisses.

**Formule de calcul :**
```
Solde_total_caisses = Σ(Solde_actuel de toutes les caisses)
```

**Détails du calcul :**
```javascript
const totalCashBalance = cashRegisters.reduce((sum, c) => sum + c.currentBalance, 0);
```

**Explication :**
- Somme de tous les soldes en espèces
- Représente la trésorerie disponible en espèces
- Utilisé pour la gestion de trésorerie
- Formaté avec séparateurs de milliers

**Exemple :**
- Caisse Siège : €5,000
- Caisse Succursale : €2,500
- Caisse Opérations : €1,200
- Solde total : €8,700

---

### 11.2 Nombre de Caisses Ouvertes

**Règle métier :** Compte le nombre de caisses avec le statut 'open'.

**Formule de calcul :**
```
Nombre_caisses_ouvertes = Nombre de caisses où status = 'open'
```

**Détails du calcul :**
```javascript
const openRegisters = cashRegisters.filter(c => c.status === 'open').length;
```

**Explication :**
- Utilisé pour suivre l'état des caisses
- Permet d'identifier les caisses disponibles
- Utilisé pour la gestion opérationnelle

**Exemple :**
- Total caisses : 3
- Caisses ouvertes : 2
- Caisses fermées : 1

---

## 12. Soldes Temps Réel

### 12.1 Calcul de la Variation de Solde

**Règle métier :** Calcule la variation entre le solde actuel et le solde précédent.

**Formule de calcul :**
```
Variation = Solde_actuel - Solde_précédent
```

**Détails du calcul :**
```javascript
const variation = balance.balance - balance.previousBalance;
```

**Explication :**
- Mesure l'évolution du solde entre deux points dans le temps
- Une variation positive indique une augmentation
- Une variation négative indique une diminution
- Utilisé pour suivre les mouvements de trésorerie
- Formaté avec séparateurs de milliers et signe (+/-)

**Exemple :**
- Solde actuel : €250,000
- Solde précédent : €245,000
- Variation : €250,000 - €245,000 = +€5,000

---

### 12.2 Affichage de la Variation

**Règle métier :** Affiche la variation avec une couleur selon son signe.

**Règle d'affichage :**
```
Si Variation >= 0 :
  Couleur : Vert
  Affichage : +€Variation
Sinon :
  Couleur : Rouge
  Affichage : €Variation (signe négatif inclus)
```

**Détails de l'affichage :**
```javascript
<span className={`font-semibold ${balance.variation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
  {balance.variation >= 0 ? '+' : ''}€{balance.variation.toLocaleString()}
</span>
```

**Explication :**
- Les variations positives sont affichées en vert avec un signe +
- Les variations négatives sont affichées en rouge avec un signe -
- Améliore la lisibilité et la compréhension rapide
- Permet d'identifier rapidement les tendances

**Exemple :**
- Variation : +€5,000 → Affichage vert : +€5,000
- Variation : -€2,000 → Affichage rouge : -€2,000

---

## 13. Prévisions de Trésorerie

### 13.1 Calcul du Solde Attendu

**Règle métier :** Calcule le solde attendu à la fin d'un mois en fonction des revenus et dépenses prévus.

**Formule de calcul :**
```
Solde_attendu = Solde_initial + Revenus_prévus - Dépenses_prévues
```

**Détails du calcul :**
```javascript
// Le solde attendu est calculé en amont et stocké dans forecast.expectedBalance
// Basé sur : solde_actuel + projectedIncome - projectedExpense
```

**Explication :**
- Le solde attendu est une projection basée sur les prévisions
- Prend en compte les revenus et dépenses prévus
- Utilisé pour la planification financière
- Formaté avec séparateurs de milliers

**Exemple :**
- Solde initial : €400,000
- Revenus prévus : €350,000
- Dépenses prévues : €200,000
- Solde attendu : €400,000 + €350,000 - €200,000 = €550,000

---

### 13.2 Niveaux de Confiance

**Règle métier :** Définit le niveau de confiance d'une prévision.

**Niveaux de confiance :**
- `high` : Haute confiance (basé sur des données confirmées)
- `medium` : Confiance moyenne (estimations préliminaires)
- `low` : Faible confiance (prévisions indicatives)

**Explication :**
- Permet d'évaluer la fiabilité d'une prévision
- Utilisé pour prioriser les actions de trésorerie
- Aide à prendre des décisions éclairées
- Affiché avec des couleurs différentes (vert, jaune, orange)

---

## 14. Rapprochement Bancaire

### 14.1 Calcul du Montant Apparié

**Règle métier :** Calcule le montant total des transactions appariées dans un relevé.

**Formule de calcul :**
```
Montant_apparié = Σ(Montant des transactions appariées)
```

**Détails du calcul :**
```javascript
// Le montant apparié est stocké dans reconciliation.matchedAmount
```

**Explication :**
- Représente le montant total des transactions correspondant aux paiements enregistrés
- Utilisé pour vérifier la cohérence du rapprochement
- Formaté avec séparateurs de milliers

**Exemple :**
- Transactions appariées : 110
- Montant apparié : €240,000

---

### 14.2 Calcul du Montant Non Apparié

**Règle métier :** Calcule le montant total des transactions non appariées dans un relevé.

**Formule de calcul :**
```
Montant_non_apparié = Σ(Montant des transactions non appariées)
```

**Détails du calcul :**
```javascript
// Le montant non apparié est stocké dans reconciliation.unmatchedAmount
```

**Explication :**
- Représente le montant total des transactions sans correspondance
- Utilisé pour identifier les écarts
- Formaté avec séparateurs de milliers

**Exemple :**
- Transactions non appariées : 10
- Montant non apparié : €1,000

---

### 14.3 Statuts de Rapprochement

**Règle métier :** Un rapprochement peut avoir l'un des statuts suivants.

**Statuts possibles :**
- `up-to-date` : À jour (toutes les transactions sont appariées)
- `in-progress` : En cours (rapprochement en cours d'exécution)
- `issues` : Problèmes (des écarts ont été détectés)

**Explication :**
- Permet de suivre l'état du rapprochement
- Utilisé pour identifier les problèmes
- Aide à prioriser les actions de réconciliation

---

## 15. Gestion des Écarts

### 15.1 Calcul de l'Écart

**Règle métier :** Calcule la différence entre le montant attendu et le montant réel d'une transaction.

**Formule de calcul :**
```
Écart = Montant_réel - Montant_attendu
```

**Détails du calcul :**
```javascript
const difference = discrepancy.actualAmount - discrepancy.expectedAmount;
```

**Explication :**
- Un écart positif indique un trop-perçu
- Un écart négatif indique un manquant
- Utilisé pour identifier les divergences
- Formaté avec séparateurs de milliers et signe

**Exemple :**
- Montant attendu : €1,500
- Montant réel : €0
- Écart : €0 - €1,500 = -€1,500 (manquant)

---

### 15.2 Types d'Écarts

**Règle métier :** Un écart peut être de différents types selon la nature de la divergence.

**Types d'écarts :**
- `overpayment` : Trop-perçu (montant réel > montant attendu)
- `missing` : Manquant (montant réel = 0 ou très inférieur)
- `mismatch` : Incohérence (montant réel ≠ montant attendu)

**Explication :**
- Permet de catégoriser les écarts
- Utilisé pour déterminer les actions correctives
- Aide à comprendre la nature des problèmes

**Exemple :**
- Écart : +€300, Montant attendu : €2,000, Montant réel : €2,300 → Type : 'overpayment'
- Écart : -€1,500, Montant attendu : €1,500, Montant réel : €0 → Type : 'missing'

---

## 16. Reporting - Encaissements

### 16.1 Liste des Encaissements

**Règle métier :** Génère une liste de tous les encaissements enregistrés.

**Structure du rapport :**
```
Pour chaque encaissement :
  - Date : Date de l'encaissement
  - Source : Nom de l'entreprise cliente
  - Facture : Numéro de facture (optionnel)
  - Montant : Montant encaissé
  - Moyen : Méthode de paiement
```

**Explication :**
- Liste tous les encaissements sans filtre
- Permet de suivre les entrées de trésorerie
- Utilisé pour la comptabilité et les rapports financiers
- Peut être exporté en CSV/Excel/PDF

---

## 17. Reporting - Décaissements

### 17.1 Liste des Décaissements

**Règle métier :** Génère une liste de tous les décaissements enregistrés.

**Structure du rapport :**
```
Pour chaque décaissement :
  - Date : Date du décaissement
  - Bénéficiaire : Nom du bénéficiaire (fournisseur)
  - Référence : Référence de l'ordre de paiement (optionnel)
  - Montant : Montant décaissé
  - Compte : Compte bancaire utilisé
```

**Explication :**
- Liste tous les décaissements sans filtre
- Permet de suivre les sorties de trésorerie
- Utilisé pour la comptabilité et les rapports financiers
- Peut être exporté en CSV/Excel/PDF

---

## 18. Reporting - Balance Âgée

### 18.1 Calcul des Jours de Retard

**Règle métier :** Calcule le nombre de jours de retard d'une facture impayée.

**Formule de calcul :**
```
Jours_retard = (Date_actuelle - Date_échéance) en jours
```

**Détails du calcul :**
```javascript
// Les jours de retard sont calculés et stockés dans agedBalance.daysOverdue
const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
```

**Explication :**
- Calculé uniquement pour les factures impayées
- Le résultat est arrondi à l'entier inférieur (floor)
- Utilisé pour prioriser les relances
- Affiché dans le rapport de balance âgée

**Exemple :**
- Date d'échéance : 2025-12-01
- Date actuelle : 2026-01-29
- Jours de retard : 59 jours

---

### 18.2 Liste de la Balance Âgée

**Règle métier :** Génère une liste des factures impayées avec leur nombre de jours de retard.

**Structure du rapport :**
```
Pour chaque facture impayée :
  - Client : Nom du client
  - Facture : Numéro de facture
  - Échéance : Date d'échéance
  - Montant : Montant de la facture
  - Jours de retard : Nombre de jours de retard
```

**Explication :**
- Liste uniquement les factures impayées
- Triée par nombre de jours de retard (décroissant)
- Permet d'identifier les créances les plus anciennes
- Utilisé pour la gestion du recouvrement

---

## 19. Recherche et Filtrage

### 19.1 Recherche de Paiements

**Règle métier :** Filtre les paiements selon le texte saisi dans la recherche.

**Critères de recherche :**
```
Recherche dans :
- Numéro de facture
- Nom de l'entreprise (client)
```

**Détails de la recherche :**
```javascript
const filteredPayments = payments.filter(p => 
  p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
  p.company.toLowerCase().includes(searchQuery.toLowerCase())
);
```

**Explication :**
- Recherche insensible à la casse
- Recherche dans le numéro de facture et le nom du client
- Recherche en temps réel (à chaque frappe)
- Permet de trouver rapidement un paiement

**Exemple :**
- Recherche "INV-2026" → Trouve toutes les factures commençant par "INV-2026"
- Recherche "Acme" → Trouve toutes les factures du client "Acme Corporation"

---

### 19.2 Filtrage par Statut

**Règle métier :** Filtre les paiements selon leur statut.

**Formule de filtrage :**
```
Paiements_filtrés = {
  Si filtre = 'all' : Tous les paiements
  Sinon : Paiements où status = filtre
}
```

**Détails du filtrage :**
```javascript
const filteredPayments = (filterStatus === 'all' 
  ? payments 
  : payments.filter(p => p.status === filterStatus))
  .filter(p => 
    p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.company.toLowerCase().includes(searchQuery.toLowerCase())
  );
```

**Explication :**
- Les statuts possibles sont : 'all', 'paid', 'pending', 'failed'
- Le filtre 'all' affiche tous les paiements sans distinction
- Permet de visualiser rapidement les paiements par état
- Combiné avec la recherche pour un filtrage précis

**Exemple :**
- Filtre 'paid' : Affiche uniquement les paiements confirmés
- Filtre 'pending' : Affiche uniquement les paiements en attente
- Filtre 'all' : Affiche tous les paiements

---

## 20. Gestion des Statuts

### 20.1 Statuts Disponibles

**Règle métier :** Un paiement peut avoir l'un des statuts suivants.

**Statuts possibles :**
- `paid` : Payé (confirmé)
- `pending` : En attente (en cours de traitement)
- `failed` : Échoué (paiement refusé)
- `refunded` : Remboursé

**Explication :**
- Chaque statut a une couleur et un libellé associés
- Les statuts déterminent les actions possibles
- Un paiement ne peut avoir qu'un seul statut à la fois
- Les statuts sont mutuellement exclusifs

---

### 20.2 Marquage comme Payé

**Règle métier :** Marque un paiement comme payé et enregistre la date de paiement.

**Règle de marquage :**
```
Lors du marquage comme payé :
  - status : Devient 'paid'
  - paidDate : Date actuelle
```

**Détails du marquage :**
```javascript
const handleMarkAsPaid = (id: number) => {
  setPayments(payments.map(p =>
    p.id === id ? { ...p, status: 'paid', paidDate: new Date().toISOString().split('T')[0] } : p
  ));
};
```

**Explication :**
- Permet de confirmer manuellement un paiement
- La date de paiement est enregistrée pour traçabilité
- Utilisé pour mettre à jour le statut après réception du paiement
- Format de date : YYYY-MM-DD

**Exemple :**
- Paiement : INV-2026-001, status 'pending'
- Après marquage : status 'paid', paidDate '2026-01-25'

---

## 21. Formatage et Affichage

### 21.1 Formatage des Montants

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
- Montant : 15000
- Formaté : €15 000

---

### 21.2 Formatage des Dates

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

## 22. Règles de Validation

### 22.1 Validation de la Création de Paiement

**Règle métier :** Un paiement ne peut être créé que si les champs obligatoires sont remplis.

**Conditions de validation :**
```
- Numéro de facture : Obligatoire (non vide)
- Entreprise : Obligatoire (non vide)
- Montant : Obligatoire (non vide et > 0)
```

**Détails de la validation :**
```javascript
if (newPaymentForm.invoiceNumber && newPaymentForm.company && newPaymentForm.amount) {
  // Création du paiement
}
```

**Explication :**
- Empêche la création de paiements incomplets
- Assure la cohérence des données
- Améliore la qualité des paiements générés

---

### 22.2 Génération de Référence Automatique

**Règle métier :** Génère automatiquement une référence unique pour chaque nouveau paiement.

**Formule de génération :**
```
Référence = "REF-" + Timestamp_actuel
```

**Détails de la génération :**
```javascript
reference: `REF-${Date.now()}`
```

**Explication :**
- La référence est générée automatiquement lors de la création
- Utilise le timestamp actuel pour garantir l'unicité
- Permet de tracer chaque paiement
- Format : REF-XXXXXXXXXXXX (timestamp en millisecondes)

**Exemple :**
- Timestamp : 1706198400000
- Référence : REF-1706198400000

---

## 23. Relevés Bancaires

### 23.1 Calcul de la Variation de Solde d'un Relevé

**Règle métier :** Calcule la variation de solde entre le solde d'ouverture et le solde de clôture d'un relevé.

**Formule de calcul :**
```
Variation_solde = Solde_clôture - Solde_ouverture
```

**Détails du calcul :**
```javascript
// La variation est implicite : closingBalance - openingBalance
```

**Explication :**
- Mesure l'évolution du solde sur la période du relevé
- Une variation positive indique une augmentation
- Une variation négative indique une diminution
- Utilisé pour vérifier la cohérence du relevé

**Exemple :**
- Solde d'ouverture : €200,000
- Solde de clôture : €250,000
- Variation : €250,000 - €200,000 = +€50,000

---

### 23.2 Import de Relevés

**Règle métier :** Importe un relevé bancaire depuis un fichier CSV ou MT940.

**Formats supportés :**
- CSV (Comma-Separated Values)
- MT940 (Format bancaire standard)

**Explication :**
- Permet d'importer automatiquement les transactions bancaires
- Facilite le rapprochement bancaire
- Réduit les erreurs de saisie manuelle
- Les transactions sont extraites et stockées pour rapprochement

---

## 24. Calculs de Progression

### 24.1 Progression Visuelle de l'Échéancier

**Règle métier :** Affiche une barre de progression pour visualiser l'avancement d'un échéancier.

**Formule de calcul :**
```
Largeur_barre = (Tranches_payées / Nombre_total_tranches) × 100%
```

**Détails du calcul :**
```javascript
style={{ width: `${(schedule.paidInstallments / schedule.numberOfInstallments) * 100}%` }}
```

**Explication :**
- La largeur de la barre est proportionnelle à la progression
- Utilisé pour visualiser rapidement l'état d'un échéancier
- Améliore l'expérience utilisateur
- Format : pourcentage (0-100%)

**Exemple :**
- Tranches payées : 1
- Nombre total : 3
- Largeur barre : (1 / 3) × 100% = 33.3%

---

## Conclusion

Ce document recense toutes les règles métier identifiées dans la page Paiements. Ces règles régissent les calculs financiers, la gestion des paiements partiels, les trop-perçus, le rapprochement bancaire, la gestion des fournisseurs, les échéanciers, les comptes bancaires, les caisses, les soldes temps réel, les prévisions, les relevés bancaires, les rapports et toutes les fonctionnalités liées aux paiements dans le CRM.

Pour toute question ou clarification sur ces règles, veuillez consulter le code source dans `src/app/components/Payments.tsx`.

