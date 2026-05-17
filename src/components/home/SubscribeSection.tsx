"use client";

import { useState, useEffect } from "react";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import Script from "next/script";

interface HCaptchaWindow {
  onHCaptchaSuccess?: (token: string) => void;
  onHCaptchaExpired?: () => void;
  onHCaptchaError?: () => void;
  hcaptcha?: {
    reset: () => void;
  };
}

export default function SubscribeSection() {
  const [email, setEmail] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const w = window as unknown as HCaptchaWindow;
    // Bind hCaptcha callbacks to global window
    w.onHCaptchaSuccess = (token: string) => {
      setCaptchaToken(token);
    };
    w.onHCaptchaExpired = () => {
      setCaptchaToken("");
    };
    w.onHCaptchaError = () => {
      setCaptchaToken("");
    };

    return () => {
      delete w.onHCaptchaSuccess;
      delete w.onHCaptchaExpired;
      delete w.onHCaptchaError;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (!captchaToken) {
      setStatus("error");
      setMessage("Please complete the captcha challenge.");
      return;
    }

    setStatus("loading");
    
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, captchaToken }),
      });
      
      const data = await res.json();
      const w = window as unknown as HCaptchaWindow;
      
      if (res.ok) {
        setStatus("success");
        setMessage("You're in. Keep an eye on your inbox.");
        setEmail("");
        setCaptchaToken("");
        // Reset the hCaptcha widget
        if (w.hcaptcha) {
          w.hcaptcha.reset();
        }
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
        // Reset the hCaptcha widget
        if (w.hcaptcha) {
          w.hcaptcha.reset();
        }
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again later.");
    }
  };

  return (
    <section id="subscribe" className="py-24 container mx-auto px-4 md:px-8">
      <div className="max-w-4xl mx-auto rounded-3xl bg-card border border-default p-8 md:p-16 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-highlight/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <Mail className="h-12 w-12 text-foreground mb-6" />
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Know when new stock lands in Kenya
          </h2>
          <p className="text-lg text-muted mb-10 max-w-xl">
            Be the first to know when fresh products arrive. No spam — just real stock updates.
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={status === "loading" || status === "success"}
              className="flex-1 bg-background border border-default rounded-full px-6 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="rounded-full bg-white px-8 py-4 text-sm font-bold text-black hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]"
            >
              {status === "loading" ? (
                <span className="flex h-5 w-5 items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black" />
                </span>
              ) : status === "success" ? (
                "Subscribed"
              ) : (
                "Notify Me"
              )}
            </button>
          </form>

          {/* hCaptcha Widget Container */}
          <div className="mb-4">
            <div
              className="h-captcha"
              data-sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY}
              data-callback="onHCaptchaSuccess"
              data-expired-callback="onHCaptchaExpired"
              data-error-callback="onHCaptchaError"
              data-theme="dark"
            />
          </div>

          {status === "success" && (
            <div className="mt-2 flex items-center gap-2 text-accent bg-accent/10 px-4 py-2 rounded-full text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              {message}
            </div>
          )}
          
          {status === "error" && (
            <div className="mt-2 flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-2 rounded-full text-sm font-medium">
              <AlertCircle className="h-4 w-4" />
              {message}
            </div>
          )}
        </div>
      </div>
      <Script src="https://js.hcaptcha.com/1/api.js" async defer strategy="afterInteractive" />
    </section>
  );
}
