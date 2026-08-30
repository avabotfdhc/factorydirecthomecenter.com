// Pricing Engine for Factory Direct Homes Center
// Calculates MSRP, FDHC Price, and Sales Campaign pricing

export interface FactoryCost {
  sku: string;
  basePrice: number;
  sqft: number;
  surchargePerSqft: number; // $0.50 for singles, $0.65 for sectional
}

export interface PricingResult {
  sku: string;
  factoryCost: number;
  packAmount: number;
  fdhcPrice: number;
  fdhcPriceFormatted: string;
  msrp: number;
  msrpFormatted: string;
  savings: number;
  savingsFormatted: string;
  savingsPercent: number;
  salesPrice?: number;
  salesPriceFormatted?: string;
  salesSavings?: number;
  salesSavingsFormatted?: string;
  isOnSale: boolean;
  campaignName?: string;
  campaignEndDate?: string;
}

export interface SalesCampaign {
  id: string;
  name: string;
  description: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  discountPercent: number; // e.g., 5 for 5% off FDHC price
  applicableModels: string[]; // SKU patterns or 'all'
  isActive: boolean;
}

// Constants
//
// DEPRECATED — do not build on this. The authority on pricing is the master
// price sheet, in src/lib/price-sheet.ts (msrpFor / factoryDirectPriceFor).
// Every constant here was wrong against that sheet: the pack was $2,500 rather
// than $3,000, the markup 1.65 rather than 1.85, and the per-sqft surcharge
// $0.50 rather than $1.80 (single) / $1.95 (sectional). Together they produced
// an MSRP roughly 25% below the real one. Nothing renders from this file today
// (only its campaign helpers are imported, by the admin page), and the values
// are corrected here so that stays harmless if anyone ever calls it.
const PACK_AMOUNT = 3000;
const MSRP_MULTIPLIER = 1.85; // (factory cost + pack) x 1.85
const FDHC_DISCOUNT = 0.05; // Factory Direct Price = MSRP - 5%

