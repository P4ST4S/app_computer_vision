# NutriScan

Application Next.js qui détecte des aliments sur image/caméra (YOLOv8 segmentation ONNX) et estime calories + macros.

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- onnxruntime-web (inférence dans un Web Worker)

## Installation

```bash
npm install
# ou
pnpm install
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run type-check
```

## Fonctionnalités

- Scan via caméra
- Upload d'image
- Détection multi-aliments avec segmentation
- Estimation nutritionnelle par portion calibrée
- Historique local des scans
- Fallback mock si l'inférence échoue

## Pipeline d'inférence

1. `src/hooks/useInference.ts` initialise le worker.
2. `src/workers/inference.worker.ts` charge `public/models/best.onnx` via ONNX Runtime.
3. Prétraitement image dans `src/lib/inference/preprocessing.ts` vers tensor `1x3x640x640`.
4. Parsing YOLO + NMS dans `src/workers/inference.worker.ts` et `src/lib/inference/nms.ts`.
5. Génération masque + nutrition dans `src/lib/inference/postprocessing.ts`.

## Estimation du poids (calibrée)

La formule actuelle ne repose plus sur densité/épaisseur physiques.

```ts
totalPixels = 640 * 640
maskRatioRaw = pixelCount / totalPixels
maskRatioCalibrated = maskRatioRaw * MASK_RATIO_CALIBRATION
scaleFactor = maskRatioCalibrated / expectedMaskRatio
weightGrams = min(defaultPortionWeightG * scaleFactor, maxWeightG)
```

Puis calories/macros sont calculées avec les valeurs `per100g`.

Les paramètres alimentaires sont dans `src/lib/inference/foodDatabase.ts`:
- `defaultPortionWeightG`
- `expectedMaskRatio`
- `maxWeightG`

Le facteur global `MASK_RATIO_CALIBRATION` est défini dans `src/lib/constants.ts`.

## Structure

```text
src/
├── app/
├── components/
├── hooks/
│   ├── useCamera.ts
│   └── useInference.ts
├── lib/
│   ├── inference/
│   │   ├── foodDatabase.ts
│   │   ├── nms.ts
│   │   ├── postprocessing.ts
│   │   ├── preprocessing.ts
│   │   └── types.ts
│   ├── constants.ts
│   ├── mockNutrition.ts
│   └── workerClient.ts
└── workers/
    └── inference.worker.ts
```

## Troubleshooting

- Poids bloqués à `500g`:
  - redémarrer `npm run dev`
  - hard refresh navigateur (`Cmd+Shift+R`)
  - vérifier les logs:
    - `[Worker] Box stats`
    - `[Postprocess] Mask stats`
    - `[Nutrition] Weight calculation`
- Modèle introuvable:
  - vérifier la présence de `public/models/best.onnx`
- Warning ONNX `Unknown CPU vendor`:
  - attendu sur certaines machines, non bloquant

## Permissions

L'application nécessite l'accès caméra pour le mode scan.
