import {
  DeceasedGender,
  EstateInput,
  HeirsInput,
  MawarithResult,
  CalculatedShare,
  HeirCategory,
} from './types';
import { Fraction } from './fraction';
import { calculateEstateSummary } from './estate';
import { evaluateHajb } from './hajb';

interface IntermediateShare {
  heirId: string;
  relationshipKey: string;
  count: number;
  category: HeirCategory;
  share: Fraction; // Total fraction for this group
  daleelIds: string[];
  explanation: {
    en: string;
    ar: string;
    ur: string;
  };
}

export function calculateInheritance(
  gender: DeceasedGender,
  estateInput: EstateInput,
  heirsInput: HeirsInput
): MawarithResult {
  // 1. Calculate Estate Obligations (Debts, Burial, Wasiyyah max 1/3)
  const { summary: estateSummary, warnings } = calculateEstateSummary(estateInput);

  // 2. Evaluate Hajb (Blocking / Exclusion Rules)
  const { blockedHeirs, activeHeirs } = evaluateHajb(heirsInput);

  const netEstate = estateSummary.netInheritableEstate;
  const intermediateShares: IntermediateShare[] = [];

  // Convenience heir presence checks from active heirs
  const hasSons = activeHeirs.sonsCount > 0;
  const hasDaughters = activeHeirs.daughtersCount > 0;
  const hasGrandsons = activeHeirs.grandsonsCount > 0;
  const hasGranddaughters = activeHeirs.granddaughtersCount > 0;
  const hasMaleDescendant = hasSons || hasGrandsons;
  const hasFemaleDescendant = hasDaughters || hasGranddaughters;
  const hasAnyDescendant = hasMaleDescendant || hasFemaleDescendant;

  // Sibling counts for mother's rule (mother drops to 1/6 if 2+ siblings exist, even if blocked!)
  const totalSiblingsCount =
    heirsInput.fullBrothersCount +
    heirsInput.fullSistersCount +
    heirsInput.paternalBrothersCount +
    heirsInput.paternalSistersCount +
    heirsInput.maternalBrothersCount +
    heirsInput.maternalSistersCount;

  let isUmariyyatan = false;

  // Check for Al-Gharrawan / Umariyyatan special case:
  // Spouse + Mother + Father and NO children and NO plural siblings (<2)
  const isSpousePresent = (gender === 'male' && activeHeirs.wivesCount > 0) || (gender === 'female' && activeHeirs.husband);
  if (
    isSpousePresent &&
    activeHeirs.mother &&
    activeHeirs.father &&
    !hasAnyDescendant &&
    totalSiblingsCount < 2
  ) {
    isUmariyyatan = true;
  }

  // -------------------------------------------------------------
  // A. SPOUSES (الزوج / الزوجات)
  // -------------------------------------------------------------
  if (gender === 'female' && activeHeirs.husband) {
    if (hasAnyDescendant) {
      intermediateShares.push({
        heirId: 'husband',
        relationshipKey: 'husband',
        count: 1,
        category: 'fard',
        share: new Fraction(1, 4),
        daleelIds: ['quran-4-12-husband-quarter'],
        explanation: {
          en: 'Husband receives 1/4 because the deceased has children/descendants.',
          ar: 'الزوج له الربع لوجود الفرع الوارث للزوجة.',
          ur: 'میت کی اولاد کی موجودگی کی وجہ سے شوہر کو چوتھائی (1/4) حصہ ملتا ہے۔',
        },
      });
    } else {
      intermediateShares.push({
        heirId: 'husband',
        relationshipKey: 'husband',
        count: 1,
        category: 'fard',
        share: new Fraction(1, 2),
        daleelIds: ['quran-4-12-husband-half'],
        explanation: {
          en: 'Husband receives 1/2 because the deceased has no children/descendants.',
          ar: 'الزوج له النصف لعدم وجود الفرع الوارث للزوجة.',
          ur: 'میت کی اولاد نہ ہونے کی وجہ سے شوہر کو نصف (1/2) حصہ ملتا ہے۔',
        },
      });
    }
  } else if (gender === 'male' && activeHeirs.wivesCount > 0) {
    const wivesCount = activeHeirs.wivesCount;
    if (hasAnyDescendant) {
      intermediateShares.push({
        heirId: 'wives',
        relationshipKey: 'wives',
        count: wivesCount,
        category: 'fard',
        share: new Fraction(1, 8),
        daleelIds: ['quran-4-12-wife-eighth'],
        explanation: {
          en: `Wife (or wives) share 1/8 equally because the deceased has children/descendants.`,
          ar: `الزوجة (أو الزوجات بالسوية) لهن الثمن لوجود الفرع الوارث للزوج.`,
          ur: `میت کی اولاد کی موجودگی کی وجہ سے بیوی (یا بیویوں) کو آٹھواں (1/8) حصہ برابر تقسیم ہوگا۔`,
        },
      });
    } else {
      intermediateShares.push({
        heirId: 'wives',
        relationshipKey: 'wives',
        count: wivesCount,
        category: 'fard',
        share: new Fraction(1, 4),
        daleelIds: ['quran-4-12-wife-fourth'],
        explanation: {
          en: `Wife (or wives) share 1/4 equally because the deceased has no children/descendants.`,
          ar: `الزوجة (أو الزوجات بالسوية) لهن الربع لعدم وجود الفرع الوارث للزوج.`,
          ur: `میت کی اولاد نہ ہونے کی وجہ سے بیوی (یا بیویوں) کو چوتھائی (1/4) حصہ برابر تقسیم ہوگا۔`,
        },
      });
    }
  }

  // -------------------------------------------------------------
  // B. MOTHER (الأم)
  // -------------------------------------------------------------
  if (activeHeirs.mother) {
    if (isUmariyyatan) {
      // In Umariyyatan: Mother gets 1/3 of the REMAINDER after the spouse's share
      const spouseShare = intermediateShares.find(s => s.heirId === 'husband' || s.heirId === 'wives')?.share || new Fraction(0);
      const remainderAfterSpouse = new Fraction(1).subtract(spouseShare);
      const motherShare = remainderAfterSpouse.multiply(new Fraction(1, 3));

      intermediateShares.push({
        heirId: 'mother',
        relationshipKey: 'mother',
        count: 1,
        category: 'fard',
        share: motherShare,
        daleelIds: ['umariyyatan-gharrawan-umar', 'scholar-ibn-baz-fatawa'],
        explanation: {
          en: 'Mother receives 1/3 of the remainder after the spouse share (Special Case: Al-Gharrawan / Umariyyatan) so that the father receives twice her share.',
          ar: 'الأم لها ثلث الباقي بعد نصيب أحد الزوجين في المسألة العمرية (الغراوان) ليتحقق فضل الأب عليها بمثل حظ الأنثيين.',
          ur: 'مسئلہ عمریہ (الغراوان) کے تحت ماں کو شریک حیات کے حصے کے بعد باقی ماندہ کا تہائی (1/3) ملتا ہے، تاکہ باپ کا حصہ ماں سے دوگنا رہے۔',
        },
      });
    } else if (hasAnyDescendant || totalSiblingsCount >= 2) {
      intermediateShares.push({
        heirId: 'mother',
        relationshipKey: 'mother',
        count: 1,
        category: 'fard',
        share: new Fraction(1, 6),
        daleelIds: ['quran-4-11-mother-sixth'],
        explanation: {
          en: 'Mother receives 1/6 because the deceased has descendants or two or more siblings.',
          ar: 'الأم لها السدس لوجود الفرع الوارث أو جمع من الإخوة (اثنان فأكثر).',
          ur: 'میت کی اولاد یا دو یا زیادہ بھائی بہنوں کی موجودگی کی وجہ سے ماں کو چھٹا (1/6) حصہ ملتا ہے۔',
        },
      });
    } else {
      intermediateShares.push({
        heirId: 'mother',
        relationshipKey: 'mother',
        count: 1,
        category: 'fard',
        share: new Fraction(1, 3),
        daleelIds: ['quran-4-11-mother-third'],
        explanation: {
          en: 'Mother receives 1/3 of the entire estate because there are no descendants and fewer than two siblings.',
          ar: 'الأم لها الثلث كاملاً لعدم وجود الفرع الوارث وعدم وجود جمع من الإخوة.',
          ur: 'میت کی اولاد نہ ہونے اور دو سے کم بھائی بہن ہونے کی وجہ سے ماں کو تہائی (1/3) حصہ ملتا ہے۔',
        },
      });
    }
  }

  // -------------------------------------------------------------
  // C. GRANDMOTHERS (الجدات)
  // -------------------------------------------------------------
  const grandmothersCount = (activeHeirs.maternalGrandmother ? 1 : 0) + (activeHeirs.paternalGrandmother ? 1 : 0);
  if (grandmothersCount > 0) {
    intermediateShares.push({
      heirId: 'grandmothers',
      relationshipKey: grandmothersCount === 2 ? 'bothGrandmothers' : activeHeirs.maternalGrandmother ? 'maternalGrandmother' : 'paternalGrandmother',
      count: grandmothersCount,
      category: 'fard',
      share: new Fraction(1, 6),
      daleelIds: ['hadith-grandmother-sixth-abu-dawud'],
      explanation: {
        en: grandmothersCount === 2
          ? 'Maternal and paternal grandmothers share 1/6 equally.'
          : 'Grandmother receives 1/6 as established by the Sunnah of the Prophet ﷺ and judgment of Abu Bakr (RA).',
        ar: grandmothersCount === 2
          ? 'الجدتان (أم الأم وأم الأب) تشتركان في السدس بالسوية.'
          : 'الجدة لها السدس بقضاء أبي بكر الصديق والصحابة بسنة النبي ﷺ.',
        ur: grandmothersCount === 2
          ? 'نانی اور دادی دونوں چھٹے (1/6) حصے میں برابر کی شریک ہوں گی۔'
          : 'دادی/نانی کو سنت نبوی اور حضرت ابوبکر صدیق کے فیصلے کے مطابق چھٹا (1/6) حصہ ملتا ہے۔',
      },
    });
  }

  // -------------------------------------------------------------
  // D. FATHER (الأب) & PATERNAL GRANDFATHER (الجد)
  // -------------------------------------------------------------
  // Father:
  // - 1/6 Fard if male descendant exists (son/grandson)
  // - 1/6 Fard + Asabah if only female descendant exists
  // - Asabah (all remainder) if no descendants
  if (activeHeirs.father) {
    if (isUmariyyatan) {
      // Handled as Asabah in later stage taking remainder
    } else if (hasMaleDescendant) {
      intermediateShares.push({
        heirId: 'father',
        relationshipKey: 'father',
        count: 1,
        category: 'fard',
        share: new Fraction(1, 6),
        daleelIds: ['quran-4-11-father-sixth'],
        explanation: {
          en: 'Father receives 1/6 as a fixed share due to the presence of male descendant (son/grandson).',
          ar: 'الأب له السدس فرضاً فقط لوجود الفرع الوارث الذكر (الابن أو ابن الابن).',
          ur: 'مذکر اولاد (بیٹا/پوتا) کی موجودگی کی وجہ سے باپ کو فقط چھٹا (1/6) حصہ بطور فرض ملتا ہے۔',
        },
      });
    } else if (hasFemaleDescendant) {
      intermediateShares.push({
        heirId: 'father',
        relationshipKey: 'father',
        count: 1,
        category: 'fard_and_asabah',
        share: new Fraction(1, 6), // 1/6 fard; residue added later
        daleelIds: ['quran-4-11-father-sixth', 'hadith-bukhari-6732'],
        explanation: {
          en: 'Father receives 1/6 as a fixed share plus residue (Ta\'seeb) because there are only female descendants.',
          ar: 'الأب له السدس فرضاً مع الباقي تعصيباً لوجود فرع وارث مؤنث فقط.',
          ur: 'صرف مؤنث اولاد (بیٹی/پوتی) ہونے کی وجہ سے باپ کو چھٹا (1/6) حصہ بطور فرض اور باقی ماندہ بطور عصبہ ملتا ہے۔',
        },
      });
    }
  } else if (activeHeirs.paternalGrandfather) {
    // Grandfather takes father's place in absence of father
    if (hasMaleDescendant) {
      intermediateShares.push({
        heirId: 'paternalGrandfather',
        relationshipKey: 'paternalGrandfather',
        count: 1,
        category: 'fard',
        share: new Fraction(1, 6),
        daleelIds: ['quran-4-11-father-sixth', 'scholar-ibn-baz-fatawa'],
        explanation: {
          en: 'Paternal grandfather takes the place of the father and receives 1/6 due to the presence of male descendant.',
          ar: 'الجد الصحيح يأخذ حكم الأب عند عدمه، فله السدس فرضاً لوجود الفرع الوارث الذكر.',
          ur: 'دادا باپ کی عدم موجودگی میں باپ کے قائم مقام ہے، مذکر اولاد کی موجودگی میں اسے چھٹا (1/6) حصہ ملتا ہے۔',
        },
      });
    } else if (hasFemaleDescendant) {
      intermediateShares.push({
        heirId: 'paternalGrandfather',
        relationshipKey: 'paternalGrandfather',
        count: 1,
        category: 'fard_and_asabah',
        share: new Fraction(1, 6),
        daleelIds: ['quran-4-11-father-sixth', 'hadith-bukhari-6732'],
        explanation: {
          en: 'Paternal grandfather receives 1/6 fixed share plus residue (Ta\'seeb) because there are only female descendants.',
          ar: 'الجد الصحيح له السدس فرضاً مع الباقي تعصيباً لوجود فرع وارث مؤنث فقط.',
          ur: 'دادا کو صرف مؤنث اولاد ہونے کی وجہ سے چھٹا (1/6) حصہ بطور فرض اور باقی ماندہ بطور عصبہ ملتا ہے۔',
        },
      });
    }
  }

  // -------------------------------------------------------------
  // E. DAUGHTERS & GRANDDAUGHTERS (البنات وبنات الابن)
  // -------------------------------------------------------------
  if (!hasSons && activeHeirs.daughtersCount > 0) {
    if (activeHeirs.daughtersCount === 1) {
      intermediateShares.push({
        heirId: 'daughters',
        relationshipKey: 'daughters',
        count: 1,
        category: 'fard',
        share: new Fraction(1, 2),
        daleelIds: ['quran-4-11-single-daughter-half'],
        explanation: {
          en: 'Single daughter receives 1/2 in the absence of sons.',
          ar: 'البنت الواحدة المنفردة لها النصف لعدم وجود المعصب (الابن الصلبي).',
          ur: 'بیٹا نہ ہونے کی صورت میں اکیلی بیٹی کو نصف (1/2) حصہ ملتا ہے۔',
        },
      });

      // If 1 daughter and granddaughters present: granddaughters take 1/6 complement to 2/3
      if (activeHeirs.granddaughtersCount > 0 && activeHeirs.grandsonsCount === 0) {
        intermediateShares.push({
          heirId: 'granddaughters',
          relationshipKey: 'granddaughters',
          count: activeHeirs.granddaughtersCount,
          category: 'fard',
          share: new Fraction(1, 6),
          daleelIds: ['hadith-ibn-masud-bukhari-6736'],
          explanation: {
            en: 'Granddaughters share 1/6 to complete the 2/3 maximum share for female descendants, as ruled by the Prophet ﷺ (Sahih al-Bukhari 6736).',
            ar: 'بنات الابن يشتركن في السدس تكملة للثلثين بقضاء النبي ﷺ في حديث ابن مسعود.',
            ur: 'پوتیاں بیٹیوں کا دو تہائی (2/3) حصہ مکمل کرنے کے لیے چھٹا (1/6) حصہ پائیں گی، جیسا کہ صحیح بخاری کی حدیث میں ہے۔',
          },
        });
      }
    } else {
      // 2 or more daughters: share 2/3 equally
      intermediateShares.push({
        heirId: 'daughters',
        relationshipKey: 'daughters',
        count: activeHeirs.daughtersCount,
        category: 'fard',
        share: new Fraction(2, 3),
        daleelIds: ['quran-4-11-two-daughters-two-thirds'],
        explanation: {
          en: `${activeHeirs.daughtersCount} daughters share 2/3 equally in the absence of sons.`,
          ar: `البنات (${activeHeirs.daughtersCount}) يشتركن في الثلثين بالسوية لعدم وجود المعصب.`,
          ur: `دو یا زیادہ بیٹیاں بیٹا نہ ہونے کی صورت میں دو تہائی (2/3) حصہ آپس میں برابر تقسیم کریں گی۔`,
        },
      });
    }
  } else if (!hasSons && activeHeirs.daughtersCount === 0 && activeHeirs.granddaughtersCount > 0 && activeHeirs.grandsonsCount === 0) {
    // Granddaughters stand in place of daughters
    if (activeHeirs.granddaughtersCount === 1) {
      intermediateShares.push({
        heirId: 'granddaughters',
        relationshipKey: 'granddaughters',
        count: 1,
        category: 'fard',
        share: new Fraction(1, 2),
        daleelIds: ['quran-4-11-single-daughter-half'],
        explanation: {
          en: 'Single granddaughter takes the place of a daughter and receives 1/2.',
          ar: 'بنت الابن الواحدة تنزل منزلة البنت ولها النصف لعدم وجود ولد أعلى منها.',
          ur: 'اکیلی پوتی بیٹی کی عدم موجودگی میں بیٹی کے قائم مقام ہو کر نصف (1/2) پائے گی۔',
        },
      });
    } else {
      intermediateShares.push({
        heirId: 'granddaughters',
        relationshipKey: 'granddaughters',
        count: activeHeirs.granddaughtersCount,
        category: 'fard',
        share: new Fraction(2, 3),
        daleelIds: ['quran-4-11-two-daughters-two-thirds'],
        explanation: {
          en: 'Granddaughters take the place of daughters and share 2/3 equally.',
          ar: 'بنات الابن ينزلن منزلة البنات ولهن الثلثان بالسوية.',
          ur: 'پوتیاں بیٹیوں کی عدم موجودگی میں دو تہائی (2/3) حصہ برابر تقسیم کریں گی۔',
        },
      });
    }
  }

  // -------------------------------------------------------------
  // F. MATERNAL SIBLINGS (الإخوة لأم)
  // -------------------------------------------------------------
  const maternalSiblingsTotal = activeHeirs.maternalBrothersCount + activeHeirs.maternalSistersCount;
  if (maternalSiblingsTotal > 0) {
    if (maternalSiblingsTotal === 1) {
      intermediateShares.push({
        heirId: 'maternalSiblings',
        relationshipKey: activeHeirs.maternalBrothersCount === 1 ? 'maternalBrother' : 'maternalSister',
        count: 1,
        category: 'fard',
        share: new Fraction(1, 6),
        daleelIds: ['quran-4-12-kalalah'],
        explanation: {
          en: 'Single maternal sibling receives 1/6 under the Kalalah rule of Surah An-Nisa 4:12.',
          ar: 'الواحد من الإخوة لأم له السدس فرضاً (كلالة).',
          ur: 'اکیلا اخیافی بھائی یا بہن کلالہ کے حکم کے تحت چھٹا (1/6) حصہ پاتے ہیں۔',
        },
      });
    } else {
      intermediateShares.push({
        heirId: 'maternalSiblings',
        relationshipKey: 'maternalSiblings',
        count: maternalSiblingsTotal,
        category: 'fard',
        share: new Fraction(1, 3),
        daleelIds: ['quran-4-12-kalalah'],
        explanation: {
          en: 'Maternal siblings share 1/3 equally between males and females under Surah An-Nisa 4:12 ("they are partners in the third").',
          ar: 'الإخوة لأم يشتركون في الثلث بالسوية بين الذكر والأنثى بنص القرآن الكريم: {فَهُمْ شُرَكَاءُ فِي الثُّلُثِ}.',
          ur: 'اخیافی بھائی اور بہنیں مل کر تہائی (1/3) حصہ مذکر اور مؤنث برابر تقسیم کرتے ہیں۔',
        },
      });
    }
  }

  // -------------------------------------------------------------
  // G. FULL SISTERS & PATERNAL SISTERS (Fard cases)
  // (Only when NOT Asabah bi-ghayriha with brothers, and NOT Asabah ma'a ghayriha with daughters)
  // -------------------------------------------------------------
  const isFullSisterAsabahWithDaughters =
    activeHeirs.fullSistersCount > 0 &&
    hasFemaleDescendant &&
    !hasMaleDescendant &&
    !activeHeirs.father &&
    activeHeirs.fullBrothersCount === 0;

  if (
    !hasMaleDescendant &&
    !hasFemaleDescendant &&
    !activeHeirs.father &&
    !activeHeirs.paternalGrandfather &&
    activeHeirs.fullBrothersCount === 0 &&
    activeHeirs.fullSistersCount > 0
  ) {
    if (activeHeirs.fullSistersCount === 1) {
      intermediateShares.push({
        heirId: 'fullSisters',
        relationshipKey: 'fullSisters',
        count: 1,
        category: 'fard',
        share: new Fraction(1, 2),
        daleelIds: ['quran-4-176-single-sister-half'],
        explanation: {
          en: 'Single full sister receives 1/2 in the absence of children, father, and full brothers (Kalalah).',
          ar: 'الأخت الشقيقة الواحدة لها النصف لعدم وجود الأصل المذكر والفرع الوارث والمعصب.',
          ur: 'اکیلی سگی بہن میت کی اولاد، باپ اور سگے بھائی نہ ہونے کی صورت میں نصف (1/2) پائے گی۔',
        },
      });

      // Check for paternal sister complement to 2/3
      if (activeHeirs.paternalBrothersCount === 0 && activeHeirs.paternalSistersCount > 0) {
        intermediateShares.push({
          heirId: 'paternalSisters',
          relationshipKey: 'paternalSisters',
          count: activeHeirs.paternalSistersCount,
          category: 'fard',
          share: new Fraction(1, 6),
          daleelIds: ['scholar-ibn-uthaymeen-tashil'],
          explanation: {
            en: 'Paternal sisters share 1/6 to complete the 2/3 share for sisters.',
            ar: 'الأخوات لأب يشتركن في السدس تكملة للثلثين.',
            ur: 'علاتی بہنیں دو تہائی (2/3) پورا کرنے کے لیے چھٹا (1/6) حصہ آپس میں تقسیم کریں گی۔',
          },
        });
      }
    } else {
      intermediateShares.push({
        heirId: 'fullSisters',
        relationshipKey: 'fullSisters',
        count: activeHeirs.fullSistersCount,
        category: 'fard',
        share: new Fraction(2, 3),
        daleelIds: ['quran-4-176-two-sisters-two-thirds'],
        explanation: {
          en: 'Full sisters share 2/3 equally under Surah An-Nisa 4:176.',
          ar: 'الأخوات الشقائق يشتركن في الثلثين بالسوية لعدم وجود المعصب.',
          ur: 'سگی بہنیں مل کر دو تہائی (2/3) حصہ برابر تقسیم کریں گی۔',
        },
      });
    }
  } else if (
    !hasMaleDescendant &&
    !hasFemaleDescendant &&
    !activeHeirs.father &&
    !activeHeirs.paternalGrandfather &&
    activeHeirs.fullBrothersCount === 0 &&
    activeHeirs.fullSistersCount === 0 &&
    activeHeirs.paternalBrothersCount === 0 &&
    activeHeirs.paternalSistersCount > 0
  ) {
    // Paternal sisters stand in place of full sisters
    if (activeHeirs.paternalSistersCount === 1) {
      intermediateShares.push({
        heirId: 'paternalSisters',
        relationshipKey: 'paternalSisters',
        count: 1,
        category: 'fard',
        share: new Fraction(1, 2),
        daleelIds: ['quran-4-176-single-sister-half'],
        explanation: {
          en: 'Single paternal sister receives 1/2 in absence of full siblings, children, and father.',
          ar: 'الأخت لأب الواحدة لها النصف لعدم وجود الأشقاء والمعصب.',
          ur: 'اکیلی علاتی بہن سگے بہن بھائیوں کی عدم موجودگی میں نصف (1/2) پائے گی۔',
        },
      });
    } else {
      intermediateShares.push({
        heirId: 'paternalSisters',
        relationshipKey: 'paternalSisters',
        count: activeHeirs.paternalSistersCount,
        category: 'fard',
        share: new Fraction(2, 3),
        daleelIds: ['quran-4-176-two-sisters-two-thirds'],
        explanation: {
          en: 'Paternal sisters share 2/3 equally in absence of full siblings.',
          ar: 'الأخوات لأب يشتركن في الثلثين بالسوية.',
          ur: 'علاتی بہنیں سگے بہن بھائیوں کی عدم موجودگی میں دو تہائی (2/3) حصہ برابر تقسیم کریں گی۔',
        },
      });
    }
  }

  // -------------------------------------------------------------
  // H. ASABAH (RESIDUARY) HEIRS
  // Identify the eligible Asabah to receive the remainder
  // -------------------------------------------------------------
  let asabahTarget: {
    type: 'sons_and_daughters' | 'grandsons_and_granddaughters' | 'father' | 'grandfather' | 'full_siblings' | 'full_sisters_with_daughters' | 'paternal_siblings' | 'paternal_sisters_with_daughters' | 'agnate_male';
    id: string;
    relationshipKey: string;
    maleCount: number;
    femaleCount: number;
    daleelIds: string[];
    explanation: { en: string; ar: string; ur: string };
  } | null = null;

  if (hasSons) {
    // Sons make daughters Asabah bi-ghayriha (2:1 ratio)
    asabahTarget = {
      type: 'sons_and_daughters',
      id: 'sons_daughters',
      relationshipKey: activeHeirs.daughtersCount > 0 ? 'sonsAndDaughters' : 'sons',
      maleCount: activeHeirs.sonsCount,
      femaleCount: activeHeirs.daughtersCount,
      daleelIds: ['quran-4-11-male-two-females', 'hadith-bukhari-6732'],
      explanation: {
        en: activeHeirs.daughtersCount > 0
          ? 'Sons and daughters inherit the remainder as residuaries (Asabah bi-ghayriha) in a 2:1 ratio.'
          : 'Sons inherit the entire remainder as the primary agnates (Asabah bi-nafsihi).',
        ar: activeHeirs.daughtersCount > 0
          ? 'الأبناء والبنات يرثون الباقي تعصيباً بالغير للذكر مثل حظ الأنثيين.'
          : 'الأبناء يرثون الباقي تعصيباً بالنفس (أقوى جهات العصوبة).',
        ur: activeHeirs.daughtersCount > 0
          ? 'بیٹے اور بیٹیاں باقی ترکہ عصبہ بالغیر کے طور پر مرد کو عورت سے دوگنا (2:1) کے تناسب سے پائیں گے۔'
          : 'بیٹے بنیادی عصبہ بالنفس کے طور پر تمام باقی ترکہ حاصل کریں گے۔',
      },
    };
  } else if (hasGrandsons) {
    asabahTarget = {
      type: 'grandsons_and_granddaughters',
      id: 'grandsons_granddaughters',
      relationshipKey: activeHeirs.granddaughtersCount > 0 ? 'grandsonsAndGranddaughters' : 'grandsons',
      maleCount: activeHeirs.grandsonsCount,
      femaleCount: activeHeirs.granddaughtersCount,
      daleelIds: ['quran-4-11-male-two-females', 'hadith-bukhari-6732'],
      explanation: {
        en: 'Grandsons (and granddaughters) inherit the residue in a 2:1 ratio in the absence of direct sons.',
        ar: 'أبناء الابن (وبنات الابن) يرثون الباقي تعصيباً للذكر مثل حظ الأنثيين.',
        ur: 'پوتے (اور پوتیاں) سگے بیٹے نہ ہونے کی صورت میں باقی ماندہ ترکہ 2:1 کے تناسب سے پائیں گے۔',
      },
    };
  } else if (activeHeirs.father && (!hasAnyDescendant || !hasMaleDescendant)) {
    // Father takes residue (in Umariyyatan, or when only female descendants exist, or no descendants exist)
    asabahTarget = {
      type: 'father',
      id: 'father',
      relationshipKey: 'father',
      maleCount: 1,
      femaleCount: 0,
      daleelIds: isUmariyyatan ? ['umariyyatan-gharrawan-umar'] : ['quran-4-11', 'hadith-bukhari-6732'],
      explanation: {
        en: isUmariyyatan
          ? 'Father inherits the remainder as Asabah in the Umariyyatan case, receiving twice the mother\'s portion.'
          : 'Father inherits the residue as Asabah bi-nafsihi.',
        ar: isUmariyyatan
          ? 'الأب يرث الباقي تعصيباً في المسألة العمرية ويكون نصيبه ضعف نصيب الأم.'
          : 'الأب يرث الباقي تعصيباً بالنفس.',
        ur: isUmariyyatan
          ? 'باپ مسئلہ عمریہ میں باقی ماندہ ترکہ بطور عصبہ لے گا جو ماں کے حصے سے دوگنا ہوگا۔'
          : 'باپ باقی ماندہ ترکہ بطور عصبہ بالنفس حاصل کرے گا۔',
      },
    };
  } else if (activeHeirs.paternalGrandfather && (!hasAnyDescendant || !hasMaleDescendant)) {
    asabahTarget = {
      type: 'grandfather',
      id: 'paternalGrandfather',
      relationshipKey: 'paternalGrandfather',
      maleCount: 1,
      femaleCount: 0,
      daleelIds: ['hadith-bukhari-6732', 'scholar-ibn-baz-fatawa'],
      explanation: {
        en: 'Paternal grandfather inherits the residue as Asabah in the absence of the father.',
        ar: 'الجد الصحيح يرث الباقي تعصيباً لعدم وجود الأب.',
        ur: 'دادا باپ کی عدم موجودگی میں باقی ماندہ ترکہ بطور عصبہ پائے گا۔',
      },
    };
  } else if (activeHeirs.fullBrothersCount > 0) {
    asabahTarget = {
      type: 'full_siblings',
      id: 'full_siblings',
      relationshipKey: activeHeirs.fullSistersCount > 0 ? 'fullBrothersAndSisters' : 'fullBrothers',
      maleCount: activeHeirs.fullBrothersCount,
      femaleCount: activeHeirs.fullSistersCount,
      daleelIds: ['quran-4-176-male-two-females', 'hadith-bukhari-6732'],
      explanation: {
        en: activeHeirs.fullSistersCount > 0
          ? 'Full brothers and sisters inherit the remainder as residuaries in a 2:1 ratio (Surah An-Nisa 4:176).'
          : 'Full brothers inherit the remainder as Asabah bi-nafsihi.',
        ar: activeHeirs.fullSistersCount > 0
          ? 'الإخوة والأخوات الأشقاء يرثون الباقي تعصيباً بالغير للذكر مثل حظ الأنثيين بنص سورة النساء 176.'
          : 'الإخوة الأشقاء يرثون الباقي تعصيباً بالنفس.',
        ur: activeHeirs.fullSistersCount > 0
          ? 'سگے بھائی اور بہنیں باقی ترکہ 2:1 کے تناسب سے عصبہ بالغیر کے طور پر تقسیم کریں گے۔'
          : 'سگے بھائی عصبہ بالنفس کے طور پر باقی ماندہ ترکہ لیں گے۔',
      },
    };
  } else if (isFullSisterAsabahWithDaughters) {
    // Full sisters become Asabah ma'a ghayriha with daughters ("اجعلوا الأخوات مع البنات عصبة")
    asabahTarget = {
      type: 'full_sisters_with_daughters',
      id: 'fullSisters',
      relationshipKey: 'fullSisters',
      maleCount: 0,
      femaleCount: activeHeirs.fullSistersCount,
      daleelIds: ['hadith-bukhari-6742-sisters-with-daughters'],
      explanation: {
        en: 'Full sisters inherit the remainder as residuaries alongside daughters (Asabah ma\'a ghayriha) based on the Hadith of the Prophet ﷺ in Sahih al-Bukhari 6742.',
        ar: 'الأخوات الشقائق يرثن الباقي تعصيباً مع الغير (مع البنات) لحديث النبي ﷺ: "اجعلوا الأخوات مع البنات عصبة" (صحيح البخاري 6742).',
        ur: 'سگی بہنیں بیٹیوں کے ساتھ مل کر عصبہ مع الغیر بن کر باقی ترکہ لیں گی، جیسا کہ صحیح بخاری 6742 میں ہے۔',
      },
    };
  } else if (activeHeirs.paternalBrothersCount > 0) {
    asabahTarget = {
      type: 'paternal_siblings',
      id: 'paternal_siblings',
      relationshipKey: activeHeirs.paternalSistersCount > 0 ? 'paternalBrothersAndSisters' : 'paternalBrothers',
      maleCount: activeHeirs.paternalBrothersCount,
      femaleCount: activeHeirs.paternalSistersCount,
      daleelIds: ['quran-4-176-male-two-females', 'hadith-bukhari-6732'],
      explanation: {
        en: 'Paternal brothers (and sisters) inherit the remainder as residuaries in a 2:1 ratio.',
        ar: 'الإخوة لأب (مع الأخوات لأب) يرثون الباقي تعصيباً للذكر مثل حظ الأنثيين.',
        ur: 'علاتی بھائی (اور بہنیں) باقی ماندہ ترکہ 2:1 کے تناسب سے پائیں گے۔',
      },
    };
  } else if (
    activeHeirs.paternalSistersCount > 0 &&
    hasFemaleDescendant &&
    !hasMaleDescendant &&
    !activeHeirs.father &&
    activeHeirs.fullBrothersCount === 0 &&
    activeHeirs.fullSistersCount === 0
  ) {
    asabahTarget = {
      type: 'paternal_sisters_with_daughters',
      id: 'paternalSisters',
      relationshipKey: 'paternalSisters',
      maleCount: 0,
      femaleCount: activeHeirs.paternalSistersCount,
      daleelIds: ['hadith-bukhari-6742-sisters-with-daughters'],
      explanation: {
        en: 'Paternal sisters inherit the remainder as residuaries with daughters (Asabah ma\'a ghayriha).',
        ar: 'الأخوات لأب يرثن الباقي تعصيباً مع الغير لوجودهن مع البنات.',
        ur: 'علاتی بہنیں بیٹیوں کے ساتھ مل کر عصبہ مع الغیر کے طور پر باقی ترکہ لیں گی۔',
      },
    };
  } else if (activeHeirs.nephewsFullCount > 0) {
    asabahTarget = {
      type: 'agnate_male',
      id: 'nephewsFull',
      relationshipKey: 'nephewsFull',
      maleCount: activeHeirs.nephewsFullCount,
      femaleCount: 0,
      daleelIds: ['hadith-bukhari-6732'],
      explanation: {
        en: 'Full nephews inherit the residue as closest surviving male agnates (Asabah bi-nafsihi).',
        ar: 'أبناء الأخ الشقيق يرثون الباقي تعصيباً بالنفس.',
        ur: 'سگے بھتیجے عصبہ بالنفس کے طور پر باقی ترکہ پائیں گے۔',
      },
    };
  } else if (activeHeirs.nephewsPaternalCount > 0) {
    asabahTarget = {
      type: 'agnate_male',
      id: 'nephewsPaternal',
      relationshipKey: 'nephewsPaternal',
      maleCount: activeHeirs.nephewsPaternalCount,
      femaleCount: 0,
      daleelIds: ['hadith-bukhari-6732'],
      explanation: {
        en: 'Paternal nephews inherit the residue as Asabah bi-nafsihi.',
        ar: 'أبناء الأخ لأب يرثون الباقي تعصيباً بالنفس.',
        ur: 'علاتی بھتیجے عصبہ بالنفس کے طور پر باقی ترکہ لیں گے۔',
      },
    };
  } else if (activeHeirs.paternalUnclesFullCount > 0) {
    asabahTarget = {
      type: 'agnate_male',
      id: 'paternalUnclesFull',
      relationshipKey: 'paternalUnclesFull',
      maleCount: activeHeirs.paternalUnclesFullCount,
      femaleCount: 0,
      daleelIds: ['hadith-bukhari-6732'],
      explanation: {
        en: 'Full paternal uncles inherit the residue as Asabah bi-nafsihi.',
        ar: 'الأعمام الأشقاء يرثون الباقي تعصيباً بالنفس.',
        ur: 'سگے چچا عصبہ بالنفس کے طور پر باقی ترکہ پائیں گے۔',
      },
    };
  } else if (activeHeirs.paternalUnclesPaternalCount > 0) {
    asabahTarget = {
      type: 'agnate_male',
      id: 'paternalUnclesPaternal',
      relationshipKey: 'paternalUnclesPaternal',
      maleCount: activeHeirs.paternalUnclesPaternalCount,
      femaleCount: 0,
      daleelIds: ['hadith-bukhari-6732'],
      explanation: {
        en: 'Paternal uncles inherit the residue as Asabah bi-nafsihi.',
        ar: 'الأعمام لأب يرثون الباقي تعصيباً بالنفس.',
        ur: 'علاتی چچا عصبہ بالنفس کے طور پر باقی ترکہ پائیں گے۔',
      },
    };
  } else if (activeHeirs.cousinsFullCount > 0) {
    asabahTarget = {
      type: 'agnate_male',
      id: 'cousinsFull',
      relationshipKey: 'cousinsFull',
      maleCount: activeHeirs.cousinsFullCount,
      femaleCount: 0,
      daleelIds: ['hadith-bukhari-6732'],
      explanation: {
        en: 'Full cousins inherit the residue as Asabah bi-nafsihi.',
        ar: 'أبناء العم الشقيق يرثون الباقي تعصيباً بالنفس.',
        ur: 'سگے چچازاد بھائی عصبہ بالنفس کے طور پر باقی ترکہ پائیں گے۔',
      },
    };
  } else if (activeHeirs.cousinsPaternalCount > 0) {
    asabahTarget = {
      type: 'agnate_male',
      id: 'cousinsPaternal',
      relationshipKey: 'cousinsPaternal',
      maleCount: activeHeirs.cousinsPaternalCount,
      femaleCount: 0,
      daleelIds: ['hadith-bukhari-6732'],
      explanation: {
        en: 'Paternal cousins inherit the residue as Asabah bi-nafsihi.',
        ar: 'أبناء العم لأب يرثون الباقي تعصيباً بالنفس.',
        ur: 'علاتی چچازاد بھائی عصبہ بالنفس کے طور پر باقی ترکہ پائیں گے۔',
      },
    };
  }

  // -------------------------------------------------------------
  // I. BASE DENOMINATOR & FRACTION SUMMATION
  // -------------------------------------------------------------
  let sumFardShares = new Fraction(0);
  for (const s of intermediateShares) {
    sumFardShares = sumFardShares.add(s.share);
  }

  let isAwl = false;
  let isRadd = false;
  let baseDenominator = 1;

  if (intermediateShares.length > 0) {
    baseDenominator = intermediateShares.reduce(
      (acc, curr) => Fraction.lcm(acc, curr.share.denominator),
      intermediateShares[0].share.denominator
    );
  }

  let adjustedDenominator = baseDenominator;

  // -------------------------------------------------------------
  // J. HANDLE AWL / RADD / RESIDUE ALLOCATION
  // -------------------------------------------------------------
  const finalCalculatedShares: CalculatedShare[] = [];

  if (sumFardShares.toDecimal() > 1) {
    // CASE 1: AL-'AWL (العول) - Deficit / Share Expansion
    // Sum of shares exceeds 1. Base increases to the sum of numerators.
    isAwl = true;
    const commonDenom = baseDenominator;
    let totalNumerators = 0;
    for (const s of intermediateShares) {
      totalNumerators += s.share.numerator * (commonDenom / s.share.denominator);
    }
    adjustedDenominator = totalNumerators;

    warnings.push(
      `Al-'Awl (العول) applied: Total prescribed shares (${sumFardShares.toString()}) exceeded the estate. Base was proportionally expanded from ${baseDenominator} to ${adjustedDenominator} with justice to all heirs, according to the consensus of the Sahabah initiated under Caliph Umar (RA).`
    );

    for (const s of intermediateShares) {
      const normalizedNumerator = s.share.numerator * (commonDenom / s.share.denominator);
      const awlFraction = new Fraction(normalizedNumerator, totalNumerators);
      const totalAmount = netEstate * awlFraction.toDecimal();
      const perIndividualAmount = totalAmount / s.count;
      const individualFraction = awlFraction.divide(s.count);

      finalCalculatedShares.push({
        heirId: s.heirId,
        relationshipKey: s.relationshipKey,
        count: s.count,
        category: 'awl_adjusted',
        totalFraction: awlFraction.toRational(),
        individualFraction: individualFraction.toRational(),
        percentage: awlFraction.toDecimal() * 100,
        totalMonetaryValue: totalAmount,
        perIndividualMonetaryValue: perIndividualAmount,
        daleelIds: [...s.daleelIds, 'awl-rule-umar'],
        explanation: s.explanation,
      });
    }
  } else if (sumFardShares.toDecimal() === 1) {
    // CASE 2: EXACTLY EXHAUSTED (المسألة العادلة)
    for (const s of intermediateShares) {
      const totalAmount = netEstate * s.share.toDecimal();
      const perIndividualAmount = totalAmount / s.count;
      const individualFraction = s.share.divide(s.count);

      finalCalculatedShares.push({
        heirId: s.heirId,
        relationshipKey: s.relationshipKey,
        count: s.count,
        category: s.category,
        totalFraction: s.share.toRational(),
        individualFraction: individualFraction.toRational(),
        percentage: s.share.toDecimal() * 100,
        totalMonetaryValue: totalAmount,
        perIndividualMonetaryValue: perIndividualAmount,
        daleelIds: s.daleelIds,
        explanation: s.explanation,
      });
    }
  } else {
    // CASE 3: SURPLUS REMAINS (sumFardShares < 1)
    const remainderFraction = new Fraction(1).subtract(sumFardShares);

    if (asabahTarget) {
      // Residue goes to Asabah
      // First push existing Fard shares
      for (const s of intermediateShares) {
        // Special case: Father having fard (1/6) + Asabah
        if (s.heirId === 'father' && asabahTarget.type === 'father') {
          continue; // Will merge fard + asabah below
        }
        if (s.heirId === 'paternalGrandfather' && asabahTarget.type === 'grandfather') {
          continue; // Will merge below
        }
        const totalAmount = netEstate * s.share.toDecimal();
        const perIndividualAmount = totalAmount / s.count;
        const individualFraction = s.share.divide(s.count);

        finalCalculatedShares.push({
          heirId: s.heirId,
          relationshipKey: s.relationshipKey,
          count: s.count,
          category: s.category,
          totalFraction: s.share.toRational(),
          individualFraction: individualFraction.toRational(),
          percentage: s.share.toDecimal() * 100,
          totalMonetaryValue: totalAmount,
          perIndividualMonetaryValue: perIndividualAmount,
          daleelIds: s.daleelIds,
          explanation: s.explanation,
        });
      }

      // Now process Asabah
      if (asabahTarget.type === 'father') {
        const fatherFard = intermediateShares.find(s => s.heirId === 'father')?.share || new Fraction(0);
        const fatherTotalFraction = fatherFard.add(remainderFraction);
        const totalAmount = netEstate * fatherTotalFraction.toDecimal();

        finalCalculatedShares.push({
          heirId: 'father',
          relationshipKey: 'father',
          count: 1,
          category: fatherFard.toDecimal() > 0 ? 'fard_and_asabah' : 'asabah',
          totalFraction: fatherTotalFraction.toRational(),
          individualFraction: fatherTotalFraction.toRational(),
          percentage: fatherTotalFraction.toDecimal() * 100,
          totalMonetaryValue: totalAmount,
          perIndividualMonetaryValue: totalAmount,
          daleelIds: asabahTarget.daleelIds,
          explanation: asabahTarget.explanation,
        });
      } else if (asabahTarget.type === 'grandfather') {
        const gfFard = intermediateShares.find(s => s.heirId === 'paternalGrandfather')?.share || new Fraction(0);
        const gfTotalFraction = gfFard.add(remainderFraction);
        const totalAmount = netEstate * gfTotalFraction.toDecimal();

        finalCalculatedShares.push({
          heirId: 'paternalGrandfather',
          relationshipKey: 'paternalGrandfather',
          count: 1,
          category: gfFard.toDecimal() > 0 ? 'fard_and_asabah' : 'asabah',
          totalFraction: gfTotalFraction.toRational(),
          individualFraction: gfTotalFraction.toRational(),
          percentage: gfTotalFraction.toDecimal() * 100,
          totalMonetaryValue: totalAmount,
          perIndividualMonetaryValue: totalAmount,
          daleelIds: asabahTarget.daleelIds,
          explanation: asabahTarget.explanation,
        });
      } else if (asabahTarget.maleCount > 0 && asabahTarget.femaleCount > 0) {
        // Mixed male and female: 2:1 ratio
        // Total portions = (males * 2) + females
        const totalPortions = asabahTarget.maleCount * 2 + asabahTarget.femaleCount;
        const portionFraction = remainderFraction.divide(totalPortions);

        // Male group share
        const malePortions = asabahTarget.maleCount * 2;
        const maleTotalFraction = portionFraction.multiply(malePortions);
        const maleIndividualFraction = portionFraction.multiply(2);
        const maleTotalAmount = netEstate * maleTotalFraction.toDecimal();

        // Female group share
        const femalePortions = asabahTarget.femaleCount;
        const femaleTotalFraction = portionFraction.multiply(femalePortions);
        const femaleIndividualFraction = portionFraction;
        const femaleTotalAmount = netEstate * femaleTotalFraction.toDecimal();

        const maleHeirId = asabahTarget.type === 'sons_and_daughters' ? 'sons' : asabahTarget.type === 'grandsons_and_granddaughters' ? 'grandsons' : asabahTarget.type === 'full_siblings' ? 'fullBrothers' : 'paternalBrothers';
        const femaleHeirId = asabahTarget.type === 'sons_and_daughters' ? 'daughters' : asabahTarget.type === 'grandsons_and_granddaughters' ? 'granddaughters' : asabahTarget.type === 'full_siblings' ? 'fullSisters' : 'paternalSisters';

        finalCalculatedShares.push({
          heirId: maleHeirId,
          relationshipKey: maleHeirId,
          count: asabahTarget.maleCount,
          category: 'asabah',
          totalFraction: maleTotalFraction.toRational(),
          individualFraction: maleIndividualFraction.toRational(),
          percentage: maleTotalFraction.toDecimal() * 100,
          totalMonetaryValue: maleTotalAmount,
          perIndividualMonetaryValue: maleTotalAmount / asabahTarget.maleCount,
          daleelIds: asabahTarget.daleelIds,
          explanation: {
            en: maleHeirId === 'sons'
              ? 'Sons inherit the remainder with daughters as residuaries (Asabah bi-ghayriha) in a 2:1 ratio.'
              : maleHeirId === 'grandsons'
              ? 'Grandsons inherit the remainder with granddaughters as residuaries in a 2:1 ratio.'
              : maleHeirId === 'fullBrothers'
              ? 'Full brothers inherit the remainder with full sisters as residuaries in a 2:1 ratio.'
              : 'Paternal brothers inherit the remainder with paternal sisters as residuaries in a 2:1 ratio.',
            ar: maleHeirId === 'sons'
              ? 'الأبناء يرثون الباقي تعصيباً بالغير مع البنات للذكر مثل حظ الأنثيين.'
              : maleHeirId === 'grandsons'
              ? 'أبناء الابن يرثون الباقي تعصيباً بالغير مع بنات الابن للذكر مثل حظ الأنثيين.'
              : maleHeirId === 'fullBrothers'
              ? 'الإخوة الأشقاء يرثون الباقي تعصيباً بالغير مع الأخوات الشقائق للذكر مثل حظ الأنثيين.'
              : 'الإخوة لأب يرثون الباقي تعصيباً بالغير مع الأخوات لأب للذكر مثل حظ الأنثيين.',
            ur: maleHeirId === 'sons'
              ? 'بیٹے بیٹیوں کے ساتھ مل کر عصبہ بالغیر کے طور پر مرد کا عورت سے دوگنا (2:1) حصہ پائیں گے۔'
              : maleHeirId === 'grandsons'
              ? 'پوتے پوتیوں کے ساتھ مل کر عصبہ بالغیر کے طور پر مرد کا عورت سے دوگنا (2:1) حصہ پائیں گے۔'
              : maleHeirId === 'fullBrothers'
              ? 'سگے بھائی سگی بہنوں کے ساتھ مل کر عصبہ بالغیر کے طور پر 2:1 حصہ پائیں گے۔'
              : 'علاتی بھائی علاتی بہنوں کے ساتھ مل کر عصبہ بالغیر کے طور پر 2:1 حصہ پائیں گے۔',
          },
        });

        finalCalculatedShares.push({
          heirId: femaleHeirId,
          relationshipKey: femaleHeirId,
          count: asabahTarget.femaleCount,
          category: 'asabah',
          totalFraction: femaleTotalFraction.toRational(),
          individualFraction: femaleIndividualFraction.toRational(),
          percentage: femaleTotalFraction.toDecimal() * 100,
          totalMonetaryValue: femaleTotalAmount,
          perIndividualMonetaryValue: femaleTotalAmount / asabahTarget.femaleCount,
          daleelIds: asabahTarget.daleelIds,
          explanation: {
            en: femaleHeirId === 'daughters'
              ? 'Daughters inherit the remainder as residuaries with sons (Asabah bi-ghayriha) in a 2:1 ratio.'
              : femaleHeirId === 'granddaughters'
              ? 'Granddaughters inherit the remainder with grandsons as residuaries in a 2:1 ratio.'
              : femaleHeirId === 'fullSisters'
              ? 'Full sisters inherit the remainder with full brothers as residuaries in a 2:1 ratio.'
              : 'Paternal sisters inherit the remainder with paternal brothers as residuaries in a 2:1 ratio.',
            ar: femaleHeirId === 'daughters'
              ? 'البنات يرثن الباقي تعصيباً بالغير مع الأبناء للذكر مثل حظ الأنثيين.'
              : femaleHeirId === 'granddaughters'
              ? 'بنات الابن يرثن الباقي تعصيباً بالغير مع أبناء الابن للذكر مثل حظ الأنثيين.'
              : femaleHeirId === 'fullSisters'
              ? 'الأخوات الشقائق يرثن الباقي تعصيباً بالغير مع الإخوة الأشقاء للذكر مثل حظ الأنثيين.'
              : 'الأخوات لأب يرثن الباقي تعصيباً بالغير مع الإخوة لأب للذكر مثل حظ الأنثيين.',
            ur: femaleHeirId === 'daughters'
              ? 'بیٹیاں بیٹوں کے ساتھ مل کر عصبہ بالغیر کے طور پر مرد کا عورت سے دوگنا (2:1) حصہ پائیں گی۔'
              : femaleHeirId === 'granddaughters'
              ? 'پوتیاں پوتوں کے ساتھ مل کر عصبہ بالغیر کے طور پر 2:1 حصہ پائیں گی۔'
              : femaleHeirId === 'fullSisters'
              ? 'سگی بہنیں سگے بھائیوں کے ساتھ مل کر عصبہ بالغیر کے طور پر 2:1 حصہ پائیں گی۔'
              : 'علاتی بہنیں علاتی بھائیوں کے ساتھ مل کر عصبہ بالغیر کے طور پر 2:1 حصہ پائیں گے۔',
          },
        });
      } else {
        // Pure male or pure female asabah
        const count = asabahTarget.maleCount > 0 ? asabahTarget.maleCount : asabahTarget.femaleCount;
        const totalAmount = netEstate * remainderFraction.toDecimal();
        const individualFraction = remainderFraction.divide(count);

        finalCalculatedShares.push({
          heirId: asabahTarget.id,
          relationshipKey: asabahTarget.relationshipKey,
          count: count,
          category: 'asabah',
          totalFraction: remainderFraction.toRational(),
          individualFraction: individualFraction.toRational(),
          percentage: remainderFraction.toDecimal() * 100,
          totalMonetaryValue: totalAmount,
          perIndividualMonetaryValue: totalAmount / count,
          daleelIds: asabahTarget.daleelIds,
          explanation: asabahTarget.explanation,
        });
      }
    } else {
      // NO ASABAH EXISTS -> AL-RADD (الرد - Surplus Redistribution)
      // According to rajih view of Jumhoor (Hanbali, Ibn Baz, Ibn Uthaymeen, Fawzan):
      // Surplus is returned to Ashab al-Furud in proportion to their shares, EXCEPT the spouse.
      isRadd = true;

      const nonSpouseShares = intermediateShares.filter(s => s.heirId !== 'husband' && s.heirId !== 'wives');
      const spouseShares = intermediateShares.filter(s => s.heirId === 'husband' || s.heirId === 'wives');

      if (nonSpouseShares.length === 0) {
        // Only spouse exists!
        // Under Jumhoor rajih view, spouse gets their fard, and the remainder goes to Beit al-Mal (Treasury of Muslims)
        // or under secondary fatwa returned. We document this clearly.
        for (const s of spouseShares) {
          const totalAmount = netEstate * s.share.toDecimal();
          finalCalculatedShares.push({
            heirId: s.heirId,
            relationshipKey: s.relationshipKey,
            count: s.count,
            category: s.category,
            totalFraction: s.share.toRational(),
            individualFraction: s.share.divide(s.count).toRational(),
            percentage: s.share.toDecimal() * 100,
            totalMonetaryValue: totalAmount,
            perIndividualMonetaryValue: totalAmount / s.count,
            daleelIds: s.daleelIds,
            explanation: s.explanation,
          });
        }
        warnings.push(
          'Notice: Only spouse survives with no other heirs or Asabah. The spouse takes their fixed Quranic share. Under the mainstream Jumhoor position (Ibn Baz, Ibn Uthaymeen), the spouse does not receive Radd (surplus returns to the public Muslim treasury / charitable causes).'
        );
      } else {
        // Non-spouse heirs receive the Radd
        // 1. Spouses keep their exact fard share
        let spouseTotalDecimal = 0;
        for (const s of spouseShares) {
          const totalAmount = netEstate * s.share.toDecimal();
          spouseTotalDecimal += s.share.toDecimal();
          finalCalculatedShares.push({
            heirId: s.heirId,
            relationshipKey: s.relationshipKey,
            count: s.count,
            category: s.category,
            totalFraction: s.share.toRational(),
            individualFraction: s.share.divide(s.count).toRational(),
            percentage: s.share.toDecimal() * 100,
            totalMonetaryValue: totalAmount,
            perIndividualMonetaryValue: totalAmount / s.count,
            daleelIds: s.daleelIds,
            explanation: s.explanation,
          });
        }

        const estateForRadd = netEstate * (1 - spouseTotalDecimal);
        const raddFractionPool = new Fraction(1).subtract(new Fraction(Math.round(spouseTotalDecimal * 100), 100));

        // Sum of non-spouse shares to re-normalize
        let sumNonSpouse = new Fraction(0);
        for (const s of nonSpouseShares) {
          sumNonSpouse = sumNonSpouse.add(s.share);
        }

        warnings.push(
          `Al-Radd (الرد) applied: Total shares were less than 1 with no residuary heirs (Asabah). The remaining surplus was redistributed among the prescribed heirs (excluding spouse) in proportion to their shares, according to the rajih view of scholars (Ibn Baz, Ibn Uthaymeen, al-Fawzan).`
        );

        for (const s of nonSpouseShares) {
          // New share = (s.share / sumNonSpouse) * (1 - spouseShare)
          const normalizedRatio = s.share.divide(sumNonSpouse.toDecimal());
          const raddShareFraction = normalizedRatio.multiply(raddFractionPool);
          const totalAmount = estateForRadd * (s.share.toDecimal() / sumNonSpouse.toDecimal());
          const perIndividualAmount = totalAmount / s.count;

          finalCalculatedShares.push({
            heirId: s.heirId,
            relationshipKey: s.relationshipKey,
            count: s.count,
            category: 'radd_adjusted',
            totalFraction: raddShareFraction.toRational(),
            individualFraction: raddShareFraction.divide(s.count).toRational(),
            percentage: (totalAmount / netEstate) * 100,
            totalMonetaryValue: totalAmount,
            perIndividualMonetaryValue: perIndividualAmount,
            daleelIds: [...s.daleelIds, 'radd-rule-scholars'],
            explanation: {
              en: `${s.explanation.en} (Increased via Al-Radd proportional return).`,
              ar: `${s.explanation.ar} (مع الزيادة بالرد لعدم وجود عاصب).`,
              ur: `${s.explanation.ur} (رد کے ذریعے حصے میں اضافہ کے ساتھ)۔`,
            },
          });
        }
      }
    }
  }

  // Calculate any undistributed remainder (e.g. spouse alone)
  const totalAllocatedAmount = finalCalculatedShares.reduce((acc, curr) => acc + curr.totalMonetaryValue, 0);
  const surplusRemainderAmount = Math.max(0, netEstate - totalAllocatedAmount);

  return {
    summary: estateSummary,
    heirs: finalCalculatedShares,
    blockedHeirs,
    baseDenominator,
    adjustedDenominator,
    isAwl,
    isRadd,
    isUmariyyatan,
    surplusRemainderAmount,
    warnings,
  };
}
