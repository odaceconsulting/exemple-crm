# Règles Métier de la Page Facturation

Ce document liste toutes les règles métier, formules de calcul et explications identifiées dans la page Facturation du CRM.

---

## 1. Calculs de Revenus et Indicateurs Financiers

### 1.1 Revenus Encaissés (Total Revenue)

**Règle métier :** Calcule le montant total des factures payées.

**Formule de calcul :**
```
Revenus_encaissés = Σ(Montant des factures où status = 'paid')
```

**Détails du calcul :**
```javascript
const totalRevenue = invoicesState
  .filter(i => i.status === 'paid')
  .reduce((sum, i) => sum + i.amount, 0);
```

**Explication :**
- Seules les factures avec le statut 'paid' sont comptabilisées
- Représente les revenus réellement encaissés
- Utilisé pour mesurer la trésorerie disponible
- Formaté avec séparateurs de milliers

**Exemple :**
- Facture 1 : €12,500 (payée)
- Facture 2 : €17,000 (payée)
- Facture 3 : €9,000 (payée)
- Revenus encaissés : €38,500

---

### 1.2 Revenus en Attente (Pending Revenue)

**Règle métier :** Calcule le montant total des factures en attente de paiement.

**Formule de calcul :**
```
Revenus_en_attente = Σ(Montant des factures où status = 'pending')
```

**Détails du calcul :**
```javascript
const pendingRevenue = invoicesState
  .filter(i => i.status === 'pending')
  .reduce((sum, i) => sum + i.amount, 0);
```

**Explication :**
- Factures envoyées mais non encore payées
- Représente les créances à court terme
- Utilisé pour la prévision de trésorerie
- Formaté avec séparateurs de milliers

**Exemple :**
- Facture 1 : €15,000 (en attente)
- Facture 2 : €8,000 (en attente)
- Revenus en attente : €23,000

---

### 1.3 Revenus en Retard (Overdue Revenue)

**Règle métier :** Calcule le montant total des factures en retard de paiement.

**Formule de calcul :**
```
Revenus_en_retard = Σ(Montant des factures où status = 'overdue')
```

**Détails du calcul :**
```javascript
const overdueRevenue = invoicesState
  .filter(i => i.status === 'overdue')
  .reduce((sum, i) => sum + i.amount, 0);
```

**Explication :**
- Factures dont la date d'échéance est dépassée
- Représente les créances à risque
- Utilisé pour identifier les problèmes de recouvrement
- Formaté avec séparateurs de milliers

**Exemple :**
- Facture 1 : €20,000 (en retard)
- Facture 2 : €5,000 (en retard)
- Revenus en retard : €25,000

---

### 1.4 Total des Factures

**Règle métier :** Calcule le montant total de toutes les factures (hors brouillons).

**Formule de calcul :**
```
Total_factures = Revenus_encaissés + Revenus_en_attente + Revenus_en_retard
```

**Détails du calcul :**
```javascript
const totalInvoices = totalRevenue + pendingRevenue + overdueRevenue;
```

**Explication :**
- Somme de tous les revenus (encaissés, en attente, en retard)
- Exclut les brouillons du calcul
- Représente le total facturé
- Formaté avec séparateurs de milliers

**Exemple :**
- Revenus encaissés : €38,500
- Revenus en attente : €23,000
- Revenus en retard : €25,000
- Total : €86,500

---

## 2. Génération et Numérotation des Factures

### 2.1 Génération Automatique du Numéro de Facture

**Règle métier :** Génère automatiquement un numéro unique pour chaque nouvelle facture selon le mode de numérotation sélectionné.

**Formule de calcul :**
```
Selon le mode :
- Auto : INV-YYYY-NNN
- Conformité CI/FR : CI-FR-YYYY-NNN
- Archives : ARCH-YYYY-NNN
- Avoirs : AV-YYYY-NNN

Où :
  YYYY = Année actuelle
  NNN = Numéro séquentiel formaté sur 3 chiffres avec zéros à gauche
```

**Détails du calcul :**
```javascript
const generateInvoiceNumber = (id: string | number) => {
  const year = new Date().getFullYear();
  const seq = String(id).padStart(3, '0');
  switch (numberingMode) {
    case 'conformite':
      return `CI-FR-${year}-${seq}`;
    case 'archives':
      return `ARCH-${year}-${seq}`;
    case 'avoirs':
      return `AV-${year}-${seq}`;
    default:
      return `INV-${year}-${seq}`;
  }
};
```

