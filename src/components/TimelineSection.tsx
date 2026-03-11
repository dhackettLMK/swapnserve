import { motion } from "framer-motion";

const events = [
  {
    date: "Early 2025",
    title: "The Idea Takes Shape",
    description:
      "David Hackett and a small group of Limerick locals begin organising around a simple idea: clothing shouldn't go to waste when neighbours need it.",
  },
  {
    date: "June 2025",
    title: "Community Donation Network Launches",
    description:
      "Schools and local organisations begin collecting clean, wearable clothing in the weeks leading up to the first public event.",
  },
  {
    date: "August 2025",
    title: "First Public Swap & Giveaway",
    description:
      "Swap'n'Serve holds its inaugural clothing swap and giveaway in Limerick. Families and individuals attend freely—no questions asked.",
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
      "Fundraising and planning underway for the next chapter, with bigger events and broader community engagement on the horizon.",
  },
];

const TimelineSection = () => {
  return (
    <section id="timeline" className="py-20 md:py-28 bg-card">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Our Journey
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From a conversation to a movement—here's how Swap'n'Serve has grown.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-px" />

          {events.map((event, i) => (
            <motion.div
              key={event.date}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex items-start mb-12 last:mb-0 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Dot */}
              <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-card -translate-x-1/2 mt-1.5 z-10" />

              {/* Content */}
              <div
                className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${
                  i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8 md:text-left md:ml-auto"
                }`}
              >
                <span className="inline-block text-xs font-semibold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full mb-2">
                  {event.date}
                </span>
                <h3 className="text-lg font-display font-bold text-foreground mb-1">{event.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
