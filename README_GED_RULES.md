# Règles Métier - Module GED (Gestion Électronique de Documents)

## Vue d'ensemble
Ce document décrit toutes les règles métier, formules de calcul et logiques implémentées dans le module GED.

---

## 1. Gestion des Dossiers (Arborescence)

### Règle 1.1: Comptage des documents par dossier
**Formule:**
```typescript
folderDocCount = documents.filter(doc => doc.category === folder.name).length
```

**Explication:**
- Chaque dossier affiche le nombre de documents qu'il contient
- Le comptage se fait en filtrant tous les documents dont la catégorie correspond exactement au nom du dossier
- Exemple: Le dossier "Contrats" affiche le nombre de documents ayant `category: 'Contrats'`

**Application:**
- Affichage en temps réel sous chaque icône de dossier
- Mise à jour automatique lors de l'ajout/suppression de documents

---

### Règle 1.2: Sélection et mise en surbrillance du dossier actif
**Formule:**
```typescript
isSelected = currentFolderId === folder.id
```

**Explication:**
- Un dossier est considéré comme sélectionné si son ID correspond à l'ID du dossier actuellement actif
- Le dossier sélectionné reçoit un style visuel distinct (bordure bleue, ombre portée)
- Un seul dossier peut être sélectionné à la fois

**Application:**
- Bordure bleue de 2px pour le dossier sélectionné
- Bordure grise pour les dossiers non sélectionnés
- Icône bleue foncée pour le dossier actif

---

### Règle 1.3: Navigation dans l'arborescence (Breadcrumb)
**Formule:**
```typescript
breadcrumb = [...breadcrumb.slice(0, 1), { id: folder.id, name: folder.name }]
```

**Explication:**
- Le fil d'Ariane (breadcrumb) conserve toujours la racine comme premier élément
- Lors de la sélection d'un dossier, on remplace tout sauf la racine par le nouveau dossier
- Cela crée une navigation à 2 niveaux: Racine > Dossier sélectionné

**Application:**
- Affichage en haut de page: "Racine > Contrats"
- Permet de revenir à la racine en cliquant sur "Racine"
- Affiche le chemin actuel de navigation

---

## 2. Filtrage des Documents

### Règle 2.1: Filtrage par recherche textuelle
**Formule:**
```typescript
matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
```

**Explication:**
- La recherche est insensible à la casse (conversion en minuscules)
- Recherche dans 3 champs: nom du document, nom de l'uploadeur, et tags
- Un document correspond si au moins un des champs contient la requête de recherche
- Utilise `includes()` pour une recherche partielle (pas besoin de correspondance exacte)

**Application:**
- Barre de recherche en temps réel
- Recherche dans: "Contrat_Acme_2026.pdf", "Marie Dupont", ["Contrat", "Signé"]

---

### Règle 2.2: Filtrage par catégorie
**Formule:**
```typescript
matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
```

**Explication:**
- Si la catégorie sélectionnée est 'all', tous les documents sont affichés
- Sinon, seuls les documents dont la catégorie correspond exactement sont affichés
- Comparaison stricte (===) pour éviter les correspondances partielles

**Application:**
- Dropdown de sélection de catégorie
- Option "Toutes les catégories" affiche tout
- Sélection d'une catégorie spécifique filtre les résultats

---

### Règle 2.3: Filtrage par dossier sélectionné
**Formule:**
```typescript
matchesFolder = !currentFolderId || doc.category === breadcrumb[breadcrumb.length - 1]?.name
```

**Explication:**
- Si aucun dossier n'est sélectionné (`!currentFolderId`), tous les documents sont affichés
- Si un dossier est sélectionné, seuls les documents dont la catégorie correspond au nom du dossier sont affichés
- Utilise le dernier élément du breadcrumb pour obtenir le nom du dossier actuel

**Application:**
- Clic sur dossier "Contrats" → affiche uniquement les documents de catégorie "Contrats"
- Clic sur "Afficher tous les documents" → réinitialise le filtre

