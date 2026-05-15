import { Service, Therapist } from './types';

export const SERVICES: Service[] = [
  {
    id: 'deep-tissue',
    name: 'Aura Deep Tissue Release',
    category: 'massage',
    duration: 75,
    price: 160,
    description: 'Targeted deep muscle therapy designed to release chronic tension, improve mobility, and promote structural re-alignment. Recommended for athletes or those seeking intense physical relief.',
    image: '/images/treatment-massage.jpg',
    benefits: ['Relieves chronic pain', 'Improves blood circulation', 'Reduces blood pressure', 'Enhances muscle recovery']
  },
  {
    id: 'hot-stone',
    name: 'Himalayan Warm Stone Ritual',
    category: 'massage',
    duration: 90,
    price: 185,
    description: 'Heated basalt stones coated in organic jojoba oil are glided smoothly over key energy pathways to melt away stress, improve flow, and deeply soothe both mind and body.',
    image: '/images/treatment-massage.jpg',
    benefits: ['Deep muscle relaxation', 'Promotes better sleep quality', 'Reduces anxiety and stress', 'Releases toxins']
  },
  {
    id: 'swedish-aroma',
    name: 'Zen Aromatherapy Swedish Massage',
    category: 'massage',
    duration: 60,
    price: 130,
    description: 'A gentle, rhythmic massage using custom-blended therapeutic essential oils to calm the nervous system, enhance circulation, and induce a state of pure, blissful tranquility.',
    image: '/images/treatment-massage.jpg',
    benefits: ['Calms nervous system', 'Enhances skin hydration', 'Boosts mood and well-being', 'Improves joint flexibility']
  },
  {
    id: 'glow-facial',
    name: 'Radiant Botanicals Lift & Glow',
    category: 'facial',
    duration: 60,
    price: 145,
    description: 'An active botanical facial combining natural enzymes, micro-exfoliation, and oxygen infusion to restore hydration, boost collagen production, and deliver an instantaneous, luminous glow.',
    image: '/images/treatment-facial.jpg',
    benefits: ['Deep skin hydration', 'Reduces fine lines', 'Brightens skin complexion', 'Improves cellular renewal']
  },
  {
    id: 'detox-sculpt',
    name: 'Sculpting Gua Sha Detox Treatment',
    category: 'facial',
    duration: 75,
    price: 170,
    description: 'Traditional Chinese Gua Sha crystal scraping techniques are combined with advanced lymphatic drainage to reduce puffiness, sculpt facial contours, and detoxify stressed skin.',
    image: '/images/treatment-facial.jpg',
    benefits: ['Sculpts facial contours', 'Reduces facial puffiness', 'Promotes lymphatic drainage', 'Boosts natural collagen']
  },
  {
    id: 'sound-bath',
    name: 'Vibrational Sound Bath & Meditation',
    category: 'mindbody',
    duration: 60,
    price: 95,
    description: 'An immersive audio healing session where Himalayan singing bowls, gongs, and tuning forks create therapeutic frequencies to balance brain waves, calm anxiety, and restore cellular harmony.',
    image: '/images/treatment-yoga.jpg',
    benefits: ['Reduces acute anxiety', 'Balances brain hemispheres', 'Clears mental clutter', 'Deep meditation state']
  },
  {
    id: 'private-yoga',
    name: 'Soma Private Yoga & Breathwork',
    category: 'mindbody',
    duration: 75,
    price: 120,
    description: 'One-on-one curated yogic journey blending Restorative or Vinyasa yoga with somatic pranayama (breathwork) to align physical energy, release emotional blocks, and enhance longevity.',
    image: '/images/treatment-yoga.jpg',
    benefits: ['Personalized postures', 'Core strength alignment', 'Mindfulness and breath control', 'Relieves lower back pressure']
  },
  {
    id: 'royal-detox',
    name: 'The Empress Royal Detoxing Ritual',
    category: 'rituals',
    duration: 120,
    price: 250,
    description: 'The ultimate body and face replenishment. Features a mineral-rich Himalayan salt scrub, a warm seaweed body wrap, a customized express facial, and an intensive scalp massage.',
    image: '/images/spa-hero.jpg',
    benefits: ['Full body exfoliation', 'Intense cellular detoxification', 'Complete head-to-toe glow', 'Deep mental reset']
  }
];

