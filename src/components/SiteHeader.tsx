import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CupButtonBrand from "@/components/cup/CupButtonBrand";
import wordmark from "@/assets/swapnserve-wordmark-cup.png";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Impact", href: "#impact" },
  { label: "Journey", href: "#timeline" },
  { label: "Donate", href: "#donate" },
  { label: "Volunteer", href: "#volunteer" },
  { label: "FAQ", href: "#faq" },
];

const SiteHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    navLinks.forEach((link) => {
      const element = document.querySelector(link.href);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
      <div
        className={`mx-auto max-w-6xl rounded-2xl border border-primary-foreground/15 bg-primary/95 text-primary-foreground transition-all duration-300 ${
          scrolled ? "shadow-xl" : "shadow-lg"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 md:h-[72px] md:px-6">
          <a href="#" className="flex items-center">
            <img src={wordmark} alt="Swap'n'Serve logo" className="h-8 w-auto md:h-10" />
          </a>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => {
              const active = activeSection === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary-foreground text-primary"
                      : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <Link
              to="/cup"
              aria-label="Sign Up to the Cup"
              className="ml-3 inline-flex items-center rounded-full bg-secondary px-4 py-2 transition-transform hover:scale-[1.02]"
            >
              <CupButtonBrand wordmarkClass="h-3" cupClass="h-4" />
            </Link>
          </nav>

          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/10 text-primary-foreground"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-primary-foreground/10 px-4 py-4"
              aria-label="Mobile navigation"
            >
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-xl px-3 py-3 text-sm font-medium ${
                      activeSection === link.href
                        ? "bg-primary-foreground text-primary"
                        : "text-primary-foreground/80 hover:bg-primary-foreground/10"
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
                <Link
                  to="/cup"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Sign Up to the Swap'n'Serve Cup"
                  className="mt-3 flex items-center justify-center rounded-xl bg-secondary px-3 py-3"
                >
                  <CupButtonBrand wordmarkClass="h-3.5" cupClass="h-4.5" />
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default SiteHeader;
