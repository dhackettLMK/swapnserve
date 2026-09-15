import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import logo from "@/assets/logo.png";
import cupSpray from "@/assets/cup-spraypaint.png";
import SiteFooter from "@/components/SiteFooter";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";

/** Shared shell for the Cup pages with a native header, footer and back-to-site link. */
const CupLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PaymentTestModeBanner />
      <header className="sticky top-0 z-40 border-b border-primary-foreground/10 bg-primary/95 text-primary-foreground backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Swap'n'Serve logo" className="h-9 w-auto brightness-0 invert" />
            <img
              src={cupSpray}
              alt="Cup"
              className="hidden h-6 w-auto sm:block"
            />
          </Link>
          <nav className="flex items-center gap-1 font-cup-body text-sm font-medium">
            <Link
              to="/cup"
              className="rounded-full px-3 py-2 transition-colors hover:bg-primary-foreground/10"
            >
              Register
            </Link>
            <Link
              to="/cup/format"
              className="rounded-full px-3 py-2 transition-colors hover:bg-primary-foreground/10"
            >
              Format
            </Link>
            <Link
              to="/cup/tournament"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 transition-colors hover:bg-primary-foreground/10"
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
