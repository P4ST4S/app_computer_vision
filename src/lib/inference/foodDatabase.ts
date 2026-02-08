/**
 * Food Database for NutriScan
 * Contains nutritional metadata for all 32 food classes detected by YOLOv8
 * Data includes density, thickness, and macronutrients per 100g
 */

import type { FoodInfo } from "./types";

/**
 * Complete nutrition database for 32 food classes
 * Mapped by class ID (0-31)
 *
 * Classes: rice, bread, egg, chicken, pork, steak, fish, shrimp,
 *          sausage, tofu, noodles, pasta, pizza, hamburger, french_fries,
 *          potato, soup, sauce, eggplant, spinach, cabbage,
 *          mixed_vegetables, dumplings, fried_meat, salad, cheese,
 *          soy_beans, beverage, pepper, carrot, cake, onion
 */
const FOOD_DATABASE: Record<number, FoodInfo> = {
  0: {
    // rice
    id: 0,
    name: "Riz",
    density: 0.75,
    defaultThicknessCm: 2.0,
    caloriesPer100g: 130,
    proteinPer100g: 2.7,
    carbsPer100g: 28.0,
    fatPer100g: 0.3,
    fiberPer100g: 0.4,
    icon: "🍚",
  },
  1: {
    // bread
    id: 1,
    name: "Pain",
    density: 0.25,
    defaultThicknessCm: 2.0,
    caloriesPer100g: 265,
    proteinPer100g: 9.0,
    carbsPer100g: 49.0,
    fatPer100g: 3.2,
    fiberPer100g: 2.7,
    icon: "🍞",
  },
  2: {
    // egg
    id: 2,
    name: "Œuf",
    density: 1.03,
    defaultThicknessCm: 1.5,
    caloriesPer100g: 155,
    proteinPer100g: 13.0,
    carbsPer100g: 1.1,
    fatPer100g: 11.0,
    fiberPer100g: 0.0,
    icon: "🥚",
  },
  3: {
    // chicken
    id: 3,
    name: "Poulet",
    density: 0.95,
    defaultThicknessCm: 2.5,
    caloriesPer100g: 239,
    proteinPer100g: 27.0,
    carbsPer100g: 0.0,
    fatPer100g: 14.0,
    fiberPer100g: 0.0,
    icon: "🍗",
  },
  4: {
    // pork
    id: 4,
    name: "Porc",
    density: 1.0,
    defaultThicknessCm: 2.0,
    caloriesPer100g: 242,
    proteinPer100g: 27.0,
    carbsPer100g: 0.0,
    fatPer100g: 14.0,
    fiberPer100g: 0.0,
    icon: "🥓",
  },
  5: {
    // steak
    id: 5,
    name: "Steak",
    density: 1.05,
    defaultThicknessCm: 1.2,
    caloriesPer100g: 271,
    proteinPer100g: 25.0,
    carbsPer100g: 0.0,
    fatPer100g: 19.0,
    fiberPer100g: 0.0,
    icon: "🥩",
  },
  6: {
    // fish
    id: 6,
    name: "Poisson",
    density: 1.0,
    defaultThicknessCm: 2.0,
    caloriesPer100g: 206,
    proteinPer100g: 22.0,
    carbsPer100g: 0.0,
    fatPer100g: 12.0,
    fiberPer100g: 0.0,
    icon: "🐟",
  },
  7: {
    // shrimp
    id: 7,
    name: "Crevette",
    density: 0.95,
    defaultThicknessCm: 1.0,
    caloriesPer100g: 99,
    proteinPer100g: 24.0,
    carbsPer100g: 0.2,
    fatPer100g: 0.3,
    fiberPer100g: 0.0,
    icon: "🦐",
  },
  8: {
    // sausage
    id: 8,
    name: "Saucisse",
    density: 0.95,
    defaultThicknessCm: 2.5,
    caloriesPer100g: 301,
    proteinPer100g: 12.0,
    carbsPer100g: 2.0,
    fatPer100g: 27.0,
    fiberPer100g: 0.0,
    icon: "🌭",
  },
  9: {
    // tofu
    id: 9,
    name: "Tofu",
    density: 1.05,
    defaultThicknessCm: 2.0,
    caloriesPer100g: 76,
    proteinPer100g: 8.0,
    carbsPer100g: 1.9,
    fatPer100g: 4.8,
    fiberPer100g: 0.3,
    icon: "🧈",
  },
  10: {
    // noodles
    id: 10,
    name: "Nouilles",
    density: 0.75,
    defaultThicknessCm: 2.0,
    caloriesPer100g: 138,
    proteinPer100g: 4.5,
    carbsPer100g: 25.0,
    fatPer100g: 2.0,
    fiberPer100g: 1.0,
    icon: "🍜",
  },
  11: {
    // pasta
    id: 11,
    name: "Pâtes",
    density: 0.8,
    defaultThicknessCm: 2.5,
    caloriesPer100g: 131,
    proteinPer100g: 5.0,
    carbsPer100g: 25.0,
    fatPer100g: 1.1,
    fiberPer100g: 1.8,
    icon: "🍝",
  },
  12: {
    // pizza
    id: 12,
    name: "Pizza",
    density: 0.65,
    defaultThicknessCm: 1.5,
    caloriesPer100g: 266,
    proteinPer100g: 11.0,
    carbsPer100g: 33.0,
    fatPer100g: 10.0,
    fiberPer100g: 2.3,
    icon: "🍕",
  },
  13: {
    // hamburger
    id: 13,
    name: "Hamburger",
    density: 0.7,
    defaultThicknessCm: 6.0,
    caloriesPer100g: 295,
    proteinPer100g: 17.0,
    carbsPer100g: 24.0,
    fatPer100g: 14.0,
    fiberPer100g: 1.3,
    icon: "🍔",
  },
  14: {
    // french_fries
    id: 14,
    name: "Frites",
    density: 0.55,
    defaultThicknessCm: 3.0,
    caloriesPer100g: 312,
    proteinPer100g: 3.4,
    carbsPer100g: 41.0,
    fatPer100g: 15.0,
    fiberPer100g: 3.8,
    icon: "🍟",
  },
  15: {
    // potato
    id: 15,
    name: "Pomme de terre",
    density: 0.7,
    defaultThicknessCm: 2.0,
    caloriesPer100g: 77,
    proteinPer100g: 2.0,
    carbsPer100g: 17.5,
    fatPer100g: 0.1,
    fiberPer100g: 2.2,
    icon: "🥔",
  },
  16: {
    // soup
    id: 16,
    name: "Soupe",
    density: 1.0,
    defaultThicknessCm: 4.0,
    caloriesPer100g: 30,
    proteinPer100g: 1.5,
    carbsPer100g: 4.0,
    fatPer100g: 0.7,
    fiberPer100g: 0.5,
    icon: "🍲",
  },
  17: {
    // sauce
    id: 17,
    name: "Sauce",
    density: 1.1,
    defaultThicknessCm: 0.5,
    caloriesPer100g: 75,
    proteinPer100g: 1.5,
    carbsPer100g: 8.0,
    fatPer100g: 4.5,
    fiberPer100g: 0.5,
    icon: "🥫",
  },
  18: {
    // eggplant
    id: 18,
    name: "Aubergine",
    density: 0.6,
    defaultThicknessCm: 2.0,
    caloriesPer100g: 25,
    proteinPer100g: 1.0,
    carbsPer100g: 6.0,
    fatPer100g: 0.2,
    fiberPer100g: 3.0,
    icon: "🍆",
  },
  19: {
    // spinach
    id: 19,
    name: "Épinards",
    density: 0.35,
    defaultThicknessCm: 1.5,
    caloriesPer100g: 23,
    proteinPer100g: 2.9,
    carbsPer100g: 3.6,
    fatPer100g: 0.4,
    fiberPer100g: 2.2,
    icon: "🥬",
  },
  20: {
    // cabbage
    id: 20,
    name: "Chou",
    density: 0.4,
    defaultThicknessCm: 2.0,
    caloriesPer100g: 25,
    proteinPer100g: 1.3,
    carbsPer100g: 6.0,
    fatPer100g: 0.1,
    fiberPer100g: 2.5,
    icon: "🥬",
  },
  21: {
    // mixed_vegetables
    id: 21,
    name: "Légumes mélangés",
    density: 0.65,
    defaultThicknessCm: 1.5,
    caloriesPer100g: 65,
    proteinPer100g: 2.6,
    carbsPer100g: 13.0,
    fatPer100g: 0.3,
    fiberPer100g: 3.0,
    icon: "🥗",
  },
  22: {
    // dumplings
    id: 22,
    name: "Raviolis / Gyoza",
    density: 0.9,
    defaultThicknessCm: 2.0,
    caloriesPer100g: 220,
    proteinPer100g: 9.0,
    carbsPer100g: 25.0,
    fatPer100g: 9.0,
    fiberPer100g: 1.0,
    icon: "🥟",
  },
  23: {
    // fried_meat
    id: 23,
    name: "Viande panée",
    density: 0.85,
    defaultThicknessCm: 2.0,
    caloriesPer100g: 260,
    proteinPer100g: 18.0,
    carbsPer100g: 12.0,
    fatPer100g: 15.0,
    fiberPer100g: 0.5,
    icon: "🍖",
  },
  24: {
    // salad
    id: 24,
    name: "Salade",
    density: 0.3,
    defaultThicknessCm: 3.0,
    caloriesPer100g: 20,
    proteinPer100g: 1.4,
    carbsPer100g: 3.3,
    fatPer100g: 0.2,
    fiberPer100g: 1.8,
    icon: "🥗",
  },
  25: {
    // cheese
    id: 25,
    name: "Fromage",
    density: 1.1,
    defaultThicknessCm: 1.0,
    caloriesPer100g: 402,
    proteinPer100g: 25.0,
    carbsPer100g: 1.3,
    fatPer100g: 33.0,
    fiberPer100g: 0.0,
    icon: "🧀",
  },
  26: {
    // soy_beans
    id: 26,
    name: "Soja / Nattō",
    density: 0.7,
    defaultThicknessCm: 1.5,
    caloriesPer100g: 446,
    proteinPer100g: 36.0,
    carbsPer100g: 30.0,
    fatPer100g: 20.0,
    fiberPer100g: 9.0,
    icon: "🫘",
  },
  27: {
    // beverage
    id: 27,
    name: "Boisson",
    density: 1.0,
    defaultThicknessCm: 5.0,
    caloriesPer100g: 40,
    proteinPer100g: 0.0,
    carbsPer100g: 10.0,
    fatPer100g: 0.0,
    fiberPer100g: 0.0,
    icon: "🥤",
  },
  28: {
    // pepper
    id: 28,
    name: "Poivron",
    density: 0.5,
    defaultThicknessCm: 1.5,
    caloriesPer100g: 20,
    proteinPer100g: 0.9,
    carbsPer100g: 4.6,
    fatPer100g: 0.2,
    fiberPer100g: 1.7,
    icon: "🌶️",
  },
  29: {
    // carrot
    id: 29,
    name: "Carotte",
    density: 0.6,
    defaultThicknessCm: 1.5,
    caloriesPer100g: 41,
    proteinPer100g: 0.9,
    carbsPer100g: 10.0,
    fatPer100g: 0.2,
    fiberPer100g: 2.8,
    icon: "🥕",
  },
  30: {
    // cake
    id: 30,
    name: "Gâteau",
    density: 0.45,
    defaultThicknessCm: 4.0,
    caloriesPer100g: 347,
    proteinPer100g: 5.0,
    carbsPer100g: 52.0,
    fatPer100g: 13.0,
    fiberPer100g: 0.5,
    icon: "🍰",
  },
  31: {
    // onion
    id: 31,
    name: "Oignon",
    density: 0.55,
    defaultThicknessCm: 1.5,
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
  density: 0.5,
  defaultThicknessCm: 1.5,
  caloriesPer100g: 100,
  proteinPer100g: 5.0,
  carbsPer100g: 15.0,
  fatPer100g: 3.0,
  fiberPer100g: 1.0,
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
