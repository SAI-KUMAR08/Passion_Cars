import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { Switch, Route, Router as WouterRouter, Link } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, MapPin, Phone, Mail, Clock,
  Star, ShieldCheck, Tag, Banknote, Wrench,
  HeadphonesIcon, Car, Search, Fuel, Gauge,
  Calendar, CheckCircle, ArrowRight, MessageCircle,
  Heart, Zap, Award, Users, TrendingUp, XCircle,
  LogIn, LogOut, UserCircle, Eye, EyeOff, Lock,
  ChevronDown, BookmarkCheck
} from "lucide-react";
import { SiFacebook, SiInstagram, SiX, SiYoutube, SiWhatsapp } from "react-icons/si";

const queryClient = new QueryClient();

// ── Smooth scroll helper (fixes Wouter intercepting # hrefs) ─────────────────
const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const NavLink = ({
  sectionId,
  children,
  className,
  onClick,
}: {
  sectionId: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={() => { scrollTo(sectionId); onClick?.(); }}
    className={className}
    data-testid={`nav-link-${sectionId}`}
  >
    {children}
  </button>
);

// ── Data ──────────────────────────────────────────────────────────────────────

const ALL_CARS = [
  { id: 1, name: "Mercedes-Benz GLE 400d", year: 2022, price: 6500000, priceDisplay: "₹65,00,000", mileage: "24,000 km", type: "SUV", fuel: "Diesel", transmission: "Automatic", color: "Obsidian Black", img: "/images/car-suv.png", badge: "Featured", features: ["Panoramic Sunroof", "Burmester Sound", "360 Camera", "Ambient Lighting"], description: "A commanding presence on the road with unmatched refinement and capability." },
  { id: 2, name: "BMW 5 Series 530i", year: 2023, price: 8950000, priceDisplay: "₹89,50,000", mileage: "12,500 km", type: "Sedan", fuel: "Petrol", transmission: "Automatic", color: "Alpine White", img: "/images/car-sedan.png", badge: "New Arrival", features: ["Harman Kardon Audio", "Live Cockpit Pro", "Gesture Control", "Laser Lights"], description: "The benchmark executive saloon with cutting-edge technology and driver-focused dynamics." },
  { id: 3, name: "Audi RS3 Sportback", year: 2021, price: 4200000, priceDisplay: "₹42,00,000", mileage: "35,000 km", type: "Hatchback", fuel: "Petrol", transmission: "Automatic", color: "Nardo Grey", img: "/images/car-hatchback.png", badge: "", features: ["5-Cyl Turbo", "Matrix LED", "Sport Differential", "Virtual Cockpit+"], description: "The ultimate hot hatch with 400 PS of raw performance and everyday practicality." },
  { id: 4, name: "Porsche Macan S", year: 2023, price: 7200000, priceDisplay: "₹72,00,000", mileage: "8,000 km", type: "SUV", fuel: "Petrol", transmission: "Automatic", color: "Carmine Red", img: "/images/car-crossover.png", badge: "Low KMs", features: ["PDCC Sport", "Sport Chrono Pkg", "BOSE Surround", "Air Suspension"], description: "Sports car performance meets everyday versatility in this definitive compact SUV." },
  { id: 5, name: "Ford Endeavour Sport", year: 2022, price: 4890000, priceDisplay: "₹48,90,000", mileage: "19,000 km", type: "SUV", fuel: "Diesel", transmission: "Automatic", color: "Shadow Black", img: "/images/car-pickup.png", badge: "", features: ["4WD System", "Terrain Management", "Bang & Olufsen", "Head-Up Display"], description: "Built for those who demand capability and adventure without sacrificing comfort." },
  { id: 6, name: "Porsche 911 Carrera", year: 2020, price: 11500000, priceDisplay: "₹1,15,00,000", mileage: "14,000 km", type: "Sports", fuel: "Petrol", transmission: "Automatic", color: "GT Silver", img: "/images/car-sports.png", badge: "Rare Find", features: ["Sport Exhaust", "PASM Suspension", "Sport Chrono", "Carbon Ceramic Brakes"], description: "The icon. Decades of motorsport heritage distilled into one breathtaking machine." },
  { id: 7, name: "Hyundai Tucson N Line", year: 2023, price: 2850000, priceDisplay: "₹28,50,000", mileage: "11,000 km", type: "SUV", fuel: "Petrol", transmission: "Automatic", color: "Phantom Black", img: "/images/car-crossover.png", badge: "Best Value", features: ["SmartSense ADAS", "Bose Premium Audio", "Ventilated Seats", "Wireless Charging"], description: "Sporty styling with smart technology at an attainable price point." },
  { id: 8, name: "Toyota Fortuner Legender", year: 2022, price: 3950000, priceDisplay: "₹39,50,000", mileage: "28,000 km", type: "SUV", fuel: "Diesel", transmission: "Automatic", color: "Super White", img: "/images/car-suv.png", badge: "", features: ["4WD with DAC", "JBL Premium Audio", "Adaptive Cruise", "Semi-Aniline Leather"], description: "The legendary off-roader refined with premium touches for discerning buyers." },
  { id: 9, name: "MG Gloster Savvy", year: 2023, price: 3400000, priceDisplay: "₹34,00,000", mileage: "9,500 km", type: "SUV", fuel: "Diesel", transmission: "Automatic", color: "Aurora Silver", img: "/images/car-suv.png", badge: "New Arrival", features: ["Level 1 ADAS", "PM 2.5 Air Filter", "Nappa Leather", "Panoramic Roof"], description: "Full-size luxury SUV that makes a bold statement without the exotic price tag." },
];

const SERVICES_LIST = [
  { icon: ShieldCheck, title: "Pre-Purchase Inspection", desc: "Comprehensive 150-point diagnostic check by certified master technicians. No stone left unturned.", color: "blue" },
  { icon: Banknote, title: "Vehicle Financing", desc: "Tailored loan solutions with competitive EMIs from top-tier banks. Pre-approval in 24 hours.", color: "green" },
  { icon: Tag, title: "Insurance Assistance", desc: "Seamless integration with leading insurance providers for immediate and comprehensive coverage.", color: "purple" },
  { icon: TrendingUp, title: "Trade-In Program", desc: "Get the best price for your existing vehicle. Transparent valuation, zero negotiations.", color: "orange" },
  { icon: Car, title: "Concierge Test Drive", desc: "Schedule a personalized test drive at our showroom or your location — your choice.", color: "blue" },
  { icon: Wrench, title: "After-Sale Service", desc: "Priority maintenance, detailing, and service packages to keep your car in showroom condition.", color: "green" },
];

const TESTIMONIALS = [
  { name: "Rahul Mehta", role: "Business Owner, Hyderabad", text: "AutoPrime made buying my GLE the smoothest experience I've ever had. The inspection report gave me total confidence. Worth every rupee.", rating: 5 },
  { name: "Priya Sharma", role: "Software Director, Bengaluru", text: "I was hesitant about buying pre-owned, but AutoPrime changed my perception completely. The car was immaculate and the documentation was spotless.", rating: 5 },
  { name: "Vivek Anand", role: "Architect, Mumbai", text: "Sold my old sedan and bought a Porsche Macan here. The trade-in valuation was fair and the entire process took just two days. Exceptional team.", rating: 5 },
  { name: "Nandini Krishnan", role: "Doctor, Chennai", text: "The transparency throughout the buying process is what sets AutoPrime apart. No pressure, no hidden costs. I recommend them to everyone I know.", rating: 5 },
];

// ── Auth Context ──────────────────────────────────────────────────────────────

type User = { name: string; email: string };
type AuthCtx = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  wishlist: number[];
  toggleWishlist: (id: number) => void;
  openAuth: (mode?: "login" | "signup") => void;
};

