# Règles Métier de la Page Comptabilité

Ce document liste toutes les règles métier, formules de calcul et explications identifiées dans la page Comptabilité du CRM.

---

## 1. Calculs de Transactions

### 1.1 Total des Transactions

**Règle métier :** Calcule le montant total de toutes les transactions filtrées.

**Formule de calcul :**
```
Total_transactions = Σ(Montant de toutes les transactions filtrées)
```

**Détails du calcul :**
```javascript
const totalAmount = filteredData.reduce((sum, t) => sum + t.amount, 0);
```

**Explication :**
- Somme de tous les montants des transactions après filtrage
- Utilisé pour les onglets : Ventes, Achats, Dépenses, Recettes
- Formaté avec séparateurs de milliers
- Représente le volume total d'activité

**Exemple :**
- Transaction 1 : €15,000
- Transaction 2 : €8,500
- Transaction 3 : €22,000
- Total : €45,500

---

### 1.2 Montant Complété

**Règle métier :** Calcule le montant total des transactions avec le statut 'completed'.

**Formule de calcul :**
```
Montant_complété = Σ(Montant des transactions où status = 'completed')
```

**Détails du calcul :**
```javascript
const completedAmount = filteredData
  .filter(t => t.status === 'completed')
  .reduce((sum, t) => sum + t.amount, 0);
```

**Explication :**
- Seules les transactions complétées sont comptabilisées
- Représente les transactions finalisées
- Utilisé pour mesurer l'activité réalisée
- Formaté avec séparateurs de milliers

**Exemple :**
- Transaction 1 : €15,000 (complétée)
- Transaction 2 : €8,500 (complétée)
- Transaction 3 : €5,500 (complétée)
- Montant complété : €29,000

---

### 1.3 Montant en Attente

**Règle métier :** Calcule le montant total des transactions avec le statut 'pending'.

**Formule de calcul :**
```
Montant_en_attente = Σ(Montant des transactions où status = 'pending')
```

**Détails du calcul :**
```javascript
const pendingAmount = filteredData
  .filter(t => t.status === 'pending')
  .reduce((sum, t) => sum + t.amount, 0);
```

**Explication :**
- Transactions en cours de traitement
- Représente les transactions non finalisées
- Utilisé pour suivre les transactions en attente
- Formaté avec séparateurs de milliers

**Exemple :**
- Transaction 1 : €22,000 (en attente)
- Montant en attente : €22,000

---

## 2. Balance Générale

### 2.1 Calcul du Débit d'un Compte

**Règle métier :** Calcule le total des débits pour un compte comptable.

**Formule de calcul :**
```
Débit_compte = Σ(Montant des écritures où compte = compte_cible ET type = 'debit')
```

**Détails du calcul :**
```javascript
// Pour le compte 701 (Ventes)
const debit = data.sales.reduce((s, t) => s + t.amount, 0);
```

**Explication :**
- Les ventes sont enregistrées au débit du compte 701
- Le débit représente les entrées pour les comptes d'actif et de charges
- Formaté avec séparateurs de milliers

**Exemple :**
- Vente 1 : €15,000
- Vente 2 : €8,500
- Vente 3 : €22,000
- Débit compte 701 : €45,500

---

### 2.2 Calcul du Crédit d'un Compte

**Règle métier :** Calcule le total des crédits pour un compte comptable.

**Formule de calcul :**
```
Crédit_compte = Σ(Montant des écritures où compte = compte_cible ET type = 'credit')
```

**Détails du calcul :**
```javascript
// Pour le compte 801 (Achats)
const credit = data.purchases.reduce((s, t) => s + t.amount, 0);
```

**Explication :**
- Les achats sont enregistrés au crédit du compte 801
- Le crédit représente les sorties pour les comptes d'actif et de charges
- Formaté avec séparateurs de milliers

**Exemple :**
- Achat 1 : €2,000
- Achat 2 : €500
- Achat 3 : €5,000
- Crédit compte 801 : €7,500

---

### 2.3 Structure de la Balance Générale

**Règle métier :** La balance générale présente tous les comptes avec leurs débits et crédits.

**Structure :**
```
Pour chaque compte :
  - Compte : Numéro du compte
  - Intitulé : Libellé du compte
  - Débit : Total des débits
  - Crédit : Total des crédits
```

**Explication :**
- Permet de vérifier l'équilibre comptable (Total Débits = Total Crédits)
- Utilisé pour la révision comptable
- Formaté avec séparateurs de milliers

---

## 3. Compte de Résultat

### 3.1 Chiffre d'Affaires

**Règle métier :** Calcule le total des ventes réalisées.

**Formule de calcul :**
```
Chiffre_d'affaires = Σ(Montant de toutes les ventes)
```

**Détails du calcul :**
```javascript
const chiffreAffaires = data.sales.reduce((s, t) => s + t.amount, 0);
```

**Explication :**
- Somme de toutes les ventes enregistrées
- Représente les revenus générés
- Utilisé pour mesurer la performance commerciale
- Formaté avec séparateurs de milliers

**Exemple :**
- Vente 1 : €15,000
- Vente 2 : €8,500
- Vente 3 : €22,000
- Chiffre d'affaires : €45,500

---

### 3.2 Charges Totales

**Règle métier :** Calcule le total des charges (achats + dépenses).

**Formule de calcul :**
```
Charges_totales = Total_achats + Total_dépenses
```

**Détails du calcul :**
```javascript
const charges = data.purchases.reduce((s, t) => s + t.amount, 0) + 
                data.expenses.reduce((s, t) => s + t.amount, 0);
```

**Explication :**
- Somme des achats et des dépenses
- Représente les coûts totaux
- Utilisé pour calculer le résultat net
- Formaté avec séparateurs de milliers

