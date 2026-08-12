import { useState, useEffect, useRef, useMemo } from "react";

// ── DESIGN SYSTEM TOKENS ──────────────────────────────────────────────────────
const C = {
  bg: "#0D0A08",
  bg2: "#1A0F0A",
  bg3: "#2D1810",
  gold: "#C9A96E",
  goldDark: "#A07840",
  goldFaint: "#C9A96E18",
  text: "#F5EFE6",
  textMuted: "#8B7355",
  textFaint: "#6B5440",
  green: "#4CAF50",
  greenFaint: "#4CAF5022",
  red: "#E57373",
  redFaint: "#E5737322",
  orange: "#FFB74D",
  orangeFaint: "#FFB74D22",
  blue: "#64B5F6",
  blueFaint: "#64B5F622",
  border: "#2D1810",
  borderGold: "#C9A96E44",
};

// ── INITIAL DATA DATASETS ──────────────────────────────────────────────────────
const INIT_THERAPISTS = [
  { id: 1, name: "Bharath Kumar", specialty: "Deep Tissue & Swedish", rating: 4.9, reviews: 212, gender: "male", available: true, photo: "👨‍⚕️", phone: "+91 78923 89080", experience: "7 years", certifications: "ITEC Certified, Ayurvedic Specialist" },
  { id: 2, name: "Rajan Pillai", specialty: "Hot Stone & Balinese", rating: 4.8, reviews: 134, gender: "male", available: true, photo: "👨‍⚕️", phone: "+91 91234 56789", experience: "5 years", certifications: "CIBTAC Certified" },
];

const INIT_SERVICES = [
  { id: 1, name: "Swedish Relaxation", duration: "60 min", price: 1499, emoji: "🌸", desc: "Full body stress relief with warm oils", category: "Massage", active: true, goal: "Relax" },
  { id: 2, name: "Deep Tissue", duration: "90 min", price: 1999, emoji: "💆‍♀️", desc: "Targets muscle tension & chronic pain", category: "Massage", active: true, goal: "Relieve muscle tension" },
  { id: 3, name: "Aromatherapy", duration: "75 min", price: 1799, emoji: "🌿", desc: "Essential oils for mind-body harmony", category: "Massage", active: true, goal: "Stress relief" },
  { id: 4, name: "Hot Stone Ritual", duration: "90 min", price: 2299, emoji: "🪨", desc: "Volcanic stones melt away deep tension", category: "Massage", active: true, goal: "Relieve muscle tension" },
  { id: 5, name: "Balinese Ritual", duration: "120 min", price: 2799, emoji: "🌺", desc: "Ancient Balinese healing tradition", category: "Body Treatment", active: true, goal: "Refresh" },
  { id: 6, name: "Couple's Bliss", duration: "90 min", price: 3499, emoji: "✨", desc: "Private room for two, shared serenity", category: "Couple Experience", active: true, goal: "Couples experience" },
];

const INIT_MEMBERSHIPS = [
  { id: "essential", name: "Essential Tier", price: 1299, period: "month", perks: ["1 Session / Month", "10% Off Additional Services", "Birthday Benefit"], badge: "Popular" },
  { id: "premium", name: "Premium Tier", price: 2399, period: "month", perks: ["2 Sessions / Month", "15% Off Additional Services", "Priority Slot Allocation", "Complimentary Aromatherapy Upgrade"], badge: "Best Value" },
  { id: "elite", name: "Elite Tier", price: 4499, period: "month", perks: ["4 Sessions / Month", "20% Off Additional Services", "Couple Benefits", "24/7 VIP Concierge"], badge: "VIP" },
];

const INIT_BOOKINGS = [
  { id: 1, customer: "Sneha K.", service: "Swedish Relaxation", therapist: "Bharath Kumar", date: "Today", slot: "10:00 AM", amount: 1499, status: "completed", phone: "+91 99887 66554" },
  { id: 2, customer: "Divya M.", service: "Hot Stone Ritual", therapist: "Rajan Pillai", date: "Today", slot: "2:30 PM", amount: 2299, status: "confirmed", phone: "+91 98765 11223" },
];

