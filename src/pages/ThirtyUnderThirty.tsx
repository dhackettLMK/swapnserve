import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ImagePlus, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import wordmark from "@/assets/swapnserve-wordmark-cup.png";
import {
  DEFAULT_THIRTY,
  thirtyApi,
  type Honouree,
  type ThirtyContent,
} from "@/lib/thirtyApi";

const PASS_KEY = "sns-editor-pass";

/** Text that turns into an input box in edit mode. */
function Editable({
  value,
  onChange,
  editing,
  multiline,
  className,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  editing: boolean;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
}) {
  if (!editing) {
    return multiline ? (
      <div className={className}>
        {value.split(/\n{2,}/).map((para, i) => (
          <p key={i} className={i ? "mt-4" : ""}>{para}</p>
        ))}
      </div>
    ) : (
      <span className={className}>{value}</span>
    );
  }
  const shared =
    "w-full rounded-xl border-2 border-dashed border-secondary/70 bg-background/80 px-3 py-2 text-foreground outline-none focus:border-secondary";
  return multiline ? (
    <textarea
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      rows={Math.max(3, value.split("\n").length + 1)}
      className={`${shared} font-body text-base leading-relaxed`}
    />
  ) : (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${shared} ${className ?? ""}`}
    />
  );
}

function PhotoSlot({
  photo,
  name,
  editing,
  onUpload,
  onRemove,
  className,
}: {
  photo: string;
  name: string;
  editing: boolean;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-muted ${className ?? ""}`}>
      {photo ? (
        <img src={photo} alt={name} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-secondary/20">
          <span className="font-display text-4xl text-primary/40">
            {name.trim() ? name.trim()[0] : "?"}
          </span>
        </div>
      )}
      {editing && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-foreground/40">
          <input
            ref={ref}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              setBusy(true);
              try {
                await onUpload(file);
              } finally {
                setBusy(false);
              }
            }}
          />
          <Button type="button" size="sm" variant="secondary" className="rounded-full" onClick={() => ref.current?.click()} disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : <ImagePlus />} {photo ? "Change" : "Add photo"}
          </Button>
          {photo && (
            <Button type="button" size="icon" variant="secondary" className="rounded-full" onClick={onRemove} aria-label="Remove photo">
              <X />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ThirtyUnderThirty() {
  const [content, setContent] = useState<ThirtyContent>(DEFAULT_THIRTY);
  const [loading, setLoading] = useState(true);
  const [pass, setPass] = useState<string | null>(() => sessionStorage.getItem(PASS_KEY));
  const [editing, setEditing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [askPass, setAskPass] = useState(false);
  const [passInput, setPassInput] = useState("");

  useEffect(() => {
    document.title = "Talented Thirty Under Thirty | Swap'N'Serve";
    thirtyApi
      .get()
      .then((c) => c && setContent({ ...DEFAULT_THIRTY, ...c }))
      .catch(() => toast.error("Couldn't load the page. Showing the default text."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = <K extends keyof ThirtyContent>(key: K, v: ThirtyContent[K]) => {
    setContent((c) => ({ ...c, [key]: v }));
    setDirty(true);
  };
  const setHonouree = (id: string, patch: Partial<Honouree>) =>
    set("honourees", content.honourees.map((h) => (h.id === id ? { ...h, ...patch } : h)));

  const upload = async (file: File) => {
    if (!pass) return "";
    if (file.size > 10 * 1024 * 1024) {
      toast.error("That photo is over 10MB. Please use a smaller one.");
      return "";
    }
    try {
      return await thirtyApi.uploadImage(pass, file);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed.");
      return "";
    }
  };

  const save = async () => {
    if (!pass) return;
    setSaving(true);
    try {
      await thirtyApi.save(pass, content);
      setDirty(false);
      toast.success("Saved. The page is live.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't save.");
    } finally {
      setSaving(false);
    }
  };

  const startEditing = async () => {
    if (pass) return setEditing(true);
    setAskPass(true);
  };

  const submitPass = async () => {
    try {
      await thirtyApi.check(passInput);
      sessionStorage.setItem(PASS_KEY, passInput);
      setPass(passInput);
      setAskPass(false);
      setEditing(true);
    } catch {
      toast.error("Wrong passcode.");
    }
  };

  const e = editing;

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <header className="sticky top-0 z-40 bg-primary/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground">
            <ArrowLeft size={16} /> Home
          </Link>
          <Link to="/"><img src={wordmark} alt="Swap'N'Serve" className="h-8 w-auto" /></Link>
          <span className="w-16" />
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary pb-20 pt-16 text-primary-foreground md:pb-28 md:pt-24">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="container relative max-w-4xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            <Editable editing={e} value={content.eyebrow} onChange={(v) => set("eyebrow", v)} className="text-center" />
          </p>
          <h1 className="font-display text-5xl leading-[0.95] md:text-7xl">
            <Editable editing={e} value={content.title} onChange={(v) => set("title", v)} className="text-center font-display" />
          </h1>
          <div className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/80">
            <Editable editing={e} multiline value={content.intro} onChange={(v) => set("intro", v)} />
          </div>
        </div>
      </section>

      {/* Cover image + about */}
      <section className="py-16 md:py-24">
        <div className="container grid items-center gap-10 lg:grid-cols-2">
          <PhotoSlot
            photo={content.coverImage}
            name={content.title}
            editing={e}
            className="aspect-[4/3] rounded-[2rem] shadow-xl"
            onUpload={async (f) => { const url = await upload(f); if (url) set("coverImage", url); }}
            onRemove={() => set("coverImage", "")}
          />
          <div>
            <h2 className="font-display text-4xl leading-tight md:text-5xl">
              <Editable editing={e} value={content.aboutTitle} onChange={(v) => set("aboutTitle", v)} className="font-display" />
            </h2>
            <div className="mt-5 text-base leading-relaxed text-muted-foreground">
              <Editable editing={e} multiline value={content.aboutBody} onChange={(v) => set("aboutBody", v)} />
            </div>
          </div>
        </div>
      </section>

      {/* Honourees */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-4xl md:text-5xl">
              <Editable editing={e} value={content.honoureesTitle} onChange={(v) => set("honoureesTitle", v)} className="text-center font-display" />
            </h2>
            <div className="mt-4 text-muted-foreground">
              <Editable editing={e} multiline value={content.honoureesIntro} onChange={(v) => set("honoureesIntro", v)} />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {content.honourees.map((h, i) => (
              <article key={h.id} className="group overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm transition-shadow hover:shadow-xl">
                <PhotoSlot
                  photo={h.photo}
                  name={h.name}
                  editing={e}
                  className="aspect-square"
                  onUpload={async (f) => { const url = await upload(f); if (url) setHonouree(h.id, { photo: url }); }}
                  onRemove={() => setHonouree(h.id, { photo: "" })}
                />
                <div className="space-y-2 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
                    No. {String(i + 1).padStart(2, "0")}
                    {(h.age || e) && " · Age "}
                    <Editable editing={e} value={h.age} onChange={(v) => setHonouree(h.id, { age: v })} placeholder="Age" className="inline w-20" />
                  </p>
                  <h3 className="font-display text-2xl leading-tight">
                    <Editable editing={e} value={h.name} onChange={(v) => setHonouree(h.id, { name: v })} placeholder="Name" className="font-display" />
                  </h3>
                  <p className="text-sm font-medium text-primary">
                    <Editable editing={e} value={h.role} onChange={(v) => setHonouree(h.id, { role: v })} placeholder="What they do" />
                  </p>
                  <div className="text-sm leading-relaxed text-muted-foreground">
                    <Editable editing={e} multiline value={h.bio} onChange={(v) => setHonouree(h.id, { bio: v })} placeholder="Their story" />
                  </div>
                  {e && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-destructive"
                      onClick={() => {
                        if (confirm(`Remove ${h.name || "this person"}?`)) set("honourees", content.honourees.filter((x) => x.id !== h.id));
                      }}
                    >
                      <Trash2 /> Remove
                    </Button>
                  )}
                </div>
              </article>
            ))}
            {e && (
              <button
                type="button"
                onClick={() =>
                  set("honourees", [
                    ...content.honourees,
                    { id: crypto.randomUUID(), name: "New honouree", age: "", role: "", bio: "", photo: "" },
                  ])
                }
                className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-[1.75rem] border-2 border-dashed border-secondary/60 text-secondary hover:bg-secondary/5"
              >
                <Plus /> Add a person
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-16 md:py-24">
        <div className="container max-w-3xl rounded-[2.5rem] bg-primary px-6 py-14 text-center text-primary-foreground md:px-14">
          <h2 className="font-display text-4xl md:text-5xl">
            <Editable editing={e} value={content.closingTitle} onChange={(v) => set("closingTitle", v)} className="text-center font-display" />
          </h2>
          <div className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            <Editable editing={e} multiline value={content.closingBody} onChange={(v) => set("closingBody", v)} />
          </div>
          {e ? (
            <div className="mx-auto mt-6 grid max-w-md gap-2 text-left">
              <label className="text-xs text-primary-foreground/70">Button text</label>
              <Editable editing value={content.ctaLabel} onChange={(v) => set("ctaLabel", v)} />
              <label className="text-xs text-primary-foreground/70">Button link (website or mailto:email)</label>
              <Editable editing value={content.ctaLink} onChange={(v) => set("ctaLink", v)} />
            </div>
          ) : (
            content.ctaLabel && (
              <a href={content.ctaLink} className="mt-8 inline-flex rounded-full bg-secondary px-7 py-3 font-semibold text-secondary-foreground transition-transform hover:scale-[1.03]">
                {content.ctaLabel}
              </a>
            )
          )}
        </div>
      </section>

      <footer className="pb-28 text-center text-xs text-muted-foreground">
        <p>Swap'N'Serve, Limerick</p>
        {!editing && (
          <button type="button" onClick={startEditing} className="mt-3 inline-flex items-center gap-1 opacity-50 hover:opacity-100">
            <Pencil size={12} /> Edit page
          </button>
        )}
      </footer>

      {/* Editor toolbar */}
      {editing && (
        <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card/95 p-2 shadow-2xl backdrop-blur">
            <span className="hidden px-3 text-sm text-muted-foreground sm:inline">
              {dirty ? "Unsaved changes" : "Editing"}
            </span>
            <Button variant="ghost" className="rounded-full" onClick={() => setEditing(false)}>
              Preview
            </Button>
            <Button className="rounded-full" onClick={save} disabled={saving || !dirty}>
              {saving ? <Loader2 className="animate-spin" /> : <Save />} Save
            </Button>
          </div>
        </div>
      )}
      {!editing && dirty && (
        <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center">
          <Button className="rounded-full shadow-2xl" onClick={() => setEditing(true)}>
            <Pencil /> Back to editing (not saved yet)
          </Button>
        </div>
      )}

      {askPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4" onClick={() => setAskPass(false)}>
          <form
            onClick={(ev) => ev.stopPropagation()}
            onSubmit={(ev) => { ev.preventDefault(); submitPass(); }}
            className="w-full max-w-sm space-y-4 rounded-[1.75rem] bg-card p-6 shadow-2xl"
          >
            <h2 className="font-display text-2xl">Edit this page</h2>
            <Input type="password" inputMode="numeric" autoFocus placeholder="Passcode" value={passInput} onChange={(ev) => setPassInput(ev.target.value)} />
            <Button type="submit" className="w-full rounded-full">Start editing</Button>
          </form>
        </div>
      )}

      {loading && (
        <div className="fixed right-4 top-20 z-50 rounded-full bg-card p-2 shadow"><Loader2 className="animate-spin" size={16} /></div>
      )}
    </div>
  );
}
