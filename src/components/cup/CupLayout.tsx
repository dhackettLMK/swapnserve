import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import logo from "@/assets/logo.png";
import SiteFooter from "@/components/SiteFooter";

/** Shared shell for the Cup pages — native header/footer, back-to-site link. */
const CupLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-primary text-primary-foreground">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Swap'n'Serve logo" className="h-9 w-auto brightness-0 invert" />
            <span className="hidden sm:inline text-sm font-semibold uppercase tracking-[0.16em] text-accent">
              Cup
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm font-medium">
            <Link
              to="/cup"
              className="rounded-md px-3 py-2 hover:bg-primary-foreground/10 transition-colors"
            >
              Register
            </Link>
            <Link
              to="/cup/tournament"
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 hover:bg-primary-foreground/10 transition-colors"
            >
              <Trophy size={15} className="text-accent" /> Tournament
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
};

export default CupLayout;
