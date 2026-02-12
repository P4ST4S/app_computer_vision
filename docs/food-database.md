# foodDatabase.ts - Base de donnees et calcul de calories

## Emplacement

`src/lib/inference/foodDatabase.ts`

## Role

Ce fichier est la **source de verite** pour le calcul des calories dans l'application. Il contient :

- Une base de 32 aliments detectables par le modele YOLOv8
- Pour chaque aliment : les proprietes physiques (densite, epaisseur) et nutritionnelles (kcal, proteines, glucides, lipides, fibres pour 100 g)
- Ces donnees sont consommees par `postprocessing.ts` qui applique la formule mathematique pour convertir un masque de segmentation en calories

---

## Structure d'un aliment (`FoodInfo`)

Chaque entree de la base suit l'interface `FoodInfo` (`src/lib/inference/types.ts`) :

```ts
interface FoodInfo {
  id: number;               // ID de classe YOLO (0-31)
  name: string;             // Nom affiche (ex: "Poulet")
  density: number;          // Densite en g/cm3
  defaultThicknessCm: number; // Epaisseur estimee en cm
  caloriesPer100g: number;  // Kilocalories pour 100 g
  proteinPer100g: number;   // Proteines pour 100 g
  carbsPer100g: number;     // Glucides pour 100 g
  fatPer100g: number;       // Lipides pour 100 g
  fiberPer100g: number;     // Fibres pour 100 g
  icon: string;             // Emoji
}
```

Les champs `density` et `defaultThicknessCm` sont les **parametres physiques** qui permettent d'estimer le poids de l'aliment a partir de sa surface visible sur l'image. Les champs `*Per100g` sont les **parametres nutritionnels** qui convertissent ce poids en calories et macros.

---

## Les 32 aliments de la base

| ID | Aliment | Densite (g/cm3) | Epaisseur (cm) | kcal/100g | Prot. | Gluc. | Lip. | Fibres |
|----|---------|-----------------|-----------------|-----------|-------|-------|------|--------|
| 0 | Riz | 0.75 | 2.0 | 130 | 2.7 | 28.0 | 0.3 | 0.4 |
| 1 | Pain | 0.25 | 2.0 | 265 | 9.0 | 49.0 | 3.2 | 2.7 |
| 2 | Oeuf | 1.03 | 1.5 | 155 | 13.0 | 1.1 | 11.0 | 0.0 |
| 3 | Poulet | 0.95 | 2.5 | 239 | 27.0 | 0.0 | 14.0 | 0.0 |
| 4 | Porc | 1.00 | 2.0 | 242 | 27.0 | 0.0 | 14.0 | 0.0 |
| 5 | Steak | 1.05 | 1.2 | 271 | 25.0 | 0.0 | 19.0 | 0.0 |
| 6 | Poisson | 1.00 | 2.0 | 206 | 22.0 | 0.0 | 12.0 | 0.0 |
| 7 | Crevette | 0.95 | 1.0 | 99 | 24.0 | 0.2 | 0.3 | 0.0 |
| 8 | Saucisse | 0.95 | 2.5 | 301 | 12.0 | 2.0 | 27.0 | 0.0 |
| 9 | Tofu | 1.05 | 2.0 | 76 | 8.0 | 1.9 | 4.8 | 0.3 |
| 10 | Nouilles | 0.75 | 2.0 | 138 | 4.5 | 25.0 | 2.0 | 1.0 |
| 11 | Pates | 0.80 | 2.5 | 131 | 5.0 | 25.0 | 1.1 | 1.8 |
| 12 | Pizza | 0.65 | 1.5 | 266 | 11.0 | 33.0 | 10.0 | 2.3 |
| 13 | Hamburger | 0.70 | 6.0 | 295 | 17.0 | 24.0 | 14.0 | 1.3 |
| 14 | Frites | 0.55 | 3.0 | 312 | 3.4 | 41.0 | 15.0 | 3.8 |
| 15 | Pomme de terre | 0.70 | 2.0 | 77 | 2.0 | 17.5 | 0.1 | 2.2 |
| 16 | Soupe | 1.00 | 4.0 | 30 | 1.5 | 4.0 | 0.7 | 0.5 |
| 17 | Sauce | 1.10 | 0.5 | 75 | 1.5 | 8.0 | 4.5 | 0.5 |
| 18 | Aubergine | 0.60 | 2.0 | 25 | 1.0 | 6.0 | 0.2 | 3.0 |
| 19 | Epinards | 0.35 | 1.5 | 23 | 2.9 | 3.6 | 0.4 | 2.2 |
| 20 | Chou | 0.40 | 2.0 | 25 | 1.3 | 6.0 | 0.1 | 2.5 |
| 21 | Legumes melanges | 0.65 | 1.5 | 65 | 2.6 | 13.0 | 0.3 | 3.0 |
| 22 | Raviolis / Gyoza | 0.90 | 2.0 | 220 | 9.0 | 25.0 | 9.0 | 1.0 |
| 23 | Viande panee | 0.85 | 2.0 | 260 | 18.0 | 12.0 | 15.0 | 0.5 |
| 24 | Salade | 0.30 | 3.0 | 20 | 1.4 | 3.3 | 0.2 | 1.8 |
| 25 | Fromage | 1.10 | 1.0 | 402 | 25.0 | 1.3 | 33.0 | 0.0 |
| 26 | Soja / Natto | 0.70 | 1.5 | 446 | 36.0 | 30.0 | 20.0 | 9.0 |
| 27 | Boisson | 1.00 | 5.0 | 40 | 0.0 | 10.0 | 0.0 | 0.0 |
| 28 | Poivron | 0.50 | 1.5 | 20 | 0.9 | 4.6 | 0.2 | 1.7 |
| 29 | Carotte | 0.60 | 1.5 | 41 | 0.9 | 10.0 | 0.2 | 2.8 |
| 30 | Gateau | 0.45 | 4.0 | 347 | 5.0 | 52.0 | 13.0 | 0.5 |
| 31 | Oignon | 0.55 | 1.5 | 40 | 1.1 | 9.3 | 0.1 | 1.7 |