const AuthContext = createContext<AuthCtx | null>(null);
const useAuth = () => useContext(AuthContext)!;

const STORAGE_KEY = "autoprime_users";
const SESSION_KEY = "autoprime_session";
const WISHLIST_KEY = "autoprime_wishlist";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
  });
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]"); } catch { return []; }
  });
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: "login" | "signup" }>({ open: false, mode: "login" });

  const openAuth = useCallback((mode: "login" | "signup" = "login") => {
    setAuthModal({ open: true, mode });
  }, []);
  const closeAuth = useCallback(() => setAuthModal((p) => ({ ...p, open: false })), []);

  const login = async (email: string, password: string) => {
    const users: Record<string, { name: string; password: string }> = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const found = users[email.toLowerCase()];
    if (!found) throw new Error("No account found with this email.");
    if (found.password !== password) throw new Error("Incorrect password.");
    const u = { name: found.name, email: email.toLowerCase() };
    setUser(u);
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    const saved = JSON.parse(localStorage.getItem(`${WISHLIST_KEY}_${email}`) || "[]");
    setWishlist(saved);
    closeAuth();
  };

  const signup = async (name: string, email: string, password: string) => {
    const users: Record<string, { name: string; password: string }> = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (users[email.toLowerCase()]) throw new Error("An account with this email already exists.");
    users[email.toLowerCase()] = { name, password };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    const u = { name, email: email.toLowerCase() };
    setUser(u);
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    setWishlist([]);
    closeAuth();
  };

  const logout = () => {
    if (user) localStorage.setItem(`${WISHLIST_KEY}_${user.email}`, JSON.stringify(wishlist));
    setUser(null);
    setWishlist([]);
    localStorage.removeItem(SESSION_KEY);
  };

  const toggleWishlist = useCallback((id: number) => {
    if (!user) { openAuth("login"); return; }
    setWishlist((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(`${WISHLIST_KEY}_${user.email}`, JSON.stringify(next));
      return next;
    });
  }, [user, openAuth]);

  useEffect(() => {
    if (user) localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist, user]);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, wishlist, toggleWishlist, openAuth }}>
      {children}
      <AnimatePresence>
        {authModal.open && (
          <AuthModal mode={authModal.mode} onClose={closeAuth} onSwitch={(m) => setAuthModal({ open: true, mode: m })} />
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
};

// ── Auth Modal ────────────────────────────────────────────────────────────────

const AuthModal = ({
  mode,
  onClose,
  onSwitch,
}: {
  mode: "login" | "signup";
  onClose: () => void;
  onSwitch: (m: "login" | "signup") => void;
}) => {
  const { login, signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password || (mode === "signup" && !name)) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      if (mode === "login") await login(email, password);
      else await signup(name, email, password);
      showToast(`Welcome${mode === "signup" ? `, ${name}` : " back"}! You're now signed in.`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[95] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 24 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-blue-700 px-8 pt-8 pb-10 relative">
          <button onClick={onClose} className="absolute top-5 right-5 text-white/70 hover:text-white" data-testid="button-auth-close">
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
            {mode === "login" ? <LogIn className="w-6 h-6 text-white" /> : <UserCircle className="w-6 h-6 text-white" />}
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-1">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-blue-100 text-sm">
            {mode === "login" ? "Sign in to your AutoPrime account" : "Join AutoPrime — it's free"}
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-5 flex items-center gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100"
              >
                <XCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  data-testid="input-auth-name"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                data-testid="input-auth-email"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  data-testid="input-auth-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  data-testid="button-toggle-password"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
              data-testid="button-auth-submit"
            >
              {loading ? (
                <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
              ) : mode === "login" ? (
                <><LogIn className="w-4 h-4" /> Sign In</>
              ) : (
                <><UserCircle className="w-4 h-4" /> Create Account</>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => onSwitch(mode === "login" ? "signup" : "login")}
                className="text-primary font-bold hover:underline"
                data-testid="button-auth-switch"
              >
                {mode === "login" ? "Sign up free" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Toast ─────────────────────────────────────────────────────────────────────

type ToastT = { id: number; message: string; type: "success" | "error" };
let toastId = 0;
let globalAddToast: ((t: Omit<ToastT, "id">) => void) | null = null;

const showToast = (message: string, type: "success" | "error" = "success") => {
  globalAddToast?.({ message, type });
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastT[]>([]);

  useEffect(() => {
    globalAddToast = (t) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { ...t, id }]);
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4000);
    };
    return () => { globalAddToast = null; };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-white text-sm font-semibold max-w-sm ${
              t.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ── FadeIn ────────────────────────────────────────────────────────────────────

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// ── Car Detail Modal ──────────────────────────────────────────────────────────

type Car = typeof ALL_CARS[0];

const CarModal = ({ car, onClose }: { car: Car; onClose: () => void }) => {
  const { user, wishlist, toggleWishlist, openAuth } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isWished = wishlist.includes(car.id);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { openAuth("login"); return; }
    if (!name.trim() || !phone.trim()) { showToast("Please fill in all fields.", "error"); return; }
    setSubmitted(true);
    showToast(`Enquiry sent for ${car.name}! We'll call you shortly.`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img src={car.img} alt={car.name} className="w-full h-64 object-cover" />
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-lg" data-testid="button-modal-close">
            <X className="w-5 h-5 text-gray-800" />
          </button>
          <button
            onClick={() => toggleWishlist(car.id)}
            className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${isWished ? "bg-red-500 text-white" : "bg-white/90 text-gray-400 hover:text-red-400"}`}
            data-testid="button-modal-wishlist"
          >
            <Heart className={`w-5 h-5 ${isWished ? "fill-current" : ""}`} />
          </button>
          {car.badge && (
            <span className="absolute bottom-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">{car.badge}</span>
          )}
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">{car.name}</h2>
              <p className="text-gray-500 mt-1">{car.year} · {car.color} · {car.transmission}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="font-display text-2xl font-bold text-primary">{car.priceDisplay}</div>
              <div className="text-xs text-gray-400 mt-0.5">All-inclusive price</div>
            </div>
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">{car.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { icon: Gauge, label: "Mileage", value: car.mileage },
              { icon: Fuel, label: "Fuel", value: car.fuel },
              { icon: Calendar, label: "Year", value: String(car.year) },
              { icon: Car, label: "Type", value: car.type },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-4 text-center">
                <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="text-xs text-gray-400 mb-1">{label}</div>
                <div className="font-semibold text-gray-900 text-sm">{value}</div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h4 className="font-display font-bold text-gray-900 mb-3">Key Features</h4>
            <div className="grid grid-cols-2 gap-2">
              {car.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" /> {f}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            {submitted ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-display text-xl font-bold text-gray-900 mb-1">Enquiry Received!</h3>
                <p className="text-gray-500 text-sm">Our team will contact you within 2 hours.</p>
              </div>
            ) : (
              <>
                <h4 className="font-display font-bold text-gray-900 mb-4">
                  {user ? "Book a Test Drive / Enquire" : "Sign in to Enquire"}
                </h4>
                {!user ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm mb-4">Create a free account to enquire about this car, save to wishlist, and track your requests.</p>
                    <div className="flex gap-3 justify-center">
                      <button onClick={() => openAuth("login")} className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors" data-testid="button-modal-login">Sign In</button>
                      <button onClick={() => openAuth("signup")} className="border border-primary text-primary px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/5 transition-colors" data-testid="button-modal-signup">Create Account</button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleEnquiry} className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" data-testid="input-modal-name" />
                      <input type="tel" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" data-testid="input-modal-phone" />
                    </div>
                    <button type="submit" className="w-full bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors" data-testid="button-modal-enquiry">Get Callback</button>
                    <a href={`https://wa.me/919876543210?text=Hi, I'm interested in the ${car.name} (${car.year}) listed at ${car.priceDisplay}.`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white py-3 rounded-xl font-semibold text-sm transition-all" data-testid="button-modal-whatsapp">
                      <SiWhatsapp size={16} /> Chat on WhatsApp
                    </a>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Navbar ────────────────────────────────────────────────────────────────────

const Navbar = () => {
  const { user, logout, wishlist, openAuth } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = () => setUserMenuOpen(false);
    setTimeout(() => document.addEventListener("click", handler), 0);
    return () => document.removeEventListener("click", handler);
  }, [userMenuOpen]);

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "Buy Cars", id: "buy-cars" },
    { label: "Sell Car", id: "sell" },
    { label: "Services", id: "services" },
    { label: "About", id: "about" },
    { label: "Contact", id: "contact" },
  ];

  const textColor = isScrolled ? "text-gray-600 hover:text-primary" : "text-white/90 hover:text-white";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-blue-900/5 border-b border-gray-100 py-3" : "bg-transparent py-5"
    }`}>
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <button type="button" onClick={() => scrollTo("home")} className="flex items-center gap-2.5" data-testid="button-logo">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <Car className="w-5 h-5 text-white" />
          </div>
          <span className={`font-display font-bold text-xl tracking-tight transition-colors ${isScrolled ? "text-gray-900" : "text-white"}`}>AutoPrime</span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <NavLink key={link.id} sectionId={link.id} className={`text-sm font-semibold transition-colors ${textColor}`}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setUserMenuOpen((p) => !p); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-semibold text-sm ${
                  isScrolled ? "border-gray-200 text-gray-700 hover:border-primary hover:text-primary bg-white" : "border-white/20 text-white hover:bg-white/10"
                }`}
                data-testid="button-user-menu"
              >
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                {user.name.split(" ")[0]}
                {wishlist.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{wishlist.length}</span>
                )}
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl shadow-gray-200/80 border border-gray-100 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { scrollTo("buy-cars"); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      data-testid="button-menu-wishlist"
                    >
                      <BookmarkCheck className="w-4 h-4 text-primary" />
                      Saved Cars
                      {wishlist.length > 0 && <span className="ml-auto bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">{wishlist.length}</span>}
                    </button>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); showToast("You've been signed out."); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-50"
                      data-testid="button-logout"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <button
                onClick={() => openAuth("login")}
                className={`text-sm font-semibold transition-colors px-4 py-2 rounded-xl ${isScrolled ? "text-gray-600 hover:text-primary" : "text-white/90 hover:text-white"}`}
                data-testid="button-nav-login"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuth("signup")}
                className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all text-sm shadow-lg shadow-primary/25"
                data-testid="button-nav-signup"
              >
                Join Free
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-white"}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden shadow-xl"
          >
            <div className="flex flex-col px-6 py-4 gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.id}
                  sectionId={link.id}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-primary font-medium py-3 border-b border-gray-50 text-base text-left w-full"
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                        <p className="text-gray-400 text-xs">{user.email}</p>
                      </div>
                    </div>
                    <button onClick={() => { logout(); setMobileMenuOpen(false); showToast("Signed out."); }} className="text-red-500 text-sm font-semibold" data-testid="button-mobile-logout">Sign Out</button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => { openAuth("login"); setMobileMenuOpen(false); }} className="border border-gray-200 text-gray-700 text-center py-3 rounded-xl font-semibold" data-testid="button-mobile-login">Sign In</button>
                    <button onClick={() => { openAuth("signup"); setMobileMenuOpen(false); }} className="bg-primary text-white text-center py-3 rounded-xl font-bold" data-testid="button-mobile-signup">Join Free</button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// ── Hero ──────────────────────────────────────────────────────────────────────

