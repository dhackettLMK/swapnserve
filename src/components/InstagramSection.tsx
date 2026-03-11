import { motion } from "framer-motion";
import { Instagram, ExternalLink } from "lucide-react";

const posts = [
  { id: "DMQVwn4tUHz", type: "reel", url: "https://www.instagram.com/reel/DMQVwn4tUHz/" },
  { id: "DL8O-OZtMnk", type: "p", url: "https://www.instagram.com/p/DL8O-OZtMnk/" },
  { id: "DNFmMOlNxWQ", type: "p", url: "https://www.instagram.com/p/DNFmMOlNxWQ/" },
  { id: "DNn26q1NHPK", type: "p", url: "https://www.instagram.com/p/DNn26q1NHPK/" },
  { id: "DOD9-AAjRfS", type: "p", url: "https://www.instagram.com/p/DOD9-AAjRfS/" },
  { id: "DVrUwdxjamw", type: "p", url: "https://www.instagram.com/p/DVrUwdxjamw/" },
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45, type: "spring", stiffness: 120 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="rounded-3xl overflow-hidden bg-card border border-border/50 shadow-sm hover:shadow-xl transition-shadow"
            >
              <div className="w-full aspect-square relative">
                <iframe
                  src={`https://www.instagram.com/${post.type}/${post.id}/embed/`}
                  className="absolute inset-0 w-full h-full border-0 rounded-3xl"
                  allowTransparency
                  scrolling="no"
                  loading="lazy"
                  title={`Instagram post ${post.id}`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-10"
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
