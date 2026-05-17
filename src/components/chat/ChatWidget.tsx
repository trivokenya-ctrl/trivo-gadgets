"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { X, Send, Sparkles, MessageCircle } from "lucide-react";

const suggestions = [
  "What premium gadgets do you have?",
  "Show me smart home devices",
  "I need a gift under KES 5,000",
  "What audio products are available?",
];

interface ChatHelpers {
  messages: Array<{ id: string; role: string; content: string }>;
  append: (message: { role: string; content: string }) => Promise<string | undefined>;
  status: string;
  error: Error | undefined;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chat = useChat() as unknown as ChatHelpers;
  const { messages, append, status, error } = chat;

  const isLoading = status === "submitted" || status === "streaming";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput("");
    setShowSuggestions(false);
    append({ role: "user", content: text });
  };

  const handleSuggestion = (text: string) => {
    setShowSuggestions(false);
    append({ role: "user", content: text });
  };

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    if (!hasAutoOpened && !isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasAutoOpened(true);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [hasAutoOpened, isOpen, isDesktop]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pb-[env(safe-area-inset-bottom)]">
      {isOpen && (
        <div className="mb-4 flex h-[520px] max-h-[75vh] w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-default bg-background shadow-2xl animate-in slide-in-from-bottom-10 zoom-in-95 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-default bg-card/50 px-5 py-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Kylo</h3>
                <p className="text-[11px] text-muted">Premium Concierge</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <a
                href="https://wa.me/254757512769"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-1.5 text-muted hover:bg-surface hover:text-accent transition-colors"
                aria-label="Contact on WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-muted hover:bg-surface hover:text-foreground transition-colors"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scroll-smooth">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Good evening. I&apos;m Kylo.</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                    Your personal tech concierge. Ask me about our collection, or tap a suggestion below.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-accent text-black font-medium rounded-br-sm"
                        : "bg-chat-bubble text-foreground border border-subtle rounded-bl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-chat-bubble text-foreground border border-subtle rounded-bl-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-center">
                <p className="text-xs text-red-400 bg-red-400/10 px-3 py-1.5 rounded-full">
                  Connection issue. Please try again.
                </p>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {showSuggestions && messages.length === 0 && (
            <div className="px-5 pb-2">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="text-[11px] px-3 py-1.5 rounded-full bg-surface border border-default text-muted hover:text-foreground hover:border-accent/30 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-default bg-card/50 px-4 py-3 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask Kylo anything..."
              className="flex-1 bg-background border border-default rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="rounded-full bg-accent p-2.5 text-black disabled:opacity-50 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(37,211,102,0.2)]"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-14 w-14 items-center justify-center rounded-full bg-accent text-black shadow-[0_0_24px_rgba(37,211,102,0.35)] transition-all hover:scale-110 active:scale-95 hover:shadow-[0_0_32px_rgba(37,211,102,0.5)] ${
          isOpen ? "rotate-90 scale-0 opacity-0 absolute pointer-events-none" : "rotate-0 scale-100 opacity-100 relative"
        }`}
        aria-label="Open Kylo chat"
      >
        <Sparkles className="h-6 w-6" />
      </button>
    </div>
  );
}
