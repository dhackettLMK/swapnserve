import { useState } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getStripe } from "@/lib/stripe";
import { cupApi } from "@/lib/cupApi";

const PRESETS = [5, 10, 20, 50];

interface DonateDialogProps {
  open: boolean;
  onClose: () => void;
  /** Where the donor clicked from, for the admin sign-up stats. */
  source: string;
}

/**
 * Direct card donation. The donor picks an amount, pays by card without
 * leaving the site, and the payment provider emails the receipt.
 */
export function DonateDialog({ open, onClose, source }: DonateDialogProps) {
  const [amount, setAmount] = useState<number>(10);
  const [custom, setCustom] = useState<string>("");
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const customValue = Number(custom);
  const effectiveAmount = custom.trim() !== "" && Number.isFinite(customValue) ? customValue : amount;
  const amountCents = Math.round(effectiveAmount * 100);
  const valid = amountCents >= 100 && amountCents <= 50000;

  const reset = () => {
    setCheckingOut(false);
    setError(null);
    setCustom("");
    setAmount(10);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          onClose();
          reset();
        }
      }}
    >
      <DialogContent
        className="max-w-lg max-h-[90dvh] overflow-y-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart size={18} className="text-primary" />
            Make a Donation
          </DialogTitle>
          <DialogDescription>
            Every euro funds storage, event logistics and the next chapter of
            Swap'n'Serve in Limerick. Secure card payment, receipt by email.
          </DialogDescription>
        </DialogHeader>

        {!checkingOut ? (
          <div className="space-y-5 pt-2">
            <div className="grid grid-cols-4 gap-2">
              {PRESETS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setAmount(value);
                    setCustom("");
                  }}
                  className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-all ${
                    custom.trim() === "" && amount === value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/50"
                  }`}
                >
                  €{value}
                </button>
              ))}
            </div>

            <div>
              <label htmlFor="donate-custom" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Or choose your own amount
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">€</span>
                <input
                  id="donate-custom"
                  type="number"
                  min={1}
                  max={500}
                  step="1"
                  inputMode="numeric"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  placeholder="Any amount from €1 to €500"
                  className="w-full rounded-xl border border-border bg-card py-3 pl-8 pr-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
                />
              </div>
            </div>

            {error && <p className="text-sm font-medium text-destructive">{error}</p>}

            <Button
              variant="cta"
              size="lg"
              className="w-full rounded-xl"
              disabled={!valid}
              onClick={() => {
                if (!valid) {
                  setError("Donations must be between €1 and €500.");
                  return;
                }
                setError(null);
                setCheckingOut(true);
              }}
            >
              Donate €{valid ? effectiveAmount.toFixed(2).replace(/\.00$/, "") : "—"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Card payment only. We never see or store your card details.
            </p>
          </div>
        ) : (
          <EmbeddedCheckoutProvider
            stripe={getStripe()}
            options={{
              fetchClientSecret: async () => {
                try {
                  const res = await cupApi.donate({
                    amount_cents: amountCents,
                    signup_source: source,
                    returnUrl: `${window.location.origin}/?donated=1`,
                  });
                  return res.clientSecret;
                } catch (err) {
                  setCheckingOut(false);
                  setError(err instanceof Error ? err.message : "Could not start the payment. Please try again.");
                  throw err;
                }
              },
            }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default DonateDialog;