**Exemple :**
- Total achats : €7,500
- Total dépenses : €4,950
- Charges totales : €12,450

---

### 3.3 Résultat Net

**Règle métier :** Calcule le résultat net (bénéfice ou perte).

**Formule de calcul :**
```
Résultat_net = Chiffre_d'affaires - Charges_totales
```

**Détails du calcul :**
```javascript
const resultatNet = data.sales.reduce((s, t) => s + t.amount, 0) - 
                    data.purchases.reduce((s, t) => s + t.amount, 0) - 
                    data.expenses.reduce((s, t) => s + t.amount, 0);
```

**Explication :**
- Différence entre les revenus et les charges
- Un résultat positif indique un bénéfice
- Un résultat négatif indique une perte
- Formaté avec séparateurs de milliers

**Exemple :**
- Chiffre d'affaires : €45,500
- Charges totales : €12,450
- Résultat net : €45,500 - €12,450 = €33,050

---

## 4. Balance Auxiliaire

### 4.1 Calcul du Solde Final

**Règle métier :** Calcule le solde final d'un tiers (client ou fournisseur).

**Formule de calcul :**
```
Solde_final = Solde_initial + Débit - Crédit
```

**Détails du calcul :**
```javascript
// Pour un client
const soldeFinal = soldeInit + debit - credit;
```

**Explication :**
- Le solde initial est le solde au début de la période
- Le débit augmente le solde (créances clients)
- Le crédit diminue le solde (paiements clients)
- Formaté avec séparateurs de milliers

**Exemple :**
- Solde initial : €5,000
- Débit : €15,000
- Crédit : €0
- Solde final : €5,000 + €15,000 - €0 = €20,000

---

### 4.2 Solde Final pour un Fournisseur

**Règle métier :** Pour un fournisseur, le solde est généralement négatif (dette).

**Formule de calcul :**
```
Solde_final_fournisseur = Solde_initial + Crédit - Débit
```

**Détails du calcul :**
```javascript
// Pour un fournisseur
const soldeFinal = soldeInit + credit - debit;
```

**Explication :**
- Le solde initial est généralement négatif (dette)
- Le crédit augmente la dette (nouvelles factures)
- Le débit diminue la dette (paiements)
- Formaté avec séparateurs de milliers et signe

**Exemple :**
- Solde initial : -€3,000
- Débit : €0
- Crédit : €5,000
- Solde final : -€3,000 + €5,000 - €0 = €2,000

---

### 4.3 Affichage du Solde Final

**Règle métier :** Le solde final est affiché avec une couleur selon son signe.

**Règle d'affichage :**
```
Si Solde_final >= 0 :
  Couleur : Vert
Sinon :
  Couleur : Rouge
```

