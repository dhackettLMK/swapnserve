import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2, MessageCircleQuestion, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cupApi } from "@/lib/cupApi";

const SUGGESTIONS = [
  "How much do we still owe?",
  "Is my team registered yet?",
  "Can I pay for all my players myself?",
];

/**
 * Captain helper: answers registration and payment questions using this team's
 * real deposit, balance and status.
 */
export function CupAssistant({ manageToken }: { manageToken: string }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);

  const ask = useMutation({
    mutationFn: (q: string) => cupApi.ask({ manage_token: manageToken, question: q }),
    onSuccess: (res) => setAnswer(res.answer),
    onError: (e: Error) => toast.error(e.message),
  });

  const submit = (q: string) => {
    const trimmed = q.trim();
    if (trimmed.length < 3) return;
    setAnswer(null);
    ask.mutate(trimmed);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <MessageCircleQuestion size={16} className="text-primary" />
        <h2 className="font-section text-lg font-bold">Questions about your entry?</h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Ask anything about your €10 deposit, what's left to pay or whether your team is
        registered. Answers use your team's live figures.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(question);
        }}
        className="space-y-3"
      >
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="For example: how much is left before we're officially in?"
        />
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted"
              onClick={() => {
                setQuestion(s);
                submit(s);
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <Button type="submit" variant="cta" className="w-full" disabled={ask.isPending}>
          {ask.isPending ? <Loader2 className="animate-spin" /> : <Send size={15} />} Ask
        </Button>
      </form>

      {ask.isPending && (
        <p className="mt-4 text-sm text-muted-foreground">Checking your team's details...</p>
      )}

      {answer && !ask.isPending && (
        <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4 text-sm leading-relaxed whitespace-pre-wrap">
          {answer}
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Answers are generated automatically. For anything else, email swapnserve@gmail.com.
      </p>
    </div>
  );
}