---

### Règle 2.4: Filtrage combiné
**Formule:**
```typescript
filteredDocuments = documents.filter(doc => 
  matchesSearch && matchesCategory && matchesFolder
)
```

**Explication:**
- Les trois filtres (recherche, catégorie, dossier) sont appliqués simultanément avec un ET logique
- Un document doit satisfaire TOUS les critères pour être affiché
- L'ordre d'application n'a pas d'importance (opération commutative)

**Application:**
- Recherche "Acme" + Dossier "Contrats" + Catégorie "Contrats" = documents Acme dans Contrats
- Permet des recherches très précises

---

## 3. Statistiques (KPI)

### Règle 3.1: Total des documents
**Formule:**
```typescript
totalDocuments = documents.length
```

**Explication:**
- Compte simplement le nombre total d'éléments dans le tableau de documents
- Inclut tous les documents quel que soit leur statut

**Application:**
- Carte KPI "Total Documents"
- Affichage en temps réel

---

### Règle 3.2: Documents approuvés
**Formule:**
```typescript
approvedCount = documents.filter(d => d.status === 'approved').length
```

**Explication:**
- Filtre les documents ayant le statut 'approved'
- Compte le nombre de documents filtrés
- Statut strictement égal à 'approved' (pas 'Approved' ou 'APPROVED')

**Application:**
- Carte KPI "Approuvés" avec icône verte
- Indicateur de documents validés

---

### Règle 3.3: Documents en attente
**Formule:**
```typescript
pendingCount = documents.filter(d => d.status === 'pending').length
```

**Explication:**
- Filtre les documents ayant le statut 'pending'
- Représente les documents en cours de validation
- Nécessite une action de l'utilisateur

**Application:**
- Carte KPI "En attente" avec icône orange
- Alerte visuelle pour les documents nécessitant une action

---

### Règle 3.4: Nombre de dossiers
**Formule:**
```typescript
folderCount = gedFolders.length
```

**Explication:**
- Compte le nombre total de dossiers dans l'arborescence
- Actuellement fixé à 4 dossiers: Contrats, Factures, Projets, RH
- Peut être dynamique si des dossiers sont ajoutés/supprimés

**Application:**
- Carte KPI "Dossiers" avec icône de dossier
- Indicateur de l'organisation documentaire

---

### Règle 3.5: Nombre de catégories
**Formule:**
```typescript
categoryCount = categories.length
```

**Explication:**
- Compte le nombre de catégories disponibles dans le système
- Les catégories sont prédéfinies dans un tableau
- Utilisé pour la classification des documents

**Application:**
- Carte KPI "Catégories" avec icône de tag
- Indicateur de la diversité documentaire

---

## 4. Affichage des Documents

### Règle 4.1: Affichage conditionnel selon le mode
**Formule:**
```typescript
displayMode = viewMode === 'grid' ? GridView : 
              viewMode === 'list' ? ListView : 
              KanbanView
```

**Explication:**
- Trois modes d'affichage disponibles: grille, liste, kanban
- Un seul mode actif à la fois
- Le mode détermine la mise en page et les informations affichées

**Application:**
- Boutons de sélection de vue en haut de page
- Grille: cartes en colonnes
- Liste: tableau détaillé
- Kanban: colonnes par statut

---

### Règle 4.2: Message "Aucun document"
**Formule:**
```typescript
showEmptyMessage = filteredDocuments.length === 0
```

**Explication:**
- Si après tous les filtres, aucun document ne correspond, affiche un message
- Évite d'afficher une page vide sans explication
- Améliore l'expérience utilisateur

**Application:**
- Icône de fichier grisée
- Message "Aucun document trouvé"
- Centré dans la zone d'affichage

---

## 5. Gestion des Statuts

### Règle 5.1: Couleur selon le statut
**Formule:**
```typescript
statusColor = status === 'approved' ? 'green' :
              status === 'pending' ? 'yellow' :
              status === 'rejected' ? 'red' : 'gray'
```