const INIT_SETTINGS = {
  spaName: "Zuidara Spa",
  tagline: "Your Time. Your Wellness. · Bengaluru",
  phone: "+91 78923 89080",
  email: "hello@zuidaraspa.in",
  address: "Indiranagar, Bengaluru, Karnataka",
  instagram: "@zuidaraspa",
  whatsapp: "917892389080",
  makeWebhookUrl: "",
  firstTimeDiscount: 20,
  referralCredit: 500,
  openTime: "10:00 AM",
  closeTime: "8:00 PM",
  currency: "₹",
  aboutText: "Zuidara is Bengaluru's premier home spa platform. Certified therapists deliver personalized wellness sessions directly to your residence.",
};

const SLOTS = ["10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM", "7:00 PM"];

// ── REUSABLE UI COMPONENTS ────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const map = { 
    completed: [C.green, C.greenFaint, "✓ Completed"], 
    confirmed: [C.blue, C.blueFaint, "● Confirmed"], 
    pending: [C.orange, C.orangeFaint, "◌ Pending"], 
    cancelled: [C.red, C.redFaint, "✕ Cancelled"] 
  };
  const [col, bg, label] = map[status] || [C.textMuted, C.bg3, status];
  return <span style={{ fontSize: 10, color: col, background: bg, padding: "3px 10px", borderRadius: 12, letterSpacing: 0.8, fontWeight: 600 }}>{label}</span>;
};

const GoldDivider = () => <div style={{ width: 48, height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, margin: "14px auto" }} />;

const SectionTitle = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
    <div style={{ flex: 1, height: 1, background: C.border }} />
    <span style={{ fontSize: 10, color: C.textMuted, letterSpacing: 3, textTransform: "uppercase", whiteSpace: "nowrap" }}>{children}</span>
    <div style={{ flex: 1, height: 1, background: C.border }} />
  </div>
);

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, marginBottom: 12, ...style }}>{children}</div>
);

