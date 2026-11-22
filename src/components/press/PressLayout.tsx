import type { ReactNode } from "react";
import { Mail } from "lucide-react";
import PressNav from "./PressNav";
import { CONTACT } from "@/content";

const PressLayout = ({ children }: { children: ReactNode }) => (
  <div className="press-room min-h-screen bg-background font-body text-foreground">
    <PressNav />
    <main>{children}</main>
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-4 py-10 sm:px-6 md:flex-row md:items-center">
        <div>
          <p className="font-press-serif text-xl font-semibold">Writing about Swap 'N' Serve?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {CONTACT.name}, {CONTACT.role}. {CONTACT.note}
          </p>
        </div>
        <a
          href={`mailto:${CONTACT.email}`}
          className="no-print inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Mail className="h-4 w-4" aria-hidden /> {CONTACT.email}
        </a>
      </div>
    </footer>
  </div>
);

export default PressLayout;
