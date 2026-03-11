import { motion } from "framer-motion";
import { useState } from "react";

const events = [
  {
    date: "Early 2025",
    title: "The Idea Takes Shape",
    description:
      "David Hackett and a small group of Limerick locals begin organising around a simple idea: clothing should not go to waste when neighbours need it.",
  },
  {
    date: "June 2025",
    title: "Donation Network Launches",
    description:
      "Schools and local organisations begin collecting clean, wearable clothing in the weeks leading up to the first public event.",
  },
  {
    date: "August 2025",
    title: "First Public Swap & Giveaway",
    description:
      "Swap'n'Serve holds its inaugural clothing swap and giveaway in Limerick. Families and individuals attend freely, no questions asked.",
  },
  {
    date: "Autumn 2025",
    title: "Partnerships Grow",
    description:
      "Collaborations form with local brands and community partners, expanding reach and building a more sustainable collection network.",
  },
  {
    date: "2026",
    title: "Swap'n'Serve Continues",
    description:
      "Fundraising and planning are underway for the next chapter, with bigger events and broader community engagement on the horizon.",
  },
];

const TimelineSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section id="timeline" className="py-20 md:py-28 bg-card">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4">
            Our Story
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Our Journey
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From a conversation to a movement. Here is how Swap'n'Serve has grown.
          </p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-primary/20 to-transparent md:-translate-x-px" />

          {events.map((event, i) => {
            const isExpanded = expandedIndex === i;
            return (
              <motion.div
                key={event.date}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex items-start mb-10 last:mb-0 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Animated dot */}
                <motion.div
                  whileHover={{ scale: 1.5 }}
                  className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-card -translate-x-1/2 mt-2 z-10 cursor-pointer"
                  onClick={() => setExpandedIndex(isExpanded ? null : i)}
                />

                {/* Content card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setExpandedIndex(isExpanded ? null : i)}
                  className={`ml-12 md:ml-0 md:w-[calc(50%-2.5rem)] cursor-pointer rounded-2xl border border-border bg-background p-5 transition-shadow hover:shadow-lg hover:shadow-primary/5 ${
                    i % 2 === 0 ? "md:mr-auto md:text-right" : "md:ml-auto md:text-left"
                  }`}
                >
                  <span className="inline-block text-xs font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full mb-2">
                    {event.date}
                  </span>
                  <h3 className="text-lg font-display font-bold text-foreground mb-1">{event.title}</h3>
                  <motion.div
                    initial={false}
                    animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed pt-1">{event.description}</p>
                  </motion.div>
                  {!isExpanded && (
                    <p className="text-xs text-primary font-medium mt-1">Tap to read more</p>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
