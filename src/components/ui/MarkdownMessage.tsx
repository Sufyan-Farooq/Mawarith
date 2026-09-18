import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownMessageProps {
  content: string;
  isUser: boolean;
}

// Helper to check if text contains Arabic characters
const hasArabic = (text: string) => /[\u0600-\u06FF]/.test(text);

export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content, isUser }) => {
  if (isUser) {
    return (
      <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-white leading-relaxed">
        {content}
      </div>
    );
  }

  return (
    <div className="chat-markdown text-xs sm:text-sm text-obsidian-800 leading-relaxed font-sans">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h4 className="text-sm font-bold text-obsidian-950 mt-3 mb-1.5 first:mt-0 tracking-tight">
              {children}
            </h4>
          ),
          h2: ({ children }) => (
            <h4 className="text-sm font-bold text-obsidian-950 mt-3 mb-1.5 first:mt-0 tracking-tight">
              {children}
            </h4>
          ),
          h3: ({ children }) => (
            <h5 className="text-xs sm:text-sm font-bold text-obsidian-900 mt-2.5 mb-1 first:mt-0">
              {children}
            </h5>
          ),
          p: ({ children }) => {
            const str = String(children);
            const isArabic = hasArabic(str);
            return (
              <p
                className={`mb-2 last:mb-0 leading-relaxed ${
                  isArabic ? 'font-arabic text-sm sm:text-base leading-[2] text-obsidian-950' : ''
                }`}
                dir={isArabic ? 'rtl' : undefined}
              >
                {children}
              </p>
            );
          },
          ul: ({ children }) => (
            <ul className="list-disc ps-4 space-y-1.5 my-2 text-obsidian-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal ps-4 space-y-1.5 my-2 text-obsidian-700">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-obsidian-950">
              {children}
            </strong>
          ),
          em: ({ children }) => {
            const str = String(children);
            const isArabic = hasArabic(str);
            return (
              <em
                className={`not-italic font-medium ${
                  isArabic
                    ? 'font-arabic text-sm sm:text-base text-jade-800 font-bold px-1'
                    : 'italic text-obsidian-800'
                }`}
              >
                {children}
              </em>
            );
          },
          hr: () => (
            <hr className="my-3 border-t border-slate-200/80" />
          ),
          blockquote: ({ children }) => (
            <blockquote className="px-3.5 py-1.5 border border-emerald-200/80 my-2 text-obsidian-700 italic bg-emerald-50/50 rounded-lg">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-xs text-obsidian-800 border border-slate-200">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
