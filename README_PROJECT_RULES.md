# Règles Métier et Formules de Calcul - Page Projets

Ce document liste les règles métier, les formules de calcul et les explications fonctionnelles extraites du code source de la page `Projects` (`Projects.tsx`).

## 1. Gestion des Projets

### Statuts et Couleurs
Les projets sont classés par statut avec un code couleur spécifique :
- **Actif** (Bleu) : `bg-blue-100`
- **Complété** (Vert) : `bg-green-100`
- **En attente** (Jaune) : `bg-yellow-100`
- **Planification** (Gris) : `bg-gray-100`

### Priorités
- **Haute** (Rouge) : `bg-red-100`
- **Moyenne** (Jaune) : `bg-yellow-100`
- **Basse** (Verte) : `bg-green-100`

### Calculs Budgétaires (Vue Fiche & Budget)
- **Reste disponible** = `Budget alloué - Dépenses`
- **Utilisation du budget (%)** = `(Dépenses / Budget alloué) * 100`
  - **Alerte Rouge** : Si utilisation > 90%
  - **Alerte Jaune** : Si utilisation > 70%
  - **Normal (Blue)** : Sinon

## 2. Gestion de l'Équipe

### Disponibilités
- **Disponibilité (%)** : Affichée sous forme de barre de progression.
- **Heures disponibles** : Stockées en dur ou calculées selon la configuration utilisateur.

### Coûts TJM (Taux Journalier Moyen)
- **Coût par membre** = `TJM * Jours travaillés`
- **Coût total projet** = Somme des coûts de tous les membres.
- *Note : Le TJM par défaut dans le code est de 500€ pour les exemples.*

### Matrice RACI
Les rôles sont définis comme suit :
- **R (Responsable)** : Réalise la tâche.
- **A (Approbateur)** : Valide le travail.
- **C (Consulté)** : Donne un avis.
- **I (Informé)** : Tenu au courant.

## 3. Gestion des Tâches

### Structure
- **WBS (Work Breakdown Structure)** : Organisation hiérarchique (Code ex: 1.1, 1.2).
- **Sous-tâches** : Tâches enfants liées à une tâche parent (`parentTaskId`).

### Dépendances
- Les tâches peuvent dépendre d'autres tâches (`dependencies`), indiquant un ordre d'exécution strict.

### Échéances
- **Status Échue** : Si `Date d'échéance < Date du jour` (Rouge).
- **À venir** : Sinon (Bleu).

## 4. Planning et Échéances

### Jalons
- **Statuts** : Atteint (Vert), Retardé (Rouge), À venir (Bleu).

### Chemin Critique
- Identifie les tâches de **priorité Haute** (`priority: 'high'`) qui impactent la date de fin du projet.

## 5. Gestion des Temps (Timesheets)

### Statuts des relevés
- **Approuvé** (Vert)
- **Rejeté** (Rouge)
- **Soumis** (Jaune)
- **Brouillon** (Gris)

### Facturation
- **Montant Facturable** = `Heures facturables (approuvées) * Taux Horaire`
- *Note : Le taux horaire utilisé dans le calcul d'exemple est de 50€/h.*

## 6. Budgets Détaillés

### Écarts (Variance)
- **Écart** = `Budget prévu - Consommé`
  - **Positif (Vert)** : Sous-consommation (économie).
  - **Négatif (Rouge)** : Surconsommation (dépassement).

### Rentabilité
- **Marge (€)** = `Revenus (Budget) - Coûts (Dépenses)`
- **Marge (%)** = `(Marge / Revenus) * 100`
- **Taux de rentabilité** = `(Marge nette / Revenus) * 100`

### Refacturation
- Suivi des frais à refacturer au client avec statut "Facturé" ou "À facturer".

## 7. Reporting et Indicateurs

### Avancement
- **Taux de complétion** = `(Tâches complétées / Tâches totales) * 100`
- **Écart d'heures (Tâches)** = `Heures réelles - Heures estimées`

### Burndown Chart
- Visualisation de la vélocité (tâches restantes vs temps), bien que le code actuel montre principalement un composant structurel fictif pour le graphique.

---
*Ce document est basé sur l'analyse statique du fichier `Projects.tsx`.*
