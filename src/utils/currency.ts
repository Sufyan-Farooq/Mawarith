export interface CurrencyOption {
  code: string;
  symbol: string;
  name: {
    en: string;
    ar: string;
    ur: string;
  };
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'SAR', symbol: 'ر.س', name: { en: 'Saudi Riyal (SAR)', ar: 'ريال سعودي (ر.س)', ur: 'سعودی ریال (SAR)' } },
  { code: 'USD', symbol: '$', name: { en: 'US Dollar ($)', ar: 'دولار أمريكي ($)', ur: 'امریکی ڈالر ($)' } },
  { code: 'AED', symbol: 'د.إ', name: { en: 'UAE Dirham (AED)', ar: 'درهم إماراتي (د.إ)', ur: 'اماراتی درہم (AED)' } },
  { code: 'INR', symbol: '₹', name: { en: 'Indian Rupee (₹)', ar: 'روبية هندية (₹)', ur: 'بھارتی روپیہ (₹)' } },
  { code: 'PKR', symbol: 'Rs', name: { en: 'Pakistani Rupee (PKR)', ar: 'روبية باكستانية (PKR)', ur: 'پاکستانی روپیہ (PKR)' } },
  { code: 'EUR', symbol: '€', name: { en: 'Euro (€)', ar: 'يورو (€)', ur: 'یورو (€)' } },
  { code: 'GBP', symbol: '£', name: { en: 'British Pound (£)', ar: 'جنيه إسترليني (£)', ur: 'برطانوی پاؤنڈ (£)' } },
];

export function formatCurrency(amount: number, currencyCode: string = 'SAR', language: 'en' | 'ar' | 'ur' = 'en'): string {
  const curr = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  const formattedNumber = new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : language === 'ur' ? 'ur-PK' : 'en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(Math.round(amount * 100) / 100);

  if (language === 'ar') {
    return `${formattedNumber} ${curr.symbol}`;
  }
  if (language === 'ur') {
    return `${formattedNumber} ${curr.symbol === 'ر.س' ? 'SAR' : curr.symbol}`;
  }
  if (curr.code === 'SAR') {
    return `SAR ${formattedNumber}`;
  }
  if (curr.symbol === '$' || curr.symbol === '€' || curr.symbol === '£' || curr.symbol === '₹') {
    return `${curr.symbol}${formattedNumber}`;
  }
  return `${curr.code} ${formattedNumber}`;
}
