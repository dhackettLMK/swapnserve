
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const SiteFooter = () => {
  return (
    <footer className="bg-primary py-12 md:py-16" role="contentinfo">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div>
            <a href="#" className="inline-block">
              <img src={logo} alt="Swap'n'Serve logo" className="h-12 w-auto brightness-0 invert" />
            </a>
            <p className="text-sm text-primary-foreground/60 mt-3 leading-relaxed">
              A nonprofit organisation working for the betterment of Limerick city through
              community-led programmes. Founded by David Hackett.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-primary-foreground mb-3">Quick Links</h3>
            <nav aria-label="Footer navigation" className="space-y-2">
              {[
                { label: "How It Works", href: "#how-it-works" },
                { label: "Our Impact", href: "#impact" },
                { label: "Our Journey", href: "#timeline" },
                { label: "Donate", href: "#donate" },
                { label: "Volunteer", href: "#volunteer" },
                { label: "FAQ", href: "#faq" },
              ].map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  whileHover={{ x: 4 }}
                  className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-primary-foreground mb-3">Get in Touch</h3>
            <div className="space-y-2 text-sm text-primary-foreground/60">
              <p>Email: hello@swapnserve.ie</p>
              <p>Location: Limerick, Ireland</p>
              <div className="flex gap-3 mt-4">
                <motion.a
                  href="https://www.instagram.com/swapandserve/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full bg-primary-foreground/10 px-4 py-2 text-xs font-medium text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/20 transition-all"
                  aria-label="Visit our Instagram page"
                >
                  Instagram
                </motion.a>
                {["Facebook", "Twitter"].map((s) => (
                  <motion.a
                    key={s}
                    href="#"
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full bg-primary-foreground/10 px-4 py-2 text-xs font-medium text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/20 transition-all"
                    aria-label={`Visit our ${s} page`}
                  >
                    {s}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>

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
          <div className="text-xs text-primary-foreground/30 mt-6">
            © {new Date().getFullYear()} Swap'n'Serve, Limerick.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