export const THERAPISTS: Therapist[] = [
  {
    id: 'elena-rostova',
    name: 'Dr. Elena Rostova',
    role: 'Master Esthetician & Skin Alchemist',
    rating: 4.9,
    reviewsCount: 142,
    specialties: ['Botanical Facials', 'Gua Sha Sculpting', 'Somatic Face Massage'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    bio: 'With over 12 years of experience in holistic cosmetology and dermatology, Elena is renowned for her personalized organic skin regimens that restore natural vibrancy.',
    availableHours: ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM']
  },
  {
    id: 'marcus-chen',
    name: 'Marcus Chen, LMT',
    role: 'Senior Neuromuscular Therapist',
    rating: 5.0,
    reviewsCount: 218,
    specialties: ['Deep Tissue Release', 'Trigger Point Therapy', 'Sports Rehab'],
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    bio: 'Marcus blends eastern energetic traditions with modern orthopaedic massage therapy to help clients overcome chronic muscle tightness, physical fatigue, and sports injuries.',
    availableHours: ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM']
  },
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    role: 'Vibrational Sound Healer & Yoga Guide',
    rating: 4.8,
    reviewsCount: 98,
    specialties: ['Sound Bath Therapy', 'Breathwork Coaching', 'Restorative Yoga'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    bio: 'Sarah believes in the power of sound frequencies and somatic breathing. She guides seekers back to their natural rhythm, dissolving stress and emotional tension.',
    availableHours: ['09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM']
  },
  {
    id: 'david-vance',
    name: 'David Vance, LMT',
    role: 'Aromatherapist & Holistic Practitioner',
    rating: 4.9,
    reviewsCount: 165,
    specialties: ['Himalayan Stone Rituals', 'Swedish Flow Massage', 'Lymphatic Drainage'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'David is a passionate healer focused on total sensory wellness. His sessions combine botanical chemistry with warm touch therapy to melt away neurological stress.',
    availableHours: ['09:00 AM', '10:30 AM', '12:30 PM', '03:00 PM', '05:30 PM']
  }
];

export const FAQS = [
  {
    question: 'How does the Netlify Form booking system send emails?',
    answer: 'Netlify Forms registers forms found in standard HTML files during deployment. When a client submits our booking form, the submission is securely processed by Netlify. Netlify then triggers an automated notification email to you, the administrator, with the complete booking details (Name, Service, Therapist, Date, Time, etc.).'
  },
  {
    question: 'Can clients receive a confirmation email too?',
    answer: 'Yes! Through Netlify Dashboard > Form Settings, you can connect a third-party service like Zapier, Make, or standard Netlify serverless functions to instantly trigger dynamic confirmation emails back to the client.'
  },
  {
    question: 'Is it possible to sync bookings to Google Calendar?',
    answer: 'Absolutely. Using Netlify\'s Webhook integration, you can easily route submissions to Zapier. From Zapier, you can instantly create an event on your Google Calendar or Outlook Calendar with a single click.'
  },
  {
    question: 'What should I do to deploy this application on Netlify?',
    answer: 'Simply connect your GitHub repository to Netlify, select Vite as your build environment, and deploy! We have integrated a beautiful "Admin Panel" with step-by-step deployment instructions in this app, so you can configure email notifications in seconds.'
  },
  {
    question: 'Can I reschedule or cancel my wellness booking?',
    answer: 'Yes. In our actual operational model, clients can follow the link in their notification email or contact our front desk at least 24 hours in advance to reschedule or cancel without penalty.'
  }
];

export const TESTIMONIALS = [
  {
    name: 'Evelyn R.',
    role: 'Executive Creative Director',
    rating: 5,
    quote: 'The Himalayan Warm Stone Massage with David was deeply restorative. The scheduling was effortless, and I received my confirmation email within seconds. A truly professional experience.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
  },
  {
    name: 'Julian M.',
    role: 'Co-Founder, Venture Capital',
    rating: 5,
    quote: 'Finding a certified esthetician who understands Gua Sha is rare. Dr. Elena is a true artist. I leave looking younger and feeling infinitely lighter every single visit.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
  },
  {
    name: 'Dr. Clara Vance',
    role: 'Holistic Nutritionist',
    rating: 5,
    quote: 'I regularly recommend Aura Wellness to my clients. The quality of their therapists is unmatched. Their digital booking system is seamless and extremely easy to navigate.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
  }
];
