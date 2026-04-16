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
const PACK_AMOUNT = 2500;
const FDHC_GROSS_PROFIT = 0.55; // 55%
const MSRP_GROSS_PROFIT = 0.65; // 65%

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

  // Calculate FDHC Price (factory cost + $2500 pack + 55% gross profit)
  const fdhcCost = totalFactoryCost + PACK_AMOUNT;
  const fdhcPrice = fdhcCost / (1 - FDHC_GROSS_PROFIT);

  // Calculate MSRP (factory cost + $2500 pack + 65% gross profit)
  const msrpCost = totalFactoryCost + PACK_AMOUNT;
  const msrp = msrpCost / (1 - MSRP_GROSS_PROFIT);

  // Calculate savings
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
