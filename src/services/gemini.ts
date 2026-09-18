const ISLAMIC_INHERITANCE_SYSTEM_PROMPT = `
You are Mawarith AI, a highly knowledgeable, compassionate, and precise Islamic Inheritance (علم الفرائض والمواريث) scholar and advisor.
You strictly adhere to the Holy Quran (Surah An-Nisa verses 11, 12, 176), Sahih Sunnah (Bukhari, Muslim, Abu Dawud, Tirmidhi), and the consensus of classical and contemporary mainstream Sunni scholars, especially Shaykh Abd al-Aziz ibn Baz, Shaykh Muhammad ibn Salih al-Uthaymeen (author of Tashil al-Fara'id), and Shaykh Salih ibn Fawzan al-Fawzan (author of al-Tahqiqat al-Mardiyyah).

YOUR CORE RESPONSIBILITIES:
1. Speak with dignified Islamic etiquette and empathy. When someone mentions a death, express condolences (إنا لله وإنا إليه راجعون - May Allah grant them mercy).
2. Gather information systematically:
   - Step 1: Who passed away (man or woman)? Was their spouse alive at the moment of death?
   - Step 2: What are the estate assets (cash, property, gold) and what debts/burial expenses must be cleared first? Did they leave a bequest (wasiyyah to non-heirs, max 1/3)?
   - Step 3: Who among their children, parents, grandparents, brothers, sisters, or close relatives survived them?
3. Enforce Shariah rules strictly:
   - Debt precedes bequest and inheritance (قضى النبي بالدين قبل الوصية).
   - Wasiyyah cannot exceed 1/3 of the net estate and cannot be given to a legal heir (لا وصية لوارث).
   - Closer relatives exclude farther relatives (Hajb: e.g. Son blocks grandsons and siblings; Father blocks grandfather and siblings).
   - Explain Al-Awl when shares exceed 1 (following Caliph Umar's consensus).
   - Explain Al-Radd when shares are under 1 and no Asabah exist (surplus returned to prescribed heirs, excluding spouse, as ruled by Ibn Baz & Ibn Uthaymeen).
4. Always cite the authentic Daleel (Surah & Ayah, Sahih Hadith, or scholarly consensus) for every calculation.
5. Provide your answers in the user's language (English, Arabic, or Urdu).
`;

const ENV_API_KEY: string = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

export function isGeminiConfigured(): boolean {
  return typeof ENV_API_KEY === 'string' && ENV_API_KEY.trim().length > 0;
}

export async function generateMawarithChatResponse(
  prompt: string,
  conversationHistory: { role: 'user' | 'model'; parts: string }[] = [],
  language: 'en' | 'ar' | 'ur' = 'en'
): Promise<string> {
  const apiKey = ENV_API_KEY.trim();

  if (apiKey) {
    const fullSystemInstruction = `${ISLAMIC_INHERITANCE_SYSTEM_PROMPT}\nCURRENT LANGUAGE FOR THIS CONVERSATION: ${language.toUpperCase()}. Always format your reply clearly with neat bullet points, arabic citations where appropriate, and warm guidance.`;

    // Map conversation contents
    const contents = [
      ...conversationHistory.map(item => ({
        role: item.role,
        parts: [{ text: item.parts }]
      })),
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ];

    const modelsToTry = ['gemini-3.6-flash', 'gemini-flash-lite-latest', 'gemini-flash-latest'];

    for (const modelName of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-goog-api-key': apiKey,
            },
            body: JSON.stringify({
              contents,
              systemInstruction: {
                parts: [{ text: fullSystemInstruction }],
              },
              generationConfig: {
                temperature: 0.3,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            return candidateText;
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.warn(`Gemini (${modelName}) returned status ${response.status}:`, errorData);
        }
      } catch (err) {
        console.warn(`Gemini (${modelName}) network error:`, err);
      }
    }
  }

  // Built-in intelligent Shariah expert fallback
  const fallback = generateLocalFallbackResponse(prompt, language);
  return fallback.text;
}

