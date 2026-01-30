# Règles Métier de la Page Pipeline

Ce document liste toutes les règles métier, formules de calcul et explications identifiées dans la page Pipeline Commercial du CRM.

---

## 1. Prévisions Commerciales

### 1.1 Prévision Pondérée par Probabilité (Forecast)

**Règle métier :** Calcule la prévision de revenus pour les 3 prochains mois en pondérant chaque opportunité par sa probabilité de succès et en fonction de sa date de clôture prévue.

**Formule de calcul :**
```
Pour chaque opportunité ouverte (stage ≠ 'closed') :
  Prévision pondérée = (Montant × Probabilité) / 100

Pour chaque mois (M0, M1, M2) :
  Prévision_mois = Σ(Prévision pondérée des opportunités se clôturant ce mois)
  
Où :
  totalMonthDiff = (année_clôture - année_actuelle) × 12 + (mois_clôture - mois_actuel)
  
  Si totalMonthDiff >= 0 ET totalMonthDiff < 3 :
    monthlyForecast[totalMonthDiff] += Prévision pondérée
```

**Détails du calcul :**
```javascript
const closeDate = new Date(opportunité.closeDate);
const monthDiff = closeDate.getMonth() - currentMonth;
const yearDiff = closeDate.getFullYear() - currentYear;
const totalMonthDiff = yearDiff * 12 + monthDiff;

if (totalMonthDiff >= 0 && totalMonthDiff < 3) {
  const weighted = (opportunité.value × opportunité.probability) / 100;
  monthlyForecast[totalMonthDiff] += weighted;
}
```

**Explication :**
- Seules les opportunités avec statut différent de "closed" sont prises en compte
- La date de clôture prévue (`closeDate`) détermine le mois de prévision (0 = mois actuel, 1 = mois suivant, 2 = dans 2 mois)
- La probabilité est exprimée en pourcentage (0-100%)
- Cette méthode donne une prévision plus réaliste que la simple somme des montants
- Le forecast Q1 est la somme des 3 mois de prévision

**Exemple :**
- Date actuelle : Janvier 2026
- Opportunité 1 : €50,000, probabilité 75%, clôture prévue Février 2026 (M1) → Contribution : €37,500
- Opportunité 2 : €30,000, probabilité 50%, clôture prévue Mars 2026 (M2) → Contribution : €15,000
- Opportunité 3 : €40,000, probabilité 60%, clôture prévue Janvier 2026 (M0) → Contribution : €24,000
- Prévision M0 : €24,000
- Prévision M1 : €37,500
- Prévision M2 : €15,000
- Forecast Q1 : €76,500

---

### 1.2 Forecast Trimestriel (Q1)

**Règle métier :** Somme des prévisions pondérées des 3 prochains mois.

**Formule de calcul :**
```
Forecast Q1 = Prévision M0 + Prévision M1 + Prévision M2
```

**Explication :**
- Représente la prévision totale pour le trimestre en cours
- Utilisé pour la planification budgétaire et les objectifs commerciaux
- Plus fiable que la simple somme des montants car pondéré par probabilité

---

## 2. Métriques de Performance

### 2.1 Taux de Conversion du Pipeline

**Règle métier :** Calcule le pourcentage d'opportunités gagnées par rapport au total des opportunités dans le pipeline.

**Formule de calcul :**
```
Taux de Conversion (%) = (Nombre d'opportunités gagnées / Nombre total d'opportunités) × 100

Où :
  Opportunités gagnées = COUNT(opportunités où stage = 'closed')
  Total opportunités = COUNT(toutes les opportunités)
```

**Explication :**
- Les opportunités gagnées sont celles avec le statut "closed"
- Le taux de conversion mesure l'efficacité globale du processus de vente
- Utilisé pour les prévisions et l'analyse de performance
- Un taux élevé indique une bonne qualification des leads et un processus efficace

**Exemple :**
- Total opportunités : 100
- Opportunités gagnées : 25
- Taux de conversion : (25 / 100) × 100 = 25%

---

### 2.2 Durée Moyenne du Cycle de Vente

