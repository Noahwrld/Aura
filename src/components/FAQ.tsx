import { useState } from 'react';
import { FAQS } from '../data';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 scroll-mt-20 max-w-4xl mx-auto px-4">
      <div className="text-center mb-14 max-w-xl mx-auto">
        <div className="text-gold-600 text-xs uppercase tracking-[0.2em] font-semibold mb-2 flex items-center justify-center gap-1">
          <HelpCircle className="w-4 h-4" /> Essential Answers
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-charcoal-900">Frequently Asked Queries</h2>
        <p className="text-stone-500 text-xs sm:text-sm mt-3 leading-relaxed font-light">
          Learn how the Netlify Booking system processes notifications, paths emails, and customizes client configurations.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index}
              className="bg-white rounded-2xl border border-gold-100/80 overflow-hidden transition-all duration-200 shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none hover:bg-gold-50/20 transition-colors cursor-pointer"
              >
                <span className="font-serif text-sm sm:text-base font-semibold text-charcoal-900 pr-2">
                  {faq.question}
                </span>
                <div className={`w-6 h-6 rounded-full bg-gold-50 flex items-center justify-center shrink-0 border border-gold-200 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}>
                  {isOpen ? (
                    <Minus className="w-3 h-3 text-gold-700" />
                  ) : (
                    <Plus className="w-3 h-3 text-gold-700" />
                  )}
                </div>
              </button>

              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-[200px] border-t border-gold-50' : 'max-h-0'
              }`}>
                <p className="p-6 text-stone-500 text-xs sm:text-sm leading-relaxed font-light bg-gold-50/5">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
