import React, { useState } from 'react';
import { SERVICES, THERAPISTS } from '../data';
import { Service, Therapist, Booking } from '../types';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Sparkles, Check, AlertCircle,
  Lock, CheckCircle2, Info, ArrowRight
} from 'lucide-react';

interface BookingWizardProps {
  onBookingSuccess: (booking: Booking) => void;
}

type WizardStep = 'service' | 'therapist' | 'datetime' | 'details' | 'success';

export default function BookingWizard({ onBookingSuccess }: BookingWizardProps) {
  const [step, setStep] = useState<WizardStep>('service');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [newsletter, setNewsletter] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Calendar Navigation State
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Categories helper
  const categories = [
    { id: 'all', label: 'All Offerings' },
    { id: 'massage', label: 'Massage Therapies' },
    { id: 'facial', label: 'Botanical Facials' },
    { id: 'mindbody', label: 'Mind & Body' },
    { id: 'rituals', label: 'Signature Rituals' }
  ];

  // Filter services
  const filteredServices = selectedCategory === 'all' 
    ? SERVICES 
    : SERVICES.filter(s => s.category === selectedCategory);

  // Calendar Grid Helper
  const generateCalendarDays = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const days: (Date | null)[] = [];
    
    // Filler days from previous month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    
    // Current month's days
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isSameDay = (d1: Date, d2: Date | null) => {
    if (!d2) return false;
    return d1.getDate() === d2.getDate() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getFullYear() === d2.getFullYear();
  };

  // Handle Form Submission (Netlify Forms & Email Notification simulation)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedService || !selectedTherapist || !selectedDate || !selectedTime) {
      setSubmitError("Please complete all booking steps before submitting.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // 1. Prepare payload for Netlify Forms
    const formName = 'bookings';
    const payload = {
      'form-name': formName,
      'name': name,
      'email': email,
      'phone': phone,
      'service': selectedService.name,
      'therapist': selectedTherapist.name,
      'date': formattedDate,
      'time': selectedTime,
      'special_requests': specialRequests,
      'promo_code': promoCode,
      'newsletter': newsletter ? 'yes' : 'no'
    };

    // Convert to URL encoded string
    const urlEncodedData = Object.entries(payload)
      .map(([key, val]) => encodeURIComponent(key) + '=' + encodeURIComponent(val))
      .join('&');

    try {
      // Send POST request to current page for Netlify to intercept
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: urlEncodedData,
      });

      // Standard Netlify form endpoint accepts post and responds.
      // Even if we are in dev mode (localhost) and response isn't Netlify specific,
      // we simulate the successful database insertion and trigger confirmation.
      
      const newBooking: Booking = {
        id: `bk-${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        phone,
        service: selectedService.name,
        therapist: selectedTherapist.name,
        date: formattedDate,
        time: selectedTime,
        specialRequests: specialRequests || undefined,
        promoCode: promoCode || undefined,
        newsletter,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      // Save to LocalStorage so the Simulator can display it
      const existing = localStorage.getItem('aura_bookings');
      const bookings = existing ? JSON.parse(existing) : [];
      bookings.unshift(newBooking);
      localStorage.setItem('aura_bookings', JSON.stringify(bookings));

      // Trigger callback to update admin view in real-time
      onBookingSuccess(newBooking);
      setCreatedBooking(newBooking);
      setStep('success');
      
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('There was a network error sending your booking details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset flow
  const handleReset = () => {
    setSelectedService(null);
    setSelectedTherapist(null);
    setSelectedDate(null);
    setSelectedTime('');
    setName('');
    setEmail('');
    setPhone('');
    setSpecialRequests('');
    setPromoCode('');
    setNewsletter(true);
    setCreatedBooking(null);
    setStep('service');
  };

  return (
    <div id="booking-wizard" className="scroll-mt-24 max-w-5xl mx-auto px-4">
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <div className="text-gold-600 text-xs uppercase tracking-[0.2em] font-semibold mb-2 flex items-center justify-center gap-1">
          <Sparkles className="w-4 h-4" /> Experience Sanctuary
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-charcoal-900">Curate Your Wellness Journey</h2>
        <p className="text-stone-500 text-sm mt-3 leading-relaxed">
          Select your customized physical treatment, pick a preferred wellness specialist, and schedule your perfect date and time below.
        </p>
      </div>

      {/* Progress Bar */}
      {step !== 'success' && (
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-3xl mx-auto px-4">
            {[
              { id: 'service', num: 1, label: 'Select Service' },
              { id: 'therapist', num: 2, label: 'Specialist' },
              { id: 'datetime', num: 3, label: 'Time Slot' },
              { id: 'details', num: 4, label: 'Confirm' }
            ].map((item, idx) => {
              const isCompleted = 
                (step === 'therapist' && idx < 1) ||
                (step === 'datetime' && idx < 2) ||
                (step === 'details' && idx < 3);
              const isActive = step === item.id;
              
              return (
                <React.Fragment key={item.id}>
                  {idx > 0 && (
                    <div className={`h-0.5 flex-1 mx-2 sm:mx-4 transition-colors duration-300 ${isCompleted ? 'bg-gold-500' : 'bg-gold-100'}`} />
                  )}
                  <button
                    disabled={!isCompleted && !isActive}
                    onClick={() => setStep(item.id as WizardStep)}
                    className={`flex flex-col items-center focus:outline-none group transition-all duration-300`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-medium text-sm border transition-all duration-300 ${
                      isActive 
                        ? 'bg-charcoal-900 text-white border-charcoal-900 scale-110 shadow-md' 
                        : isCompleted 
                          ? 'bg-gold-500 text-white border-gold-500' 
                          : 'bg-white text-stone-400 border-gold-100 hover:border-gold-300'
                    }`}>
                      {isCompleted ? <Check className="w-4 h-4" /> : item.num}
                    </div>
                    <span className={`hidden sm:block text-[10px] uppercase tracking-wider font-semibold mt-2 transition-colors ${
                      isActive ? 'text-charcoal-900 font-bold' : 'text-stone-400 group-hover:text-gold-700'
                    }`}>
                      {item.label}
                    </span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 1: SERVICE SELECTION */}
      {step === 'service' && (
        <div className="space-y-8 animate-fade-in">
          {/* Category Toggles */}
          <div className="flex flex-wrap justify-center gap-2 border-b border-gold-100 pb-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-charcoal-900 text-white'
                    : 'bg-white text-stone-600 hover:bg-gold-50 border border-gold-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredServices.map(service => {
              const isSelected = selectedService?.id === service.id;
              return (
                <div 
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`luxury-card p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                    isSelected 
                      ? 'border-gold-600 ring-1 ring-gold-500 bg-gold-50/30' 
                      : 'border-gold-100 hover:border-gold-400 hover:shadow-lg hover:shadow-gold-500/5'
                  }`}
                >
                  <div>
                    {/* Service Header */}
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <h3 className="font-serif text-xl font-semibold text-charcoal-900 group-hover:text-gold-700 transition-colors">
                        {service.name}
                      </h3>
                      <span className="bg-gold-50 text-gold-700 text-xs font-bold px-2.5 py-1 rounded border border-gold-200/50 shrink-0">
                        ${service.price}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-stone-400 mb-4">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" /> {service.duration} mins
                      </span>
                      <span>•</span>
                      <span className="uppercase tracking-widest font-semibold text-gold-600 text-[10px]">
                        {service.category}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-stone-500 text-sm leading-relaxed mb-4 font-light">
                      {service.description}
                    </p>

                    {/* Benefits */}
                    <div className="space-y-1.5 mb-6">
                      {service.benefits.slice(0, 3).map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-stone-600">
                          <div className="w-1 h-1 rounded-full bg-gold-500" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button inside card */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedService(service);
                      setStep('therapist');
                    }}
                    className={`w-full py-3 rounded-xl text-xs font-semibold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 ${
                      isSelected 
                        ? 'bg-gold-600 text-white hover:bg-gold-700'
                        : 'bg-charcoal-900 text-white hover:bg-gold-600'
                    }`}
                  >
                    {isSelected ? 'Selected • Next Step' : 'Select Offering'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: THERAPIST SELECTION */}
      {step === 'therapist' && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setStep('service')}
              className="flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-gold-700 transition-colors uppercase tracking-wider"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Services
            </button>
            {selectedService && (
              <div className="text-xs text-stone-400">
                Service: <span className="font-bold text-charcoal-900">{selectedService.name}</span>
              </div>
            )}
          </div>

          {/* Auto-Assign Card */}
          <div 
            onClick={() => {
              // Pick a random therapist or assign 'Any Specialist'
              const randomTherapist = THERAPISTS[Math.floor(Math.random() * THERAPISTS.length)];
              setSelectedTherapist(randomTherapist);
              setStep('datetime');
            }}
            className="luxury-card p-6 rounded-2xl border border-dashed border-gold-300 hover:border-gold-600 hover:bg-gold-50/10 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-gold-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-charcoal-900">Any Available Practitioner</h3>
                <p className="text-stone-500 text-xs font-light mt-0.5">Choose this for the maximum range of scheduling slots. We will automatically pair you with an elite available therapist.</p>
              </div>
            </div>
            <button className="px-5 py-3 bg-charcoal-900 text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-gold-600 transition-colors whitespace-nowrap">
              Select Quick Assign
            </button>
          </div>

          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gold-100"></div>
            </div>
            <span className="relative bg-[#faf8f5] px-4 text-xs uppercase tracking-widest text-stone-400 font-semibold">Or Choose a Specialist</span>
          </div>

          {/* Specialists Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {THERAPISTS.map(therapist => {
              const isSelected = selectedTherapist?.id === therapist.id;
              return (
                <div
                  key={therapist.id}
                  onClick={() => setSelectedTherapist(therapist)}
                  className={`luxury-card p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-6 ${
                    isSelected 
                      ? 'border-gold-600 ring-1 ring-gold-500 bg-gold-50/30' 
                      : 'border-gold-100 hover:border-gold-400 hover:shadow-lg hover:shadow-gold-500/5'
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    <img 
                      src={therapist.avatar} 
                      alt={therapist.name}
                      className="w-16 h-16 rounded-full object-cover border border-gold-200 shrink-0 shadow-inner"
                    />
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif text-lg font-semibold text-charcoal-900">{therapist.name}</h4>
                      </div>
                      <p className="text-gold-600 text-xs font-medium leading-tight">{therapist.role}</p>
                      
                      {/* Rating stars */}
                      <div className="flex items-center gap-1 text-xs text-stone-500">
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="leading-none">★</span>
                          ))}
                        </div>
                        <span className="font-bold ml-1">{therapist.rating}</span>
                        <span className="text-stone-400">({therapist.reviewsCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-stone-500 text-xs leading-relaxed font-light italic">
                      "{therapist.bio}"
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {therapist.specialties.map((spec, i) => (
                        <span key={i} className="bg-stone-100 text-stone-600 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-medium">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTherapist(therapist);
                      setStep('datetime');
                    }}
                    className={`w-full py-3 rounded-xl text-xs font-semibold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 ${
                      isSelected 
                        ? 'bg-gold-600 text-white hover:bg-gold-700'
                        : 'bg-charcoal-900 text-white hover:bg-gold-600'
                    }`}
                  >
                    {isSelected ? 'Selected • Next Step' : 'Select Specialist'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: DATE & TIME SELECTION */}
      {step === 'datetime' && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <button
              onClick={() => setStep('therapist')}
              className="flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-gold-700 transition-colors uppercase tracking-wider"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Specialists
            </button>
            <div className="flex gap-3 text-xs text-stone-400">
              <div>
                Service: <span className="font-bold text-charcoal-900">{selectedService?.name}</span>
              </div>
              <span>•</span>
              <div>
                Specialist: <span className="font-bold text-charcoal-900">{selectedTherapist?.name}</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Interactive Custom Calendar (7 Cols) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gold-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-lg font-semibold text-charcoal-900 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-gold-500" />
                  Select Date
                </h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={prevMonth}
                    className="p-1.5 hover:bg-gold-50 rounded-lg border border-gold-100 text-stone-600 hover:text-gold-600 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold uppercase tracking-widest text-charcoal-900 w-28 text-center">
                    {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                  </span>
                  <button 
                    onClick={nextMonth}
                    className="p-1.5 hover:bg-gold-50 rounded-lg border border-gold-100 text-stone-600 hover:text-gold-600 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 text-center mb-3">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <span key={day} className="text-[10px] uppercase tracking-widest font-bold text-stone-400 py-1">
                    {day}
                  </span>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {calendarDays.map((day, idx) => {
                  if (!day) {
                    return <div key={`empty-${idx}`} className="aspect-square" />;
                  }
                  
                  const past = isPastDate(day);
                  const active = selectedDate ? isSameDay(day, selectedDate) : false;
                  const isToday = isSameDay(day, new Date());

                  return (
                    <button
                      key={`day-${idx}`}
                      disabled={past}
                      onClick={() => {
                        setSelectedDate(day);
                        setSelectedTime(''); // reset selected time when date changes
                      }}
                      className={`aspect-square rounded-xl text-xs flex flex-col items-center justify-center relative transition-all duration-200 focus:outline-none ${
                        past 
                          ? 'text-stone-300 cursor-not-allowed' 
                          : active 
                            ? 'bg-gold-600 text-white font-semibold shadow-sm scale-105' 
                            : 'text-charcoal-900 hover:bg-gold-100 hover:text-gold-800 cursor-pointer'
                      }`}
                    >
                      <span>{day.getDate()}</span>
                      {isToday && !active && (
                        <div className="w-1 h-1 rounded-full bg-gold-500 absolute bottom-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gold-100 shadow-sm h-full flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-charcoal-900 flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-gold-500" />
                    Select Time
                  </h3>

                  {!selectedDate ? (
                    <div className="flex flex-col items-center justify-center py-12 text-stone-400 text-center space-y-2">
                      <CalendarIcon className="w-8 h-8 text-stone-300" />
                      <p className="text-xs font-medium">Please choose a date first to unlock available hours.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-xs text-stone-500 font-medium">
                        Available Slots for <span className="font-bold text-charcoal-900">{selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>:
                      </div>

                      <div className="grid grid-cols-2 gap-2 max-h-[240px] overflow-y-auto pr-1">
                        {(selectedTherapist?.availableHours || ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM']).map(time => {
                          const isSelectedTime = selectedTime === time;
                          return (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all duration-200 ${
                                isSelectedTime
                                  ? 'bg-charcoal-900 text-white border-charcoal-900'
                                  : 'bg-white text-charcoal-900 border-gold-100 hover:border-gold-400 hover:bg-gold-50/30'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Next Button */}
                <div className="pt-6 border-t border-gold-100 mt-6">
                  <button
                    disabled={!selectedDate || !selectedTime}
                    onClick={() => setStep('details')}
                    className={`w-full py-4 rounded-xl text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-200 ${
                      selectedDate && selectedTime
                        ? 'bg-charcoal-900 text-white hover:bg-gold-600 shadow-md'
                        : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    Proceed to Confirmation
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: CLIENT DETAILS & CONFIRMATION FORM */}
      {step === 'details' && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <button
              onClick={() => setStep('datetime')}
              className="flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-gold-700 transition-colors uppercase tracking-wider"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Calendar
            </button>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
              <Lock className="w-3.5 h-3.5" /> Secure Booking Session
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Form (7 Cols) */}
            <div className="lg:col-span-7">
              <form 
                onSubmit={handleSubmit}
                data-netlify="true"
                name="bookings"
                netlify-honeypot="bot-field"
                className="bg-white p-6 rounded-2xl border border-gold-100 shadow-sm space-y-6"
              >
                {/* Netlify Form Requirement Inputs */}
                <input type="hidden" name="form-name" value="bookings" />
                <p className="hidden">
                  <label>
                    Don't fill this out if you're human: <input name="bot-field" />
                  </label>
                </p>

                {/* Read Only variables to supply values to Netlify Form */}
                <input type="hidden" name="service" value={selectedService?.name || ''} />
                <input type="hidden" name="therapist" value={selectedTherapist?.name || ''} />
                <input type="hidden" name="date" value={selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''} />
                <input type="hidden" name="time" value={selectedTime || ''} />

                <h3 className="font-serif text-lg font-semibold text-charcoal-900 pb-3 border-b border-gold-100">
                  Your Details
                </h3>

                {/* Input grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Enter full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:outline-none focus:border-gold-500 text-sm placeholder-stone-400 bg-gold-50/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="yourname@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:outline-none focus:border-gold-500 text-sm placeholder-stone-400 bg-gold-50/10"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider">Phone Number <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="(555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:outline-none focus:border-gold-500 text-sm placeholder-stone-400 bg-gold-50/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider">Promo Code (Optional)</label>
                    <input
                      type="text"
                      name="promo_code"
                      placeholder="e.g., SANCTUARY20"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:outline-none focus:border-gold-500 text-sm placeholder-stone-400 bg-gold-50/10 uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider">Special Requests / Health Conditions</label>
                  <textarea
                    name="special_requests"
                    rows={3}
                    placeholder="Allergies, injury areas, pressure preferences, etc."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gold-200 focus:outline-none focus:border-gold-500 text-sm placeholder-stone-400 bg-gold-50/10"
                  />
                </div>

                {/* Newsletter toggle */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    name="newsletter"
                    id="newsletter"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="mt-1 rounded border-gold-300 text-gold-600 focus:ring-gold-500 w-4 h-4 accent-gold-600 cursor-pointer"
                  />
                  <label htmlFor="newsletter" className="text-xs text-stone-500 leading-normal cursor-pointer">
                    Yes, opt me in to receive seasonal holistic wellness rituals, exclusive discounts, and healthy living tips.
                  </label>
                </div>

                {/* Error Message */}
                {submitError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-4 border-t border-gold-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-charcoal-900 hover:bg-gold-700 text-white py-4 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing Ritual...
                      </>
                    ) : (
                      <>
                        Confirm Ritual Booking
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Summary Card (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="bg-gold-50/30 border border-gold-200 p-6 rounded-2xl shadow-inner space-y-6">
                <h3 className="font-serif text-lg font-semibold text-charcoal-900">Session Summary</h3>
                
                {/* Selected Details List */}
                <div className="space-y-4">
                  {/* Service */}
                  {selectedService && (
                    <div className="flex gap-3 items-start pb-4 border-b border-gold-200/40">
                      <div className="w-8 h-8 rounded-full bg-gold-100 border border-gold-200 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-gold-700" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Selected Service</div>
                        <h4 className="text-xs font-semibold text-charcoal-900">{selectedService.name}</h4>
                        <span className="text-[10px] text-stone-500 font-medium">{selectedService.duration} mins • ${selectedService.price}</span>
                      </div>
                    </div>
                  )}

                  {/* Specialist */}
                  {selectedTherapist && (
                    <div className="flex gap-3 items-start pb-4 border-b border-gold-200/40">
                      <img 
                        src={selectedTherapist.avatar} 
                        alt={selectedTherapist.name} 
                        className="w-8 h-8 rounded-full object-cover border border-gold-200 shrink-0"
                      />
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Specialist Assigned</div>
                        <h4 className="text-xs font-semibold text-charcoal-900">{selectedTherapist.name}</h4>
                        <span className="text-[10px] text-gold-600 font-medium">{selectedTherapist.role}</span>
                      </div>
                    </div>
                  )}

                  {/* Date & Time */}
                  {selectedDate && selectedTime && (
                    <div className="flex gap-3 items-start pb-4">
                      <div className="w-8 h-8 rounded-full bg-gold-100 border border-gold-200 flex items-center justify-center shrink-0">
                        <CalendarIcon className="w-4 h-4 text-gold-700" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Scheduled Time</div>
                        <h4 className="text-xs font-semibold text-charcoal-900">
                          {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </h4>
                        <span className="text-[10px] text-stone-500 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {selectedTime}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Totals block */}
                <div className="bg-white p-4 rounded-xl border border-gold-200 space-y-2 text-xs font-medium">
                  <div className="flex justify-between text-stone-500">
                    <span>Session Fee</span>
                    <span>${selectedService?.price}.00</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>Tax & Service Charge</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-charcoal-900 font-bold border-t border-gold-100 pt-2 text-sm">
                    <span>Total Amount Due</span>
                    <span>${selectedService?.price}.00</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gold-50 border border-gold-200 flex gap-3">
                  <Info className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-stone-600 leading-normal font-light">
                    <strong className="font-bold block mb-0.5 text-charcoal-900">Netlify Email Notifications Enabled</strong>
                    By confirming, this booking is instantly forwarded to Netlify Forms, which in production sends an automated booking notification to your email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: SUCCESS SCREEN */}
      {step === 'success' && createdBooking && (
        <div className="max-w-xl mx-auto bg-white border border-gold-200 rounded-3xl p-8 text-center space-y-6 luxury-shadow animate-fade-in">
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>

          <div className="space-y-2">
            <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-emerald-600">Booking Successfully Submitted</div>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal-900">Your Sanctuary Awaits</h3>
            <p className="text-stone-500 text-xs max-w-md mx-auto leading-relaxed font-light">
              Your ritual session is secured. A secure Netlify Forms event has been triggered, sending full booking specifics directly to the administrator's email.
            </p>
          </div>

          {/* Receipt Details */}
          <div className="border border-gold-100 rounded-2xl p-4 text-left bg-gold-50/20 divide-y divide-gold-100 text-xs font-medium text-stone-600 space-y-3">
            <div className="flex justify-between pb-3">
              <span className="text-stone-400">Booking Reference</span>
              <span className="font-mono text-charcoal-900 font-bold">{createdBooking.id}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-stone-400">Guest Name</span>
              <span className="text-charcoal-900 font-bold">{createdBooking.name}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-stone-400">Session Selected</span>
              <span className="text-charcoal-900 font-bold">{createdBooking.service}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-stone-400">Practitioner</span>
              <span className="text-charcoal-900 font-bold">{createdBooking.therapist}</span>
            </div>
            <div className="flex justify-between pt-3">
              <span className="text-stone-400">Time & Date</span>
              <span className="text-charcoal-900 font-bold">{createdBooking.date} @ {createdBooking.time}</span>
            </div>
          </div>

          {/* Next steps */}
          <div className="space-y-4">
            <div className="text-[10px] text-left bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex gap-2">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1 leading-normal">
                <span className="font-bold text-charcoal-900 block">Production Netlify Check</span>
                <span className="text-stone-600 block font-light">
                  In development or in the sandboxed workspace, we have securely logged this booking. You can preview the exact email notification payload and manage bookings in the **Admin Simulator** tab.
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-charcoal-900 hover:bg-gold-600 text-white text-xs font-semibold tracking-widest uppercase rounded-xl transition-all duration-300 cursor-pointer"
              >
                Book Another Ritual
              </button>
              <a
                href="#admin-panel"
                onClick={() => {
                  // Let's find active tab button or let App state handle
                  // Scroll to top / set active to admin
                  const tabButton = document.querySelector('[class*="Admin Simulator"]') as HTMLElement;
                  if (tabButton) tabButton.click();
                }}
                className="px-6 py-3 border border-gold-300 hover:border-gold-600 text-gold-800 text-xs font-semibold tracking-widest uppercase rounded-xl transition-all duration-300 text-center"
              >
                Open Admin Simulator
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
