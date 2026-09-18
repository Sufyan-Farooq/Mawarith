import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import { generateMawarithChatResponse, generateLocalFallbackResponse } from '../services/gemini';
import { SAMPLE_SCENARIOS } from '../data/samples';
import { DeceasedGender, EstateInput, HeirsInput } from '../engine/types';
import { BrandLogo } from './ui/BrandLogo';
import { MarkdownMessage } from './ui/MarkdownMessage';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  chips?: string[];
  timestamp: string;
}

interface ChatInterfaceProps {
  language: SupportedLanguage;
  onSwitchToStudioWithData: (gender: DeceasedGender, estate: EstateInput, heirs: HeirsInput) => void;
}

let messageCounter = 0;
function nextMessageId(prefix: string): string {
  messageCounter += 1;
  return `${prefix}-${messageCounter}-${Math.random().toString(36).slice(2, 9)}`;
}

function getFormattedTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  language,
  onSwitchToStudioWithData,
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar' || language === 'ur';

  const getInitialGreeting = (lang: SupportedLanguage): Message => ({
    id: 'greeting',
    sender: 'bot',
    text: lang === 'ar'
      ? `السلام عليكم ورحمة الله وبركاته. أهلاً بك في منصة "مَوارِيث".\n\nأنا مرشدك الشرعي لحساب الفريضة الشرعية وفق كتاب الله وسنة رسوله ﷺ وفتاوى كبار العلماء (الشيخ ابن باز والشيخ ابن عثيمين والشيخ صالح الفوزان).\n\nإذا كنت ترغب في قسمة تركة متوفى، يرجى ذكر:\n• هل المتوفى رجل أم امرأة؟\n• ما هي أهم الموجودات والديون؟\n• من هم الأقارب الأحياء وقت الوفاة (الزوج/الزوجة، الأولاد، الوالدان، الإخوة)؟`
      : lang === 'ur'
      ? `السلام علیکم ورحمۃ اللہ وبرکاتہ۔ "مواریث" پلیٹ فارم پر خوش آمدید۔\n\nمیں اسلامی شریعت اور مستند فتاویٰ (شیخ ابن باز، شیخ ابن عثیمین اور شیخ صالح الفوزان) کی روشنی میں وراثت کی تقسیم میں آپ کا شرعی معاون ہوں۔\n\nتقسیمِ ترکہ کے لیے برائے مہربانی بتائیں:\n• میت مرد ہے یا عورت؟\n• کل ترکہ، جائیداد اور میت کے ذمہ قرضے کتنے ہیں؟\n• میت کے انتقال کے وقت کون سے رشتہ دار (بیوی/شوہر، اولاد، والدین، بھائی بہن) حیات تھے؟`
      : `Peace and blessings be upon you. Welcome to Mawarith.\n\nI am your Shariah Inheritance Advisor, grounded in the Holy Quran, authentic Sunnah, and rulings of renowned scholars including Shaykh Ibn Baz, Shaykh Ibn 'Uthaymeen, and Shaykh Salih al-Fawzan.\n\nTo begin calculating the estate distribution according to Islamic law:\n• Was the deceased male or female?\n• What are the gross assets and debts/burial costs?\n• Who among their spouse, children, parents, or siblings survived them?`,
    chips: lang === 'ar'
      ? ['المتوفى رجل وترك زوجة وأولاد', 'المسألة العمرية (زوج وأم وأب)', 'مسألة عول (زوج وأختان)', 'ما هي الحقوق المقدمة على التركة؟']
      : lang === 'ur'
      ? ['میت مرد ہے (بیوی اور بچے ہیں)', 'مسئلہ عمریہ (شوہر، ماں، باپ)', 'مسئلہ عول (شوہر اور دو بہنیں)', 'ترکہ سے پہلے کی ادائیگیاں کیا ہیں؟']
      : ['Deceased is Male (Wife, Son, Daughters)', 'Al-Gharrawan (Husband, Mother, Father)', 'Al-\'Awl Case (Husband, 2 Sisters)', 'What obligations precede inheritance?'],
    timestamp: getFormattedTime(),
  });

  const [messages, setMessages] = useState<Message[]>(() => [getInitialGreeting(language)]);
  const [prevLanguage, setPrevLanguage] = useState(language);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync greeting on language change without triggering cascading effect
  if (prevLanguage !== language) {
    setPrevLanguage(language);
    if (messages.length <= 1 && messages[0]?.id === 'greeting') {
      setMessages([getInitialGreeting(language)]);
    }
  }

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: nextMessageId('user'),
      sender: 'user',
      text: text.trim(),
      timestamp: getFormattedTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      let botReplyText = '';
      let botChips: string[] | undefined = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('عمرية') || lower.includes('عمریہ') || lower.includes('gharrawan')) {
        const scenario = SAMPLE_SCENARIOS.find(s => s.id === 'al-gharrawan')!;
        onSwitchToStudioWithData(scenario.gender, scenario.estate, scenario.heirs);
        botReplyText = language === 'ar'
          ? 'تم تحميل المسألة العمرية (الغراوان) مباشرة في الموزع التفاعلي مع تطبيق قضاء عمر رضي الله عنه (للأم ثلث الباقي وللأب الباقي تعصيباً).'
          : language === 'ur'
          ? 'مسئلہ عمریہ براہ راست انٹرایکٹو اسٹوڈیو میں لوڈ کر دیا گیا ہے جس میں ماں کے لیے باقی کا تہائی اور باپ کے لیے باقی ماندہ طے ہے۔'
          : 'Al-Gharrawan (Umariyyatan) has been loaded directly into the Interactive Studio with Umar\'s ruling applied.';
      } else if (lower.includes('عول') || lower.includes('awl')) {
        const scenario = SAMPLE_SCENARIOS.find(s => s.id === 'al-awl')!;
        onSwitchToStudioWithData(scenario.gender, scenario.estate, scenario.heirs);
        botReplyText = language === 'ar'
          ? 'تم تحميل مسألة العول في الموزع التفاعلي: تزاحم الفروض (النصف والثلثان) فتعول المسألة إلى ٧.'
          : language === 'ur'
          ? 'مسئلہ عول اسٹوڈیو میں لوڈ ہو گیا ہے: شوہر کو 3/7 اور بہنوں کو 4/7 ملتا ہے۔'
          : 'Al-\'Awl scenario has been loaded into the Interactive Studio: shares expand to 7.';
      } else {
        const history = messages.map((m) => ({
          role: m.sender === 'user' ? ('user' as const) : ('model' as const),
          parts: m.text,
        }));
        botReplyText = await generateMawarithChatResponse(text, history, language);
        const local = generateLocalFallbackResponse(text, language);
        botChips = local.suggestedChips;
      }

      const botMsg: Message = {
        id: nextMessageId('bot'),
        sender: 'bot',
        text: botReplyText,
        chips: botChips,
        timestamp: getFormattedTime(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: Message = {
        id: nextMessageId('error'),
        sender: 'bot',
        text: language === 'ar'
          ? `عذراً، حدث خطأ أثناء معالجة الطلب. يمكنك استخدام "الموزع التفاعلي" للحساب الدقيق.`
          : language === 'ur'
          ? `معذرت، کارروائی کے دوران مسئلہ پیش آیا۔ آپ براہِ راست انٹرایکٹو اسٹوڈیو استعمال کر سکتے ہیں۔`
          : `We encountered an issue processing your request. You can use the Interactive Studio above.`,
        timestamp: getFormattedTime(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div 
      className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-10rem)] bg-white border border-slate-200/90 shadow-float rounded-2xl overflow-hidden text-obsidian-900"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Header Bar */}
      <div className="px-5 py-3.5 bg-obsidian-900 text-white border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo size={32} />
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{t.chatAdvisorTitle}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-jade-400" />
            </h3>
            <p className="text-xs text-obsidian-400">
              {t.chatAdvisorSubtitle}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-brass-400 bg-brass-400/10 px-2.5 py-1 rounded-full border border-brass-400/20">
          {language === 'ar' ? 'تحقيق كبار العلماء' : language === 'ur' ? 'کبار علماء کے فتاویٰ' : 'Authentic Scholarly Counsel'}
        </span>
      </div>

      {/* Messages Stream with Motion Entrance */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? (isRtl ? 'flex-row' : 'flex-row-reverse') : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-micro ${
                  m.sender === 'user'
                    ? 'bg-obsidian-900 text-white'
                    : 'bg-jade-50 text-jade-700 border border-jade-200/60'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-micro ${
                  m.sender === 'user'
                    ? 'bg-obsidian-900 text-white'
                    : 'bg-white text-obsidian-800 border border-slate-200/90'
                }`}
              >
                <MarkdownMessage content={m.text} isUser={m.sender === 'user'} />

                {/* Suggested Quick Question Capsules */}
                {m.chips && m.chips.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                    {m.chips.map((chip, idx) => (
                      <motion.button
                        key={idx}
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleSend(chip)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-jade-50 hover:text-jade-900 hover:border-jade-300 border border-slate-200/80 text-obsidian-700 text-xs font-medium transition-all text-start shadow-micro"
                      >
                        {chip}
                      </motion.button>
                    ))}
                  </div>
                )}

                <span className={`block text-[10px] mt-2 opacity-60 ${m.sender === 'user' ? 'text-end' : ''}`}>
                  {m.timestamp}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-jade-50 border border-jade-200/60 text-jade-700 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white border border-slate-200/90 text-xs text-obsidian-600 flex items-center gap-2 shadow-micro">
              <Loader2 className="w-3.5 h-3.5 text-jade-700 animate-spin" />
              <span>{t.aiThinking}</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Prompt Input Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-slate-100/80 rounded-2xl p-1.5 border border-slate-200/80 focus-within:border-jade-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-jade-500/15 transition-all shadow-micro"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.chatPlaceholder}
            className="flex-1 px-3 py-2 text-xs sm:text-sm bg-transparent border-none focus:outline-none text-obsidian-900 placeholder:text-obsidian-400"
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.92 }}
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2 rounded-xl bg-obsidian-900 hover:bg-obsidian-800 disabled:opacity-30 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-micro transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-brass-400" />
            <span className="hidden sm:inline">{t.send}</span>
          </motion.button>
        </form>
      </div>
    </div>
  );
};
