import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Send, Heart } from "lucide-react";
import { toast } from "sonner";

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
      {/* Decorative blobs */}
      <div className="absolute top-10 left-0 w-72 h-72 bg-white/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-[80px]" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block rounded-full bg-white/15 text-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4">
            Join the Team
          </span>
          <h2 className="text-3xl md:text-5xl font-section font-bold text-white mb-4">
            Want to Volunteer?
          </h2>
          <p className="text-white/75 text-lg max-w-xl mx-auto">
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
          className="max-w-xl mx-auto rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md p-6 md:p-8 shadow-xl shadow-black/10"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                placeholder="Jane Doe"
                className="w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-secondary/60 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                placeholder="you@example.com"
                className="w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-secondary/60 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">
                Tell us a bit about yourself
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                rows={4}
                placeholder="Availability, interests, anything you'd like us to know…"
                className="w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-secondary/60 focus:border-transparent transition resize-none"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3.5 text-base font-bold text-secondary-foreground shadow-xl shadow-secondary/25 transition-shadow hover:shadow-2xl hover:shadow-secondary/40"
          >
            <Send size={18} />
            Send Message
          </motion.button>

          <Link
            to="/cup"
            className="mt-4 group inline-flex w-full items-center justify-center gap-3 rounded-full border border-gold/30 bg-gold/10 px-6 py-3 text-sm font-semibold text-white hover:bg-gold/20 transition-colors"
          >
            <span className="text-white/70 group-hover:text-white transition-colors">
              Next up:
            </span>
            <span className="font-cup-display tracking-wide text-base text-white">
              Swap'n'Serve
            </span>
            <img
              src={cupSpraypaint}
              alt="Cup"
              className="h-5 -rotate-2 drop-shadow-[0_0_8px_rgba(243,198,78,0.5)] transition-transform group-hover:scale-110"
            />
            <span className="text-gold/80 group-hover:text-gold transition-colors">
              Registration open
            </span>
          </Link>

          <p className="mt-4 text-xs text-white/50 text-center flex items-center justify-center gap-1.5">
            <Heart size={12} /> We only use your details to reply about
            volunteering.
          </p>
        </motion.form>
      </div>
    </section>
  );
};

export default VolunteerRoles;
