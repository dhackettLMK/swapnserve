import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
        <Link to="/cup" aria-label="Sign Up to the Swap'n'Serve Cup" className="inline-flex items-center justify-center gap-2">
          <CupButtonBrand wordmarkClass="h-3.5" cupClass="h-4.5" />
          <ArrowRight size={16} />
        </Link>
      </Button>
    </div>
  );
};

export default MobileCta;
