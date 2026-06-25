import React, { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter, Link } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, MapPin, Phone, Mail, Clock, 
  ChevronRight, Star, ShieldCheck, Tag, 
  Banknote, Wrench, HeadphonesIcon, Car
} from "lucide-react";
import { SiFacebook, SiInstagram, SiX, SiYoutube } from "react-icons/si";

const queryClient = new QueryClient();

// --- Components ---

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
  </motion.div>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Why Us", href: "#why-us" },
    { name: "Cars", href: "#cars" },
    { name: "Sell", href: "#sell" },
    { name: "Services", href: "#services" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/90 backdrop-blur-md border-b border-white/5 py-4 shadow-lg" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2" data-testid="link-logo">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center text-primary-foreground font-bold text-xl">
            A
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-white">AutoPrime</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-white/80 hover:text-primary transition-colors"
              data-testid={`link-nav-${link.name.toLowerCase()}`}
            >
              {link.name}
            </a>
          ))}
          <a 
            href="#cars" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-sm font-semibold transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] text-sm"
            data-testid="button-nav-cta"
          >
            Find Your Car
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-lg font-medium text-white/80 hover:text-primary py-2 border-b border-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/hero-showroom.png" 
          alt="Luxury Car Showroom" 
          className="w-full h-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">Premium Pre-Owned</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-6 text-white"
          >
            Where Every Drive <br/>
            Begins With <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-200">Trust.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-white/70 mb-10 max-w-xl font-light"
          >
            Experience the finest selection of thoroughly inspected, premium pre-owned vehicles. Uncompromising quality for the discerning driver.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a 
              href="#cars" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-sm font-semibold text-center transition-all flex items-center justify-center gap-2 group hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
              data-testid="button-hero-browse"
            >
              Browse Our Fleet <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#sell" 
              className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-white px-8 py-4 rounded-sm font-semibold text-center transition-all"
              data-testid="button-hero-sell"
            >
              Sell Your Car
            </a>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-white/5 py-6">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Cars Delivered", value: "500+" },
              { label: "Happy Customers", value: "5000+" },
              { label: "Years Experience", value: "10+" },
              { label: "Average Rating", value: "4.9★" }
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + (i * 0.1) }}
                className="text-center md:text-left border-l border-white/10 pl-6 first:border-0 md:first:pl-0"
              >
                <div className="font-display font-bold text-3xl md:text-4xl text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/50 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const WhyUs = () => {
  const pillars = [
    { icon: <ShieldCheck className="w-8 h-8" />, title: "Verified Quality", desc: "Every vehicle undergoes a rigorous 150-point inspection before hitting our showroom floor." },
    { icon: <Tag className="w-8 h-8" />, title: "Transparent Pricing", desc: "No hidden fees, no last-minute surprises. The price you see is the price you pay." },
    { icon: <Banknote className="w-8 h-8" />, title: "Full Warranty", desc: "Drive away with confidence. Comprehensive warranty coverage on every purchase." },
    { icon: <HeadphonesIcon className="w-8 h-8" />, title: "Expert Guidance", desc: "Our automotive experts are here to advise, not just sell. Your perfect match is our goal." },
    { icon: <Wrench className="w-8 h-8" />, title: "After-Sale Support", desc: "Our relationship doesn't end at the sale. Enjoy priority service and maintenance." },
  ];

  return (
    <section id="why-us" className="py-24 bg-card/30 relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">The AutoPrime Standard</h2>
          <p className="text-white/60 text-lg">We don't just sell cars; we deliver peace of mind. Discover why thousands of drivers trust us with their automotive journey.</p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <FadeIn key={pillar.title} delay={i * 0.1}>
              <div className="p-8 rounded-lg bg-background border border-white/5 hover:border-primary/30 transition-colors h-full group">
                <div className="text-primary mb-6 group-hover:scale-110 transition-transform origin-left">{pillar.icon}</div>
                <h3 className="font-display text-xl font-bold mb-3">{pillar.title}</h3>
                <p className="text-white/60 leading-relaxed">{pillar.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const Fleet = () => {
  const cars = [
    { name: "Mercedes-Benz GLE", year: "2022", price: "$65,000", mileage: "24,000 mi", type: "SUV", fuel: "Petrol", img: "/images/car-suv.png" },
    { name: "BMW S-Class 500", year: "2023", price: "$89,500", mileage: "12,500 mi", type: "Sedan", fuel: "Hybrid", img: "/images/car-sedan.png" },
    { name: "Audi RS 3", year: "2021", price: "$42,000", mileage: "35,000 mi", type: "Hatchback", fuel: "Petrol", img: "/images/car-hatchback.png" },
    { name: "Porsche Macan", year: "2023", price: "$72,000", mileage: "8,000 mi", type: "Crossover", fuel: "Petrol", img: "/images/car-crossover.png" },
    { name: "Ford F-150 Raptor", year: "2022", price: "$58,900", mileage: "19,000 mi", type: "Pickup", fuel: "Petrol", img: "/images/car-pickup.png" },
    { name: "Aston Martin 911", year: "2020", price: "$115,000", mileage: "14,000 mi", type: "Sports", fuel: "Petrol", img: "/images/car-sports.png" },
  ];

  return (
    <section id="cars" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <FadeIn className="max-w-2xl">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">Browse Our Fleet</h2>
            <p className="text-white/60 text-lg">Curated excellence. Every vehicle in our inventory represents the pinnacle of its class, ready for its next chapter.</p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <button className="text-primary hover:text-white transition-colors font-semibold flex items-center gap-2 border-b border-primary pb-1">
              View Complete Inventory <ChevronRight className="w-4 h-4" />
            </button>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car, i) => (
            <FadeIn key={car.name} delay={i * 0.1}>
              <div className="group rounded-lg overflow-hidden bg-card border border-white/5 hover:border-primary/30 transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={car.img} 
                    alt={car.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-sm text-xs font-semibold uppercase tracking-wider">
                    {car.type}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-display text-xl font-bold group-hover:text-primary transition-colors">{car.name}</h3>
                    <div className="text-lg font-bold text-white">{car.price}</div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-white/50 mb-6">
                    <span>{car.year}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>{car.mileage}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>{car.fuel}</span>
                  </div>
                  
                  <button 
                    className="w-full py-3 rounded-sm border border-white/10 font-semibold group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
                    data-testid={`button-view-${car.name.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const SellYourCar = () => {
  return (
    <section id="sell" className="py-24 bg-card/50 relative border-y border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">Upgrade Your Journey. <br/>Sell With Confidence.</h2>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              Ready for something new? We offer competitive, data-driven valuations for premium vehicles. Skip the hassle of private sales and let our experts handle everything from appraisal to paperwork.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                "Instant, fair market valuations",
                "Same-day payment processing",
                "No obligation to buy from us",
                "We handle all title and transfer paperwork"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-background p-8 md:p-10 rounded-lg border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px]" />
              <h3 className="font-display text-2xl font-bold mb-6">Get a Free Quote</h3>
              
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Full Name</label>
                    <input type="text" className="w-full bg-card border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Phone Number</label>
                    <input type="tel" className="w-full bg-card border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Car Model</label>
                    <input type="text" className="w-full bg-card border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white" placeholder="e.g. BMW X5" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Year</label>
                    <select className="w-full bg-card border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white appearance-none">
                      <option value="">Select Year</option>
                      {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-sm transition-all mt-4"
                  data-testid="button-submit-quote"
                >
                  Request Evaluation
                </button>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    { title: "Pre-Purchase Inspection", desc: "Comprehensive 150-point diagnostic check by certified master technicians." },
    { title: "Premium Financing", desc: "Tailored financial solutions with competitive rates from top-tier lenders." },
    { title: "Insurance Assistance", desc: "Seamless integration with leading insurance providers for immediate coverage." },
    { title: "Trade-In Program", desc: "Effortlessly upgrade your vehicle with our transparent trade-in process." },
    { title: "Concierge Test Drive", desc: "Schedule a personalized viewing and test drive at your convenience." },
    { title: "Aftercare Service", desc: "Dedicated maintenance and detailing to keep your vehicle pristine." },
  ];

  return (
    <section id="services" className="py-24">
      <div className="container mx-auto px-6 max-w-7xl">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">Beyond the Showroom</h2>
          <p className="text-white/60 text-lg">A truly premium experience extends far beyond the point of purchase. Explore our comprehensive suite of automotive services.</p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv, i) => (
            <FadeIn key={srv.title} delay={i * 0.1}>
              <div className="p-8 bg-card border border-white/5 hover:bg-white/5 transition-colors rounded-sm group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-background border border-white/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all">
                  <Car className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{srv.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{srv.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 bg-card/30 relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div className="relative">
              <img 
                src="/images/team.png" 
                alt="AutoPrime Team" 
                className="rounded-lg object-cover w-full h-[500px] grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute -bottom-8 -right-8 bg-background border border-white/10 p-8 rounded-sm shadow-xl hidden md:block">
                <div className="font-display text-5xl font-bold text-primary mb-2">10+</div>
                <div className="text-white/70 uppercase tracking-widest text-sm font-semibold">Years of Excellence</div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="lg:pl-8">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">Redefining the Dealership Experience.</h2>
            <p className="text-white/70 text-lg mb-6 leading-relaxed">
              Founded in 2014, AutoPrime emerged from a simple vision: to eliminate the friction and uncertainty from buying a pre-owned luxury vehicle. We believed that buying a used car should feel just as prestigious as buying a new one.
            </p>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              Our team of automotive enthusiasts doesn't just curate cars; we curate experiences. Every vehicle in our showroom is hand-selected, rigorously tested, and impeccably detailed.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <div>
                <div className="text-primary font-bold text-2xl mb-1">24/7</div>
                <div className="text-sm text-white/50">Support Available</div>
              </div>
              <div>
                <div className="text-primary font-bold text-2xl mb-1">100%</div>
                <div className="text-sm text-white/50">Client Satisfaction</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    { name: "Michael Chang", role: "Entrepreneur", text: "The most transparent car buying experience I've ever had. The Porsche was exactly as described, and the paperwork took less than 30 minutes." },
    { name: "Sarah Jenkins", role: "Architect", text: "AutoPrime's attention to detail is unmatched. They helped me find the perfect SUV for my family without any high-pressure sales tactics." },
    { name: "David Thorne", role: "Executive", text: "Traded in my old sedan and walked out with a stunning S-Class. The valuation was fair and the transition was completely seamless." },
    { name: "Elena Rostova", role: "Designer", text: "Impeccable showroom, knowledgeable staff, and vehicles that look brand new. I recommend AutoPrime to all my colleagues." },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <FadeIn className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">Words From Our Drivers</h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review, i) => (
            <FadeIn key={review.name} delay={i * 0.1}>
              <div className="bg-card/40 p-8 rounded-sm border border-white/5 hover:border-primary/20 transition-colors">
                <div className="flex text-primary mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-white/80 text-lg italic mb-8">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-xl text-white/50">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white">{review.name}</div>
                    <div className="text-sm text-white/50">{review.role}</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-card/80 border-t border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <FadeIn>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">Visit Our Showroom</h2>
            <p className="text-white/60 text-lg mb-10">Experience our collection in person. Our doors are open for serious buyers and automotive enthusiasts alike.</p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-background border border-white/10 flex items-center justify-center rounded-sm shrink-0">
                  <MapPin className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Location</h4>
                  <p className="text-white/60">AutoPrime Boulevard, Jubilee Hills<br/>Hyderabad, TS 500033, India</p>
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-background border border-white/10 flex items-center justify-center rounded-sm shrink-0">
                  <Phone className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Contact</h4>
                  <p className="text-white/60">+91 98765 43210 (Phone & WhatsApp)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-background border border-white/10 flex items-center justify-center rounded-sm shrink-0">
                  <Clock className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Hours</h4>
                  <p className="text-white/60">Monday - Saturday: 10:00 AM - 8:00 PM<br/>Sunday: By Appointment Only</p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="bg-background p-8 rounded-lg border border-white/5">
            <h3 className="font-display text-2xl font-bold mb-6">Send a Message</h3>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Name</label>
                  <input type="text" className="w-full bg-card border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-primary text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Email</label>
                  <input type="email" className="w-full bg-card border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-primary text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Message</label>
                <textarea rows={4} className="w-full bg-card border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-primary text-white resize-none"></textarea>
              </div>
              <button 
                type="submit" 
                className="bg-white hover:bg-gray-200 text-black font-bold py-4 px-8 rounded-sm transition-colors w-full sm:w-auto"
                data-testid="button-submit-contact"
              >
                Send Message
              </button>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-background pt-20 pb-10 border-t border-white/10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center text-primary-foreground font-bold text-xl">
                A
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">AutoPrime</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              The premier destination for luxury pre-owned vehicles. Uncompromising quality, transparent pricing, and exceptional service.
            </p>
            <div className="flex gap-4">
              {[SiFacebook, SiInstagram, SiX, SiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-primary hover:text-primary-foreground transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Inventory', 'Sell Your Car', 'Financing', 'About Us', 'Contact'].map(link => (
                <li key={link}><a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Vehicle Types</h4>
            <ul className="space-y-3">
              {['Luxury Sedans', 'Premium SUVs', 'Sports Cars', 'Exotic Hatchbacks', 'Electric Vehicles'].map(link => (
                <li key={link}><a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Newsletter</h4>
            <p className="text-white/50 text-sm mb-4">Subscribe to receive updates on new arrivals and exclusive offers.</p>
            <div className="flex">
              <input type="email" placeholder="Your email" className="bg-card border border-white/10 rounded-l-sm px-4 py-2 w-full focus:outline-none focus:border-primary text-sm" />
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-r-sm font-semibold text-sm hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">© {new Date().getFullYear()} AutoPrime. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-white/40">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Pages ---

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main>
        <Hero />
        <WhyUs />
        <Fleet />
        <SellYourCar />
        <Services />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="relative z-10">
        <h1 className="font-display text-8xl md:text-[150px] font-bold text-white/10 mb-4 tracking-tighter">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Page Not Found</h2>
        <p className="text-white/50 mb-10 max-w-md mx-auto">The road you're looking for doesn't exist. Let's get you back on track.</p>
        <Link href="/">
          <a className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-sm font-semibold transition-all hover:bg-primary/90">
            Return to Showroom
          </a>
        </Link>
      </div>
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
