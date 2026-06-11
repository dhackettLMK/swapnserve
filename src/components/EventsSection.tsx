import { motion } from "framer-motion";
import { CalendarDays, MapPin, Clock, CheckCircle2, Info } from "lucide-react";

const acceptedItems = [
  "Clean, wearable clothing (all sizes)",
  "Shoes in good condition",
  "Coats, jackets, and warm layers",
  "School uniforms",
  "Baby and children's clothing",
];

const EventsSection = () => {
  return (
    <section id="events" className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4">
            Get Involved
          </span>
          <h2 className="text-3xl md:text-4xl font-section font-bold text-foreground mb-4">
            Events & Donations
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Find out when our next event is happening and how you can donate.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm transition-shadow hover:shadow-lg hover:shadow-primary/5"
          >
            <h3 className="text-xl font-section font-bold text-foreground mb-4 flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center">
                <CalendarDays size={18} className="text-secondary" />
              </div>
              Upcoming Event
            </h3>
            <div className="rounded-2xl bg-muted p-5 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Info size={16} />
                <span className="italic">Details to be announced</span>
              </div>
              <p className="text-sm text-muted-foreground">
                We are planning our next clothing swap event. Follow us on social media or check
                back here for updates on dates and locations.
              </p>
            </div>
            <a
              href="https://www.gofundme.com/f/swapnserve-2"
              className="inline-flex items-center rounded-full border border-primary bg-primary/5 px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:scale-[1.02] active:scale-[0.98]"
            >
              Make a Donation
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm transition-shadow hover:shadow-lg hover:shadow-primary/5"
          >
            <h3 className="text-xl font-section font-bold text-foreground mb-4 flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center">
                <MapPin size={18} className="text-secondary" />
              </div>
              Make a Donation
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Support our work by making a donation through our GoFundMe. Every contribution helps us continue redistributing clothing to families in need.
            </p>

            <a
              href="https://www.gofundme.com/f/swapnserve-2"
              className="inline-flex items-center rounded-full border border-primary bg-primary/5 px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:scale-[1.02] active:scale-[0.98]"
            >
              Donate on GoFundMe
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
