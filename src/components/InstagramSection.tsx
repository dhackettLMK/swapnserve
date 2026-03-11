import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, ExternalLink, Play, Heart, MessageCircle } from "lucide-react";

const posts = [
  {
    id: "DMQVwn4tUHz",
    type: "reel",
    url: "https://www.instagram.com/reel/DMQVwn4tUHz/",
    embedUrl: "https://www.instagram.com/reel/DMQVwn4tUHz/embed/captioned/",
  },
  {
    id: "DL8O-OZtMnk",
    type: "p",
    url: "https://www.instagram.com/p/DL8O-OZtMnk/",
    embedUrl: "https://www.instagram.com/p/DL8O-OZtMnk/embed/captioned/",
  },
  {
    id: "DNFmMOlNxWQ",
    type: "p",
    url: "https://www.instagram.com/p/DNFmMOlNxWQ/",
    embedUrl: "https://www.instagram.com/p/DNFmMOlNxWQ/embed/captioned/",
  },
  {
    id: "DNn26q1NHPK",
    type: "p",
    url: "https://www.instagram.com/p/DNn26q1NHPK/",
    embedUrl: "https://www.instagram.com/p/DNn26q1NHPK/embed/captioned/",
  },
  {
    id: "DOD9-AAjRfS",
    type: "p",
    url: "https://www.instagram.com/p/DOD9-AAjRfS/",
    embedUrl: "https://www.instagram.com/p/DOD9-AAjRfS/embed/captioned/",
  },
  {
    id: "DVrUwdxjamw",
    type: "p",
    url: "https://www.instagram.com/p/DVrUwdxjamw/",
    embedUrl: "https://www.instagram.com/p/DVrUwdxjamw/embed/captioned/",
  },
];

const InstagramSection = () => {
  const [activePost, setActivePost] = useState<string | null>(null);

  return (
    <section id="instagram" className="py-20 md:py-28 overflow-hidden">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <motion.div
            whileHover={{ scale: 1.06 }}
            className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[hsl(330,80%,60%)]/10 via-[hsl(270,60%,55%)]/10 to-[hsl(30,90%,55%)]/10 border border-[hsl(330,80%,60%)]/15 px-5 py-2 text-sm font-semibold text-foreground mb-5 cursor-default"
          >
            <Instagram size={18} className="text-[hsl(330,80%,60%)]" />
            @SwapNServe
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Latest from Our Feed
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Community moments, swap days, and the people making it all happen.
          </p>
        </motion.div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.08,
                duration: 0.5,
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              whileHover={{ y: -8 }}
              className="group relative rounded-3xl overflow-hidden bg-card border border-border/40 shadow-sm hover:shadow-2xl transition-all duration-300"
            >
              {/* Embed Container */}
              <div className="relative w-full" style={{ paddingBottom: post.type === "reel" ? "125%" : "120%" }}>
                <iframe
                  src={post.embedUrl}
                  className="absolute inset-0 w-full h-full border-0"
                  allowTransparency
                  scrolling="no"
                  loading="lazy"
                  title={`SwapNServe Instagram post`}
                  style={{
                    borderRadius: "1.5rem",
                    overflow: "hidden",
                  }}
                />

                {/* Hover overlay with link */}
                <motion.a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 z-10 flex items-end justify-center pb-6 bg-gradient-to-t from-foreground/60 via-transparent to-transparent rounded-3xl"
                >
                  <span className="inline-flex items-center gap-2 rounded-full bg-background/90 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-foreground shadow-lg">
                    {post.type === "reel" ? <Play size={16} /> : <Heart size={16} />}
                    View on Instagram
                    <ExternalLink size={14} className="text-muted-foreground" />
                  </span>
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Follow CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-center mt-12"
        >
          <motion.a
            href="https://www.instagram.com/swapandserve/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[hsl(330,80%,60%)] via-[hsl(270,60%,55%)] to-[hsl(30,90%,55%)] text-white px-7 py-3.5 text-sm font-bold shadow-lg hover:shadow-xl transition-shadow"
          >
            <Instagram size={18} />
            Follow @SwapNServe
          </motion.a>
          <p className="text-xs text-muted-foreground mt-3">
            Join our growing community on Instagram
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramSection;
