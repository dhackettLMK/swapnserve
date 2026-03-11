import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const MobileCta = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/95 backdrop-blur-md border-t border-border p-3 safe-area-pb">
      <Button variant="hero" className="w-full" asChild>
        <a href="https://example.com/volunteer" className="inline-flex items-center gap-2">
          Sign Up to Volunteer
          <ArrowRight size={16} />
        </a>
      </Button>
    </div>
  );
};

export default MobileCta;
