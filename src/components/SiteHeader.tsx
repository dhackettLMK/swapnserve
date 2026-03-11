import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Impact", href: "#impact" },
  { label: "Journey", href: "#timeline" },
  { label: "Events", href: "#events" },
  { label: "Volunteer", href: "#volunteer" },
  { label: "FAQ", href: "#faq" },
];

const SiteHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
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
      <motion.div
        initial={false}
        animate={{
          backgroundColor: scrolled
            ? "hsla(152, 42%, 32%, 0.95)"
            : "hsla(152, 42%, 32%, 0)",
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
        }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        {/* Subtle bottom border on scroll */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(90deg, transparent, hsl(var(--accent) / 0.3), transparent)",
          }}
        />

        <div className="container">
          <div className="flex items-center justify-between h-[72px] md:h-20">
            {/* Logo */}
            <motion.a
              href="#"
              className="relative flex items-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <img
                src={logo}
                alt="Swap'n'Serve logo"
                className={`w-auto transition-all duration-500 ${
                  scrolled
                    ? "h-8 md:h-10 brightness-0 invert"
                    : "h-10 md:h-12 brightness-0 invert"
                }`}
              />
            </motion.a>

            {/* Desktop nav — floating pill with glow */}
            <nav className="hidden lg:flex items-center gap-3" aria-label="Main navigation">
              <div className="relative flex items-center gap-0.5 rounded-full border border-white/[0.15] bg-white/[0.08] px-1 py-1">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.href;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className={`relative z-10 text-[13px] font-medium px-4 py-2 rounded-full transition-all duration-300 ${
                        isActive
                          ? "text-accent-foreground"
                          : "text-primary-foreground/50 hover:text-primary-foreground/80"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-accent shadow-lg shadow-accent/20"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </a>
                  );
                })}
              </div>

              <a
                href="https://example.com/volunteer"
                className="group relative inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground shadow-lg shadow-secondary/25 transition-all hover:shadow-xl hover:shadow-secondary/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                Sign Up
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>
            </nav>

            {/* Tablet */}
            <nav className="hidden md:flex lg:hidden items-center gap-4" aria-label="Tablet navigation">
              {navLinks.slice(0, 3).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-300 ${
                    activeSection === link.href
                      ? "text-accent"
                      : "text-primary-foreground/50 hover:text-primary-foreground/80"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://example.com/volunteer"
                className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground shadow-lg shadow-secondary/25"
              >
                Sign Up
                <ArrowRight size={14} />
              </a>
            </nav>

            {/* Mobile toggle */}
            <motion.button
              className="md:hidden relative w-11 h-11 flex items-center justify-center rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.05] text-primary-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Mobile menu — premium overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 top-[72px] bg-foreground/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
              className="md:hidden absolute top-full left-3 right-3 mt-2 rounded-2xl bg-foreground/95 backdrop-blur-xl border border-primary-foreground/[0.06] shadow-2xl overflow-hidden"
            >
              <nav className="p-4 space-y-1" aria-label="Mobile navigation">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                    className={`flex items-center gap-3 text-[15px] font-medium py-3.5 px-4 rounded-xl transition-all ${
                      activeSection === link.href
                        ? "bg-accent/15 text-accent"
                        : "text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/[0.04]"
                    }`}
                  >
                    <span
                      className={`w-1 h-1 rounded-full ${
                        activeSection === link.href ? "bg-accent" : "bg-primary-foreground/20"
                      }`}
                    />
                    {link.label}
                  </motion.a>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="pt-3"
                >
                  <a
                    href="https://example.com/volunteer"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-secondary py-3.5 text-[15px] font-bold text-secondary-foreground shadow-lg shadow-secondary/25"
                  >
                    Sign Up to Volunteer
                    <ArrowRight size={16} />
                  </a>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default SiteHeader;