**Règle métier :** Calcule le nombre moyen de jours entre la création d'une opportunité et sa clôture (gagnée).

**Formule de calcul :**
```
Durée moyenne = Σ(Durée de chaque opportunité gagnée) / Nombre d'opportunités gagnées

Où :
  Durée = salesCycleDuration (si disponible)
  OU
  Durée = actualCloseDate - createdAt (en jours)
```

**Explication :**
- Seules les opportunités avec statut "closed" sont prises en compte
- Si `salesCycleDuration` est disponible, il est utilisé directement
- Sinon, la durée est calculée à partir des dates de création et de clôture
- Permet d'estimer le temps nécessaire pour convertir un lead en client
- Utilisé pour planifier les ressources et les objectifs temporels

**Exemple :**
- Opportunité 1 : 30 jours
- Opportunité 2 : 45 jours
- Opportunité 3 : 25 jours
- Durée moyenne : (30 + 45 + 25) / 3 = 33.3 jours ≈ 33 jours

---

## 3. Valeurs du Pipeline

### 3.1 Valeur Totale du Pipeline

**Règle métier :** Somme de tous les montants des opportunités non encore fermées.

**Formule de calcul :**
```
Pipeline Total = Σ(Montant de chaque opportunité où stage ≠ 'closed')
```

**Explication :**
- Représente le potentiel de revenus total en cours
- N'inclut pas les opportunités déjà gagnées (closed)
- Donne une vision optimiste du pipeline
- Utilisé pour évaluer la santé globale du portefeuille commercial

**Exemple :**
- Opportunité 1 (Prospection) : €50,000
- Opportunité 2 (Qualification) : €30,000
- Opportunité 3 (Négociation) : €40,000
- Pipeline Total : €120,000

---

### 3.2 Valeur Pondérée du Pipeline

**Règle métier :** Somme des montants des opportunités pondérés par leur probabilité de succès.

**Formule de calcul :**
```
Valeur Pondérée = Σ((Montant × Probabilité) / 100) pour toutes les opportunités où stage ≠ 'closed')
```

**Explication :**
- Donne une estimation plus réaliste du pipeline
- Prend en compte la probabilité de succès de chaque opportunité
- Plus fiable que la valeur totale pour les prévisions financières
- Utilisé pour la planification budgétaire et les prévisions de trésorerie

**Exemple :**
- Opportunité 1 : €50,000, probabilité 75% → Contribution : €37,500
- Opportunité 2 : €30,000, probabilité 50% → Contribution : €15,000
- Opportunité 3 : €40,000, probabilité 60% → Contribution : €24,000
- Valeur Pondérée : €76,500

---

### 3.3 Valeur des Affaires Gagnées

**Règle métier :** Somme des montants des opportunités ayant le statut "closed" (gagnées).

**Formule de calcul :**
```
Affaires Gagnées = Σ(Montant de chaque opportunité où stage = 'closed')
```

**Explication :**
- Représente les revenus réellement générés
- Utilisé pour mesurer la performance passée
- Permet de comparer les objectifs avec les réalisations
- Important pour les rapports de performance et les commissions

**Exemple :**
- Opportunité gagnée 1 : €50,000
- Opportunité gagnée 2 : €30,000
- Opportunité gagnée 3 : €40,000
- Affaires Gagnées : €120,000

---

## 4. Métriques par Colonne/Étape

### 4.1 Valeur Totale par Étape

**Règle métier :** Calcule la somme des montants de toutes les opportunités dans une étape spécifique du pipeline.

**Formule de calcul :**
```
Valeur Totale Étape = Σ(Montant de chaque opportunité où stage = étape.id)
```

**Explication :**
- Permet d'évaluer la valeur à chaque étape du processus
- Identifie les étapes avec le plus de valeur en jeu
- Utilisé pour prioriser les actions commerciales
- Affiche la répartition de la valeur dans le pipeline

**Exemple :**
- Étape "Négociation" :
  - Opportunité 1 : €50,000
  - Opportunité 2 : €30,000
  - Valeur Totale : €80,000

---

### 4.2 Valeur Pondérée par Étape

