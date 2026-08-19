export interface IngredientPrice {
    pricePerUnit: number;
    unit: 'kg' | 'L' | 'kom' | 'g' | 'ml' | 'pakovanje';
    keywords: string[];
    defaultQuantity?: number; // Realistic default if quantity is missing
}

// Average prices in RSD for Serbian market (estimated early 2024/2025)
export const INGREDIENT_PRICES: Record<string, IngredientPrice> = {
    'mleveno_meso': { pricePerUnit: 1100, unit: 'kg', keywords: ['mleveno', 'meso'], defaultQuantity: 0.5 },
    'junetina': { pricePerUnit: 1300, unit: 'kg', keywords: ['junetina', 'juneće', 'govedina'], defaultQuantity: 0.5 },
    'svinjetina': { pricePerUnit: 850, unit: 'kg', keywords: ['svinjetina', 'svinjsko', 'abut'], defaultQuantity: 0.5 },
    'piletina': { pricePerUnit: 700, unit: 'kg', keywords: ['piletina', 'pileće', 'batak', 'karabatak', 'belo meso'], defaultQuantity: 0.6 },
    'slanina': { pricePerUnit: 1400, unit: 'kg', keywords: ['slanina', 'dimljena'], defaultQuantity: 0.15 },
    'kobasice': { pricePerUnit: 900, unit: 'kg', keywords: ['kobasice', 'roštilj'], defaultQuantity: 0.4 },
    
    'ulje': { pricePerUnit: 170, unit: 'L', keywords: ['ulje', 'suncokretovo'], defaultQuantity: 0.1 },
    'maslinovo_ulje': { pricePerUnit: 1200, unit: 'L', keywords: ['maslinovo'], defaultQuantity: 0.05 },
    'mleko': { pricePerUnit: 150, unit: 'L', keywords: ['mleko'], defaultQuantity: 0.5 },
    'jogurt': { pricePerUnit: 160, unit: 'L', keywords: ['jogurt'], defaultQuantity: 0.2 },
    'pavlaka': { pricePerUnit: 700, unit: 'kg', keywords: ['pavlaka', 'kisela', 'mileram'], defaultQuantity: 0.2 },
    'sir_feta': { pricePerUnit: 1000, unit: 'kg', keywords: ['sir', 'feta', 'beli sir', 'sitan sir'], defaultQuantity: 0.25 },
    'sir_tvrdi': { pricePerUnit: 1600, unit: 'kg', keywords: ['kačkavalj', 'gauda', 'edamer', 'trapist'], defaultQuantity: 0.2 },
    'parmezan': { pricePerUnit: 3500, unit: 'kg', keywords: ['parmezan', 'grana padano'], defaultQuantity: 0.05 },
    'jaja': { pricePerUnit: 20, unit: 'kom', keywords: ['jaja', 'jaje'], defaultQuantity: 3 },
    'puter': { pricePerUnit: 1800, unit: 'kg', keywords: ['puter', 'maslac'], defaultQuantity: 0.125 },
    
    'brasno': { pricePerUnit: 80, unit: 'kg', keywords: ['brašno', 'meko', 'oštro'], defaultQuantity: 0.5 },
    'secer': { pricePerUnit: 110, unit: 'kg', keywords: ['šećer'], defaultQuantity: 0.1 },
    'so': { pricePerUnit: 50, unit: 'kg', keywords: ['so'], defaultQuantity: 0.02 },
    'pirinac': { pricePerUnit: 250, unit: 'kg', keywords: ['pirinač', 'riža'], defaultQuantity: 0.25 },
    'testenina': { pricePerUnit: 400, unit: 'kg', keywords: ['testenina', 'makarone', 'špagete', 'kore', 'pasta'], defaultQuantity: 0.5 },
    'kvasac': { pricePerUnit: 60, unit: 'kom', keywords: ['kvasac'], defaultQuantity: 1 },
    
    'krompir': { pricePerUnit: 120, unit: 'kg', keywords: ['krompir'], defaultQuantity: 1 },
    'luk': { pricePerUnit: 100, unit: 'kg', keywords: ['luk', 'crni luk'], defaultQuantity: 0.2 },
    'beli_luk': { pricePerUnit: 800, unit: 'kg', keywords: ['beli luk'], defaultQuantity: 0.03 },
    'sargarepa': { pricePerUnit: 100, unit: 'kg', keywords: ['šargarepa'], defaultQuantity: 0.2 },
    'paprika': { pricePerUnit: 350, unit: 'kg', keywords: ['paprika', 'paprike'], defaultQuantity: 0.4 },
    'paradajz': { pricePerUnit: 300, unit: 'kg', keywords: ['paradajz'], defaultQuantity: 0.5 },
    'suseni_paradajz': { pricePerUnit: 2500, unit: 'kg', keywords: ['sušeni paradajz'], defaultQuantity: 0.1 },
    'krastavac': { pricePerUnit: 200, unit: 'kg', keywords: ['krastavac'], defaultQuantity: 0.3 },
    'kupus': { pricePerUnit: 80, unit: 'kg', keywords: ['kupus', 'kiseli kupus'], defaultQuantity: 1 },
    'sampinjoni': { pricePerUnit: 450, unit: 'kg', keywords: ['šampinjoni', 'pečurke'], defaultQuantity: 0.4 },
    'grasak': { pricePerUnit: 300, unit: 'kg', keywords: ['grašak'], defaultQuantity: 0.4 },
    'pasulj': { pricePerUnit: 400, unit: 'kg', keywords: ['pasulj'], defaultQuantity: 0.5 },
    
    'pesto': { pricePerUnit: 400, unit: 'pakovanje', keywords: ['pesto'], defaultQuantity: 1 },
    'jabuke': { pricePerUnit: 120, unit: 'kg', keywords: ['jabuke', 'jabuka'], defaultQuantity: 0.5 },
    'limun': { pricePerUnit: 250, unit: 'kg', keywords: ['limun'], defaultQuantity: 0.2 },
    'orasi': { pricePerUnit: 1300, unit: 'kg', keywords: ['orasi', 'orah'], defaultQuantity: 0.15 },
    'cokolada': { pricePerUnit: 1800, unit: 'kg', keywords: ['čokolada'], defaultQuantity: 0.1 },
    'majonez': { pricePerUnit: 800, unit: 'kg', keywords: ['majonez'], defaultQuantity: 0.2 },
    'kecap': { pricePerUnit: 400, unit: 'kg', keywords: ['kečap'], defaultQuantity: 0.1 },
    'senf': { pricePerUnit: 600, unit: 'kg', keywords: ['senf'], defaultQuantity: 0.05 },
};