**Explication :**
- Le numéro séquentiel est basé sur l'ID de la facture
- L'année est extraite de la date actuelle
- Le numéro est complété avec des zéros à gauche (3 chiffres)
- Le mode de numérotation peut être changé à tout moment

**Exemple :**
- Mode Auto, ID 1, Année 2026 : INV-2026-001
- Mode Conformité, ID 15, Année 2026 : CI-FR-2026-015
- Mode Archives, ID 100, Année 2026 : ARCH-2026-100

---

### 2.2 Calcul de la Date d'Échéance par Défaut

**Règle métier :** Calcule automatiquement la date d'échéance à partir de la date d'émission et d'un délai par défaut.

**Formule de calcul :**
```
Date_échéance = Date_émission + 30 jours
```

**Détails du calcul :**
```javascript
const dueDate = new Date(Date.now() + 30*24*3600*1000)
  .toISOString().split('T')[0];
```

**Explication :**
- Délai par défaut : 30 jours
- La date d'échéance peut être modifiée manuellement
- Utilisée pour déterminer si une facture est en retard
- Format : YYYY-MM-DD

**Exemple :**
- Date d'émission : 2026-01-20
- Date d'échéance : 2026-02-19 (30 jours après)

---

## 3. Gestion des Statuts de Factures

### 3.1 Détection Automatique des Factures en Retard

**Règle métier :** Marque automatiquement une facture comme "en retard" si la date d'échéance est dépassée et que la facture n'est pas payée.

**Formule de calcul :**
```
Si Date_échéance < Date_actuelle ET status ≠ 'paid' ET status ≠ 'overdue' :
  Alors status = 'overdue'
```

**Détails du calcul :**
```javascript
const today = new Date();
setInvoicesState(prev => prev.map(inv => {
  try {
    const due = new Date(inv.dueDate);
    if (due < today && inv.status !== 'paid' && inv.status !== 'overdue') {
      return { ...inv, status: 'overdue' };
    }
  } catch (e) {
    // ignore parse errors
  }
  return inv;
}));
```

**Explication :**
- Vérification effectuée au chargement de la page
- Peut être déclenchée manuellement via le bouton "Vérifier échéances"
- Ne modifie pas les factures déjà payées
- Ne modifie pas les factures déjà marquées comme en retard

**Exemple :**
- Date actuelle : 2026-02-25
- Facture avec échéance : 2026-02-20, status 'pending'
- Résultat : status devient 'overdue'

---

### 3.2 Statuts Disponibles

**Règle métier :** Une facture peut avoir l'un des statuts suivants.

