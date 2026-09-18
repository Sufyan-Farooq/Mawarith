import { DeceasedGender, EstateInput, HeirsInput } from '../engine/types';

export interface SampleScenario {
  id: string;
  name: {
    en: string;
    ar: string;
    ur: string;
  };
  description: {
    en: string;
    ar: string;
    ur: string;
  };
  gender: DeceasedGender;
  estate: EstateInput;
  heirs: HeirsInput;
}

const defaultHeirs: HeirsInput = {
  wivesCount: 0,
  husband: false,
  father: false,
  mother: false,
  paternalGrandfather: false,
  maternalGrandmother: false,
  paternalGrandmother: false,
  sonsCount: 0,
  daughtersCount: 0,
  grandsonsCount: 0,
  granddaughtersCount: 0,
  fullBrothersCount: 0,
  fullSistersCount: 0,
  paternalBrothersCount: 0,
  paternalSistersCount: 0,
  maternalBrothersCount: 0,
  maternalSistersCount: 0,
  nephewsFullCount: 0,
  nephewsPaternalCount: 0,
  paternalUnclesFullCount: 0,
  paternalUnclesPaternalCount: 0,
  cousinsFullCount: 0,
  cousinsPaternalCount: 0,
  deceasedName: '',
  heirNames: {},
};

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: 'standard-family',
    name: {
      en: 'Standard Family: Wife, Son, & 2 Daughters',
      ar: 'أسرة قياسية: زوجة وابن وبنتان',
      ur: 'معیاری خاندان: بیوی، ایک بیٹا اور دو بیٹیاں',
    },
    description: {
      en: 'Wife takes 1/8 due to children, and remainder is shared 2:1 between son and daughters.',
      ar: 'للزوجة الثمن لوجود الولد، والباقي للأولاد تعصيباً للذكر مثل حظ الأنثيين.',
      ur: 'اولاد کی موجودگی میں بیوی کو 1/8 اور باقی ترکہ بیٹے اور بیٹیوں میں 2:1 کے تناسب سے تقسیم ہوگا۔',
    },
    gender: 'male',
    estate: {
      cash: 240000,
      realEstate: 0,
      goldJewelry: 0,
      otherAssets: 0,
      burialCosts: 2000,
      debtsCollateral: 0,
      debtsUnsecured: 8000,
      wasiyyahAmount: 10000,
    },
    heirs: {
      ...defaultHeirs,
      deceasedName: 'Tariq Al-Mansoor',
      wivesCount: 1,
      sonsCount: 1,
      daughtersCount: 2,
      heirNames: {
        wives: ['Amina'],
        sons: ['Zayd'],
        daughters: ['Maryam', 'Sara'],
      },
    },
  },
  {
    id: 'al-gharrawan',
    name: {
      en: 'Al-Gharrawan: Husband, Mother, & Father',
      ar: 'المسألة العمرية (الغراوان): زوج وأم وأب',
      ur: 'مسئلہ عمریہ (الغراوان): شوہر، ماں اور باپ',
    },
    description: {
      en: 'Classical case ruled by Umar (RA): Husband takes 1/2, Mother takes 1/3 of remainder (1/6), and Father takes remainder (1/3, double Mother).',
      ar: 'قضاء عمر رضي الله عنه: للزوج النصف، وللأم ثلث الباقي (السدس)، وللأب الباقي تعصيباً (الثلث).',
      ur: 'حضرت عمر کا تاریخی فیصلہ: شوہر کو 1/2، ماں کو باقی کا تہائی (1/6) اور باپ کو باقی ماندہ (1/3)۔',
    },
    gender: 'female',
    estate: {
      cash: 120000,
      realEstate: 0,
      goldJewelry: 0,
      otherAssets: 0,
      burialCosts: 0,
      debtsCollateral: 0,
      debtsUnsecured: 0,
      wasiyyahAmount: 0,
    },
    heirs: {
      ...defaultHeirs,
      husband: true,
      mother: true,
      father: true,
    },
  },
  {
    id: 'al-awl',
    name: {
      en: 'Al-\'Awl Case: Husband & 2 Full Sisters',
      ar: 'مسألة عائلة: زوج وأختان شقيقتان (العول إلى ٧)',
      ur: 'مسئلہ عول: شوہر اور دو سگی بہنیں (عول سے مجموعہ ۷)',
    },
    description: {
      en: 'Husband (1/2 = 3/6) and 2 Sisters (2/3 = 4/6) sum to 7/6. Base expands to 7; shares adjust to 3/7 and 4/7.',
      ar: 'تزاحم الفروض (النصف والثلثان = ٧/٦)، فتعول المسألة من ٦ إلى ٧ ويأخذ الزوج ٣/٧ والأختان ٤/٧.',
      ur: 'مقررہ حصے ترکے سے زیادہ (7/6) ہو گئے، اصل مسئلہ 6 سے بڑھ کر 7 ہوا اور شوہر کو 3/7 اور بہنوں کو 4/7 ملا۔',
    },
    gender: 'female',
    estate: {
      cash: 70000,
      realEstate: 0,
      goldJewelry: 0,
      otherAssets: 0,
      burialCosts: 0,
      debtsCollateral: 0,
      debtsUnsecured: 0,
      wasiyyahAmount: 0,
    },
    heirs: {
      ...defaultHeirs,
      husband: true,
      fullSistersCount: 2,
    },
  },
  {
    id: 'al-radd',
    name: {
      en: 'Al-Radd Case: Mother & 1 Daughter',
      ar: 'مسألة ردية: أم وبنت واحدة (الرد إلى ٤)',
      ur: 'مسئلہ رد: ماں اور ایک اکیلی بیٹی (رد سے مجموعہ ۴)',
    },
    description: {
      en: 'Mother (1/6) and Daughter (1/2 = 3/6). Total = 4/6. No Asabah exists, so remainder returns proportionally (Mother 1/4, Daughter 3/4).',
      ar: 'للأم السدس وللبنت النصف فرداً ومجموعهما ٤/٦ ولا عاصب، فيرد الباقي عليهما بنسبة سهامهما (للأم الربع وللبنت ثلاثة أرباع).',
      ur: 'ماں کا 1/6 اور بیٹی کا 1/2 (مجموعہ 4/6)۔ عصبہ نہ ہونے کی وجہ سے باقی ترکہ رد ہو کر ماں کو 1/4 اور بیٹی کو 3/4 ملے گا۔',
    },
    gender: 'male',
    estate: {
      cash: 80000,
      realEstate: 0,
      goldJewelry: 0,
      otherAssets: 0,
      burialCosts: 0,
      debtsCollateral: 0,
      debtsUnsecured: 0,
      wasiyyahAmount: 0,
    },
    heirs: {
      ...defaultHeirs,
      mother: true,
      daughtersCount: 1,
    },
  },
  {
    id: 'hadith-daughter-granddaughter-sister',
    name: {
      en: 'Hadith Case: Daughter, Granddaughter, & Full Sister',
      ar: 'قضاء النبي ﷺ: بنت وبنت ابن وأخت شقيقة',
      ur: 'حدیث مبارکہ کا فیصلہ: ایک بیٹی، ایک پوتی اور سگی بہن',
    },
    description: {
      en: 'Daughter gets 1/2, Granddaughter gets 1/6 (completing 2/3), and Full Sister takes residue as Asabah ma\'a ghayriha (Bukhari 6736).',
      ar: 'للبنت النصف، ولبنت الابن السدس تكملة الثلثين، وما بقي فللأخت تعصيباً مع الغير (صحيح البخاري ٦٧٣٦).',
      ur: 'بیٹی کو 1/2، پوتی کو 1/6 (دو تہائی مکمل کرنے کے لیے) اور سگی بہن کو باقی ماندہ بطور عصبہ مع الغیر (بخاری 6736)۔',
    },
    gender: 'male',
    estate: {
      cash: 60000,
      realEstate: 0,
      goldJewelry: 0,
      otherAssets: 0,
      burialCosts: 0,
      debtsCollateral: 0,
      debtsUnsecured: 0,
      wasiyyahAmount: 0,
    },
    heirs: {
      ...defaultHeirs,
      daughtersCount: 1,
      granddaughtersCount: 1,
      fullSistersCount: 1,
    },
  },
];