**Règle métier :** Calcule la somme des montants pondérés par probabilité pour toutes les opportunités d'une étape.

**Formule de calcul :**
```
Valeur Pondérée Étape = Σ((Montant × Probabilité) / 100) pour chaque opportunité où stage = étape.id
```

**Explication :**
- Donne une estimation réaliste de la valeur à chaque étape
- Prend en compte la probabilité de succès
- Permet de comparer la valeur réelle entre les étapes
- Utilisé pour l'analyse de performance par étape

**Exemple :**
- Étape "Négociation" :
  - Opportunité 1 : €50,000, probabilité 75% → €37,500
  - Opportunité 2 : €30,000, probabilité 50% → €15,000
  - Valeur Pondérée : €52,500

---

### 4.3 Score Moyen par Étape

**Règle métier :** Calcule le score moyen de toutes les opportunités dans une étape.

**Formule de calcul :**
```
Score Moyen Étape = Σ(Score de chaque opportunité) / Nombre d'opportunités dans l'étape

Où Score = opportunité.score (0-100) ou 0 si non défini
```

**Explication :**
- Le score mesure la qualité globale des opportunités à une étape
- Un score élevé indique des opportunités bien qualifiées
- Utilisé pour identifier les étapes nécessitant une attention particulière
- Permet de prioriser les actions d'amélioration

**Exemple :**
- Étape "Qualification" :
  - Opportunité 1 : score 85
  - Opportunité 2 : score 72
  - Opportunité 3 : score 68
  - Score Moyen : (85 + 72 + 68) / 3 = 75

---

### 4.4 Nombre d'Opportunités par Étape

**Règle métier :** Compte le nombre d'opportunités dans chaque étape du pipeline.

**Formule de calcul :**
```
Nombre Opportunités Étape = COUNT(opportunités où stage = étape.id)
```

**Explication :**
- Permet de visualiser la distribution des opportunités
- Identifie les goulots d'étranglement (étapes avec trop d'opportunités)
- Utilisé pour équilibrer le pipeline
- Affiche la charge de travail par étape

---

## 5. Système de Scoring

### 5.1 Calcul du Score d'Opportunité

**Règle métier :** Le score d'une opportunité est calculé automatiquement en fonction de plusieurs facteurs pondérés.

**Formule de calcul (selon configuration) :**
```
Score Total = Score_Probabilité + Score_Montant + Score_Activités

Où :
  Score_Probabilité = (Probabilité / 100) × 40 points (max)
  Score_Montant = (Montant / Montant_max) × 30 points (max)
  Score_Activités = (Nombre_activités / Nombre_max) × 30 points (max)
```

**Explication :**
- Le score est un indicateur de qualité de l'opportunité (0-100)
- Basé sur plusieurs facteurs configurables :
  - **Probabilité** : 0-40 points selon la probabilité de succès
  - **Montant** : 0-30 points selon la valeur de l'opportunité
  - **Activités** : 0-30 points selon l'historique d'activités
- Un score élevé indique une opportunité bien qualifiée et prometteuse
- Utilisé pour prioriser les opportunités et automatiser les actions

**Exemple :**
- Probabilité : 75% → Score probabilité : 30 points
- Montant : €50,000 (max €100,000) → Score montant : 15 points
- Activités : 5 activités (max 10) → Score activités : 15 points
- Score Total : 30 + 15 + 15 = 60/100

---

### 5.2 Configuration du Scoring

**Règle métier :** Les facteurs de scoring peuvent être personnalisés avec des poids différents.

**Formule de calcul :**
```
Score Total = Σ(Score_Facteur_i × Poids_Facteur_i / 100)

Où la somme des poids = 100%
```

**Explication :**
- Permet d'adapter le scoring aux besoins spécifiques de l'entreprise
- Chaque facteur peut avoir un poids personnalisé
- Les facteurs configurables incluent :
  - Probabilité de succès
  - Montant de l'opportunité
  - Historique d'activités
  - Engagement client
  - Ancienneté dans le pipeline
  - Et autres facteurs personnalisés

---

## 6. Règles d'Automatisation

### 6.1 Structure d'une Règle d'Automatisation

