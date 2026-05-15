import { TESTIMONIALS } from '../data';

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-gold-50/20 border-t border-b border-gold-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 max-w-xl mx-auto">
          <div className="text-gold-600 text-xs uppercase tracking-[0.2em] font-semibold mb-2">Sanctuary Chronicles</div>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-charcoal-900">Words of Pure Serenity</h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-3 leading-relaxed font-light">
            Read what our valued guests have to say about their somatic transformations and physical releases at Aura Sanctuary.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white p-8 rounded-2xl border border-gold-200/60 luxury-shadow flex flex-col justify-between gap-6 hover:-translate-y-1 transition-transform duration-300"
            >
              {/* Quote and stars */}
              <div className="space-y-4">
                <div className="flex text-amber-400 text-sm">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <span key={i} className="leading-none">★</span>
                  ))}
                </div>
                <p className="text-stone-600 text-sm leading-relaxed italic font-light">
                  "{item.quote}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-gold-50 pt-4">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-10 h-10 rounded-full object-cover border border-gold-100"
                />
                <div>
                  <div className="text-xs font-bold text-charcoal-900">{item.name}</div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
