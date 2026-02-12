/**
 * Food Database for NutriScan
 * Contains nutritional metadata for all 32 food classes detected by YOLOv8
 * Data includes calibrated portion defaults and macronutrients per 100g
 * Updated with realistic values (CIQUAL/USDA Reference - Cooked/Edible portion)
 */

import type { FoodInfo } from "./types";

/**
 * Complete nutrition database for 32 food classes
 * Mapped by class ID (0-31)
 */
const FOOD_DATABASE: Record<number, FoodInfo> = {
  0: {
    // rice (Riz blanc cuit)
    id: 0,
    name: "Riz",
    defaultPortionWeightG: 200,
    expectedMaskRatio: 0.08,
    maxWeightG: 500,
    caloriesPer100g: 130,
    proteinPer100g: 2.7,
    carbsPer100g: 28.0,
    fatPer100g: 0.3,
    fiberPer100g: 0.4,
    icon: "🍚",
  },
  1: {
    // bread (Pain blanc standard / Baguette)
    id: 1,
    name: "Pain",
    defaultPortionWeightG: 60,
    expectedMaskRatio: 0.04,
    maxWeightG: 200,
    caloriesPer100g: 265,
    proteinPer100g: 9.0,
    carbsPer100g: 49.0,
    fatPer100g: 1.2, // Souvent moins gras que 3.2 sauf si brioché
    fiberPer100g: 2.7,
    icon: "🍞",
  },
  2: {
    // egg (Œuf dur/cuit)
    id: 2,
    name: "Œuf",
    defaultPortionWeightG: 60,
    expectedMaskRatio: 0.02,
    maxWeightG: 180,
    caloriesPer100g: 155,
    proteinPer100g: 12.6,
    carbsPer100g: 1.1,
    fatPer100g: 10.6,
    fiberPer100g: 0.0,
    icon: "🥚",
  },
  3: {
    // chicken (Poulet rôti, chair avec peau)
    id: 3,
    name: "Poulet",
    defaultPortionWeightG: 150,
    expectedMaskRatio: 0.07,
    maxWeightG: 400,
    caloriesPer100g: 239, // Moyenne avec peau. Sans peau c'est ~170
    proteinPer100g: 27.0,
    carbsPer100g: 0.0,
    fatPer100g: 14.0,
    fiberPer100g: 0.0,
    icon: "🍗",
  },
  4: {
    // pork (Rôti de porc cuit)
    id: 4,
    name: "Porc",
    defaultPortionWeightG: 150,
    expectedMaskRatio: 0.07,
    maxWeightG: 400,
    caloriesPer100g: 242,
    proteinPer100g: 27.0,
    carbsPer100g: 0.0,
    fatPer100g: 14.0,
    fiberPer100g: 0.0,
    icon: "🥓",
  },
  5: {
    // steak (Bœuf cuit, faux-filet/steak haché 15%)
    id: 5,
    name: "Steak",
    defaultPortionWeightG: 150,
    expectedMaskRatio: 0.06,
    maxWeightG: 400,
    caloriesPer100g: 250,
    proteinPer100g: 26.0,
    carbsPer100g: 0.0,
    fatPer100g: 15.0, // Moyenne standard
    fiberPer100g: 0.0,
    icon: "🥩",
  },
  6: {
    // fish (Poisson blanc cuit / Saumon mix) - Moyenne pondérée
    id: 6,
    name: "Poisson",
    defaultPortionWeightG: 150,
    expectedMaskRatio: 0.07,
    maxWeightG: 400,
    caloriesPer100g: 170, // Compromis entre colin (90) et saumon (200)
    proteinPer100g: 20.0,
    carbsPer100g: 0.0,
    fatPer100g: 10.0,
    fiberPer100g: 0.0,
    icon: "🐟",
  },
  7: {
    // shrimp (Crevettes cuites)
    id: 7,
    name: "Crevette",
    defaultPortionWeightG: 80,
    expectedMaskRatio: 0.03,
    maxWeightG: 250,
    caloriesPer100g: 99,
    proteinPer100g: 24.0,
    carbsPer100g: 0.2,
    fatPer100g: 0.3,
    fiberPer100g: 0.0,
    icon: "🦐",
  },
  8: {
    // sausage (Saucisse porc/fumée)
    id: 8,
    name: "Saucisse",
    defaultPortionWeightG: 100,
    expectedMaskRatio: 0.04,
    maxWeightG: 300,
    caloriesPer100g: 300,
    proteinPer100g: 12.0,
    carbsPer100g: 1.5,
    fatPer100g: 27.0,
    fiberPer100g: 0.0,
    icon: "🌭",
  },
  9: {
    // tofu (Tofu ferme nature)
    id: 9,
    name: "Tofu",
    defaultPortionWeightG: 120,
    expectedMaskRatio: 0.05,
    maxWeightG: 300,
    caloriesPer100g: 120, // Tofu ferme classique
    proteinPer100g: 12.0,
    carbsPer100g: 2.0,
    fatPer100g: 7.0,
    fiberPer100g: 1.0,
    icon: "🧈",
  },
  10: {
    // noodles (Nouilles de blé cuites)
    id: 10,
    name: "Nouilles",
    defaultPortionWeightG: 200,
    expectedMaskRatio: 0.08,
    maxWeightG: 500,
    caloriesPer100g: 138,
    proteinPer100g: 4.5,
    carbsPer100g: 25.0,
    fatPer100g: 2.0,
    fiberPer100g: 1.2,
    icon: "🍜",
  },
  11: {
    // pasta (Pâtes cuites standard)
    id: 11,
    name: "Pâtes",
    defaultPortionWeightG: 200,
    expectedMaskRatio: 0.08,
    maxWeightG: 500,
    caloriesPer100g: 131,
    proteinPer100g: 5.0,
    carbsPer100g: 25.0,
    fatPer100g: 1.1,
    fiberPer100g: 1.8,
    icon: "🍝",
  },
  12: {
    // pizza (Moyenne Reine / Fromage)
    id: 12,
    name: "Pizza",
    defaultPortionWeightG: 150,
    expectedMaskRatio: 0.1,
    maxWeightG: 400,
    caloriesPer100g: 266,
    proteinPer100g: 11.0,
    carbsPer100g: 33.0,
    fatPer100g: 10.0,
    fiberPer100g: 2.3,
    icon: "🍕",
  },
  13: {
    // hamburger (Classique avec pain, viande, sauce)
    id: 13,
    name: "Hamburger",
    defaultPortionWeightG: 200,
    expectedMaskRatio: 0.08,
    maxWeightG: 500,
    caloriesPer100g: 295,
    proteinPer100g: 13.0,
    carbsPer100g: 30.0, // Souvent plus de glucides (pain) que de prot
    fatPer100g: 14.0,
    fiberPer100g: 1.3,
    icon: "🍔",
  },
  14: {
    // french_fries (Frites classiques friture)
    id: 14,
    name: "Frites",
    defaultPortionWeightG: 150,
    expectedMaskRatio: 0.07,
    maxWeightG: 400,
    caloriesPer100g: 312,
    proteinPer100g: 3.4,
    carbsPer100g: 41.0,
    fatPer100g: 15.0,
    fiberPer100g: 3.8,
    icon: "🍟",
  },
  15: {
    // potato (Pomme de terre vapeur/eau)
    id: 15,
    name: "Pomme de terre",
    defaultPortionWeightG: 150,
    expectedMaskRatio: 0.05,
    maxWeightG: 400,
    caloriesPer100g: 77,
    proteinPer100g: 2.0,
    carbsPer100g: 17.5,
    fatPer100g: 0.1,
    fiberPer100g: 2.2,
    icon: "🥔",
  },
  16: {
    // soup (Soupe de légumes / Velouté)
    id: 16,
    name: "Soupe",
    defaultPortionWeightG: 250,
    expectedMaskRatio: 0.1,
    maxWeightG: 500,
    caloriesPer100g: 40,
    proteinPer100g: 1.0,
    carbsPer100g: 5.0,
    fatPer100g: 1.5, // Souvent un peu de crème ou huile
    fiberPer100g: 1.0,
    icon: "🍲",
  },
  17: {
    // sauce (Moyenne Ketchup/Sauce Tomate cuisinée)
    id: 17,
    name: "Sauce",
    defaultPortionWeightG: 30,
    expectedMaskRatio: 0.02,
    maxWeightG: 100,
    caloriesPer100g: 80, // Moyenne conservatrice (Mayo = 700, Tomate = 30)
    proteinPer100g: 1.5,
    carbsPer100g: 10.0,
    fatPer100g: 4.0,
    fiberPer100g: 0.5,
    icon: "🥫",
  },
  18: {
    // eggplant (Aubergine cuite au four/poêle)
    id: 18,
    name: "Aubergine",
    defaultPortionWeightG: 120,
    expectedMaskRatio: 0.06,
    maxWeightG: 300,
    caloriesPer100g: 35, // Un peu plus calorique car absorbe souvent du gras
    proteinPer100g: 1.0,
    carbsPer100g: 6.0,
    fatPer100g: 1.5, // Estimation avec cuisson
    fiberPer100g: 3.0,
    icon: "🍆",
  },
  19: {
    // spinach (Épinards cuits)
    id: 19,
    name: "Épinards",
    defaultPortionWeightG: 80,
    expectedMaskRatio: 0.06,
    maxWeightG: 250,
    caloriesPer100g: 23,
    proteinPer100g: 3.0,
    carbsPer100g: 3.6,
    fatPer100g: 0.4,
    fiberPer100g: 2.2,
    icon: "🥬",
  },
  20: {
    // cabbage (Chou vert/blanc cuit ou cru)
    id: 20,
    name: "Chou",
    defaultPortionWeightG: 100,
    expectedMaskRatio: 0.06,
    maxWeightG: 300,
    caloriesPer100g: 25,
    proteinPer100g: 1.3,
    carbsPer100g: 5.8,
    fatPer100g: 0.1,
    fiberPer100g: 2.5,
    icon: "🥬",
  },
  21: {
    // mixed_vegetables (Poêlée de légumes / Macédoine)
    id: 21,
    name: "Légumes mélangés",
    defaultPortionWeightG: 150,
    expectedMaskRatio: 0.08,
    maxWeightG: 400,
    caloriesPer100g: 65,
    proteinPer100g: 2.6,
    carbsPer100g: 10.0,
    fatPer100g: 2.0, // Souvent un peu de beurre/huile
    fiberPer100g: 3.0,
    icon: "🥗",
  },
  22: {
    // dumplings (Raviolis vapeur/grillés - Porc/Légumes)
    id: 22,
    name: "Raviolis / Gyoza",
    defaultPortionWeightG: 160,
    expectedMaskRatio: 0.07,
    maxWeightG: 400,
    caloriesPer100g: 200,
    proteinPer100g: 8.0,
    carbsPer100g: 28.0,
    fatPer100g: 7.0,
    fiberPer100g: 1.0,
    icon: "🥟",
  },
  23: {
    // fried_meat (Escalope panée / Tonkatsu / Nugget)
    id: 23,
    name: "Viande panée",
    defaultPortionWeightG: 150,
    expectedMaskRatio: 0.06,
    maxWeightG: 400,
    caloriesPer100g: 280, // Panure ajoute des calories
    proteinPer100g: 16.0,
    carbsPer100g: 15.0, // Glucides de la chapelure
    fatPer100g: 17.0,
    fiberPer100g: 0.5,
    icon: "🍖",
  },
  24: {
    // salad (Salade verte nature)
    id: 24,
    name: "Salade",
    defaultPortionWeightG: 100,
    expectedMaskRatio: 0.1,
    maxWeightG: 300,
    caloriesPer100g: 15,
    proteinPer100g: 1.4,
    carbsPer100g: 2.9,
    fatPer100g: 0.2,
    fiberPer100g: 1.8,
    icon: "🥗",
  },
  25: {
    // cheese (Fromage pâte dure moyen - Emmental/Cheddar)
    id: 25,
    name: "Fromage",
    defaultPortionWeightG: 40,
    expectedMaskRatio: 0.02,
    maxWeightG: 150,
    caloriesPer100g: 380,
    proteinPer100g: 25.0,
    carbsPer100g: 0.5,
    fatPer100g: 31.0,
    fiberPer100g: 0.0,
    icon: "🧀",
  },
  26: {
    // soy_beans (Soja cuit / Edamame) - CORRIGÉ (C'était du soja sec avant)
    id: 26,
    name: "Soja / Edamame",
    defaultPortionWeightG: 80,
    expectedMaskRatio: 0.04,
    maxWeightG: 250,
    caloriesPer100g: 141, // Valeur cuite, beaucoup plus réaliste
    proteinPer100g: 12.0,
    carbsPer100g: 11.0,
    fatPer100g: 6.0,
    fiberPer100g: 4.0,
    icon: "🫘",
  },
  27: {
    // beverage (Soda / Jus de fruit standard)
    id: 27,
    name: "Boisson",
    defaultPortionWeightG: 250,
    expectedMaskRatio: 0.08,
    maxWeightG: 500,
    caloriesPer100g: 42, // Coca classique
    proteinPer100g: 0.0,
    carbsPer100g: 10.6,
    fatPer100g: 0.0,
    fiberPer100g: 0.0,
    icon: "🥤",
  },
  28: {
    // pepper (Poivron cru)
    id: 28,
    name: "Poivron",
    defaultPortionWeightG: 80,
    expectedMaskRatio: 0.04,
    maxWeightG: 250,
    caloriesPer100g: 20,
    proteinPer100g: 0.9,
    carbsPer100g: 4.6,
    fatPer100g: 0.2,
    fiberPer100g: 1.7,
    icon: "🌶️",
  },
  29: {
    // carrot (Carotte crue)
    id: 29,
    name: "Carotte",
    defaultPortionWeightG: 80,
    expectedMaskRatio: 0.03,
    maxWeightG: 250,
    caloriesPer100g: 41,
    proteinPer100g: 0.9,
    carbsPer100g: 9.6,
    fatPer100g: 0.2,
    fiberPer100g: 2.8,
    icon: "🥕",
  },
  30: {
    // cake (Gâteau standard / Éponge)
    id: 30,
    name: "Gâteau",
    defaultPortionWeightG: 100,
    expectedMaskRatio: 0.06,
    maxWeightG: 300,
    caloriesPer100g: 350,
    proteinPer100g: 6.0,
    carbsPer100g: 50.0,
    fatPer100g: 15.0,
    fiberPer100g: 1.0,
    icon: "🍰",
  },
  31: {
    // onion (Oignon cru)
    id: 31,
    name: "Oignon",
    defaultPortionWeightG: 80,
    expectedMaskRatio: 0.04,
    maxWeightG: 250,
    caloriesPer100g: 40,
    proteinPer100g: 1.1,
    carbsPer100g: 9.3,
    fatPer100g: 0.1,
    fiberPer100g: 1.7,
    icon: "🧅",
  },
};

