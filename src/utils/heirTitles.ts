import { SupportedLanguage } from '../i18n/translations';

export interface HeirLike {
  heirId?: string;
  relationshipKey?: string;
  count?: number;
}

export function getHeirDisplayName(heir: HeirLike, language: SupportedLanguage): string {
  const key = heir.relationshipKey || heir.heirId || '';
  const count = heir.count ?? 1;
  const isPlural = count > 1;

  switch (key) {
    case 'wives':
      if (language === 'ar') return isPlural ? 'الزوجات' : 'الزوجة';
      if (language === 'ur') return isPlural ? 'بیویاں' : 'بیوی';
      return isPlural ? 'Wives' : 'Wife';

    case 'husband':
      if (language === 'ar') return 'الزوج';
      if (language === 'ur') return 'شوہر';
      return 'Husband';

    case 'father':
      if (language === 'ar') return 'الأب';
      if (language === 'ur') return 'والد';
      return 'Father';

    case 'mother':
      if (language === 'ar') return 'الأم';
      if (language === 'ur') return 'والدہ';
      return 'Mother';

    case 'paternalGrandfather':
      if (language === 'ar') return 'الجد الصحيح (أبو الأب)';
      if (language === 'ur') return 'دادا (باپ کا باپ)';
      return 'Paternal Grandfather';

    case 'paternalGrandmother':
      if (language === 'ar') return 'الجدة لأب (أم الأب)';
      if (language === 'ur') return 'دادی (باپ کی ماں)';
      return 'Paternal Grandmother';

    case 'maternalGrandmother':
      if (language === 'ar') return 'الجدة لأم (أم الأم)';
      if (language === 'ur') return 'نانی (ماں کی ماں)';
      return 'Maternal Grandmother';

    case 'sons':
      if (language === 'ar') return isPlural ? 'الأبناء' : 'الابن';
      if (language === 'ur') return isPlural ? 'بیٹے' : 'بیٹا';
      return isPlural ? 'Sons' : 'Son';

    case 'daughters':
      if (language === 'ar') return isPlural ? 'البنات' : 'البنت';
      if (language === 'ur') return isPlural ? 'بیٹیاں' : 'بیٹی';
      return isPlural ? 'Daughters' : 'Daughter';

    case 'grandsons':
      if (language === 'ar') return isPlural ? 'أبناء الابن' : 'ابن الابن';
      if (language === 'ur') return isPlural ? 'پوتے' : 'پوتا';
      return isPlural ? 'Grandsons' : 'Grandson';

    case 'granddaughters':
      if (language === 'ar') return isPlural ? 'بنات الابن' : 'بنت الابن';
      if (language === 'ur') return isPlural ? 'پوتیاں' : 'پوتی';
      return isPlural ? 'Granddaughters' : 'Granddaughter';

    case 'fullBrothers':
      if (language === 'ar') return isPlural ? 'الإخوة الأشقاء' : 'الأخ الشقيق';
      if (language === 'ur') return isPlural ? 'سگے بھائی' : 'سگا بھائی';
      return isPlural ? 'Full Brothers' : 'Full Brother';

    case 'fullSisters':
      if (language === 'ar') return isPlural ? 'الأخوات الشقائق' : 'الأخت الشقيقة';
      if (language === 'ur') return isPlural ? 'سگی بہنیں' : 'سگی بہن';
      return isPlural ? 'Full Sisters' : 'Full Sister';

    case 'paternalBrothers':
      if (language === 'ar') return isPlural ? 'الإخوة لأب' : 'الأخ لأب';
      if (language === 'ur') return isPlural ? 'علاتی بھائی' : 'علاتی بھائی';
      return isPlural ? 'Paternal Brothers' : 'Paternal Brother';

    case 'paternalSisters':
      if (language === 'ar') return isPlural ? 'الأخوات لأب' : 'الأخت لأب';
      if (language === 'ur') return isPlural ? 'علاتی بہنیں' : 'علاتی بہن';
      return isPlural ? 'Paternal Sisters' : 'Paternal Sister';

    case 'maternalBrothers':
      if (language === 'ar') return isPlural ? 'الإخوة لأم' : 'الأخ لأم';
      if (language === 'ur') return isPlural ? 'اخیافی بھائی' : 'اخیافی بھائی';
      return isPlural ? 'Maternal Brothers' : 'Maternal Brother';

    case 'maternalSisters':
      if (language === 'ar') return isPlural ? 'الأخوات لأم' : 'الأخت لأم';
      if (language === 'ur') return isPlural ? 'اخیافی بہنیں' : 'اخیافی بہن';
      return isPlural ? 'Maternal Sisters' : 'Maternal Sister';

    case 'nephewsFull':
      if (language === 'ar') return isPlural ? 'أبناء الأخ الشقيق' : 'ابن الأخ الشقيق';
      if (language === 'ur') return isPlural ? 'سگے بھتیجے' : 'سگا بھتیجا';
      return isPlural ? 'Full Nephews' : 'Full Nephew';

    case 'nephewsPaternal':
      if (language === 'ar') return isPlural ? 'أبناء الأخ لأب' : 'ابن الأخ لأب';
      if (language === 'ur') return isPlural ? 'علاتی بھتیجے' : 'علاتی بھتیجا';
      return isPlural ? 'Paternal Nephews' : 'Paternal Nephew';

    case 'paternalUnclesFull':
      if (language === 'ar') return isPlural ? 'الأعمام الأشقاء' : 'العم الشقيق';
      if (language === 'ur') return isPlural ? 'سگے چچا' : 'سگے چچا';
      return isPlural ? 'Full Paternal Uncles' : 'Full Paternal Uncle';

    case 'paternalUnclesPaternal':
      if (language === 'ar') return isPlural ? 'الأعمام لأب' : 'العم لأب';
      if (language === 'ur') return isPlural ? 'علاتی چچا' : 'علاتی چچا';
      return isPlural ? 'Paternal Paternal Uncles' : 'Paternal Paternal Uncle';

    case 'cousinsFull':
      if (language === 'ar') return isPlural ? 'أبناء العم الشقيق' : 'ابن العم الشقيق';
      if (language === 'ur') return isPlural ? 'سگے چچازاد بھائی' : 'سگے چچازاد بھائی';
      return isPlural ? 'Full Male Cousins' : 'Full Male Cousin';

    case 'cousinsPaternal':
      if (language === 'ar') return isPlural ? 'أبناء العم لأب' : 'ابن العم لأب';
      if (language === 'ur') return isPlural ? 'علاتی چچازاد بھائی' : 'علاتی چچازاد بھائی';
      return isPlural ? 'Paternal Male Cousins' : 'Paternal Male Cousin';

    default:
      return key;
  }
}
