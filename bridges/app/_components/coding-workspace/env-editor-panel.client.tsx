"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type EnvEntry = { key: string; value: string; isNew: boolean };

type Props = { onClose: () => void };

const WEAK_SECRET_MAX_LEN = 10;

const EDITABLE_KEYS: string[] = [
  "AUTH_SECRET",
  "OPENROUTER_API_KEY",
  "NEXT_PUBLIC_APP_TITLE",
  "NEXT_PUBLIC_APP_DESCRIPTION",
  "NEXT_PUBLIC_LANG",
  "NEXT_PUBLIC_DEFAULT_THEME",
];

const THEME_OPTIONS = ["light", "dark", "system"];

function isEditable(key: string) {
  return EDITABLE_KEYS.includes(key);
}

function isSecret(key: string) {
  return key === "AUTH_SECRET" || key.includes("TOKEN") || key.includes("KEY") || key.includes("SECRET");
}

export function EnvEditorPanel({ onClose }: Props) {
  const [entries, setEntries]   = useState<EnvEntry[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/config/env")
      .then((r) => r.json())
      .then((data) => {
        const vars = (data.vars ?? {}) as Record<string, string>;
        setEntries(Object.entries(vars).map(([key, value]) => ({ key, value, isNew: false })));
      })
      .catch(() => setError("Failed to load environment variables."))
      .finally(() => setLoading(false));
  }, []);

  function updateValue(key: string, val: string) {
    setEntries((prev) => prev.map((e) => e.key === key ? { ...e, value: val } : e));
    setSaved(false);
  }

  function updateNewEntry(idx: number, field: "key" | "value", val: string) {
    setEntries((prev) => prev.map((e, i) => i === idx ? { ...e, [field]: val } : e));
    setSaved(false);
  }

  function addEntry() {
    setEntries((prev) => [...prev, { key: "", value: "", isNew: true }]);
    setSaved(false);
  }

  function removeNewEntry(idx: number) {
    setEntries((prev) => prev.filter((_, i) => i !== idx));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const vars: Record<string, string> = {};
    for (const { key, value } of entries) {
      if (key.trim()) vars[key.trim()] = value;
    }
    try {
      const res = await fetch("/api/config/env", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vars }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setSaved(true);
      setEntries((prev) => prev.map((e) => ({ ...e, isNew: false })));
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  }

  const authSecret = entries.find((e) => e.key === "AUTH_SECRET")?.value ?? "";
  const weakSecret = authSecret.length > 0 && authSecret.length < WEAK_SECRET_MAX_LEN;

  const existingEntries = entries.filter((e) => !e.isNew);
  const newEntries      = entries.filter((e) => e.isNew);

  return (
    <div style={{ position: "absolute", top: 52, left: 0, right: 0, bottom: 36, zIndex: 20 }}
      className="bg-background flex flex-col">

      <div className="flex items-center px-4 py-2.5 border-b border-border shrink-0">
        <span className="text-xs font-semibold text-foreground">Environment Variables</span>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-xs gap-2">
          <Loader2 size={13} className="animate-spin" />Loading…
        </div>
      ) : (
        <>
          {weakSecret && (
            <div className="mx-4 mt-3 flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2 text-[11px] text-destructive">
              <AlertTriangle size={12} className="shrink-0 mt-0.5" />
              <span><strong>AUTH_SECRET</strong> is too short (min {WEAK_SECRET_MAX_LEN} chars). Generate one at{" "}
                <a href="https://generate-secret.vercel.app/32" target="_blank" rel="noopener noreferrer" className="underline">generate-secret.vercel.app</a>.
              </span>
            </div>
          )}

          <div className="mx-4 mt-3 flex items-start gap-2 rounded-lg bg-muted border border-border px-3 py-2 text-[11px] text-muted-foreground">
            <AlertTriangle size={12} className="shrink-0 mt-0.5 text-orange-400" />
            <span>Changes take effect after a server restart. Changing <strong>AUTH_SECRET</strong> invalidates all sessions — users will need to log in again.</span>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-1">

            {existingEntries.map((entry) => {
              const editable = isEditable(entry.key);
              const isTheme  = entry.key === "NEXT_PUBLIC_DEFAULT_THEME";
              const secret   = isSecret(entry.key);
              const weak     = entry.key === "AUTH_SECRET" && weakSecret;

              return (
                <div key={entry.key} className="flex items-center gap-2">
                  <span className={`w-52 shrink-0 h-8 flex items-center px-2.5 text-[11px] font-mono rounded-lg border ${
                    editable ? "border-border text-foreground" : "border-transparent text-muted-foreground/40"
                  }`}>
                    {entry.key}
                  </span>

                  {isTheme ? (
                    <select
                      value={entry.value}
                      onChange={(e) => updateValue(entry.key, e.target.value)}
                      className="flex-1 h-8 rounded-lg border border-border bg-muted px-2.5 text-[11px] font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                    >
                      {THEME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  ) : (
                    <Input
                      type={secret ? "password" : "text"}
                      value={entry.value}
                      onChange={(e) => editable ? updateValue(entry.key, e.target.value) : undefined}
                      readOnly={!editable}
                      className={`flex-1 text-[11px] font-mono ${
                        !editable
                          ? "border-transparent bg-transparent text-muted-foreground/30 cursor-default select-none focus-visible:ring-0 focus-visible:border-transparent"
                          : weak
                          ? "border-destructive/50 bg-destructive/5 text-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                          : ""
                      }`}
                    />
                  )}

                  <span className="w-4 shrink-0" />
                </div>
              );
            })}

            {newEntries.length > 0 && (
              <div className="h-px bg-border my-2" />
            )}

            {newEntries.map((entry, relIdx) => {
              const absIdx = entries.indexOf(entry);
              return (
                <div key={absIdx} className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={entry.key}
                    onChange={(e) => updateNewEntry(absIdx, "key", e.target.value)}
                    placeholder="NEW_KEY"
                    className="w-52 shrink-0 text-[11px] font-mono"
                  />
                  <Input
                    type={isSecret(entry.key) ? "password" : "text"}
                    value={entry.value}
                    onChange={(e) => updateNewEntry(absIdx, "value", e.target.value)}
                    placeholder="value"
                    className="flex-1 text-[11px] font-mono"
                  />
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => removeNewEntry(absIdx)}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              );
            })}

            <Button
              variant="ghost"
              size="xs"
              onClick={addEntry}
              className="mt-2 justify-start text-muted-foreground"
            >
              <Plus size={12} />Add variable
            </Button>
          </div>

          <div className="px-4 py-2.5 border-t border-border flex items-center justify-between shrink-0">
            {error && <span className="text-[11px] text-destructive">{error}</span>}
            {saved && !error && <span className="text-[11px] text-green-500">Saved. Restart server to apply.</span>}
            {!error && !saved && <span />}
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? <><Loader2 size={11} className="animate-spin" />Saving…</> : "Save & apply"}
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close settings
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
