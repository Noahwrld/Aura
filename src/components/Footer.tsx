import { Sparkles, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-white pt-20 pb-10 mt-20 border-t border-gold-700/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Logo & About (4 columns) */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-600/20 flex items-center justify-center border border-gold-500/40">
                <Sparkles className="w-5 h-5 text-gold-200" />
              </div>
              <div>
                <span className="font-serif text-2xl font-semibold tracking-widest text-white">A U R A</span>
                <span className="block text-[10px] uppercase tracking-[0.25em] text-gold-400 font-semibold mt-[-4px]">Wellness Sanctuary</span>
              </div>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed font-light">
              We offer highly personalized, curative somatic treatments, warm crystal massage, and advanced bio-botanical facial aesthetics in a completely noise-free wellness environment.
            </p>
            <div className="flex items-center gap-2.5 text-xs text-stone-400">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
              <span>724 Zen Path, Sanctuary Valley, CA 90210</span>
            </div>
          </div>

          {/* Working Hours (4 columns) */}
          <div className="md:col-span-4 space-y-5">
            <h4 className="font-serif text-base font-semibold text-gold-200">Sanctuary Hours</h4>
            <ul className="space-y-2.5 text-xs font-medium text-stone-400">
              <li className="flex justify-between border-b border-white/5 pb-1.5">
                <span>Monday - Thursday</span>
                <span className="text-white">09:00 AM - 07:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-1.5">
                <span>Friday - Saturday</span>
                <span className="text-white">08:00 AM - 08:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday Rest Cycle</span>
                <span className="text-gold-400 uppercase font-bold text-[10px] tracking-wider mt-0.5">Closed</span>
              </li>
            </ul>
          </div>

          {/* Contact & Subscriptions (4 columns) */}
          <div className="md:col-span-4 space-y-5">
            <h4 className="font-serif text-base font-semibold text-gold-200">Sanctuary Front Desk</h4>
            <p className="text-stone-400 text-xs font-light leading-relaxed">
              Need assistance or planning a private event sound bath? Reach out directly to our coordinators.
            </p>
            <div className="space-y-3 text-xs font-medium text-stone-300">
              <a href="mailto:concierge@aurawellness.com" className="flex items-center gap-2.5 hover:text-gold-300 transition-colors">
                <Mail className="w-4 h-4 text-gold-400" />
                <span>concierge@aurawellness.com</span>
              </a>
              <a href="tel:+1800555787a" className="flex items-center gap-2.5 hover:text-gold-300 transition-colors">
                <Phone className="w-4 h-4 text-gold-400" />
                <span>1 (800) 555-AURA</span>
              </a>
            </div>
          </div>

        </div>

        {/* Copyright and credits */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-stone-500 font-medium">
          <div>
            © {new Date().getFullYear()} Aura Wellness Sanctuary LLC. All Rights Reserved.
          </div>
          
          <div className="flex items-center gap-1 text-stone-500">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-600 fill-rose-600" />
            <span>for elite digital scheduling and production email routing.</span>
          </div>

          <div className="flex gap-4">
            <a href="#services" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#faq" className="hover:text-white transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