**Règle métier :** Les règles d'automatisation permettent d'exécuter des actions automatiquement lorsque certaines conditions sont remplies.

**Format d'une règle :**
```
SI (Condition déclenchement) ALORS (Action)

Exemples :
  - SI score > 75 ALORS Déplacer vers Proposition
  - SI priority = high ALORS Créer alerte
  - SI closeDate < Date_actuelle + 7 jours ALORS Créer rappel
```

**Explication :**
- Les règles peuvent être activées ou désactivées
- Permettent d'automatiser les tâches répétitives
- Améliorent l'efficacité du processus commercial
- Réduisent les risques d'oubli d'actions importantes

**Types de conditions :**
- Comparaisons numériques : `>`, `<`, `>=`, `<=`, `=`
- Comparaisons de chaînes : `=`, `contains`, `startsWith`
- Conditions de date : `before`, `after`, `within`
- Conditions booléennes : `AND`, `OR`, `NOT`

**Types d'actions :**
- Déplacer l'opportunité vers une autre étape
- Créer une alerte ou un rappel
- Assigner à un membre de l'équipe
- Mettre à jour la probabilité
- Envoyer une notification

---

### 6.2 Exécution des Règles d'Automatisation

**Règle métier :** Les règles sont évaluées à chaque modification d'une opportunité.

**Ordre d'exécution :**
1. Vérification si la règle est activée (`enabled = true`)
2. Évaluation de la condition de déclenchement
3. Si la condition est vraie, exécution de l'action
4. Enregistrement de l'action dans l'historique

**Explication :**
- Les règles sont évaluées en temps réel
- Plusieurs règles peuvent s'appliquer à la même opportunité
- L'ordre d'exécution peut être configuré
- Les actions peuvent être annulées si nécessaire

---

## 7. Gestion des Opportunités

### 7.1 Validation de Création d'Opportunité

**Règle métier :** Vérifie que les champs obligatoires sont remplis avant de créer une opportunité.

**Champs obligatoires :**
- `title` (Titre) : doit être non vide
- `company` (Entreprise) : doit être non vide
- `value` (Montant) : doit être un nombre > 0

**Champs optionnels avec valeurs par défaut :**
- `probability` : 50% si non spécifié
- `stage` : 'prospection' si non spécifié
- `priority` : 'medium' si non spécifié
- `closeDate` : Date actuelle + 30 jours si non spécifié
- `score` : 50 si non spécifié

**Formule de validation :**
```
Validation = TRUE si :
  title ≠ '' ET
  company ≠ '' ET
  value > 0
```

**Explication :**
- Si la validation échoue, un message d'erreur est affiché
- Les champs optionnels sont initialisés avec des valeurs par défaut
- Une nouvelle opportunité est créée avec :
  - `notes` : tableau vide
  - `attachments` : tableau vide
  - `activities` : tableau vide
  - `assignedTo` : tableau vide

---

### 7.2 Déplacement d'Opportunité (Drag & Drop)

**Règle métier :** Permet de déplacer une opportunité d'une étape à une autre par glisser-déposer.

**Conditions de déplacement :**
```
Déplacement autorisé si :
  - Étape source ≠ Étape destination
  - L'utilisateur a les permissions nécessaires
```

**Actions lors du déplacement :**
1. Mise à jour du champ `stage` de l'opportunité
2. Création d'une activité de type "stage_change" dans l'historique
3. Évaluation des règles d'automatisation
4. Mise à jour des métriques de la colonne

**Explication :**
- Le déplacement est effectué en temps réel
- L'historique est automatiquement mis à jour
- Les règles d'automatisation peuvent être déclenchées
- Les métriques des colonnes sont recalculées

---

### 7.3 Calcul de la Probabilité

**Règle métier :** La probabilité est affichée visuellement avec une barre de progression.

**Formule d'affichage :**
```
Largeur barre (%) = Probabilité (0-100%)
```

**Explication :**
- La probabilité est exprimée en pourcentage (0-100%)
- Affichée visuellement avec une barre de progression
- Utilisée pour le calcul de la valeur pondérée
- Peut être mise à jour manuellement ou automatiquement selon les règles

