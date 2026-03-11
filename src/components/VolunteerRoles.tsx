import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, Users, Shirt, Megaphone, Truck } from "lucide-react";

const roles = [
  {
    icon: Shirt,
    title: "Sorting Volunteer",
    time: "2–4 hours per event",
    description: "Help sort and organise donated clothing before swap events.",
    requirements: "No experience needed. Just bring energy!",
  },
  {
    icon: Users,
    title: "Event Day Helper",
    time: "4–6 hours per event",
    description: "Welcome attendees, manage displays, and keep things running smoothly on the day.",
    requirements: "Friendly attitude. Must be 16+ or accompanied by an adult.",
  },
  {
    icon: Megaphone,
    title: "Outreach & Social Media",
    time: "2–3 hours/week (flexible)",
    description: "Spread the word through social media, flyers, and community networks.",
    requirements: "Comfortable with social platforms. Creative flair a bonus.",
  },
  {
    icon: Truck,
    title: "Collection & Logistics",
    time: "Varies per event",
    description: "Help collect donations from drop-off points and transport them to event venues.",
    requirements: "Access to a vehicle is helpful but not essential.",
  },
];

const VolunteerRoles = () => {
  return (
    <section id="volunteer" className="py-20 md:py-28 bg-card">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Volunteer With Us
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Every pair of hands makes a difference. Find a role that fits your time and skills.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {roles.map((role, i) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-background rounded-xl border border-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <role.icon size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-display font-bold text-foreground mb-1">{role.title}</h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                <Clock size={12} />
                {role.time}
              </div>
              <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
              <p className="text-xs text-muted-foreground/80 italic">{role.requirements}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="hero" size="lg" asChild>
            <a href="https://example.com/volunteer">Sign Up to Volunteer</a>
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            Takes 2 minutes. No experience needed.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VolunteerRoles;
