import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, Users, Shirt, Megaphone, Truck } from "lucide-react";

const roles = [
  {
    icon: Shirt,
    title: "Sorting Volunteer",
    time: "2 to 4 hours per event",
    description: "Help sort and organise donated clothing before swap events.",
    requirements: "No experience needed. Just bring energy!",
  },
  {
    icon: Users,
    title: "Event Day Helper",
    time: "4 to 6 hours per event",
    description: "Welcome attendees, manage displays, and keep things running smoothly on the day.",
    requirements: "Friendly attitude. Must be 16+ or accompanied by an adult.",
  },
  {
    icon: Megaphone,
    title: "Outreach & Social Media",
    time: "2 to 3 hours/week (flexible)",
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
    <section id="volunteer" className="py-20 md:py-28 bg-primary relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-10 left-0 w-72 h-72 bg-white/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-[80px]" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full bg-white/15 text-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4">
            Join the Team
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Volunteer With Us
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Every pair of hands makes a difference. Find a role that fits your time and skills.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {roles.map((role, i) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group rounded-3xl border border-white/15 bg-white/10 backdrop-blur-sm p-6 cursor-default transition-shadow hover:shadow-lg hover:shadow-white/5"
            >
              <motion.div
                whileHover={{ rotate: [0, -6, 6, 0] }}
                transition={{ duration: 0.4 }}
                className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors"
              >
                <role.icon size={24} className="text-white" />
              </motion.div>
              <h3 className="text-lg font-display font-bold text-white mb-1">{role.title}</h3>
              <div className="flex items-center gap-1.5 text-xs text-white/60 mb-3">
                <Clock size={12} />
                {role.time}
              </div>
              <p className="text-sm text-white/75 mb-3">{role.description}</p>
              <p className="text-xs text-white/50 italic">{role.requirements}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.a
            href="https://example.com/volunteer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full bg-secondary px-8 py-4 text-base font-bold text-secondary-foreground shadow-xl shadow-secondary/25 transition-shadow hover:shadow-2xl hover:shadow-secondary/40"
          >
            Sign Up to Volunteer
          </motion.a>
          <p className="text-sm text-white/50 mt-3">
            Takes 2 minutes. No experience needed.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default VolunteerRoles;
