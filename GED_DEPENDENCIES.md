# Dépendances NPM pour le Module GED

## Dépendances Principales

### Compression de Fichiers
```bash
npm install pako
npm install --save-dev @types/pako
```
**Usage:** Compression automatique des fichiers lors de l'upload

### Chiffrement
```bash
npm install crypto-js
npm install --save-dev @types/crypto-js
```
**Usage:** Chiffrement AES des documents sensibles, génération de checksums

## Dépendances Optionnelles (Recommandées)

### OCR (Reconnaissance de Texte)
```bash
npm install tesseract.js
```
**Usage:** Extraction de texte depuis les images et PDFs scannés

### Manipulation PDF
```bash
npm install pdf-lib
```
**Usage:** Application de watermarks, fusion de PDFs, manipulation de documents

### Visualisation PDF
```bash
npm install react-pdf
npm install --save-dev @types/react-pdf
```
**Usage:** Affichage des PDFs dans l'interface utilisateur

### Signature Électronique
```bash
npm install signature_pad
npm install --save-dev @types/signature_pad
```
**Usage:** Capture de signatures manuscrites

### Drag & Drop Avancé
```bash
npm install react-dropzone
```
**Usage:** Zone de drop améliorée pour l'upload de fichiers

## Installation Complète

```bash
# Installation de toutes les dépendances principales
npm install pako crypto-js

# Installation des types TypeScript
npm install --save-dev @types/pako @types/crypto-js

# Installation des dépendances optionnelles (recommandé)
npm install tesseract.js pdf-lib react-pdf signature_pad react-dropzone
npm install --save-dev @types/react-pdf @types/signature_pad
```

## Vérification

Après installation, vérifier que les dépendances sont dans `package.json`:

```json
{
  "dependencies": {
    "pako": "^2.1.0",
    "crypto-js": "^4.2.0",
    "tesseract.js": "^5.0.0",
    "pdf-lib": "^1.17.1",
    "react-pdf": "^7.7.0",
    "signature_pad": "^4.1.7",
    "react-dropzone": "^14.2.3"
  },
  "devDependencies": {
    "@types/pako": "^2.0.3",
    "@types/crypto-js": "^4.2.1",
    "@types/react-pdf": "^7.0.0",
    "@types/signature_pad": "^2.3.5"
  }
}
```

## Notes

- **pako** et **crypto-js** sont **obligatoires** pour les fonctionnalités de compression et chiffrement
- Les autres dépendances sont optionnelles mais fortement recommandées pour une expérience complète
- Toutes les dépendances sont compatibles avec React et TypeScript
