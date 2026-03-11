import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

const posts = [
  { id: "DMQVwn4tUHz", type: "reel" as const, url: "https://www.instagram.com/reel/DMQVwn4tUHz/" },
  { id: "DL8O-OZtMnk", type: "post" as const, url: "https://www.instagram.com/p/DL8O-OZtMnk/" },
  { id: "DNFmMOlNxWQ", type: "post" as const, url: "https://www.instagram.com/p/DNFmMOlNxWQ/" },
  { id: "DNn26q1NHPK", type: "post" as const, url: "https://www.instagram.com/p/DNn26q1NHPK/" },
  { id: "DOD9-AAjRfS", type: "post" as const, url: "https://www.instagram.com/p/DOD9-AAjRfS/" },
  { id: "DVrUwdxjamw", type: "post" as const, url: "https://www.instagram.com/p/DVrUwdxjamw/" },
];

const getEmbedUrl = (post: (typeof posts)[0]) => {
  if (post.type === "reel") {
    return `https://www.instagram.com/reel/${post.id}/embed/`;
  }
  return `https://www.instagram.com/p/${post.id}/embed/`;
};

const InstagramSection = () => {
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

        {/* Embedded Post Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, type: "spring", stiffness: 100, damping: 15 }}
              className="rounded-2xl overflow-hidden border border-border/40 shadow-sm bg-card"
            >
              <iframe
                src={getEmbedUrl(post)}
                className="w-full border-0"
                style={{ minHeight: 480 }}
                allowTransparency
                allow="encrypted-media"
                loading="lazy"
                title={`Instagram ${post.type} ${post.id}`}
              />
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