const Hero = () => {
  const { openAuth, user } = useAuth();
  const stats = [
    { label: "Cars in Stock", value: "200+" },
    { label: "Happy Customers", value: "5,000+" },
    { label: "Years of Trust", value: "10+" },
    { label: "Average Rating", value: "4.9 ★" },
  ];

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/images/hero-showroom.png" alt="Luxury Car Showroom" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/75 to-gray-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
      </div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] z-0" />

      <div className="relative z-10 container mx-auto px-6 max-w-7xl pt-24 pb-40">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 px-4 py-2 rounded-full text-sm font-semibold mb-8">
          <Zap className="w-4 h-4 text-blue-300" />
          <span className="text-blue-100">Hyderabad's Most Trusted Pre-Owned Dealer</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35 }} className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6 text-white max-w-4xl">
          Drive Your Dream.
          <br />
          <span className="bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">Own With Confidence.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }} className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl leading-relaxed">
          Premium pre-owned vehicles with 150-point inspection, full service history, and transparent pricing. No surprises — ever.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.65 }} className="flex flex-col sm:flex-row gap-4">
          <button type="button" onClick={() => scrollTo("buy-cars")} className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-2xl shadow-primary/30 group" data-testid="button-hero-browse">
            Browse All Cars <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          {!user ? (
            <button type="button" onClick={() => openAuth("signup")} className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all" data-testid="button-hero-join">
              Join Free — Save Cars
            </button>
          ) : (
            <button type="button" onClick={() => scrollTo("sell")} className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all" data-testid="button-hero-sell">
              Sell Your Car
            </button>
          )}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/10 backdrop-blur-xl border-t border-white/10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.9 + i * 0.1 }} className="py-6 px-8 text-center md:text-left">
                <div className="font-display font-bold text-3xl text-white mb-1">{stat.value}</div>
                <div className="text-xs text-white/50 uppercase tracking-widest font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Why Us ─────────────────────────────────────────────────────────────────────

