import { useState, useEffect, useCallback } from "react";
import { Switch, Route, Router as WouterRouter, Link } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, MapPin, Phone, Mail, Clock,
  ChevronRight, Star, ShieldCheck, Tag,
  Banknote, Wrench, HeadphonesIcon, Car,
  Search, SlidersHorizontal, Fuel, Gauge,
  Calendar, CheckCircle, ArrowRight, MessageCircle,
  ChevronDown, Heart, Share2, Phone as PhoneIcon,
  Zap, Award, Users, TrendingUp, Filter, XCircle
} from "lucide-react";
import { SiFacebook, SiInstagram, SiX, SiYoutube, SiWhatsapp } from "react-icons/si";

const queryClient = new QueryClient();

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

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatPrice = (n: number) => `₹${(n / 100000).toFixed(0)} L`;

// ── Animation Helpers ─────────────────────────────────────────────────────────

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
            className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-white text-sm font-semibold max-w-sm
              ${t.type === "success" ? "bg-green-600" : "bg-red-600"}`}
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ── Car Detail Modal ──────────────────────────────────────────────────────────

type Car = typeof ALL_CARS[0];

const CarModal = ({ car, onClose }: { car: Car; onClose: () => void }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast("Please fill in all fields.", "error");
      return;
    }
    setSubmitted(true);
    showToast(`Enquiry sent for ${car.name}! We'll call you shortly.`);
  };

  return (
    <AnimatePresence>
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
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-lg"
              data-testid="button-modal-close"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>
            {car.badge && (
              <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                {car.badge}
              </span>
            )}
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">{car.name}</h2>
                <p className="text-gray-500 mt-1">{car.year} · {car.color}</p>
              </div>
              <div className="text-right">
                <div className="font-display text-2xl font-bold text-primary">{car.priceDisplay}</div>
                <div className="text-sm text-gray-400">All-inclusive price</div>
              </div>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">{car.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              {submitted ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="font-display text-xl font-bold text-gray-900 mb-2">Enquiry Received!</h3>
                  <p className="text-gray-500">Our team will contact you within 2 hours.</p>
                </div>
              ) : (
                <>
                  <h4 className="font-display font-bold text-gray-900 mb-4">Quick Enquiry</h4>
                  <form onSubmit={handleEnquiry} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      data-testid="input-modal-name"
                    />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      data-testid="input-modal-phone"
                    />
                    <button
                      type="submit"
                      className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap"
                      data-testid="button-modal-enquiry"
                    >
                      Get Callback
                    </button>
                  </form>
                  <a
                    href={`https://wa.me/919876543210?text=Hi, I'm interested in the ${car.name} (${car.year}) listed at ${car.priceDisplay}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center gap-2 w-full border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white py-3 rounded-xl font-semibold text-sm transition-all"
                    data-testid="button-modal-whatsapp"
                  >
                    <SiWhatsapp size={16} /> Chat on WhatsApp
                  </a>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Navbar ────────────────────────────────────────────────────────────────────

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Buy Cars", href: "#buy-cars" },
    { name: "Sell Car", href: "#sell" },
    { name: "Services", href: "#services" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-blue-900/5 border-b border-gray-100 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2.5" data-testid="link-logo">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <Car className="w-5 h-5 text-white" />
          </div>
          <span className={`font-display font-bold text-xl tracking-tight transition-colors ${isScrolled ? "text-gray-900" : "text-white"}`}>
            AutoPrime
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-sm font-semibold transition-colors hover:text-primary ${
                isScrolled ? "text-gray-600" : "text-white/90"
              }`}
              data-testid={`link-nav-${link.name.toLowerCase().replace(/\s/g, "-")}`}
            >
              {link.name}
            </a>
          ))}
          <a
            href="#buy-cars"
            className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40"
            data-testid="button-nav-cta"
          >
            Find Your Car
          </a>
        </nav>

        <button
          className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-white"}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden shadow-xl"
          >
            <div className="flex flex-col px-6 py-4 gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 hover:text-primary font-medium py-3 border-b border-gray-50 text-base"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#buy-cars"
                className="mt-3 bg-primary text-white text-center py-3 rounded-xl font-bold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Find Your Car
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

// ── Hero ──────────────────────────────────────────────────────────────────────

