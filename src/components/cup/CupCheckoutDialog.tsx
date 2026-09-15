import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getStripe } from "@/lib/stripe";
import { cupApi, type CheckoutInput } from "@/lib/cupApi";

interface CupCheckoutDialogProps {
  /** When set, the payment form opens for this checkout. */
  checkout: CheckoutInput | null;
  onClose: () => void;
}

/**
 * Embedded card payment for Cup entries. The player never leaves the site.
 * Stripe redirects to the return URL on completion.
 */
export function CupCheckoutDialog({ checkout, onClose }: CupCheckoutDialogProps) {
  return (
    <Dialog open={checkout !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Pay entry fee</DialogTitle>
          <DialogDescription>
            Secure card payment. You'll be brought back here when it's done.
          </DialogDescription>
        </DialogHeader>
        {checkout && (
          <EmbeddedCheckoutProvider
            stripe={getStripe()}
            options={{
              fetchClientSecret: async () => {
                const res = await cupApi.checkout(checkout);
                return res.clientSecret;
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
