"use client";

import { useState } from "react";
import { H3, H4 } from "./Heading";
import { FadeIn } from "./VisualEffects";
import { trackFormSubmit } from "@/lib/analytics";

interface LeadCaptureFormProps {
  variant?: "inline" | "popup" | "sidebar";
  source?: string;
  offer?: string;
}

interface Question {
  id: string;
  label: string;
  type: string;
  options?: string[];
  required: boolean;
}

interface Step {
  id: string;
  title: string;
  questions?: Question[];
  message?: string;
}

const steps: Step[] = [
  {
    id: "basics",
    title: "Let's Get Started",
    questions: [
      { id: "name", label: "Full Name", type: "text", required: true },
      { id: "email", label: "Email Address", type: "email", required: true },
      { id: "phone", label: "Phone Number", type: "tel", required: true },
    ],
  },
  {
    id: "home",
    title: "What Are You Looking For?",
    questions: [
      {
        id: "homeType",
        label: "Home Type",
        type: "select",
        options: ["Single Wide", "Double Wide", "Modular", "Not Sure Yet"],
        required: true,
      },
      {
        id: "bedrooms",
        label: "Bedrooms Needed",
        type: "select",
        options: ["1-2 Bedrooms", "3 Bedrooms", "4+ Bedrooms", "Not Sure"],
        required: true,
      },
      {
        id: "budget",
        label: "Budget Range",
        type: "select",
        options: [
          "Under $75,000",
          "$75,000 - $100,000",
          "$100,000 - $150,000",
          "$150,000+",
          "Need financing options",
        ],
        required: true,
      },
    ],
  },
  {
    id: "situation",
    title: "Your Situation",
    questions: [
      {
        id: "landStatus",
        label: "Do you have land?",
        type: "select",
        options: [
          "Already own land",
          "Looking to buy land",
          "Will lease/rent lot",
          "Need help finding land",
        ],
        required: true,
      },
      {
        id: "timeline",
        label: "When do you need your home?",
        type: "select",
        options: [
          "ASAP - Ready to buy now",
          "Within 3 months",
          "3-6 months",
          "6+ months",
          "Just researching",
        ],
        required: true,
      },
      {
        id: "credit",
        label: "Credit Score (approximate)",
        type: "select",
        options: [
          "Excellent (750+)",
          "Good (700-749)",
          "Fair (650-699)",
          "Poor (600-649)",
          "Not sure / Prefer not to say",
        ],
        required: false,
      },
    ],
  },
  {
    id: "submit",
    title: "Almost Done!",
    message: "We'll send you personalized floor plan recommendations and pricing within 24 hours.",
  },
];

export function LeadCaptureForm({ variant = "inline", source = "website", offer }: LeadCaptureFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    trackFormSubmit("lead_capture", { source, homeType: formData.homeType || "unknown" });
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const isStepValid = () => {
    const step = steps[currentStep];
    if (!step.questions) return true;
    
    return step.questions.every((q) => {
      if (!q.required) return true;
      return formData[q.id] && formData[q.id].trim() !== "";
    });
  };

  if (isSubmitted) {
    return (
      <FadeIn>
        <div className="bg-[var(--color-lime)]/10 border border-[var(--color-lime)] rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-[var(--color-lime)] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <H3 className="font-serif text-2xl font-semibold mb-2">Thank You!</H3>
          <p className="text-[var(--color-gray)] mb-4">
            We've received your information. A home specialist will contact you within 24 hours with personalized recommendations.
          </p>
          <p className="text-sm text-[var(--color-gray)]">
            Questions? Call us at{" "}
            <a href="tel:+12603081457" className="text-[var(--color-teal)] font-semibold">
              (260) 308-1457
            </a>
          </p>
        </div>
      </FadeIn>
    );
  }

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <FadeIn direction="up">
      <div className="bg-white rounded-2xl shadow-xl border border-[var(--color-charcoal)]/5 overflow-hidden">
        {/* Header */}
        <div className="bg-[var(--color-teal)] text-white p-6">
          <div className="flex justify-between items-center mb-4">
            <H4 className="font-serif text-xl font-light">{step.title}</H4>
            <span className="text-sm text-white/80">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-[var(--color-lime)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {step.message && (
            <p className="text-[var(--color-gray)] mb-6">{step.message}</p>
          )}

          {step.questions && (
            <div className="space-y-4">
              {step.questions.map((question) => (
                <div key={question.id}>
                  <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">
                    {question.label}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {question.type === "select" ? (
                    <select
                      value={formData[question.id] || ""}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      className="w-full px-4 py-3 bg-[var(--color-cream-dark)] border border-[var(--color-charcoal)]/10 rounded-lg text-[var(--color-charcoal)] focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent"
                    >
                      <option value="">Select an option</option>
                      {question.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={question.type}
                      value={formData[question.id] || ""}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      className="w-full px-4 py-3 bg-[var(--color-cream-dark)] border border-[var(--color-charcoal)]/10 rounded-lg text-[var(--color-charcoal)] focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent"
                      placeholder={question.label}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 border border-[var(--color-charcoal)]/20 text-[var(--color-charcoal)] font-semibold rounded-lg hover:bg-[var(--color-cream-dark)] transition-colors"
              >
                Back
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex-1 px-6 py-3 bg-[var(--color-teal)] text-white font-semibold rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-[var(--color-lime)] text-[var(--color-charcoal)] font-bold rounded-lg hover:bg-[var(--color-lime-dark)] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Get My Quote"}
              </button>
            )}
          </div>

          <p className="text-xs text-center text-[var(--color-gray)] mt-4">
            By submitting, you agree to our privacy policy. We never share your information.
          </p>
        </div>
      </div>
    </FadeIn>
  );
}
