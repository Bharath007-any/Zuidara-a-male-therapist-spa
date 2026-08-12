import { useState, useEffect, useRef } from "react";

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
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

// ── INITIAL DATASETS ─────────────────────────────────────────────────────────
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

const INIT_MEMBERSHIPS = [
  { id: "essential", name: "Essential Tier", price: 1299, period: "month", perks: ["1 Session / Month", "10% Off Additional Services", "Birthday Benefit"], badge: "Popular" },
  { id: "premium", name: "Premium Tier", price: 2399, period: "month", perks: ["2 Sessions / Month", "15% Off Additional Services", "Priority Slot Allocation"], badge: "Best Value" },
  { id: "elite", name: "Elite Tier", price: 4499, period: "month", perks: ["4 Sessions / Month", "20% Off Additional Services", "24/7 VIP Concierge"], badge: "VIP" },
];

const SLOTS = ["10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM", "7:00 PM"];

const BOT_FLOWS = {
  welcome: { msg: "Namaste 🌸 Welcome to Zuidara Spa. I'm Zara, your personal wellness guide. How can I help you today?", options: ["Book a massage", "View our services", "Special offers", "Contact us"] },
  book: { msg: "Wonderful! Which treatment calls to you?", options: ["Swedish Relaxation ₹1,499", "Deep Tissue ₹1,999", "Aromatherapy ₹1,799", "Hot Stone ₹2,299"] },
  services: { msg: "Our sessions use premium oils and certified therapists who come to your home.", options: ["Book now", "View pricing", "← Back"] },
  offers: { msg: "🎁 This week's exclusive offers:\n• First-time guest: 20% off\n• Refer a friend: ₹500 credit", options: ["Claim 20% off", "Book a session", "← Back"] },
  confirm: { msg: "🎉 Your session request is ready! Click below to finalize your booking via WhatsApp.", options: ["Book another", "Back to home"] },
};

const getSavedData = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
};

