export type DeceasedGender = 'male' | 'female';

export interface EstateItem {
  id: string;
  name: string;
  amount: number;
}

export interface EstateInput {
  cash: number;
  realEstate: number;
  goldJewelry: number;
  otherAssets: number;
  burialCosts: number;
  debtsCollateral: number;
  debtsUnsecured: number; // Zakat, loans, unpaid mahr, etc.
  wasiyyahAmount: number; // Bequest to non-heirs
  wasiyyahRecipientIsHeir?: boolean; // Invalid under Shariah: "لا وصية لوارث"
  // Stacked / Itemized breakdowns
  cashItems?: EstateItem[];
  realEstateItems?: EstateItem[];
  goldJewelryItems?: EstateItem[];
  otherAssetsItems?: EstateItem[];
  debtsItems?: EstateItem[];
}

export interface HeirsInput {
  // Spouses
  wivesCount: number; // 0-4 (only if deceased was male)
  husband: boolean;   // true/false (only if deceased was female)

  // Primary Ascendants
  father: boolean;
  mother: boolean;

  // Secondary Ascendants (Grandparents)
  paternalGrandfather: boolean; // أبو الأب
  maternalGrandmother: boolean; // أم الأم
  paternalGrandmother: boolean; // أم الأب

  // Descendants
  sonsCount: number;
  daughtersCount: number;
  grandsonsCount: number;     // ابن الابن
  granddaughtersCount: number; // بنت الابن

  // Siblings
  fullBrothersCount: number;     // الأخ الشقيق
  fullSistersCount: number;      // الأخت الشقيقة
  paternalBrothersCount: number; // الأخ لأب
  paternalSistersCount: number;  // الأخت لأب
  maternalBrothersCount: number; // الأخ لأم
  maternalSistersCount: number;  // الأخت لأم

  // Agnatic Collaterals
  nephewsFullCount: number;           // ابن الأخ الشقيق
  nephewsPaternalCount: number;       // ابن الأخ لأب
  paternalUnclesFullCount: number;    // العم الشقيق
  paternalUnclesPaternalCount: number;// العم لأب
  cousinsFullCount: number;           // ابن العم الشقيق
  cousinsPaternalCount: number;        // ابن العم لأب
}

export interface RationalFraction {
  numerator: number;
  denominator: number;
}

export type HeirCategory = 'fard' | 'asabah' | 'fard_and_asabah' | 'awl_adjusted' | 'radd_adjusted';

export interface CalculatedShare {
  heirId: string;
  relationshipKey: string;
  count: number;
  category: HeirCategory;
  individualFraction: RationalFraction;
  totalFraction: RationalFraction;
  percentage: number;
  totalMonetaryValue: number;
  perIndividualMonetaryValue: number;
  daleelIds: string[];
  explanation: {
    en: string;
    ar: string;
    ur: string;
  };
}

export interface BlockedHeir {
  heirId: string;
  relationshipKey: string;
  count: number;
  blockedBy: string[];
  reason: {
    en: string;
    ar: string;
    ur: string;
  };
  daleelIds: string[];
}

export interface EstateCalculationSummary {
  grossEstate: number;
  burialCosts: number;
  debtsTotal: number;
  estateAfterDebts: number;
  wasiyyahRequested: number;
  wasiyyahApproved: number;
  wasiyyahCapped: boolean;
  netInheritableEstate: number;
}

export interface MawarithResult {
  summary: EstateCalculationSummary;
  heirs: CalculatedShare[];
  blockedHeirs: BlockedHeir[];
  baseDenominator: number; // أصل المسألة
  adjustedDenominator: number; // بعد العول أو الرد إن وجد
  isAwl: boolean;
  isRadd: boolean;
  isUmariyyatan: boolean; // الغراوان / العمريتان
  surplusRemainderAmount: number; // If any residue remains (e.g. Beit al-Mal or unallocated)
  warnings: string[];
}

export type WirasatResult = MawarithResult;