**Explication:**
- Chaque statut a une couleur associée pour identification rapide
- Vert = approuvé (positif)
- Jaune/Orange = en attente (neutre, action requise)
- Rouge = rejeté (négatif)
- Gris = par défaut

**Application:**
- Badges de statut colorés
- Colonnes Kanban colorées
- Indicateurs visuels cohérents

---

### Règle 5.2: Libellé du statut
**Formule:**
```typescript
statusLabel = status === 'approved' ? 'Approuvé' :
              status === 'pending' ? 'En attente' :
              status === 'rejected' ? 'Rejeté' : status
```

**Explication:**
- Conversion du statut technique en libellé français
- Améliore la lisibilité pour l'utilisateur
- Fallback sur la valeur brute si statut inconnu

**Application:**
- Affichage dans les cartes de documents
- Filtres de statut
- Rapports et exports

---

## 6. Gestion des Fichiers

### Règle 6.1: Icône selon le type de fichier
**Formule:**
```typescript
fileIcon = type === 'pdf' ? PdfIcon :
           type === 'docx' ? WordIcon :
           type === 'xlsx' ? ExcelIcon :
           type === 'pptx' ? PowerPointIcon :
           type.includes('image') ? ImageIcon :
           DefaultFileIcon
```

**Explication:**
- Chaque type de fichier a une icône spécifique
- Reconnaissance visuelle immédiate du type de document
- Icône par défaut pour les types non reconnus

**Application:**
- Affichage dans les cartes de documents
- Vue liste avec icônes
- Améliore l'UX

---

### Règle 6.2: Formatage de la taille de fichier
**Formule:**
```typescript
formattedSize = size >= 1024 ? `${(size/1024).toFixed(1)} MB` : `${size} KB`
```

**Explication:**
- Conversion automatique en MB si la taille dépasse 1024 KB
- Arrondi à 1 décimale pour la lisibilité
- Affichage de l'unité appropriée

**Application:**
- "2.4 MB" pour les gros fichiers
- "856 KB" pour les fichiers moyens
- Cohérence dans l'affichage

---

## 7. Navigation et Interactions

### Règle 7.1: Retour à la racine
**Formule:**
```typescript
resetToRoot = () => {
  setCurrentFolderId(undefined);
  setBreadcrumb([{ id: undefined, name: 'Racine' }]);
}
```

**Explication:**
- Réinitialise le dossier sélectionné à `undefined`
- Réinitialise le breadcrumb à un seul élément (Racine)
- Affiche tous les documents sans filtre de dossier

**Application:**
- Bouton "Afficher tous les documents"
- Clic sur "Racine" dans le breadcrumb
- Réinitialisation de la vue

---

### Règle 7.2: Sélection de dossier
**Formule:**
```typescript
selectFolder = (folderId, folderName) => {
  setCurrentFolderId(folderId);
  setBreadcrumb([...breadcrumb.slice(0, 1), { id: folderId, name: folderName }]);
}
```

**Explication:**
- Définit le dossier actif
- Met à jour le breadcrumb en conservant la racine
- Déclenche le filtrage des documents

**Application:**
- Clic sur une carte de dossier
- Navigation dans l'arborescence
- Mise à jour de l'affichage

---

## 8. Services GED Implémentés

### 8.1 FolderService
**Fonctionnalités:**
- Création de dossiers hiérarchiques
- Gestion des espaces de travail
- Navigation dans l'arborescence
- Permissions par dossier

**Règles métier:**
- Un dossier peut contenir des sous-dossiers
- Chaque dossier a des permissions configurables
- Les espaces de travail ont des membres avec des rôles

---

### 8.2 UploadService
**Fonctionnalités:**
- Upload massif de fichiers
- Compression automatique (> 1MB)
- Validation des formats
- Barre de progression

**Règles métier:**
- Fichiers > 1MB sont automatiquement compressés
- Formats supportés: PDF, DOC, XLS, PPT, Images
- Taille maximale: 10MB par fichier
- Upload par lots avec retry en cas d'erreur

