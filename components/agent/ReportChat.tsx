"use client";
import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2, Bot } from "lucide-react";
import { useResearchStore } from "@/stores/useResearchStore";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "ai"; content: string };

export default function ReportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hi! I'm the Investra AI analyst. Ask me anything about this report." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { state } = useResearchStore();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  if (!state?.companyData) return null;

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMsg }],
          context: state,
        }),
      });

      if (!response.ok) throw new Error("Failed to connect");
      if (!response.body) throw new Error("No readable stream");

      const reader  = response.body.getReader();
      const decoder = new TextDecoder();
      let aiContent = "";

      setMessages(prev => [...prev, { role: "ai", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        aiContent += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = aiContent;
          return newMessages;
        });
      }
    } catch {
      setMessages(prev => [...prev, { role: "ai", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* FAB */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI chat"
          style={{
            position: "fixed", bottom: 32, right: 32, zIndex: 50,
            width: 52, height: 52, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary), var(--accent))",
            color: "#fff", border: "none", cursor: "pointer",
            boxShadow: "0 8px 24px rgba(59,130,246,0.4), var(--shadow-glow-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform var(--duration-base) var(--ease-spring)",
            animation: "breathe 3s ease-in-out infinite",
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        >
          <MessageSquare size={22} />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="AI report chat"
          aria-modal="true"
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 50,
            width: 380, height: 520, borderRadius: "var(--radius-xl)",
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lg), var(--shadow-glow-primary)",
            display: "flex", flexDirection: "column", overflow: "hidden",
            animation: "scale-in 0.25s var(--ease-spring) both",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 18px",
              background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.08))",
              borderBottom: "1px solid var(--border)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--primary), var(--accent))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Bot size={16} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>Investra AI</div>
                <div style={{ fontSize: 11, color: "var(--success)", display: "flex", alignItems: "center", gap: 4 }}>
                  <span className="glow-dot glow-dot-green" style={{ width: 5, height: 5 }} aria-hidden="true" />
                  Ready
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              style={{
                background: "transparent", border: "none",
                color: "var(--text-tertiary)", cursor: "pointer",
                padding: 6, borderRadius: "var(--radius-sm)",
                display: "flex", transition: "color var(--duration-fast) var(--ease-out)",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-tertiary)")}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
            style={{
              flex: 1, overflowY: "auto", padding: "16px 16px 8px",
              display: "flex", flexDirection: "column", gap: 12,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "87%",
                }}
              >
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    fontSize: 13, lineHeight: 1.6,
                    background: msg.role === "user" ? "var(--primary)" : "var(--bg-elevated)",
                    color: msg.role === "user" ? "#fff" : "var(--text-secondary)",
                    border: msg.role === "user" ? "none" : "1px solid var(--border)",
                  }}
                >
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => <p style={{ margin: 0 }} {...props} />,
                      strong: ({ node, ...props }) => (
                        <strong style={{ color: msg.role === "user" ? "#fff" : "var(--primary)", fontWeight: 700 }} {...props} />
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ alignSelf: "flex-start" }}>
                <div
                  style={{
                    padding: "10px 14px",
                    background: "var(--bg-elevated)", border: "1px solid var(--border)",
                    borderRadius: "16px 16px 16px 4px",
                    display: "flex", gap: 4, alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map(j => (
                    <span
                      key={j}
                      style={{
                        width: 5, height: 5, borderRadius: "50%", background: "var(--primary)",
                        animation: `blink 1.2s ease-in-out ${j * 0.2}s infinite`,
                        display: "inline-block",
                      }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "12px 14px",
              borderTop: "1px solid var(--border)",
              background: "var(--bg-elevated)",
            }}
          >
            <form
              onSubmit={e => { e.preventDefault(); handleSend(); }}
              style={{ display: "flex", gap: 8 }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about the analysis…"
                aria-label="Chat message input"
                disabled={isTyping}
                className="input"
                style={{ flex: 1, borderRadius: "var(--radius-full)", fontSize: 13, padding: "8px 14px" }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
                style={{
                  width: 36, height: 36, flexShrink: 0,
                  borderRadius: "50%", border: "none", cursor: input.trim() ? "pointer" : "not-allowed",
                  background: input.trim() ? "var(--primary)" : "var(--bg-overlay)",
                  color: input.trim() ? "#fff" : "var(--text-tertiary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all var(--duration-fast) var(--ease-out)",
                }}
              >
                <Send size={15} style={{ marginLeft: 1 }} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