// Factory cost database (from CSV files)
export const factoryCosts: Record<string, FactoryCost> = {
  // Aspire Singles - 14' Series
  "1432H11214": { sku: "1432H11214", basePrice: 25495, sqft: 448, surchargePerSqft: 0.50 },
  "1440H11065": { sku: "1440H11065", basePrice: 27475, sqft: 560, surchargePerSqft: 0.50 },
  "1444H11023": { sku: "1444H11023", basePrice: 29820, sqft: 616, surchargePerSqft: 0.50 },
  "1452H21023": { sku: "1452H21023", basePrice: 33150, sqft: 728, surchargePerSqft: 0.50 },
  "1452H21081": { sku: "1452H21081", basePrice: 32385, sqft: 728, surchargePerSqft: 0.50 },
  "1456H21023": { sku: "1456H21023", basePrice: 34815, sqft: 784, surchargePerSqft: 0.50 },
  "1456H21030": { sku: "1456H21030", basePrice: 34245, sqft: 784, surchargePerSqft: 0.50 },
  "1460H21216": { sku: "1460H21216", basePrice: 35010, sqft: 840, surchargePerSqft: 0.50 },
  "1460H22215": { sku: "1460H22215", basePrice: 36460, sqft: 840, surchargePerSqft: 0.50 },
  "1466H32082": { sku: "1466H32082", basePrice: 38195, sqft: 924, surchargePerSqft: 0.50 },
  "1470H32082": { sku: "1470H32082", basePrice: 40320, sqft: 980, surchargePerSqft: 0.50 },
  "1476H32082": { sku: "1476H32082", basePrice: 42640, sqft: 1064, surchargePerSqft: 0.50 },
  
  // Aspire Singles - 16' Series
  "1652H21083": { sku: "1652H21083", basePrice: 35605, sqft: 832, surchargePerSqft: 0.50 },
  "1652H21151": { sku: "1652H21151", basePrice: 35055, sqft: 832, surchargePerSqft: 0.50 },
  "1656H22208": { sku: "1656H22208", basePrice: 37260, sqft: 896, surchargePerSqft: 0.50 },
  "1660H22212": { sku: "1660H22212", basePrice: 39380, sqft: 960, surchargePerSqft: 0.50 },
  "1660H32206": { sku: "1660H32206", basePrice: 38095, sqft: 960, surchargePerSqft: 0.50 },
  "1664H32212": { sku: "1664H32212", basePrice: 40895, sqft: 1024, surchargePerSqft: 0.50 },
  "1666H22091": { sku: "1666H22091", basePrice: 44495, sqft: 1056, surchargePerSqft: 0.50 },
  "1666H22232": { sku: "1666H22232", basePrice: 41450, sqft: 1056, surchargePerSqft: 0.50 },
  "1666H32085": { sku: "1666H32085", basePrice: 39995, sqft: 1056, surchargePerSqft: 0.50 },
  "1666H32212": { sku: "1666H32212", basePrice: 42200, sqft: 1056, surchargePerSqft: 0.50 },
  "1666H32217": { sku: "1666H32217", basePrice: 41680, sqft: 1056, surchargePerSqft: 0.50 },
  "1666H32219": { sku: "1666H32219", basePrice: 41035, sqft: 1056, surchargePerSqft: 0.50 },
  "1668H22259": { sku: "1668H22259", basePrice: 42295, sqft: 1088, surchargePerSqft: 0.50 },
  "1668H32085": { sku: "1668H32085", basePrice: 40830, sqft: 1088, surchargePerSqft: 0.50 },
  "1668H32087": { sku: "1668H32087", basePrice: 41850, sqft: 1088, surchargePerSqft: 0.50 },
  "1668H32220": { sku: "1668H32220", basePrice: 42940, sqft: 1088, surchargePerSqft: 0.50 },
  "1672H32087": { sku: "1672H32087", basePrice: 43515, sqft: 1152, surchargePerSqft: 0.50 },
  "1672H32090": { sku: "1672H32090", basePrice: 43495, sqft: 1152, surchargePerSqft: 0.50 },
  "1676H32085": { sku: "1676H32085", basePrice: 44160, sqft: 1216, surchargePerSqft: 0.50 },
  "1676H32087": { sku: "1676H32087", basePrice: 45180, sqft: 1216, surchargePerSqft: 0.50 },
  "1676H32089": { sku: "1676H32089", basePrice: 47995, sqft: 1216, surchargePerSqft: 0.50 },
  "1676H32090": { sku: "1676H32090", basePrice: 43995, sqft: 1216, surchargePerSqft: 0.50 },
  "1676H32091": { sku: "1676H32091", basePrice: 48660, sqft: 1216, surchargePerSqft: 0.50 },
  "1676H32107": { sku: "1676H32107", basePrice: 43995, sqft: 1216, surchargePerSqft: 0.50 },
  "1676H32212": { sku: "1676H32212", basePrice: 47730, sqft: 1216, surchargePerSqft: 0.50 },
  "1676H32221": { sku: "1676H32221", basePrice: 48790, sqft: 1216, surchargePerSqft: 0.50 },
  "1676H32222": { sku: "1676H32222", basePrice: 46395, sqft: 1216, surchargePerSqft: 0.50 },
  "1676H32259": { sku: "1676H32259", basePrice: 44995, sqft: 1216, surchargePerSqft: 0.50 },
  
  // Prime Series (no surcharge - base price is total cost)
  "PEAK": { sku: "PEAK", basePrice: 27695, sqft: 784, surchargePerSqft: 0 }, // $30195 - $2500 pack
  "PEAK-RA": { sku: "PEAK-RA", basePrice: 27695, sqft: 784, surchargePerSqft: 0 },
  "CREST": { sku: "CREST", basePrice: 29480, sqft: 840, surchargePerSqft: 0 },
  "CREST-RA": { sku: "CREST-RA", basePrice: 29480, sqft: 840, surchargePerSqft: 0 },
  "ZENITH": { sku: "ZENITH", basePrice: 31700, sqft: 924, surchargePerSqft: 0 },
  "ZENITH-RA": { sku: "ZENITH-RA", basePrice: 31700, sqft: 924, surchargePerSqft: 0 },
  "PIKE": { sku: "PIKE", basePrice: 23995, sqft: 576, surchargePerSqft: 0 },
  "FULTON": { sku: "FULTON", basePrice: 27495, sqft: 768, surchargePerSqft: 0 },
  "FULTON-RA": { sku: "FULTON-RA", basePrice: 27495, sqft: 768, surchargePerSqft: 0 },
  "GALLATIN": { sku: "GALLATIN", basePrice: 28495, sqft: 832, surchargePerSqft: 0 },
  "GALLATIN-RA": { sku: "GALLATIN-RA", basePrice: 28495, sqft: 832, surchargePerSqft: 0 },
  "BARKLEY": { sku: "BARKLEY", basePrice: 29460, sqft: 896, surchargePerSqft: 0 },
  "BARKLEY-RA": { sku: "BARKLEY-RA", basePrice: 29460, sqft: 896, surchargePerSqft: 0 },
  "SPIRE": { sku: "SPIRE", basePrice: 30720, sqft: 960, surchargePerSqft: 0 },
  "SPIRE-RA": { sku: "SPIRE-RA", basePrice: 30720, sqft: 960, surchargePerSqft: 0 },
  "CASEY": { sku: "CASEY", basePrice: 31595, sqft: 960, surchargePerSqft: 0 },
  "VERTEX": { sku: "VERTEX", basePrice: 34220, sqft: 1056, surchargePerSqft: 0 },
  "VERTEX-RA": { sku: "VERTEX-RA", basePrice: 34220, sqft: 1056, surchargePerSqft: 0 },
  "HICKMAN": { sku: "HICKMAN", basePrice: 36080, sqft: 1056, surchargePerSqft: 0 },
  "PENDLETON": { sku: "PENDLETON", basePrice: 36080, sqft: 1056, surchargePerSqft: 0 },
  "BARDSTOWN": { sku: "BARDSTOWN", basePrice: 34850, sqft: 1152, surchargePerSqft: 0 },
  "BARDSTOWN-RA": { sku: "BARDSTOWN-RA", basePrice: 34850, sqft: 1152, surchargePerSqft: 0 },
  "BALLARD": { sku: "BALLARD", basePrice: 36710, sqft: 1152, surchargePerSqft: 0 },
  "POWELL": { sku: "POWELL", basePrice: 36710, sqft: 1152, surchargePerSqft: 0 },
  "RIDGE": { sku: "RIDGE", basePrice: 37120, sqft: 1216, surchargePerSqft: 0 },
  "RIDGE-RA": { sku: "RIDGE-RA", basePrice: 37120, sqft: 1216, surchargePerSqft: 0 },
  "MONTE": { sku: "MONTE", basePrice: 38195, sqft: 1216, surchargePerSqft: 0 },
  "MONTE-RA": { sku: "MONTE-RA", basePrice: 38195, sqft: 1216, surchargePerSqft: 0 },
  "SOMERSET": { sku: "SOMERSET", basePrice: 38495, sqft: 1216, surchargePerSqft: 0 },
  "FLOYD": { sku: "FLOYD", basePrice: 38495, sqft: 1216, surchargePerSqft: 0 },
  "PLATEAU": { sku: "PLATEAU", basePrice: 43685, sqft: 1152, surchargePerSqft: 0 },
  "HORIZON": { sku: "HORIZON", basePrice: 46710, sqft: 1344, surchargePerSqft: 0 },
  "ESTILL": { sku: "ESTILL", basePrice: 42690, sqft: 1232, surchargePerSqft: 0 },
  "CHURCHILL": { sku: "CHURCHILL", basePrice: 44900, sqft: 1344, surchargePerSqft: 0 },
  "MERCER": { sku: "MERCER", basePrice: 46295, sqft: 1456, surchargePerSqft: 0 },
  "APEX": { sku: "APEX", basePrice: 47145, sqft: 1568, surchargePerSqft: 0 },
  "CROWN": { sku: "CROWN", basePrice: 47945, sqft: 1568, surchargePerSqft: 0 },
  "THE-GRAND": { sku: "THE-GRAND", basePrice: 56195, sqft: 1904, surchargePerSqft: 0 },
  "PINNACLE": { sku: "PINNACLE", basePrice: 61495, sqft: 1568, surchargePerSqft: 0 },
};

