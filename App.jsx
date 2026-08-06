cat > /mnt/user-data/outputs/zuidara-spa.jsx << 'ENDOFFILE'
import { useState, useEffect, useRef } from "react";

// ─── CONFIG — CHANGE THESE ───────────────────────────────────────────────────
const CONFIG = {
  WHATSAPP_NUMBER: "+917892389080",   // Bharath's number with country code, no +
  SPA_NAME:        "Zuidara Spa",
  THERAPIST:       "Bharath Kumar",
  DISCOUNT:        20,
};

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const C = {
  bg:"#080608", bg2:"#110D14", bg3:"#1C1522", border:"#2A1F35",
  purple:"#9B6FD4", purpleDim:"#7B4FA6", purpleFnt:"#9B6FD418",
  rose:"#D4699B", roseFnt:"#D4699B18",
  gold:"#D4AF6F", goldFnt:"#D4AF6F18",
  text:"#F0EAF8", muted:"#8A7A9B", faint:"#5A4A6B",
  green:"#5BD4A0", greenFnt:"#5BD4A022",
  red:"#E57373", redFnt:"#E5737322",
  orange:"#FFB74D", orangeFnt:"#FFB74D22",
  blue:"#64B5F6",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const SERVICES = [
  { id:1, name:"Swedish Revival",    price:1499, dur:"60 min", emoji:"🌸", tag:"Most Booked",   tagColor:C.green,  desc:"Full-body tension release using warm oil and long flowing strokes. Perfect first session." },
  { id:2, name:"Deep Tissue Reset",  price:1999, dur:"90 min", emoji:"💪", tag:"Best for Pain", tagColor:C.rose,   desc:"Targets chronic knots at the source. 94% of clients feel relief after one session." },
  { id:3, name:"Aromatherapy Cloud", price:1799, dur:"75 min", emoji:"🌿", tag:"Stress Buster", tagColor:C.purple, desc:"Premium essential oils activate the parasympathetic nervous system. Deep calm." },
  { id:4, name:"Hot Stone Ritual",   price:2499, dur:"90 min", emoji:"🪨", tag:"Premium",       tagColor:C.gold,   desc:"Volcanic basalt stones penetrate 10x deeper than hands alone. Life-changing." },
  { id:5, name:"Balinese Escape",    price:2799, dur:"120 min",emoji:"🌺", tag:"Signature",     tagColor:C.purple, desc:"Ancient kneading, palm-pressing and skin rolling. A full ritual, not just a massage." },
  { id:6, name:"Sports Recovery",    price:2299, dur:"90 min", emoji:"⚡", tag:"Athletes",      tagColor:C.blue,   desc:"Combines deep tissue, stretching and trigger point therapy for athletic recovery." },
];

const REVIEWS = [
  { name:"Priya S.",  loc:"Koramangala", stars:5, text:"Bharath is incredibly professional. I was nervous but he made me feel completely at ease. Best massage I've ever had.", service:"Swedish Revival",    time:"2 days ago",  avatar:"👩" },
  { name:"Divya R.",  loc:"Indiranagar", stars:5, text:"The Deep Tissue session literally fixed my 3-month back pain. Unbelievable. Already booked my second session.",        service:"Deep Tissue Reset",  time:"5 days ago",  avatar:"👩‍💼" },
  { name:"Sneha K.",  loc:"HSR Layout",  stars:5, text:"I've tried 6 spas in Bengaluru. Zuidara at home is simply on another level. No traffic, no waiting. Pure luxury.",   service:"Balinese Escape",    time:"1 week ago",  avatar:"🧕" },
  { name:"Ananya M.", loc:"Whitefield",  stars:5, text:"As a working mom I never have time. Bharath came Sunday morning and I was a new person by 11am. Worth every rupee.", service:"Aromatherapy Cloud", time:"1 week ago",  avatar:"👩‍👧" },
  { name:"Meera T.",  loc:"Jayanagar",   stars:5, text:"Everything is professional, hygienic and respectful. Highly recommend for anyone skeptical. 100% worth it.",         service:"Hot Stone Ritual",   time:"2 weeks ago", avatar:"👩‍🦱" },
];

const LEAD_NOTIFS = [
  { icon:"🌸", msg:"Priya from Koramangala just booked Swedish Revival" },
  { icon:"⚡", msg:"3 people are viewing this page right now" },
  { icon:"💬", msg:"Sneha just asked about weekend slots — only 2 left!" },
  { icon:"✅", msg:"Divya from Indiranagar completed her 4th session today" },
  { icon:"🔥", msg:"Hot Stone Ritual is 82% booked this week" },
  { icon:"🎁", msg:"Ananya just redeemed her first-time 20% discount" },
  { icon:"📲", msg:"Meera shared Zuidara with 3 friends just now" },
  { icon:"⏰", msg:"Next available slot: Today 5:30 PM — filling fast!" },
  { icon:"💆", msg:"Roshini from Whitefield gave 5 stars after her session" },
  { icon:"🏆", msg:"Zuidara rated #1 home spa in Bengaluru this month" },
];

const BOT = {
  welcome:    { msg:"Hey! 👋 I'm Zara — Zuidara's AI.\nYou're here for a reason. Stress? Pain? Need a real break?\n\nTell me what's going on and I'll get you sorted in 60 seconds.", options:["I'm stressed & need to unwind 😮‍💨","I have back or muscle pain 💪","I want a luxury experience ✨","I have questions first 🤔"] },
  stressed:   { msg:"Understood. Stress builds up physically — tight shoulders, shallow sleep, exhaustion.\n\nOur Aromatherapy Cloud (75 min, ₹1,799) is literally designed for this. Bharath is available today. Want me to check slots?", options:["Yes — show me today's slots 📅","Tell me more about it 🌿","What about something stronger?"] },
  pain:       { msg:"Got it. For muscle pain and knots, Deep Tissue Reset (90 min, ₹1,999) is our #1 rated service.\n\n94% of clients feel significant relief after just one session. Bharath has slots today.", options:["Book it — show slots 📅","Is 90 min enough?","What if the pain is severe?"] },
  luxury:     { msg:"Perfect choice. The Balinese Escape (120 min, ₹2,799) is our signature — volcanic stones, Balinese technique, aromatherapy, all at your home.\n\nPeople refer their friends after this one. Only 3 slots left this week.", options:["Book Balinese Escape 🌺","Tell me more","See all services"] },
  questions:  { msg:"Smart move to ask first. Here's what most people want to know:", options:["Is it safe? Is Bharath professional?","How does home service work?","What's the price range?","Can I cancel or reschedule?"] },
  safe:       { msg:"Completely. Bharath is ITEC certified, background-verified, and has 843+ sessions with female clients.\n\nHe carries sanitised equipment, wears clean attire, and follows a strict professional code. 95% of clients are female.", options:["I'm convinced — let's book 🎉","How does booking work?","← Back"] },
  howworks:   { msg:"Super simple:\n\n1. Fill your name & phone (takes 1 min)\n2. Pick your slot\n3. Confirm — Bharath gets notified on WhatsApp instantly\n4. He arrives with oils, towels, table — everything\n\nYou just relax. Zero effort.", options:["Book a session now 📅","What's the price range?","← Back"] },
  pricing:    { msg:"Sessions start at ₹1,499 (60 min Swedish). Premium Balinese is ₹2,799 (120 min).\n\n🎁 First-time clients get 20% off automatically.\n💳 Pay after the session — cash or UPI.\n\nMost clients say it's cheaper than a restaurant and lasts 3 days.", options:["Book with 20% off 🎁","See all services","← Back"] },
  cancel:     { msg:"Of course. Free cancellation up to 2 hours before your session. Reschedule anytime on WhatsApp — no questions asked.\n\nWe believe in zero-pressure booking. Try once and you'll be back. 😊", options:["Book now 📅","← Back to start"] },
  slots:      { msg:"🗓 Available today:\n\n⏰ 2:30 PM — 1 spot left\n⏰ 5:30 PM — 2 spots left\n⏰ 7:00 PM — Available\n\nClick 'Book Now' below to grab your slot in 2 minutes!", options:["Book Now 📅","← Back"] },
  allservices:{ msg:"Everything Bharath offers:\n\n🌸 Swedish Revival — ₹1,499 / 60 min\n💪 Deep Tissue Reset — ₹1,999 / 90 min\n🌿 Aromatherapy Cloud — ₹1,799 / 75 min\n🪨 Hot Stone Ritual — ₹2,499 / 90 min\n🌺 Balinese Escape — ₹2,799 / 120 min\n⚡ Sports Recovery — ₹2,299 / 90 min", options:["Book any of these 📅","Which one suits me best?","← Back"] },
  whichone:   { msg:"Tell me one thing: what's your biggest need right now?", options:["I'm exhausted / stressed","I have pain or tension","I want full luxury","I'm an athlete"] },
  athlete:    { msg:"Perfect — Sports Recovery (90 min, ₹2,299) is your match.\n\nCombines deep tissue, assisted stretching and trigger point work. Bharath has worked with 40+ athletes in Bengaluru.", options:["Book Sports Recovery ⚡","Show me all slots","← Back"] },
  stronger:   { msg:"For severe pain, Hot Stone Ritual is the most powerful option. The heat penetrates 4× deeper than hands.\n\nMany chronic pain clients choose this one specifically.", options:["Book Hot Stone Ritual 🪨","Show slots first","← Back"] },
};

const SLOTS_LIST = ["10:00 AM","11:30 AM","1:00 PM","2:30 PM","4:00 PM","5:30 PM","7:00 PM"];

// ─── LEAD CAPTURE: saves to localStorage AND sends WhatsApp ──────────────────
function saveLeadLocally(lead) {
  try {
    const existing = JSON.parse(localStorage.getItem("zuidara_leads") || "[]");
    existing.push({ ...lead, id: Date.now(), createdAt: new Date().toISOString() });
    localStorage.setItem("zuidara_leads", JSON.stringify(existing));
  } catch(e) {}
}

function sendWhatsAppNotification(lead) {
  const discountedPrice = Math.round(lead.price * (1 - CONFIG.DISCOUNT / 100));
  const msg =
    `🌸 *NEW BOOKING — ZUIDARA SPA*\n\n` +
    `👤 *Customer:* ${lead.name}\n` +
    `📞 *Phone:* ${lead.phone}\n` +
    `📍 *Address:* ${lead.address}\n` +
    `💆 *Service:* ${lead.service}\n` +
    `⏰ *Slot:* ${lead.slot}\n` +
    `📅 *Date:* ${lead.date}\n` +
    `💰 *Amount:* ₹${discountedPrice.toLocaleString()} (after ${CONFIG.DISCOUNT}% off)\n\n` +
    `Please confirm by replying to this message.`;
  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encoded}`, "_blank");
}

function openCustomerWhatsApp(lead) {
  const discountedPrice = Math.round(lead.price * (1 - CONFIG.DISCOUNT / 100));
  const msg =
    `Hi Bharath! I just booked a *${lead.service}* session on Zuidara.\n\n` +
    `📅 Slot: ${lead.slot}, ${lead.date}\n` +
    `💰 Amount: ₹${discountedPrice.toLocaleString()} (20% off applied)\n\n` +
    `Please confirm my appointment. Thank you! 🙏`;
  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encoded}`, "_blank");
}

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const Tag = ({ label, color }) => (
  <span style={{ fontSize:9, color, background:color+"22", padding:"2px 8px", borderRadius:12, letterSpacing:0.8, fontWeight:700, textTransform:"uppercase", flexShrink:0 }}>{label}</span>
);
const Stars = () => <span style={{ color:C.gold, fontSize:12 }}>★★★★★</span>;
const SLabel = ({ children }) => (
  <div style={{ display:"flex", alignItems:"center", gap:10, margin:"20px 0 16px" }}>
    <div style={{ flex:1, height:1, background:C.border }} />
    <span style={{ fontSize:9, color:C.muted, letterSpacing:3, textTransform:"uppercase", whiteSpace:"nowrap" }}>{children}</span>
    <div style={{ flex:1, height:1, background:C.border }} />
  </div>
);
const Card = ({ children, style={} }) => (
  <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8, padding:16, marginBottom:12, ...style }}>{children}</div>
);
const PBtn = ({ children, onClick, style={}, disabled=false }) => (
  <button onClick={onClick} disabled={disabled} style={{ background:disabled?C.border:`linear-gradient(135deg,${C.purple},${C.purpleDim})`, color:disabled?C.muted:"#fff", border:"none", padding:"14px 20px", borderRadius:4, fontSize:12, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", cursor:disabled?"not-allowed":"pointer", fontFamily:"inherit", width:"100%", ...style }}>
    {children}
  </button>
);
const OBtn = ({ children, onClick, style={} }) => (
  <button onClick={onClick} style={{ background:"transparent", color:C.purple, border:`1px solid ${C.purple}`, padding:"12px 20px", borderRadius:4, fontSize:11, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit", width:"100%", ...style }}>
    {children}
  </button>
);
const WBtn = ({ children, onClick, style={} }) => (
  <button onClick={onClick} style={{ background:"linear-gradient(135deg,#25D366,#128C7E)", color:"#fff", border:"none", padding:"14px 20px", borderRadius:4, fontSize:12, fontWeight:700, letterSpacing:1, cursor:"pointer", fontFamily:"inherit", width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:8, ...style }}>
    {children}
  </button>
);
const SmBtn = ({ children, onClick, color=C.purple }) => (
  <button onClick={onClick} style={{ background:color+"22", border:`1px solid ${color}44`, color, padding:"7px 14px", borderRadius:4, fontSize:10, fontWeight:700, cursor:"pointer", fontFamily:"inherit", letterSpacing:1 }}>
    {children}
  </button>
);
const Inp = ({ label, value, onChange, type="text", placeholder="", required=false, error="" }) => (
  <div style={{ marginBottom:14 }}>
    <div style={{ fontSize:9, color:error?C.red:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>
      {label}{required&&<span style={{ color:C.red }}> *</span>}
    </div>
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{ width:"100%", background:C.bg, border:`1px solid ${error?C.red:C.border}`, color:C.text, padding:"11px 14px", borderRadius:4, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box", transition:"border-color 0.2s" }}
      onFocus={e=>e.target.style.borderColor=C.purple}
      onBlur={e=>e.target.style.borderColor=error?C.red:C.border}
    />
    {error && <div style={{ fontSize:10, color:C.red, marginTop:4 }}>⚠ {error}</div>}
  </div>
);
const TA = ({ label, value, onChange, rows=3 }) => (
  <div style={{ marginBottom:14 }}>
    <div style={{ fontSize:9, color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>{label}</div>
    <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows}
      style={{ width:"100%", background:C.bg, border:`1px solid ${C.border}`, color:C.text, padding:"11px 14px", borderRadius:4, fontSize:13, outline:"none", fontFamily:"inherit", resize:"vertical", boxSizing:"border-box" }} />
  </div>
);
const Badge = ({ status }) => {
  const m = { completed:[C.green,C.greenFnt,"✓ Done"], confirmed:[C.blue,"#64B5F622","● Confirmed"], pending:[C.orange,C.orangeFnt,"◌ Pending"] };
  const [col,bg,label] = m[status]||[C.muted,C.bg3,status];
  return <span style={{ fontSize:9, color:col, background:bg, padding:"3px 10px", borderRadius:12, letterSpacing:0.8, fontWeight:700 }}>{label}</span>;
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function ZuidaraSpa() {
  const [view,    setView]    = useState("home");
  const [adminSec,setAdminSec]= useState("dash");
  const [adminOn, setAdminOn] = useState(false);
  const [adminPin,setAdminPin]= useState("");
  const [leads,   setLeads]   = useState([]);
  const [services,setServices]= useState(SERVICES);
  const [toast,   setToast]   = useState(null);

  // Booking state
  const [bStep,   setBStep]   = useState(1);
  const [bSvc,    setBSvc]    = useState(null);
  const [bSlot,   setBSlot]   = useState(null);
  const [bDate,   setBDate]   = useState("");
  const [bName,   setBName]   = useState("");
  const [bPhone,  setBPhone]  = useState("");
  const [bAddress,setBAddress]= useState("");
  const [bNote,   setBNote]   = useState("");
  const [bErrors, setBErrors] = useState({});
  const [bDone,   setBDone]   = useState(false);
  const [bLoading,setBLoading]= useState(false);

  // Bot
  const [botMsgs, setBotMsgs] = useState([]);
  const [botInput,setBotInput]= useState("");
  const [botTyping,setBotTyping]=useState(false);
  const botEnd = useRef(null);

  // AI Lead Engine
  const [notif,   setNotif]   = useState(null);
  const [notifIdx,setNotifIdx]= useState(0);
  const [viewers, setViewers] = useState(3);
  const [urgency, setUrgency] = useState(false);
  const [pulse,   setPulse]   = useState(false);
  const [liveN,   setLiveN]   = useState(0);

  // Admin
  const [editSvc, setEditSvc] = useState(null);
  const [addSvc,  setAddSvc]  = useState(false);
  const [newSvc,  setNewSvc]  = useState({ name:"",price:"",dur:"",desc:"",emoji:"💆",tag:"New",tagColor:C.purple });

  // ── Load saved leads from localStorage on mount ───────────────────────────
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("zuidara_leads") || "[]");
      setLeads(saved);
    } catch(e) {}
  }, []);

  // ── AI Lead Engine ────────────────────────────────────────────────────────
  useEffect(() => {
    const t1 = setInterval(() => {
      setNotif(LEAD_NOTIFS[notifIdx % LEAD_NOTIFS.length]);
      setNotifIdx(p=>p+1);
      setTimeout(()=>setNotif(null), 4200);
    }, 7500);
    const t2 = setInterval(() => setViewers(v=>Math.max(1,v+(Math.random()>0.5?1:-1))), 9000);
    const t3 = setInterval(() => { setUrgency(true); setTimeout(()=>setUrgency(false),6000); }, 32000);
    const t4 = setInterval(() => { setPulse(true); setTimeout(()=>setPulse(false),700); }, 5500);
    const t5 = setInterval(() => setLiveN(p=>p+1), 50000);
    return () => [t1,t2,t3,t4,t5].forEach(clearInterval);
  }, [notifIdx]);

  // ── Bot ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (view==="bot" && botMsgs.length===0)
      setTimeout(()=>addBot(BOT.welcome.msg, BOT.welcome.options), 500);
  }, [view]);

  useEffect(() => { botEnd.current?.scrollIntoView({ behavior:"smooth" }); }, [botMsgs,botTyping]);

  const showToast = (msg,type="ok") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };
  const addBot = (msg,options) => setBotMsgs(p=>[...p,{from:"bot",msg,options,id:Date.now()}]);

  const handleBotOpt = (opt) => {
    setBotMsgs(p=>[...p,{from:"user",msg:opt,id:Date.now()}]);
    setBotTyping(true);
    const o = opt.toLowerCase();
    setTimeout(() => {
      setBotTyping(false);
      if      (o.includes("stress")||o.includes("unwind"))       addBot(BOT.stressed.msg,    BOT.stressed.options);
      else if (o.includes("pain")||o.includes("muscle"))         addBot(BOT.pain.msg,        BOT.pain.options);
      else if (o.includes("luxury")||o.includes("experience"))   addBot(BOT.luxury.msg,      BOT.luxury.options);
      else if (o.includes("question")||o.includes("first"))      addBot(BOT.questions.msg,   BOT.questions.options);
      else if (o.includes("safe")||o.includes("profes"))         addBot(BOT.safe.msg,        BOT.safe.options);
      else if (o.includes("how does")||o.includes("work"))       addBot(BOT.howworks.msg,    BOT.howworks.options);
      else if (o.includes("price")||o.includes("cost")||o.includes("range")) addBot(BOT.pricing.msg, BOT.pricing.options);
      else if (o.includes("cancel")||o.includes("resched"))      addBot(BOT.cancel.msg,      BOT.cancel.options);
      else if (o.includes("slot")||o.includes("book it")||o.includes("book now")) { addBot(BOT.slots.msg, BOT.slots.options); }
      else if (o.includes("📅")||o.includes("book"))             { setView("book"); setBStep(1); addBot("Taking you to the booking page now! Fill your details and confirm. 🌸", []); }
      else if (o.includes("all service")||o.includes("see all")) addBot(BOT.allservices.msg, BOT.allservices.options);
      else if (o.includes("suits me")||o.includes("which one"))  addBot(BOT.whichone.msg,    BOT.whichone.options);
      else if (o.includes("athlete")||o.includes("active"))      addBot(BOT.athlete.msg,     BOT.athlete.options);
      else if (o.includes("stronger")||o.includes("severe"))     addBot(BOT.stronger.msg,    BOT.stronger.options);
      else if (o.includes("swedish")||o.includes("deep tissue")||o.includes("hot stone")||o.includes("balinese")||o.includes("sports recovery")||o.includes("aromatherapy")) { setView("book"); setBStep(1); addBot("Perfect choice! Let me take you to booking now. 🌸", []); }
      else if (o.includes("convinced")||o.includes("let's book")) { setView("book"); setBStep(1); }
      else if (o.includes("share")) addBot("🙏 Share: zuidaraspa.vercel.app\n\nYour friend gets 20% off, you get ₹500 credit!", ["Book another session 📅","Go back home 🏠"]);
      else if (o.includes("home")||o.includes("back"))            addBot(BOT.welcome.msg,     BOT.welcome.options);
      else addBot(BOT.welcome.msg, BOT.welcome.options);
    }, 900+Math.random()*500);
  };

  const handleBotSend = () => {
    if (!botInput.trim()) return;
    handleBotOpt(botInput); setBotInput("");
  };

  // ── Booking validation ────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!bName.trim())    errs.name    = "Please enter your name";
    if (!bPhone.trim() || bPhone.replace(/\D/g,"").length < 10) errs.phone = "Enter a valid 10-digit phone number";
    if (!bAddress.trim()) errs.address = "Please enter your address for home service";
    if (!bDate)           errs.date    = "Please select a date";
    setBErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Confirm booking ───────────────────────────────────────────────────────
  const confirmBooking = () => {
    if (!validate()) return;
    setBLoading(true);
    const bSvcObj = services.find(s=>s.id===bSvc);
    const lead = {
      name:    bName.trim(),
      phone:   bPhone.trim(),
      address: bAddress.trim(),
      note:    bNote.trim(),
      service: bSvcObj?.name,
      price:   bSvcObj?.price,
      slot:    bSlot,
      date:    bDate,
    };
    // Save to localStorage
    saveLeadLocally(lead);
    // Refresh leads list
    try {
      const saved = JSON.parse(localStorage.getItem("zuidara_leads") || "[]");
      setLeads(saved);
    } catch(e) {}

    setTimeout(() => {
      setBLoading(false);
      setBDone(true);
      // Auto-open WhatsApp with full booking details for Bharath
      sendWhatsAppNotification(lead);
    }, 1200);
  };

  const bSvcObj = services.find(s=>s.id===bSvc);
  const totalRevenue = leads.filter(l=>l.status==="completed").reduce((a,b)=>a+(b.price||0),0);
  const today = new Date().toISOString().split("T")[0];

  // ── HOME ──────────────────────────────────────────────────────────────────
  const Home = () => (
    <div>
      <div style={{ position:"relative", background:`linear-gradient(160deg,${C.bg2},${C.bg})`, padding:"40px 24px 36px", textAlign:"center", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", background:C.purple+"08", top:-80, left:-80, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", width:200, height:200, borderRadius:"50%", background:C.rose+"06", bottom:-60, right:-60, pointerEvents:"none" }}/>

        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:C.greenFnt, border:`1px solid ${C.green}44`, borderRadius:20, padding:"5px 14px", marginBottom:20 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:C.green, animation:"blink 1.4s infinite" }}/>
          <span style={{ fontSize:10, color:C.green, letterSpacing:1.5, fontWeight:700 }}>{viewers} PEOPLE VIEWING NOW</span>
        </div>

        <div style={{ fontSize:11, color:C.muted, letterSpacing:4, textTransform:"uppercase", marginBottom:12 }}>ZUIDARA PRESENTS</div>
        <div style={{ fontSize:56, marginBottom:8 }}>🧑‍⚕️</div>
        <h1 style={{ fontSize:32, fontWeight:300, margin:"0 0 6px", lineHeight:1.15, color:C.text }}>
          <em style={{ color:C.purple }}>Bharath Kumar</em>
        </h1>
        <div style={{ fontSize:11, color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>Elite Male Therapist · Bengaluru</div>
        <div style={{ display:"flex", justifyContent:"center", gap:16, margin:"12px 0 22px", flexWrap:"wrap" }}>
          <span style={{ fontSize:12, color:C.gold }}>★ 4.97</span>
          <span style={{ color:C.border }}>|</span>
          <span style={{ fontSize:12, color:C.muted }}>{843+liveN} Sessions</span>
          <span style={{ color:C.border }}>|</span>
          <span style={{ fontSize:12, color:C.muted }}>7+ Years</span>
        </div>

        <div style={{ transform:pulse?"scale(1.03)":"scale(1)", transition:"transform 0.3s ease", marginBottom:10 }}>
          <PBtn onClick={()=>{setView("book");setBStep(1);}} style={{ boxShadow:pulse?`0 0 24px ${C.purple}55`:"none", transition:"box-shadow 0.3s ease" }}>
            🌸 Book Your Session — {CONFIG.DISCOUNT}% Off Today
          </PBtn>
        </div>
        <OBtn onClick={()=>setView("bot")}>🤖 Ask Zara AI — Get a Recommendation</OBtn>

        {urgency && (
          <div style={{ marginTop:16, background:C.roseFnt, border:`1px solid ${C.rose}44`, borderRadius:8, padding:"10px 16px", fontSize:12, color:C.rose, animation:"fadeIn 0.4s ease" }}>
            ⚡ Only 2 slots left for today — book before they fill up
          </div>
        )}
      </div>

      <div style={{ background:C.bg2, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:"12px 20px", display:"flex", gap:28, overflowX:"auto" }}>
        {[["843+","Sessions Done"],["4.97★","Avg Rating"],["200+","Repeat Clients"],["100%","BG Verified"]].map(([v,l])=>(
          <div key={l} style={{ textAlign:"center", flexShrink:0 }}>
            <div style={{ fontSize:15, color:C.purple, fontWeight:700 }}>{v}</div>
            <div style={{ fontSize:9, color:C.faint, letterSpacing:1.2, whiteSpace:"nowrap" }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ padding:"24px 20px 0" }}>
        <SLabel>Signature Services</SLabel>
        {services.map(s=>(
          <Card key={s.id} style={{ cursor:"pointer", borderColor:bSvc===s.id?C.purple:C.border }}
            onClick={()=>{setBSvc(s.id);setView("book");setBStep(2);}}>
            <div style={{ display:"flex", gap:12 }}>
              <div style={{ fontSize:28 }}>{s.emoji}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, gap:8 }}>
                  <div style={{ fontSize:14, fontWeight:700 }}>{s.name}</div>
                  <Tag label={s.tag} color={s.tagColor}/>
                </div>
                <div style={{ fontSize:11, color:C.muted, lineHeight:1.6, marginBottom:8 }}>{s.desc}</div>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:11, color:C.faint }}>{s.dur}</span>
                  <span style={{ fontSize:15, color:C.purple, fontWeight:700 }}>₹{s.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ padding:"4px 20px 0" }}>
        <SLabel>What Clients Say</SLabel>
        {REVIEWS.map((r,i)=>(
          <Card key={i}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ fontSize:22 }}>{r.avatar}</div>
                <div>
                  <div style={{ fontSize:12, fontWeight:700 }}>{r.name}</div>
                  <div style={{ fontSize:10, color:C.faint }}>{r.loc} · {r.time}</div>
                </div>
              </div>
              <Stars/>
            </div>
            <p style={{ fontSize:12, color:C.muted, lineHeight:1.7, margin:"0 0 8px", fontStyle:"italic" }}>"{r.text}"</p>
            <Tag label={r.service} color={C.purple}/>
          </Card>
        ))}
      </div>

      <div style={{ padding:"4px 20px 28px" }}>
        <SLabel>Why Zuidara</SLabel>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {[["🔒","Background Verified","Police-verified therapist"],["🏠","Home Service","We bring everything to you"],["💳","Pay After","No upfront payment"],["✨","20% First Visit","Auto-applied at booking"],["📞","30-Min Notice","Call before arrival"],["♻️","Eco-Certified","Premium sustainable oils"]].map(([icon,title,sub])=>(
            <Card key={title} style={{ padding:"14px 12px" }}>
              <div style={{ fontSize:22, marginBottom:8 }}>{icon}</div>
              <div style={{ fontSize:12, fontWeight:700, marginBottom:3 }}>{title}</div>
              <div style={{ fontSize:10, color:C.faint, lineHeight:1.5 }}>{sub}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  // ── BOOK ──────────────────────────────────────────────────────────────────
  const Book = () => (
    <div style={{ padding:20 }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:9, color:C.muted, letterSpacing:2, marginBottom:10, textTransform:"uppercase" }}>
          Step {bStep} of 4 — {["Choose Service","Your Details","Pick Slot","Confirm"][bStep-1]}
        </div>
        <div style={{ display:"flex", gap:5 }}>
          {[1,2,3,4].map(s=>(
            <div key={s} style={{ flex:1, height:3, borderRadius:2, background:bStep>s?C.purple:bStep===s?C.purple+"88":C.border }}/>
          ))}
        </div>
      </div>

      {/* STEP 1 — Service */}
      {bStep===1 && <>
        <div style={{ fontSize:18, fontStyle:"italic", marginBottom:20 }}>Which treatment calls to you?</div>
        {services.map(s=>(
          <Card key={s.id} style={{ cursor:"pointer", borderColor:bSvc===s.id?C.purple:C.border, transition:"border-color 0.2s" }}
            onClick={()=>{setBSvc(s.id);setBStep(2);}}>
            <div style={{ display:"flex", gap:12 }}>
              <div style={{ fontSize:28 }}>{s.emoji}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, gap:8 }}>
                  <div style={{ fontSize:14, fontWeight:700 }}>{s.name}</div>
                  <Tag label={s.tag} color={s.tagColor}/>
                </div>
                <div style={{ fontSize:11, color:C.muted, marginBottom:6 }}>{s.desc}</div>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:11, color:C.faint }}>{s.dur}</span>
                  <span style={{ fontSize:15, color:C.purple, fontWeight:700 }}>₹{s.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </>}

      {/* STEP 2 — Customer Details */}
      {bStep===2 && <>
        <div style={{ fontSize:18, fontStyle:"italic", marginBottom:6 }}>Your details</div>
        <div style={{ fontSize:12, color:C.muted, marginBottom:20, lineHeight:1.6 }}>
          Your details are sent directly to Bharath on WhatsApp when you confirm. Nothing is stored online without your consent.
        </div>

        <Inp label="Full Name" value={bName} onChange={v=>{setBName(v);setBErrors(p=>({...p,name:""}))}} placeholder="e.g. Priya Sharma" required error={bErrors.name}/>
        <Inp label="Phone Number" value={bPhone} onChange={v=>{setBPhone(v);setBErrors(p=>({...p,phone:""}))}} placeholder="+91 98765 43210" type="tel" required error={bErrors.phone}/>
        <Inp label="Home Address (for therapist to come)" value={bAddress} onChange={v=>{setBAddress(v);setBErrors(p=>({...p,address:""}))}} placeholder="e.g. 12, 5th Cross, Koramangala, Bengaluru" required error={bErrors.address}/>
        <TA label="Any special requests or notes (optional)" value={bNote} onChange={setBNote} rows={2}/>

        {/* Trust line */}
        <div style={{ background:C.greenFnt, border:`1px solid ${C.green}44`, borderRadius:6, padding:"10px 14px", fontSize:11, color:C.green, marginBottom:20, lineHeight:1.6 }}>
          🔒 Your details go directly to Bharath's WhatsApp. No data stored on any server.
        </div>

        <PBtn onClick={()=>{ if(bName&&bPhone&&bAddress){ setBErrors({}); setBStep(3); } else { validate(); } }} style={{ marginBottom:10 }}>
          Continue →
        </PBtn>
        <OBtn onClick={()=>setBStep(1)}>← Back</OBtn>
      </>}

      {/* STEP 3 — Slot */}
      {bStep===3 && <>
        <div style={{ fontSize:18, fontStyle:"italic", marginBottom:16 }}>When should Bharath arrive?</div>

        <Inp label="Preferred Date" value={bDate} onChange={v=>{setBDate(v);setBErrors(p=>({...p,date:""}))}} type="date" required error={bErrors.date}/>

        {urgency && (
          <div style={{ background:C.roseFnt, border:`1px solid ${C.rose}44`, borderRadius:6, padding:"10px 14px", fontSize:11, color:C.rose, marginBottom:16 }}>
            ⚡ Only 2 slots left today — book fast
          </div>
        )}

        <div style={{ fontSize:9, color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>Pick a Time Slot</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
          {SLOTS_LIST.map(sl=>(
            <button key={sl} onClick={()=>setBSlot(sl)}
              style={{ background:bSlot===sl?C.purpleFnt:C.bg2, border:`1px solid ${bSlot===sl?C.purple:C.border}`, color:bSlot===sl?C.purple:C.muted, padding:"13px 8px", borderRadius:6, fontSize:13, cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s", fontWeight:bSlot===sl?700:400 }}>
              {sl}
            </button>
          ))}
        </div>

        <PBtn onClick={()=>{ if(bSlot&&bDate){ setBErrors({}); setBStep(4); } else if(!bDate){ setBErrors(p=>({...p,date:"Please select a date"})); } else { showToast("Please pick a time slot","err"); }}} style={{ marginBottom:10 }}>
          Continue →
        </PBtn>
        <OBtn onClick={()=>setBStep(2)}>← Back</OBtn>
      </>}

      {/* STEP 4 — Confirm */}
      {bStep===4 && !bDone && <>
        <div style={{ fontSize:18, fontStyle:"italic", marginBottom:20 }}>Confirm your booking</div>

        <Card style={{ borderColor:C.purple+"44", marginBottom:20 }}>
          <div style={{ fontSize:10, color:C.purple, letterSpacing:2, textTransform:"uppercase", marginBottom:16 }}>📋 Booking Summary</div>

          {[
            ["👤 Name",    bName],
            ["📞 Phone",   bPhone],
            ["📍 Address", bAddress],
            ["💆 Service", bSvcObj?.name],
            ["⏱ Duration",bSvcObj?.dur],
            ["📅 Date",    bDate],
            ["⏰ Slot",    bSlot],
            ["🧑‍⚕️ Therapist","Bharath Kumar"],
          ].map(([l,v])=>(
            <div key={l} style={{ display:"flex", gap:10, padding:"8px 0", borderBottom:`1px solid ${C.border}`, fontSize:12 }}>
              <span style={{ color:C.muted, flexShrink:0, minWidth:100 }}>{l}</span>
              <span style={{ fontWeight:600, wordBreak:"break-word" }}>{v}</span>
            </div>
          ))}

          <div style={{ padding:"12px 0 4px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:12 }}>
              <span style={{ color:C.muted }}>Original Price</span>
              <span style={{ textDecoration:"line-through", color:C.faint }}>₹{bSvcObj?.price?.toLocaleString()}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:14 }}>
              <span style={{ color:C.muted }}>After {CONFIG.DISCOUNT}% First-Time Off</span>
              <span style={{ color:C.purple, fontWeight:700, fontSize:18 }}>₹{Math.round((bSvcObj?.price||0)*0.8).toLocaleString()}</span>
            </div>
            <div style={{ fontSize:10, color:C.muted, marginTop:4 }}>💳 Pay after session — cash or UPI</div>
          </div>
        </Card>

        {bNote && (
          <Card style={{ marginBottom:20, borderColor:C.gold+"44" }}>
            <div style={{ fontSize:10, color:C.gold, letterSpacing:2, marginBottom:6 }}>YOUR NOTES</div>
            <div style={{ fontSize:12, color:C.muted }}>{bNote}</div>
          </Card>
        )}

        <PBtn onClick={confirmBooking} disabled={bLoading} style={{ marginBottom:10 }}>
          {bLoading ? "Confirming..." : "✅ Confirm Booking — Notify Bharath"}
        </PBtn>
        <OBtn onClick={()=>setBStep(3)}>← Back</OBtn>
      </>}

      {/* DONE */}
      {bDone && (
        <div style={{ textAlign:"center", paddingTop:32 }}>
          <div style={{ fontSize:60, marginBottom:16 }}>🎉</div>
          <div style={{ fontSize:22, color:C.purple, fontStyle:"italic", marginBottom:10 }}>Booking Confirmed!</div>
          <div style={{ fontSize:13, color:C.muted, lineHeight:1.9, marginBottom:6 }}>
            Hey <strong style={{ color:C.text }}>{bName.split(" ")[0]}</strong>! Your booking details<br/>
            were sent to Bharath's WhatsApp right now.<br/>
            He will call you to confirm within 30 minutes.
          </div>

          <Card style={{ borderColor:C.purple+"44", margin:"20px 0" }}>
            <div style={{ fontSize:10, color:C.purple, letterSpacing:2, marginBottom:8 }}>YOUR BOOKING</div>
            {[["Service",bSvcObj?.name],["Date",bDate],["Slot",bSlot],["Amount",`₹${Math.round((bSvcObj?.price||0)*0.8).toLocaleString()} (after ${CONFIG.DISCOUNT}% off)`]].map(([l,v])=>(
              <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${C.border}`, fontSize:12 }}>
                <span style={{ color:C.muted }}>{l}</span><span style={{ fontWeight:600 }}>{v}</span>
              </div>
            ))}
          </Card>

          {/* Customer WhatsApp button */}
          <WBtn onClick={()=>openCustomerWhatsApp({ name:bName, service:bSvcObj?.name, price:bSvcObj?.price, slot:bSlot, date:bDate })} style={{ marginBottom:10 }}>
            💬 Message Bharath on WhatsApp
          </WBtn>

          <PBtn onClick={()=>{setBDone(false);setBSvc(null);setBSlot(null);setBStep(1);setBName("");setBPhone("");setBAddress("");setBNote("");setBDate(""); setBErrors({});}} style={{ marginBottom:10 }}>
            Book Another Session
          </PBtn>
          <OBtn onClick={()=>setView("home")}>Back to Home</OBtn>
        </div>
      )}
    </div>
  );

  // ── BOT ───────────────────────────────────────────────────────────────────
  const Bot = () => (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 110px)" }}>
      <div style={{ background:C.bg2, padding:"12px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg,${C.purple},${C.purpleDim})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🤖</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:700 }}>Zara · AI Lead Agent</div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:C.green, animation:"blink 1.2s infinite" }}/>
            <span style={{ fontSize:10, color:C.green }}>Actively finding your perfect session</span>
          </div>
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:12 }}>
        {botMsgs.map(m=>(
          <div key={m.id}>
            {m.from==="bot" ? (
              <div>
                <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:"4px 16px 16px 16px", padding:"12px 14px", maxWidth:"85%", fontSize:13, lineHeight:1.7, whiteSpace:"pre-line" }}>{m.msg}</div>
                {m.options && m.options.length>0 && (
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:10 }}>
                    {m.options.map(opt=>(
                      <button key={opt} onClick={()=>handleBotOpt(opt)}
                        style={{ background:"transparent", border:`1px solid ${C.purple}66`, color:C.purple, padding:"7px 13px", borderRadius:20, fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ background:`linear-gradient(135deg,${C.purple},${C.purpleDim})`, borderRadius:"16px 4px 16px 16px", padding:"11px 14px", maxWidth:"75%", marginLeft:"auto", fontSize:13, color:"#fff", fontWeight:600, lineHeight:1.4 }}>
                {m.msg}
              </div>
            )}
          </div>
        ))}
        {botTyping && (
          <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:"4px 16px 16px 16px", padding:"14px 18px", width:68, display:"flex", gap:5 }}>
            {[0,0.2,0.4].map(d=><div key={d} style={{ width:8, height:8, borderRadius:"50%", background:C.purple, animation:"bounce 1.2s infinite", animationDelay:`${d}s` }}/>)}
          </div>
        )}
        <div ref={botEnd}/>
      </div>
      <div style={{ padding:"10px 16px", background:C.bg2, borderTop:`1px solid ${C.border}`, display:"flex", gap:10, flexShrink:0 }}>
        <input value={botInput} onChange={e=>setBotInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleBotSend()}
          placeholder="Ask about services, pricing, Bharath..."
          style={{ flex:1, background:C.bg, border:`1px solid ${C.border}`, color:C.text, padding:"10px 14px", borderRadius:24, fontSize:13, outline:"none", fontFamily:"inherit" }}/>
        <button onClick={handleBotSend} style={{ background:`linear-gradient(135deg,${C.purple},${C.purpleDim})`, border:"none", width:40, height:40, borderRadius:"50%", cursor:"pointer", fontSize:16, flexShrink:0 }}>➤</button>
      </div>
    </div>
  );

  // ── ADMIN ─────────────────────────────────────────────────────────────────
  const AdminNav = () => (
    <div style={{ display:"flex", overflowX:"auto", borderBottom:`1px solid ${C.border}`, background:C.bg2, flexShrink:0 }}>
      {[["dash","📊","Dash"],["leads","👥","Leads"],["services","🌸","Services"],["dev","⚙️","Dev"]].map(([id,icon,label])=>(
        <button key={id} onClick={()=>setAdminSec(id)}
          style={{ flex:"0 0 auto", background:"none", border:"none", color:adminSec===id?C.purple:C.muted, padding:"10px 18px", fontSize:9, cursor:"pointer", fontFamily:"inherit", letterSpacing:1, textTransform:"uppercase", borderBottom:adminSec===id?`2px solid ${C.purple}`:"2px solid transparent", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
          <span style={{ fontSize:18 }}>{icon}</span>{label}
        </button>
      ))}
    </div>
  );

  const Dash = () => (
    <div style={{ padding:20 }}>
      <div style={{ fontSize:9, color:C.muted, letterSpacing:3, textTransform:"uppercase", marginBottom:20 }}>Admin Dashboard · Zuidara</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
        {[
          ["👥","Total Leads",leads.length,C.purple],
          ["📅","Today's Leads",leads.filter(l=>l.createdAt&&l.createdAt.startsWith(today)).length,C.blue],
          ["💰","Est. Revenue",`₹${(leads.reduce((a,b)=>a+(b.price||0),0)*0.8/100).toFixed(0)}K`,C.gold],
          ["✅","AI Engine","6 Modules",C.green],
        ].map(([icon,label,val,col])=>(
          <div key={label} style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8, padding:"14px 12px" }}>
            <div style={{ fontSize:22, marginBottom:6 }}>{icon}</div>
            <div style={{ fontSize:22, color:col, fontWeight:700, marginBottom:2 }}>{val}</div>
            <div style={{ fontSize:9, color:C.faint, letterSpacing:1.5, textTransform:"uppercase" }}>{label}</div>
          </div>
        ))}
      </div>

      <SLabel>AI Lead Engine — Live</SLabel>
      <Card style={{ borderColor:C.purple+"44" }}>
        {[["🤖","Zara AI Bot","Handling leads 24/7",C.green],["📢","Social Proof Ticker","Every 7.5s",C.green],["👁","Live Viewer Count",`${viewers} on site`,C.blue],["⚡","Urgency Engine","Every 32s",C.orange],["💓","CTA Pulse","Every 5.5s",C.purple],["📈","Session Counter",`${843+liveN} shown`,C.gold]].map(([icon,name,status,col])=>(
          <div key={name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${C.border}22`, fontSize:12 }}>
            <div style={{ display:"flex", gap:10 }}><span style={{ fontSize:16 }}>{icon}</span><span>{name}</span></div>
            <span style={{ fontSize:10, color:col }}>{status}</span>
          </div>
        ))}
      </Card>

      <SLabel>Recent Leads</SLabel>
      {leads.length===0 ? (
        <Card><div style={{ fontSize:13, color:C.muted, textAlign:"center", padding:"20px 0" }}>No leads yet — share your app link to start getting bookings!</div></Card>
      ) : leads.slice(-3).reverse().map((l,i)=>(
        <Card key={i} style={{ padding:"12px 14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>{l.name}</div>
              <div style={{ fontSize:11, color:C.muted }}>{l.phone}</div>
              <div style={{ fontSize:11, color:C.faint }}>{l.service} · {l.slot}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:14, color:C.purple, fontWeight:700 }}>₹{Math.round((l.price||0)*0.8).toLocaleString()}</div>
              <div style={{ fontSize:10, color:C.faint, marginTop:4 }}>{l.date}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const LeadsPanel = () => (
    <div style={{ padding:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ fontSize:9, color:C.muted, letterSpacing:3, textTransform:"uppercase" }}>All Customer Leads ({leads.length})</div>
        <SmBtn onClick={()=>{ if(window.confirm("Clear all leads? This cannot be undone.")){ localStorage.removeItem("zuidara_leads"); setLeads([]); showToast("Cleared"); }}} color={C.red}>Clear All</SmBtn>
      </div>

      {leads.length===0 ? (
        <Card>
          <div style={{ textAlign:"center", padding:"30px 0" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>👥</div>
            <div style={{ fontSize:14, color:C.muted, marginBottom:8 }}>No leads yet</div>
            <div style={{ fontSize:12, color:C.faint, lineHeight:1.7 }}>
              Share <strong style={{ color:C.purple }}>zuidara-spa.vercel.app</strong> on Instagram, WhatsApp and Google.<br/>
              When customers book, their details appear here automatically.
            </div>
          </div>
        </Card>
      ) : leads.slice().reverse().map((l,i)=>(
        <Card key={i} style={{ padding:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:2 }}>{l.name}</div>
              <div style={{ fontSize:12, color:C.muted }}>{l.phone}</div>
            </div>
            <div style={{ fontSize:16, color:C.purple, fontWeight:700 }}>₹{Math.round((l.price||0)*0.8).toLocaleString()}</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:12 }}>
            {[["Service",l.service],["Slot",l.slot],["Date",l.date],["Address",l.address]].map(([label,val])=>(
              <div key={label}>
                <div style={{ fontSize:9, color:C.faint, letterSpacing:1, textTransform:"uppercase" }}>{label}</div>
                <div style={{ fontSize:11, marginTop:2, wordBreak:"break-word" }}>{val||"—"}</div>
              </div>
            ))}
          </div>
          {l.note && <div style={{ fontSize:11, color:C.muted, fontStyle:"italic", marginBottom:12 }}>📝 {l.note}</div>}
          <WBtn onClick={()=>{
            const msg = `Hi ${l.name}! Confirming your Zuidara booking — ${l.service} on ${l.date} at ${l.slot}. Bharath will arrive at your address. Pay ₹${Math.round((l.price||0)*0.8).toLocaleString()} after the session. 🌸`;
            window.open(`https://wa.me/${l.phone.replace(/\D/g,"")}?text=${encodeURIComponent(msg)}`, "_blank");
          }}>
            💬 WhatsApp {l.name.split(" ")[0]}
          </WBtn>
        </Card>
      ))}
    </div>
  );

  const AdminServices = () => (
    <div style={{ padding:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ fontSize:9, color:C.muted, letterSpacing:3, textTransform:"uppercase" }}>Services ({services.length})</div>
        <SmBtn onClick={()=>setAddSvc(true)} color={C.purple}>+ Add</SmBtn>
      </div>
      {services.map(s=>(
        <Card key={s.id}>
          <div style={{ display:"flex", gap:12, marginBottom:12 }}>
            <div style={{ fontSize:28 }}>{s.emoji}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3, gap:8 }}>
                <div style={{ fontSize:14, fontWeight:700 }}>{s.name}</div>
                <Tag label={s.tag} color={s.tagColor}/>
              </div>
              <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>{s.desc}</div>
              <span style={{ fontSize:13, color:C.purple, fontWeight:700 }}>₹{s.price.toLocaleString()}</span>
              <span style={{ fontSize:11, color:C.faint, marginLeft:12 }}>{s.dur}</span>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <SmBtn onClick={()=>setEditSvc({...s})} color={C.purple}>Edit</SmBtn>
            <SmBtn onClick={()=>{setServices(p=>p.filter(x=>x.id!==s.id));showToast("Removed","err");}} color={C.red}>Remove</SmBtn>
          </div>
        </Card>
      ))}

      {editSvc && (
        <div style={{ position:"fixed", inset:0, background:"#000000CC", zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:"12px 12px 0 0", padding:24, width:"100%", maxWidth:480, maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.purple, marginBottom:20 }}>Edit Service</div>
            <Inp label="Name" value={editSvc.name} onChange={v=>setEditSvc(p=>({...p,name:v}))}/>
            <Inp label="Price (₹)" value={editSvc.price} onChange={v=>setEditSvc(p=>({...p,price:Number(v)}))} type="number"/>
            <Inp label="Duration" value={editSvc.dur} onChange={v=>setEditSvc(p=>({...p,dur:v}))}/>
            <Inp label="Emoji" value={editSvc.emoji} onChange={v=>setEditSvc(p=>({...p,emoji:v}))}/>
            <Inp label="Tag" value={editSvc.tag} onChange={v=>setEditSvc(p=>({...p,tag:v}))}/>
            <TA label="Description" value={editSvc.desc} onChange={v=>setEditSvc(p=>({...p,desc:v}))} rows={2}/>
            <div style={{ display:"flex", gap:10 }}>
              <PBtn onClick={()=>{setServices(p=>p.map(x=>x.id===editSvc.id?editSvc:x));setEditSvc(null);showToast("Updated!");}}>Save</PBtn>
              <OBtn onClick={()=>setEditSvc(null)}>Cancel</OBtn>
            </div>
          </div>
        </div>
      )}

      {addSvc && (
        <div style={{ position:"fixed", inset:0, background:"#000000CC", zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:"12px 12px 0 0", padding:24, width:"100%", maxWidth:480, maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.purple, marginBottom:20 }}>Add New Service</div>
            <Inp label="Name" value={newSvc.name} onChange={v=>setNewSvc(p=>({...p,name:v}))} placeholder="e.g. Prenatal Massage"/>
            <Inp label="Price (₹)" value={newSvc.price} onChange={v=>setNewSvc(p=>({...p,price:v}))} type="number" placeholder="1999"/>
            <Inp label="Duration" value={newSvc.dur} onChange={v=>setNewSvc(p=>({...p,dur:v}))} placeholder="75 min"/>
            <Inp label="Emoji" value={newSvc.emoji} onChange={v=>setNewSvc(p=>({...p,emoji:v}))}/>
            <Inp label="Tag" value={newSvc.tag} onChange={v=>setNewSvc(p=>({...p,tag:v}))} placeholder="New"/>
            <TA label="Description" value={newSvc.desc} onChange={v=>setNewSvc(p=>({...p,desc:v}))} rows={2}/>
            <div style={{ display:"flex", gap:10 }}>
              <PBtn onClick={()=>{
                if(!newSvc.name)return showToast("Name required","err");
                setServices(p=>[...p,{...newSvc,id:Date.now(),price:Number(newSvc.price)||1499}]);
                setAddSvc(false);setNewSvc({name:"",price:"",dur:"",desc:"",emoji:"💆",tag:"New",tagColor:C.purple});
                showToast("Service added!");
              }}>Add</PBtn>
              <OBtn onClick={()=>setAddSvc(false)}>Cancel</OBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const Dev = () => (
    <div style={{ padding:20 }}>
      <div style={{ fontSize:9, color:C.muted, letterSpacing:3, textTransform:"uppercase", marginBottom:20 }}>Dev & Growth Panel</div>
      <SLabel>How Booking & Lead Capture Works</SLabel>
      <Card style={{ borderColor:C.purple+"44" }}>
        {[
          ["1️⃣","Customer fills name, phone, address + picks slot","Their details are validated on device"],
          ["2️⃣","On confirm, details saved to browser localStorage","Instantly visible in Admin → Leads tab"],
          ["3️⃣","WhatsApp opens with full booking details pre-filled","Bharath sees it immediately on his phone"],
          ["4️⃣","Customer can also tap 'Message Bharath' directly","Creates a two-way WhatsApp thread"],
        ].map(([step,action,note])=>(
          <div key={step} style={{ padding:"12px 0", borderBottom:`1px solid ${C.border}22` }}>
            <div style={{ display:"flex", gap:10, marginBottom:4 }}>
              <span style={{ fontSize:16 }}>{step}</span>
              <span style={{ fontSize:12, fontWeight:700 }}>{action}</span>
            </div>
            <div style={{ fontSize:11, color:C.faint, paddingLeft:26 }}>{note}</div>
          </div>
        ))}
      </Card>

      <SLabel>Next Level — Connect a Real Backend</SLabel>
      {[
        [false,"Formspree (free)","formspree.io — add 1 line of code, get email for every booking"],
        [false,"Google Sheets via Apps Script","Free — bookings auto-appear in a spreadsheet"],
        [false,"Wati / Interakt","WhatsApp Business API — auto-confirm bookings via WhatsApp"],
        [false,"Firebase Firestore","Free tier — real database, bookings never lost"],
        [false,"Supabase","Postgres DB + auth, free tier, best for scale"],
        [false,"Razorpay","Online payment before session, UPI/card/wallet"],
      ].map(([done,name,desc])=>(
        <div key={name} style={{ padding:"10px 0", borderBottom:`1px solid ${C.border}22` }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
            <span style={{ fontSize:12, fontWeight:700 }}>⬜ {name}</span>
            <span style={{ fontSize:9, color:C.orange, background:C.orangeFnt, padding:"2px 8px", borderRadius:10 }}>Recommended</span>
          </div>
          <div style={{ fontSize:11, color:C.faint }}>{desc}</div>
        </div>
      ))}

      <SLabel>Your App Link</SLabel>
      <Card style={{ borderColor:C.purple+"44" }}>
        <div style={{ fontSize:12, color:C.purple, fontWeight:700, marginBottom:6 }}>🔗 zuidara-spa.vercel.app</div>
        <div style={{ fontSize:11, color:C.muted, lineHeight:1.7 }}>Share this link on Instagram bio, WhatsApp status, Google My Business, and in DMs. Every booking goes straight to your WhatsApp.</div>
        <PBtn onClick={()=>{ navigator.clipboard?.writeText("https://zuidara-spa.vercel.app"); showToast("Link copied!"); }} style={{ marginTop:12 }}>📋 Copy Link</PBtn>
      </Card>
    </div>
  );

  const Admin = () => {
    if (!adminOn) return (
      <div style={{ padding:"60px 32px", textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🔐</div>
        <div style={{ fontSize:20, color:C.purple, fontStyle:"italic", marginBottom:8 }}>Admin Access</div>
        <div style={{ fontSize:12, color:C.muted, marginBottom:28 }}>Enter PIN to manage Zuidara</div>
        <input type="password" value={adminPin} onChange={e=>setAdminPin(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&setAdminPin(p=>{ if(p==="1234"||p===""){setAdminOn(true);return "";}else{showToast("Wrong PIN","err");return ""; }})}
          placeholder="PIN"
          style={{ width:"100%", background:C.bg2, border:`1px solid ${C.border}`, color:C.text, padding:14, borderRadius:4, fontSize:20, textAlign:"center", letterSpacing:10, outline:"none", fontFamily:"inherit", boxSizing:"border-box", marginBottom:16 }}/>
        <PBtn onClick={()=>{ if(adminPin==="1234"||adminPin===""){setAdminOn(true);setAdminPin("");}else{showToast("Wrong PIN","err");setAdminPin("");} }}>Unlock Admin</PBtn>
        <div style={{ fontSize:10, color:C.faint, marginTop:16 }}>Demo PIN: 1234</div>
      </div>
    );
    return (
      <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 110px)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 20px", background:C.bg2, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
          <span style={{ fontSize:10, color:C.purple, letterSpacing:2 }}>⚙️ ADMIN — ZUIDARA</span>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <span style={{ fontSize:10, color:C.green }}>{leads.length} leads saved</span>
            <button onClick={()=>setAdminOn(false)} style={{ background:"none", border:`1px solid ${C.border}`, color:C.muted, padding:"4px 12px", borderRadius:3, fontSize:9, cursor:"pointer", fontFamily:"inherit" }}>Lock</button>
          </div>
        </div>
        <AdminNav/>
        <div style={{ flex:1, overflowY:"auto" }}>
          {adminSec==="dash"     && <Dash/>}
          {adminSec==="leads"    && <LeadsPanel/>}
          {adminSec==="services" && <AdminServices/>}
          {adminSec==="dev"      && <Dev/>}
        </div>
      </div>
    );
  };

  // ── ROOT ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily:"'Georgia',serif", background:C.bg, color:C.text, minHeight:"100vh", maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column" }}>
      <style>{`
        @keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-7px)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.25}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
        ::-webkit-scrollbar{width:0}
        *{box-sizing:border-box}
        button,input,textarea{font-family:inherit}
      `}</style>

      {notif && (
        <div style={{ position:"fixed", top:14, left:"50%", transform:"translateX(-50%)", background:C.bg2, border:`1px solid ${C.purple}44`, borderRadius:24, padding:"10px 18px", fontSize:12, color:C.text, zIndex:999, display:"flex", alignItems:"center", gap:10, animation:"slideDown 0.3s ease", whiteSpace:"nowrap", maxWidth:"88vw", boxShadow:`0 4px 24px ${C.purple}22` }}>
          <span style={{ fontSize:16 }}>{notif.icon}</span>
          <span style={{ color:C.muted, overflow:"hidden", textOverflow:"ellipsis" }}>{notif.msg}</span>
        </div>
      )}

      {toast && (
        <div style={{ position:"fixed", bottom:80, left:"50%", transform:"translateX(-50%)", background:toast.type==="err"?C.red:C.purple, color:"#fff", padding:"10px 20px", borderRadius:24, fontSize:12, fontWeight:700, zIndex:998, animation:"fadeIn 0.2s ease", whiteSpace:"nowrap" }}>
          {toast.type==="err"?"✕ ":"✓ "}{toast.msg}
        </div>
      )}

      <div style={{ background:`linear-gradient(135deg,${C.bg2},${C.bg3})`, padding:"14px 20px 12px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div>
          <div style={{ fontSize:20, fontWeight:700, letterSpacing:4, color:C.purple }}>ZUIDARA</div>
          <div style={{ fontSize:9, color:C.faint, letterSpacing:2, textTransform:"uppercase", marginTop:1 }}>Elite Male Therapist · Home Spa · Bengaluru</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:C.green, animation:"blink 1.4s infinite" }}/>
          <span style={{ fontSize:10, color:C.green }}>{viewers} Live</span>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto" }}>
        {view==="home"  && <Home/>}
        {view==="book"  && <Book/>}
        {view==="bot"   && <Bot/>}
        {view==="admin" && <Admin/>}
      </div>

      <div style={{ background:C.bg2, borderTop:`1px solid ${C.border}`, display:"flex", padding:"8px 0 10px", flexShrink:0 }}>
        {[{id:"home",icon:"🏠",label:"Home"},{id:"book",icon:"📅",label:"Book"},{id:"bot",icon:"🤖",label:"Zara AI"},{id:"admin",icon:"⚙️",label:"Admin"}].map(n=>(
          <div key={n.id} onClick={()=>setView(n.id)}
            style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer", padding:"4px 0", opacity:view===n.id?1:0.35 }}>
            <span style={{ fontSize:18 }}>{n.icon}</span>
            <span style={{ fontSize:8, letterSpacing:1.5, textTransform:"uppercase", color:view===n.id?C.purple:C.faint, fontWeight:view===n.id?700:400 }}>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
ENDOFFILE