// ── REUSABLE UI ───────────────────────────────────────────────────────────────
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
  const [therapists, setTherapists] = useState(() => getSavedData("zuidara_therapists", INIT_THERAPISTS));
  const [services, setServices] = useState(() => getSavedData("zuidara_services", INIT_SERVICES));
  const [bookings, setBookings] = useState(() => getSavedData("zuidara_bookings", INIT_BOOKINGS));
  const [settings, setSettings] = useState(() => getSavedData("zuidara_settings", INIT_SETTINGS));

  useEffect(() => { try { localStorage.setItem("zuidara_therapists", JSON.stringify(therapists)); } catch(e){} }, [therapists]);
  useEffect(() => { try { localStorage.setItem("zuidara_services", JSON.stringify(services)); } catch(e){} }, [services]);
  useEffect(() => { try { localStorage.setItem("zuidara_bookings", JSON.stringify(bookings)); } catch(e){} }, [bookings]);
  useEffect(() => { try { localStorage.setItem("zuidara_settings", JSON.stringify(settings)); } catch(e){} }, [settings]);

  // Navigation
  const [view, setView] = useState("home"); // home | book | bot | recommend | membership | giftcards | admin
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

  // Quiz State
  const [quizGoal, setQuizGoal] = useState("");
  const [recommendedTreatment, setRecommendedTreatment] = useState(null);

  // Bot State
  const [botMessages, setBotMessages] = useState([]);
  const [botInput, setBotInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const botEndRef = useRef(null);

  // Gift Card State
  const [giftRecipient, setGiftRecipient] = useState("");

  // Toast & Admin State
  const [toast, setToast] = useState(null);
  const [recentPopup, setRecentPopup] = useState(null);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [settingsDraft, setSettingsDraft] = useState(settings);

  // Modals for Admin
  const [editTherapist, setEditTherapist] = useState(null);
  const [editService, setEditService] = useState(null);
  const [showAddTherapist, setShowAddTherapist] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [newTherapist, setNewTherapist] = useState({ name: "", specialty: "", phone: "", experience: "", certifications: "", gender: "male", available: true, photo: "👨‍⚕️", rating: 4.8, reviews: 0 });
  const [newService, setNewService] = useState({ name: "", price: "", duration: "", desc: "", emoji: "💆", active: true });

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 2800); };

  // Social Proof Banner Trigger
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
    }, 800);
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

  const selectedServiceObj = services.find(s => s.id === selectedService);
  const selectedTherapistObj = therapists.find(t => t.id === selectedTherapist);

  const handleRecommendation = () => {
    if (!quizGoal) return showToast("Select your wellness goal", "error");
    const found = services.find(s => s.goal === quizGoal) || services[0];
    setRecommendedTreatment(found);
  };

  // Stats for Admin
  const totalRevenue = bookings.filter(b => b.status === "completed").reduce((s, b) => s + Number(b.amount || 0), 0);
  const totalBookings = bookings.length;

  // Styles
  const S = {
    app: { fontFamily: "sans-serif", background: C.bg, color: C.text, minHeight: "100vh", maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", position: "relative" },
    header: { background: `linear-gradient(135deg, ${C.bg2} 0%, #2D1810 100%)`, padding: "16px 20px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 },
    logo: { fontSize: 20, fontWeight: 700, letterSpacing: 3, color: C.gold },
    tagline: { fontSize: 9, color: C.textFaint, letterSpacing: 2, textTransform: "uppercase", marginTop: 2 },
    scroll: { flex: 1, overflowY: "auto" },
    bottomNav: { background: C.bg2, borderTop: `1px solid ${C.border}`, display: "flex", padding: "8px 0 10px", flexShrink: 0 },
    navItem: (a) => ({ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", padding: "4px 0", opacity: a ? 1 : 0.38 }),
    navIcon: { fontSize: 18 },
    navLabel: (a) => ({ fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", color: a ? C.gold : C.textFaint, fontWeight: a ? 700 : 400 }),
  };

  // ── ADMIN RENDERER ──────────────────────────────────────────────────────────
  const renderAdmin = () => {
    if (!adminUnlocked) {
      return (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🔐</div>
          <div style={{ fontSize: 18, color: C.gold, marginBottom: 16 }}>Admin Access</div>
          <Input label="PIN" value={adminPin} onChange={setAdminPin} type="password" placeholder="1234" />
          <GoldBtn onClick={() => { if (adminPin === "1234" || adminPin === "") setAdminUnlocked(true); else showToast("Incorrect PIN", "error"); }} style={{ width: "100%" }}>Unlock</GoldBtn>
        </div>
      );
    }

    return (
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: C.gold, letterSpacing: 2 }}>⚙️ ADMIN MODE</div>
          <GhostBtn small onClick={() => setAdminUnlocked(false)}>Lock</GhostBtn>
        </div>

        {/* Admin Section Tabs */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 16, borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>
          {["dashboard", "bookings", "therapists", "services", "settings"].map(tab => (
            <button key={tab} onClick={() => setAdminSection(tab)}
              style={{ background: adminSection === tab ? C.goldFaint : "transparent", border: `1px solid ${adminSection === tab ? C.gold : C.border}`, color: adminSection === tab ? C.gold : C.textMuted, padding: "6px 12px", borderRadius: 16, fontSize: 10, cursor: "pointer", textTransform: "uppercase" }}>
              {tab}
            </button>
          ))}
        </div>

        {adminSection === "dashboard" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <Card><div style={{ fontSize: 10, color: C.textFaint }}>REVENUE</div><div style={{ fontSize: 18, color: C.gold, fontWeight: 700 }}>₹{totalRevenue.toLocaleString()}</div></Card>
              <Card><div style={{ fontSize: 10, color: C.textFaint }}>BOOKINGS</div><div style={{ fontSize: 18, color: C.blue, fontWeight: 700 }}>{totalBookings}</div></Card>
            </div>
            <SectionTitle>Recent Activity</SectionTitle>
            {bookings.slice(-3).reverse().map(b => (
              <Card key={b.id}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{b.customer}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{b.service} · {b.slot}</div>
              </Card>
            ))}
          </div>
        )}

        {adminSection === "bookings" && (
          <div>
            <SectionTitle>Manage Bookings</SectionTitle>
            {bookings.map(b => (
              <Card key={b.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{b.customer} ({b.phone})</div>
                  <Badge status={b.status} />
                </div>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>{b.service} · {b.slot}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {b.status === "pending" && <GoldBtn small onClick={() => { setBookings(p => p.map(x => x.id === b.id ? { ...x, status: "confirmed" } : x)); showToast("Confirmed!"); }}>Confirm</GoldBtn>}
                  <GhostBtn small onClick={() => { setBookings(p => p.filter(x => x.id !== b.id)); showToast("Removed"); }}>Delete</GhostBtn>
                </div>
              </Card>
            ))}
          </div>
        )}

        {adminSection === "therapists" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <SectionTitle>Therapists</SectionTitle>
              <GoldBtn small onClick={() => setShowAddTherapist(true)}>+ Add</GoldBtn>
            </div>
            {therapists.map(t => (
              <Card key={t.id}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>{t.specialty}</div>
                <GhostBtn small onClick={() => { setTherapists(p => p.map(x => x.id === t.id ? { ...x, available: !x.available } : x)); showToast("Status changed!"); }}>
                  {t.available ? "Set Unavailable" : "Set Available"}
                </GhostBtn>
              </Card>
            ))}
          </div>
        )}

        {adminSection === "services" && (
          <div>
            <SectionTitle>Services</SectionTitle>
            {services.map(s => (
              <Card key={s.id}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: C.gold, fontWeight: 700 }}>₹{s.price.toLocaleString()}</div>
              </Card>
            ))}
          </div>
        )}

        {adminSection === "settings" && (
          <div>
            <SectionTitle>Settings</SectionTitle>
            <Input label="Spa Name" value={settingsDraft.spaName} onChange={v => setSettingsDraft(p => ({ ...p, spaName: v }))} />
            <Input label="WhatsApp Number" value={settingsDraft.whatsapp} onChange={v => setSettingsDraft(p => ({ ...p, whatsapp: v }))} />
            <Input label="Make.com Webhook URL" value={settingsDraft.makeWebhookUrl || ""} onChange={v => setSettingsDraft(p => ({ ...p, makeWebhookUrl: v }))} />
            <GoldBtn onClick={() => { setSettings(settingsDraft); showToast("Saved!"); }} style={{ width: "100%" }}>Save Settings</GoldBtn>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={S.app}>
      {toast && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: toast.type === "error" ? C.red : C.gold, color: toast.type === "error" ? "#fff" : C.bg, padding: "8px 18px", borderRadius: 20, fontSize: 12, fontWeight: 700, zIndex: 999 }}>
          {toast.msg}
        </div>
      )}

      {recentPopup && (
        <div style={{ position: "fixed", bottom: 70, left: 20, right: 20, background: C.bg2, border: `1px solid ${C.borderGold}`, color: C.text, padding: "10px 14px", borderRadius: 8, fontSize: 11, boxShadow: "0 4px 20px rgba(0,0,0,0.5)", zIndex: 99, display: "flex", alignItems: "center", gap: 10 }}>
          <span>🔥</span> <span>{recentPopup}</span>
        </div>
      )}

      {/* Header */}
      <div style={S.header}>
        <div>
          <div style={S.logo}>{settings.spaName.toUpperCase()}</div>
          <div style={S.tagline}>{settings.tagline}</div>
        </div>
        <span style={{ fontSize: 10, color: C.gold, letterSpacing: 1, cursor: "pointer" }} onClick={() => { setView("book"); setBookStep(1); }}>🌸 Book Now</span>
      </div>

      {/* Scrollable Views */}
      <div style={S.scroll}>
        {view === "home" && (
          <div style={{ padding: "0 0 32px" }}>
            <div style={{ background: `linear-gradient(180deg, ${C.bg2} 0%, ${C.bg} 100%)`, padding: "36px 24px 32px", textAlign: "center" }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>🌸</div>
              <h1 style={{ fontSize: 32, fontWeight: 300, margin: 0, letterSpacing: 1, lineHeight: 1.2 }}>
                Your time.<br /><em style={{ color: C.gold }}>Your wellness.</em>
              </h1>
              <GoldDivider />
              <p style={{ fontSize: 11, color: C.textMuted, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 24px" }}>{settings.tagline}</p>
              <GoldBtn onClick={() => { setView("book"); setBookStep(1); }} style={{ width: "100%", marginBottom: 10 }}>Book An Appointment</GoldBtn>
              <GhostBtn onClick={() => setView("recommend")} style={{ width: "100%", marginBottom: 10 }}>✨ Not Sure What To Book?</GhostBtn>
              <GhostBtn onClick={() => setView("bot")} style={{ width: "100%" }}>💬 Chat with Zara AI</GhostBtn>
            </div>

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
          </div>
        )}

        {view === "bot" && (
          <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
            <div style={{ padding: "12px 20px", background: C.bg2, borderBottom: `1px solid ${C.border}`, fontSize: 13, fontWeight: 700, color: C.gold }}>
              Zara · AI Wellness Assistant
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              {botMessages.map(msg => (
                <div key={msg.id} style={{ alignSelf: msg.from === "user" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                  <div style={{ background: msg.from === "user" ? C.gold : C.bg2, color: msg.from === "user" ? C.bg : C.text, padding: "10px 14px", borderRadius: 12, fontSize: 13 }}>
                    {msg.text}
                  </div>
                  {msg.options && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                      {msg.options.map(opt => (
                        <button key={opt} onClick={() => handleBotOption(opt)}
                          style={{ background: "transparent", border: `1px solid ${C.gold}`, color: C.gold, padding: "4px 10px", borderRadius: 16, fontSize: 11, cursor: "pointer" }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={botEndRef} />
            </div>
            <div style={{ padding: 12, background: C.bg2, display: "flex", gap: 8 }}>
              <input value={botInput} onChange={e => setBotInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleBotSend()} placeholder="Ask Zara anything..." style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, color: C.text, padding: "8px 12px", borderRadius: 20, fontSize: 13, outline: "none" }} />
              <button onClick={handleBotSend} style={{ background: C.gold, border: "none", width: 36, height: 36, borderRadius: "50%", cursor: "pointer" }}>➤</button>
            </div>
          </div>
        )}

        {view === "recommend" && (
          <div style={{ padding: "20px" }}>
            <SectionTitle>Personalized Treatment Finder</SectionTitle>
            {!recommendedTreatment ? (
              <>
                <div style={{ fontSize: 10, color: C.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Select your primary goal</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                  {["Relax", "Relieve muscle tension", "Refresh", "Stress relief"].map(g => (
                    <button key={g} onClick={() => setQuizGoal(g)}
                      style={{ background: quizGoal === g ? C.goldFaint : C.bg2, border: `1px solid ${quizGoal === g ? C.gold : C.border}`, color: quizGoal === g ? C.gold : C.text, padding: 12, borderRadius: 4, fontSize: 12, cursor: "pointer" }}>
                      {g}
                    </button>
                  ))}
                </div>
                <GoldBtn onClick={handleRecommendation} style={{ width: "100%" }}>Get Recommendation →</GoldBtn>
              </>
            ) : (
              <Card style={{ borderColor: C.borderGold, textAlign: "center", padding: 24 }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>{recommendedTreatment.emoji}</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{recommendedTreatment.name}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>{recommendedTreatment.desc}</div>
                <GoldBtn onClick={() => { setSelectedService(recommendedTreatment.id); setView("book"); setBookStep(2); }} style={{ width: "100%", marginBottom: 10 }}>Book This Treatment →</GoldBtn>
                <GhostBtn onClick={() => setRecommendedTreatment(null)} style={{ width: "100%" }}>Reset Quiz</GhostBtn>
              </Card>
            )}
          </div>
        )}

        {view === "membership" && (
          <div style={{ padding: "20px" }}>
            <SectionTitle>Zuidara Memberships</SectionTitle>
            {INIT_MEMBERSHIPS.map(m => (
              <Card key={m.id}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{m.name}</div>
                <div style={{ fontSize: 20, color: C.gold, fontWeight: 700, margin: "6px 0 12px" }}>₹{m.price.toLocaleString()} / {m.period}</div>
                <GoldBtn onClick={() => showToast(`Selected ${m.name}. Concierge will contact you!`)} style={{ width: "100%" }}>Subscribe Tier</GoldBtn>
              </Card>
            ))}
          </div>
        )}

        {view === "giftcards" && (
          <div style={{ padding: "20px" }}>
            <SectionTitle>Gift Zuidara</SectionTitle>
            <Card>
              <Input label="Recipient Mobile or Email" value={giftRecipient} onChange={setGiftRecipient} placeholder="+91 98765 43210" />
              <GoldBtn onClick={() => { if (!giftRecipient) return showToast("Enter recipient info", "error"); showToast(`Gift Voucher sent to ${giftRecipient}!`); }} style={{ width: "100%" }}>Purchase Gift Card →</GoldBtn>
            </Card>
          </div>
        )}

        {view === "book" && (
          <div style={{ padding: "20px" }}>
            {bookStep === 1 && (
              <>
                <SectionTitle>Choose Service</SectionTitle>
                {services.filter(s => s.active).map(s => (
                  <Card key={s.id} onClick={() => { setSelectedService(s.id); setBookStep(2); }} style={{ cursor: "pointer" }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: 13, color: C.gold, fontWeight: 700, marginTop: 4 }}>₹{s.price.toLocaleString()} · {s.duration}</div>
                  </Card>
                ))}
              </>
            )}

            {bookStep === 2 && (
              <>
                <SectionTitle>Customer Details</SectionTitle>
                <Input label="Your Name" value={customerName} onChange={setCustomerName} placeholder="e.g. Divya Sharma" />
                <Input label="Mobile Number" value={customerPhone} onChange={setCustomerPhone} placeholder="+91 98765 43210" type="tel" />
                <GoldBtn onClick={() => { if (customerName && customerPhone) setBookStep(3); else showToast("Please enter name & phone", "error"); }} style={{ width: "100%", marginTop: 8 }}>Continue →</GoldBtn>
                <GhostBtn onClick={() => setBookStep(1)} style={{ width: "100%", marginTop: 10 }}>← Back</GhostBtn>
              </>
            )}

            {bookStep === 3 && (
              <>
                <SectionTitle>Choose Therapist</SectionTitle>
                {therapists.map(t => (
                  <Card key={t.id} onClick={() => { setSelectedTherapist(t.id); setBookStep(4); }} style={{ cursor: "pointer" }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>{t.specialty}</div>
                  </Card>
                ))}
                <GhostBtn onClick={() => setBookStep(2)} style={{ width: "100%" }}>← Back</GhostBtn>
              </>
            )}

            {bookStep === 4 && !bookingDone && (
              <>
                <SectionTitle>Pick Time Slot</SectionTitle>
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
                <GoldBtn onClick={() => { setBookingDone(false); setBookStep(1); setView("home"); }} style={{ width: "100%", marginTop: 16 }}>Return to Home</GoldBtn>
              </div>
            )}
          </div>
        )}

        {view === "admin" && renderAdmin()}
      </div>

      {/* Navigation Bar */}
      <div style={S.bottomNav}>
        {[
          { id: "home", icon: "🏠", label: "Home" },
          { id: "bot", icon: "💬", label: "Zara AI" },
          { id: "book", icon: "📅", label: "Book" },
          { id: "membership", icon: "👑", label: "Pass" },
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
