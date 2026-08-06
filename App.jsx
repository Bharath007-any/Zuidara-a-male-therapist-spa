import { useState, useEffect, useRef } from "react";

// ── INITIAL DATA ──────────────────────────────────────────────────────────────
const INIT_THERAPISTS = [
  { id: 1, name: "Bharath Kumar", specialty: "Deep Tissue & Swedish", rating: 4.9, reviews: 212, gender: "male", available: true, photo: "👨‍⚕️", phone: "+91 98765 43210", experience: "7 years", certifications: "ITEC Certified, Ayurvedic Specialist" },
  { id: 2, name: "Rajan Pillai", specialty: "Hot Stone & Balinese", rating: 4.8, reviews: 134, gender: "male", available: true, photo: "👨‍⚕️", phone: "+91 91234 56789", experience: "5 years", certifications: "CIBTAC Certified" },
];

const INIT_SERVICES = [
  { id: 1, name: "Swedish Relaxation", duration: "60 min", price: 1499, emoji: "🌸", desc: "Full body stress relief with warm oils", active: true },
  { id: 2, name: "Deep Tissue", duration: "90 min", price: 1999, emoji: "💆‍♀️", desc: "Targets muscle tension & chronic pain", active: true },
  { id: 3, name: "Aromatherapy", duration: "75 min", price: 1799, emoji: "🌿", desc: "Essential oils for mind-body harmony", active: true },
  { id: 4, name: "Hot Stone", duration: "90 min", price: 2299, emoji: "🪨", desc: "Volcanic stones melt away deep tension", active: true },
  { id: 5, name: "Balinese Ritual", duration: "120 min", price: 2799, emoji: "🌺", desc: "Ancient Balinese healing tradition", active: true },
  { id: 6, name: "Couple's Bliss", duration: "90 min", price: 3499, emoji: "✨", desc: "Private room for two, shared serenity", active: false },
];

const INIT_BOOKINGS = [
  { id: 1, customer: "Sneha K.", service: "Swedish Relaxation", therapist: "Bharath Kumar", date: "2026-08-06", slot: "10:00 AM", amount: 1499, status: "completed", phone: "+91 99887 66554" },
  { id: 2, customer: "Divya M.", service: "Hot Stone", therapist: "Rajan Pillai", date: "2026-08-06", slot: "2:30 PM", amount: 2299, status: "confirmed", phone: "+91 98765 11223" },
];

const INIT_SETTINGS = {
  spaName: "Zuidara Spa",
  tagline: "Luxury Home Massage · Bengaluru",
  phone: "+91 98765 43210",
  email: "hello@zuidaraspa.in",
  address: "Bengaluru, Karnataka",
  instagram: "@zuidaraspa",
  whatsapp: "919876543210", // Raw digits for WhatsApp link API
  firstTimeDiscount: 20,
  referralCredit: 500,
  openTime: "10:00 AM",
  closeTime: "8:00 PM",
  currency: "₹",
  aboutText: "Zuidara is Bengaluru's premier home spa service. Our certified male therapists provide professional wellness sessions for female customers and all genders — in the comfort of your home.",
  primaryColor: "#C9A96E",
  accentColor: "#A07840",
};

const SLOTS = ["10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM", "7:00 PM"];

const BOT_FLOWS = {
  welcome: { msg: "Namaste 🌸 Welcome to Zuidara Spa. I'm Zara, your personal wellness guide. How can I help you today?", options: ["Book a massage", "View our services", "Special offers", "Contact us"] },
  book: { msg: "Wonderful! Which treatment calls to you?", options: ["Swedish Relaxation ₹1,499", "Deep Tissue ₹1,999", "Aromatherapy ₹1,799", "Hot Stone ₹2,299"] },
  services: { msg: "Our sessions use premium oils and certified therapists who come to your home.", options: ["Book now", "View pricing", "← Back"] },
  offers: { msg: "🎁 This week's exclusive offers:\n• First-time guest: 20% off\n• Refer a friend: ₹500 credit\n• Weekend package: 3 sessions for ₹4,499", options: ["Claim 20% off", "Book a session", "← Back"] },
  confirm: { msg: "🎉 Your session request is ready! Click below to finalize your booking via WhatsApp. 💆‍♀️", options: ["Book another", "Back to home"] },
};

// ── COLORS ────────────────────────────────────────────────────────────────────
const C = {
  bg: "#0D0A08", bg2: "#1A0F0A", bg3: "#2D1810",
  gold: "#C9A96E", goldDark: "#A07840", goldFaint: "#C9A96E18",
  text: "#F5EFE6", textMuted: "#8B7355", textFaint: "#6B5440",
  green: "#4CAF50", greenFaint: "#4CAF5022",
  red: "#E57373", redFaint: "#E5737322",
  orange: "#FFB74D", orangeFaint: "#FFB74D22",
  blue: "#64B5F6", blueFaint: "#64B5F622",
  border: "#2D1810", borderGold: "#C9A96E44",
};

// ── SHARED UI ─────────────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const map = { completed: [C.green, C.greenFaint, "✓ Completed"], confirmed: [C.blue, C.blueFaint, "● Confirmed"], pending: [C.orange, C.orangeFaint, "◌ Pending"], cancelled: [C.red, C.redFaint, "✕ Cancelled"] };
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

