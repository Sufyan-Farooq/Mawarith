export type SupportedLanguage = 'en' | 'ar' | 'ur';

export interface Translations {
  appName: string;
  appSubtitle: string;
  shariahCertified: string;
  scholarBasis: string;
  conversationalMode: string;
  visualMode: string;
  sampleScenarios: string;
  selectSample: string;
  deceasedDetails: string;
  gender: string;
  male: string;
  female: string;
  estateAndBelongings: string;
  estateSubtitle: string;
  cashSavings: string;
  realEstate: string;
  goldJewelry: string;
  otherAssets: string;
  funeralExpenses: string;
  debtsOwed: string;
  wasiyyahBequest: string;
  wasiyyahNotice: string;
  survivingRelatives: string;
  relativesSubtitle: string;
  spouses: string;
  wives: string;
  husband: string;
  parentsAndGrandparents: string;
  father: string;
  mother: string;
  paternalGrandfather: string;
  paternalGrandmother: string;
  maternalGrandmother: string;
  childrenAndGrandchildren: string;
  sons: string;
  daughters: string;
  grandsons: string;
  granddaughters: string;
  siblings: string;
  fullBrothers: string;
  fullSisters: string;
  paternalBrothers: string;
  paternalSisters: string;
  maternalBrothers: string;
  maternalSisters: string;
  collaterals: string;
  nephewsFull: string;
  nephewsPaternal: string;
  unclesFull: string;
  unclesPaternal: string;
  cousinsFull: string;
  cousinsPaternal: string;
  calculateInheritance: string;
  resultsTitle: string;
  grossEstate: string;
  debtsAndBurial: string;
  wasiyyahDeduction: string;
  netInheritable: string;
  heirsBreakdown: string;
  relationship: string;
  count: string;
  category: string;
  quranicShare: string;
  percentage: string;
  totalValue: string;
  perPersonValue: string;
  viewDaleel: string;
  blockedRelatives: string;
  blockedReason: string;
  blockedBy: string;
  noBlockedRelatives: string;
  awlBadge: string;
  raddBadge: string;
  umariyyatanBadge: string;
  printCertificate: string;
  downloadReport: string;
  chatPlaceholder: string;
  send: string;
  chatAdvisorTitle: string;
  chatAdvisorSubtitle: string;
  apiKeyNotice: string;
  setApiKey: string;
  enterGeminiApiKey: string;
  saveKey: string;
  keySaved: string;
  clearKey: string;
  noKeyUseRuleEngine: string;
  aiThinking: string;
  quickReplies: string;
  fard: string;
  asabah: string;
  fard_and_asabah: string;
  awl_adjusted: string;
  radd_adjusted: string;
  startFresh: string;
  startFreshDesc: string;
  viewingSample: string;
  customEstate: string;
  readyForEstateTitle: string;
  readyForEstateSubtitle: string;
  exploreDemo: string;
  startMyEstate: string;
  confirmResetTitle: string;
  confirmResetDesc: string;
  confirmResetConfirm: string;
  cancel: string;
  undo: string;
  resetSuccessToast: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    appName: 'Mawarith',
    appSubtitle: 'Shariah-Compliant Inheritance & Estate Platform (علم المواريث)',
    shariahCertified: 'Strictly according to Quran, Sahih Sunnah & Scholarly Consensus',
    scholarBasis: 'Fatawa & rulings of Shaykh Ibn Baz, Shaykh Ibn \'Uthaymeen, and Shaykh Salih al-Fawzan',
    conversationalMode: 'AI Chat Advisor',
    visualMode: 'Interactive Studio',
    sampleScenarios: 'Classical Scenarios',
    selectSample: 'Load an authentic case study...',
    deceasedDetails: '1. Deceased Information',
    gender: 'Gender of the Deceased',
    male: 'Male (Deceased Husband/Father)',
    female: 'Female (Deceased Wife/Mother)',
    estateAndBelongings: '2. Estate, Belongings & Liabilities',
    estateSubtitle: 'Prioritized in exact Shariah order: Funeral Expenses → Debts → Wasiyyah (max 1/3) → Inheritance',
    cashSavings: 'Cash & Bank Balances',
    realEstate: 'Real Estate & Properties',
    goldJewelry: 'Gold, Silver & Jewelry',
    otherAssets: 'Vehicles, Investments & Other Assets',
    funeralExpenses: 'Funeral & Burial Expenses (Tajhiz)',
    debtsOwed: 'Debts & Obligations (To Allah & People)',
    wasiyyahBequest: 'Bequest (Wasiyyah to non-heirs)',
    wasiyyahNotice: 'Automatically capped at 1/3 of net estate. Bequest to legal heirs is prohibited by Sunnah.',
    survivingRelatives: '3. Surviving Relatives & Legal Heirs',
    relativesSubtitle: 'Select only the relatives who were alive at the exact moment of the deceased\'s passing',
    spouses: 'Spouse',
    wives: 'Wives (Count: 1 to 4)',
    husband: 'Husband is alive',
    parentsAndGrandparents: 'Parents & Grandparents',
    father: 'Father is alive',
    mother: 'Mother is alive',
    paternalGrandfather: 'Paternal Grandfather (Father\'s Father)',
    paternalGrandmother: 'Paternal Grandmother (Father\'s Mother)',
    maternalGrandmother: 'Maternal Grandmother (Mother\'s Mother)',
    childrenAndGrandchildren: 'Children & Agnatic Grandchildren',
    sons: 'Sons',
    daughters: 'Daughters',
    grandsons: 'Grandsons (Son\'s sons)',
    granddaughters: 'Granddaughters (Son\'s daughters)',
    siblings: 'Brothers & Sisters',
    fullBrothers: 'Full Brothers (Same father & mother)',
    fullSisters: 'Full Sisters (Same father & mother)',
    paternalBrothers: 'Paternal Brothers (Same father only)',
    paternalSisters: 'Paternal Sisters (Same father only)',
    maternalBrothers: 'Maternal Brothers (Same mother only)',
    maternalSisters: 'Maternal Sisters (Same mother only)',
    collaterals: 'Agnatic Collateral Relatives (Asabah)',
    nephewsFull: 'Full Nephews (Son of full brother)',
    nephewsPaternal: 'Paternal Nephews (Son of paternal brother)',
    unclesFull: 'Full Paternal Uncles (Father\'s full brother)',
    unclesPaternal: 'Paternal Paternal Uncles (Father\'s half-brother)',
    cousinsFull: 'Full Male Cousins (Son of full paternal uncle)',
    cousinsPaternal: 'Paternal Male Cousins (Son of paternal uncle)',
    calculateInheritance: 'Calculate Shariah Distribution',
    resultsTitle: 'Inheritance Distribution & Proofs (Al-Fara\'id)',
    grossEstate: 'Gross Assets',
    debtsAndBurial: 'Funeral & Debts Paid',
    wasiyyahDeduction: 'Wasiyyah Distributed',
    netInheritable: 'Net Inheritable Estate',
    heirsBreakdown: 'Entitled Legal Heirs & Prescribed Shares',
    relationship: 'Heir Category',
    count: 'Count',
    category: 'Status',
    quranicShare: 'Share (Fraction)',
    percentage: 'Percentage',
    totalValue: 'Total Allocation',
    perPersonValue: 'Per Person',
    viewDaleel: 'View Proof (Daleel)',
    blockedRelatives: 'Excluded Relatives (Al-Mahjubun)',
    blockedReason: 'Reason for Exclusion',
    blockedBy: 'Blocked By',
    noBlockedRelatives: 'No relatives were excluded in this case.',
    awlBadge: 'Al-\'Awl Applied (Proportional Share Adjustment)',
    raddBadge: 'Al-Radd Applied (Surplus Redistribution)',
    umariyyatanBadge: 'Al-Gharrawan / Umariyyatan Special Case',
    printCertificate: 'Print Shariah Certificate',
    downloadReport: 'Download Estate Summary',
    chatPlaceholder: 'Ask a question about estate distribution, or type deceased details...',
    send: 'Send',
    chatAdvisorTitle: 'Mawarith AI Islamic Estate Advisor',
    chatAdvisorSubtitle: 'Empathetic, Shariah-guided conversational assessment grounded in authentic Fatawa',
    apiKeyNotice: 'Powered by Gemini AI. Enter your API key for personalized conversational reasoning, or use the built-in Shariah expert.',
    setApiKey: 'Gemini API Key',
    enterGeminiApiKey: 'Enter your Google Gemini API Key (e.g. AIzaSy...)',
    saveKey: 'Save Key',
    keySaved: 'API Key configured',
    clearKey: 'Clear Key',
    noKeyUseRuleEngine: 'Default expert mode active',
    aiThinking: 'Analyzing Shariah rulings and computing shares...',
    quickReplies: 'Suggested Responses',
    fard: 'Prescribed (Fard)',
    asabah: 'Residuary (Asabah)',
    fard_and_asabah: 'Fard & Asabah',
    awl_adjusted: 'Awl Proportional',
    radd_adjusted: 'Radd Surplus',
    startFresh: 'Start Fresh',
    startFreshDesc: 'Clear all values and calculate your family\'s estate from scratch',
    viewingSample: 'Viewing Demo Scenario:',
    customEstate: 'Custom Family Estate',
    readyForEstateTitle: 'Ready to Calculate Your Family\'s Estate',
    readyForEstateSubtitle: 'Enter estate assets & liabilities, then select surviving relatives on the left. Shariah shares, Hajb blocking rules, and official decrees will generate live in real-time.',
    exploreDemo: 'Explore Demo Scenario',
    startMyEstate: 'Start Fresh with My Estate',
    confirmResetTitle: 'Start fresh with a clean estate?',
    confirmResetDesc: 'This will clear all entered assets, debts, and selected relatives so you can start from scratch.',
    confirmResetConfirm: 'Yes, Start Fresh',
    cancel: 'Cancel',
    undo: 'Undo',
    resetSuccessToast: 'Estate reset to blank canvas.',
  },
  ar: {
    appName: 'مَوارِيث',
    appSubtitle: 'المنصة الإسلامية لقسمة المواريث والتركات وفق الشريعة الغراء',
    shariahCertified: 'مبني بدقة على نصوص القرآن وصحيح السنة وإجماع كبار العلماء',
    scholarBasis: 'وفق تحقيقات وفتاوى الشيخ ابن باز والشيخ ابن عثيمين والشيخ صالح الفوزان',
    conversationalMode: 'المستشار الذكي (محادثة)',
    visualMode: 'الموزع التفاعلي',
    sampleScenarios: 'مسائل فقهية مشهورة',
    selectSample: 'اختر مسألة فقهية نموذجية...',
    deceasedDetails: '١. بيانات المتوفى',
    gender: 'جنس المتوفى',
    male: 'رجل (مورث / زوج / أب)',
    female: 'امرأة (مورثة / زوجة / أم)',
    estateAndBelongings: '٢. التركة، الموجودات والديون',
    estateSubtitle: 'مرتبة بالحقوق الشرعية: مؤن التجهيز ← سداد الديون ← الوصية لغير وارث (الثلث فأقل) ← الإرث',
    cashSavings: 'السيولة النقدية والأرصدة البنكية',
    realEstate: 'العقارات والأراضي',
    goldJewelry: 'الذهب والفضة والمجوهرات',
    otherAssets: 'المركبات، الأسهم والموجودات التجارية',
    funeralExpenses: 'مؤن تجهيز الميت والدفن بالمعروف',
    debtsOwed: 'الديون المتعلقة بالذمة (لله والعباد، المهر المؤخر)',
    wasiyyahBequest: 'الوصية الشرعية (لغير وارث)',
    wasiyyahNotice: 'محددة شرعاً بثلث الصافي بعد الدفن والديون. لا تصح الوصية لوارث إلا بإجازة الورثة.',
    survivingRelatives: '٣. الورثة الأحياء المستحقون',
    relativesSubtitle: 'حدد فقط من كان حياً على قيد الحياة لحظة وفاة المورث',
    spouses: 'الزوجية',
    wives: 'الزوجات (العدد: ١ إلى ٤)',
    husband: 'الزوج على قيد الحياة',
    parentsAndGrandparents: 'الأصول (الآباء والأجداد)',
    father: 'الأب حي',
    mother: 'الأم حية',
    paternalGrandfather: 'الجد الصحيح (أبو الأب)',
    paternalGrandmother: 'الجدة لأب (أم الأب)',
    maternalGrandmother: 'الجدة لأم (أم الأم)',
    childrenAndGrandchildren: 'الفروع (الأولاد وأولاد الابن)',
    sons: 'الأبناء الذكور',
    daughters: 'البنات الصلبيات',
    grandsons: 'أبناء الابن وإن نزلوا',
    granddaughters: 'بنات الابن وإن نزلن',
    siblings: 'الحواشي (الإخوة والأخوات)',
    fullBrothers: 'الإخوة الأشقاء (من الأب والأم)',
    fullSisters: 'الأخوات الشقائق (من الأب والأم)',
    paternalBrothers: 'الإخوة لأب',
    paternalSisters: 'الأخوات لأب',
    maternalBrothers: 'الإخوة لأم',
    maternalSisters: 'الأخوات لأم',
    collaterals: 'بقية العصبات (الأعمام وبنوهم)',
    nephewsFull: 'أبناء الأخ الشقيق الذكور',
    nephewsPaternal: 'أبناء الأخ لأب الذكور',
    unclesFull: 'الأعمام الأشقاء للميت',
    unclesPaternal: 'الأعمام لأب للميت',
    cousinsFull: 'أبناء العم الشقيق الذكور',
    cousinsPaternal: 'أبناء العم لأب الذكور',
    calculateInheritance: 'حساب القسمة الشرعية وتفصيل الحصص',
    resultsTitle: 'جدول توزيع التركة والأدلة الشرعية (علم الفرائض)',
    grossEstate: 'إجمالي الموجودات',
    debtsAndBurial: 'التجهيز والديون المقضية',
    wasiyyahDeduction: 'الوصية النافذة',
    netInheritable: 'صافي التركة القابلة للإرث',
    heirsBreakdown: 'الورثة المستحقون والسهام المقدرة',
    relationship: 'صلة القرابة',
    count: 'العدد',
    category: 'نوع الإرث',
    quranicShare: 'الفرض الشرعي',
    percentage: 'النسبة المئوية',
    totalValue: 'إجمالي النصيب المالي',
    perPersonValue: 'نصيب الفرد الواحد',
    viewDaleel: 'عرض الدليل الشرعي',
    blockedRelatives: 'المحجوبون من الإرث (حجب الحرمان)',
    blockedReason: 'سبب الحجب الشرعي',
    blockedBy: 'حُجب بواسطة',
    noBlockedRelatives: 'لا يوجد أقارب محجوبون في هذه المسألة.',
    awlBadge: 'مسألة عائلة (العول: نقص نسبي في السهام لتزاحم الفروض)',
    raddBadge: 'مسألة ردية (الرد: زيادة الأنصبة لعدم وجود عاصب)',
    umariyyatanBadge: 'المسألة العمرية (الغراوان: ثلث الباقي للأم)',
    printCertificate: 'طباعة صك التوزيع الشرعي',
    downloadReport: 'تنزيل ملخص التركة',
    chatPlaceholder: 'اكتب سؤالك الشرعي أو اذكر تفاصيل المتوفى وأقاربه...',
    send: 'إرسال',
    chatAdvisorTitle: 'المستشار الذكي لقسمة التركات',
    chatAdvisorSubtitle: 'محادثة شرعية تفاعلية موثوقة تستند إلى كتب الفرائض المعتمدة',
    apiKeyNotice: 'مدعوم بنموذج Gemini الذكي. يمكنك إدخال مفتاحك الخاص أو استخدام المحرك الفقهي الداخلي المدمج.',
    setApiKey: 'مفتاح Gemini API',
    enterGeminiApiKey: 'أدخل مفتاح Google Gemini الخاص بك...',
    saveKey: 'حفظ المفتاح',
    keySaved: 'المفتاح محفوظ وجاهز',
    clearKey: 'مسح المفتاح',
    noKeyUseRuleEngine: 'المحرك الفقهي الداخلي نشط',
    aiThinking: 'جاري استحضار الأدلة الشرعية وحساب السهام...',
    quickReplies: 'إجابات سريعة مقترحة',
    fard: 'فرضاً',
    asabah: 'تعصيباً',
    fard_and_asabah: 'فرضاً وتعصيباً',
    awl_adjusted: 'بالعول',
    radd_adjusted: 'بالرد',
    startFresh: 'تصفير والبدء من جديد',
    startFreshDesc: 'مسح جميع المدخلات وبدء حساب تركة جديدة من الصفر',
    viewingSample: 'تشاهد حالياً مسألة نموذجية:',
    customEstate: 'حساب تركة عائلتك المخصصة',
    readyForEstateTitle: 'جاهز لحساب تركة عائلتك الشرعية',
    readyForEstateSubtitle: 'أدخل أموال التركة والديون، ثم حدد أصحاب الفروض والعصبات الأحياء على اليمين. وستظهر السهام الشرعية وقواعد الحجب والصك الشرعي فوراً وتلقائياً.',
    exploreDemo: 'استعراض مسألة تجريبية',
    startMyEstate: 'البدء بحساب تركة عائلتي',
    confirmResetTitle: 'تصفير البيانات والبدء من جديد؟',
    confirmResetDesc: 'سيؤدي هذا إلى مسح كافة الأصول والديون والورثة المحددين لتبدأ بحساب جديد من الصفر.',
    confirmResetConfirm: 'نعم، ابدأ من الصفر',
    cancel: 'إلغاء',
    undo: 'تراجع',
    resetSuccessToast: 'تم تصفير التركة، يمكنك البدء الآن.',
  },
  ur: {
    appName: 'مواریث',
    appSubtitle: 'اسلامی شریعت کے مطابق تقسیمِ ترکہ و وراثت کا مستند پلیٹ فارم (علم المواريث)',
    shariahCertified: 'قرآن کریم، سنتِ نبوی اور جمہور ائمہ و فقہاء کے اجماع کے عین مطابق',
    scholarBasis: 'شیخ ابن باز، شیخ ابن عثیمین اور شیخ صالح الفوزان کے مستند فتاویٰ کی روشنی میں',
    conversationalMode: 'ذہین مشیر (چیٹ موڈ)',
    visualMode: 'انٹرایکٹو خاندانی چارٹ',
    sampleScenarios: 'مشہور فقہی مسائل',
    selectSample: 'کوئی مستند فقہی مثال منتخب کریں...',
    deceasedDetails: '۱. میت کی تفصیلات',
    gender: 'میت کی جنس',
    male: 'مرد (مرحوم شوہر / باپ)',
    female: 'عورت (مرحومہ بیوی / ماں)',
    estateAndBelongings: '۲. کل ترکہ، اثاثہ جات اور واجبات',
    estateSubtitle: 'شرعی ترتیب: تجہیز و تکفین کے اخراجات ← قرضوں کی ادائیگی ← جائز وصیت (زیادہ سے زیادہ 1/3) ← وراثت',
    cashSavings: 'نقدی رقم اور بینک بیلنس',
    realEstate: 'جائیداد، مکانات اور زمین',
    goldJewelry: 'سونا، چاندی اور زیورات',
    otherAssets: 'گاڑیاں، کاروباری سامان اور دیگر اثاثے',
    funeralExpenses: 'تجہیز و تکفین اور تدفین کے مناسب اخراجات',
    debtsOwed: 'میت کے ذمہ واجب الادا قرضے (اللہ کے اور بندوں کے، مہر مؤجل)',
    wasiyyahBequest: 'میت کی وصیت (صرف غیر وارث کے لیے)',
    wasiyyahNotice: 'قرض کی ادائیگی کے بعد باقی ترکے کے ایک تہائی (1/3) تک محدود۔ شرعی وارث کے لیے وصیت ممنوع ہے۔',
    survivingRelatives: '۳. حیات ورثاء کا انتخاب',
    relativesSubtitle: 'صرف ان رشتہ داروں کو منتخب کریں جو میت کے انتقال کے وقت حیات تھے',
    spouses: 'شریکِ حیات',
    wives: 'بیویاں (تعداد: ۱ سے ۴)',
    husband: 'شوہر حیات ہے',
    parentsAndGrandparents: 'والدین، دادا، دادی اور نانی',
    father: 'والد حیات ہیں',
    mother: 'والدہ حیات ہیں',
    paternalGrandfather: 'دادا (باپ کا باپ)',
    paternalGrandmother: 'دادی (باپ کی ماں)',
    maternalGrandmother: 'نانی (ماں کی ماں)',
    childrenAndGrandchildren: 'اولاد اور پوتے پوتیاں',
    sons: 'بیٹے',
    daughters: 'بیٹیاں',
    grandsons: 'پوتے (بیٹے کے بیٹے)',
    granddaughters: 'پوتیاں (بیٹے کی بیٹیاں)',
    siblings: 'بھائی اور بہنیں',
    fullBrothers: 'سگے بھائی (ایک ہی ماں باپ سے)',
    fullSisters: 'سگی بہنیں (ایک ہی ماں باپ سے)',
    paternalBrothers: 'علاتی بھائی (باپ شریک)',
    paternalSisters: 'علاتی بہنیں (باپ شریک)',
    maternalBrothers: 'اخیافی بھائی (ماں شریک)',
    maternalSisters: 'اخیافی بہنیں (ماں شریک)',
    collaterals: 'دیگر عصبات (بھتیجے، چچا وغیرہ)',
    nephewsFull: 'سگے بھتیجے (سگے بھائی کے بیٹے)',
    nephewsPaternal: 'علاتی بھتیجے (باپ شریک بھائی کے بیٹے)',
    unclesFull: 'سگے چچا (باپ کے سگے بھائی)',
    unclesPaternal: 'علاتی چچا (باپ کے باپ شریک بھائی)',
    cousinsFull: 'سگے چچازاد بھائی (مرد)',
    cousinsPaternal: 'علاتی چچازاد بھائی (مرد)',
    calculateInheritance: 'شرعی تقسیم اور حصص معلوم کریں',
    resultsTitle: 'تقسیمِ ترکہ کا شرعی گوشوارہ اور دلائل (علم الفرائض)',
    grossEstate: 'کل چھوڑا گیا ترکہ',
    debtsAndBurial: 'کفن دفن و قرض کی رقم',
    wasiyyahDeduction: 'وصیت کی رقم',
    netInheritable: 'قابلِ تقسیم خالص ترکہ',
    heirsBreakdown: 'مستحق ورثاء اور ان کے شرعی حصص',
    relationship: 'رشتہ داری',
    count: 'تعداد',
    category: 'حیثیت',
    quranicShare: 'قرآنی حصہ (کسر)',
    percentage: 'فیصد',
    totalValue: 'کل مالی حصہ',
    perPersonValue: 'فی کس حصہ',
    viewDaleel: 'شرعی دلیل دیکھیں',
    blockedRelatives: 'محروم رشتہ دار (محجوبین)',
    blockedReason: 'محروم ہونے کی شرعی وجہ',
    blockedBy: 'کس کی وجہ سے محجوب ہوئے',
    noBlockedRelatives: 'اس صورت میں کوئی رشتہ دار محجوب نہیں ہوا۔',
    awlBadge: 'مسئلہ عائلہ (عول: حصص کی مجموعی زیادتی پر متناسب کمی)',
    raddBadge: 'مسئلہ ردّیہ (ردّ: بچا ہوا ترکہ ورثاء پر واپس لوٹانا)',
    umariyyatanBadge: 'مسئلہ عمریہ / الغراوان (ماں کو باقی کا تہائی)',
    printCertificate: 'شرعی سرٹیفکیٹ پرنٹ کریں',
    downloadReport: 'گوشوارہ ڈاؤن لوڈ کریں',
    chatPlaceholder: 'تقسیم ترکہ سے متعلق سوال پوچھیں یا میت اور ورثاء کی تفصیل لکھیں...',
    send: 'بھیجیں',
    chatAdvisorTitle: 'مواریث اے آئی شرعی مشیر',
    chatAdvisorSubtitle: 'مستند کتبِ فرائض اور فتاویٰ کی بنیاد پر ہمدردانہ اور درست رہنمائی',
    apiKeyNotice: 'گوگل جیمنائی (Gemini) سے لیس۔ اپنا ذاتی API کی درج کریں یا متبادل طور پر داخلی شرعی انجن استعمال کریں۔',
    setApiKey: 'Gemini API کی',
    enterGeminiApiKey: 'اپنی Google Gemini API Key یہاں درج کریں...',
    saveKey: 'کی محفوظ کریں',
    keySaved: 'API کی محفوظ ہو گئی',
    clearKey: 'کی ختم کریں',
    noKeyUseRuleEngine: 'داخلی شرعی انجن فعال ہے',
    aiThinking: 'شرعی احکام کی جانچ اور حصص کا حساب لگایا جا رہا ہے...',
    quickReplies: 'تجویز کردہ جوابات',
    fard: 'فرض (مقررہ)',
    asabah: 'عصبہ (باقی ماندہ)',
    fard_and_asabah: 'فرض اور عصبہ',
    awl_adjusted: 'عول کے ساتھ',
    radd_adjusted: 'رد کے ساتھ',
    startFresh: 'نیا حساب شروع کریں',
    startFreshDesc: 'تمام معلومات صاف کر کے اپنے خاندان کا نیا حساب شروع کریں',
    viewingSample: 'آپ نمونہ کیس دیکھ رہے ہیں:',
    customEstate: 'آپ کا ذاتی خاندانی ترکہ',
    readyForEstateTitle: 'اپنے خاندان کے شرعی ترکے کے حساب کے لیے تیار',
    readyForEstateSubtitle: 'بائیں جانب ترکہ کے اثاثے اور قرض درج کریں، پھر زندہ ورثاء کا انتخاب کریں۔ شرعی حصص، حجب کے قواعد اور تقسیم نامہ فوری تیار ہو جائے گا۔',
    exploreDemo: 'نمونہ کیس دیکھیں',
    startMyEstate: 'اپنے خاندان کا ترکہ شروع کریں',
    confirmResetTitle: 'کیا آپ نیا حساب شروع کرنا چاہتے ہیں؟',
    confirmResetDesc: 'اس سے تمام درج شدہ اثاثے، قرض اور منتخب ورثاء صاف ہو جائیں گے تاکہ آپ نئے سرے سے شروع کر سکیں۔',
    confirmResetConfirm: 'ہاں، نیا حساب شروع کریں',
    cancel: 'منسوخ',
    undo: 'واپس لائیں',
    resetSuccessToast: 'ترکہ صاف کر دیا گیا ہے، اب نیا اندراج کریں۔',
  },
};
