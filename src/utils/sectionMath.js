export const SECTION_TYPES = {
  ROUND: "round",
  PIPE: "pipe",
  SHEET: "sheet",
  HEX: "hex",
};

const SECTION_MAP = {
  1: SECTION_TYPES.ROUND,
  2: SECTION_TYPES.SHEET,
  3: SECTION_TYPES.PIPE,
  4: SECTION_TYPES.SHEET,
  5: SECTION_TYPES.HEX,
};

const SECTION_ALIASES = {
  [SECTION_TYPES.ROUND]: ["round", "gerd", "roundbar", "میلگرد", "گرد"],
  [SECTION_TYPES.SHEET]: [
    "sheet",
    "plate",
    "bar",
    "flat",
    "varagh",
    "tasmeh",
    "ورق",
    "تسمه",
    "فلت",
  ],
  [SECTION_TYPES.PIPE]: ["pipe", "tube", "loole", "لوله"],
  [SECTION_TYPES.HEX]: [
    "hex",
    "hexagon",
    "شش گوش",
    "شش پر",
    "ششپهلو",
    "شش پره",
  ],
};

const normalizeText = (value) => {
  if (!value) return "";
  return value
    .toString()
    .trim()
    .replace(/\u200c/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
};

export const computeCircleArea = (diameter) => {
  return diameter * diameter * 3.14 / 4;
}

export const resolveSectionType = (sectionId, sectionName) => {
  const normalized = normalizeText(sectionName);
  if (normalized) {
    for (const [type, aliases] of Object.entries(SECTION_ALIASES)) {
      if (aliases.some((alias) => normalized.includes(alias))) {
        return type;
      }
    }
  }
  return SECTION_MAP[Number(sectionId)] ?? null;
};

const mmToMeters = (value) => {
  const parsed = Number(value);
  if (!parsed || Number.isNaN(parsed)) return null;
  return parsed / 1000;
};

export const computeArea = (sectionType, params = {}) => {
  switch (sectionType) {
    case SECTION_TYPES.ROUND: {
      const diameter = mmToMeters(params.paramOne);
      if (!diameter || diameter <= 0) return null;
      const radius = diameter / 2;
      return 3.14 * radius * radius;
    }
    case SECTION_TYPES.PIPE: {
      const outerDiameter = mmToMeters(params.paramOne);
      const innerDiameter = mmToMeters(params.paramTwo);
      if (!outerDiameter || outerDiameter <= 0 || innerDiameter == null) {
        return null;
      }
      const inner = innerDiameter > 0 ? 3.14 * Math.pow(innerDiameter / 2, 2) : 0;
      const outer = 3.14 * Math.pow(outerDiameter / 2, 2);
      return outer - inner;
    }
    case SECTION_TYPES.SHEET: {
      const thickness = mmToMeters(params.paramOne);
      const width = mmToMeters(params.paramTwo);
      if (!thickness || thickness <= 0 || !width || width <= 0) return null;
      return thickness * width;
    }
    case SECTION_TYPES.HEX: {
      const measure = mmToMeters(params.paramOne);
      if (!measure || measure <= 0) return null;
      return (Math.sqrt(3) / 2) * measure * measure;
    }
    default:
      return null;
  }
};

export const calculateCrossSectionArea = ({ sectionId, sectionName, param_one, param_two, param_three }) => {
  const sectionType = resolveSectionType(sectionId, sectionName);
  if (!sectionType) return null;
  return computeArea(sectionType, {
    paramOne: param_one,
    paramTwo: param_two,
    paramThree: param_three,
  });
};

export const calculatePieceWeightKg = ({
  sectionId,
  sectionName,
  width,
  param_one,
  param_two,
  param_three,
  specialWeight,
}) => {
  const sectionType = resolveSectionType(sectionId, sectionName);
  if (!sectionType) return null;
  const lengthMeters = mmToMeters(width);
  if (!lengthMeters || lengthMeters <= 0) return null;
  const area = computeArea(sectionType, {
    paramOne: param_one,
    paramTwo: param_two,
    paramThree: param_three,
  });
  if (!area) return null;
  const density = specialWeight != null ? Number(specialWeight) * 1000 : null;
  if (!density || !Number.isFinite(density) || density <= 0) return null;
  return area * lengthMeters * density;
};

// ============================================================
// UTILITY FUNCTIONS - Number Parsing & Formatting
// ============================================================

/**
 * Parse a value to Number or return null if invalid
 */
export const numberOrNull = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

/**
 * Convert string/number to finite number, default to 0 for invalid
 */
export const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

/**
 * Format a numeric value with optional decimal places
 */
export const formatNumericValue = (value, fractionDigits = 0) => {
  if (value === undefined || value === null || value === "") return "-";
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "-";
  return parsed.toLocaleString("fa-IR", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

/**
 * Format a number as currency (تومان)
 */
export const formatCurrency = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed === 0) return "۰ ریال";
  return `${parsed.toLocaleString("fa-IR")} ریال`;
};

/**
 * Format weight value in kilogram
 */
export const formatWeight = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return "-";
  return `${parsed.toLocaleString("fa-IR")} کیلوگرم`;
};

