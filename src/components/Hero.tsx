import { ArrowRight, Compass, Sparkles, Heart } from 'lucide-react';

interface HeroProps {
  scrollToBooking: () => void;
}

export default function Hero({ scrollToBooking }: HeroProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center py-20 overflow-hidden">
      {/* Background Image & Luxury Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 scale-105 transition-transform duration-1000"
        style={{ backgroundImage: 'url("/images/spa-hero.jpg")' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/95 via-charcoal-900/80 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#faf8f5] via-transparent to-transparent z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 w-full">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="md:col-span-7 text-white space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-500/25 border border-gold-500/40 rounded-full backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-gold-200" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-gold-100">Re-establish Harmony</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-[1.1] text-white">
              Somatic Healing & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-500 to-gold-100">
                Pure Wellness
              </span> <br />
              Sanctuary
            </h1>

            <p className="text-base sm:text-lg text-stone-200 max-w-xl leading-relaxed font-light">
              Escape the digital noise. Experience deeply personalized, organic massage therapies, vibrational sound baths, and aesthetic botanical facials guided by master clinical practitioners.
            </p>

            {/* Features list */}
            <div className="grid grid-cols-2 gap-4 max-w-md pt-2 border-t border-white/10">
              <div className="flex items-center gap-2.5 text-sm text-stone-100">
                <Compass className="w-4 h-4 text-gold-400 shrink-0" />
                <span>4 Professional Therapists</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-stone-100">
                <Heart className="w-4 h-4 text-gold-400 shrink-0" />
                <span>100% Organic Botanicals</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
              <button
                onClick={scrollToBooking}
                className="bg-gold-500 hover:bg-gold-600 text-charcoal-900 px-8 py-4 rounded-full font-semibold text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-3 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30 w-full sm:w-auto justify-center cursor-pointer group"
              >
                Reserve Your Session
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href="#services"
                className="text-white hover:text-gold-200 px-6 py-3 text-xs font-semibold tracking-widest uppercase border border-white/20 hover:border-gold-200/50 rounded-full transition-all duration-300 w-full sm:w-auto text-center"
              >
                Explore Menu
              </a>
            </div>
          </div>

          {/* Premium Focal Badge */}
          <div className="md:col-span-5 hidden lg:block">
            <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md max-w-sm ml-auto space-y-6 luxury-shadow">
              <div className="text-gold-200 text-xs uppercase tracking-widest font-semibold">Client Love</div>
              <p className="italic text-stone-300 text-sm font-light leading-relaxed">
                "The vibrational sound bath dissolved my physical and neural tension. I've never experienced such deep mindfulness. The booking notification and email process was instantaneous!"
              </p>
              <div className="flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" 
                  alt="Evelyn R." 
                  className="w-10 h-10 rounded-full object-cover border border-gold-500"
                />
                <div>
                  <div className="text-sm font-medium text-white">Evelyn R.</div>
                  <div className="text-xs text-stone-400">Executive Creative Director</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
