# Système de Thème Global - Documentation

## Vue d'ensemble

Un système de thème global a été implémenté pour permettre aux utilisateurs de personnaliser les couleurs du CRM. Le thème sélectionné s'applique **à l'ensemble de l'application** et est sauvegardé en localStorage.

## Fichiers Créés/Modifiés

### 1. **ThemeContext.tsx** (Nouveau)
📁 Chemin: `src/app/context/ThemeContext.tsx`

- Crée un contexte React global pour gérer le thème
- Fournit le hook `useTheme()` pour accéder au thème partout dans l'app
- Sauvegarde les préférences en localStorage
- Supporte 4 thèmes: `light` | `blue` | `green` | `purple`

**Fonctions principales:**
- `setTheme(theme)` - Change le thème global
- `getThemeColors()` - Retourne les couleurs du thème actuel
- `applyThemeToDOM()` - Applique le thème à tout le DOM

### 2. **main.tsx** (Modifié)
- Enveloppe l'App avec `<ThemeProvider>`
- Permet l'accès au contexte thème partout dans l'application

### 3. **App.tsx** (Modifié)
Ajouts au Header:
- Import du hook `useTheme`
- Bouton **Palette** pour ouvrir le sélecteur de thème
- Dialog pour choisir entre 4 thèmes
- Les notifications restent aussi dans le header

Le bouton de thème apparaît **avant** le bouton de notifications dans la barre du haut.

### 4. **Dashboard.tsx** (Modifié)
Suppressions:
- Suppression des états locaux de thème (`showThemeSettings`, `theme`, etc.)
- Suppression des boutons/dialogues de thème du dashboard
- Suppression de la logique de sauvegarde localStorage du thème
- Les notifications restent accessibles via le header

## Utilisation

### Pour les composants
```tsx
import { useTheme } from '@/app/context/ThemeContext';

function MyComponent() {
  const { theme, setTheme, getThemeColors } = useTheme();
  
  // Accéder au thème actuel
  console.log(theme); // 'light' | 'blue' | 'green' | 'purple'
  
  // Obtenir les couleurs du thème
  const colors = getThemeColors();
  console.log(colors.primary); // 'bg-blue-600 hover:bg-blue-700'
  
  // Changer le thème
  setTheme('green');
}
```

### Structure des couleurs par thème

```javascript
{
  light: {
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-gray-100',
    accent: 'text-blue-600',
    text: 'text-gray-900',
    bg: 'bg-gray-50',
    card: 'bg-white'
  },
  blue: {
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-blue-100',
    accent: 'text-blue-600',
    text: 'text-blue-900',
    bg: 'bg-blue-50',
    card: 'bg-blue-50 border border-blue-200'
  },
  green: { /* ... */ },
  purple: { /* ... */ }
}
```

## Thèmes Disponibles

### 🌫️ Clair (light)
- Couleur primaire: Gris/Bleu
- Idéal pour un rendu neutre

### 🔵 Bleu (blue)
- Couleur primaire: Bleu vif
- Professionnel et confiant

### 🟢 Vert (green)
- Couleur primaire: Vert
- Frais et rassurant

### 🟣 Violet (purple)
- Couleur primaire: Violet
- Créatif et innovant

## Stockage et Persistance

- **localStorage key**: `crmTheme`
- **Format**: Chaîne de caractères ('light' | 'blue' | 'green' | 'purple')
- **Chargement**: Au démarrage de l'application
- **Sauvegarde**: Automatique lors du changement

## Interface Utilisateur

### Header
```
[Logo] [Recherche] ... [Thème 🎨] [Notifications 🔔] [Profil 👤]
```

Cliquer sur l'icône **Palette** ouvre un dialog avec 4 options de thème.

### Sélecteur de Thème
```
┌─────────────────────────┐
│  Thème Couleur          │
├─────────────────────────┤
│ [Clair]  [Bleu]         │
│ [Vert]   [Violet]       │
│                         │
│ Thème sélectionné ✓     │
└─────────────────────────┘
```

Le thème actuellement sélectionné affiche:
- Fond légèrement teinte
- Bordure en ring (focus ring)

## Intégration Future

Pour utiliser les couleurs du thème dans un composant:

```tsx
import { useTheme } from '@/app/context/ThemeContext';
import { Card } from '@/app/components/ui/card';

export function MyCard() {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  
  return (
    <div className={colors.bg}>
      <Card className={colors.card}>
        <button className={colors.primary}>
          Action
        </button>
      </Card>
    </div>
  );
}
```

## Points Importants

✅ **Le thème persiste** lors du rechargement de la page  
✅ **S'applique globalement** à l'ensemble du CRM  
✅ **Facile à étendre** avec de nouveaux thèmes  
✅ **Sauvegarde automatique** en localStorage  
✅ **Aucun rechargement** nécessaire après changement  

## Prochaines Étapes

Pour une intégration complète:
1. Adapter les couleurs des composants clés pour utiliser les thèmes
2. Ajouter des transitions de couleur fluides
3. Implémenter des thèmes personnalisés (mode dark, etc.)
4. Synchroniser le thème avec les préférences système

---

**Dernière mise à jour:** 27 janvier 2026
