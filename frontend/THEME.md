# Guide d'inversion des couleurs

Pour inverser facilement les gris et les blancs dans toute l'application, modifiez les variables CSS dans `src/index.css`.

## Inversion rapide

Dans `src/index.css`, trouvez la section `:root` et échangez ces valeurs :

### AVANT (fond blanc, texte sombre)
```css
--color-bg-primary: #ffffff;
--color-bg-secondary: #f5f5f5;
--color-text-primary: #1a1a1a;
--color-text-secondary: #535353;
```

### APRÈS (fond sombre, texte clair)
```css
--color-bg-primary: #1a1a1a;
--color-bg-secondary: #353535;
--color-text-primary: #ffffff;
--color-text-secondary: #e8e8e8;
```

## Variables disponibles

- `--color-bg-primary` : Fond principal (body, nav, etc.)
- `--color-bg-secondary` : Fond secondaire (cartes, sections)
- `--color-bg-tertiary` : Fond tertiaire (hover, états)
- `--color-text-primary` : Texte principal
- `--color-text-secondary` : Texte secondaire
- `--color-text-tertiary` : Texte tertiaire/muted
- `--color-border` : Bordures
- `--color-border-light` : Bordures légères

## Classes CSS disponibles

Utilisez ces classes dans vos composants :

- `.bg-theme-primary` / `.bg-theme-secondary` / `.bg-theme-tertiary`
- `.text-theme-primary` / `.text-theme-secondary` / `.text-theme-tertiary`
- `.border-theme` / `.border-theme-light`
