import { Heart } from "lucide-react";
import logo from "@/assets/logo.png";

const SiteFooter = () => {
  return (
    <footer className="bg-foreground py-12 md:py-16" role="contentinfo">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <a href="#" className="inline-block">
              <img src={logo} alt="Swap'n'Serve logo" className="h-12 w-auto brightness-0 invert" />
            </a>
            <p className="text-sm text-primary-foreground/60 mt-3 leading-relaxed">
              A community-led clothing redistribution initiative based in Limerick, Ireland.
              Founded by David Hackett.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-primary-foreground mb-3">Quick Links</h3>
            <nav aria-label="Footer navigation" className="space-y-2">
              {[
                { label: "How It Works", href: "#how-it-works" },
                { label: "Our Impact", href: "#impact" },
                { label: "Our Journey", href: "#timeline" },
                { label: "Events & Donations", href: "#events" },
                { label: "Volunteer", href: "#volunteer" },
                { label: "FAQ", href: "#faq" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-primary-foreground mb-3">Get in Touch</h3>
            <div className="space-y-2 text-sm text-primary-foreground/60">
              <p>Email: hello@swapnserve.ie (placeholder)</p>
              <p>Location: Limerick, Ireland</p>
              <div className="flex gap-3 mt-4">
                {["Facebook", "Instagram", "Twitter"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="text-primary-foreground/40 hover:text-primary-foreground transition-colors text-sm"
                    aria-label={`Visit our ${s} page`}
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & privacy */}
        <div className="border-t border-primary-foreground/10 pt-8">
          <p className="text-xs text-primary-foreground/40 leading-relaxed max-w-3xl">
            <strong>Disclaimer:</strong> Swap'n'Serve is an independent community initiative. Listing
            of partners or supporters on this site does not imply formal endorsement, sponsorship, or
            affiliation. Swap'n'Serve is not a registered charity.
          </p>
          <p className="text-xs text-primary-foreground/40 mt-3 leading-relaxed max-w-3xl">
            <strong>Privacy:</strong> We collect only the minimum personal information needed to
            coordinate volunteers and events. Your data is never sold or shared with third parties.
          </p>
          <div className="flex items-center gap-1 text-xs text-primary-foreground/30 mt-6">
            <span>© {new Date().getFullYear()} Swap'n'Serve. Made with</span>
            <Heart size={12} className="text-secondary" />
            <span>in Limerick.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