const Hero = () => {
  const stats = [
    { label: "Cars in Stock", value: "200+" },
    { label: "Happy Customers", value: "5,000+" },
    { label: "Years of Trust", value: "10+" },
    { label: "Average Rating", value: "4.9 ★" },
  ];

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-showroom.png"
          alt="Luxury Car Showroom"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/75 to-gray-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
      </div>

      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-blue-400/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-7xl pt-24 pb-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold mb-8"
        >
          <Zap className="w-4 h-4 text-blue-300" />
          <span className="text-blue-100">Hyderabad's Most Trusted Pre-Owned Dealer</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6 text-white max-w-4xl"
        >
          Drive Your Dream.
          <br />
          <span className="bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
            Own With Confidence.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl leading-relaxed"
        >
          Premium pre-owned vehicles with 150-point inspection, full service history, and transparent pricing. No surprises — ever.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#buy-cars"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-2xl shadow-primary/30 group"
            data-testid="button-hero-browse"
          >
            Browse All Cars
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#sell"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all"
            data-testid="button-hero-sell"
          >
            Sell Your Car
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/10 backdrop-blur-xl border-t border-white/10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + i * 0.1 }}
                className="py-6 px-8 text-center md:text-left"
              >
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
    { icon: Award, title: "Certified Warranty", desc: "Every purchase comes with a comprehensive warranty and roadside assistance for complete peace of mind.", color: "text-purple-600 bg-purple-50" },
    { icon: HeadphonesIcon, title: "Expert Guidance", desc: "Our advisors match you to the right car for your lifestyle, budget, and preferences — no pressure.", color: "text-orange-600 bg-orange-50" },
    { icon: Users, title: "5,000+ Happy Owners", desc: "Our track record speaks for itself. Thousands of satisfied customers across Hyderabad and beyond.", color: "text-pink-600 bg-pink-50" },
    { icon: Wrench, title: "Lifetime After-Sale Care", desc: "Your relationship with AutoPrime doesn't end at purchase. Priority service and support, always.", color: "text-teal-600 bg-teal-50" },
  ];

  return (
    <section id="why-us" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <FadeIn className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-bold text-sm uppercase tracking-widest mb-4 block">Why AutoPrime</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-gray-900 mb-5">The Standard You Deserve</h2>
          <p className="text-gray-500 text-lg">We set a higher bar for what a car dealership should be. Here's how we deliver.</p>
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

// ── Buy Cars (Main Feature Section) ───────────────────────────────────────────

const BuyCars = () => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterFuel, setFilterFuel] = useState("All");
  const [filterPrice, setFilterPrice] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const types = ["All", "SUV", "Sedan", "Hatchback", "Sports"];
  const fuels = ["All", "Petrol", "Diesel", "Hybrid", "Electric"];
  const priceRanges = ["All", "Under ₹30L", "₹30L–₹60L", "₹60L–₹1Cr", "Above ₹1Cr"];

  const toggleWishlist = useCallback((id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const filtered = ALL_CARS
    .filter((car) => {
      const matchSearch = car.name.toLowerCase().includes(search.toLowerCase()) ||
        car.type.toLowerCase().includes(search.toLowerCase());
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

  const clearFilters = () => {
    setSearch("");
    setFilterType("All");
    setFilterFuel("All");
    setFilterPrice("All");
    setSortBy("Featured");
  };

  const hasActiveFilters = search || filterType !== "All" || filterFuel !== "All" || filterPrice !== "All";

  return (
    <section id="buy-cars" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <FadeIn className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="text-primary font-bold text-sm uppercase tracking-widest mb-3 block">Our Inventory</span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-gray-900">Find Your Perfect Car</h2>
              <p className="text-gray-500 mt-3 text-lg">{filtered.length} vehicles available</p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors"
              data-testid="button-toggle-filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters {hasActiveFilters && <span className="w-2 h-2 bg-primary rounded-full" />}
            </button>
          </div>

          {/* Search + Sort bar */}
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
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary text-gray-700 text-sm font-medium bg-white cursor-pointer"
              data-testid="select-sort"
            >
              {["Featured", "Price: Low to High", "Price: High to Low", "Newest First"].map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Filter pills */}
          <div className={`${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide mr-1">Type:</span>
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    filterType === t
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                      : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                  }`}
                  data-testid={`filter-type-${t.toLowerCase()}`}
                >
                  {t}
                </button>
              ))}
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide mx-1">Fuel:</span>
              {fuels.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterFuel(f)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    filterFuel === f
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                      : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                  }`}
                  data-testid={`filter-fuel-${f.toLowerCase()}`}
                >
                  {f}
                </button>
              ))}
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide mx-1">Budget:</span>
              {priceRanges.map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterPrice(r)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    filterPrice === r
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                      : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                  }`}
                  data-testid={`filter-price-${r.toLowerCase().replace(/[\s:₹–]/g, "-")}`}
                >
                  {r}
                </button>
              ))}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors ml-2"
                  data-testid="button-clear-filters"
                >
                  <XCircle className="w-4 h-4" /> Clear All
                </button>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Car Grid */}
        {filtered.length === 0 ? (
          <FadeIn className="text-center py-24">
            <Car className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">No cars found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your filters or search terms.</p>
            <button onClick={clearFilters} className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              Reset Filters
            </button>
          </FadeIn>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((car, i) => (
              <FadeIn key={car.id} delay={i * 0.06}>
                <div
                  className="group bg-white rounded-2xl border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/80 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
                  data-testid={`card-car-${car.id}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    <img
                      src={car.img}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {car.badge && (
                      <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        {car.badge}
                      </span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(car.id); }}
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all ${
                        wishlist.includes(car.id)
                          ? "bg-red-500 text-white"
                          : "bg-white/90 text-gray-400 hover:text-red-400"
                      }`}
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
                      <button
                        onClick={() => setSelectedCar(car)}
                        className="flex-1 bg-primary hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
                        data-testid={`button-view-${car.id}`}
                      >
                        View Details
                      </button>
                      <a
                        href={`https://wa.me/919876543210?text=Hi, I want to enquire about ${car.name} (${car.year})`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-green-50 hover:bg-green-500 text-green-600 hover:text-white rounded-xl flex items-center justify-center transition-all shrink-0"
                        data-testid={`button-whatsapp-${car.id}`}
                      >
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

      {selectedCar && <CarModal car={selectedCar} onClose={() => setSelectedCar(null)} />}
    </section>
  );
};

// ── Sell Your Car ─────────────────────────────────────────────────────────────

const SellYourCar = () => {
  const [form, setForm] = useState({ name: "", phone: "", model: "", year: "", km: "", condition: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.model) {
      showToast("Please fill in all required fields.", "error");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      showToast("Quote request received! We'll call you within 1 hour.");
    }, 1500);
  };

  return (
    <section id="sell" className="py-24 bg-gray-50 border-y border-gray-100">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <span className="text-primary font-bold text-sm uppercase tracking-widest mb-4 block">Sell Your Car</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Get the Best Price.<br />Guaranteed.
            </h2>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
              Skip the hassle of private listings and lowball offers. We offer transparent, market-accurate valuations and handle every step — from appraisal to paperwork.
            </p>
            <ul className="space-y-4">
              {[
                "Instant online valuation in minutes",
                "Fair market price — no negotiations",
                "Same-day payment processing",
                "We handle 100% of the paperwork",
                "No obligation, completely free quote",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl shadow-gray-100 border border-gray-100">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">Quote Requested!</h3>
                  <p className="text-gray-500 mb-6">Our valuation expert will contact you within 1 hour with a competitive offer.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", model: "", year: "", km: "", condition: "" }); }}
                    className="text-primary font-semibold hover:underline text-sm"
                  >
                    Submit another car
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-2xl font-bold text-gray-900 mb-6">Get a Free Quote</h3>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Your Name *</label>
                        <input
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Full name"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all"
                          data-testid="input-sell-name"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Phone *</label>
                        <input
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all"
                          data-testid="input-sell-phone"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Car Model *</label>
                      <input
                        name="model"
                        type="text"
                        value={form.model}
                        onChange={handleChange}
                        placeholder="e.g. Honda City, Hyundai Creta"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all"
                        data-testid="input-sell-model"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Year</label>
                        <select
                          name="year"
                          value={form.year}
                          onChange={handleChange}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all bg-white text-gray-700"
                          data-testid="select-sell-year"
                        >
                          <option value="">Select Year</option>
                          {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">KMs Driven</label>
                        <input
                          name="km"
                          type="text"
                          value={form.km}
                          onChange={handleChange}
                          placeholder="e.g. 45,000"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all"
                          data-testid="input-sell-km"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Condition</label>
                      <select
                        name="condition"
                        value={form.condition}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all bg-white text-gray-700"
                        data-testid="select-sell-condition"
                      >
                        <option value="">Select Condition</option>
                        <option value="excellent">Excellent — Like New</option>
                        <option value="good">Good — Minor Wear</option>
                        <option value="fair">Fair — Needs Some Work</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all mt-2 flex items-center justify-center gap-2 disabled:opacity-70"
                      data-testid="button-submit-quote"
                    >
                      {loading ? (
                        <><span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Getting Your Quote...</>
                      ) : (
                        <> <TrendingUp className="w-4 h-4" /> Get Free Valuation</>
                      )}
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
                <div className="flex items-center text-primary text-sm font-semibold group-hover:gap-2 transition-all gap-1">
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
      <img src="/images/team.png" alt="AutoPrime Team" className="w-full h-full object-cover opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-gray-900/60" />
    </div>
    <div className="absolute top-0 left-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[120px] z-0" />

    <div className="relative z-10 container mx-auto px-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <FadeIn>
          <span className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-4 block">Our Story</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
            Built on Trust.<br />Driven by Passion.
          </h2>
          <p className="text-gray-400 text-lg mb-6 leading-relaxed">
            Founded in 2014, AutoPrime was born from a simple conviction: that buying a pre-owned luxury car should feel just as special as buying a new one.
          </p>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Our team of automotive enthusiasts hand-picks every vehicle, subjects it to the most rigorous inspection in Hyderabad, and backs it with transparent pricing and genuine after-sale support.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/10 pt-8">
            {[
              { v: "10+", l: "Years Active" },
              { v: "200+", l: "Cars in Stock" },
              { v: "5K+", l: "Happy Owners" },
              { v: "4.9★", l: "Google Rating" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="font-display font-bold text-2xl text-blue-400 mb-1">{s.v}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">{s.l}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="relative">
            <img
              src="/images/team.png"
              alt="AutoPrime Showroom"
              className="rounded-2xl w-full h-[480px] object-cover shadow-2xl"
            />
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
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg hover:shadow-gray-100 transition-all">
              <div className="flex text-yellow-400 mb-5">
                {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-7 italic">"{r.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl font-display">
                  {r.name.charAt(0)}
                </div>
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
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showToast("Please fill in all required fields.", "error");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      showToast("Message sent! We'll respond within 2 hours.");
    }, 1500);
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
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-gray-900 mb-1">{title}</h4>
                    <p className="text-gray-500 text-sm whitespace-pre-line leading-relaxed">{content}</p>
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <h4 className="font-display font-bold text-gray-900 mb-4">Follow Us</h4>
                <div className="flex gap-3">
                  {[
                    { Icon: SiFacebook, color: "hover:bg-blue-600", label: "Facebook" },
                    { Icon: SiInstagram, color: "hover:bg-pink-600", label: "Instagram" },
                    { Icon: SiX, color: "hover:bg-gray-900", label: "X" },
                    { Icon: SiYoutube, color: "hover:bg-red-600", label: "YouTube" },
                  ].map(({ Icon, color, label }) => (
                    <a
                      key={label}
                      href="#"
                      className={`w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:text-white transition-all ${color}`}
                      data-testid={`link-social-${label.toLowerCase()}`}
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-100/80 border border-gray-100">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
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
                        <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all" placeholder="+91 XXXXX XXXXX" data-testid="input-contact-phone" />
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
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                      data-testid="button-submit-contact"
                    >
                      {loading ? (
                        <><span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Sending...</>
                      ) : (
                        <><MessageCircle className="w-4 h-4" /> Send Message</>
                      )}
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
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showToast("Please enter a valid email.", "error");
      return;
    }
    setSubscribed(true);
    showToast("Subscribed! You'll hear about our best deals first.");
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl">AutoPrime</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Hyderabad's most trusted destination for premium pre-owned vehicles. Quality you can count on.
            </p>
            <div className="flex gap-3">
              {[SiFacebook, SiInstagram, SiX, SiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-primary flex items-center justify-center text-gray-400 hover:text-white transition-all">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-base mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[["#buy-cars", "Buy a Car"], ["#sell", "Sell Your Car"], ["#services", "Services"], ["#about", "About Us"], ["#contact", "Contact"]].map(([href, label]) => (
                <li key={label}><a href={href} className="text-gray-400 hover:text-primary text-sm transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-base mb-5">Vehicle Types</h4>
            <ul className="space-y-3">
              {["Luxury SUVs", "Premium Sedans", "Sports Cars", "Hatchbacks", "Electric Vehicles"].map((v) => (
                <li key={v}><a href="#buy-cars" className="text-gray-400 hover:text-primary text-sm transition-colors">{v}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-base mb-5">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">Get first access to new arrivals and exclusive deals.</p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                <CheckCircle className="w-4 h-4" /> You're subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 bg-white/5 border border-white/10 rounded-l-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-white placeholder-gray-500"
                  data-testid="input-newsletter"
                />
                <button type="submit" className="bg-primary hover:bg-blue-700 text-white px-4 py-2.5 rounded-r-xl text-sm font-bold transition-colors" data-testid="button-subscribe">
                  Go
                </button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-white/5">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-green-400 hover:text-green-300 text-sm font-semibold transition-colors"
                data-testid="link-footer-whatsapp"
              >
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
    className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-green-500/30 font-semibold text-sm transition-all hover:-translate-y-0.5 group"
    data-testid="button-floating-whatsapp"
  >
    <SiWhatsapp size={20} />
    <span className="hidden sm:block">Chat With Us</span>
  </a>
);

// ── Pages & Router ────────────────────────────────────────────────────────────

function Home() {
  return (
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
