"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { MessageCircle, X, Send } from "lucide-react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = (useChat as any)({
    api: "/api/chat",
  });

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pb-[env(safe-area-inset-bottom)]">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 flex h-[500px] max-h-[70vh] w-[350px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-background shadow-2xl animate-in slide-in-from-bottom-10 zoom-in-95 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-neutral-900/50 p-4 backdrop-blur-md">
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                Trivo Assistant
              </h3>
              <p className="text-xs text-neutral-400">Ask me anything!</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-neutral-500 gap-2">
                <MessageCircle className="h-8 w-8 opacity-20" />
                <p className="text-sm">Hi! How can I help you today?</p>
              </div>
            ) : (
              messages.map((m: any) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                      m.role === "user"
                        ? "bg-accent text-black font-medium rounded-br-sm"
                        : "bg-neutral-800 text-neutral-200 border border-white/5 rounded-bl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-2 text-sm bg-neutral-800 text-neutral-200 border border-white/5 rounded-bl-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-white/10 bg-neutral-900/50 p-4 backdrop-blur-md flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1 bg-black/50 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-accent transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="rounded-full bg-accent p-2.5 text-black disabled:opacity-50 transition-transform hover:scale-105 active:scale-95"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-14 w-14 items-center justify-center rounded-full bg-accent text-black shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-transform hover:scale-110 active:scale-95 ${
          isOpen ? "rotate-90 scale-0 opacity-0 absolute" : "rotate-0 scale-100 opacity-100 relative"
        }`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
