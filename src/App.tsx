import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookingWizard from './components/BookingWizard';
import AdminDashboard from './components/AdminDashboard';
import FAQ from './components/FAQ';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import { Booking } from './types';
import { Clock, Sparkles, Award } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'booking' | 'admin'>('booking');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const bookingSectionRef = useRef<HTMLDivElement>(null);

  // Pre-populate local storage with a sample booking for immediate dashboard visualization
  useEffect(() => {
    const stored = localStorage.getItem('aura_bookings');
    if (stored) {
      setBookings(JSON.parse(stored));
    } else {
      const initialBooking: Booking = {
        id: 'bk-x92f9k',
        name: 'Seraphina Rosewood',
        email: 'seraphina.r@example.com',
        phone: '(415) 882-9102',
        service: 'Himalayan Warm Stone Ritual',
        therapist: 'David Vance, LMT',
        date: 'Thursday, March 26, 2026',
        time: '03:00 PM',
        specialRequests: 'Prefers organic lavender massage oil. Focus on shoulder blade stress release.',
        promoCode: 'SANCTUARY20',
        newsletter: true,
        status: 'confirmed',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString() // 4 hours ago
      };
      localStorage.setItem('aura_bookings', JSON.stringify([initialBooking]));
      setBookings([initialBooking]);
    }
  }, []);

  const scrollToBooking = () => {
    bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle new booking triggers
  const handleBookingSuccess = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
  };

  // Delete a booking submission
  const handleDeleteBooking = (id: string) => {
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    localStorage.setItem('aura_bookings', JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#faf8f5]">
      
      {/* Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        scrollToBooking={scrollToBooking} 
      />

      {/* MAIN CONDITIONAL CONTENT ROUTING */}
      {activeTab === 'booking' ? (
        <main className="flex-1 space-y-24">
          
          {/* Hero Section */}
          <Hero scrollToBooking={scrollToBooking} />

          {/* Promotional Badge / Trust Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
            <div className="bg-charcoal-900 text-white rounded-2xl p-6 md:p-8 border border-gold-700/20 shadow-xl grid md:grid-cols-3 gap-6 items-center divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="flex gap-4 items-start pb-6 md:pb-0">
                <Award className="w-8 h-8 text-gold-400 shrink-0" />
                <div>
                  <h4 className="font-serif text-base font-semibold text-gold-200">Clinical Sanctuary</h4>
                  <p className="text-stone-400 text-xs font-light mt-1">All specialists are fully licensed, somatic coaches and aesthetic alchemists.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start py-6 md:py-0 md:pl-6">
                <Sparkles className="w-8 h-8 text-gold-400 shrink-0" />
                <div>
                  <h4 className="font-serif text-base font-semibold text-gold-200">Netlify Form Security</h4>
                  <p className="text-stone-400 text-xs font-light mt-1">Form submissions are processed via Netlify, triggering instant administrative email routing.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start pt-6 md:pt-0 md:pl-6">
                <Clock className="w-8 h-8 text-gold-400 shrink-0" />
                <div>
                  <h4 className="font-serif text-base font-semibold text-gold-200">Flexible Rescheduling</h4>
                  <p className="text-stone-400 text-xs font-light mt-1">Free cancellation or adjustments up to 24 hours before your ritual.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Services Showcase Menu */}
          <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <div className="text-gold-600 text-xs uppercase tracking-[0.2em] font-semibold mb-2">Curative Offerings</div>
              <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-charcoal-900">The Treatment Gallery</h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-3 leading-relaxed font-light">
                Immerse yourself in our luxury menu. Each treatment is somatic, deeply therapeutic, and tailored to harmonize neural and physical muscle pathways.
              </p>
            </div>

            {/* Brief Gallery */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Aura Deep Tissue Release', price: '$160', dur: '75 Min', image: '/images/treatment-massage.jpg', cat: 'Massage' },
                { name: 'Radiant Botanicals Lift', price: '$145', dur: '60 Min', image: '/images/treatment-facial.jpg', cat: 'Aesthetics' },
                { name: 'Vibrational Sound Bath', price: '$95', dur: '60 Min', image: '/images/treatment-yoga.jpg', cat: 'Sound Healing' },
                { name: 'The Empress Royal Ritual', price: '$250', dur: '120 Min', image: '/images/spa-hero.jpg', cat: 'Signature' }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gold-100 overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-charcoal-900/85 backdrop-blur-md text-gold-200 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-gold-500/20">
                      {item.cat}
                    </span>
                  </div>
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <h4 className="font-serif text-base font-semibold text-charcoal-900 group-hover:text-gold-700 transition-colors leading-snug">
                        {item.name}
                      </h4>
                      <div className="flex items-center justify-between text-xs font-medium text-stone-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-stone-400" /> {item.dur}
                        </span>
                        <span className="text-gold-700 font-bold">{item.price}</span>
                      </div>
                    </div>

                    <button
                      onClick={scrollToBooking}
                      className="w-full mt-2 py-2.5 bg-gold-50 hover:bg-gold-100 border border-gold-200 text-gold-800 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                    >
                      Reserve Offering
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Interactive Scheduler (The core BookingWizard) */}
          <section 
            ref={bookingSectionRef} 
            className="py-16 border-t border-gold-100 scroll-mt-20"
          >
            <BookingWizard onBookingSuccess={handleBookingSuccess} />
          </section>

          {/* Testimonials Panel */}
          <Testimonials />

          {/* FAQ Panel */}
          <FAQ />

        </main>
      ) : (
        <main className="flex-1 py-12">
          {/* Full Netlify Admin Dashboard & Integration Portal */}
          <AdminDashboard 
            bookings={bookings} 
            setBookings={setBookings} 
            onDeleteBooking={handleDeleteBooking} 
          />
        </main>
      )}

      {/* Footer */}
      <Footer />

    </div>
  );
}
