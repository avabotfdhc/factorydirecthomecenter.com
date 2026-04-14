"use client";

import { useState, useEffect } from "react";
import { trackPhoneClick, trackFormSubmit } from "@/lib/analytics";

export function MobileActionBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Show after scrolling down a bit
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    trackFormSubmit("text_request", { source: "mobile_action_bar", type: "sms" });
    
    // Simulate sending text
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setIsSubmitted(true);
    setTimeout(() => {
      setShowTextModal(false);
      setIsSubmitted(false);
      setPhoneNumber("");
      setMessage("");
    }, 2000);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[var(--color-charcoal)]/10 shadow-lg lg:hidden">
        <div className="flex items-center justify-around p-2">
          {/* Call Button */}
          <a
            href="tel:+12603081457"
            onClick={() => trackPhoneClick("mobile_action_bar", "call")}
            className="flex flex-col items-center gap-1 px-4 py-2 text-[var(--color-charcoal)] hover:text-[var(--color-teal)] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-xs font-medium">Call</span>
          </a>

          {/* Text Button */}
          <button
            onClick={() => setShowTextModal(true)}
            className="flex flex-col items-center gap-1 px-4 py-2 text-[var(--color-charcoal)] hover:text-[var(--color-teal)] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs font-medium">Text</span>
          </button>

          {/* Get Quote Button */}
          <a
            href="/contact-us"
            className="flex flex-col items-center gap-1 px-6 py-2 bg-[var(--color-teal)] text-white rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs font-bold">Get Quote</span>
          </a>
        </div>
      </div>

      {/* Text Modal */}
      {showTextModal && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-xl font-semibold">Text Us</h3>
              <button
                onClick={() => setShowTextModal(false)}
                className="text-[var(--color-gray)] hover:text-[var(--color-charcoal)]"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[var(--color-lime)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[var(--color-charcoal)] font-semibold">Message sent!</p>
                <p className="text-sm text-[var(--color-gray)]">We'll text you back shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleTextSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">
                    Your Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="(260) 555-1234"
                    className="w-full px-4 py-3 bg-[var(--color-cream-dark)] border border-[var(--color-charcoal)]/10 rounded-lg focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="I'm interested in learning more about..."
                    rows={3}
                    className="w-full px-4 py-3 bg-[var(--color-cream-dark)] border border-[var(--color-charcoal)]/10 rounded-lg focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[var(--color-teal)] text-white font-bold rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors"
                >
                  Send Text
                </button>
                <p className="text-xs text-center text-[var(--color-gray)]">
                  Standard messaging rates may apply.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
