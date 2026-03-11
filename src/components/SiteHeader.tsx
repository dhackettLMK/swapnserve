import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Impact", href: "#impact" },
  { label: "Our Journey", href: "#timeline" },
  { label: "Events", href: "#events" },
  { label: "Volunteer", href: "#volunteer" },
  { label: "FAQ", href: "#faq" },
];

const SiteHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection("#" + entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    navLinks.forEach((link) => {
      const el = document.querySelector(link.href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-secondary" />

      <div
        className={`transition-all duration-500 ${
          scrolled
            ? "bg-foreground/90 backdrop-blur-xl shadow-2xl"
            : "bg-foreground/70 backdrop-blur-md"
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            {/* Logo */}
            <a href="#" className="relative group flex items-center">
              <img
                src={logo}
                alt="Swap'n'Serve logo"
                className="h-9 md:h-11 w-auto brightness-0 invert transition-transform duration-300 group-hover:scale-105"
              />
            </a>

            {/* Desktop nav — floating pill */}
            <nav className="hidden lg:flex items-center" aria-label="Main navigation">
              <div className="flex items-center gap-1 bg-primary-foreground/[0.08] rounded-full px-1.5 py-1.5">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`relative text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 ${
                      activeSection === link.href
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/[0.06]"
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="ml-4">
                <Button
                  variant="cta"
                  size="sm"
                  asChild
                  className="rounded-full px-6 shadow-lg shadow-secondary/30 hover:shadow-secondary/50 transition-shadow"
                >
                  <a href="https://example.com/volunteer">Sign Up</a>
                </Button>
              </div>
            </nav>

            {/* Tablet nav (fewer items) */}
            <nav className="hidden md:flex lg:hidden items-center gap-3" aria-label="Tablet navigation">
              {navLinks.slice(0, 3).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === link.href
                      ? "text-accent"
                      : "text-primary-foreground/60 hover:text-primary-foreground"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <Button
                variant="cta"
                size="sm"
                asChild
                className="rounded-full px-5 shadow-lg shadow-secondary/30"
              >
                <a href="https://example.com/volunteer">Sign Up</a>
              </Button>
            </nav>

            {/* Mobile toggle */}
            <button
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground/20"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — full overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="md:hidden absolute top-full left-0 right-0 bg-foreground/95 backdrop-blur-xl border-t border-primary-foreground/5"
          >
            <nav className="container py-6 space-y-1" aria-label="Mobile navigation">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-3 text-lg font-medium py-3 px-4 rounded-xl transition-colors ${
                    activeSection === link.href
                      ? "bg-primary/20 text-accent"
                      : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/5"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                  {link.label}
                </motion.a>
              ))}
              <div className="pt-4">
                <Button variant="cta" className="w-full rounded-full shadow-lg shadow-secondary/30" asChild>
                  <a href="https://example.com/volunteer">Sign Up to Volunteer</a>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default SiteHeader;
