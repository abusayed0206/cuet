// ContactForm.tsx
"use client";
import { useState, useRef } from "react";
import CaptchaWidget from "./CaptchaWidget";

const ContactForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileWidgetRef = useRef<string>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!turnstileToken) {
      alert("Please complete the Turnstile challenge before submitting.");
      return;
    }

    try {
      setSubmitting(true);

      // First, verify the Turnstile token
      const verifyResponse = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: turnstileToken }),
      });

      if (!verifyResponse.ok) {
        const error = await verifyResponse.json();
        throw new Error(error.message || "Failed to verify Turnstile token");
      }

      // If verification is successful, proceed with form submission
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, phoneNumber, message }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFullName("");
        setEmail("");
        setPhoneNumber("");
        setMessage("");
        setTurnstileToken("");
        if (turnstileWidgetRef.current && window.turnstile) {
          window.turnstile.reset(turnstileWidgetRef.current);
        }
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8">
      {!submitSuccess ? (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <label htmlFor="fullName" className=" block text-center">
            Name
            <input
              type="text"
              id="fullName"
              placeholder="Your Short Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 text-center block w-full px-3 py-2 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              required
            />
          </label>

          <label htmlFor="email" className="block text-center">
            Email Address
            <input
              type="email"
              placeholder="Your Email Address"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 text-center block w-full px-3 py-2 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              required
            />
          </label>

          <label htmlFor="phoneNumber" className="text-center block">
            Phone Number(Optional)
            <input
              type="tel"
              placeholder="Your Phone Number"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 block w-full px-3 py-2 text-center border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </label>

          <label htmlFor="message" className="block text-center">
            Message
            <textarea
              id="message"
              placeholder="Write what you want to tell me!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="mt-1 text-center block w-full px-3 py-2 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              required
            />
          </label>

          <div className="flex justify-center">
            <CaptchaWidget
              sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              callback={(token) => {
                setTurnstileToken(token);
              }}
              onWidgetId={(widgetId) => {
                turnstileWidgetRef.current = widgetId;
              }}
            />
          </div>

          <button
            type="submit"
            className={`
              inline-flex justify-center items-center min-w-fit px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              ${submitting || !turnstileToken
                ? "opacity-50 cursor-not-allowed"
                : ""
              }
            `}
            disabled={submitting || !turnstileToken}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <p className="text-green-600 font-semibold">
            Message sent successfully!
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactForm;
