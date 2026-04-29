"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = { onClose?: () => void };

function LoginForm({ onClose }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) { setError("Invalid email or password"); return; }
    router.refresh();
    if (onClose) onClose();
    else router.push(callbackUrl);
  };

  return (
    <div data-ft-id="Tm3kRpL8wN2x" className="w-full max-w-sm flex flex-col gap-6 p-8 bg-background rounded-xl border shadow-sm relative">
      {onClose && (
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <X size={18} />
        </button>
      )}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="text-sm text-muted-foreground">Enter your credentials to continue</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" disabled={loading} autoFocus required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" disabled={loading} required className="pr-10" />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        {error && <p className="text-xs text-destructive bg-destructive/10 rounded px-2 py-1.5">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <><Loader2 className="size-4 animate-spin" /> Signing in…</> : "Sign in"}
        </Button>
      </form>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>
      <Button variant="outline" className="w-full" onClick={() => router.push("/register")}>Register</Button>
    </div>
  );
}

export function LoginPlaceholder({ onClose }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Suspense fallback={<div className="w-full max-w-sm p-8 rounded-xl border bg-background shadow-sm flex flex-col gap-4"><div className="h-5 w-1/3 rounded bg-muted animate-pulse" /><div className="h-10 rounded bg-muted animate-pulse" /><div className="h-10 rounded bg-muted animate-pulse" /></div>}>
        <LoginForm onClose={onClose} />
      </Suspense>
    </div>
  );
}