// Active sales campaigns (managed by admin)
let activeCampaigns: SalesCampaign[] = [];

// Load campaigns from localStorage (client-side) or env (server-side)
export function loadCampaigns(): SalesCampaign[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('fdhc_sales_campaigns');
    if (stored) {
      try {
        activeCampaigns = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse campaigns:', e);
      }
    }
  }
  return activeCampaigns;
}

// Save campaigns (admin function)
export function saveCampaigns(campaigns: SalesCampaign[]): void {
  activeCampaigns = campaigns;
  if (typeof window !== 'undefined') {
    localStorage.setItem('fdhc_sales_campaigns', JSON.stringify(campaigns));
  }
}

// Add a new campaign (admin function)
export function addCampaign(campaign: Omit<SalesCampaign, 'id'>): SalesCampaign {
  const newCampaign: SalesCampaign = {
    ...campaign,
    id: `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
  activeCampaigns.push(newCampaign);
  saveCampaigns(activeCampaigns);
  return newCampaign;
}

// Check if campaign is currently active
function isCampaignActive(campaign: SalesCampaign): boolean {
  if (!campaign.isActive) return false;
  const now = new Date();
  const start = new Date(campaign.startDate);
  const end = new Date(campaign.endDate);
  return now >= start && now <= end;
}

// Check if model applies to campaign
function modelAppliesToCampaign(sku: string, campaign: SalesCampaign): boolean {
  if (campaign.applicableModels.includes('all')) return true;
  return campaign.applicableModels.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(sku);
    }
    return sku === pattern;
  });
}

// Get active campaign for a specific model
function getActiveCampaignForModel(sku: string): SalesCampaign | undefined {
  loadCampaigns();
  return activeCampaigns.find(c => 
    isCampaignActive(c) && modelAppliesToCampaign(sku, c)
  );
}

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Calculate pricing for a model
export function calculatePricing(sku: string): PricingResult | null {
  const cost = factoryCosts[sku];
  if (!cost) return null;

  // Calculate factory cost with surcharge
  const surcharge = cost.sqft * cost.surchargePerSqft;
  const totalFactoryCost = cost.basePrice + surcharge;

  // Calculate MSRP = (Factory Cost + Pack) × 1.65
  const msrpBase = totalFactoryCost + PACK_AMOUNT;
  const msrp = msrpBase * MSRP_MULTIPLIER;

  // Calculate FDHC Price = MSRP - 10%
  const fdhcPrice = msrp * (1 - FDHC_DISCOUNT);

  // Calculate savings (MSRP vs FDHC)
  const savings = msrp - fdhcPrice;
  const savingsPercent = (savings / msrp) * 100;

  // Check for active sales campaign
  const campaign = getActiveCampaignForModel(sku);
  let salesPrice: number | undefined;
  let salesSavings: number | undefined;

  if (campaign) {
    // Apply campaign discount to FDHC price
    salesPrice = fdhcPrice * (1 - campaign.discountPercent / 100);
    salesSavings = msrp - salesPrice;
  }

  return {
    sku,
    factoryCost: totalFactoryCost,
    packAmount: PACK_AMOUNT,
    fdhcPrice: Math.round(fdhcPrice),
    fdhcPriceFormatted: formatCurrency(fdhcPrice),
    msrp: Math.round(msrp),
    msrpFormatted: formatCurrency(msrp),
    savings: Math.round(savings),
    savingsFormatted: formatCurrency(savings),
    savingsPercent: Math.round(savingsPercent),
    salesPrice: salesPrice ? Math.round(salesPrice) : undefined,
    salesPriceFormatted: salesPrice ? formatCurrency(salesPrice) : undefined,
    salesSavings: salesSavings ? Math.round(salesSavings) : undefined,
    salesSavingsFormatted: salesSavings ? formatCurrency(salesSavings) : undefined,
    isOnSale: !!campaign,
    campaignName: campaign?.name,
    campaignEndDate: campaign?.endDate,
  };
}

// Get pricing display for a floor plan
export function getPricingDisplay(sku: string): {
  wasPrice: string;
  nowPrice: string;
  savings: string;
  savingsPercent: number;
  badge?: string;
  campaignName?: string;
  campaignEnds?: string;
} | null {
  const pricing = calculatePricing(sku);
  if (!pricing) return null;

  const result: {
    wasPrice: string;
    nowPrice: string;
    savings: string;
    savingsPercent: number;
    badge?: string;
    campaignName?: string;
    campaignEnds?: string;
  } = {
    wasPrice: pricing.msrpFormatted,
    nowPrice: pricing.fdhcPriceFormatted,
    savings: pricing.savingsFormatted,
    savingsPercent: pricing.savingsPercent,
  };

  // If on sale, show sale price as "now" and FDHC price as middle
  if (pricing.isOnSale && pricing.salesPriceFormatted) {
    result.nowPrice = pricing.salesPriceFormatted;
    result.savings = pricing.salesSavingsFormatted || pricing.savingsFormatted;
    result.badge = 'SALE';
    result.campaignName = pricing.campaignName;
    result.campaignEnds = pricing.campaignEndDate;
  }

  return result;
}

// Bulk update pricing for all floor plans
export function updateAllPricing(): Record<string, PricingResult> {
  const results: Record<string, PricingResult> = {};
  
  Object.keys(factoryCosts).forEach(sku => {
    const pricing = calculatePricing(sku);
    if (pricing) {
      results[sku] = pricing;
    }
  });
  
  return results;
}

// Example campaigns for testing
export const exampleCampaigns: SalesCampaign[] = [
  {
    id: 'campaign_spring_2026',
    name: 'Spring Savings Event',
    description: '5% off all Aspire single wides through April',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    discountPercent: 5,
    applicableModels: ['14*', '16*', '18*'], // All single wides
    isActive: true,
  },
  {
    id: 'campaign_memorial_2026',
    name: 'Memorial Day Sale',
    description: '10% off all double wides',
    startDate: '2026-05-24',
    endDate: '2026-05-27',
    discountPercent: 10,
    applicableModels: ['*Monroe*', '*Brighton*', '*Silverton*'],
    isActive: true,
  },
];

// Initialize with example campaigns (remove in production)
if (typeof window !== 'undefined' && !localStorage.getItem('fdhc_sales_campaigns')) {
  saveCampaigns(exampleCampaigns);
}
