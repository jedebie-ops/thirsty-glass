import type { FoodItem } from '../types'

// Voedingswaarden per 100 gram, realistische standaardwaarden (NEVO/algemeen).
export const FOODS: FoodItem[] = [
  {
    id: 'rice_cooked',
    name: 'Rijst (gekookt)',
    category: 'carb_base',
    emoji: '🍚',
    per100g: { kcal: 130, proteinG: 2.7, carbsG: 28, fatG: 0.3 },
  },
  {
    id: 'potato_boiled',
    name: 'Aardappel (gekookt)',
    category: 'carb_base',
    emoji: '🥔',
    per100g: { kcal: 87, proteinG: 2.0, carbsG: 20, fatG: 0.1 },
  },
  {
    id: 'kipburger',
    name: 'Kipburger',
    category: 'protein',
    emoji: '🍗',
    per100g: { kcal: 215, proteinG: 15, carbsG: 14, fatG: 11 },
    isEstimate: true,
    unitGrams: 100,
  },
  {
    id: 'broccoli',
    name: 'Broccoli',
    category: 'vegetable',
    emoji: '🥦',
    per100g: { kcal: 35, proteinG: 2.8, carbsG: 7, fatG: 0.4 },
  },
  {
    id: 'carrot',
    name: 'Wortel',
    category: 'vegetable',
    emoji: '🥕',
    per100g: { kcal: 41, proteinG: 0.9, carbsG: 10, fatG: 0.2 },
  },
  {
    id: 'zucchini',
    name: 'Courgette',
    category: 'vegetable',
    emoji: '🥬',
    per100g: { kcal: 17, proteinG: 1.2, carbsG: 3.1, fatG: 0.3 },
  },
  {
    id: 'bell_pepper',
    name: 'Paprika',
    category: 'vegetable',
    emoji: '🫑',
    per100g: { kcal: 31, proteinG: 1.0, carbsG: 6, fatG: 0.3 },
  },
  {
    id: 'cauliflower',
    name: 'Bloemkool',
    category: 'vegetable',
    emoji: '🥦',
    per100g: { kcal: 25, proteinG: 1.9, carbsG: 5, fatG: 0.3 },
  },
  {
    id: 'spinach',
    name: 'Spinazie',
    category: 'vegetable',
    emoji: '🍃',
    per100g: { kcal: 23, proteinG: 2.9, carbsG: 3.6, fatG: 0.4 },
  },
  {
    id: 'green_beans',
    name: 'Sperziebonen',
    category: 'vegetable',
    emoji: '🫛',
    per100g: { kcal: 31, proteinG: 1.8, carbsG: 7, fatG: 0.2 },
  },
  {
    id: 'mushrooms',
    name: 'Champignons',
    category: 'vegetable',
    emoji: '🍄',
    per100g: { kcal: 22, proteinG: 3.1, carbsG: 3.3, fatG: 0.3 },
  },
  {
    id: 'leek',
    name: 'Prei',
    category: 'vegetable',
    emoji: '🥬',
    per100g: { kcal: 61, proteinG: 1.5, carbsG: 14, fatG: 0.3 },
  },
  {
    id: 'red_cabbage',
    name: 'Rode kool',
    category: 'vegetable',
    emoji: '🥬',
    per100g: { kcal: 31, proteinG: 1.4, carbsG: 7, fatG: 0.2 },
  },
  {
    id: 'onion',
    name: 'Ui',
    category: 'vegetable',
    emoji: '🧅',
    per100g: { kcal: 40, proteinG: 1.1, carbsG: 9, fatG: 0.1 },
  },
  {
    id: 'tomato',
    name: 'Tomaat',
    category: 'vegetable',
    emoji: '🍅',
    per100g: { kcal: 18, proteinG: 0.9, carbsG: 3.9, fatG: 0.2 },
  },
  {
    id: 'eggplant',
    name: 'Aubergine',
    category: 'vegetable',
    emoji: '🍆',
    per100g: { kcal: 25, proteinG: 1.0, carbsG: 6, fatG: 0.2 },
  },
  {
    id: 'sugar_snap',
    name: 'Suikersnaperwten',
    category: 'vegetable',
    emoji: '🌱',
    per100g: { kcal: 42, proteinG: 2.8, carbsG: 7.5, fatG: 0.2 },
  },
]

export const FOODS_BY_ID: Record<string, FoodItem> = Object.fromEntries(
  FOODS.map((food) => [food.id, food]),
)

export const CARB_BASES = FOODS.filter((f) => f.category === 'carb_base')
export const PROTEINS = FOODS.filter((f) => f.category === 'protein')
export const VEGETABLES = FOODS.filter((f) => f.category === 'vegetable')