const WhyUs = () => {
  const pillars = [
    { icon: ShieldCheck, title: "150-Point Inspection", desc: "Every car is rigorously checked by certified technicians. Only the best make it to our showroom.", color: "text-blue-600 bg-blue-50" },
    { icon: Tag, title: "Transparent Pricing", desc: "The price you see is what you pay. No dealer add-ons, no last-minute surprises — ever.", color: "text-green-600 bg-green-50" },
    { icon: Award, title: "Certified Warranty", desc: "Every purchase comes with a comprehensive warranty and roadside assistance for peace of mind.", color: "text-purple-600 bg-purple-50" },
    { icon: HeadphonesIcon, title: "Expert Guidance", desc: "Our advisors match you to the right car for your lifestyle, budget, and preferences.", color: "text-orange-600 bg-orange-50" },
    { icon: Users, title: "5,000+ Happy Owners", desc: "Our track record speaks for itself. Thousands of satisfied customers across India.", color: "text-pink-600 bg-pink-50" },
    { icon: Wrench, title: "Lifetime After-Sale Care", desc: "Your relationship with AutoPrime doesn't end at purchase. Priority service and support, always.", color: "text-teal-600 bg-teal-50" },
  ];

  return (
    <section id="why-us" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <FadeIn className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-bold text-sm uppercase tracking-widest mb-4 block">Why AutoPrime</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-gray-900 mb-5">The Standard You Deserve</h2>
          <p className="text-gray-500 text-lg">We set a higher bar for what a car dealership should be.</p>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.08}>
              <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-300 group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${p.color} group-hover:scale-110 transition-transform`}>
                  <p.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900 mb-3">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Buy Cars ──────────────────────────────────────────────────────────────────

const BuyCars = () => {
  const { wishlist, toggleWishlist } = useAuth();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterFuel, setFilterFuel] = useState("All");
  const [filterPrice, setFilterPrice] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const types = ["All", "SUV", "Sedan", "Hatchback", "Sports"];
  const fuels = ["All", "Petrol", "Diesel", "Hybrid"];
  const priceRanges = ["All", "Under ₹30L", "₹30L–₹60L", "₹60L–₹1Cr", "Above ₹1Cr"];

  const filtered = ALL_CARS
    .filter((car) => {
      const q = search.toLowerCase();
      const matchSearch = car.name.toLowerCase().includes(q) || car.type.toLowerCase().includes(q) || car.fuel.toLowerCase().includes(q);
      const matchType = filterType === "All" || car.type === filterType;
      const matchFuel = filterFuel === "All" || car.fuel === filterFuel;
      const matchPrice =
        filterPrice === "All" ||
        (filterPrice === "Under ₹30L" && car.price < 3000000) ||
        (filterPrice === "₹30L–₹60L" && car.price >= 3000000 && car.price < 6000000) ||
        (filterPrice === "₹60L–₹1Cr" && car.price >= 6000000 && car.price < 10000000) ||
        (filterPrice === "Above ₹1Cr" && car.price >= 10000000);
      return matchSearch && matchType && matchFuel && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      if (sortBy === "Newest First") return b.year - a.year;
      return 0;
    });

  const hasActiveFilters = search || filterType !== "All" || filterFuel !== "All" || filterPrice !== "All";
  const clearFilters = () => { setSearch(""); setFilterType("All"); setFilterFuel("All"); setFilterPrice("All"); setSortBy("Featured"); };

  const FilterBtn = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${active ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"}`}
    >
      {children}
    </button>
  );

  return (
    <section id="buy-cars" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <FadeIn className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="text-primary font-bold text-sm uppercase tracking-widest mb-3 block">Our Inventory</span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-gray-900">Find Your Perfect Car</h2>
              <p className="text-gray-400 mt-3 text-base">{filtered.length} of {ALL_CARS.length} vehicles match your filters</p>
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors" data-testid="button-toggle-filters">
              <Gauge className="w-4 h-4" /> Filters {hasActiveFilters && <span className="w-2 h-2 bg-primary rounded-full" />}
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, type, brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all text-gray-900 placeholder-gray-400"
                data-testid="input-car-search"
              />
              {search && <button type="button" onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary text-gray-700 text-sm font-medium bg-white cursor-pointer" data-testid="select-sort">
              {["Featured", "Price: Low to High", "Price: High to Low", "Newest First"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div className={showFilters ? "block" : "hidden lg:block"}>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Type:</span>
              {types.map((t) => <FilterBtn key={t} active={filterType === t} onClick={() => setFilterType(t)}>{t}</FilterBtn>)}
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide ml-3">Fuel:</span>
              {fuels.map((f) => <FilterBtn key={f} active={filterFuel === f} onClick={() => setFilterFuel(f)}>{f}</FilterBtn>)}
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide ml-3">Budget:</span>
              {priceRanges.map((r) => <FilterBtn key={r} active={filterPrice === r} onClick={() => setFilterPrice(r)}>{r}</FilterBtn>)}
              {hasActiveFilters && (
                <button type="button" onClick={clearFilters} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors ml-2" data-testid="button-clear-filters">
                  <XCircle className="w-4 h-4" /> Clear
                </button>
              )}
            </div>
          </div>
        </FadeIn>

        {filtered.length === 0 ? (
          <FadeIn className="text-center py-24">
            <Car className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">No cars found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your filters.</p>
            <button type="button" onClick={clearFilters} className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">Reset Filters</button>
          </FadeIn>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((car, i) => (
              <FadeIn key={car.id} delay={i * 0.06}>
                <div className="group bg-white rounded-2xl border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/80 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden" data-testid={`card-car-${car.id}`}>
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    <img src={car.img} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {car.badge && <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">{car.badge}</span>}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(car.id); }}
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all ${wishlist.includes(car.id) ? "bg-red-500 text-white" : "bg-white/90 text-gray-400 hover:text-red-400"}`}
                      data-testid={`button-wishlist-${car.id}`}
                    >
                      <Heart className={`w-4 h-4 ${wishlist.includes(car.id) ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-display font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight">{car.name}</h3>
                        <p className="text-gray-400 text-sm mt-0.5">{car.year} · {car.color}</p>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <div className="font-display font-bold text-primary text-lg leading-tight">{car.priceDisplay}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-400 font-medium my-4 flex-wrap">
                      <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5" /> {car.mileage}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-200" />
                      <span className="flex items-center gap-1"><Fuel className="w-3.5 h-3.5" /> {car.fuel}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-200" />
                      <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5" /> {car.type}</span>
                    </div>

                    <div className="flex gap-2">
                      <button type="button" onClick={() => setSelectedCar(car)} className="flex-1 bg-primary hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors" data-testid={`button-view-${car.id}`}>
                        View Details
                      </button>
                      <a href={`https://wa.me/919876543210?text=Hi, I want to enquire about ${car.name} (${car.year})`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-50 hover:bg-green-500 text-green-600 hover:text-white rounded-xl flex items-center justify-center transition-all shrink-0" data-testid={`button-whatsapp-${car.id}`}>
                        <SiWhatsapp size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCar && <CarModal car={selectedCar} onClose={() => setSelectedCar(null)} />}
      </AnimatePresence>
    </section>
  );
};

// ── Sell Your Car ─────────────────────────────────────────────────────────────

const SellYourCar = () => {
  const { user, openAuth } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", model: "", year: "", km: "", condition: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setForm((p) => ({ ...p, name: user.name }));
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { openAuth("login"); return; }
    if (!form.name || !form.phone || !form.model) { showToast("Please fill in all required fields.", "error"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); showToast("Quote request received! We'll call you within 1 hour."); }, 1400);
  };

  return (
    <section id="sell" className="py-24 bg-gray-50 border-y border-gray-100">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <span className="text-primary font-bold text-sm uppercase tracking-widest mb-4 block">Sell Your Car</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-gray-900 mb-6">Get the Best Price. Guaranteed.</h2>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed">Skip the hassle of private listings and lowball offers. We offer transparent, market-accurate valuations and handle every step.</p>
            <ul className="space-y-4">
              {["Instant online valuation in minutes", "Fair market price — no negotiations", "Same-day payment processing", "We handle 100% of the paperwork", "No obligation, completely free quote"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><CheckCircle className="w-4 h-4 text-primary" /></div>
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl shadow-gray-100 border border-gray-100">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-10 h-10 text-green-500" /></div>
                  <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">Quote Requested!</h3>
                  <p className="text-gray-500 mb-6">Our valuation expert will contact you within 1 hour.</p>
                  <button type="button" onClick={() => { setSubmitted(false); setForm({ name: user?.name || "", phone: "", model: "", year: "", km: "", condition: "" }); }} className="text-primary font-semibold hover:underline text-sm">Submit another car</button>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-2xl font-bold text-gray-900 mb-6">Get a Free Quote</h3>
                  {!user && (
                    <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3 text-sm text-blue-700">
                      <Lock className="w-4 h-4 shrink-0 text-blue-500" />
                      <span><button type="button" onClick={() => openAuth("login")} className="font-bold underline">Sign in</button> to auto-fill your details and track your quote.</span>
                    </div>
                  )}
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Your Name *</label>
                        <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="Full name" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all" data-testid="input-sell-name" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Phone *</label>
                        <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all" data-testid="input-sell-phone" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Car Model *</label>
                      <input name="model" type="text" value={form.model} onChange={handleChange} placeholder="e.g. Honda City, Hyundai Creta" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all" data-testid="input-sell-model" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Year</label>
                        <select name="year" value={form.year} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all bg-white text-gray-700" data-testid="select-sell-year">
                          <option value="">Select Year</option>
                          {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016].map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">KMs Driven</label>
                        <input name="km" type="text" value={form.km} onChange={handleChange} placeholder="e.g. 45,000" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all" data-testid="input-sell-km" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Condition</label>
                      <select name="condition" value={form.condition} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all bg-white text-gray-700" data-testid="select-sell-condition">
                        <option value="">Select Condition</option>
                        <option value="excellent">Excellent — Like New</option>
                        <option value="good">Good — Minor Wear</option>
                        <option value="fair">Fair — Needs Some Work</option>
                      </select>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all mt-2 flex items-center justify-center gap-2 disabled:opacity-70" data-testid="button-submit-quote">
                      {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <><TrendingUp className="w-4 h-4" /> Get Free Valuation</>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

// ── Services ──────────────────────────────────────────────────────────────────

const Services = () => {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <FadeIn className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-bold text-sm uppercase tracking-widest mb-4 block">Our Services</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-gray-900 mb-5">Beyond the Purchase</h2>
          <p className="text-gray-500 text-lg">A truly premium ownership experience extends far beyond the showroom.</p>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_LIST.map((srv, i) => (
            <FadeIn key={srv.title} delay={i * 0.08}>
              <div className="group bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-xl hover:shadow-gray-100/80 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${colorMap[srv.color] || colorMap.blue} group-hover:scale-110 transition-transform`}>
                  <srv.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900 mb-3">{srv.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{srv.desc}</p>
                <div className="flex items-center text-primary text-sm font-semibold gap-1 group-hover:gap-2 transition-all">
                  Learn More <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── About ─────────────────────────────────────────────────────────────────────

const About = () => (
  <section id="about" className="py-24 bg-gray-900 text-white relative overflow-hidden">
    <div className="absolute inset-0 z-0">
      <img src="/images/team.png" alt="AutoPrime" className="w-full h-full object-cover opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-gray-900/60" />
    </div>
    <div className="absolute top-0 left-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[120px] z-0" />

    <div className="relative z-10 container mx-auto px-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <FadeIn>
          <span className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-4 block">Our Story</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">Built on Trust. Driven by Passion.</h2>
          <p className="text-gray-400 text-lg mb-6 leading-relaxed">Founded in 2014, AutoPrime was born from a simple conviction: that buying a pre-owned luxury car should feel just as special as buying a new one.</p>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">Our team hand-picks every vehicle, subjects it to the most rigorous inspection in Hyderabad, and backs it with transparent pricing and genuine after-sale support.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/10 pt-8">
            {[{ v: "10+", l: "Years Active" }, { v: "200+", l: "Cars in Stock" }, { v: "5K+", l: "Happy Owners" }, { v: "4.9★", l: "Google Rating" }].map((s) => (
              <div key={s.l} className="text-center">
                <div className="font-display font-bold text-2xl text-blue-400 mb-1">{s.v}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">{s.l}</div>
              </div>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="relative">
            <img src="/images/team.png" alt="AutoPrime Showroom" className="rounded-2xl w-full h-[480px] object-cover shadow-2xl" />
            <div className="absolute -bottom-6 -left-6 bg-primary p-6 rounded-2xl shadow-2xl shadow-primary/30 hidden md:block">
              <div className="font-display text-4xl font-bold text-white mb-1">10+</div>
              <div className="text-blue-100 text-xs font-semibold uppercase tracking-wide">Years of Excellence</div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

// ── Testimonials ──────────────────────────────────────────────────────────────

const Testimonials = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-6 max-w-7xl">
      <FadeIn className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-primary font-bold text-sm uppercase tracking-widest mb-4 block">Reviews</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-gray-900 mb-5">Our Customers Say It Best</h2>
      </FadeIn>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TESTIMONIALS.map((r, i) => (
          <FadeIn key={r.name} delay={i * 0.08}>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all">
              <div className="flex text-yellow-400 mb-5">{[...Array(r.rating)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}</div>
              <p className="text-gray-700 text-lg leading-relaxed mb-7 italic">"{r.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl font-display">{r.name.charAt(0)}</div>
                <div>
                  <div className="font-display font-bold text-gray-900">{r.name}</div>
                  <div className="text-sm text-gray-400">{r.role}</div>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

// ── Contact ───────────────────────────────────────────────────────────────────

const Contact = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setForm((p) => ({ ...p, name: user.name, email: user.email }));
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { showToast("Please fill in all required fields.", "error"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); showToast("Message sent! We'll respond within 2 hours."); }, 1400);
  };

  return (
    <section id="contact" className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-6 max-w-7xl">
        <FadeIn className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-bold text-sm uppercase tracking-widest mb-4 block">Get in Touch</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-gray-900 mb-5">Visit Our Showroom</h2>
          <p className="text-gray-500 text-lg">We'd love to meet you. Come see our collection in person or send us a message.</p>
        </FadeIn>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <FadeIn>
            <div className="space-y-8">
              {[
                { Icon: MapPin, title: "Our Location", content: "AutoPrime Boulevard, Jubilee Hills\nHyderabad, Telangana 500033", color: "bg-blue-50 text-blue-600" },
                { Icon: Phone, title: "Phone & WhatsApp", content: "+91 98765 43210\nMon–Sat 9 AM – 8 PM", color: "bg-green-50 text-green-600" },
                { Icon: Mail, title: "Email Us", content: "info@autoprime.in\nWe reply within 2 hours", color: "bg-purple-50 text-purple-600" },
                { Icon: Clock, title: "Showroom Hours", content: "Mon – Sat: 9:00 AM – 8:00 PM\nSunday: By Appointment", color: "bg-orange-50 text-orange-600" },
              ].map(({ Icon, title, content, color }) => (
                <div key={title} className="flex items-start gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${color}`}><Icon className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-display font-bold text-gray-900 mb-1">{title}</h4>
                    <p className="text-gray-500 text-sm whitespace-pre-line leading-relaxed">{content}</p>
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <h4 className="font-display font-bold text-gray-900 mb-4">Follow Us</h4>
                <div className="flex gap-3">
                  {[{ Icon: SiFacebook, color: "hover:bg-blue-600", label: "Facebook" }, { Icon: SiInstagram, color: "hover:bg-pink-600", label: "Instagram" }, { Icon: SiX, color: "hover:bg-gray-900", label: "X" }, { Icon: SiYoutube, color: "hover:bg-red-600", label: "YouTube" }].map(({ Icon, color, label }) => (
                    <a key={label} href="#" className={`w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:text-white transition-all ${color}`} data-testid={`link-social-${label.toLowerCase()}`}><Icon size={18} /></a>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-100/80 border border-gray-100">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-10 h-10 text-green-500" /></div>
                  <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500">We'll get back to you within 2 hours.</p>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-2xl font-bold text-gray-900 mb-6">Send a Message</h3>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">Name *</label>
                        <input name="name" type="text" value={form.name} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all" placeholder="Your name" data-testid="input-contact-name" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">Phone</label>
                        <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all" placeholder="+91 XXXXX" data-testid="input-contact-phone" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">Email *</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all" placeholder="you@email.com" data-testid="input-contact-email" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">Message *</label>
                      <textarea name="message" rows={4} value={form.message} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all resize-none" placeholder="How can we help you?" data-testid="textarea-contact-message" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70" data-testid="button-submit-contact">
                      {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <><MessageCircle className="w-4 h-4" /> Send Message</>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

// ── Footer ─────────────────────────────────────────────────────────────────────

const Footer = () => {
  const { openAuth, user } = useAuth();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) { showToast("Please enter a valid email.", "error"); return; }
    setSubscribed(true);
    showToast("Subscribed! You'll hear about our best deals first.");
  };

  const links = [["buy-cars", "Buy a Car"], ["sell", "Sell Your Car"], ["services", "Services"], ["about", "About Us"], ["contact", "Contact"]];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center"><Car className="w-5 h-5 text-white" /></div>
              <span className="font-display font-bold text-xl">AutoPrime</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">Hyderabad's most trusted destination for premium pre-owned vehicles. Quality you can count on.</p>
            <div className="flex gap-3">
              {[SiFacebook, SiInstagram, SiX, SiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-primary flex items-center justify-center text-gray-400 hover:text-white transition-all"><Icon size={15} /></a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-base mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {links.map(([id, label]) => (
                <li key={id}>
                  <button type="button" onClick={() => scrollTo(id)} className="text-gray-400 hover:text-primary text-sm transition-colors">{label}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-base mb-5">Vehicle Types</h4>
            <ul className="space-y-3">
              {["Luxury SUVs", "Premium Sedans", "Sports Cars", "Hatchbacks", "Electric Vehicles"].map((v) => (
                <li key={v}><button type="button" onClick={() => scrollTo("buy-cars")} className="text-gray-400 hover:text-primary text-sm transition-colors">{v}</button></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-base mb-5">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">Get first access to new arrivals and exclusive deals.</p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-green-400 text-sm font-semibold"><CheckCircle className="w-4 h-4" /> You're subscribed!</div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="flex-1 bg-white/5 border border-white/10 rounded-l-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-white placeholder-gray-500" data-testid="input-newsletter" />
                <button type="submit" className="bg-primary hover:bg-blue-700 text-white px-4 py-2.5 rounded-r-xl text-sm font-bold transition-colors" data-testid="button-subscribe">Go</button>
              </form>
            )}
            {!user && (
              <div className="mt-6 pt-6 border-t border-white/5">
                <button type="button" onClick={() => openAuth("signup")} className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors" data-testid="button-footer-join">
                  <UserCircle size={16} /> Create free account
                </button>
              </div>
            )}
            <div className="mt-4">
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-400 hover:text-green-300 text-sm font-semibold transition-colors" data-testid="link-footer-whatsapp">
                <SiWhatsapp size={16} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} AutoPrime. All rights reserved. Hyderabad, India.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ── Floating WhatsApp ─────────────────────────────────────────────────────────

const FloatingWhatsApp = () => (
  <a
    href="https://wa.me/919876543210?text=Hi, I'd like to enquire about cars at AutoPrime."
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-green-500/30 font-semibold text-sm transition-all hover:-translate-y-0.5"
    data-testid="button-floating-whatsapp"
  >
    <SiWhatsapp size={20} />
    <span className="hidden sm:block">Chat With Us</span>
  </a>
);

// ── Pages & Router ────────────────────────────────────────────────────────────

function Home() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white text-foreground font-sans">
        <Navbar />
        <main>
          <Hero />
          <WhyUs />
          <BuyCars />
          <SellYourCar />
          <Services />
          <About />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
        <FloatingWhatsApp />
        <ToastContainer />
      </div>
    </AuthProvider>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-6">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Car className="w-12 h-12 text-primary" />
      </div>
      <h1 className="font-display text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-700 mb-3">Page Not Found</h2>
      <p className="text-gray-400 mb-8 max-w-md">This road doesn't exist. Let's get you back to the showroom.</p>
      <Link href="/">
        <a className="inline-flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-colors" data-testid="link-back-home">
          Back to Home <ArrowRight className="w-5 h-5" />
        </a>
      </Link>
    </div>
  );
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <AppRouter />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