/**
 * Fallback food info for unknown class IDs
 * Uses generic values to prevent crashes
 */
const FALLBACK_FOOD_INFO: FoodInfo = {
  id: -1,
  name: "Aliment inconnu",
  defaultPortionWeightG: 100,
  expectedMaskRatio: 0.05,
  maxWeightG: 300,
  caloriesPer100g: 150, // Moyenne plus générique
  proteinPer100g: 5.0,
  carbsPer100g: 20.0,
  fatPer100g: 5.0,
  fiberPer100g: 2.0,
  icon: "❓",
};

/**
 * Get the complete food database
 * @returns Record of all food items mapped by class ID
 */
export function getFoodDatabase(): Record<number, FoodInfo> {
  return FOOD_DATABASE;
}

/**
 * Get food information for a specific class ID
 * @param classId - YOLO class ID (0-31)
 * @returns Food info object, or fallback if class ID is invalid
 */
export function getFoodInfo(classId: number): FoodInfo {
  const foodInfo = FOOD_DATABASE[classId];
  if (!foodInfo) {
    console.warn(`[FoodDatabase] Unknown class ID: ${classId}, using fallback`);
    return FALLBACK_FOOD_INFO;
  }
  return foodInfo;
}

/**
 * Get all class names
 * @returns Array of food names in order of class ID
 */
export function getFoodNames(): string[] {
  return Object.values(FOOD_DATABASE).map((food) => food.name);
}

/**
 * Check if a class ID is valid
 * @param classId - Class ID to validate
 * @returns true if class ID exists in database
 */
export function isValidClassId(classId: number): boolean {
  return classId in FOOD_DATABASE;
}