---

## Comment ces donnees sont utilisees pour calculer les calories

Le calcul est fait par `calculateNutrition()` dans `postprocessing.ts`. Il transforme le masque de segmentation produit par YOLOv8 en valeurs nutritionnelles grace aux proprietes physiques et nutritionnelles de la `foodDatabase`.

### Pipeline complet

```
Image
  |
  v
YOLOv8 segmentation
  |
  v
Masque binaire 640x640 (0 ou 1 par pixel)
  |
  v
pixelCount = nombre de pixels a 1
  |
  v
areaRealCm2 = pixelCount * (30/640)^2          <-- calibration camera
  |
  v
volumeCm3 = areaRealCm2 * defaultThicknessCm   <-- foodDatabase
  |
  v
weightGrams = volumeCm3 * density               <-- foodDatabase
  |
  v
calories = (weightGrams / 100) * caloriesPer100g  <-- foodDatabase
protein  = (weightGrams / 100) * proteinPer100g
carbs    = (weightGrams / 100) * carbsPer100g
fat      = (weightGrams / 100) * fatPer100g
fiber    = (weightGrams / 100) * fiberPer100g
```

### Formule condensee

```
                    pixelCount * (30/640)^2 * T * d
calories = kcal * ──────────────────────────────────
                                100

T    = defaultThicknessCm   (epaisseur de l'aliment)
d    = density              (densite de l'aliment)
kcal = caloriesPer100g      (calories pour 100 g)
```

Les 3 parametres `T`, `d` et `kcal` viennent directement de `foodDatabase.ts`.

### Constante de calibration

Definie dans `src/lib/constants.ts` :

```ts
PIXEL_RATIO: 30 / 640  // 1 pixel = 0.046875 cm
```

Hypothese : le cadre de 640 px correspond a 30 cm dans le monde reel. La surface d'un pixel vaut donc `(30/640)^2 = 0.002197 cm2`.

---

## Exemple concret : detection d'une pizza

Donnees de la base (classId 12) :
- `density` = 0.65 g/cm3
- `defaultThicknessCm` = 1.5 cm
- `caloriesPer100g` = 266 kcal

Supposons que le masque contient **50 000 pixels** :

```
areaRealCm2  = 50000 * (30/640)^2 = 50000 * 0.002197 = 109.86 cm2
volumeCm3    = 109.86 * 1.5       = 164.79 cm3
weightGrams  = 164.79 * 0.65      = 107.12 g
scaleFactor  = 107.12 / 100       = 1.0712
calories     = 1.0712 * 266       = 284.9 kcal  ->  affiche 285 kcal
```

---

## Fonctions exposees

| Fonction | Signature | Description |
|----------|-----------|-------------|
| `getFoodInfo` | `(classId: number) => FoodInfo` | Retourne les donnees d'un aliment par son ID YOLO. Renvoie un fallback generique si l'ID est inconnu. |
| `getFoodDatabase` | `() => Record<number, FoodInfo>` | Retourne la base complete (32 entrees). |
| `getFoodNames` | `() => string[]` | Retourne la liste des noms dans l'ordre des IDs. |
| `isValidClassId` | `(classId: number) => boolean` | Verifie si un ID existe dans la base. |

### Fallback pour ID inconnu

Si le modele retourne un `classId` qui n'existe pas dans la base, un aliment generique est utilise :

```ts
{
  id: -1,
  name: "Aliment inconnu",
  density: 0.5,
  defaultThicknessCm: 1.5,
  caloriesPer100g: 100,
  // ...
  icon: "?"
}
```

---

## Ajouter un nouvel aliment

1. Ajouter une entree dans `FOOD_DATABASE` avec le prochain ID disponible :

```ts
32: {
  id: 32,
  name: "Saumon",
  density: 1.0,
  defaultThicknessCm: 1.5,
  caloriesPer100g: 208,
  proteinPer100g: 20.0,
  carbsPer100g: 0.0,
  fatPer100g: 13.0,
  fiberPer100g: 0.0,
  icon: "🐟",
},
```

2. S'assurer que le modele YOLOv8 est entraine pour detecter cette nouvelle classe avec le meme ID.

---

## Fichiers lies

| Fichier | Relation avec foodDatabase |
|---------|---------------------------|
| `src/lib/inference/postprocessing.ts` | Consomme `getFoodInfo()` pour calculer les calories |
| `src/lib/inference/types.ts` | Definit l'interface `FoodInfo` |
| `src/lib/constants.ts` | `PIXEL_RATIO` (30/640) utilise dans le calcul |
| `src/app/page.tsx` | Fusionne les detections multiples et arrondit les valeurs |
