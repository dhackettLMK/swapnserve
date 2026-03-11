import { Handshake } from "lucide-react";

const PartnersSection = () => {
  return (
    <section id="partners" className="py-20 md:py-28">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Community Partners
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            We work alongside schools, local organisations, and community groups across Limerick.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-card rounded-xl border border-border p-8 md:p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Handshake size={32} className="text-primary" />
          </div>
          <p className="text-muted-foreground mb-4">
            Partner logos and details will be displayed here as collaborations are confirmed. If
            your school or organisation would like to support Swap'n'Serve, we'd love to hear from
            you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["School Partner", "Community Org", "Local Brand", "Youth Group"].map((name) => (
              <div
                key={name}
                className="px-6 py-3 rounded-lg bg-muted text-sm text-muted-foreground font-medium"
              >
                {name}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/60 mt-6 italic">
            Listing as a partner does not imply formal endorsement or affiliation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