/**
 * Parses quantity string (e.g., "500g", "1.5kg", "3 komada") into a value in the target unit.
 */
export function parseQuantity(quantityStr: string, targetUnit: string, defaultVal: number = 0.1): number {
    if (!quantityStr || quantityStr.trim().length === 0) return defaultVal;
    
    const cleanStr = quantityStr.toLowerCase().replace(',', '.').replace(/[^\d.a-z]/g, '').trim();
    const match = cleanStr.match(/(\d+(\.\d+)?)/);
    
    if (!match) return defaultVal;
    
    const value = parseFloat(match[1]);
    
    // Handle units
    if (cleanStr.includes('kg')) return targetUnit === 'kg' ? value : value * 1000;
    if (cleanStr.includes('g')) return targetUnit === 'kg' ? value / 1000 : value;
    if (cleanStr.includes('ml')) return targetUnit === 'L' ? value / 1000 : value;
    if (cleanStr.includes('l')) return targetUnit === 'L' ? value : value * 1000;
    
    // Default or piece-based
    return value;
}

/**
 * Finds the price for a given ingredient name.
 */
export function findIngredientPrice(name: string, customPrices?: Record<string, IngredientPrice>): IngredientPrice | null {
    const normalizedName = name.toLowerCase();
    const dictionary = customPrices || INGREDIENT_PRICES;
    
    // Direct match check in keys
    for (const key in dictionary) {
        const item = dictionary[key];
        if (item.keywords.some(keyword => normalizedName.includes(keyword))) {
            return item;
        }
    }
    
    return null;
}

/**
 * Calculates the total cost of a recipe based on its ingredients.
 */
export function calculateRecipeCost(
    ingredients: Array<{ name: string; quantity: string }>, 
    customPrices?: Record<string, IngredientPrice>
): number {
    let total = 0;
    
    ingredients.forEach(ing => {
        const priceInfo = findIngredientPrice(ing.name, customPrices);
        if (priceInfo) {
            const amount = parseQuantity(ing.quantity, priceInfo.unit, priceInfo.defaultQuantity || 0.1);
            total += amount * priceInfo.pricePerUnit;
        } else {
            // Default flat price for unknown ingredients
            if (ing.name.length < 5) {
                total += 15;
            } else {
                total += 60; 
            }
        }
    });

    // Add general "pantry staples" overhead
    return Math.round(total + 80);
}
