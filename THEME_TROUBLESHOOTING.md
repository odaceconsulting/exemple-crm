# Guide de Dépannage - Système de Thème

## ✅ Vérification du Système de Thème

### 1. Vérifier que le ThemeContext est chargé
Ouvrez la console du navigateur (F12) et tapez:
```javascript
// Vous devriez voir une classe comme 'theme-light', 'theme-blue', etc.
document.documentElement.className
```

### 2. Vérifier que le thème est sauvegardé
```javascript
localStorage.getItem('crmTheme')
// Devrait retourner: 'light', 'blue', 'green', ou 'purple'
```

### 3. Tester le changement de thème
Dans la console:
```javascript
// Simuler un changement de thème
document.documentElement.classList.remove('theme-light', 'theme-blue', 'theme-green', 'theme-purple');
document.documentElement.classList.add('theme-green');
document.documentElement.setAttribute('data-theme', 'green');
```

Les couleurs devraient changer immédiatement au vert.

## 🔧 Fichiers Impliqués

### 1. **src/app/context/ThemeContext.tsx**
- Gère l'état du thème
- Charge/sauvegarde en localStorage
- Applique les classes CSS au DOM

### 2. **src/styles/theme.css**
- Définit les variables CSS pour chaque thème
- Contient les styles de base

### 3. **src/styles/theme-dynamic.css**
- Surcharge les classes Tailwind bleues avec les couleurs du thème
- Contient les transitions fluides

### 4. **src/styles/index.css**
- Importe tous les fichiers CSS (y compris theme-dynamic.css)

## 🐛 Dépannage

### Les couleurs ne changent pas
**Solution:** Vérifiez que:
1. ✅ `theme-dynamic.css` est importé dans `index.css`
2. ✅ Les classes CSS avec `!important` sont appliquées
3. ✅ La classe de thème est ajoutée à `html` ET `body`

Pour forcer une actualisation:
```javascript
// Dans la console
location.reload();
```

### Le thème ne persiste pas au reload
**Solution:** Vérifiez localStorage:
```javascript
localStorage.getItem('crmTheme')
```

Si vide, le contexte n'a pas sauvegardé. Vérifiez que `setTheme()` est appelé.

### Les styles ne s'appliquent qu'au reload
**Solution:** Le système HMR (Hot Module Replacement) de Vite peut être lent. Appuyez sur `Refresh` manuellement ou attendez quelques secondes.

## 📱 Comment Tester les Thèmes

### Via l'Interface
1. Cliquez sur l'icône **Palette** 🎨 dans le header
2. Sélectionnez un thème (Clair, Bleu, Vert, Violet)
3. Les couleurs devraient changer immédiatement

### Via la Console
```javascript
// Changer le thème depuis la console
const event = new CustomEvent('themechange', { detail: 'green' });
window.dispatchEvent(event);

// Ou directement
localStorage.setItem('crmTheme', 'purple');
location.reload();
```

## 🎨 Structure des Thèmes CSS

Chaque thème repose sur ces classes:
```css
html.theme-blue { --theme-primary: #2563eb; }
html.theme-green { --theme-primary: #059669; }
html.theme-purple { --theme-primary: #9333ea; }
```

Et surcharge les classes Tailwind:
```css
html.theme-green .bg-blue-600 { 
  background-color: #059669 !important; 
}
```

## ✨ Améliorations Futures

- [ ] Thème dark mode
- [ ] Thèmes personnalisés
- [ ] Prévisualisation du thème avant sauvegarde
- [ ] Synchronisation du thème système
- [ ] Exporter/importer des thèmes

## 📞 Support

Si les couleurs ne changent toujours pas:
1. Vérifiez la console (F12) pour les erreurs
2. Vérifiez que tous les fichiers CSS sont chargés
3. Vérifiez les règles CSS avec l'onglet `Elements` (F12)
4. Forcez un refresh complet: `Ctrl+Shift+R` (Windows/Linux) ou `Cmd+Shift+R` (Mac)

---

**Dernière mise à jour:** 27 janvier 2026
