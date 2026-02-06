# 🍎 NutriScan - Scanner Nutritionnel

Application Next.js pour scanner des aliments et afficher leurs informations nutritionnelles.

## 🚀 Technologies

- **Next.js 16** avec App Router
- **React 19** avec React Compiler
- **TypeScript**
- **Tailwind CSS v4**
- **Lucide React** (icônes)
- **pnpm** (gestionnaire de packages)

## 📦 Installation

```bash
pnpm install
```

## 🛠️ Développement

```bash
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🏗️ Build

```bash
pnpm build
pnpm start
```

## 📁 Structure du projet

```
src/
├── app/                      # App Router Next.js
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Page d'accueil
│   └── globals.css          # Styles globaux
├── components/              # Composants React
│   ├── ui/                  # Composants UI réutilisables
│   │   ├── button.tsx
│   │   └── card.tsx
│   ├── AppHeader.tsx        # En-tête de l'application
│   ├── CameraScanner.tsx    # Scanner caméra
│   ├── NutrientBar.tsx      # Barre de nutriment
│   ├── NutritionResult.tsx  # Résultat nutritionnel
│   └── ScanHistory.tsx      # Historique des scans
├── hooks/                   # Hooks personnalisés
│   └── useCamera.ts         # Hook pour la gestion caméra
└── lib/                     # Utilitaires
    ├── mockNutrition.ts     # Données simulées
    └── utils.ts             # Fonctions utilitaires
```

## 🎨 Fonctionnalités

- ✅ Scanner d'aliments via caméra
- ✅ Affichage des informations nutritionnelles
- ✅ Historique des scans
- ✅ Design responsive
- ✅ Mode sombre/clair
- ✅ Animations fluides
- ⚠️ Données simulées (API à connecter)

## 🔧 Configuration

### Polices
- **Inter** - Police principale
- **Space Grotesk** - Titres

### Couleurs personnalisées
- Protéines : Bleu (`--nutrient-protein`)
- Glucides : Orange (`--nutrient-carbs`)
- Lipides : Rouge (`--nutrient-fat`)
- Fibres : Vert (`--nutrient-fiber`)

## 📝 Notes

- Les données nutritionnelles sont actuellement simulées
- L'API de reconnaissance d'images doit être intégrée pour un scan réel
- Le React Compiler est activé pour optimiser les performances

## 🔒 Permissions

L'application nécessite l'accès à la caméra pour scanner les aliments.

## 📚 Learn More

Pour en savoir plus sur Next.js :

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

