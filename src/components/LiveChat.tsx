"use client";

import { useState, useEffect, useRef } from "react";
import { H4 } from "./Heading";


interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: "1",
    type: "bot",
    text: "Hi! I'm Ava, your virtual home assistant. How can I help you today?",
    timestamp: new Date(),
  },
];

const quickReplies = [
  "What's your price range?",
  "Do you have homes in stock?",
  "How does financing work?",
  "Schedule a tour",
];

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userText: string): Message => {
    const lowerText = userText.toLowerCase();
    let responseText = "";

    if (lowerText.includes("price") || lowerText.includes("cost") || lowerText.includes("how much")) {
      responseText = "Great question — pricing depends on the model, size, and options, so we quote every home line by line with no hidden markups. Our team can put together an exact quote for any floor plan, usually same day. Can I get your name and phone number so we can send it over?";
    } else if (lowerText.includes("stock") || lowerText.includes("inventory") || lowerText.includes("available")) {
      responseText = "We have homes in stock for immediate delivery, homes in production, and can order any Champion floor plan. What's your timeline?";
    } else if (lowerText.includes("financ") || lowerText.includes("loan") || lowerText.includes("payment")) {
      responseText = "We work with lenders offering chattel loans, land-home packages, and conventional financing. Your best option depends on your credit score and whether you own land. Want to get pre-qualified?";
    } else if (lowerText.includes("tour") || lowerText.includes("visit") || lowerText.includes("see")) {
      responseText = "Our showroom in Auburn, IN is open Mon-Fri 9-5, Sat 10-4. We have model homes you can walk through. Would you like to schedule a tour?";
    } else if (lowerText.includes("land") || lowerText.includes("lot") || lowerText.includes("property")) {
      responseText = "You can place a manufactured home on owned land, a leased lot, or in a community. Do you already have land, or do you need help finding a location?";
    } else if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("hey")) {
      responseText = "Hello! I'm here to help you find your perfect home. What brings you to Factory Direct Homes Center today?";
    } else {
      responseText = "That's a great question! I'd love to help you with that. Can I get your name and phone number so one of our home specialists can give you a detailed answer?";
    }

    return {
      id: (Date.now() + 1).toString(),
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
        className="fixed bottom-24 right-4 lg:bottom-8 z-50 w-14 h-14 bg-[var(--color-teal)] text-white rounded-full shadow-lg hover:bg-[var(--color-teal-dark)] transition-all hover:scale-110 flex items-center justify-center"
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
        <div style={{ marginBottom: "var(--consent-h, 0px)" }} className="fixed bottom-40 right-4 lg:bottom-24 z-50 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl border border-[var(--color-charcoal)]/10 overflow-hidden">
          {/* Header */}
          <div className="bg-[var(--color-teal)] text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg">🏠</span>
              </div>
              <div>
                <H4 className="font-serif text-lg font-semibold">Ava</H4>
                <p className="text-xs text-white/80">Virtual Home Assistant</p>
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
                  <p>{message.text}</p>
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
            {quickReplies.map((reply) => (
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
    </>
  );
}