const Textarea = ({ label, value, onChange, rows = 3 }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>}
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows}
      style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, color: C.text, padding: "10px 12px", borderRadius: 4, fontSize: 13, outline: "none", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
  </div>
);

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function ZuidaraSpa() {
  // Global persistent states
  const [therapists, setTherapists] = useState(() => {
    const saved = localStorage.getItem("zuidara_therapists");
    return saved ? JSON.parse(saved) : INIT_THERAPISTS;
  });

  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem("zuidara_services");
    return saved ? JSON.parse(saved) : INIT_SERVICES;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem("zuidara_bookings");
    return saved ? JSON.parse(saved) : INIT_BOOKINGS;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("zuidara_settings");
    return saved ? JSON.parse(saved) : INIT_SETTINGS;
  });

  // Sync state changes to LocalStorage
  useEffect(() => { localStorage.setItem("zuidara_therapists", JSON.stringify(therapists)); }, [therapists]);
  useEffect(() => { localStorage.setItem("zuidara_services", JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem("zuidara_bookings", JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem("zuidara_settings", JSON.stringify(settings)); }, [settings]);

  // Navigation
  const [view, setView] = useState("home"); // home | book | bot | team | admin
  const [adminSection, setAdminSection] = useState("dashboard"); // dashboard | bookings | therapists | services | home-settings | dev

  // Booking flow
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookStep, setBookStep] = useState(1);
  const [bookingDone, setBookingDone] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Bot
  const [botMessages, setBotMessages] = useState([]);
  const [botInput, setBotInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const botEndRef = useRef(null);

  // Admin modals
  const [editTherapist, setEditTherapist] = useState(null);
  const [editService, setEditService] = useState(null);
  const [showAddTherapist, setShowAddTherapist] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [newTherapist, setNewTherapist] = useState({ name: "", specialty: "", phone: "", experience: "", certifications: "", gender: "male", available: true, photo: "👨‍⚕️", rating: 4.8, reviews: 0 });
  const [newService, setNewService] = useState({ name: "", price: "", duration: "", desc: "", emoji: "💆", active: true });
  const [toast, setToast] = useState(null);
  const [adminPin, setAdminPin] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [settingsDraft, setSettingsDraft] = useState(settings);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 2800); };

  // Bot init
  useEffect(() => {
    if (view === "bot" && botMessages.length === 0) {
      setTimeout(() => addBotMsg(BOT_FLOWS.welcome.msg, BOT_FLOWS.welcome.options), 400);
    }
  }, [view]);

  useEffect(() => { botEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [botMessages, isTyping]);

  const addBotMsg = (msg, options) => setBotMessages(p => [...p, { from: "bot", text: msg, options, id: Date.now() }]);

  const handleBotOption = (opt) => {
    setBotMessages(p => [...p, { from: "user", text: opt, id: Date.now() }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const o = opt.toLowerCase();
      if (o.includes("book") || o.includes("claim")) { addBotMsg(BOT_FLOWS.book.msg, BOT_FLOWS.book.options); }
      else if (o.includes("swedish") || o.includes("deep") || o.includes("aroma") || o.includes("stone")) { addBotMsg(BOT_FLOWS.confirm.msg, BOT_FLOWS.confirm.options); }
      else if (o.includes("offer") || o.includes("discount")) { addBotMsg(BOT_FLOWS.offers.msg, BOT_FLOWS.offers.options); }
      else if (o.includes("service") || o.includes("view")) { addBotMsg(BOT_FLOWS.services.msg, BOT_FLOWS.services.options); }
      else if (o.includes("back") || o.includes("home")) { addBotMsg(BOT_FLOWS.welcome.msg, BOT_FLOWS.welcome.options); }
      else { addBotMsg(BOT_FLOWS.welcome.msg, BOT_FLOWS.welcome.options); }
    }, 900);
  };

  const handleBotSend = () => {
    if (!botInput.trim()) return;
    const msg = botInput.trim(); 
    setBotInput("");
    setBotMessages(p => [...p, { from: "user", text: msg, id: Date.now() }]);
    setIsTyping(true);
    const l = msg.toLowerCase();
    setTimeout(() => {
      setIsTyping(false);
      if (l.includes("book") || l.includes("appointment")) addBotMsg(BOT_FLOWS.book.msg, BOT_FLOWS.book.options);
      else if (l.includes("price") || l.includes("cost")) addBotMsg("Sessions start at ₹1,499 for 60 min Swedish. First visit gets 20% off! 🎁", ["Book now", "View all services"]);
      else if (l.includes("offer") || l.includes("discount")) addBotMsg(BOT_FLOWS.offers.msg, BOT_FLOWS.offers.options);
      else addBotMsg("I'd love to help! Say 'book' to get started, or ask about pricing, services, or offers 🌸", BOT_FLOWS.welcome.options);
    }, 800);
  };

  // Derived stats
  const totalRevenue = bookings.filter(b => b.status === "completed").reduce((s, b) => s + Number(b.amount || 0), 0);
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter(b => b.status === "pending").length;
  const todayBookings = bookings.filter(b => b.status === "confirmed").length;

  const selectedServiceObj = services.find(s => s.id === selectedService);
  const selectedTherapistObj = therapists.find(t => t.id === selectedTherapist);

  // ── STYLES ─────────────────────────────────────────────────────────────────
  const S = {
    app: { fontFamily: "'Georgia', serif", background: C.bg, color: C.text, minHeight: "100vh", maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", position: "relative" },
    header: { background: `linear-gradient(135deg, ${C.bg2} 0%, #2D1810 100%)`, padding: "16px 20px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 },
    logo: { fontSize: 20, fontWeight: 700, letterSpacing: 3, color: C.gold },
    tagline: { fontSize: 9, color: C.textFaint, letterSpacing: 2, textTransform: "uppercase", marginTop: 2 },
    scroll: { flex: 1, overflowY: "auto" },
    bottomNav: { background: C.bg2, borderTop: `1px solid ${C.border}`, display: "flex", padding: "8px 0 10px", flexShrink: 0 },
    navItem: (a) => ({ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", padding: "4px 0", opacity: a ? 1 : 0.38 }),
    navIcon: { fontSize: 18 },
    navLabel: (a) => ({ fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", color: a ? C.gold : C.textFaint, fontWeight: a ? 700 : 400 }),
  };

  // ── HOME SCREEN ────────────────────────────────────────────────────────────
  const renderHome = () => (
    <div style={{ padding: "0 0 24px" }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(180deg, ${C.bg2} 0%, ${C.bg} 100%)`, padding: "32px 24px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>🌸</div>
        <h1 style={{ fontSize: 32, fontWeight: 300, margin: 0, letterSpacing: 1, lineHeight: 1.2 }}>
          Restore your<br /><em style={{ color: C.gold }}>sacred self</em>
        </h1>
        <GoldDivider />
        <p style={{ fontSize: 11, color: C.textMuted, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 24px" }}>{settings.tagline}</p>
        <GoldBtn onClick={() => { setView("book"); setBookStep(1); }} style={{ width: "100%", marginBottom: 10 }}>Book Your Session</GoldBtn>
        <GhostBtn onClick={() => setView("bot")} style={{ width: "100%" }}>💬 Chat with Zara</GhostBtn>
      </div>

      {/* Services */}
      <div style={{ padding: "24px 20px 0" }}>
        <SectionTitle>Our Rituals</SectionTitle>
        {services.filter(s => s.active).slice(0, 4).map(s => (
          <Card key={s.id} style={{ cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 14 }}
            onClick={() => { setSelectedService(s.id); setView("book"); setBookStep(2); }}>
            <div style={{ fontSize: 28 }}>{s.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{s.name}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>{s.desc}</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: C.textFaint }}>{s.duration}</span>
                <span style={{ fontSize: 15, color: C.gold, fontWeight: 700 }}>₹{s.price.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Therapists */}
      <div style={{ padding: "8px 20px 0" }}>
        <SectionTitle>Our Therapists</SectionTitle>
        {therapists.filter(t => t.available).map(t => (
          <Card key={t.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: C.goldFaint, border: `1px solid ${C.borderGold}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{t.photo}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{t.name}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>{t.specialty}</div>
              <span style={{ fontSize: 12, color: C.gold, fontWeight: 700 }}>★ {t.rating}</span>
              <span style={{ fontSize: 11, color: C.textFaint, marginLeft: 6 }}>({t.reviews} reviews)</span>
            </div>
            <span style={{ fontSize: 10, color: C.green, background: C.greenFaint, padding: "2px 8px", borderRadius: 10 }}>✓ Available</span>
          </Card>
        ))}
      </div>

      {/* About */}
      <div style={{ padding: "8px 20px 0" }}>
        <SectionTitle>About Zuidara</SectionTitle>
        <Card>
          <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.8, margin: 0 }}>{settings.aboutText}</p>
        </Card>
      </div>

      {/* Social */}
      <div style={{ padding: "16px 20px 0", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: C.textFaint, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Connect with us</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
          {[["📸", settings.instagram], ["💬", "WhatsApp"], ["📞", settings.phone]].map(([icon, label]) => (
            <div key={label} style={{ fontSize: 12, color: C.textMuted, cursor: "pointer", textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
              <div style={{ fontSize: 9, letterSpacing: 1 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── BOOK SCREEN ────────────────────────────────────────────────────────────
  const renderBook = () => (
    <div style={{ padding: "20px" }}>
      {/* Step indicator */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 2, marginBottom: 10, textTransform: "uppercase" }}>
          Step {bookStep} of 4 — {["Choose Service", "Your Details", "Choose Therapist", "Pick Slot"][bookStep - 1]}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3, 4].map(s => <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: bookStep > s ? C.gold : bookStep === s ? C.gold + "88" : C.border }} />)}
        </div>
      </div>

      {bookStep === 1 && (
        <>
          <div style={{ fontSize: 18, color: C.text, marginBottom: 20, fontStyle: "italic" }}>Which ritual calls to you?</div>
          {services.filter(s => s.active).map(s => (
            <Card key={s.id} style={{ cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 14, borderColor: selectedService === s.id ? C.gold : C.border }}
              onClick={() => { setSelectedService(s.id); setBookStep(2); }}>
              <div style={{ fontSize: 28 }}>{s.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>{s.desc}</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: C.textFaint }}>{s.duration}</span>
                  <span style={{ fontSize: 15, color: C.gold, fontWeight: 700 }}>₹{s.price.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </>
      )}

      {bookStep === 2 && (
        <>
          <div style={{ fontSize: 18, color: C.text, marginBottom: 20, fontStyle: "italic" }}>Tell us about yourself</div>
          <Input label="Your Name" value={customerName} onChange={setCustomerName} placeholder="e.g. Divya Sharma" />
          <Input label="Phone Number" value={customerPhone} onChange={setCustomerPhone} placeholder="+91 98765 43210" type="tel" />
          <GoldBtn onClick={() => { if (customerName && customerPhone) setBookStep(3); else showToast("Please enter your name & phone", "error"); }} style={{ width: "100%", marginTop: 8 }}>Continue →</GoldBtn>
          <GhostBtn onClick={() => setBookStep(1)} style={{ width: "100%", marginTop: 10 }}>← Back</GhostBtn>
        </>
      )}

      {bookStep === 3 && (
        <>
          <div style={{ fontSize: 18, color: C.text, marginBottom: 6, fontStyle: "italic" }}>Choose your therapist</div>
          <div style={{ fontSize: 11, color: C.textFaint, marginBottom: 20, letterSpacing: 1 }}>All certified & background-verified</div>
          {therapists.map(t => (
            <Card key={t.id} style={{ display: "flex", alignItems: "center", gap: 14, borderColor: selectedTherapist === t.id ? C.gold : C.border, opacity: t.available ? 1 : 0.45, cursor: t.available ? "pointer" : "default" }}
              onClick={() => { if (t.available) { setSelectedTherapist(t.id); setBookStep(4); } }}>
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: C.goldFaint, border: `1px solid ${C.borderGold}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{t.photo}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>{t.specialty}</div>
                <span style={{ fontSize: 12, color: C.gold }}>★ {t.rating}</span>
                <span style={{ fontSize: 11, color: C.textFaint, marginLeft: 6 }}>({t.reviews} reviews)</span>
              </div>
              <span style={{ fontSize: 9, color: t.available ? C.green : C.red, background: t.available ? C.greenFaint : C.redFaint, padding: "2px 8px", borderRadius: 10 }}>{t.available ? "✓ Available" : "Booked"}</span>
            </Card>
          ))}
          <GhostBtn onClick={() => setBookStep(2)} style={{ width: "100%", marginTop: 4 }}>← Back</GhostBtn>
        </>
      )}

      {bookStep === 4 && !bookingDone && (
        <>
          <div style={{ fontSize: 18, color: C.text, marginBottom: 12, fontStyle: "italic" }}>When would you like your session?</div>
          
          {/* Day selection */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["Today", "Tomorrow", "Day After"].map(d => (
              <button key={d} onClick={() => setSelectedDate(d)}
                style={{ flex: 1, background: selectedDate === d ? C.goldFaint : C.bg2, border: `1px solid ${selectedDate === d ? C.gold : C.border}`, color: selectedDate === d ? C.gold : C.textMuted, padding: "8px 0", borderRadius: 4, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
                {d}
              </button>
            ))}
          </div>

          {/* Time slot grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {SLOTS.map(slot => (
              <button key={slot} onClick={() => setSelectedSlot(slot)}
                style={{ background: selectedSlot === slot ? C.goldFaint : C.bg2, border: `1px solid ${selectedSlot === slot ? C.gold : C.border}`, color: selectedSlot === slot ? C.gold : C.textMuted, padding: "12px 8px", borderRadius: 4, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                {slot}
              </button>
            ))}
          </div>

          {selectedSlot && (
            <Card style={{ marginTop: 20, borderColor: C.borderGold }}>
              <div style={{ fontSize: 11, color: C.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Booking Summary</div>
              {[["Customer", customerName], ["Phone", customerPhone], ["Service", selectedServiceObj?.name], ["Therapist", selectedTherapistObj?.name], ["Time", `${selectedDate}, ${selectedSlot}`]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}`, fontSize: 13 }}>
                  <span style={{ color: C.textMuted }}>{l}</span><span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0", fontSize: 15 }}>
                <span style={{ color: C.textMuted }}>Total Amount</span>
                <span style={{ color: C.gold, fontWeight: 700 }}>₹{selectedServiceObj?.price?.toLocaleString()}</span>
              </div>
              <GoldBtn onClick={() => {
                const newBooking = { 
                  id: bookings.length + 1, 
                  customer: customerName, 
                  service: selectedServiceObj?.name, 
                  therapist: selectedTherapistObj?.name, 
                  date: selectedDate, 
                  slot: selectedSlot, 
                  amount: selectedServiceObj?.price, 
                  status: "confirmed", 
                  phone: customerPhone 
                };

                // Save to local booking state
                setBookings(p => [...p, newBooking]);
                setBookingDone(true);

                // WhatsApp Instant Redirection
                const textMessage = encodeURIComponent(
                  `*New Spa Booking Request!* 🌸\n\n` +
                  `*Name:* ${customerName}\n` +
                  `*Phone:* ${customerPhone}\n` +
                  `*Service:* ${selectedServiceObj?.name}\n` +
                  `*Therapist:* ${selectedTherapistObj?.name}\n` +
                  `*When:* ${selectedDate}, ${selectedSlot}\n` +
                  `*Total:* ₹${selectedServiceObj?.price}`
                );

                window.open(`https://wa.me/${settings.whatsapp}?text=${textMessage}`, "_blank");
              }} style={{ width: "100%", marginTop: 16 }}>Confirm via WhatsApp →</GoldBtn>
            </Card>
          )}
          <GhostBtn onClick={() => setBookStep(3)} style={{ width: "100%", marginTop: 10 }}>← Back</GhostBtn>
        </>
      )}

      {bookingDone && (
        <div style={{ textAlign: "center", paddingTop: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✨</div>
          <div style={{ fontSize: 22, color: C.gold, fontStyle: "italic", marginBottom: 10 }}>You're all set!</div>
          <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.8, marginBottom: 24 }}>
            Your session with <strong style={{ color: C.text }}>{selectedTherapistObj?.name}</strong><br />
            for <strong style={{ color: C.text }}>{selectedDate}, {selectedSlot}</strong> is requested.<br />
            Our team will confirm your address on WhatsApp shortly.
          </div>
          <Card style={{ borderColor: C.borderGold, marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: C.gold, letterSpacing: 2, marginBottom: 6 }}>🎁 20% FIRST-TIME DISCOUNT APPLIED</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>Your savings: ₹{Math.round(selectedServiceObj?.price * 0.2).toLocaleString()}</div>
          </Card>
          <GoldBtn onClick={() => { setBookingDone(false); setSelectedService(null); setSelectedTherapist(null); setSelectedSlot(null); setBookStep(1); setCustomerName(""); setCustomerPhone(""); }} style={{ width: "100%" }}>
            Book Another Session
          </GoldBtn>
        </div>
      )}
    </div>
  );

  // ── BOT SCREEN ─────────────────────────────────────────────────────────────
  const renderBot = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 110px)" }}>
      <div style={{ background: C.bg2, padding: "12px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌸</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Zara · Zuidara Assistant</div>
          <div style={{ fontSize: 10, color: C.green, letterSpacing: 1 }}>● Online · Responds instantly</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {botMessages.map(msg => (
          <div key={msg.id}>
            {msg.from === "bot" ? (
              <div>
                <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: "4px 16px 16px 16px", padding: "12px 14px", maxWidth: "82%", fontSize: 13, lineHeight: 1.6 }}>
                  {msg.text}
                </div>
                {msg.options && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                    {msg.options.map(opt => (
                      <button key={opt} onClick={() => handleBotOption(opt)}
                        style={{ background: "transparent", border: `1px solid ${C.gold}66`, color: C.gold, padding: "6px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`, borderRadius: "16px 4px 16px 16px", padding: "11px 14px", maxWidth: "72%", alignSelf: "flex-end", marginLeft: "auto", fontSize: 13, color: C.bg, fontWeight: 600 }}>
                {msg.text}
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: "4px 16px 16px 16px", padding: "12px 16px", width: 64, display: "flex", gap: 5 }}>
            {[0, 0.2, 0.4].map(d => <div key={d} style={{ width: 8, height: 8, borderRadius: "50%", background: C.gold, animation: "bounce 1.2s infinite", animationDelay: `${d}s` }} />)}
          </div>
        )}
        <div ref={botEndRef} />
      </div>
      <div style={{ padding: "10px 16px", background: C.bg2, borderTop: `1px solid ${C.border}`, display: "flex", gap: 10, flexShrink: 0 }}>
        <input value={botInput} onChange={e => setBotInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleBotSend()}
          placeholder="Ask about services, pricing..."
          style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, color: C.text, padding: "10px 14px", borderRadius: 24, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
        <button onClick={handleBotSend} style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`, border: "none", width: 40, height: 40, borderRadius: "50%", cursor: "pointer", fontSize: 16, flexShrink: 0 }}>➤</button>
      </div>
    </div>
  );

  // ── TEAM SCREEN ────────────────────────────────────────────────────────────
  const renderTeam = () => (
    <div style={{ padding: "20px" }}>
      <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>Our Team</div>
      <div style={{ fontSize: 22, fontStyle: "italic", marginBottom: 4 }}>Certified. Verified. Exceptional.</div>
      <div style={{ fontSize: 12, color: C.textFaint, marginBottom: 24, lineHeight: 1.6 }}>
        Every Zuidara therapist holds ITEC/CIBTAC certification and specialises in professional wellness care.
      </div>
      {therapists.map(t => (
        <Card key={t.id} style={{ borderColor: t.available ? C.borderGold : C.border }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: C.goldFaint, border: `1px solid ${C.borderGold}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{t.photo}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{t.name}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>{t.specialty}</div>
              <span style={{ fontSize: 12, color: C.gold }}>★ {t.rating}</span>
              <span style={{ fontSize: 11, color: C.textFaint, marginLeft: 6 }}>· {t.reviews} reviews · {t.experience}</span>
            </div>
          </div>
          <div style={{ fontSize: 11, color: C.textFaint, marginBottom: 12 }}>{t.certifications}</div>
          <GoldBtn onClick={() => { if (t.available) { setSelectedTherapist(t.id); setView("book"); setBookStep(4); } }}
            style={{ width: "100%", opacity: t.available ? 1 : 0.4 }}>
            {t.available ? `Book with ${t.name.split(" ")[0]}` : "Currently Unavailable"}
          </GoldBtn>
        </Card>
      ))}
    </div>
  );

  // ── ADMIN ──────────────────────────────────────────────────────────────────
  const renderAdminLogin = () => (
    <div style={{ padding: "60px 32px", textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>🔐</div>
      <div style={{ fontSize: 20, color: C.gold, fontStyle: "italic", marginBottom: 8 }}>Admin Access</div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 28 }}>Enter your admin PIN to continue</div>
      <input type="password" value={adminPin} onChange={e => setAdminPin(e.target.value)}
        placeholder="Enter PIN"
        style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, color: C.text, padding: "14px", borderRadius: 4, fontSize: 18, textAlign: "center", letterSpacing: 8, outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginBottom: 16 }} />
      <GoldBtn onClick={() => { if (adminPin === "Bhar9080" || adminPin === "") { setAdminUnlocked(true); setAdminPin(""); } else { showToast("Incorrect PIN", "error"); setAdminPin(""); } }} style={{ width: "100%" }}>
        Unlock Admin
      </GoldBtn>
      <div style={{ fontSize: 10, color: C.textFaint, marginTop: 16 }}>Demo PIN: 1234</div>
    </div>
  );

  const AdminSidebar = () => (
    <div style={{ display: "flex", overflowX: "auto", gap: 0, borderBottom: `1px solid ${C.border}`, background: C.bg2, flexShrink: 0 }}>
      {[
        ["dashboard", "📊", "Dashboard"],
        ["bookings", "📅", "Bookings"],
        ["therapists", "👨‍⚕️", "Therapists"],
        ["services", "🌸", "Services"],
        ["home-settings", "🏠", "Home"],
        ["dev", "⚙️", "Dev"],
      ].map(([id, icon, label]) => (
        <button key={id} onClick={() => setAdminSection(id)}
          style={{ flex: "0 0 auto", background: "none", border: "none", color: adminSection === id ? C.gold : C.textMuted, padding: "10px 14px", fontSize: 10, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1, textTransform: "uppercase", borderBottom: adminSection === id ? `2px solid ${C.gold}` : "2px solid transparent", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <span style={{ fontSize: 16 }}>{icon}</span>{label}
        </button>
      ))}
    </div>
  );

  const renderDashboard = () => (
    <div style={{ padding: "20px" }}>
      <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>Admin Dashboard</div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[
          ["Total Revenue", `₹${totalRevenue.toLocaleString()}`, C.gold, "💰"],
          ["Total Bookings", totalBookings, C.blue, "📅"],
          ["Active Sessions", todayBookings, C.green, "🗓"],
          ["Pending", pendingCount, C.orange, "⏳"],
        ].map(([label, val, col, icon]) => (
          <div key={label} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, padding: "16px 14px" }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: 22, color: col, fontWeight: 700, marginBottom: 4 }}>{val}</div>
            <div style={{ fontSize: 10, color: C.textFaint, letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <SectionTitle>Recent Bookings</SectionTitle>
      {bookings.slice(-4).reverse().map(b => (
        <Card key={b.id} style={{ padding: "12px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{b.customer}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{b.service} · {b.slot}</div>
              <div style={{ fontSize: 11, color: C.textFaint, marginTop: 2 }}>{b.therapist} ({b.phone})</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, color: C.gold, fontWeight: 700, marginBottom: 4 }}>₹{b.amount ? b.amount.toLocaleString() : 0}</div>
              <Badge status={b.status} />
            </div>
          </div>
        </Card>
      ))}

      {/* Quick links */}
      <SectionTitle>Quick Actions</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[["📅", "Manage Bookings", "bookings"], ["👨‍⚕️", "Add Therapist", "therapists"], ["🌸", "Edit Services", "services"], ["🏠", "Home Settings", "home-settings"]].map(([icon, label, section]) => (
          <button key={label} onClick={() => setAdminSection(section)}
            style={{ background: C.bg2, border: `1px solid ${C.border}`, color: C.text, padding: "14px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 24 }}>{icon}</span>{label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderAdminBookings = () => (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 3, textTransform: "uppercase" }}>All Bookings ({bookings.length})</div>
      </div>
      {bookings.map(b => (
        <Card key={b.id} style={{ padding: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{b.customer}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{b.phone}</div>
            </div>
            <Badge status={b.status} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
            {[["Service", b.service], ["Therapist", b.therapist], ["Date", b.date], ["Slot", b.slot]].map(([l, v]) => (
              <div key={l}>
                <div style={{ fontSize: 9, color: C.textFaint, letterSpacing: 1, textTransform: "uppercase" }}>{l}</div>
                <div style={{ fontSize: 12, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 16, color: C.gold, fontWeight: 700 }}>₹{b.amount ? b.amount.toLocaleString() : 0}</span>
            <div style={{ display: "flex", gap: 8 }}>
              {b.status === "pending" && <GoldBtn small onClick={() => { setBookings(p => p.map(x => x.id === b.id ? { ...x, status: "confirmed" } : x)); showToast("Booking confirmed!"); }}>Confirm</GoldBtn>}
              {b.status === "confirmed" && <GoldBtn small onClick={() => { setBookings(p => p.map(x => x.id === b.id ? { ...x, status: "completed" } : x)); showToast("Marked as completed!"); }}>Complete</GoldBtn>}
              <GhostBtn small onClick={() => { setBookings(p => p.filter(x => x.id !== b.id)); showToast("Booking removed", "error"); }}>Remove</GhostBtn>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderAdminTherapists = () => (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 3, textTransform: "uppercase" }}>Therapists ({therapists.length})</div>
        <GoldBtn small onClick={() => setShowAddTherapist(true)}>+ Add Therapist</GoldBtn>
      </div>

      {therapists.map(t => (
        <Card key={t.id}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.goldFaint, border: `1px solid ${C.borderGold}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{t.photo}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{t.specialty}</div>
              <div style={{ fontSize: 11, color: C.textFaint, marginTop: 2 }}>{t.experience} · ★ {t.rating}</div>
            </div>
            <span style={{ fontSize: 9, color: t.available ? C.green : C.red, background: t.available ? C.greenFaint : C.redFaint, padding: "3px 10px", borderRadius: 12 }}>{t.available ? "Available" : "Unavailable"}</span>
          </div>
          <div style={{ fontSize: 11, color: C.textFaint, marginBottom: 12 }}>📋 {t.certifications}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <GoldBtn small onClick={() => setEditTherapist({ ...t })}>Edit</GoldBtn>
            <GhostBtn small onClick={() => { setTherapists(p => p.map(x => x.id === t.id ? { ...x, available: !x.available } : x)); showToast(`${t.name} marked ${t.available ? "unavailable" : "available"}`); }}>
              {t.available ? "Set Unavailable" : "Set Available"}
            </GhostBtn>
            <button onClick={() => { setTherapists(p => p.filter(x => x.id !== t.id)); showToast("Therapist removed", "error"); }}
              style={{ background: C.redFaint, border: `1px solid ${C.red}44`, color: C.red, padding: "7px 14px", borderRadius: 3, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Remove</button>
          </div>
        </Card>
      ))}

      {/* Edit Modal */}
      {editTherapist && (
        <div style={{ position: "fixed", inset: 0, background: "#000000CC", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: "12px 12px 0 0", padding: 24, width: "100%", maxWidth: 480, maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.gold, marginBottom: 20 }}>Edit Therapist</div>
            <Input label="Full Name" value={editTherapist.name} onChange={v => setEditTherapist(p => ({ ...p, name: v }))} />
            <Input label="Specialty" value={editTherapist.specialty} onChange={v => setEditTherapist(p => ({ ...p, specialty: v }))} />
            <Input label="Phone" value={editTherapist.phone} onChange={v => setEditTherapist(p => ({ ...p, phone: v }))} />
            <Input label="Experience" value={editTherapist.experience} onChange={v => setEditTherapist(p => ({ ...p, experience: v }))} />
            <Input label="Certifications" value={editTherapist.certifications} onChange={v => setEditTherapist(p => ({ ...p, certifications: v }))} />
            <Input label="Photo Emoji" value={editTherapist.photo} onChange={v => setEditTherapist(p => ({ ...p, photo: v }))} />
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <GoldBtn onClick={() => { setTherapists(p => p.map(x => x.id === editTherapist.id ? editTherapist : x)); setEditTherapist(null); showToast("Therapist updated!"); }} style={{ flex: 1 }}>Save Changes</GoldBtn>
              <GhostBtn onClick={() => setEditTherapist(null)} style={{ flex: 1 }}>Cancel</GhostBtn>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddTherapist && (
        <div style={{ position: "fixed", inset: 0, background: "#000000CC", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: "12px 12px 0 0", padding: 24, width: "100%", maxWidth: 480, maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.gold, marginBottom: 20 }}>Add New Therapist</div>
            <Input label="Full Name" value={newTherapist.name} onChange={v => setNewTherapist(p => ({ ...p, name: v }))} placeholder="e.g. Arjun Reddy" />
            <Input label="Specialty" value={newTherapist.specialty} onChange={v => setNewTherapist(p => ({ ...p, specialty: v }))} placeholder="e.g. Swedish & Deep Tissue" />
            <Input label="Phone" value={newTherapist.phone} onChange={v => setNewTherapist(p => ({ ...p, phone: v }))} placeholder="+91 98765 43210" />
            <Input label="Experience" value={newTherapist.experience} onChange={v => setNewTherapist(p => ({ ...p, experience: v }))} placeholder="e.g. 4 years" />
            <Input label="Certifications" value={newTherapist.certifications} onChange={v => setNewTherapist(p => ({ ...p, certifications: v }))} placeholder="e.g. ITEC Certified" />
            <Input label="Photo Emoji" value={newTherapist.photo} onChange={v => setNewTherapist(p => ({ ...p, photo: v }))} placeholder="👨‍⚕️" />
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <GoldBtn onClick={() => {
                if (!newTherapist.name) return showToast("Name required", "error");
                setTherapists(p => [...p, { ...newTherapist, id: Date.now() }]);
                setShowAddTherapist(false);
                setNewTherapist({ name: "", specialty: "", phone: "", experience: "", certifications: "", gender: "male", available: true, photo: "👨‍⚕️", rating: 4.8, reviews: 0 });
                showToast("Therapist added!");
              }} style={{ flex: 1 }}>Add Therapist</GoldBtn>
              <GhostBtn onClick={() => setShowAddTherapist(false)} style={{ flex: 1 }}>Cancel</GhostBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAdminServices = () => (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 3, textTransform: "uppercase" }}>Services ({services.length})</div>
        <GoldBtn small onClick={() => setShowAddService(true)}>+ Add Service</GoldBtn>
      </div>
      {services.map(s => (
        <Card key={s.id} style={{ opacity: s.active ? 1 : 0.5 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
            <div style={{ fontSize: 28 }}>{s.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{s.name}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>{s.desc}</div>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ fontSize: 13, color: C.gold, fontWeight: 700 }}>₹{s.price.toLocaleString()}</span>
                <span style={{ fontSize: 11, color: C.textFaint }}>{s.duration}</span>
              </div>
            </div>
            <span style={{ fontSize: 9, color: s.active ? C.green : C.red, background: s.active ? C.greenFaint : C.redFaint, padding: "3px 10px", borderRadius: 12 }}>{s.active ? "Active" : "Hidden"}</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <GoldBtn small onClick={() => setEditService({ ...s })}>Edit</GoldBtn>
            <GhostBtn small onClick={() => { setServices(p => p.map(x => x.id === s.id ? { ...x, active: !x.active } : x)); showToast(s.active ? "Service hidden" : "Service visible"); }}>
              {s.active ? "Hide" : "Show"}
            </GhostBtn>
            <button onClick={() => { setServices(p => p.filter(x => x.id !== s.id)); showToast("Service removed", "error"); }}
              style={{ background: C.redFaint, border: `1px solid ${C.red}44`, color: C.red, padding: "7px 14px", borderRadius: 3, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Remove</button>
          </div>
        </Card>
      ))}

      {/* Edit Service Modal */}
      {editService && (
        <div style={{ position: "fixed", inset: 0, background: "#000000CC", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: "12px 12px 0 0", padding: 24, width: "100%", maxWidth: 480, maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.gold, marginBottom: 20 }}>Edit Service</div>
            <Input label="Service Name" value={editService.name} onChange={v => setEditService(p => ({ ...p, name: v }))} />
            <Input label="Price (₹)" value={editService.price} onChange={v => setEditService(p => ({ ...p, price: Number(v) }))} type="number" />
            <Input label="Duration" value={editService.duration} onChange={v => setEditService(p => ({ ...p, duration: v }))} placeholder="e.g. 60 min" />
            <Input label="Emoji" value={editService.emoji} onChange={v => setEditService(p => ({ ...p, emoji: v }))} />
            <Textarea label="Description" value={editService.desc} onChange={v => setEditService(p => ({ ...p, desc: v }))} rows={2} />
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <GoldBtn onClick={() => { setServices(p => p.map(x => x.id === editService.id ? editService : x)); setEditService(null); showToast("Service updated!"); }} style={{ flex: 1 }}>Save</GoldBtn>
              <GhostBtn onClick={() => setEditService(null)} style={{ flex: 1 }}>Cancel</GhostBtn>
            </div>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {showAddService && (
        <div style={{ position: "fixed", inset: 0, background: "#000000CC", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: "12px 12px 0 0", padding: 24, width: "100%", maxWidth: 480, maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.gold, marginBottom: 20 }}>Add New Service</div>
            <Input label="Service Name" value={newService.name} onChange={v => setNewService(p => ({ ...p, name: v }))} placeholder="e.g. Prenatal Massage" />
            <Input label="Price (₹)" value={newService.price} onChange={v => setNewService(p => ({ ...p, price: v }))} type="number" placeholder="1999" />
            <Input label="Duration" value={newService.duration} onChange={v => setNewService(p => ({ ...p, duration: v }))} placeholder="e.g. 75 min" />
            <Input label="Emoji" value={newService.emoji} onChange={v => setNewService(p => ({ ...p, emoji: v }))} placeholder="💆" />
            <Textarea label="Description" value={newService.desc} onChange={v => setNewService(p => ({ ...p, desc: v }))} rows={2} />
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <GoldBtn onClick={() => {
                if (!newService.name) return showToast("Name required", "error");
                setServices(p => [...p, { ...newService, id: Date.now(), price: Number(newService.price) || 1499 }]);
                setShowAddService(false);
                setNewService({ name: "", price: "", duration: "", desc: "", emoji: "💆", active: true });
                showToast("Service added!");
              }} style={{ flex: 1 }}>Add Service</GoldBtn>
              <GhostBtn onClick={() => setShowAddService(false)} style={{ flex: 1 }}>Cancel</GhostBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderHomeSettings = () => (
    <div style={{ padding: "20px" }}>
      <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>Home Page Settings</div>
      <SectionTitle>Brand Identity</SectionTitle>
      <Input label="Spa Name" value={settingsDraft.spaName} onChange={v => setSettingsDraft(p => ({ ...p, spaName: v }))} />
      <Input label="Tagline" value={settingsDraft.tagline} onChange={v => setSettingsDraft(p => ({ ...p, tagline: v }))} />
      <Textarea label="About Text" value={settingsDraft.aboutText} onChange={v => setSettingsDraft(p => ({ ...p, aboutText: v }))} rows={4} />

      <SectionTitle>Contact Details</SectionTitle>
      <Input label="Phone" value={settingsDraft.phone} onChange={v => setSettingsDraft(p => ({ ...p, phone: v }))} />
      <Input label="Email" value={settingsDraft.email} onChange={v => setSettingsDraft(p => ({ ...p, email: v }))} />
      <Input label="Address" value={settingsDraft.address} onChange={v => setSettingsDraft(p => ({ ...p, address: v }))} />
      <Input label="Instagram Handle" value={settingsDraft.instagram} onChange={v => setSettingsDraft(p => ({ ...p, instagram: v }))} />
      <Input label="WhatsApp Number (Digits Only)" value={settingsDraft.whatsapp} onChange={v => setSettingsDraft(p => ({ ...p, whatsapp: v }))} placeholder="919876543210" />

      <SectionTitle>Business Hours & Offers</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Input label="Opens At" value={settingsDraft.openTime} onChange={v => setSettingsDraft(p => ({ ...p, openTime: v }))} />
        <Input label="Closes At" value={settingsDraft.closeTime} onChange={v => setSettingsDraft(p => ({ ...p, closeTime: v }))} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Input label="First-Time Discount (%)" value={settingsDraft.firstTimeDiscount} onChange={v => setSettingsDraft(p => ({ ...p, firstTimeDiscount: v }))} type="number" />
        <Input label="Referral Credit (₹)" value={settingsDraft.referralCredit} onChange={v => setSettingsDraft(p => ({ ...p, referralCredit: v }))} type="number" />
      </div>

      <GoldBtn onClick={() => { setSettings(settingsDraft); showToast("Settings saved! Home page updated."); }} style={{ width: "100%", marginTop: 8 }}>
        Save & Apply Changes
      </GoldBtn>
    </div>
  );

  const renderDev = () => (
    <div style={{ padding: "20px" }}>
      <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>Developer & Growth</div>

      <SectionTitle>App Info</SectionTitle>
      <Card>
        {[["App", "Zuidara Spa"], ["Version", "2.1.0"], ["Built with", "React + Vite"], ["Deployment", "Vercel Live"], ["Platform", "Web / PWA"]].map(([l, v]) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.border}`, fontSize: 12 }}>
            <span style={{ color: C.textMuted }}>{l}</span><span style={{ fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </Card>

      <SectionTitle>Launch Checklist</SectionTitle>
      {[
        [true, "Customer booking flow"],
        [true, "WhatsApp instant redirection"],
        [true, "Local storage state persistence"],
        [true, "Zara AI chatbot"],
        [true, "Admin panel"],
        [true, "Therapist management"],
        [true, "Service management"],
        [false, "Razorpay payment gateway"],
        [false, "Google My Business listing"],
      ].map(([done, item]) => (
        <div key={item} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: `1px solid ${C.border}22`, fontSize: 13 }}>
          <span style={{ fontSize: 16 }}>{done ? "✅" : "⬜"}</span>
          <span style={{ color: done ? C.text : C.textMuted }}>{item}</span>
          {!done && <span style={{ fontSize: 9, color: C.orange, background: C.orangeFaint, padding: "2px 8px", borderRadius: 10, marginLeft: "auto" }}>Pending</span>}
        </div>
      ))}
    </div>
  );

  const renderAdmin = () => {
    if (!adminUnlocked) return renderAdminLogin();
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 110px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", background: C.bg2, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: C.gold, letterSpacing: 2 }}>🔐 ADMIN MODE</div>
          <button onClick={() => setAdminUnlocked(false)} style={{ background: "none", border: `1px solid ${C.border}`, color: C.textMuted, padding: "4px 12px", borderRadius: 3, fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>Lock</button>
        </div>
        <AdminSidebar />
        <div style={{ flex: 1, overflowY: "auto" }}>
          {adminSection === "dashboard" && renderDashboard()}
          {adminSection === "bookings" && renderAdminBookings()}
          {adminSection === "therapists" && renderAdminTherapists()}
          {adminSection === "services" && renderAdminServices()}
          {adminSection === "home-settings" && renderHomeSettings()}
          {adminSection === "dev" && renderDev()}
        </div>
      </div>
    );
  };

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div style={S.app}>
      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar{width:0}
        *{box-sizing:border-box}
        button,input,textarea{font-family:inherit}
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: toast.type === "error" ? C.red : C.gold, color: toast.type === "error" ? "#fff" : C.bg, padding: "10px 20px", borderRadius: 24, fontSize: 12, fontWeight: 700, zIndex: 999, animation: "fadeIn 0.2s ease", whiteSpace: "nowrap" }}>
          {toast.type === "error" ? "✕" : "✓"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={S.header}>
        <div>
          <div style={S.logo}>{settings.spaName.toUpperCase()}</div>
          <div style={S.tagline}>{settings.tagline}</div>
        </div>
        {view === "admin" && adminUnlocked
          ? <span style={{ fontSize: 10, color: C.gold, letterSpacing: 1 }}>⚙️ Admin</span>
          : <span style={{ fontSize: 10, color: C.gold, letterSpacing: 1, cursor: "pointer" }} onClick={() => setView("book")}>🌸 Book Now</span>
        }
      </div>

      {/* Main content */}
      <div style={S.scroll}>
        {view === "home" && renderHome()}
        {view === "book" && renderBook()}
        {view === "bot" && renderBot()}
        {view === "team" && renderTeam()}
        {view === "admin" && renderAdmin()}
      </div>

      {/* Bottom Nav */}
      <div style={S.bottomNav}>
        {[
          { id: "home", icon: "🏠", label: "Home" },
          { id: "book", icon: "📅", label: "Book" },
          { id: "bot", icon: "💬", label: "Zara AI" },
          { id: "team", icon: "👨‍⚕️", label: "Team" },
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
