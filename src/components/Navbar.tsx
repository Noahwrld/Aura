import { Sparkles, Calendar, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  activeTab: 'booking' | 'admin';
  setActiveTab: (tab: 'booking' | 'admin') => void;
  scrollToBooking: () => void;
}

export default function Navbar({ activeTab, setActiveTab, scrollToBooking }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gold-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center border border-gold-200">
              <Sparkles className="w-5 h-5 text-gold-600" />
            </div>
            <div>
              <span className="font-serif text-2xl font-semibold tracking-widest text-charcoal-900">A U R A</span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 font-semibold mt-[-4px]">Wellness Sanctuary</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-medium text-charcoal-900/70 hover:text-gold-700 transition-colors">Services</a>
            <a href="#therapists" className="text-sm font-medium text-charcoal-900/70 hover:text-gold-700 transition-colors">Specialists</a>
            <a href="#testimonials" className="text-sm font-medium text-charcoal-900/70 hover:text-gold-700 transition-colors">Reviews</a>
            <a href="#faq" className="text-sm font-medium text-charcoal-900/70 hover:text-gold-700 transition-colors">FAQ</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab(activeTab === 'admin' ? 'booking' : 'admin')}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 border ${
                activeTab === 'admin'
                  ? 'bg-gold-600 text-white border-gold-600 shadow-md'
                  : 'bg-white text-gold-700 border-gold-200 hover:bg-gold-50'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span className="hidden sm:inline">{activeTab === 'admin' ? 'Show Booking App' : 'Admin Simulator'}</span>
              <span className="inline sm:hidden">{activeTab === 'admin' ? 'App' : 'Admin'}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('booking');
                setTimeout(scrollToBooking, 100);
              }}
              className="bg-charcoal-900 hover:bg-gold-700 text-white text-xs font-semibold tracking-wider uppercase px-5 py-3 rounded-full transition-all duration-300 flex items-center gap-2 shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              Book Ritual
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
