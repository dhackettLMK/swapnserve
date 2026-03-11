import { motion } from "framer-motion";
import { Instagram, ExternalLink } from "lucide-react";

const posts = [
  { id: 1, href: "#", color: "from-primary/30 to-accent/20" },
  { id: 2, href: "#", color: "from-secondary/30 to-primary/20" },
  { id: 3, href: "#", color: "from-accent/20 to-secondary/30" },
  { id: 4, href: "#", color: "from-primary/20 to-secondary/20" },
  { id: 5, href: "#", color: "from-secondary/20 to-accent/30" },
  { id: 6, href: "#", color: "from-accent/30 to-primary/20" },
];

const InstagramSection = () => {
  return (
    <section id="instagram" className="py-20 md:py-28 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.a
            href="https://www.instagram.com/swapandserve/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-400/10 px-5 py-2 text-sm font-semibold text-foreground mb-5"
          >
            <Instagram size={18} className="text-pink-500" />
            @SwapNServe
            <ExternalLink size={14} className="text-muted-foreground" />
          </motion.a>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Follow Us on Instagram
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Stay up to date with our latest swaps, volunteer days, and community moments.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">
          {posts.map((post, i) => (
            <motion.a
              key={post.id}
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br border border-border/50 shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* Gradient placeholder — replace with real images later */}
              <div className={`absolute inset-0 bg-gradient-to-br ${post.color}`} />
              <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-70 transition-opacity">
                <Instagram size={32} className="text-foreground" />
              </div>
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors rounded-2xl" />
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <motion.a
            href="https://www.instagram.com/swapandserve/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-semibold shadow-md hover:shadow-lg transition-all"
          >
            See more on Instagram
            <ExternalLink size={16} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramSection;
