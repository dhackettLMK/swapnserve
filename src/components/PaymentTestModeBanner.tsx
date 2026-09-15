const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;

/**
 * Test-mode notice for the built-in payments integration. Renders nothing once
 * the live connection is active; a red notice if this build has no connection
 * at all (published before go-live finished).
 */
export function PaymentTestModeBanner() {
  if (!clientToken) {
    return (
      <div className="w-full border-b border-destructive/30 bg-destructive/10 px-4 py-2 text-center text-sm text-destructive">
        Card payments are not switched on yet. Please check back shortly.
      </div>
    );
  }
  if (clientToken.startsWith("pk_test_")) {
    return (
      <div className="w-full border-b border-accent/30 bg-accent/10 px-4 py-2 text-center text-sm text-accent-foreground">
        Payments are in test mode. No real money moves.
      </div>
    );
  }
  return null;
}