// Built-in intelligent offline assistant
export function generateLocalFallbackResponse(
  userMessage: string,
  language: 'en' | 'ar' | 'ur' = 'en'
): { text: string; suggestedChips?: string[] } {
  const lower = userMessage.toLowerCase();

  if (language === 'ar') {
    if (lower.includes('سلام') || lower.includes('مرحبا') || lower.includes('أهلا') || lower.includes('توفي') || lower.includes('مات')) {
      return {
        text: `وعليكم السلام ورحمة الله وبركاته. عظم الله أجركم وأحسن عزاءكم وغفر لميتكم، وإنا لله وإنا إليه راجعون.\n\nأنا مرشدك الشرعي في منصة "مَوارِيث" لحساب الفريضة الشرعية وفق كتاب الله وسنة رسوله ﷺ وفتاوى كبار العلماء (الشيخ ابن باز والشيخ ابن عثيمين والشيخ صالح الفوزان).\n\nلبدء توزيع التركة، يرجى إخباري:\n١. هل المتوفى رجل أم امرأة؟\n٢. هل له زوجة (أو زوج) وأولاد (ذكور أو إناث)؟\n٣. هل الوالدان (الأب أو الأم) على قيد الحياة؟`,
        suggestedChips: ['المتوفى رجل وله زوجة وأولاد', 'المتوفاة امرأة ولها زوج وأولاد', 'توفي وترك والدين فقط', 'تحميل مسألة نموذجية']
      };
    }
    if (lower.includes('دين') || lower.includes('وصية') || lower.includes('تركة')) {
      return {
        text: `في الشريعة الإسلامية، الحقوق المتعلقة بالتركة تُقضى بالترتيب التالي:\n١. مؤن تجهيز الميت والدفن بالمعروف.\n٢. الديون (تُقدم على الوصية بإجماع الصحابة وقضاء علي رضي الله عنه).\n٣. الوصية لغير وارث بما لا يتجاوز ثلث ما بقي لحديث: "الثلث والثلث كثير"، ولا تصح لوارث لحديث: "لا وصية لوارث".\n٤. ما بقي يُقسم على الورثة الشرعيين.`,
        suggestedChips: ['المتوفى رجل', 'المتوفاة امرأة', 'حساب التركة الآن']
      };
    }
    return {
      text: `لقد قمت بتسجيل معلوماتك. يمكنك في أي وقت استخدام "الموزع التفاعلي" بالأعلى لضبط الموجودات والورثة بدقة متناهية، أو إخباري بالمزيد من التفاصيل عن الأقارب الأحياء وسأحسب الفريضة لك فوراً مع بيان الدليل الشرعي.`,
      suggestedChips: ['له زوجة وأبناء', 'له والدان فقط', 'عرض الأدلة الشرعية']
    };
  }

  if (language === 'ur') {
    if (lower.includes('سلام') || lower.includes('فوت') || lower.includes('انتقال') || lower.includes('مرحوم')) {
      return {
        text: `وعلیکم السلام ورحمۃ اللہ وبرکاتہ۔ إنا للہ وإنا إلیہ راجعون۔ اللہ تعالیٰ مرحوم کی مغفرت فرمائے اور درجات بلند فرمائے۔\n\nمیں "مواریث" پلیٹ فارم پر اسلامی شریعت اور مستند فتاویٰ (شیخ ابن باز، شیخ ابن عثیمین اور شیخ صالح الفوزان) کی روشنی میں وراثت کی تقسیم کا شرعی مشیر ہوں۔\n\nشروعات کے لیے برائے مہربانی بتائیں:\n۱. میت مرد ہے یا عورت؟\n۲. کیا میت کے انتقال کے وقت شریکِ حیات (بیوی یا شوہر) اور اولاد موجود تھی؟\n۳. کیا والدین (والد یا والدہ) حیات ہیں؟`,
        suggestedChips: ['میت مرد ہے (بیوی اور بچے ہیں)', 'میت عورت ہے (شوہر اور بچے ہیں)', 'صرف والدین حیات ہیں', 'مشہور فقہی مسئلہ لوڈ کریں']
      };
    }
    return {
      text: `آپ کا پیغام موصول ہو گیا۔ آپ اوپر دیے گئے "انٹرایکٹو خاندانی چارٹ" کے ذریعے بھی براہِ راست تمام تفصیلات درج کر سکتے ہیں، یا مزید ورثاء کی تفصیل یہاں لکھیں تاکہ میں شرعی دلائل کے ساتھ حصے واضح کروں۔`,
      suggestedChips: ['بیوی اور بچے ہیں', 'قرض اور وصیت کے احکام', 'شرعی دلائل دیکھیں']
    };
  }

  // English fallback
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('passed') || lower.includes('died') || lower.includes('inherit')) {
    return {
      text: `Peace and blessings be upon you. *Inna lillahi wa inna ilayhi raji'un* (To Allah we belong and to Him we return). May Allah grant mercy to the deceased.\n\nI am your Shariah Inheritance Advisor at Mawarith, guided strictly by the Holy Quran, Sahih Hadiths, and verified rulings of mainstream scholars including Shaykh Ibn Baz, Shaykh Ibn 'Uthaymeen, and Shaykh Salih al-Fawzan.\n\nTo begin accurate distribution:\n1. Is the deceased male or female?\n2. Did they leave a surviving spouse and children?\n3. Are their parents (father or mother) currently alive?`,
      suggestedChips: ['Deceased is Male (Wife & Children)', 'Deceased is Female (Husband & Children)', 'Only Parents Survived', 'Load Sample Case Study']
    };
  }

  return {
    text: `Thank you for the information. You can use the "Interactive Studio" tab above to adjust exact numbers and relatives with instant calculations, or continue telling me about the estate and surviving family members.`,
    suggestedChips: ['Add Surviving Spouse', 'Add Children', 'Debts & Wasiyyah Rules', 'Calculate Shares']
  };
}

export const generateWirasatChatResponse = generateMawarithChatResponse;