**Détails de l'affichage :**
```javascript
<td className={`px-4 py-3 text-right font-semibold ${entry.soldeFinal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
  {entry.soldeFinal.toLocaleString()}€
</td>
```

**Explication :**
- Les soldes positifs (créances) sont affichés en vert
- Les soldes négatifs (dettes) sont affichés en rouge
- Améliore la lisibilité et la compréhension rapide

---

## 5. Bilan Comptable

### 5.1 Total Actif

**Règle métier :** Calcule la somme de tous les éléments d'actif.

**Formule de calcul :**
```
Total_actif = Actif_immobilisé + Actif_circulant
```

**Détails du calcul :**
```javascript
// Actif immobilisé
const actifImmobilise = immobilisationsIncorporelles + 
                        immobilisationsCorporelles + 
                        immobilisationsFinancieres;

// Actif circulant
const actifCirculant = stocks + creancesClients + disponibilites;

// Total actif
const totalActif = actifImmobilise + actifCirculant;
```

**Explication :**
- L'actif représente ce que l'entreprise possède
- L'actif immobilisé comprend les biens durables
- L'actif circulant comprend les biens à court terme
- Formaté avec séparateurs de milliers

**Exemple :**
- Actif immobilisé : €70,000
- Actif circulant : €74,000
- Total actif : €144,000

---

### 5.2 Total Passif

**Règle métier :** Calcule la somme de tous les éléments de passif.

**Formule de calcul :**
```
Total_passif = Capitaux_propres + Dettes
```

**Détails du calcul :**
```javascript
// Capitaux propres
const capitauxPropres = capitalSocial + reserves + resultatExercice;

// Dettes
const dettes = dettesFournisseurs + dettesFiscales + dettesSociales;

// Total passif
const totalPassif = capitauxPropres + dettes;
```

**Explication :**
- Le passif représente les ressources de l'entreprise
- Les capitaux propres sont les fonds apportés par les actionnaires
- Les dettes sont les obligations envers les tiers
- Formaté avec séparateurs de milliers

**Exemple :**
- Capitaux propres : €94,000
- Dettes : €50,000
- Total passif : €144,000

---

### 5.3 Équilibre du Bilan

**Règle métier :** Le bilan doit être équilibré (Total Actif = Total Passif).

**Formule de vérification :**
```
Total_actif = Total_passif
```

**Explication :**
- Principe fondamental de la comptabilité en partie double
- Si les totaux ne sont pas égaux, il y a une erreur comptable
- Utilisé pour valider la cohérence des écritures

**Exemple :**
- Total actif : €144,000
- Total passif : €144,000
- Bilan équilibré : ✓

---

## 6. Journal de Banque

### 6.1 Calcul du Solde Bancaire

**Règle métier :** Calcule le solde bancaire après chaque écriture.

**Formule de calcul :**
```
Solde = Solde_précédent + Débit - Crédit
```

**Détails du calcul :**
```javascript
// Pour chaque écriture
const solde = soldePrecedent + entry.debit - entry.credit;
```

**Explication :**
- Le solde est calculé séquentiellement
- Les débits augmentent le solde (encaissements)
- Les crédits diminuent le solde (décaissements)
- Formaté avec séparateurs de milliers

**Exemple :**
- Solde initial : €0
- Écriture 1 : Débit €15,000, Crédit €0 → Solde : €15,000
- Écriture 2 : Débit €0, Crédit €5,000 → Solde : €10,000
- Écriture 3 : Débit €8,500, Crédit €0 → Solde : €18,500

---

## 7. Journal de Caisse

### 7.1 Solde Initial de Caisse

**Règle métier :** Le solde initial est le solde en espèces au début de la période.

**Formule :**
```
Solde_initial = Solde_en_espèces_au_début
```

**Explication :**
- Représente l'encaisse de départ
- Utilisé comme point de départ pour les calculs
- Formaté avec séparateurs de milliers

**Exemple :**
- Solde initial : €500

---

### 7.2 Total des Encaissements

**Règle métier :** Calcule le total des encaissements en espèces.

**Formule de calcul :**
```
Total_encaissements = Σ(Montant des écritures où type = 'encaissement')
```

**Détails du calcul :**
```javascript
// Somme de tous les débits (encaissements)
const totalEncaissements = entries
  .filter(e => e.debit > 0)
  .reduce((sum, e) => sum + e.debit, 0);
```

**Explication :**
- Somme de tous les débits (entrées d'argent)
- Représente les recettes en espèces
- Formaté avec séparateurs de milliers

**Exemple :**
- Encaissement 1 : €500
- Encaissement 2 : €750
- Total encaissements : €1,250

---

### 7.3 Total des Décaissements

**Règle métier :** Calcule le total des décaissements en espèces.

**Formule de calcul :**
```
Total_décaissements = Σ(Montant des écritures où type = 'décaissement')
```

**Détails du calcul :**
```javascript
// Somme de tous les crédits (décaissements)
const totalDecaissements = entries
  .filter(e => e.credit > 0)
  .reduce((sum, e) => sum + e.credit, 0);
```

**Explication :**
- Somme de tous les crédits (sorties d'argent)
- Représente les dépenses en espèces
- Formaté avec séparateurs de milliers

**Exemple :**
- Décaissement 1 : €200
- Total décaissements : €200

---

### 7.4 Solde Final de Caisse

**Règle métier :** Calcule le solde final de caisse.

**Formule de calcul :**
```
Solde_final = Solde_initial + Total_encaissements - Total_décaissements
```

**Détails du calcul :**
```javascript
const soldeFinal = soldeInitial + totalEncaissements - totalDecaissements;
```

**Explication :**
- Le solde final représente l'encaisse en fin de période
- Utilisé pour le contrôle de caisse
- Formaté avec séparateurs de milliers

**Exemple :**
- Solde initial : €500
- Total encaissements : €1,250
- Total décaissements : €200
- Solde final : €500 + €1,250 - €200 = €1,550

---

## 8. Gestion de la TVA

### 8.1 TVA Collectée

**Règle métier :** Calcule la TVA collectée sur les ventes.

**Formule de calcul :**
```
TVA_collectée = Σ(TVA sur toutes les ventes)
```

**Détails du calcul :**
```javascript
// La TVA collectée est calculée sur les ventes
// TVA = Montant_HT × Taux_TVA / 100
const tvaCollectee = ventes.reduce((sum, v) => {
  const tva = v.montantHT * (v.tauxTVA / 100);
  return sum + tva;
}, 0);
```

**Explication :**
- TVA facturée aux clients sur les ventes
- Représente une dette envers l'État
- Utilisé pour la déclaration de TVA
- Formaté avec séparateurs de milliers

**Exemple :**
- Vente 1 : €15,000 HT, TVA 20% → €3,000
- Vente 2 : €8,500 HT, TVA 20% → €1,700
- TVA collectée : €4,700

---

### 8.2 TVA Déductible

**Règle métier :** Calcule la TVA déductible sur les achats.

**Formule de calcul :**
```
TVA_déductible = Σ(TVA sur tous les achats)
```

**Détails du calcul :**
```javascript
// La TVA déductible est calculée sur les achats
// TVA = Montant_HT × Taux_TVA / 100
const tvaDeductible = achats.reduce((sum, a) => {
  const tva = a.montantHT * (a.tauxTVA / 100);
  return sum + tva;
}, 0);
```

**Explication :**
- TVA payée aux fournisseurs sur les achats
- Représente un crédit de TVA
- Peut être déduite de la TVA collectée
- Formaté avec séparateurs de milliers

**Exemple :**
- Achat 1 : €2,000 HT, TVA 20% → €400
- Achat 2 : €500 HT, TVA 20% → €100
- TVA déductible : €500

---

### 8.3 TVA à Payer

**Règle métier :** Calcule la TVA nette à payer à l'État.

**Formule de calcul :**
```
TVA_à_payer = TVA_collectée - TVA_déductible
```

**Détails du calcul :**
```javascript
const tvaAPayer = tvaCollectee - tvaDeductible;
```

**Explication :**
- Différence entre la TVA collectée et la TVA déductible
- Si positif : TVA à payer
- Si négatif : Crédit de TVA (à reporter ou à rembourser)
- Formaté avec séparateurs de milliers

**Exemple :**
- TVA collectée : €3,000
- TVA déductible : €1,200
- TVA à payer : €3,000 - €1,200 = €1,800

---

### 8.4 Crédit de TVA

**Règle métier :** Calcule le crédit de TVA si la TVA déductible dépasse la TVA collectée.

**Formule de calcul :**
```
Si TVA_déductible > TVA_collectée :
  Crédit_TVA = TVA_déductible - TVA_collectée
Sinon :
  Crédit_TVA = 0
```

**Détails du calcul :**
```javascript
const creditTVA = tvaDeductible > tvaCollectee 
  ? tvaDeductible - tvaCollectee 
  : 0;
```

**Explication :**
- Un crédit de TVA apparaît quand les achats dépassent les ventes
- Peut être reporté sur les périodes suivantes
- Peut être remboursé dans certains cas
- Formaté avec séparateurs de milliers

**Exemple :**
- TVA collectée : €1,000
- TVA déductible : €1,500
- Crédit de TVA : €1,500 - €1,000 = €500

---

## 9. Comptabilité Analytique

### 9.1 Calcul de l'Écart Budgétaire

**Règle métier :** Calcule l'écart entre le budget et le réel pour un centre de coût.

**Formule de calcul :**
```
Écart = Réel - Budget
```

**Détails du calcul :**
```javascript
const ecart = centre.reel - centre.budget;
```

**Explication :**
- Un écart négatif indique un sous-budget (économie)
- Un écart positif indique un dépassement budgétaire
- Utilisé pour le contrôle de gestion
- Formaté avec séparateurs de milliers et signe

**Exemple :**
- Budget : €50,000
- Réel : €48,500
- Écart : €48,500 - €50,000 = -€1,500 (sous-budget)

---

### 9.2 Affichage de l'Écart

**Règle métier :** L'écart est affiché avec une couleur selon son signe.

**Règle d'affichage :**
```
Si Écart < 0 :
  Couleur : Vert (sous-budget)
  Badge : "Sous budget"
Sinon :
  Couleur : Rouge (dépassement)
  Badge : "Dépassement"
```

**Détails de l'affichage :**
```javascript
<Badge className={centre.ecart < 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
  {centre.ecart < 0 ? 'Sous budget' : 'Dépassement'}
</Badge>
```

**Explication :**
- Les écarts négatifs (économies) sont affichés en vert
- Les écarts positifs (dépassements) sont affichés en rouge
- Améliore la compréhension rapide de la performance

---

## 10. Inventaire

### 10.1 Calcul de l'Écart de Quantité

**Règle métier :** Calcule la différence entre la quantité réelle et la quantité théorique.

**Formule de calcul :**
```
Écart_quantité = Quantité_réelle - Quantité_théorique
```

**Détails du calcul :**
```javascript
const ecart = article.qteReel - article.qteTheo;
```

**Explication :**
- Un écart positif indique un surplus
- Un écart négatif indique un manquant
- Un écart nul indique une conformité
- Utilisé pour identifier les écarts d'inventaire

**Exemple :**
- Quantité théorique : 100
- Quantité réelle : 98
- Écart : 98 - 100 = -2 (manquant de 2 unités)

---

### 10.2 Affichage de l'Écart d'Inventaire

**Règle métier :** L'écart est affiché avec une couleur selon sa valeur.

**Règle d'affichage :**
```
Si Écart = 0 :
  Couleur : Gris (conforme)
Sinon si Écart > 0 :
  Couleur : Vert (surplus)
Sinon :
  Couleur : Rouge (manquant)
```

**Détails de l'affichage :**
```javascript
<td className={`px-4 py-3 text-right font-semibold ${
  ecart === 0 ? 'text-gray-600' : 
  ecart > 0 ? 'text-green-600' : 
  'text-red-600'
}`}>
  {ecart > 0 ? '+' : ''}{ecart}
</td>
```

**Explication :**
- Les écarts nuls sont affichés en gris
- Les surplus sont affichés en vert avec un signe +
- Les manquants sont affichés en rouge avec un signe -

---

### 10.3 Calcul de la Valeur d'Inventaire

**Règle métier :** Calcule la valeur totale d'un article d'inventaire.

**Formule de calcul :**
```
Valeur = Quantité_réelle × Valeur_unitaire
```

**Détails du calcul :**
```javascript
const valeur = article.qteReel * article.valeurUnitaire;
```

**Explication :**
- La valeur est basée sur la quantité réelle
- Utilisée pour l'évaluation du stock
- Formaté avec séparateurs de milliers

**Exemple :**
- Quantité réelle : 98
- Valeur unitaire : €50
- Valeur : 98 × €50 = €4,900

---

## 11. Affectation du Résultat

### 11.1 Répartition du Résultat

**Règle métier :** Le résultat net peut être affecté à différentes destinations.

**Destinations possibles :**
- Report à nouveau
- Réserves légales
- Réserves statutaires
- Dividendes

**Formule de vérification :**
```
Total_affectation = Report_à_nouveau + Réserves_légales + Réserves_statutaires + Dividendes
Total_affectation = Résultat_net
```

**Explication :**
- Le total des affectations doit égaler le résultat net
- Permet de répartir le bénéfice
- Utilisé pour la clôture de l'exercice

**Exemple :**
- Résultat net : €19,000
- Report à nouveau : €5,000
- Réserves légales : €2,000
- Réserves statutaires : €3,000
- Dividendes : €9,000
- Total : €19,000 ✓

---

### 11.2 Calcul du Report à Nouveau

**Règle métier :** Calcule le report à nouveau à partir du résultat de l'exercice précédent.

**Formule de calcul :**
```
Report_à_nouveau = Résultat_exercice_précédent - Dividendes_distribués
```

**Détails du calcul :**
```javascript
const reportANouveau = resultatExercicePrecedent - dividendesDistribues;
```

**Explication :**
- Le report à nouveau est le résultat non distribué
- Peut être débiteur (perte) ou créditeur (bénéfice)
- Reporté sur l'exercice suivant
- Formaté avec séparateurs de milliers et signe

**Exemple :**
- Résultat exercice 2025 : €15,000
- Dividendes distribués : €10,000
- Report à nouveau : €15,000 - €10,000 = €5,000

---

## 12. Lettrage Comptable

### 12.1 Statut de Lettrage

**Règle métier :** Un tiers peut avoir différents statuts de lettrage.

**Statuts possibles :**
- `lettré` : Toutes les écritures sont appariées (solde = 0)
- `partiel` : Certaines écritures sont appariées (solde ≠ 0)
- `non lettré` : Aucune écriture n'est appariée

**Explication :**
- Le lettrage permet d'apparier les créances et les dettes
- Un solde de 0 indique un lettrage complet
- Utilisé pour la réconciliation comptable

---

### 12.2 Affichage du Solde de Lettrage

**Règle métier :** Le solde est affiché avec une couleur selon sa valeur.

**Règle d'affichage :**
```
Si Solde = 0 :
  Couleur : Vert (lettré)
Sinon si Solde > 0 :
  Couleur : Bleu (créance)
Sinon :
  Couleur : Rouge (dette)
```

**Détails de l'affichage :**
```javascript
<p className={`font-semibold ${
  lettrage.solde === 0 ? 'text-green-600' : 
  lettrage.solde > 0 ? 'text-blue-600' : 
  'text-red-600'
}`}>
  {lettrage.solde.toLocaleString()}€
</p>
```

**Explication :**
- Un solde de 0 (lettré) est affiché en vert
- Les créances (solde positif) sont affichées en bleu
- Les dettes (solde négatif) sont affichées en rouge

---

## 13. Rapports et Statistiques

### 13.1 Moyenne Quotidienne

**Règle métier :** Calcule la moyenne quotidienne des revenus.

**Formule de calcul :**
```
Moyenne_quotidienne = (Total_ventes + Total_recettes) / Nombre_jours
```

**Détails du calcul :**
```javascript
const moyenneQuotidienne = Math.round(
  (data.sales.reduce((s, t) => s + t.amount, 0) + 
   data.receipts.reduce((s, t) => s + t.amount, 0)) / 29
);
```

**Explication :**
- Divise le total des revenus par le nombre de jours du mois
- Utilisé pour mesurer la performance quotidienne
- Arrondi à l'entier le plus proche
- Formaté avec séparateurs de milliers

**Exemple :**
- Total ventes : €45,500
- Total recettes : €6,150
- Nombre de jours : 29
- Moyenne quotidienne : (€45,500 + €6,150) / 29 = €1,780

---

### 13.2 Nombre Total de Transactions

**Règle métier :** Compte le nombre total de transactions sur une période.

**Formule de calcul :**
```
Nombre_transactions = Nombre_ventes + Nombre_achats + Nombre_dépenses + Nombre_recettes
```

**Détails du calcul :**
```javascript
const nombreTransactions = data.sales.length + 
                           data.purchases.length + 
                           data.expenses.length + 
                           data.receipts.length;
```

**Explication :**
- Somme de toutes les transactions de tous types
- Utilisé pour mesurer l'activité globale
- Formaté sans séparateurs (nombre entier)

**Exemple :**
- Ventes : 4 transactions
- Achats : 4 transactions
- Dépenses : 5 transactions
- Recettes : 3 transactions
- Total : 16 transactions

---

### 13.3 Analyse par Catégorie

**Règle métier :** Calcule le montant total par catégorie de transaction.

**Formule de calcul :**
```
Montant_catégorie = Σ(Montant des transactions où category = catégorie_cible)
```

**Détails du calcul :**
```javascript
const montantCategorie = transactions
  .filter(t => t.category === categorie)
  .reduce((sum, t) => sum + t.amount, 0);
```

**Explication :**
- Permet d'analyser la répartition des transactions
- Utilisé pour identifier les catégories principales
- Formaté avec séparateurs de milliers

**Exemple :**
- Catégorie "Software" : €17,500
- Catégorie "Services" : €12,200
- Catégorie "Produits" : €22,000

---

### 13.4 Pourcentage par Catégorie

**Règle métier :** Calcule le pourcentage représenté par chaque catégorie.

**Formule de calcul :**
```
Pourcentage_catégorie = (Montant_catégorie / Total_général) × 100
```

**Détails du calcul :**
```javascript
const pourcentage = (cat.value / totalGeneral) * 100;
```

**Explication :**
- Utilisé pour afficher une barre de progression
- Permet de visualiser la répartition relative
- Formaté en pourcentage (0-100%)

**Exemple :**
- Montant catégorie : €17,500
- Total général : €57,200
- Pourcentage : (€17,500 / €57,200) × 100 = 30.6%

---

## 14. Grand Livre

### 14.1 Structure du Grand Livre

**Règle métier :** Le grand livre présente toutes les écritures comptables.

**Structure :**
```
Pour chaque écriture :
  - Date : Date de l'écriture
  - Compte : Numéro du compte
  - Débit : Montant au débit (si applicable)
  - Crédit : Montant au crédit (si applicable)
  - Libellé : Description de l'écriture
```

**Explication :**
- Permet de suivre toutes les écritures par compte
- Utilisé pour la traçabilité comptable
- Formaté avec séparateurs de milliers

---

## 15. Écritures Automatiques

### 15.1 Fréquences Disponibles

**Règle métier :** Une écriture automatique peut être programmée à différentes fréquences.

**Fréquences possibles :**
- Quotidien
- Hebdomadaire
- Mensuel
- Trimestriel
- Semestriel
- Annuel

**Explication :**
- Permet d'automatiser les écritures récurrentes
- Réduit les erreurs de saisie
- Améliore l'efficacité comptable

---

### 15.2 Montant Variable

**Règle métier :** Une écriture automatique peut avoir un montant fixe ou variable.

**Règle :**
```
Si Montant = 0 :
  Montant : Variable (calculé dynamiquement)
Sinon :
  Montant : Fixe (utilisé tel quel)
```

**Explication :**
- Un montant de 0 indique un calcul dynamique
- Un montant > 0 indique un montant fixe
- Permet de gérer différents types d'écritures automatiques

---

## 16. Contre-Passation

### 16.1 Principe de Contre-Passation

**Règle métier :** La contre-passation annule une écriture en créant une écriture inverse.

**Règle :**
```
Pour annuler une écriture :
  - Créer une nouvelle écriture avec :
    - Débit = Crédit_original
    - Crédit = Débit_original
    - Montant = Montant_original
```

**Explication :**
- Permet d'annuler une écriture erronée
- Conserve l'historique comptable
- Action irréversible (doit être validée)

---

## 17. Recherche et Filtrage

### 17.1 Recherche de Transactions

**Règle métier :** Filtre les transactions selon le texte saisi.

**Critères de recherche :**
```
Recherche dans :
- Description
- Catégorie
- Référence
```

**Détails de la recherche :**
```javascript
const filteredData = currentData.filter(t =>
  t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
  t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
  t.reference.toLowerCase().includes(searchQuery.toLowerCase())
);
```

**Explication :**
- Recherche insensible à la casse
- Recherche dans plusieurs champs simultanément
- Recherche en temps réel

---

## 18. Génération de Référence

### 18.1 Génération Automatique de Référence

**Règle métier :** Génère automatiquement une référence unique pour chaque transaction.

**Formule de génération :**
```
Référence = Préfixe_onglet + "-" + Timestamp
```

**Détails de la génération :**
```javascript
reference: `${activeTab.substring(0, 3).toUpperCase()}-${Date.now()}`
```

**Explication :**
- Le préfixe est basé sur l'onglet actif (SAL, PUR, EXP, REC)
- Le timestamp garantit l'unicité
- Format : XXX-XXXXXXXXXXXX

**Exemple :**
- Onglet : "sales"
- Timestamp : 1706198400000
- Référence : SAL-1706198400000

---

## 19. Validation des Écritures

### 19.1 Principe de la Partie Double

**Règle métier :** Chaque écriture doit respecter le principe de la partie double.

**Règle :**
```
Pour chaque écriture :
  - Total_Débits = Total_Crédits
  - Au moins un compte au débit
  - Au moins un compte au crédit
```

**Explication :**
- Principe fondamental de la comptabilité
- Garantit l'équilibre des écritures
- Empêche les erreurs de saisie

---

### 19.2 Validation des Champs Obligatoires

**Règle métier :** Certains champs sont obligatoires pour créer une transaction.

**Champs obligatoires :**
- Date
- Description
- Montant
- Catégorie (pour les transactions simples)

**Explication :**
- Empêche la création de transactions incomplètes
- Assure la cohérence des données
- Améliore la qualité des écritures

---

## 20. Formatage et Affichage

### 20.1 Formatage des Montants

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
- Utilise le format français (espace comme séparateur)
- Améliore la lisibilité
- Cohérent avec les standards français

**Exemple :**
- Montant : 15000
- Formaté : €15 000

---

### 20.2 Formatage des Dates

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

## 21. Journal des Opérations Diverses (OD)

### 21.1 Structure des Opérations Diverses

**Règle métier :** Les opérations diverses regroupent toutes les écritures qui ne sont pas des ventes, achats, banque ou caisse.

**Structure :**
```
Pour chaque écriture OD :
  - Date : Date de l'écriture
  - Pièce : Numéro de pièce (OD-XXX)
  - Compte : Numéro du compte comptable
  - Libellé : Description de l'opération
  - Débit : Montant au débit (si applicable)
  - Crédit : Montant au crédit (si applicable)
```

**Explication :**
- Permet d'enregistrer des opérations spécifiques
- Utilisé pour les avoirs, virements internes, régularisations
- Respecte le principe de la partie double
- Formaté avec séparateurs de milliers

---

## 22. Solde Net dans les Rapports

### 22.1 Calcul du Solde Net Mensuel

**Règle métier :** Calcule le solde net (bénéfice ou perte) pour une période donnée.

**Formule de calcul :**
```
Solde_net = Total_ventes - Total_achats - Total_dépenses
```

**Détails du calcul :**
```javascript
const soldeNet = data.sales.reduce((s, t) => s + t.amount, 0) - 
                 data.purchases.reduce((s, t) => s + t.amount, 0) - 
                 data.expenses.reduce((s, t) => s + t.amount, 0);
```

**Explication :**
- Différence entre les revenus et les charges
- Utilisé dans les rapports mensuels
- Formaté avec séparateurs de milliers
- Affiché en vert si positif, en rouge si négatif

**Exemple :**
- Total ventes : €45,500
- Total achats : €7,500
- Total dépenses : €4,950
- Solde net : €45,500 - €7,500 - €4,950 = €33,050

---

## 23. Tendances et Croissance

### 23.1 Calcul de la Croissance

**Règle métier :** Calcule le pourcentage de croissance par rapport à la période précédente.

**Formule de calcul :**
```
Croissance = ((Valeur_période_actuelle - Valeur_période_précédente) / Valeur_période_précédente) × 100
```

**Détails du calcul :**
```javascript
// Exemple de calcul de croissance
const croissance = ((valeurActuelle - valeurPrecedente) / valeurPrecedente) * 100;
```

**Explication :**
- Mesure l'évolution de l'activité
- Un pourcentage positif indique une croissance
- Un pourcentage négatif indique une décroissance
- Formaté avec un signe + pour les valeurs positives

**Exemple :**
- Période précédente : €40,000
- Période actuelle : €46,200
- Croissance : ((€46,200 - €40,000) / €40,000) × 100 = +15.5%

---

## 24. Acomptes IS/IR

### 24.1 Calcul des Acomptes d'Impôt

**Règle métier :** Les acomptes d'impôt sont calculés en fonction du résultat de l'exercice précédent.

**Formule de calcul :**
```
Acompte_IS = (Résultat_exercice_précédent × Taux_IS) / 4
```

**Détails du calcul :**
```javascript
// Les acomptes sont généralement calculés en 4 versements égaux
const acompte = (resultatExercicePrecedent * tauxIS) / 4;
```

**Explication :**
- Les acomptes IS sont payés en 4 versements (15 mars, 15 juin, 15 septembre, 15 décembre)
- Basés sur le résultat de l'exercice précédent
- Utilisés pour l'impôt sur les sociétés (IS) ou l'impôt sur le revenu (IR)
- Formaté avec séparateurs de milliers

**Exemple :**
- Résultat exercice 2025 : €80,000
- Taux IS : 25%
- Impôt dû : €80,000 × 25% = €20,000
- Acompte : €20,000 / 4 = €5,000 par trimestre

---

### 24.2 Statuts des Acomptes

**Règle métier :** Un acompte peut avoir différents statuts selon son échéance.

**Statuts possibles :**
- `à venir` : Échéance future
- `à payer` : Échéance proche ou dépassée
- `payé` : Acompte réglé

**Explication :**
- Permet de suivre l'état des acomptes
- Utilisé pour la gestion fiscale
- Aide à planifier les paiements

---

## 25. Liasse Fiscale

### 25.1 Structure de la Liasse Fiscale

**Règle métier :** La liasse fiscale regroupe tous les formulaires fiscaux requis.

**Formulaires principaux :**
- 2050 : Bilan (actif)
- 2051 : Bilan (passif)
- 2052 : Compte de résultat
- 2053 : Annexes
- 2054 : Tableau des immobilisations
- 2055 : Tableau des amortissements

**Explication :**
- Obligatoire pour les déclarations fiscales
- Chaque formulaire doit être complété
- Utilisé pour la déclaration d'impôts
- Peut être exporté en PDF

---

### 25.2 Statut de Complétion

**Règle métier :** Chaque formulaire peut avoir un statut de complétion.

**Statuts possibles :**
- `Complété` : Formulaire entièrement rempli
- `À compléter` : Formulaire incomplet

**Explication :**
- Permet de suivre l'avancement de la liasse
- Utilisé pour identifier les formulaires manquants
- Aide à finaliser la déclaration fiscale

---

## 26. Plans Comptables

### 26.1 Plan Comptable SYSCOHADA

**Règle métier :** Le plan comptable SYSCOHADA est utilisé pour les entreprises en zone OHADA.

**Structure :**
```
Pour chaque compte :
  - Compte : Numéro du compte
  - Intitulé : Libellé du compte
  - Type : Actif, Passif, Charge, Produit
  - Solde : Solde actuel du compte
  - Statut : Actif ou Inactif
```

**Explication :**
- Standard comptable pour l'Afrique de l'Ouest
- Utilisé dans les pays membres de l'OHADA
- Permet une harmonisation comptable
- Formaté avec séparateurs de milliers

---

### 26.2 Plan Comptable Général (PCG)

**Règle métier :** Le PCG est le plan comptable français standard.

**Structure :**
```
Pour chaque compte :
  - Compte : Numéro du compte
  - Intitulé : Libellé du compte
  - Classe : Classe comptable (1 à 7)
```

**Classes du PCG :**
- Classe 1 : Financement permanent
- Classe 2 : Actif immobilisé
- Classe 3 : Stocks
- Classe 4 : Tiers
- Classe 5 : Trésorerie
- Classe 6 : Charges
- Classe 7 : Produits

**Explication :**
- Standard comptable français
- Utilisé pour les entreprises françaises
- Obligatoire pour la comptabilité légale
- Formaté avec séparateurs de milliers

---

### 26.3 Plan Comptable Personnalisé

**Règle métier :** Permet de créer des comptes personnalisés selon les besoins spécifiques.

**Structure :**
```
Pour chaque compte personnalisé :
  - Compte : Numéro personnalisé (ex: CUST-001)
  - Intitulé : Libellé personnalisé
  - Type : Actif, Passif, Charge, Produit
  - Solde : Solde actuel
```

**Explication :**
- Permet d'adapter le plan comptable aux besoins spécifiques
- Utile pour des activités particulières
- Doit respecter les principes comptables
- Formaté avec séparateurs de milliers

---

## 27. Révisions Comptables

### 27.1 Types de Révisions

**Règle métier :** Différents types de révisions peuvent être effectués avant la clôture.

**Types de révisions :**
- Vérification des soldes
- Contrôle des écritures
- Révision des provisions
- Vérification des amortissements

**Explication :**
- Permet de vérifier la cohérence comptable
- Utilisé avant la clôture de l'exercice
- Aide à identifier les erreurs
- Améliore la qualité des états financiers

---

### 27.2 Statuts de Révision

**Règle métier :** Chaque révision peut avoir un statut.

**Statuts possibles :**
- `OK` : Révision terminée sans problème
- `En cours` : Révision en cours d'exécution
- `À faire` : Révision non encore effectuée

**Explication :**
- Permet de suivre l'avancement des révisions
- Utilisé pour la préparation de la clôture
- Aide à identifier les révisions restantes

---

## 28. Clôture de l'Exercice

### 28.1 Conditions Préalables à la Clôture

**Règle métier :** Certaines conditions doivent être remplies avant de clôturer un exercice.

**Conditions obligatoires :**
- Toutes les écritures sont validées
- Lettrage effectué
- Révisions terminées
- Inventaire terminé
- Affectation du résultat effectuée

**Explication :**
- Garantit la cohérence comptable avant clôture
- Empêche la clôture prématurée
- Améliore la qualité des états financiers
- Action irréversible

---

### 28.2 Vérification des Conditions

**Règle métier :** Le système vérifie automatiquement si toutes les conditions sont remplies.

**Règle de vérification :**
```
Si toutes les conditions sont remplies :
  - Bouton "Clôturer" : Activé
Sinon :
  - Bouton "Clôturer" : Désactivé
  - Affichage des conditions non remplies
```

**Détails de la vérification :**
```javascript
// Exemple de vérification
const toutesConditionsRemplies = 
  ecrituresValidees && 
  lettrageEffectue && 
  revisionsTerminees && 
  inventaireTermine && 
  affectationEffectuee;
```

**Explication :**
- Empêche la clôture si des conditions ne sont pas remplies
- Affiche clairement les étapes restantes
- Améliore la sécurité comptable

---

## 29. Fichier des Écritures Comptables (FEC)

### 29.1 Génération du FEC

**Règle métier :** Le FEC est un fichier standardisé requis par l'administration fiscale française.

**Format du FEC :**
```
Fichier texte avec séparateur pipe (|)
Colonnes : JournalCode, JournalLib, EcritureNum, EcritureDate, CompteNum, CompteLib, ...
```

**Explication :**
- Obligatoire pour les contrôles fiscaux
- Format standardisé (norme française)
- Contient toutes les écritures d'un exercice
- Peut être généré pour un exercice donné

---

### 29.2 Contenu du FEC

**Règle métier :** Le FEC doit contenir toutes les écritures comptables de l'exercice.

**Informations requises :**
- Numéro d'écriture
- Date d'écriture
- Numéro de compte
- Libellé du compte
- Débit
- Crédit
- Numéro de pièce
- Libellé de l'écriture

**Explication :**
- Permet à l'administration de vérifier la comptabilité
- Format standardisé pour faciliter l'analyse
- Obligatoire pour les entreprises françaises
- Peut être exporté en format .txt

---

## 30. Piste d'Audit

### 30.1 Enregistrement des Actions

**Règle métier :** Toutes les actions sur les écritures comptables sont enregistrées.

**Actions enregistrées :**
- Création d'écriture
- Modification d'écriture
- Validation d'écriture
- Suppression d'écriture

**Informations enregistrées :**
- Date et heure
- Utilisateur
- Action effectuée
- Numéro de pièce
- Détails de l'action

**Explication :**
- Permet de tracer toutes les modifications
- Utilisé pour l'audit comptable
- Améliore la traçabilité
- Respecte les obligations légales

---

### 30.2 Affichage de la Piste d'Audit

**Règle métier :** La piste d'audit affiche l'historique des modifications.

**Structure :**
```
Pour chaque action :
  - Date/Heure : Moment de l'action
  - Utilisateur : Auteur de l'action
  - Action : Type d'action (Création, Modification, Validation, Suppression)
  - Pièce : Numéro de pièce concernée
  - Détails : Description de l'action
```

**Explication :**
- Permet de consulter l'historique complet
- Utilisé pour identifier les modifications
- Aide à comprendre l'évolution des écritures
- Formaté avec date et heure

---

## 31. Archivage Comptable

### 31.1 Durée de Conservation

**Règle métier :** Les exercices comptables doivent être conservés pendant une durée légale.

**Durée de conservation :**
```
Durée_conservation = 10 ans (standard français)
```

**Explication :**
- Obligation légale de conservation
- Permet de répondre aux contrôles fiscaux
- Utilisé pour l'historique comptable
- Formaté avec unité de temps

---

### 31.2 Informations d'Archivage

**Règle métier :** Chaque archivage contient des informations sur l'exercice archivé.

**Informations archivées :**
- Exercice : Année de l'exercice
- Date d'archivage : Date de l'archivage
- Taille : Taille du fichier archivé
- Statut : Statut de l'archivage
- Durée de conservation : Durée légale

**Explication :**
- Permet de gérer les archives
- Utilisé pour retrouver les exercices
- Aide à respecter les obligations légales
- Formaté avec date et taille

---

## 32. Calcul du Solde Bancaire Séquentiel

### 32.1 Principe de Calcul Séquentiel

**Règle métier :** Le solde bancaire est calculé séquentiellement après chaque écriture.

**Formule de calcul :**
```
Solde_écriture_N = Solde_écriture_(N-1) + Débit_écriture_N - Crédit_écriture_N
```

**Détails du calcul :**
```javascript
// Calcul séquentiel
let soldePrecedent = 0;
entries.forEach(entry => {
  const solde = soldePrecedent + entry.debit - entry.credit;
  entry.solde = solde;
  soldePrecedent = solde;
});
```

**Explication :**
- Le solde de chaque écriture dépend du solde précédent
- Les débits augmentent le solde
- Les crédits diminuent le solde
- Formaté avec séparateurs de milliers

**Exemple :**
- Solde initial : €0
- Écriture 1 : Débit €15,000, Crédit €0 → Solde : €15,000
- Écriture 2 : Débit €0, Crédit €5,000 → Solde : €10,000
- Écriture 3 : Débit €8,500, Crédit €0 → Solde : €18,500

---

## Conclusion

Ce document recense toutes les règles métier identifiées dans la page Comptabilité. Ces règles régissent les calculs comptables, la gestion des écritures, les états financiers (balance, compte de résultat, bilan), la gestion de la TVA, la comptabilité analytique, l'inventaire, l'affectation du résultat, le lettrage, la clôture de l'exercice, l'archivage, le FEC, la piste d'audit, et toutes les fonctionnalités liées à la comptabilité dans le CRM.

Pour toute question ou clarification sur ces règles, veuillez consulter le code source dans `src/app/components/Accounting.tsx`.