const GoldBtn = ({ children, onClick, style = {}, small = false }) => (
  <button onClick={onClick} style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`, color: C.bg, border: "none", padding: small ? "8px 16px" : "13px 24px", borderRadius: 3, fontSize: small ? 11 : 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", ...style }}>{children}</button>
);

const GhostBtn = ({ children, onClick, style = {}, small = false }) => (
  <button onClick={onClick} style={{ background: "transparent", color: C.gold, border: `1px solid ${C.gold}`, padding: small ? "7px 14px" : "12px 24px", borderRadius: 3, fontSize: small ? 11 : 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", ...style }}>{children}</button>
);

const Input = ({ label, value, onChange, type = "text", placeholder = "" }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, color: C.text, padding: "10px 12px", borderRadius: 4, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
  </div>
);

// ── MAIN APPLICATION ──────────────────────────────────────────────────────────
export default function ZuidaraSpa() {
  // State Initialization with LocalStorage Persistence
  const [therapists, setTherapists] = useState(() => JSON.parse(localStorage.getItem("zuidara_therapists")) || INIT_THERAPISTS);
  const [services, setServices] = useState(() => JSON.parse(localStorage.getItem("zuidara_services")) || INIT_SERVICES);
  const [bookings, setBookings] = useState(() => JSON.parse(localStorage.getItem("zuidara_bookings")) || INIT_BOOKINGS);
  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem("zuidara_settings")) || INIT_SETTINGS);

  useEffect(() => { localStorage.setItem("zuidara_therapists", JSON.stringify(therapists)); }, [therapists]);
  useEffect(() => { localStorage.setItem("zuidara_services", JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem("zuidara_bookings", JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem("zuidara_settings", JSON.stringify(settings)); }, [settings]);

  // View Navigation
  const [view, setView] = useState("home"); // home | book | recommend | membership | giftcards | admin
  const [adminSection, setAdminSection] = useState("dashboard");

  // Booking Flow State
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookStep, setBookStep] = useState(1);
  const [bookingDone, setBookingDone] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // "Not Sure What to Book?" Feature State
  const [quizGoal, setQuizGoal] = useState("");
  const [quizTime, setQuizTime] = useState("");
  const [recommendedTreatment, setRecommendedTreatment] = useState(null);

  // Gift Card State
  const [giftAmount, setGiftAmount] = useState("2500");
  const [giftRecipient, setGiftRecipient] = useState("");

  // Toast & Social Proof State
  const [toast, setToast] = useState(null);
  const [recentPopup, setRecentPopup] = useState(null);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPin, setAdminPin] = useState("");

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 2800); };

  // Simulated Social Proof Popups
  useEffect(() => {
    const notices = [
      "Ananya from Indiranagar booked Swedish Relaxation 🌸",
      "Priya from HSR Layout requested Deep Tissue 💆‍♀️",
      "Sneha from Koramangala claimed 20% Off Gift Card 🎁",
    ];
    const interval = setInterval(() => {
      setRecentPopup(notices[Math.floor(Math.random() * notices.length)]);
      setTimeout(() => setRecentPopup(null), 4000);
    }, 16000);
    return () => clearInterval(interval);
  }, []);

  const selectedServiceObj = services.find(s => s.id === selectedService);
  const selectedTherapistObj = therapists.find(t => t.id === selectedTherapist);

  // Recommendation Engine Logic
  const handleRecommendation = () => {
    if (!quizGoal) return showToast("Select your wellness goal", "error");
    const found = services.find(s => s.goal === quizGoal) || services[0];
    setRecommendedTreatment(found);
  };

  // ── RENDER HOMEPAGE ──────────────────────────────────────────────────────────
  const renderHome = () => (
    <div style={{ padding: "0 0 32px" }}>
      {/* Hero Section */}
      <div style={{ background: `linear-gradient(180deg, ${C.bg2} 0%, ${C.bg} 100%)`, padding: "36px 24px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>🌸</div>
        <h1 style={{ fontSize: 32, fontWeight: 300, margin: 0, letterSpacing: 1, lineHeight: 1.2 }}>
          Your time.<br /><em style={{ color: C.gold }}>Your wellness.</em>
        </h1>
        <GoldDivider />
        <p style={{ fontSize: 11, color: C.textMuted, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 24px" }}>{settings.tagline}</p>
        <GoldBtn onClick={() => { setView("book"); setBookStep(1); }} style={{ width: "100%", marginBottom: 10 }}>Book An Appointment</GoldBtn>
        <GhostBtn onClick={() => setView("recommend")} style={{ width: "100%" }}>✨ Not Sure What To Book?</GhostBtn>
      </div>

      {/* Quick Booking Search Bar Widget */}
      <div style={{ padding: "0 20px", marginTop: -10 }}>
        <Card style={{ borderColor: C.borderGold, background: C.bg3 }}>
          <div style={{ fontSize: 10, color: C.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Find Your Wellness Moment</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 9, color: C.textFaint, textTransform: "uppercase", marginBottom: 4 }}>Goal</div>
              <select style={{ width: "100%", background: C.bg, color: C.text, border: `1px solid ${C.border}`, padding: 8, borderRadius: 4, fontSize: 11 }}>
                <option>Relaxation</option>
                <option>Muscle Tension</option>
                <option>Stress Relief</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: 9, color: C.textFaint, textTransform: "uppercase", marginBottom: 4 }}>Location</div>
              <select style={{ width: "100%", background: C.bg, color: C.text, border: `1px solid ${C.border}`, padding: 8, borderRadius: 4, fontSize: 11 }}>
                <option>Indiranagar</option>
                <option>Koramangala</option>
                <option>HSR Layout</option>
                <option>Whitefield</option>
              </select>
            </div>
          </div>
          <GoldBtn small onClick={() => { setView("book"); setBookStep(1); }} style={{ width: "100%" }}>Find Available Slots →</GoldBtn>
        </Card>
      </div>

      {/* Featured Treatments */}
      <div style={{ padding: "16px 20px 0" }}>
        <SectionTitle>Featured Treatments</SectionTitle>
        {services.filter(s => s.active).slice(0, 4).map(s => (
          <Card key={s.id} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{ fontSize: 28 }}>{s.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{s.name}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>{s.desc}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: C.textFaint }}>{s.duration}</span>
                <span style={{ fontSize: 15, color: C.gold, fontWeight: 700 }}>₹{s.price.toLocaleString()}</span>
              </div>
            </div>
            <GoldBtn small onClick={() => { setSelectedService(s.id); setView("book"); setBookStep(2); }}>Book</GoldBtn>
          </Card>
        ))}
      </div>

      {/* Membership Teaser */}
      <div style={{ padding: "16px 20px 0" }}>
        <Card style={{ borderColor: C.borderGold, textAlign: "center", padding: 20 }}>
          <div style={{ fontSize: 10, color: C.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Zuidara Membership</div>
          <div style={{ fontSize: 18, fontStyle: "italic", marginBottom: 8 }}>Elevate Your Wellness Routine</div>
          <p style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.6, marginBottom: 16 }}>Enjoy monthly sessions, member-only discounts, and priority therapist booking.</p>
          <GhostBtn small onClick={() => setView("membership")}>Explore Memberships</GhostBtn>
        </Card>
      </div>
    </div>
  );

  // ── RECOMMENDATION ENGINE PAGE ────────────────────────────────────────────────
  const renderRecommend = () => (
    <div style={{ padding: "20px" }}>
      <SectionTitle>Personalized Treatment Finder</SectionTitle>
      <div style={{ fontSize: 18, fontStyle: "italic", marginBottom: 6 }}>Not sure what you need?</div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>Answer two simple questions to find your optimal ritual.</div>

      {!recommendedTreatment ? (
        <>
          <div style={{ fontSize: 10, color: C.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Step 1: What is your primary goal?</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {["Relax", "Relieve muscle tension", "Refresh", "Stress relief", "Couples experience"].map(g => (
              <button key={g} onClick={() => setQuizGoal(g)}
                style={{ background: quizGoal === g ? C.goldFaint : C.bg2, border: `1px solid ${quizGoal === g ? C.gold : C.border}`, color: quizGoal === g ? C.gold : C.text, padding: 12, borderRadius: 4, fontSize: 12, cursor: "pointer" }}>
                {g}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 10, color: C.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Step 2: How much time do you have?</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
            {["60 minutes", "75 minutes", "90 minutes", "120 minutes"].map(t => (
              <button key={t} onClick={() => setQuizTime(t)}
                style={{ background: quizTime === t ? C.goldFaint : C.bg2, border: `1px solid ${quizTime === t ? C.gold : C.border}`, color: quizTime === t ? C.gold : C.text, padding: 12, borderRadius: 4, fontSize: 12, cursor: "pointer" }}>
                {t}
              </button>
            ))}
          </div>

          <GoldBtn onClick={handleRecommendation} style={{ width: "100%" }}>Get Recommendation →</GoldBtn>
        </>
      ) : (
        <Card style={{ borderColor: C.borderGold, textAlign: "center", padding: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>{recommendedTreatment.emoji}</div>
          <div style={{ fontSize: 10, color: C.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Recommended For You</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{recommendedTreatment.name}</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>{recommendedTreatment.desc}</div>
          <div style={{ fontSize: 18, color: C.gold, fontWeight: 700, marginBottom: 20 }}>₹{recommendedTreatment.price.toLocaleString()} · {recommendedTreatment.duration}</div>
          <GoldBtn onClick={() => { setSelectedService(recommendedTreatment.id); setView("book"); setBookStep(2); }} style={{ width: "100%", marginBottom: 10 }}>
            Book This Treatment →
          </GoldBtn>
          <GhostBtn onClick={() => setRecommendedTreatment(null)} style={{ width: "100%" }}>Reset Quiz</GhostBtn>
        </Card>
      )}
    </div>
  );

  // ── MEMBERSHIPS PAGE ──────────────────────────────────────────────────────────
  const renderMembership = () => (
    <div style={{ padding: "20px" }}>
      <SectionTitle>Zuidara Membership</SectionTitle>
      <div style={{ fontSize: 18, fontStyle: "italic", marginBottom: 20, textAlign: "center" }}>Consistency is the key to lasting wellness.</div>
      {INIT_MEMBERSHIPS.map(m => (
        <Card key={m.id} style={{ borderColor: m.badge === "Best Value" ? C.gold : C.border, position: "relative" }}>
          <div style={{ fontSize: 10, color: C.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{m.badge}</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{m.name}</div>
          <div style={{ fontSize: 22, color: C.gold, fontWeight: 700, marginBottom: 14 }}>₹{m.price.toLocaleString()} <span style={{ fontSize: 11, color: C.textMuted }}>/ {m.period}</span></div>
          <div style={{ marginBottom: 16 }}>
            {m.perks.map(p => (
              <div key={p} style={{ fontSize: 12, color: C.textMuted, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: C.green }}>✓</span> {p}
              </div>
            ))}
          </div>
          <GoldBtn onClick={() => showToast(`Selected ${m.name}. Concierge will contact you!`)} style={{ width: "100%" }}>Subscribe Tier</GoldBtn>
        </Card>
      ))}
    </div>
  );

  // ── GIFT CARDS PAGE ───────────────────────────────────────────────────────────
  const renderGiftCards = () => (
    <div style={{ padding: "20px" }}>
      <SectionTitle>Gift Zuidara Wellness</SectionTitle>
      <div style={{ fontSize: 18, fontStyle: "italic", marginBottom: 6, textAlign: "center" }}>Give the gift of restoration.</div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20, textAlign: "center" }}>Instant digital gift vouchers sent directly to their phone or email.</div>
      <Card>
        <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Select Amount</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
          {["1000", "2500", "5000"].map(amt => (
            <button key={amt} onClick={() => setGiftAmount(amt)}
              style={{ background: giftAmount === amt ? C.goldFaint : C.bg, border: `1px solid ${giftAmount === amt ? C.gold : C.border}`, color: giftAmount === amt ? C.gold : C.text, padding: 10, borderRadius: 4, cursor: "pointer", fontWeight: 700 }}>
              ₹{amt}
            </button>
          ))}
        </div>
        <Input label="Recipient Mobile or Email" value={giftRecipient} onChange={setGiftRecipient} placeholder="+91 98765 43210" />
        <GoldBtn onClick={() => {
          if (!giftRecipient) return showToast("Enter recipient info", "error");
          showToast(`₹${giftAmount} Gift Voucher sent to ${giftRecipient}!`);
        }} style={{ width: "100%" }}>Purchase Gift Card →</GoldBtn>
      </Card>
    </div>
  );

  // ── BOOKING FLOW ─────────────────────────────────────────────────────────────
  const renderBook = () => (
    <div style={{ padding: "20px", paddingBottom: 80 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>
          Step {bookStep} of 4 — {["Choose Service", "Customer Info", "Therapist Selection", "Time Slot"][bookStep - 1]}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3, 4].map(s => <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: bookStep > s ? C.gold : bookStep === s ? C.gold + "88" : C.border }} />)}
        </div>
      </div>

      {bookStep === 1 && (
        <>
          <div style={{ fontSize: 18, color: C.text, marginBottom: 16, fontStyle: "italic" }}>Select your ritual</div>
          {services.filter(s => s.active).map(s => (
            <Card key={s.id} style={{ cursor: "pointer", display: "flex", gap: 14, borderColor: selectedService === s.id ? C.gold : C.border }}
              onClick={() => { setSelectedService(s.id); setBookStep(2); }}>
              <div style={{ fontSize: 28 }}>{s.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: C.textMuted, margin: "4px 0" }}>{s.desc}</div>
                <div style={{ fontSize: 13, color: C.gold, fontWeight: 700 }}>₹{s.price.toLocaleString()} · {s.duration}</div>
              </div>
            </Card>
          ))}
        </>
      )}

      {bookStep === 2 && (
        <>
          <div style={{ fontSize: 18, color: C.text, marginBottom: 16, fontStyle: "italic" }}>Customer Details</div>
          <Input label="Your Name" value={customerName} onChange={setCustomerName} placeholder="e.g. Divya Sharma" />
          <Input label="Mobile Number" value={customerPhone} onChange={setCustomerPhone} placeholder="+91 98765 43210" type="tel" />
          <GoldBtn onClick={() => { if (customerName && customerPhone) setBookStep(3); else showToast("Please provide name and phone", "error"); }} style={{ width: "100%", marginTop: 8 }}>Continue →</GoldBtn>
          <GhostBtn onClick={() => setBookStep(1)} style={{ width: "100%", marginTop: 10 }}>← Back</GhostBtn>
        </>
      )}

      {bookStep === 3 && (
        <>
          <div style={{ fontSize: 18, color: C.text, marginBottom: 16, fontStyle: "italic" }}>Preferred Therapist</div>
          {therapists.map(t => (
            <Card key={t.id} style={{ display: "flex", gap: 14, borderColor: selectedTherapist === t.id ? C.gold : C.border, cursor: t.available ? "pointer" : "default", opacity: t.available ? 1 : 0.5 }}
              onClick={() => { if (t.available) { setSelectedTherapist(t.id); setBookStep(4); } }}>
              <div style={{ fontSize: 28 }}>{t.photo}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{t.specialty}</div>
                <div style={{ fontSize: 11, color: C.gold, marginTop: 4 }}>★ {t.rating} ({t.reviews} reviews)</div>
              </div>
            </Card>
          ))}
          <GhostBtn onClick={() => setBookStep(2)} style={{ width: "100%", marginTop: 4 }}>← Back</GhostBtn>
        </>
      )}

      {bookStep === 4 && !bookingDone && (
        <>
          <div style={{ fontSize: 18, color: C.text, marginBottom: 12, fontStyle: "italic" }}>Schedule Appointment</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["Today", "Tomorrow", "Day After"].map(d => (
              <button key={d} onClick={() => setSelectedDate(d)}
                style={{ flex: 1, background: selectedDate === d ? C.goldFaint : C.bg2, border: `1px solid ${selectedDate === d ? C.gold : C.border}`, color: selectedDate === d ? C.gold : C.textMuted, padding: 8, borderRadius: 4, cursor: "pointer" }}>
                {d}
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {SLOTS.map(slot => (
              <button key={slot} onClick={() => setSelectedSlot(slot)}
                style={{ background: selectedSlot === slot ? C.goldFaint : C.bg2, border: `1px solid ${selectedSlot === slot ? C.gold : C.border}`, color: selectedSlot === slot ? C.gold : C.text, padding: 12, borderRadius: 4, cursor: "pointer" }}>
                {slot}
              </button>
            ))}
          </div>

          {selectedSlot && (
            <Card style={{ borderColor: C.borderGold }}>
              <div style={{ fontSize: 11, color: C.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Summary</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Service: {selectedServiceObj?.name}</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Therapist: {selectedTherapistObj?.name}</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>Time: {selectedDate}, {selectedSlot}</div>
              <div style={{ fontSize: 16, color: C.gold, fontWeight: 700, marginBottom: 16 }}>Total: ₹{selectedServiceObj?.price?.toLocaleString()}</div>
              <GoldBtn onClick={() => {
                const newBooking = { id: bookings.length + 1, customer: customerName, service: selectedServiceObj?.name, therapist: selectedTherapistObj?.name, date: selectedDate, slot: selectedSlot, amount: selectedServiceObj?.price, status: "confirmed", phone: customerPhone };
                setBookings(p => [...p, newBooking]);
                setBookingDone(true);

                if (settings.makeWebhookUrl) {
                  fetch(settings.makeWebhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newBooking) }).catch(e => console.error(e));
                }

                const msg = encodeURIComponent(`*Zuidara Spa Booking*\nName: ${customerName}\nPhone: ${customerPhone}\nService: ${selectedServiceObj?.name}\nTherapist: ${selectedTherapistObj?.name}\nTime: ${selectedDate}, ${selectedSlot}\nTotal: ₹${selectedServiceObj?.price}`);
                window.open(`https://wa.me/${settings.whatsapp}?text=${msg}`, "_blank");
              }} style={{ width: "100%" }}>Confirm via WhatsApp →</GoldBtn>
            </Card>
          )}
          <GhostBtn onClick={() => setBookStep(3)} style={{ width: "100%", marginTop: 10 }}>← Back</GhostBtn>
        </>
      )}

      {bookingDone && (
        <div style={{ textAlign: "center", paddingTop: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>✨</div>
          <div style={{ fontSize: 20, color: C.gold, fontStyle: "italic", marginBottom: 8 }}>Appointment Requested!</div>
          <p style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6, marginBottom: 20 }}>Your request for {selectedServiceObj?.name} on {selectedDate} at {selectedSlot} has been dispatched. Our concierge will confirm arrival via WhatsApp.</p>
          <GoldBtn onClick={() => { setBookingDone(false); setBookStep(1); setView("home"); }} style={{ width: "100%" }}>Return to Home</GoldBtn>
        </div>
      )}
    </div>
  );

  // ── ADMIN PANEL ──────────────────────────────────────────────────────────────
  const renderAdmin = () => {
    if (!adminUnlocked) {
      return (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🔐</div>
          <div style={{ fontSize: 18, color: C.gold, marginBottom: 16 }}>Admin Access</div>
          <Input label="Enter Admin PIN" value={adminPin} onChange={setAdminPin} type="password" placeholder="1234" />
          <GoldBtn onClick={() => { if (adminPin === "1234" || adminPin === "") setAdminUnlocked(true); else showToast("Incorrect PIN", "error"); }} style={{ width: "100%" }}>Unlock Panel</GoldBtn>
        </div>
      );
    }

    return (
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: C.gold, letterSpacing: 2 }}>⚙️ ADMIN DASHBOARD</div>
          <GhostBtn small onClick={() => setAdminUnlocked(false)}>Lock</GhostBtn>
        </div>
        <SectionTitle>Recent Bookings ({bookings.length})</SectionTitle>
        {bookings.slice(-4).reverse().map(b => (
          <Card key={b.id}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{b.customer}</div>
              <Badge status={b.status} />
            </div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{b.service} · {b.slot} ({b.date})</div>
            <div style={{ fontSize: 11, color: C.gold, marginTop: 4 }}>₹{b.amount?.toLocaleString()}</div>
          </Card>
        ))}
      </div>
    );
  };

  // ── GLOBAL LAYOUT & NAVIGATION ───────────────────────────────────────────────
  return (
    <div style={S.app}>
      {/* Toast Notification */}
      {toast && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: toast.type === "error" ? C.red : C.gold, color: toast.type === "error" ? "#fff" : C.bg, padding: "8px 18px", borderRadius: 20, fontSize: 12, fontWeight: 700, zIndex: 999 }}>
          {toast.msg}
        </div>
      )}

      {/* Social Proof Banner */}
      {recentPopup && (
        <div style={{ position: "fixed", bottom: 70, left: 20, right: 20, background: C.bg2, border: `1px solid ${C.borderGold}`, color: C.text, padding: "10px 14px", borderRadius: 8, fontSize: 11, boxShadow: "0 4px 20px rgba(0,0,0,0.5)", zIndex: 99, display: "flex", alignItems: "center", gap: 10 }}>
          <span>🔥</span> <span>{recentPopup}</span>
        </div>
      )}

      {/* Top Header */}
      <div style={S.header}>
        <div>
          <div style={S.logo}>{settings.spaName.toUpperCase()}</div>
          <div style={S.tagline}>{settings.tagline}</div>
        </div>
        <span style={{ fontSize: 10, color: C.gold, letterSpacing: 1, cursor: "pointer" }} onClick={() => { setView("book"); setBookStep(1); }}>🌸 Book Now</span>
      </div>

      {/* Scrollable View Container */}
      <div style={S.scroll}>
        {view === "home" && renderHome()}
        {view === "recommend" && renderRecommend()}
        {view === "membership" && renderMembership()}
        {view === "giftcards" && renderGiftCards()}
        {view === "book" && renderBook()}
        {view === "admin" && renderAdmin()}
      </div>

      {/* Bottom Sticky Mobile Navigation */}
      <div style={S.bottomNav}>
        {[
          { id: "home", icon: "🏠", label: "Home" },
          { id: "recommend", icon: "✨", label: "Quiz" },
          { id: "book", icon: "📅", label: "Book" },
          { id: "membership", icon: "👑", label: "Pass" },
          { id: "giftcards", icon: "🎁", label: "Gift" },
          { id: "admin", icon: "⚙️", label: "Admin" },
        ].map(nav => (
          <div key={nav.id} style={S.navItem(view === nav.id)} onClick={() => setView(nav.id)}>
            <div style={S.navIcon}>{nav.icon}</div>
            <div style={S.navLabel(view === nav.id)}>{nav.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
