import pressLogo from "@/assets/swapnserve-wordmark-green-tight.png";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Mail } from "lucide-react";
import { CONTACT } from "@/content";

const links = [
  { to: "/press", label: "Story", end: true },
  { to: "/press#people", label: "People", end: false },
  { to: "/press/cup", label: "The Cup", end: false },
  { to: "/press/blog", label: "Articles", end: false },
  { to: "/press/kit", label: "Press Kit", end: false },
];

const PressNav = () => {
  const [open, setOpen] = useState(false);

  const goTo = (to: string) => (e: React.MouseEvent) => {
    if (to.includes("#")) {
      const [path, hash] = to.split("#");
      if (window.location.pathname === path) {
        e.preventDefault();
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        setOpen(false);
      }
    } else {
      setOpen(false);
    }
  };

  return (
    <header className="no-print sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" aria-label="Swap'N'Serve press, back to the homepage" className="flex flex-col items-start leading-none">
          <img src={pressLogo} alt="Swap'N'Serve" className="h-8 w-auto" />
          <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.35em] text-primary">Press</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Press room">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.end}
              onClick={goTo(l.to)}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-foreground/80"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <a
            href={`mailto:${CONTACT.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Mail className="h-4 w-4" aria-hidden /> Contact
          </a>
        </nav>
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-border bg-background px-4 pb-4 pt-2 md:hidden" aria-label="Press room mobile">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.end}
              onClick={goTo(l.to)}
              className="block rounded-md px-2 py-2.5 text-base font-medium text-foreground hover:bg-muted"
            >
              {l.label}
            </NavLink>
          ))}
          <a
            href={`mailto:${CONTACT.email}`}
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Mail className="h-4 w-4" aria-hidden /> Contact
          </a>
        </nav>
      )}
    </header>
  );
};

export default PressNav;
