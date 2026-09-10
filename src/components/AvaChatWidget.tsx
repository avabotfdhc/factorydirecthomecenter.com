"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { H4 } from "./Heading";
import PriceQuoteModal from "./PriceQuoteModal";
import { getSaleStatus } from "@/lib/sale";

// Ava — the site's sales copilot. Replies come from /api/chat (OpenAI with
// Ava's sales persona, the running sale, the live catalogue and her sales
// playbook). The widget tells the route which page the visitor is on and
// whether a quote or a showroom visit has already been requested in this
// session. When the route is not configured (no OPENAI_API_KEY) or fails, the
// widget answers from the scripted replies below so the visitor is never left
// hanging.

const PHONE_DISPLAY = "(260) 308-1457";
const PHONE_TEL = "tel:+12603081457";


interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
  timestamp: Date;
}

// The greeting names the running sale (from src/lib/sale.ts, so it can never
// advertise an ended offer) and opens with the first qualifying question.
function greeting(): Message {
  const sale = getSaleStatus();
  const hook = sale.active
    ? ` The ${sale.name} is on — ${sale.discountPercent}% off MSRP base price on orders through ${sale.endDateLabel}.`
    : "";
  return {
    id: "1",
    type: "bot",
    text: `Hi! I'm Ava with Factory Direct Homes Center in Auburn.${hook} Do you already own land, or are you still looking? I can match you with the right Champion home, get you a line-item quote, or book a showroom visit.`,
    timestamp: new Date(),
  };
}

function quickReplies(): string[] {
  const sale = getSaleStatus();
  return [
    "Book a showroom visit",
    sale.active ? "What's on sale right now?" : "Which series fits a tight budget?",
    "Show me 3-bedroom homes",
    "How does financing work?",
    "What comes standard?",
    "Manufactured vs. modular?",
  ];
}

// Ava writes links as bare site paths ("/floor-plans/brighton"), sometimes as
// markdown links, and gives out the phone number. Make all of them tappable;
// everything else is rendered as plain text.
const RICH_RE =
  /\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s<>()]+)|(^|[\s(])(\/(?:floor-plans|series|homes-on-sale|options|design-your-home|financing|guides|resources|locations|contact-us|champion-homes|about|blog)\b[\w\-./]*)|(\(260\)\s?308-1457|260-308-1457)/g;
const TRAILING_PUNCT = /[.,;:!?)]+$/;

function linkNode(href: string, label: string, key: number): ReactNode {
  const external = /^https?:\/\//.test(href) && !/factorydirecthomescenter\.com/.test(href);
  return (
    <a
      key={key}
      href={href}
      className="underline font-semibold break-words"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {label}
    </a>
  );
}

function renderRich(text: string): ReactNode[] {
  const src = text.replace(/\*\*/g, "");
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of src.matchAll(RICH_RE)) {
    const start = m.index ?? 0;
    if (start > last) out.push(src.slice(last, start));
    if (m[1] && m[2]) {
      out.push(linkNode(m[2], m[1], key++));
    } else if (m[3]) {
      const trimmed = m[3].replace(TRAILING_PUNCT, "");
      out.push(linkNode(trimmed, trimmed, key++), m[3].slice(trimmed.length));
    } else if (m[5] !== undefined) {
      const trimmed = m[5].replace(TRAILING_PUNCT, "");
      out.push(m[4], linkNode(trimmed, trimmed, key++), m[5].slice(trimmed.length));
    } else if (m[6]) {
      out.push(linkNode(PHONE_TEL, m[6], key++));
    }
    last = start + m[0].length;
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}