**Statuts possibles :**
- `draft` : Brouillon (en cours de création)
- `pending` : En attente de paiement
- `paid` : Payée
- `overdue` : En retard (date d'échéance dépassée)

**Explication :**
- Chaque statut a une couleur et une icône associées
- Les statuts déterminent les actions possibles
- Une facture ne peut avoir qu'un seul statut à la fois
- Les statuts sont mutuellement exclusifs

---

## 4. Conversion de Devis en Facture

### 4.1 Conversion d'un Devis en Facture

**Règle métier :** Convertit un devis accepté en facture avec les informations du devis.

**Règle de conversion :**
```
Nouvelle facture :
  - ID : ID séquentiel suivant
  - Numéro : Généré selon le mode de numérotation
  - Client : Nom de l'entreprise du devis
  - Montant : Montant total du devis
  - Date d'émission : Date actuelle
  - Date d'échéance : Date actuelle + 30 jours
  - Statut : 'draft'
  - Articles : Nombre d'articles du devis
```

**Détails de la conversion :**
```javascript
const handleConvertQuote = () => {
  const source = mockQuotes.find(q => q.id === conversionSourceId);
  const newId = String(Math.max(...invoicesState.map(i => parseInt(i.id)), 0) + 1);
  const newInvoice: Invoice = {
    id: newId,
    number: generateInvoiceNumber(newId),
    company: source.company || `Quote ${source.number}`,
    amount: source.totalAmount || 0,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30*24*3600*1000).toISOString().split('T')[0],
    status: 'draft',
    items: source.items ? source.items.length : 0
  };
  setInvoicesState([newInvoice, ...invoicesState]);
};
```

**Explication :**
- Le devis source est sélectionné dans une liste déroulante
- Les informations du devis sont copiées dans la nouvelle facture
- La facture est créée en statut 'draft' pour permettre les modifications
- Le nombre d'articles est préservé

**Exemple :**
- Devis : DEVIS-2026-001, Acme Corp, €12,500, 3 articles
- Facture créée : INV-2026-001, Acme Corp, €12,500, 3 articles, statut 'draft'

---

## 5. Factures Récurrentes

### 5.1 Création d'une Facture Récurrente

**Règle métier :** Crée une facture récurrente avec une fréquence et un nombre d'occurrences définis.

**Règle de création :**
```
Nouvelle facture récurrente :
  - ID : ID séquentiel suivant
  - Numéro : REC-YYYY-NNN
  - Client : 'Client récurrent'
  - Montant : 0 (à définir)
  - Date d'émission : Date actuelle
  - Date d'échéance : Date actuelle + 30 jours
  - Statut : 'draft'
  - Récurrence : { fréquence, prochaine_date, occurrences }
```

**Fréquences disponibles :**
- `weekly` : Hebdomadaire
- `monthly` : Mensuelle
- `quarterly` : Trimestrielle
- `yearly` : Annuelle

**Détails de la création :**
```javascript
const handleCreateRecurring = () => {
  const newId = String(Math.max(...invoicesState.map(i => parseInt(i.id)), 0) + 1);
  const newInvoice: Invoice = {
    id: newId,
    number: `REC-${new Date().getFullYear()}-${String(newId).padStart(3, '0')}`,
    company: 'Client récurrent',
    amount: 0,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30*24*3600*1000).toISOString().split('T')[0],
    status: 'draft',
    items: 0,
    recurrence: recurrenceForm
  };
  setInvoicesState([newInvoice, ...invoicesState]);
};
```

**Explication :**
- Permet de planifier des factures régulières
- Le nombre d'occurrences définit combien de fois la facture sera générée
- La prochaine date définit quand la première occurrence sera créée
- La facture est créée en statut 'draft' pour permettre les modifications

**Exemple :**
- Fréquence : Mensuelle
- Prochaine date : 2026-02-01
- Occurrences : 12
- Résultat : 12 factures mensuelles à partir de février 2026

---

## 6. Gestion des Acomptes

### 6.1 Ajout d'un Acompte à une Facture

**Règle métier :** Ajoute un acompte (dépôt) à une facture existante.

**Règle d'ajout :**
```
Nouvel acompte :
  - ID : ID séquentiel (max des acomptes existants + 1)
  - Montant : Montant de l'acompte
  - Date : Date de l'acompte
  - Note : Note descriptive
```

**Détails de l'ajout :**
```javascript
const handleCreateDeposit = () => {
  const targetId = depositForm.invoiceId;
  setInvoicesState(invoicesState.map(inv => {
    if (inv.id === targetId) {
      const updated = { ...inv };
      if (!updated.deposits) updated.deposits = [];
      const nid = updated.deposits.length 
        ? Math.max(...updated.deposits.map(d => Number(d.id))) + 1 
        : 1;
      const newDep: Deposit = { 
        id: nid, 
        amount: depositForm.amount, 
        date: depositForm.date, 
        note: depositForm.note 
      };
      updated.deposits = [...updated.deposits, newDep];
      return updated;
    }
    return inv;
  }));
};
```

**Explication :**
- Un acompte est associé à une facture spécifique
- Plusieurs acomptes peuvent être ajoutés à une même facture
- Les acomptes sont stockés dans un tableau
- Le montant total de la facture reste inchangé (les acomptes sont des paiements partiels)

**Exemple :**
- Facture : INV-2026-001, Montant : €12,500
- Acompte 1 : €5,000, Date : 2026-01-15
- Acompte 2 : €3,000, Date : 2026-01-20
- Solde restant : €4,500

---

## 7. Gestion des Relances

### 7.1 Envoi d'un Rappel (Relance)

**Règle métier :** Envoie un rappel au client pour une facture en attente ou en retard.

**Règle d'envoi :**
```
Lors de l'envoi d'un rappel :
  - reminderCount : Incrémenté de 1
  - notes : Ajout d'une ligne "[Rappel N - Date] Rappel envoyé au client."
  - status : Si 'draft', devient 'pending', sinon reste inchangé
```

**Détails de l'envoi :**
```javascript
const sendReminder = (invoiceId: string) => {
  setInvoicesState(prev => prev.map(inv => {
    if (inv.id === invoiceId) {
      const now = new Date().toLocaleString('fr-FR');
      const newCount = (inv.reminderCount || 0) + 1;
      const note = `${inv.notes || ''}\n[Rappel ${newCount} - ${now}] Rappel envoyé au client.`.trim();
      return { 
        ...inv, 
        reminderCount: newCount, 
        notes: note, 
        status: inv.status === 'draft' ? 'pending' : inv.status 
      };
    }
    return inv;
  }));
};
```

**Explication :**
- Le compteur de rappels est incrémenté à chaque envoi
- L'historique des rappels est conservé dans les notes
- Un brouillon devient automatiquement "en attente" lors du premier rappel
- Permet de suivre le nombre de relances effectuées

**Exemple :**
- Facture : INV-2026-001, reminderCount : 0
- Après 1er rappel : reminderCount : 1, notes : "[Rappel 1 - 20/01/2026 14:30] Rappel envoyé au client."
- Après 2ème rappel : reminderCount : 2, notes : "[Rappel 1 - ...] [Rappel 2 - 25/01/2026 10:15] Rappel envoyé au client."

---

## 8. Gestion des Pénalités

### 8.1 Calcul et Application d'une Pénalité

**Règle métier :** Applique une pénalité de retard sur une facture en pourcentage du montant.

**Formule de calcul :**
```
Montant_pénalité = Montant_facture × (Pourcentage_pénalité / 100)
Nouveau_montant = Montant_facture + Montant_pénalité
Pénalité_totale = Pénalité_totale_existante + Montant_pénalité
```

**Détails du calcul :**
```javascript
const applyPenalty = (invoiceId: string, percent: number) => {
  setInvoicesState(prev => prev.map(inv => {
    if (inv.id === invoiceId) {
      const penaltyAmount = Math.round((inv.amount * (percent / 100)) * 100) / 100;
      const newPenalty = (inv.penalty || 0) + penaltyAmount;
      const note = `${inv.notes || ''}\n[Penalité ${newPenalty}€ - ${percent}%]`.trim();
      return { 
        ...inv, 
        penalty: newPenalty, 
        amount: Math.round((inv.amount + penaltyAmount) * 100) / 100, 
        notes: note 
      };
    }
    return inv;
  }));
};
```

**Explication :**
- La pénalité est calculée en pourcentage du montant actuel de la facture
- Le montant de la facture est augmenté du montant de la pénalité
- Les pénalités sont cumulatives (plusieurs pénalités peuvent être appliquées)
- Le montant est arrondi à 2 décimales
- L'historique est conservé dans les notes

**Exemple :**
- Facture : €12,500, pénalité existante : €0
- Application d'une pénalité de 5% : €12,500 × 5% = €625
- Nouveau montant : €12,500 + €625 = €13,125
- Pénalité totale : €625

---

## 9. Enregistrement des Paiements

### 9.1 Enregistrement d'un Paiement

**Règle métier :** Enregistre le paiement d'une facture avec une méthode de paiement et une référence optionnelle.

**Règle d'enregistrement :**
```
Lors de l'enregistrement d'un paiement :
  - status : Devient 'paid'
  - paymentMethod : Méthode de paiement sélectionnée
  - paymentDate : Date actuelle
  - notes : Ajout d'une ligne "[Paiement méthode - Date] Référence ou 'Paiement reçu'"
```

**Méthodes de paiement disponibles :**
- Orange Money
- MTN Money
- Virement
- Carte Stripe
- Réconciliation

**Détails de l'enregistrement :**
```javascript
const processPayment = () => {
  if (!activePaymentInvoice || !selectedPaymentMethod) return;
  setInvoicesState(prev => prev.map(inv => {
    if (inv.id === activePaymentInvoice.id) {
      const now = new Date().toLocaleString('fr-FR');
      const note = `${inv.notes || ''}\n[Paiement ${selectedPaymentMethod} - ${now}] ${paymentReference ? 'Ref: ' + paymentReference : 'Paiement reçu'}`.trim();
      return { 
        ...inv, 
        status: 'paid', 
        paymentMethod: selectedPaymentMethod, 
        paymentDate: new Date().toISOString().split('T')[0], 
        notes: note 
      };
    }
    return inv;
  }));
};
```

**Explication :**
- Une facture ne peut être payée qu'une seule fois
- La méthode de paiement est enregistrée pour le suivi
- La référence de paiement est optionnelle mais recommandée
- L'historique est conservé dans les notes
- La date de paiement est enregistrée

**Exemple :**
- Facture : INV-2026-001, status 'pending'
- Paiement : Orange Money, Référence : OM-123456
- Résultat : status 'paid', paymentMethod 'Orange Money', paymentDate '2026-01-25'

---

## 10. Rapports et Analytics

### 10.1 Journal des Ventes

**Règle métier :** Génère un rapport listant toutes les factures avec leurs informations principales.

**Structure du rapport :**
```
Pour chaque facture :
  - Numéro : Numéro de la facture
  - Date : Date d'émission
  - Client : Nom de l'entreprise
  - Montant : Montant de la facture
  - Statut : Statut traduit (Payée, En attente, En retard, Brouillon)
  - Méthode : Méthode de paiement ou 'N/A'
```

**Détails de la génération :**
```javascript
const generateJournalVentes = () => {
  const data = invoicesState.map(inv => ({
    numero: inv.number,
    date: inv.issueDate,
    client: inv.company,
    montant: inv.amount,
    statut: inv.status === 'paid' ? 'Payée' : 
            inv.status === 'pending' ? 'En attente' : 
            inv.status === 'overdue' ? 'En retard' : 'Brouillon',
    methode: inv.paymentMethod || 'N/A'
  }));
  return data;
};
```

**Explication :**
- Liste toutes les factures sans filtre
- Les statuts sont traduits en français
- Les méthodes de paiement sont affichées ou 'N/A' si absentes
- Peut être exporté en CSV

---

### 10.2 Rapport de Chiffre d'Affaires (CA) Mensuel

**Règle métier :** Calcule le chiffre d'affaires par mois avec répartition entre payé et en cours.

**Formule de calcul :**
```
Pour chaque mois :
  - Total facturé : Σ(Montant de toutes les factures du mois)
  - Montant payé : Σ(Montant des factures payées du mois)
  - En cours : Σ(Montant des factures en attente ou en retard du mois)
```

**Détails du calcul :**
```javascript
const generateCAReport = () => {
  const monthlyData: { [key: string]: { montant: number; payée: number; encours: number } } = {};
  invoicesState.forEach(inv => {
    const month = inv.issueDate.substring(0, 7); // YYYY-MM
    if (!monthlyData[month]) monthlyData[month] = { montant: 0, payée: 0, encours: 0 };
    monthlyData[month].montant += inv.amount;
    if (inv.status === 'paid') monthlyData[month].payée += inv.amount;
    else if (inv.status === 'pending' || inv.status === 'overdue') monthlyData[month].encours += inv.amount;
  });
  return monthlyData;
};
```

**Explication :**
- Le mois est extrait de la date d'émission (format YYYY-MM)
- Les factures sont groupées par mois
- Distinction entre factures payées et en cours
- Permet d'analyser l'évolution du CA mensuel

**Exemple :**
- Janvier 2026 : Total facturé €50,000, Payé €35,000, En cours €15,000
- Février 2026 : Total facturé €60,000, Payé €45,000, En cours €15,000

---

### 10.3 Rapport des Factures Impayées

**Règle métier :** Liste toutes les factures impayées avec le nombre de jours de retard.

**Formule de calcul :**
```
Pour chaque facture impayée :
  - Jours de retard = (Date_actuelle - Date_échéance) en jours
  - Si status = 'overdue' : Jours de retard calculés
  - Si status = 'pending' : 0 jours (à venir)
```

**Détails du calcul :**
```javascript
const generateImpayesReport = () => {
  const data = invoicesState
    .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
    .map(inv => {
      const dueDate = new Date(inv.dueDate);
      const today = new Date();
      const daysOverdue = inv.status === 'overdue' 
        ? Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) 
        : 0;
      return {
        numero: inv.number,
        client: inv.company,
        montant: inv.amount,
        dateEcheance: inv.dueDate,
        jours: daysOverdue,
        statut: inv.status === 'overdue' ? `${daysOverdue} jours` : 'À venir'
      };
    })
    .sort((a, b) => b.jours - a.jours);
  return data;
};
```

**Explication :**
- Filtre uniquement les factures en attente ou en retard
- Calcule le nombre de jours de retard pour les factures en retard
- Trie par nombre de jours de retard décroissant
- Permet d'identifier les factures les plus urgentes

**Exemple :**
- Facture 1 : Échéance 2026-01-15, Date actuelle 2026-02-01, Jours : 17
- Facture 2 : Échéance 2026-02-05, Date actuelle 2026-02-01, Statut : À venir

---

### 10.4 Export Comptabilité

**Règle métier :** Exporte toutes les données comptables des factures en CSV.

**Structure de l'export :**
```
Pour chaque facture :
  - N° Facture : Numéro de la facture
  - Client : Nom de l'entreprise
  - Montant : Montant de la facture
  - Date Émission : Date d'émission formatée
  - Date Échéance : Date d'échéance formatée
  - Statut : Statut traduit
  - Méthode : Méthode de paiement ou vide
  - Pénalité : Montant de la pénalité ou vide
```

**Détails de l'export :**
```javascript
const data = invoicesState.map(inv => ({
  'N° Facture': inv.number,
  'Client': inv.company,
  'Montant': inv.amount,
  'Date Émission': new Date(inv.issueDate).toLocaleDateString('fr-FR'),
  'Date Échéance': new Date(inv.dueDate).toLocaleDateString('fr-FR'),
  'Statut': inv.status === 'paid' ? 'Payée' : 
            inv.status === 'pending' ? 'En attente' : 
            inv.status === 'overdue' ? 'En retard' : 'Brouillon',
  'Méthode': inv.paymentMethod || '',
  'Pénalité': inv.penalty || ''
}));
downloadCSV(data, 'Export-Compta-' + new Date().toLocaleDateString('fr-FR') + '.csv');
```

**Explication :**
- Exporte toutes les factures sans filtre
- Les dates sont formatées en français (JJ/MM/AAAA)
- Les statuts sont traduits
- Le nom du fichier inclut la date d'export
- Format CSV compatible avec Excel et les logiciels comptables

---

## 11. Calculs de Jours et Échéances

### 11.1 Calcul des Jours de Retard

**Règle métier :** Calcule le nombre de jours de retard d'une facture en retard.

**Formule de calcul :**
```
Jours_retard = (Date_actuelle - Date_échéance) en jours
```

**Détails du calcul :**
```javascript
const dueDate = new Date(inv.dueDate);
const today = new Date();
const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
```

**Explication :**
- Calculé uniquement pour les factures en retard
- Le résultat est arrondi à l'entier inférieur (floor)
- Utilisé pour prioriser les relances
- Affiché dans le rapport des impayés

**Exemple :**
- Date d'échéance : 2026-01-15
- Date actuelle : 2026-02-01
- Jours de retard : (2026-02-01 - 2026-01-15) = 17 jours

---

### 11.2 Filtrage des Échéances à Venir (14 jours)

**Règle métier :** Identifie les factures dont l'échéance est dans les 14 prochains jours.

**Formule de calcul :**
```
Si (Date_échéance - Date_actuelle) >= 0 ET <= 14 jours :
  Alors facture affichée dans "Échéances (14j)"
```

**Détails du calcul :**
```javascript
invoicesState.filter(i => {
  try {
    const due = new Date(i.dueDate);
    const today = new Date();
    const diff = (due.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return diff >= 0 && diff <= 14;
  } catch (e) { return false; }
})
```

**Explication :**
- Affiche uniquement les factures dont l'échéance est dans les 14 prochains jours
- Exclut les factures déjà échues
- Permet d'anticiper les échéances à venir
- Limité à 6 factures dans l'affichage

**Exemple :**
- Date actuelle : 2026-02-01
- Facture 1 : Échéance 2026-02-05 (4 jours) → Affichée
- Facture 2 : Échéance 2026-02-20 (19 jours) → Non affichée
- Facture 3 : Échéance 2026-01-25 (7 jours passés) → Non affichée

---

## 12. Recherche et Filtrage

### 12.1 Recherche de Factures

**Règle métier :** Filtre les factures selon le texte saisi dans la recherche.

**Critères de recherche :**
```
Recherche dans :
- Numéro de facture
- Nom de l'entreprise (client)
```

**Détails de la recherche :**
```javascript
const filteredInvoices = invoicesState.filter(invoice =>
  invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
  invoice.company.toLowerCase().includes(searchQuery.toLowerCase())
);
```

**Explication :**
- Recherche insensible à la casse
- Recherche dans le numéro et le nom du client
- Recherche en temps réel (à chaque frappe)
- Permet de trouver rapidement une facture

**Exemple :**
- Recherche "INV-2026" → Trouve toutes les factures commençant par "INV-2026"
- Recherche "Acme" → Trouve toutes les factures du client "Acme Corporation"

---

## 13. Comptage par Statut

### 13.1 Nombre de Factures par Statut

**Règle métier :** Compte le nombre de factures pour chaque statut.

**Formule de calcul :**
```
Nombre_factures_statut = Nombre de factures où status = statut_cible
```

**Détails du calcul :**
```javascript
const paidCount = invoicesState.filter(i => i.status === 'paid').length;
const pendingCount = invoicesState.filter(i => i.status === 'pending').length;
const overdueCount = invoicesState.filter(i => i.status === 'overdue').length;
const draftCount = invoicesState.filter(i => i.status === 'draft').length;
```

**Explication :**
- Utilisé pour les cartes KPI et les graphiques
- Permet un suivi rapide de l'état du portefeuille de factures
- Mis à jour en temps réel lors des modifications

**Exemple :**
- Payées : 25 factures
- En attente : 12 factures
- En retard : 8 factures
- Brouillons : 5 factures

---

## 14. Comptage par Méthode de Paiement

### 14.1 Nombre de Factures Payées par Méthode

**Règle métier :** Compte le nombre de factures payées pour chaque méthode de paiement.

**Formule de calcul :**
```
Nombre_payées_méthode = Nombre de factures où paymentMethod = méthode ET status = 'paid'
```

**Détails du calcul :**
```javascript
const orangeMoneyCount = invoicesState.filter(i => 
  i.paymentMethod === 'Orange Money' && i.status === 'paid'
).length;
```

**Explication :**
- Utilisé pour afficher le nombre de paiements par méthode
- Permet d'analyser les préférences de paiement des clients
- Affiché sur les boutons de paiement

**Exemple :**
- Orange Money : 15 factures payées
- MTN Money : 8 factures payées
- Virement : 20 factures payées
- Carte Stripe : 12 factures payées

---

## 15. Formatage et Affichage

### 15.1 Formatage des Montants

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

### 15.2 Formatage des Dates

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

## 16. Règles de Validation

### 16.1 Validation de l'Application d'une Pénalité

**Règle métier :** Une pénalité ne peut être appliquée que si le pourcentage est valide.

**Conditions de validation :**
```
- Pourcentage > 0
- Pourcentage est un nombre valide
```

**Détails de la validation :**
```javascript
const pct = parseFloat(penaltyInput);
if (isNaN(pct) || pct <= 0) {
  return alert('Pourcentage invalide');
}
```

**Explication :**
- Empêche l'application de pénalités négatives ou nulles
- Assure la cohérence des calculs
- Améliore l'expérience utilisateur

---

### 16.2 Validation de l'Enregistrement d'un Paiement

**Règle métier :** Un paiement ne peut être enregistré que si la facture et la méthode sont sélectionnées.

**Conditions de validation :**
```
- Facture sélectionnée (activePaymentInvoice !== null)
- Méthode de paiement sélectionnée (selectedPaymentMethod !== null)
```

**Détails de la validation :**
```javascript
disabled={!selectedPaymentMethod || !activePaymentInvoice}
```

**Explication :**
- Empêche l'enregistrement de paiements incomplets
- Assure la traçabilité des paiements
- Améliore la qualité des données

---

## Conclusion

Ce document recense toutes les règles métier identifiées dans la page Facturation. Ces règles régissent les calculs financiers, la gestion des statuts, les conversions, les relances, les pénalités, les paiements, les rapports et toutes les fonctionnalités liées aux factures dans le CRM.

Pour toute question ou clarification sur ces règles, veuillez consulter le code source dans `src/app/components/Invoicing.tsx`.

