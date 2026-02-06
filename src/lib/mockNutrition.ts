export interface NutritionData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  serving: string;
  icon: string;
}

const MOCK_FOODS: NutritionData[] = [
  {
    name: "Pomme",
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    fiber: 2.4,
    serving: "100g",
    icon: "🍎",
  },
  {
    name: "Banane",
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    fiber: 2.6,
    serving: "100g",
    icon: "🍌",
  },
  {
    name: "Poulet grillé",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    serving: "100g",
    icon: "🍗",
  },
  {
    name: "Riz blanc",
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    fiber: 0.4,
    serving: "100g",
    icon: "🍚",
  },
  {
    name: "Salade verte",
    calories: 15,
    protein: 1.4,
    carbs: 2.9,
    fat: 0.2,
    fiber: 1.3,
    serving: "100g",
    icon: "🥗",
  },
  {
    name: "Pain complet",
    calories: 247,
    protein: 13,
    carbs: 41,
    fat: 3.4,
    fiber: 7,
    serving: "100g",
    icon: "🍞",
  },
  {
    name: "Œuf dur",
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    fiber: 0,
    serving: "100g",
    icon: "🥚",
  },
  {
    name: "Yaourt nature",
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.7,
    fiber: 0,
    serving: "100g",
    icon: "🥛",
  },
];

export function getRandomNutrition(): NutritionData {
  return MOCK_FOODS[Math.floor(Math.random() * MOCK_FOODS.length)];
}
