import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Send, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import cupSpraypaint from "@/assets/cup-spraypaint.png";
import wordmark from "@/assets/swapnserve-wordmark-cup.png";

const VolunteerRoles = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    const subject = encodeURIComponent(`Volunteer enquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:swapnserve@gmail.com?subject=${subject}&body=${body}`;
    toast.success("Opening your email app. Thank you!");
  };

  return (
    <section
      id="volunteer"
      className="py-20 md:py-28 bg-primary relative overflow-hidden"
    >

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block rounded-full bg-primary-foreground/15 text-primary-foreground px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4">
            Join the Team
          </span>
          <h2 className="text-3xl md:text-5xl font-section font-bold text-primary-foreground mb-4">
            Want to Volunteer?
          </h2>
          <p className="text-primary-foreground/75 text-lg max-w-xl mx-auto">
            Every pair of hands makes a difference. Drop us a quick note and
            we'll be in touch.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-xl mx-auto rounded-xl border border-primary-foreground/15 bg-primary-foreground/10 backdrop-blur-md p-6 md:p-8 shadow-sm shadow-refined"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-foreground/80 mb-1.5">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                placeholder="Jane Doe"
                className="w-full rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 px-4 py-3 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-secondary/60 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-foreground/80 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                placeholder="you@example.com"
                className="w-full rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 px-4 py-3 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-secondary/60 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-foreground/80 mb-1.5">
                Tell us a bit about yourself
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                rows={4}
                placeholder="Availability, interests, anything you'd like us to know…"
                className="w-full rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 px-4 py-3 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-secondary/60 focus:border-transparent transition resize-none"
              />
            </div>
          </div>

          <Button size="lg" variant="secondary"
            type="submit"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3.5 text-base font-bold text-secondary-foreground shadow-sm shadow-secondary/25 transition-shadow hover:shadow-sm hover:shadow-secondary/40"
          >
            <Send size={18} />
            Send Message
          </Button>

          <Link
            to="/cup?src=volunteer-teaser"
            className="group mt-4 flex flex-wrap w-full items-center justify-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-6 py-3 font-cup-body text-sm font-semibold text-accent transition-all hover:bg-accent/15"
          >
            Next up:
            <img
              src={wordmark}
              alt="Swap'n'Serve"
              className="h-5 w-auto transition-transform group-hover:scale-105"
            />
            <img
              src={cupSpraypaint}
              alt="Cup"
              className="h-5 -rotate-2 transition-transform group-hover:scale-110"
            />
            registration open
          </Link>

          <p className="mt-4 text-xs text-primary-foreground/50 text-center flex items-center justify-center gap-1.5">
            <Heart size={12} /> We only use your details to reply about
            volunteering.
          </p>
        </motion.form>
      </div>
    </section>
  );
};

export default VolunteerRoles;