---

### 7.4 Classification des Priorités

**Règle métier :** Les opportunités sont classées par priorité (low, medium, high).

**Couleurs associées :**
- `high` : Rouge (bg-red-100 text-red-700)
- `medium` : Orange (bg-orange-100 text-orange-700)
- `low` : Bleu (bg-blue-100 text-blue-700)

**Explication :**
- La priorité permet de trier et filtrer les opportunités
- Les opportunités à priorité haute sont mises en évidence
- Utilisée pour la planification des actions commerciales
- Peut déclencher des règles d'automatisation

---

## 8. Gestion des Étapes du Pipeline

### 8.1 Création d'une Nouvelle Étape

**Règle métier :** Permet d'ajouter une nouvelle étape personnalisée au pipeline.

**Validation :**
```
Validation = TRUE si :
  newStageName ≠ '' ET
  newStageName est unique
```

**Génération de l'ID :**
```
stage.id = newStageName.toLowerCase().replace(/\s+/g, '-')
```

**Explication :**
- Le nom de l'étape est obligatoire
- L'ID est généré automatiquement à partir du nom (slug)
- La couleur peut être choisie parmi une palette prédéfinie
- L'étape est ajoutée à la fin du pipeline par défaut

---

### 8.2 Modification d'une Étape

**Règle métier :** Permet de modifier le nom et la couleur d'une étape existante.

**Validation :**
```
Validation = TRUE si :
  editingStageName ≠ '' ET
  editingStageName est unique (si différent de l'original)
```

**Explication :**
- Le nom et la couleur peuvent être modifiés
- Les opportunités dans cette étape ne sont pas affectées
- Les métriques sont recalculées automatiquement

---

### 8.3 Suppression d'une Étape

**Règle métier :** Permet de supprimer une étape du pipeline.

**Règle de sécurité :**
```
Suppression autorisée si :
  - L'étape ne contient pas d'opportunités
  OU
  - Les opportunités sont déplacées vers une autre étape
```

**Explication :**
- Par sécurité, les étapes avec opportunités ne peuvent pas être supprimées directement
- Il faut d'abord déplacer ou supprimer les opportunités
- Les étapes par défaut peuvent être protégées contre la suppression

---

## 9. Gestion des Notes et Fichiers

### 9.1 Ajout d'une Note

**Règle métier :** Permet d'ajouter une note à une opportunité.

**Validation :**
```
Validation = TRUE si :
  note.content.trim() ≠ ''
```

**Génération de l'ID :**
```
note.id = MAX(IDs existants) + 1
```

**Métadonnées automatiques :**
- `author` : Utilisateur actuel
- `createdAt` : Date et heure actuelles (ISO format)

**Explication :**
- Les notes permettent de documenter les interactions et décisions
- Chaque note est horodatée et associée à un auteur
- Les notes sont affichées dans l'ordre chronologique
- Utilisées pour le suivi de l'historique de l'opportunité

---

### 9.2 Ajout d'un Fichier Joint

**Règle métier :** Permet d'ajouter un fichier joint à une opportunité.

**Validation :**
```
Validation = TRUE si :
  file.name ≠ '' ET
  file.type ≠ '' ET
  file.size > 0
```

**Génération de l'ID :**
```
file.id = MAX(IDs existants) + 1
```

**Métadonnées automatiques :**
- `uploadedBy` : Utilisateur actuel
- `uploadedAt` : Date et heure actuelles (ISO format)

**Explication :**
- Les fichiers joints permettent de stocker des documents liés à l'opportunité
- Le format d'affichage de la taille : `(size / 1024).toFixed(2) KB`
- Les fichiers peuvent être téléchargés
- Utilisés pour stocker devis, contrats, présentations, etc.

---

## 10. Alertes et Rappels

### 10.1 Création d'une Alerte

**Règle métier :** Les alertes sont créées automatiquement ou manuellement pour attirer l'attention sur des opportunités.

**Types d'alertes :**
- `alert` : Alerte importante (ex: opportunité en retard)
- `reminder` : Rappel (ex: réunion prévue)
- `scoring` : Notification de score (ex: score atteint)

