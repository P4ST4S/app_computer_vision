/**
 * Food Database for NutriScan
 * Contains nutritional metadata for all 12 food classes detected by YOLOv8
 * Data includes density, thickness, and macronutrients per 100g
 */

import type { FoodInfo } from "./types";

/**
 * Complete nutrition database for 12 food classes
 * Mapped by class ID (0-11)
 *
 * Classes: bread, onion, chicken_duck, sauce, tomato, potato, steak,
 *          french_bean, mixed_vegetables, ice_cream, pork, rice
 */
const FOOD_DATABASE: Record<number, FoodInfo> = {
  0: {
    // bread
    id: 0,
    name: "Pain",
    density: 0.25, // g/cm³ - bread is lightweight and airy
    defaultThicknessCm: 2.0, // typical slice thickness
    caloriesPer100g: 265,
    proteinPer100g: 9.0,
    carbsPer100g: 49.0,
    fatPer100g: 3.2,
    fiberPer100g: 2.7,
    icon: "🍞",
  },
  1: {
    // onion
    id: 1,
    name: "Oignon",
    density: 0.55, // g/cm³ - moderate density vegetable
    defaultThicknessCm: 1.5, // sliced onion typical thickness
    caloriesPer100g: 40,
    proteinPer100g: 1.1,
    carbsPer100g: 9.3,
    fatPer100g: 0.1,
    fiberPer100g: 1.7,
    icon: "🧅",
  },
  2: {
    // chicken_duck
    id: 2,
    name: "Poulet",
    density: 0.95, // g/cm³ - cooked poultry density
    defaultThicknessCm: 2.5, // chicken breast thickness
    caloriesPer100g: 165,
    proteinPer100g: 31.0,
    carbsPer100g: 0.0,
    fatPer100g: 3.6,
    fiberPer100g: 0.0,
    icon: "🍗",
  },
  3: {
    // sauce
    id: 3,
    name: "Sauce",
    density: 1.1, // g/cm³ - liquid/semi-liquid density
    defaultThicknessCm: 0.5, // thin layer of sauce
    caloriesPer100g: 80,
    proteinPer100g: 1.5,
    carbsPer100g: 8.0,
    fatPer100g: 4.5,
    fiberPer100g: 0.5,
    icon: "🥫",
  },
  4: {
    // tomato
    id: 4,
    name: "Tomate",
    density: 0.95, // g/cm³ - high water content
    defaultThicknessCm: 1.0, // sliced tomato thickness
    caloriesPer100g: 18,
    proteinPer100g: 0.9,
    carbsPer100g: 3.9,
    fatPer100g: 0.2,
    fiberPer100g: 1.2,
    icon: "🍅",
  },
  5: {
    // potato
    id: 5,
    name: "Pomme de terre",
    density: 0.7, // g/cm³ - starchy vegetable
    defaultThicknessCm: 2.0, // cooked potato piece thickness
    caloriesPer100g: 77,
    proteinPer100g: 2.0,
    carbsPer100g: 17.5,
    fatPer100g: 0.1,
    fiberPer100g: 2.2,
    icon: "🥔",
  },
  6: {
    // steak
    id: 6,
    name: "Steak",
    density: 1.05, // g/cm³ - dense cooked meat
    defaultThicknessCm: 1.2, // typical steak thickness
    caloriesPer100g: 271,
    proteinPer100g: 25.0,
    carbsPer100g: 0.0,
    fatPer100g: 19.0,
    fiberPer100g: 0.0,
    icon: "🥩",
  },
  7: {
    // french_bean
    id: 7,
    name: "Haricot vert",
    density: 0.6, // g/cm³ - lightweight vegetable
    defaultThicknessCm: 0.8, // thin bean thickness
    caloriesPer100g: 31,
    proteinPer100g: 1.8,
    carbsPer100g: 7.0,
    fatPer100g: 0.2,
    fiberPer100g: 2.7,
    icon: "🫘",
  },
  8: {
    // mixed_vegetables
    id: 8,
    name: "Légumes mélangés",
    density: 0.65, // g/cm³ - average of various vegetables
    defaultThicknessCm: 1.5, // mixed vegetable pile thickness
    caloriesPer100g: 40,
    proteinPer100g: 2.0,
    carbsPer100g: 8.0,
    fatPer100g: 0.3,
    fiberPer100g: 3.0,
    icon: "🥗",
  },
  9: {
    // ice_cream
    id: 9,
    name: "Glace",
    density: 0.55, // g/cm³ - frozen dessert with air incorporation
    defaultThicknessCm: 3.0, // scoop thickness
    caloriesPer100g: 207,
    proteinPer100g: 3.5,
    carbsPer100g: 24.0,
    fatPer100g: 11.0,
    fiberPer100g: 0.7,
    icon: "🍨",
  },
  10: {
    // pork
    id: 10,
    name: "Porc",
    density: 1.0, // g/cm³ - cooked pork density
    defaultThicknessCm: 2.0, // pork chop/slice thickness
    caloriesPer100g: 242,
    proteinPer100g: 27.0,
    carbsPer100g: 0.0,
    fatPer100g: 14.0,
    fiberPer100g: 0.0,
    icon: "🥓",
  },
  11: {
    // rice
    id: 11,
    name: "Riz",
    density: 0.75, // g/cm³ - cooked rice density
    defaultThicknessCm: 2.0, // rice pile thickness
    caloriesPer100g: 130,
    proteinPer100g: 2.7,
    carbsPer100g: 28.0,
    fatPer100g: 0.3,
    fiberPer100g: 0.4,
    icon: "🍚",
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
 * @param classId - YOLO class ID (0-11)
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