export function AvaChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [greeting()]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [visitRequested, setVisitRequested] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Once the API answers 503 (not configured) we stop asking it.
  const apiAvailable = useRef(true);
  // Monotonic message ids (the greeting is "1").
  const nextId = useRef(2);
  const newId = () => String(nextId.current++);

  // Show notification after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setHasNotification(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string = inputText) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: newId(),
      type: "user",
      text: text,
      timestamp: new Date(),
    };

    const history = [...messages, userMessage];
    setMessages(history);
    setInputText("");
    setIsTyping(true);

    const reply = await askAva(history);
    setMessages((prev) => [
      ...prev,
      {
        id: newId(),
        type: "bot",
        text: reply ?? generateBotResponse(text).text,
        timestamp: new Date(),
      },
    ]);
    setIsTyping(false);
  };

  // Live reply from /api/chat, or null to fall back to the scripted answers.
  const askAva = async (history: Message[]): Promise<string | null> => {
    if (!apiAvailable.current) return null;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history
            .slice(1) // drop the canned greeting
            .slice(-12)
            .map((m) => ({ role: m.type === "user" ? "user" : "assistant", content: m.text })),
          page: window.location.pathname,
          captured: { lead: leadCaptured, visit: visitRequested },
        }),
      });
      if (res.status === 503) {
        apiAvailable.current = false;
        return null;
      }
      if (res.status === 429) {
        // Message budget reached: the route sends a friendly hand-off line.
        const json = (await res.json().catch(() => ({}))) as { reply?: string };
        return json.reply?.trim() || null;
      }
      if (!res.ok) return null;
      const json = (await res.json()) as { reply?: string; leadCaptured?: boolean; visitRequested?: boolean };
      if (json.leadCaptured) setLeadCaptured(true);
      if (json.visitRequested) setVisitRequested(true);
      return json.reply?.trim() || null;
    } catch {
      return null;
    }
  };

  const generateBotResponse = (userText: string): Message => {
    const lowerText = userText.toLowerCase();
    let responseText = "";

    const sale = getSaleStatus();
    if (lowerText.includes("sale") || lowerText.includes("discount") || lowerText.includes("deal") || lowerText.includes("promotion")) {
      responseText = sale.active
        ? `The ${sale.name} is running now: ${sale.discountPercent}% off MSRP base price on new floor-plan orders authorized for ${sale.productionMonth} production, through ${sale.endDateLabel}. See the featured homes at /homes-on-sale, or tell me your name and phone number and the team will quote any plan with the discount applied.`
        : `There's no promotion running at the moment, but every home is factory-direct with line-item pricing. Tell me your name and phone number and the team will send a quote on any plan.`;
    } else if (lowerText.includes("visit") || lowerText.includes("appointment") || lowerText.includes("tour") || lowerText.includes("showroom") || lowerText.includes("book")) {
      responseText = `We'd love to show you around. The showroom at 1211 State Road 8, Auburn (just off I-69) is open Mon–Fri 9–5 and Sat 10–4, with model homes to walk through. What day and time work for you? Leave your name and phone number and the team will confirm — or call/text ${PHONE_DISPLAY}.`;
    } else if (lowerText.includes("standard") || lowerText.includes("option") || lowerText.includes("upgrade") || lowerText.includes("feature")) {
      responseText = "Every plan comes with residential standards — drywall or finished interiors, full kitchens with appliance packages, low-E windows and insulation — and you choose colors, cabinets, flooring and siding at order time. Fireplaces, islands, extra cabinets and exterior styles are priced options; see /options. Which floor plan are you considering?";
    } else if (lowerText.includes("price") || lowerText.includes("cost") || lowerText.includes("how much")) {
      responseText = "Great question — pricing depends on the model, size, and options, so we quote every home line by line with no hidden markups. Our team can put together an exact quote for any floor plan, usually same day. Can I get your name and phone number so we can send it over?";
    } else if (lowerText.includes("stock") || lowerText.includes("inventory") || lowerText.includes("available")) {
      responseText = "We have homes in stock for immediate delivery, homes in production, and can order any Champion floor plan. What's your timeline?";
    } else if (lowerText.includes("financ") || lowerText.includes("loan") || lowerText.includes("payment")) {
      responseText = "We work with lenders offering chattel loans, land-home packages, and conventional financing. Your best option depends on your credit score and whether you own land. Want to get pre-qualified?";
    } else if (lowerText.includes("see")) {
      responseText = `Our showroom in Auburn, IN is open Mon–Fri 9–5, Sat 10–4, with model homes you can walk through. Want to pick a day? Leave your name and phone number, or call/text ${PHONE_DISPLAY}.`;
    } else if (lowerText.includes("land") || lowerText.includes("lot") || lowerText.includes("property")) {
      responseText = "You can place a manufactured home on owned land, a leased lot, or in a community. Do you already have land, or do you need help finding a location?";
    } else if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("hey")) {
      responseText = "Hello! I'm here to help you find your perfect home. What brings you to Factory Direct Homes Center today?";
    } else {
      responseText = "That's a great question! I'd love to help you with that. Can I get your name and phone number so one of our home specialists can give you a detailed answer?";
    }

    return {
      id: newId(),
      type: "bot",
      text: responseText,
      timestamp: new Date(),
    };
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setHasNotification(false);
        }}
        style={{ marginBottom: "var(--consent-h, 0px)" }}
        className="fixed bottom-[4.75rem] right-4 lg:bottom-8 z-50 w-14 h-14 bg-[var(--color-teal)] text-white rounded-full shadow-lg hover:bg-[var(--color-teal-dark)] transition-all hover:scale-110 flex items-center justify-center"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        {hasNotification && !isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{ marginBottom: "var(--consent-h, 0px)" }} className="fixed bottom-[8.75rem] right-4 lg:bottom-24 z-50 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl border border-[var(--color-charcoal)]/10 overflow-hidden">
          {/* Header */}
          <div className="bg-[var(--color-teal)] text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg">🏠</span>
              </div>
              <div>
                <H4 className="font-serif text-lg font-semibold">Ava</H4>
                <p className="text-xs text-white/80">Virtual sales assistant · a person follows up</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-[var(--color-cream-dark)]/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    message.type === "user"
                      ? "bg-[var(--color-teal)] text-white rounded-br-none"
                      : "bg-white text-[var(--color-charcoal)] border border-[var(--color-charcoal)]/10 rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{renderRich(message.text)}</p>
                  <span className={`text-xs mt-1 block ${message.type === "user" ? "text-white/70" : "text-[var(--color-gray)]"}`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl border border-[var(--color-charcoal)]/10 rounded-bl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[var(--color-gray)] rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-[var(--color-gray)] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <span className="w-2 h-2 bg-[var(--color-gray)] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="p-2 border-t border-[var(--color-charcoal)]/10 flex gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setQuoteOpen(true)}
              className="px-3 py-1.5 bg-[var(--color-teal)] text-white text-xs font-bold rounded-full whitespace-nowrap hover:bg-[var(--color-teal-dark)] transition-colors"
            >
              {leadCaptured ? "✓ Quote requested" : visitRequested ? "✓ Visit requested" : "Get my quote"}
            </button>
            {quickReplies().map((reply) => (
              <button
                key={reply}
                onClick={() => handleSend(reply)}
                className="px-3 py-1.5 bg-[var(--color-cream-dark)] text-[var(--color-charcoal)] text-xs font-medium rounded-full whitespace-nowrap hover:bg-[var(--color-teal)]/10 transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-[var(--color-charcoal)]/10 flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              maxLength={500}
              className="flex-1 px-4 py-2 bg-[var(--color-cream-dark)] border border-[var(--color-charcoal)]/10 rounded-full text-sm focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-10 h-10 bg-[var(--color-teal)] text-white rounded-full flex items-center justify-center hover:bg-[var(--color-teal-dark)] transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <PriceQuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} modelName="Chat inquiry" />
    </>
  );
}