---

### 8.3 SearchService
**Fonctionnalités:**
- Recherche full-text
- Recherche OCR dans les PDF
- Suggestions intelligentes
- Recherches sauvegardées

**Règles métier:**
- Recherche dans nom, contenu, métadonnées, tags
- Suggestions après 3 caractères
- Scoring de pertinence pour le classement
- Historique des recherches

---

### 8.4 MetadataService
**Fonctionnalités:**
- Champs personnalisés (8 types)
- Validation des données
- Indexation automatique
- Extraction de métadonnées

**Règles métier:**
- Types: text, number, date, select, multiselect, boolean, url, email
- Validation selon le type de champ
- Champs obligatoires configurables
- Métadonnées par catégorie

---

### 8.5 SignatureService
**Fonctionnalités:**
- Workflow de signature électronique
- Multi-signataires
- Signature séquentielle
- Rappels automatiques

**Règles métier:**
- Ordre de signature défini
- Expiration configurable
- Vérification des signatures
- Types: électronique, digitale, manuscrite

---

### 8.6 SecurityService
**Fonctionnalités:**
- Chiffrement AES
- Watermark personnalisable
- Logs d'accès
- Audit de sécurité

**Règles métier:**
- Chiffrement pour documents sensibles
- Watermark avec texte/position configurables
- Traçabilité complète des accès
- Rapports d'audit périodiques

---

### 8.7 NotificationService
**Fonctionnalités:**
- Notifications multi-événements
- Préférences utilisateur
- Statut lu/non-lu
- Nettoyage automatique

**Règles métier:**
- Événements: upload, update, share, approval, signature, expiration
- Notifications par email/in-app
- Préférences par type d'événement
- Suppression après 30 jours

---

### 8.8 IntegrationService
**Fonctionnalités:**
- Liens avec entités CRM
- Types de liens multiples
- Statistiques de liens
- Import/Export

**Règles métier:**
- Entités: Companies, Contacts, Opportunities, Invoices, Projects, Employees, Emails
- Types de liens: attachment, reference, related
- Détection des documents orphelins
- Export des liens en JSON

---

## 9. Formules de Calcul Avancées

### 9.1 Taux d'approbation
**Formule:**
```typescript
approvalRate = (approvedCount / totalDocuments) * 100
```

**Explication:**
- Pourcentage de documents approuvés sur le total
- Indicateur de qualité documentaire
- Arrondi à 2 décimales

---

### 9.2 Documents par dossier (moyenne)
**Formule:**
```typescript
avgDocsPerFolder = totalDocuments / folderCount
```

**Explication:**
- Nombre moyen de documents par dossier
- Indicateur de répartition
- Aide à identifier les dossiers surchargés

---

### 9.3 Taux de remplissage des métadonnées
**Formule:**
```typescript
metadataCompleteness = (documentsWithAllMetadata / totalDocuments) * 100
```

**Explication:**
- Pourcentage de documents avec toutes les métadonnées remplies
- Indicateur de qualité des données
- Objectif: > 90%

---

## 10. Règles de Validation

### 10.1 Validation du nom de fichier
**Règle:**
- Longueur minimale: 3 caractères
- Longueur maximale: 255 caractères
- Caractères interdits: `< > : " / \ | ? *`
- Extension obligatoire

---

### 10.2 Validation de la taille
**Règle:**
- Taille minimale: 1 KB
- Taille maximale: 10 MB
- Compression automatique si > 1 MB
- Rejet si > 10 MB après compression

---

### 10.3 Validation du format
**Règle:**
- Formats autorisés: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG, GIF
- Vérification par extension ET MIME type
- Scan antivirus (simulé)

---

## Conclusion

Ce document décrit toutes les règles métier implémentées dans le module GED. Chaque règle est accompagnée de sa formule de calcul et d'une explication détaillée pour faciliter la maintenance et l'évolution du système.

**Version:** 1.0  
**Date:** 30 janvier 2026  
**Auteur:** Équipe de développement GED
