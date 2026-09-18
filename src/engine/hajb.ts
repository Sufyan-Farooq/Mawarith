import { HeirsInput, BlockedHeir } from './types';

export function evaluateHajb(input: HeirsInput): {
  blockedHeirs: BlockedHeir[];
  activeHeirs: HeirsInput;
} {
  const blockedHeirs: BlockedHeir[] = [];
  const active: HeirsInput = { ...input };

  const hasSons = input.sonsCount > 0;
  const hasGrandsons = input.grandsonsCount > 0;
  const hasMaleDescendant = hasSons || hasGrandsons;
  const hasAnyDescendant = hasMaleDescendant || input.daughtersCount > 0 || input.granddaughtersCount > 0;
  const hasFather = input.father;
  const hasMother = input.mother;
  const hasGrandfather = input.paternalGrandfather;

  // 1. Grandchildren
  if (hasSons && input.grandsonsCount > 0) {
    blockedHeirs.push({
      heirId: 'grandsons',
      relationshipKey: 'grandsons',
      count: input.grandsonsCount,
      blockedBy: ['sons'],
      reason: {
        en: 'Grandsons are completely excluded by the direct son who is closer in degree.',
        ar: 'حُجب أبناء الابن لوجود الابن الصلبي الأقرب درجة (القاعدة: الأقرب يحجب الأبعد).',
        ur: 'پوتے، سگے بیٹے کی موجودگی کی وجہ سے محروم (حجبِ حرمان) ہیں کیونکہ بیٹا زیادہ قریب ہے۔',
      },
      daleelIds: ['hajb-closest-relative'],
    });
    active.grandsonsCount = 0;
  }

  if (hasSons && input.granddaughtersCount > 0) {
    blockedHeirs.push({
      heirId: 'granddaughters',
      relationshipKey: 'granddaughters',
      count: input.granddaughtersCount,
      blockedBy: ['sons'],
      reason: {
        en: 'Granddaughters are completely excluded by the direct son.',
        ar: 'حُجبت بنات الابن لوجود الابن الصلبي الأعلى درجة.',
        ur: 'پوتیاں، سگے بیٹے کی موجودگی میں مکمل طور پر محجوب ہیں۔',
      },
      daleelIds: ['hajb-closest-relative'],
    });
    active.granddaughtersCount = 0;
  } else if (input.daughtersCount >= 2 && input.grandsonsCount === 0 && input.granddaughtersCount > 0) {
    // 2+ daughters exhaust 2/3 share; granddaughter blocked unless grandson makes her asabah
    blockedHeirs.push({
      heirId: 'granddaughters',
      relationshipKey: 'granddaughters',
      count: input.granddaughtersCount,
      blockedBy: ['daughters'],
      reason: {
        en: 'Granddaughters are excluded because 2 or more direct daughters have exhausted the Quranic maximum 2/3 share for female descendants, with no male counterpart (Qarib Mubarak) to make them residuary.',
        ar: 'سقوط بنات الابن لاستكمال البنات الصلبيات فرض الثلثين القرآني وعدم وجود عاصب مبارك يعصبهن.',
        ur: 'دو یا زیادہ بیٹیوں کی وجہ سے بیٹیوں کا زیادہ سے زیادہ دو تہائی (2/3) حصہ پورا ہو گیا، اور کوئی پوتا موجود نہیں جو انہیں عصبہ بنائے۔',
      },
      daleelIds: ['quran-4-11', 'hadith-ibn-masud-bukhari-6736'],
    });
    active.granddaughtersCount = 0;
  }

  // 2. Grandparents
  if (hasFather && input.paternalGrandfather) {
    blockedHeirs.push({
      heirId: 'paternalGrandfather',
      relationshipKey: 'paternalGrandfather',
      count: 1,
      blockedBy: ['father'],
      reason: {
        en: 'Paternal grandfather is excluded by the father, as he is the intermediate link to the deceased.',
        ar: 'حُجب الجد (أبو الأب) بالأب باتفاق الفقهاء (من أدلى بواسطة حُجب بتلك الواسطة).',
        ur: 'دادا، باپ کی موجودگی کی وجہ سے محجوب ہیں، کیونکہ وہ باپ کے واسطے سے میت سے جڑتے ہیں۔',
      },
      daleelIds: ['hajb-rule-wasita'],
    });
    active.paternalGrandfather = false;
  }

  if (hasMother && input.maternalGrandmother) {
    blockedHeirs.push({
      heirId: 'maternalGrandmother',
      relationshipKey: 'maternalGrandmother',
      count: 1,
      blockedBy: ['mother'],
      reason: {
        en: 'Maternal grandmother is excluded by the mother by scholarly consensus (Ijma).',
        ar: 'حُجبت الجدة لأم (أم الأم) بالأم إجماعاً.',
        ur: 'نانی، ماں کی موجودگی کی وجہ سے بالاتفاق محجوب ہیں۔',
      },
      daleelIds: ['hajb-rule-wasita'],
    });
    active.maternalGrandmother = false;
  }

  if ((hasMother || hasFather) && input.paternalGrandmother) {
    const blockers = [];
    if (hasMother) blockers.push('mother');
    if (hasFather) blockers.push('father');
    blockedHeirs.push({
      heirId: 'paternalGrandmother',
      relationshipKey: 'paternalGrandmother',
      count: 1,
      blockedBy: blockers,
      reason: {
        en: 'Paternal grandmother is excluded by the mother (consensus) and by the father (according to Jumhoor & Hanbalis).',
        ar: 'حُجبت الجدة لأب بالأم إجماعاً وبالأب عند جمهور الفقهاء والحنابلة.',
        ur: 'دادی، ماں اور باپ کی موجودگی کی وجہ سے محجوب ہیں۔',
      },
      daleelIds: ['hajb-rule-wasita', 'scholar-ibn-uthaymeen-tashil'],
    });
    active.paternalGrandmother = false;
  }

  // 3. Maternal Siblings (Akh li-umm / Ukht li-umm)
  // Blocked by ANY descendant (male or female) or male ascendant (father, grandfather)
  if ((hasAnyDescendant || hasFather || hasGrandfather) && (input.maternalBrothersCount > 0 || input.maternalSistersCount > 0)) {
    const blockers: string[] = [];
    if (hasAnyDescendant) blockers.push('descendants');
    if (hasFather) blockers.push('father');
    if (hasGrandfather && !hasFather) blockers.push('paternalGrandfather');

    if (input.maternalBrothersCount > 0) {
      blockedHeirs.push({
        heirId: 'maternalBrothers',
        relationshipKey: 'maternalBrothers',
        count: input.maternalBrothersCount,
        blockedBy: blockers,
        reason: {
          en: 'Maternal brothers are excluded by any descendant (male or female) or any male ascendant under the Kalalah rule of Surah An-Nisa 4:12.',
          ar: 'حُجب الإخوة لأم بوجود الفرع الوارث مطلقاً أو الأصل الوارث الذكر لشرط الكلالة.',
          ur: 'اخیافی بھائی (ماں کی طرف سے بھائی) میت کی اولاد یا باپ/دادا کی موجودگی میں کلالہ کی شرط کے تحت محجوب ہیں۔',
        },
        daleelIds: ['quran-4-12-kalalah'],
      });
      active.maternalBrothersCount = 0;
    }
    if (input.maternalSistersCount > 0) {
      blockedHeirs.push({
        heirId: 'maternalSisters',
        relationshipKey: 'maternalSisters',
        count: input.maternalSistersCount,
        blockedBy: blockers,
        reason: {
          en: 'Maternal sisters are excluded by any descendant (male or female) or any male ascendant under the Kalalah rule of Surah An-Nisa 4:12.',
          ar: 'حُجبت الأخوات لأم بوجود الفرع الوارث مطلقاً أو الأصل الوارث الذكر لشرط الكلالة.',
          ur: 'اخیافی بہنیں (ماں کی طرف سے بہنیں) میت کی اولاد یا باپ/دادا کی موجودگی میں کلالہ کی شرط کے تحت محجوب ہیں۔',
        },
        daleelIds: ['quran-4-12-kalalah'],
      });
      active.maternalSistersCount = 0;
    }
  }

  // 4. Full Siblings (Akh Shaqiq / Ukht Shaqiqah)
  // Blocked by: Son, Grandson, Father (and Paternal Grandfather under the rajih view of Abu Bakr, Ibn Abbas, Ibn Baz, Ibn Uthaymeen)
  const blocksFullSiblings = hasMaleDescendant || hasFather || hasGrandfather;
  if (blocksFullSiblings && (input.fullBrothersCount > 0 || input.fullSistersCount > 0)) {
    const blockers: string[] = [];
    if (hasMaleDescendant) blockers.push(hasSons ? 'sons' : 'grandsons');
    if (hasFather) blockers.push('father');
    if (hasGrandfather && !hasFather) blockers.push('paternalGrandfather');

    if (input.fullBrothersCount > 0) {
      blockedHeirs.push({
        heirId: 'fullBrothers',
        relationshipKey: 'fullBrothers',
        count: input.fullBrothersCount,
        blockedBy: blockers,
        reason: {
          en: 'Full brothers are excluded by male descendants (sons/grandsons) or male ascendants (father/grandfather).',
          ar: 'حُجب الإخوة الأشقاء بالفرع الوارث الذكر أو بالأب/الجد على القول الراجح المفتى به.',
          ur: 'سگے بھائی مذکر اولاد (بیٹے/پوتے) یا باپ/دادا کی موجودگی میں محجوب ہیں۔',
        },
        daleelIds: ['quran-4-176-kalalah', 'scholar-ibn-baz-fatawa'],
      });
      active.fullBrothersCount = 0;
    }
    if (input.fullSistersCount > 0) {
      blockedHeirs.push({
        heirId: 'fullSisters',
        relationshipKey: 'fullSisters',
        count: input.fullSistersCount,
        blockedBy: blockers,
        reason: {
          en: 'Full sisters are excluded by male descendants (sons/grandsons) or male ascendants (father/grandfather).',
          ar: 'حُجبت الأخوات الشقائق بالفرع الوارث الذكر أو بالأب/الجد.',
          ur: 'سگی بہنیں مذکر اولاد یا باپ/دادا کی موجودگی میں محجوب ہیں۔',
        },
        daleelIds: ['quran-4-176-kalalah', 'scholar-ibn-baz-fatawa'],
      });
      active.fullSistersCount = 0;
    }
  }

  // 5. Paternal Siblings (Akh li-ab / Ukht li-ab)
  // Blocked by: Anyone who blocks full siblings + Full Brother + Full Sister when she is Asabah with daughters
  const hasFullBrother = active.fullBrothersCount > 0;
  const isFullSisterAsabahWithDaughters = active.fullSistersCount > 0 && (input.daughtersCount > 0 || input.granddaughtersCount > 0) && !hasMaleDescendant && !hasFather;
  const blocksPaternalSiblings = blocksFullSiblings || hasFullBrother || isFullSisterAsabahWithDaughters;

  if (blocksPaternalSiblings && (input.paternalBrothersCount > 0 || input.paternalSistersCount > 0)) {
    const blockers: string[] = [];
    if (blocksFullSiblings) blockers.push(hasMaleDescendant ? 'male_descendants' : 'male_ascendants');
    if (hasFullBrother) blockers.push('fullBrothers');
    if (isFullSisterAsabahWithDaughters) blockers.push('fullSisters_asabah');

    if (input.paternalBrothersCount > 0) {
      blockedHeirs.push({
        heirId: 'paternalBrothers',
        relationshipKey: 'paternalBrothers',
        count: input.paternalBrothersCount,
        blockedBy: blockers,
        reason: {
          en: 'Paternal brothers are excluded by full brothers who have stronger two-sided kinship, or by male ascendants/descendants.',
          ar: 'حُجب الإخوة لأب بالأخ الشقيق الأقوى قرابة أو بالفرع/الأصل الذكر.',
          ur: 'علاتی بھائی (باپ کی طرف سے بھائی) سگے بھائی یا مذکر اصل/فرع کی موجودگی میں محجوب ہیں۔',
        },
        daleelIds: ['hadith-bukhari-6732', 'scholar-fawzan-tahqiqat'],
      });
      active.paternalBrothersCount = 0;
    }
    if (input.paternalSistersCount > 0) {
      blockedHeirs.push({
        heirId: 'paternalSisters',
        relationshipKey: 'paternalSisters',
        count: input.paternalSistersCount,
        blockedBy: blockers,
        reason: {
          en: 'Paternal sisters are excluded by full brothers or by full sisters who became residuary with daughters.',
          ar: 'حُجبت الأخوات لأب بالأخ الشقيق أو بالأخت الشقيقة التي صارت عصبة مع البنات.',
          ur: 'علاتی بہنیں سگے بھائیوں یا سگی بہنوں (جب وہ بیٹیوں کے ساتھ عصبہ بنیں) کی وجہ سے محجوب ہیں۔',
        },
        daleelIds: ['hadith-bukhari-6742', 'scholar-fawzan-tahqiqat'],
      });
      active.paternalSistersCount = 0;
    }
  } else if (active.fullSistersCount >= 2 && input.paternalBrothersCount === 0 && input.paternalSistersCount > 0) {
    // 2+ full sisters exhaust the 2/3 share, blocking paternal sisters unless backed by a paternal brother
    blockedHeirs.push({
      heirId: 'paternalSisters',
      relationshipKey: 'paternalSisters',
      count: input.paternalSistersCount,
      blockedBy: ['fullSisters'],
      reason: {
        en: 'Paternal sisters are excluded because 2 or more full sisters have exhausted the 2/3 maximum share for sisters, with no paternal brother to make them residuary.',
        ar: 'سقوط الأخوات لأب لاستكمال الشقائق الثلثين وعدم وجود أخ لأب يعصبهن.',
        ur: 'دو یا زیادہ سگی بہنوں نے بہنوں کا زیادہ سے زیادہ 2/3 حصہ پورا کر دیا، اور کوئی علاتی بھائی نہیں جو انہیں عصبہ بنائے۔',
      },
      daleelIds: ['quran-4-176', 'scholar-ibn-uthaymeen-tashil'],
    });
    active.paternalSistersCount = 0;
  }

  // 6. Agnatic Collaterals (Nephews, Uncles, Cousins)
  // Closer Asabah blocks farther Asabah:
  // Sons > Grandsons > Father > Grandfather > Full Brother > Paternal Brother > Nephew Full > Nephew Paternal > Uncle Full > Uncle Paternal > Cousin Full > Cousin Paternal
  // Also blocked if Full Sister became Asabah with Daughters!
  const hasCloserAgnate = hasMaleDescendant || hasFather || hasGrandfather || active.fullBrothersCount > 0 || active.paternalBrothersCount > 0 || isFullSisterAsabahWithDaughters;

  // Nephews Full
  if ((hasCloserAgnate) && input.nephewsFullCount > 0) {
    blockedHeirs.push({
      heirId: 'nephewsFull',
      relationshipKey: 'nephewsFull',
      count: input.nephewsFullCount,
      blockedBy: ['closer_agnate'],
      reason: {
        en: 'Full nephews are excluded by closer male agnates (brothers, fathers, or sons).',
        ar: 'حُجب أبناء الأخ الشقيق بوجود العاصب الأقرب (الأب، الابن، الأخ).',
        ur: 'سگے بھتیجے قریبی مذکر رشتہ داروں کی موجودگی میں محجوب ہیں۔',
      },
      daleelIds: ['hadith-bukhari-6732'],
    });
    active.nephewsFullCount = 0;
  }

  // Nephews Paternal
  const blocksNephewsPaternal = hasCloserAgnate || active.nephewsFullCount > 0;
  if (blocksNephewsPaternal && input.nephewsPaternalCount > 0) {
    blockedHeirs.push({
      heirId: 'nephewsPaternal',
      relationshipKey: 'nephewsPaternal',
      count: input.nephewsPaternalCount,
      blockedBy: ['closer_agnate'],
      reason: {
        en: 'Paternal nephews are excluded by full nephews or closer agnates.',
        ar: 'حُجب أبناء الأخ لأب بابن الأخ الشقيق أو بالعاصب الأقرب.',
        ur: 'علاتی بھتیجے سگے بھتیجوں یا قریبی رشتہ داروں کی موجودگی میں محجوب ہیں۔',
      },
      daleelIds: ['hadith-bukhari-6732'],
    });
    active.nephewsPaternalCount = 0;
  }

  // Paternal Uncles Full
  const blocksUnclesFull = blocksNephewsPaternal || active.nephewsPaternalCount > 0;
  if (blocksUnclesFull && input.paternalUnclesFullCount > 0) {
    blockedHeirs.push({
      heirId: 'paternalUnclesFull',
      relationshipKey: 'paternalUnclesFull',
      count: input.paternalUnclesFullCount,
      blockedBy: ['closer_agnate'],
      reason: {
        en: 'Full paternal uncles are excluded by all heirs of fraternity (brothers and nephews) or ascending/descending males.',
        ar: 'حُجب الأعمام الأشقاء بجهة الإخوة أو البنوة أو الأبوة.',
        ur: 'سگے چچا بھائیوں، بھتیجوں یا اولاد/باپ کی موجودگی میں محجوب ہیں۔',
      },
      daleelIds: ['hadith-bukhari-6732'],
    });
    active.paternalUnclesFullCount = 0;
  }

  // Paternal Uncles Paternal
  const blocksUnclesPaternal = blocksUnclesFull || active.paternalUnclesFullCount > 0;
  if (blocksUnclesPaternal && input.paternalUnclesPaternalCount > 0) {
    blockedHeirs.push({
      heirId: 'paternalUnclesPaternal',
      relationshipKey: 'paternalUnclesPaternal',
      count: input.paternalUnclesPaternalCount,
      blockedBy: ['closer_agnate'],
      reason: {
        en: 'Paternal uncles are excluded by full paternal uncles or closer agnates.',
        ar: 'حُجب الأعمام لأب بالعم الشقيق أو بالعاصب الأقرب.',
        ur: 'علاتی چچا سگے چچا یا قریبی عصبہ کی وجہ سے محجوب ہیں۔',
      },
      daleelIds: ['hadith-bukhari-6732'],
    });
    active.paternalUnclesPaternalCount = 0;
  }

  // Cousins Full
  const blocksCousinsFull = blocksUnclesPaternal || active.paternalUnclesPaternalCount > 0;
  if (blocksCousinsFull && input.cousinsFullCount > 0) {
    blockedHeirs.push({
      heirId: 'cousinsFull',
      relationshipKey: 'cousinsFull',
      count: input.cousinsFullCount,
      blockedBy: ['closer_agnate'],
      reason: {
        en: 'Full cousins are excluded by paternal uncles or closer agnates.',
        ar: 'حُجب أبناء العم الشقيق بالعم أو بالعاصب الأقرب.',
        ur: 'سگے چچازاد بھائی چچا یا قریبی عصبہ کی وجہ سے محجوب ہیں۔',
      },
      daleelIds: ['hadith-bukhari-6732'],
    });
    active.cousinsFullCount = 0;
  }

  // Cousins Paternal
  const blocksCousinsPaternal = blocksCousinsFull || active.cousinsFullCount > 0;
  if (blocksCousinsPaternal && input.cousinsPaternalCount > 0) {
    blockedHeirs.push({
      heirId: 'cousinsPaternal',
      relationshipKey: 'cousinsPaternal',
      count: input.cousinsPaternalCount,
      blockedBy: ['closer_agnate'],
      reason: {
        en: 'Paternal cousins are excluded by full cousins or closer agnates.',
        ar: 'حُجب أبناء العم لأب بابن العم الشقيق أو بالعاصب الأقرب.',
        ur: 'علاتی چچازاد بھائی سگے چچازاد بھائی یا قریبی عصبہ کی وجہ سے محجوب ہیں۔',
      },
      daleelIds: ['hadith-bukhari-6732'],
    });
    active.cousinsPaternalCount = 0;
  }

  return {
    blockedHeirs,
    activeHeirs: active,
  };
}
