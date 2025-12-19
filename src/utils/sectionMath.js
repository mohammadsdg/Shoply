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
      return Math.PI * radius * radius;
    }
    case SECTION_TYPES.PIPE: {
      const outerDiameter = mmToMeters(params.paramOne);
      const innerDiameter = mmToMeters(params.paramTwo);
      if (!outerDiameter || outerDiameter <= 0 || innerDiameter == null) {
        return null;
      }
      const inner = innerDiameter > 0 ? Math.PI * Math.pow(innerDiameter / 2, 2) : 0;
      const outer = Math.PI * Math.pow(outerDiameter / 2, 2);
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
