import { motion } from "framer-motion";
import { Instagram, ExternalLink, Play, Heart, Image } from "lucide-react";

const posts = [
  {
    id: "DMQVwn4tUHz",
    type: "reel" as const,
    url: "https://www.instagram.com/reel/DMQVwn4tUHz/",
    caption: "Community in action 🎬",
  },
  {
    id: "DL8O-OZtMnk",
    type: "post" as const,
    url: "https://www.instagram.com/p/DL8O-OZtMnk/",
    caption: "Swap day highlights ✨",
  },
  {
    id: "DNFmMOlNxWQ",
    type: "post" as const,
    url: "https://www.instagram.com/p/DNFmMOlNxWQ/",
    caption: "Making a difference together 💚",
  },
  {
    id: "DNn26q1NHPK",
    type: "post" as const,
    url: "https://www.instagram.com/p/DNn26q1NHPK/",
    caption: "Volunteers at work 🙌",
  },
  {
    id: "DOD9-AAjRfS",
    type: "post" as const,
    url: "https://www.instagram.com/p/DOD9-AAjRfS/",
    caption: "Building community 🤝",
  },
  {
    id: "DVrUwdxjamw",
    type: "post" as const,
    url: "https://www.instagram.com/p/DVrUwdxjamw/",
    caption: "Swap'n'Serve moments 🌿",
  },
];

const InstagramCard = ({ post, index }: { post: (typeof posts)[0]; index: number }) => (
  <motion.a
    href={post.url}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{
      delay: index * 0.08,
      duration: 0.5,
      type: "spring",
      stiffness: 100,
      damping: 15,
    }}
    whileHover={{ y: -8, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="group relative block rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 via-card to-secondary/10 border border-border/40 shadow-sm hover:shadow-2xl transition-all duration-300 aspect-square"
  >
    {/* Background pattern */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-20 h-20 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500 flex items-center justify-center">
        {post.type === "reel" ? (
          <Play size={32} className="text-primary/40 group-hover:text-primary/70 transition-colors ml-1" />
        ) : (
          <Image size={32} className="text-primary/40 group-hover:text-primary/70 transition-colors" />
        )}
      </div>
    </div>

    {/* Bottom info bar */}
    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background/90 via-background/50 to-transparent">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[hsl(330,80%,60%)] via-[hsl(270,60%,55%)] to-[hsl(30,90%,55%)] flex items-center justify-center">
          <Instagram size={12} className="text-white" />
        </div>
        <span className="text-xs font-semibold text-foreground">@swapandserve</span>
      </div>
      <p className="text-xs text-muted-foreground">{post.caption}</p>
    </div>

    {/* Hover overlay */}
    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
      <span className="inline-flex items-center gap-2 rounded-full bg-background/90 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-foreground shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        {post.type === "reel" ? <Play size={16} /> : <Heart size={16} />}
        View on Instagram
        <ExternalLink size={14} className="text-muted-foreground" />
      </span>
    </div>
  </motion.a>
);

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

        {/* Post Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-4xl mx-auto">
          {posts.map((post, i) => (
            <InstagramCard key={post.id} post={post} index={i} />
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
