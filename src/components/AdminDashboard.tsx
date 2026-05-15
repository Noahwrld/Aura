import { useState, useEffect } from 'react';
import { Booking } from '../types';
import { 
  Mail, CheckCircle, XCircle, Trash2, ShieldCheck, BookOpen, Code, 
  ExternalLink, Search, Download, Calendar, User, Clock, 
  Check, Sparkles, Copy, FileText
} from 'lucide-react';

interface AdminDashboardProps {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  onDeleteBooking: (id: string) => void;
}

type TabType = 'submissions' | 'email-preview' | 'integration-guide';

export default function AdminDashboard({ bookings, setBookings, onDeleteBooking }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('submissions');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedGuideText, setCopiedGuideText] = useState(false);

  // Set default selected booking if none is selected
  useEffect(() => {
    if (bookings.length > 0 && !selectedBooking) {
      setSelectedBooking(bookings[0]);
    } else if (bookings.length === 0) {
      setSelectedBooking(null);
    }
  }, [bookings, selectedBooking]);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id: string, status: 'confirmed' | 'cancelled') => {
    const updated = bookings.map(b => {
      if (b.id === id) {
        const newB = { ...b, status };
        if (selectedBooking?.id === id) {
          setSelectedBooking(newB);
        }
        return newB;
      }
      return b;
    });
    setBookings(updated);
    localStorage.setItem('aura_bookings', JSON.stringify(updated));
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedGuideText(true);
    setTimeout(() => setCopiedGuideText(false), 2000);
  };

  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bookings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aura_bookings_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Netlify HTML configuration block
  const netlifyHTMLCode = `<!-- Hidden Netlify Form in your index.html -->
<form name="bookings" netlify netlify-honeypot="bot-field" hidden>
  <input type="hidden" name="form-name" value="bookings" />
  <input type="text" name="bot-field" />
  <input type="text" name="name" />
  <input type="email" name="email" />
  <input type="tel" name="phone" />
  <input type="text" name="service" />
  <input type="text" name="therapist" />
  <input type="text" name="date" />
  <input type="text" name="time" />
  <textarea name="special_requests"></textarea>
  <input type="text" name="promo_code" />
  <input type="checkbox" name="newsletter" />
</form>`;

  const reactAJAXCode = `// Submitting to Netlify via AJAX in React
const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const body = new URLSearchParams(formData).toString();
  
  await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body
  });
};`;

  return (
    <div id="admin-panel" className="scroll-mt-24 max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-gold-100">
        <div>
          <div className="text-gold-600 text-xs uppercase tracking-[0.2em] font-semibold mb-2 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Control Panel
          </div>
          <h2 className="text-3xl font-serif font-semibold text-charcoal-900">Netlify Forms Manager</h2>
          <p className="text-stone-500 text-xs mt-1.5 font-light">
            Monitor incoming submissions, check how the email payload looks, and configure your production Netlify settings.
          </p>
        </div>

        {/* Tab controls */}
        <div className="flex bg-white border border-gold-100 rounded-full p-1 shadow-sm shrink-0 self-stretch md:self-auto">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'submissions'
                ? 'bg-charcoal-900 text-white'
                : 'text-stone-600 hover:bg-gold-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Bookings ({bookings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('email-preview')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'email-preview'
                ? 'bg-charcoal-900 text-white'
                : 'text-stone-600 hover:bg-gold-50'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Mock</span>
          </button>
          <button
            onClick={() => setActiveTab('integration-guide')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'integration-guide'
                ? 'bg-charcoal-900 text-white'
                : 'text-stone-600 hover:bg-gold-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Setup Guide</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ACTIVE SUBMISSIONS MANAGER */}
      {activeTab === 'submissions' && (
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left list (7 columns) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Search and filters */}
            <div className="bg-white p-4 rounded-2xl border border-gold-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search guest name, email, ritual..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gold-100 focus:outline-none focus:border-gold-400 text-xs bg-gold-50/5 placeholder-stone-400"
                />
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-gold-100 text-xs bg-white text-stone-600 focus:outline-none focus:border-gold-400 flex-1 sm:flex-none font-medium"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={downloadJSON}
                  disabled={bookings.length === 0}
                  className="p-2.5 bg-gold-50 border border-gold-200 text-gold-700 rounded-xl hover:bg-gold-100 transition-colors shrink-0 flex items-center gap-1.5 text-xs font-semibold"
                  title="Export JSON"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
              <div className="bg-white border border-gold-100 border-dashed rounded-2xl p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center mx-auto">
                  <Calendar className="w-5 h-5 text-gold-500 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-charcoal-900">No Submissions Found</h4>
                  <p className="text-stone-500 text-xs mt-1 max-w-xs mx-auto font-light leading-relaxed">
                    {bookings.length === 0 
                      ? 'Submit your first booking in the scheduler above. It will register here immediately.' 
                      : 'Adjust your search queries or filters to view remaining logs.'
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
                {filteredBookings.map(booking => {
                  const isSelected = selectedBooking?.id === booking.id;
                  return (
                    <div
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className={`bg-white p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start justify-between gap-4 relative overflow-hidden ${
                        isSelected 
                          ? 'border-gold-600 ring-1 ring-gold-500' 
                          : 'border-gold-100 hover:border-gold-300'
                      }`}
                    >
                      <div className="space-y-2 flex-1">
                        {/* Card Top Header */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-xs text-charcoal-900">{booking.name}</span>
                          <span className="text-[9px] text-stone-400 font-mono bg-stone-50 px-1.5 py-0.5 rounded border border-stone-100">
                            {booking.id}
                          </span>
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border shrink-0 ${
                            booking.status === 'confirmed' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                              : 'bg-rose-50 text-rose-600 border-rose-100'
                          }`}>
                            {booking.status}
                          </span>
                        </div>

                        {/* Details info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-stone-500 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                            <span className="truncate">{booking.service}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                            <span className="truncate">{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                            <span className="truncate">{booking.therapist}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                            <span>{booking.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteBooking(booking.id);
                        }}
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all shrink-0 cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right detailed pane (5 columns) */}
          <div className="lg:col-span-5">
            {selectedBooking ? (
              <div className="bg-white border border-gold-100 rounded-2xl p-6 shadow-sm space-y-6">
                {/* Guest Title Block */}
                <div className="pb-4 border-b border-gold-100 space-y-1.5">
                  <div className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Active Submission Details</div>
                  <h3 className="font-serif text-2xl font-semibold text-charcoal-900">{selectedBooking.name}</h3>
                  <p className="text-stone-500 text-xs font-mono font-light">{selectedBooking.email}</p>
                </div>

                {/* Full Detail Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs font-medium text-stone-600">
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase tracking-wider block">Guest Phone</span>
                    <span className="text-charcoal-900 mt-0.5 block">{selectedBooking.phone}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase tracking-wider block">Promo Code Used</span>
                    <span className="text-charcoal-900 mt-0.5 block font-mono">{selectedBooking.promoCode || 'None'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-stone-400 text-[10px] uppercase tracking-wider block">Selected Service</span>
                    <span className="text-charcoal-900 mt-0.5 block text-sm font-bold">{selectedBooking.service}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase tracking-wider block">Specialist</span>
                    <span className="text-charcoal-900 mt-0.5 block font-bold text-gold-700">{selectedBooking.therapist}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase tracking-wider block">Date & Time</span>
                    <span className="text-charcoal-900 mt-0.5 block font-bold">{selectedBooking.time} • {selectedBooking.date}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-stone-400 text-[10px] uppercase tracking-wider block">Special Requests</span>
                    <p className="text-stone-500 mt-1 p-3 bg-gold-50/30 border border-gold-100 rounded-xl font-light leading-relaxed italic">
                      {selectedBooking.specialRequests || 'No custom request specified.'}
                    </p>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase tracking-wider block">Newsletter Opt-in</span>
                    <span className="text-charcoal-900 mt-0.5 block font-bold">{selectedBooking.newsletter ? 'Yes (Opted In)' : 'No'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase tracking-wider block">Received At</span>
                    <span className="text-stone-400 mt-0.5 block font-mono text-[10px]">
                      {new Date(selectedBooking.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gold-100 space-y-3">
                  <div className="flex gap-2">
                    {selectedBooking.status === 'cancelled' ? (
                      <button
                        onClick={() => updateStatus(selectedBooking.id, 'confirmed')}
                        className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border border-emerald-200 flex items-center justify-center gap-2 transition-colors"
                      >
                        <Check className="w-4 h-4" /> Confirm Booking
                      </button>
                    ) : (
                      <button
                        onClick={() => updateStatus(selectedBooking.id, 'cancelled')}
                        className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border border-rose-200 flex items-center justify-center gap-2 transition-colors"
                      >
                        <XCircle className="w-4 h-4" /> Cancel Booking
                      </button>
                    )}
                  </div>

                  {/* Raw POST Payload details */}
                  <div className="p-4 rounded-2xl border border-gold-200 bg-gold-50/10">
                    <div className="text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-2 flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-gold-600" /> Netlify Post Payload
                    </div>
                    <div className="bg-charcoal-900 text-stone-300 p-3 rounded-xl font-mono text-[10px] overflow-x-auto whitespace-pre max-h-[120px]">
{`POST / HTTP/1.1
Host: aura-wellness.netlify.app
Content-Type: application/x-www-form-urlencoded

form-name=bookings
&bot-field=
&name=${encodeURIComponent(selectedBooking.name)}
&email=${encodeURIComponent(selectedBooking.email)}
&phone=${encodeURIComponent(selectedBooking.phone)}
&service=${encodeURIComponent(selectedBooking.service)}
&therapist=${encodeURIComponent(selectedBooking.therapist)}
&date=${encodeURIComponent(selectedBooking.date)}
&time=${encodeURIComponent(selectedBooking.time)}
&special_requests=${encodeURIComponent(selectedBooking.specialRequests || '')}
&promo_code=${encodeURIComponent(selectedBooking.promoCode || '')}
&newsletter=${selectedBooking.newsletter ? 'yes' : 'no'}`}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gold-100 rounded-2xl p-12 text-center text-stone-400 space-y-2">
                <User className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="text-xs">Select a submission card on the left to review full booking payload specifics.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: EMAIL NOTIFICATION PREVIEW MOCK */}
      {activeTab === 'email-preview' && (
        <div className="max-w-4xl mx-auto bg-white border border-gold-100 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-gold-100 pb-4">
            <h3 className="font-serif text-lg font-semibold text-charcoal-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-gold-500" />
              Netlify Email Notification Mockup
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              This is exactly how Netlify formats and emails form submissions directly to your inbox when a client reserves a ritual session.
            </p>
          </div>

          {selectedBooking ? (
            <div className="bg-stone-100 rounded-2xl p-4 md:p-6 border border-stone-200 font-sans max-w-2xl mx-auto">
              {/* Simulated Email Headers */}
              <div className="border-b border-stone-200 pb-4 mb-6 text-xs font-medium text-stone-500 space-y-2">
                <div>
                  <strong className="text-stone-800">From:</strong> Netlify Forms &lt;no-reply@netlify.com&gt;
                </div>
                <div>
                  <strong className="text-stone-800">To:</strong> administrator@aurawellness.com <span className="text-[10px] text-gold-600 bg-gold-50 px-1.5 py-0.5 rounded border border-gold-100">Verified Recipient</span>
                </div>
                <div>
                  <strong className="text-stone-800">Subject:</strong> New submission on form "bookings" - {selectedBooking.name}
                </div>
                <div>
                  <strong className="text-stone-800">Date:</strong> {new Date(selectedBooking.createdAt).toUTCString()}
                </div>
              </div>

              {/* Email Content */}
              <div className="bg-white rounded-xl p-6 shadow-inner space-y-6 border border-stone-200/55 text-sm text-stone-700 leading-relaxed">
                <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
                  <div className="w-8 h-8 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-gold-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal-900 text-base">Aura Wellness Booking Alert</h4>
                    <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Netlify Webhook Submissions</span>
                  </div>
                </div>

                <p className="font-light">
                  Hello, you have received a new client booking submission on <strong className="font-semibold text-charcoal-900">aura-wellness.netlify.app</strong>. Below are the detailed scheduling credentials:
                </p>

                <table className="w-full border-collapse text-xs font-medium text-stone-600">
                  <tbody>
                    {[
                      { label: 'Guest Name', val: selectedBooking.name },
                      { label: 'Email Address', val: selectedBooking.email, fontClass: 'font-mono text-gold-700' },
                      { label: 'Phone Number', val: selectedBooking.phone },
                      { label: 'Selected Ritual', val: selectedBooking.service, isBold: true },
                      { label: 'Specialist Assigned', val: selectedBooking.therapist },
                      { label: 'Scheduled Date', val: selectedBooking.date },
                      { label: 'Scheduled Time', val: selectedBooking.time, isBold: true },
                      { label: 'Promo Code Used', val: selectedBooking.promoCode || 'N/A' },
                      { label: 'Special Requests', val: selectedBooking.specialRequests || 'None' },
                      { label: 'Newsletter Opt-in', val: selectedBooking.newsletter ? 'Yes' : 'No' }
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-stone-50' : ''}>
                        <td className="py-3 px-4 font-bold text-stone-400 uppercase tracking-wider w-1/3">{row.label}</td>
                        <td className={`py-3 px-4 text-stone-800 ${row.isBold ? 'font-bold text-charcoal-900' : ''} ${row.fontClass || ''}`}>
                          {row.val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pt-6 border-t border-stone-100 flex flex-wrap gap-4 items-center justify-between text-xs text-stone-400">
                  <span>Netlify Site ID: 2be6b8b2-976f-46a8</span>
                  <a 
                    href="https://app.netlify.com/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-gold-600 hover:text-gold-700 font-bold flex items-center gap-1 transition-colors"
                  >
                    View on Netlify Forms <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 rounded-2xl p-12 text-center text-stone-400 space-y-3 border border-dashed border-gold-200">
              <Mail className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-xs">Submit a guest booking first in the scheduler above to generate the notification email preview.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INTEGRATION GUIDE */}
      {activeTab === 'integration-guide' && (
        <div className="max-w-4xl mx-auto bg-white border border-gold-100 rounded-2xl p-6 shadow-sm space-y-8">
          <div className="border-b border-gold-100 pb-4">
            <h3 className="font-serif text-lg font-semibold text-charcoal-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold-500" />
              Netlify Email Notifications Integration Guide
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Follow these exact steps to successfully deploy this project and enable direct automated email alerts of bookings on Netlify.
            </p>
          </div>

          {/* Guide Steps */}
          <div className="space-y-6 text-xs font-medium text-stone-600">
            {/* Step 1 */}
            <div className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-gold-100 border border-gold-200 flex items-center justify-center font-bold text-gold-700 text-[10px] shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-2 flex-1 leading-normal">
                <h4 className="text-charcoal-900 font-bold text-sm">Place Hidden HTML Form in root <code className="bg-stone-100 px-1.5 py-0.5 rounded text-gold-700 text-[10px]">index.html</code></h4>
                <p className="font-light">
                  Because Vite dynamic frameworks render standard pages via JS, Netlify's build bots need a static HTML form hook to discover and register forms. We have already added a fully mapped hidden form in this project's <code className="bg-stone-100 px-1 rounded">index.html</code>.
                </p>
                <div className="relative">
                  <pre className="bg-charcoal-900 text-stone-300 p-4 rounded-xl font-mono text-[10px] overflow-x-auto max-h-[180px] whitespace-pre">
                    {netlifyHTMLCode}
                  </pre>
                  <button
                    onClick={() => handleCopyCode(netlifyHTMLCode)}
                    className="absolute right-3 top-3 p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 text-stone-300 transition-colors cursor-pointer flex items-center gap-1 text-[9px] uppercase font-bold"
                  >
                    {copiedGuideText ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedGuideText ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-gold-100 border border-gold-200 flex items-center justify-center font-bold text-gold-700 text-[10px] shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-2 flex-1 leading-normal">
                <h4 className="text-charcoal-900 font-bold text-sm">Send AJAX Post Payload in React</h4>
                <p className="font-light">
                  During the submission step, our React form makes a post query using standard application headers, satisfying Netlify Forms criteria.
                </p>
                <div className="relative">
                  <pre className="bg-charcoal-900 text-stone-300 p-4 rounded-xl font-mono text-[10px] overflow-x-auto whitespace-pre">
                    {reactAJAXCode}
                  </pre>
                  <button
                    onClick={() => handleCopyCode(reactAJAXCode)}
                    className="absolute right-3 top-3 p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 text-stone-300 transition-colors cursor-pointer flex items-center gap-1 text-[9px] uppercase font-bold"
                  >
                    {copiedGuideText ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedGuideText ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-gold-100 border border-gold-200 flex items-center justify-center font-bold text-gold-700 text-[10px] shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-1.5 flex-1 leading-normal">
                <h4 className="text-charcoal-900 font-bold text-sm">Deploy Site on Netlify</h4>
                <p className="font-light">
                  Push your local code repository to GitHub, GitLab, or Bitbucket. Connect it to your Netlify account, use the default Vite preset build command (<code className="bg-stone-100 px-1 rounded">npm run build</code>), and set build directory as <code className="bg-stone-100 px-1 rounded">dist</code>. Deploy!
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-gold-100 border border-gold-200 flex items-center justify-center font-bold text-gold-700 text-[10px] shrink-0 mt-0.5">
                4
              </div>
              <div className="space-y-1.5 flex-1 leading-normal">
                <h4 className="text-charcoal-900 font-bold text-sm">Configure Email Notifications in Dashboard</h4>
                <p className="font-light">
                  Once deployed successfully:
                </p>
                <ol className="list-decimal pl-4 space-y-1 text-stone-500 font-light">
                  <li>Navigate to your site's settings page in your Netlify Dashboard.</li>
                  <li>Select <strong className="font-bold text-stone-700">Site configuration &gt; Forms &gt; Form notifications</strong>.</li>
                  <li>Click <strong className="font-bold text-stone-700">Add notification</strong> and select <strong className="font-bold text-stone-700">Email notification</strong> from the dropdown.</li>
                  <li>Choose <strong className="font-bold text-stone-700">bookings</strong> as the form to listen to.</li>
                  <li>Enter your personal or business email address and click <strong className="font-bold text-stone-700">Save</strong>.</li>
                </ol>
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 font-medium leading-relaxed flex gap-2 max-w-xl">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span>Your email alerts are fully active! Every single booking now triggers a detailed dashboard alert and routes instantly to your designated email inbox.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