/**
 * Format date to Persian locale
 */
export const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleString("fa-IR");
};

// ============================================================
// SECTION & DIMENSION UTILITIES
// ============================================================

/**
 * Build section configuration map from sections payload
 */
export const buildSectionConfigMap = (sectionsPayload = []) => {
  const map = {};
  sectionsPayload.forEach((section) => {
    map[section.ID] = {
      id: section.ID,
      name: section.name,
      params: section.params || 0,
      labels: {
        one: section.param_one || "پارامتر ۱",
        two: section.param_two || "پارامتر ۲",
        three: section.param_three || "پارامتر ۳",
      },
    };
  });
  return map;
};

/**
 * Generate dimension key from item and section configs
 */
export const dimensionKeyForItem = (item, sectionConfigs) => {
  const sectionConfig = sectionConfigs[item.section_id];
  if (!sectionConfig || !sectionConfig.params) return null;

  const values = [];
  if (sectionConfig.params >= 1) values.push(item.param_one ?? null);
  if (sectionConfig.params >= 2) values.push(item.param_two ?? null);
  if (sectionConfig.params >= 3) values.push(item.param_three ?? null);

  if (values.some((val) => val == null)) return null;
  return values.join("×");
};

/**
 * Generate readable dimension label from item and section configs
 */
export const dimensionLabelForItem = (item, sectionConfigs) => {
  const key = dimensionKeyForItem(item, sectionConfigs);
  if (!key) return "بدون ابعاد";
  return key.replace(/×/g, " × ");
};

/**
 * Resolve item area using cross section calculation
 */
export const resolveItemArea = (item) =>
  calculateCrossSectionArea({
    sectionId: item.section_id,
    sectionName: item.section_name,
    param_one: item.param_one,
    param_two: item.param_two,
    param_three: item.param_three,
  });

// ============================================================
// INVOICE & CALCULATION UTILITIES
// ============================================================

/**
 * Build description from invoice and shop products
 */
export const buildDescription = (invoice, shopProducts) => {
  const product = shopProducts.find((p) => p.ID === invoice.shop_products_id);
  if (product) {
    return `${product.section_name} ${product.material_name} ${product.alloy_name}`;
  }
  return invoice.manual_brand_name || "کالای متفرقه";
};

/**
 * Calculate invoice totals (product, cutting, transportation, grand total)
 */
export const buildInvoiceTotals = (invoice) => {
  const pricePerWeight = toNumber(invoice?.selling_price || invoice?.price);
  const totalWeight = toNumber(invoice?.total_weight || invoice?.weight);
  const productTotal = pricePerWeight * totalWeight;
  const piecesCount = toNumber(invoice?.number) || 0;
  // `cutting_price` on the invoice is a per-piece value.
  const perPieceCutting = toNumber(invoice?.cutting_price);
  const cuttingTotal = perPieceCutting * piecesCount;
  const perTransportation = toNumber(invoice?.transportation_price) * invoice?.total_weight;
  const transportationTotal =
    perTransportation * piecesCount;
  const grandTotal = productTotal + cuttingTotal + transportationTotal;

  return {
    pricePerWeight,
    totalWeight,
    productTotal,
    cuttingTotal,
    perPieceCutting,
    perTransportation,
    transportationTotal,
    piecesCount,
    grandTotal,
  };
};
