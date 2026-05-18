"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Script from "next/script";

interface CaptchaWindow {
  onVendorCaptchaSuccess?: (token: string) => void;
  onVendorCaptchaExpired?: () => void;
  onVendorCaptchaError?: () => void;
  hcaptcha?: {
    reset: () => void;
  };
}

export default function VendorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const w = window as unknown as CaptchaWindow;
    w.onVendorCaptchaSuccess = (token: string) => {
      setCaptchaToken(token);
    };
    w.onVendorCaptchaExpired = () => {
      setCaptchaToken("");
    };
    w.onVendorCaptchaError = () => {
      setCaptchaToken("");
    };

    return () => {
      delete w.onVendorCaptchaSuccess;
      delete w.onVendorCaptchaExpired;
      delete w.onVendorCaptchaError;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!captchaToken) {
      setError("Please complete the captcha challenge.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password, options: { captchaToken } });

    // Reset captcha
    const w = window as unknown as CaptchaWindow;
    if (w.hcaptcha) {
      w.hcaptcha.reset();
    }
    setCaptchaToken("");

    if (authError) {
      setError("Wrong email or password");
      setLoading(false);
      return;
    }

    // Check if user exists in vendors table
    const { data: vendor } = await supabase
      .from("vendors")
      .select("id, status")
      .eq("email", email)
      .single();

    if (!vendor) {
      await supabase.auth.signOut();
      setError("Not authorised as a vendor");
      setLoading(false);
      return;
    }

    if (vendor.status === "suspended") {
      await supabase.auth.signOut();
      setError("Your vendor account has been suspended");
      setLoading(false);
      return;
    }

    router.push("/vendor/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-foreground text-center mb-8 tracking-tight">
          TRIVO <span className="text-accent">VENDOR</span>
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-500 text-center">
              {error}
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-default rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors text-sm"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-default rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors text-sm"
            />
          </div>

          <div className="flex justify-center my-4">
            <div
              className="h-captcha"
              data-sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY || "a5a0d21c-04c8-4ffa-97a2-75cafa4e9672"}
              data-callback="onVendorCaptchaSuccess"
              data-expired-callback="onVendorCaptchaExpired"
              data-error-callback="onVendorCaptchaError"
              data-theme="dark"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !captchaToken}
            className="w-full rounded-lg bg-white py-2.5 text-sm font-bold text-black hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
            ) : (
              "Log In"
            )}
          </button>
        </form>
      </div>
      <Script src="https://js.hcaptcha.com/1/api.js" async defer strategy="afterInteractive" />
    </div>
  );
}
