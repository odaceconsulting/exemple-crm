# Règles Métier et Formules de Calcul - Module RH

Ce document recense les règles de gestion, les formules de calcul et les explications fonctionnelles utilisées dans le module Ressources Humaines.

## 1. Gestion des Collaborateurs (Tableau de Bord Principal)

### Indicateurs Clés (KPIs)

| Indicateur | Formule / Règle | Explication |
| :--- | :--- | :--- |
| **Effectif Total** | `Count(All Employees)` | Nombre total de collaborateurs enregistrés dans la base de données, quel que soit leur statut. |
| **Actifs** | `Count(Employees where status == 'active')` | Nombre de collaborateurs actuellement en poste et actifs. |
| **En Congé** | `Count(Employees where status == 'on-leave')` | Nombre de collaborateurs ayant actuellement le statut "en congé". |
| **Disponibilité Moyenne** | `Sum(Employee.availability) / Count(All Employees)` | Moyenne du pourcentage de disponibilité de tous les collaborateurs (arrondi à l'entier le plus proche). |

### Codes Couleur de Disponibilité
Le système utilise un code couleur pour indiquer visuellement le niveau de disponibilité ou de charge :
*   🟢 **Vert** : Disponibilité ≥ 80% (Collaborateur très disponible)
*   🟠 **Orange** : Disponibilité ≥ 50% et < 80% (Charge modérée)
*   🔴 **Rouge** : Disponibilité < 50% (Surcharge ou indisponibilité)

---

## 2. Gestion des Congés

### Calcul de la Durée
*   **Formule** : `(Date Fin - Date Début) + 1 jour`
*   **Règle** : Toute journée entamée est comptabilisée. Le calcul inclut les bornes (inclusive).

### Solde de Congés
*   **Formule** : `Solde Restant = Total Acquis - Total Utilisé`
*   **Types de compteurs** :
    *   *Congés Payés (Vacation)* : Droit acquis annuellement (ex: 25 jours).
    *   *Maladie (Sick)* : Jours d'arrêt maladie comptabilisés.
    *   *Personnel* : Jours pour événements familiaux ou RTT.

---

## 3. Recrutement

### Indicateurs de Suivi
| Indicateur | Règle Métier |
| :--- | :--- |
| **Offres Actives** | Nombre d'offres d'emploi actuellement publiées et non pourvues. |
| **Candidatures** | Nombre total de candidatures reçues pour les offres en cours. |
| **Entretiens** | Nombre d'entretiens planifiés pour la semaine courante. |

---

## 4. Évaluations & Performance

### Scores et Objectifs
| Indicateur | Règle Métier |
| :--- | :--- |
| **Avancement Campagne** | Pourcentage d'entretiens annuels réalisés sur le total attendu pour la période. |
| **Objectifs Atteints** | Nombre total d'OKRs (Objectifs Clés) marqués comme "Atteints" ou "Dépassés". |
| **Performance Moyenne** | Moyenne des scores d'évaluation globale (sur une échelle de 1 à 5). |

---

## 5. Formation

### Suivi Budgétaire
| Indicateur | Règle Métier |
| :--- | :--- |
| **Budget Utilisé** | `(Montant Engagé / Budget Total Alloué) * 100` |
| **Volume Horaire** | Somme des heures de formation réalisées par tous les collaborateurs sur l'année. |

---

## 6. Paie & Rémunération

### Tableaux de Bord Paie
| Indicateur | Formule / Règle |
| :--- | :--- |
| **Masse Salariale** | Somme des salaires bruts + charges patronales (estimées) pour la période donnée. |
| **Salaire Moyen** | `Masse Salariale / Nombre de Collaborateurs` |
| **Salaire Médian** | Valeur centrale de la distribution des salaires (autant de salaires au-dessus qu'en dessous). |

### Variables de Paie
Les éléments variables (primes, heures sup) sont saisis manuellement et s'ajoutent au brut :
*   **Statut "Pending"** : En attente de validation par le manager.
*   **Statut "Approved"** : Validé et prêt à être intégré dans la prochaine paie.

---

## 7. Notes de Frais

### Workflow de Validation
1.  **Soumission** : Le collaborateur saisit la dépense (Date, Montant, Catégorie) et joint un justificatif. Statut = `Pending`.
2.  **Validation** : Le manager ou la compta valide la dépense. Statut = `Approved`.
3.  **Remboursement** : Le paiement est effectué. Statut = `Reimbursed`.

### Catégories de Dépenses
*   Transport
*   Repas
*   Hébergement
*   Fournitures
*   Autre

---

## Note Technique
*Les données présentées dans la version de démonstration (KPIs spécifiques des modules Recrutement, Évaluations, Formation, Paie, Frais) sont actuellement simulées pour illustrer les capacités du système. Dans la version finale connectée, ces indicateurs seront calculés dynamiquement en base de données selon les formules décrites ci-dessus.*