**Explication :**
- Les alertes sont affichées dans un panneau dédié
- Un badge indique le nombre d'alertes non lues
- Les alertes peuvent être rejetées (dismissed)
- Utilisées pour ne pas manquer d'actions importantes

---

### 10.2 Configuration d'un Rappel

**Règle métier :** Permet de configurer des rappels automatiques basés sur des conditions.

**Format :**
```
Rappel : SI (Condition) ALORS Créer rappel avec titre et description
```

**Exemples de conditions :**
- `closeDate < Date_actuelle + 7 jours` : Rappel avant clôture
- `lastActivity > 30 jours` : Rappel si inactivité
- `probability < 20%` : Rappel si probabilité faible

**Explication :**
- Les rappels aident à ne pas oublier d'actions importantes
- Configurables selon les besoins de l'équipe
- Peuvent être créés automatiquement par des règles

---

## 11. Calculs de Statistiques

### 11.1 Nombre Total d'Opportunités

**Règle métier :** Compte le nombre total d'opportunités dans le pipeline.

**Formule de calcul :**
```
Total Opportunités = COUNT(toutes les opportunités)
```

**Explication :**
- Utilisé pour les statistiques globales
- Permet de suivre la croissance du pipeline
- Affiche la charge de travail totale

---

### 11.2 Nombre d'Opportunités par Statut

**Règle métier :** Compte le nombre d'opportunités dans chaque statut (ouvertes vs fermées).

**Formule de calcul :**
```
Opportunités Ouvertes = COUNT(opportunités où stage ≠ 'closed')
Opportunités Fermées = COUNT(opportunités où stage = 'closed')
```

**Explication :**
- Permet de visualiser la répartition des opportunités
- Utilisé pour les rapports de performance
- Aide à identifier les opportunités nécessitant une attention

---

## 12. Règles de Filtrage et Recherche

### 12.1 Filtrage par Étape

**Règle métier :** Filtre les opportunités selon leur étape dans le pipeline.

**Formule de calcul :**
```
Opportunités filtrées = FILTER(opportunités où stage = étape.id)
```

**Explication :**
- Chaque colonne affiche uniquement les opportunités de son étape
- Le filtrage est automatique lors de l'affichage
- Permet de visualiser le pipeline par étape

---

### 12.2 Recherche d'Opportunité

**Règle métier :** Permet de rechercher une opportunité par titre, entreprise ou contact.

**Formule de recherche :**
```
Résultats = FILTER(opportunités où 
  title.contains(query) OU
  company.contains(query) OU
  contact.contains(query)
)
```

**Explication :**
- La recherche est insensible à la casse
- Recherche dans plusieurs champs simultanément
- Utilisée pour trouver rapidement une opportunité

---

## Notes Importantes

1. **Arrondissements :** 
   - Les valeurs monétaires sont arrondies à l'entier le plus proche
   - Les pourcentages sont arrondis à l'entier le plus proche
   - Les durées sont arrondies en jours

2. **Gestion des valeurs nulles :** 
   - Les valeurs nulles ou non définies sont traitées comme 0 dans les calculs
   - Les scores non définis sont considérés comme 0
   - Les durées non définies utilisent une valeur par défaut de 30 jours

3. **Calculs en temps réel :** 
   - Les métriques sont recalculées à chaque modification
   - Les valeurs pondérées sont mises à jour automatiquement
   - Les statistiques reflètent l'état actuel du pipeline

4. **Performance :** 
   - Les calculs sont optimisés pour gérer de grandes quantités d'opportunités
   - Les métriques par colonne sont calculées une seule fois par rendu

5. **Permissions :** 
   - Certaines actions peuvent nécessiter des permissions spécifiques
   - La suppression d'opportunités peut être restreinte
   - La modification des étapes peut nécessiter des droits administrateur

---

## Références

- Fichier source principal : `src/app/components/Pipeline.tsx`
- Fichier source alternatif : `src/app/components/PipelineEnhanced.tsx`
- Types de données : `src/app/types/index.ts`

---

*Document généré le : 2026-01-23*
*Version : 1.0*

