// ContactForm.tsx
"use client";
import { useState } from "react";

const ContactForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Form validation logic here

    try {
      setSubmitting(true);

      const response = await fetch("/api/sendbn", {
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
      } else {
        console.error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8">
      {!submitSuccess ? (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <label htmlFor="fullName" className=" block text-center">
            নাম
            <input
              type="text"
              id="fullName"
              placeholder="আপনার নাম লিখুন"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 text-center block w-full px-3 py-2 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              required
            />
          </label>

          <label htmlFor="email" className="block text-center">
            ইমেইল ঠিকানা
            <input
              type="email"
              placeholder="আমনার ইমেইল ঠিকানা লিখুন"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 text-center block w-full px-3 py-2 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              required
            />
          </label>

          <label htmlFor="phoneNumber" className="text-center block">
            ফোন নাম্বার(ঐচ্ছিক)
            <input
              type="tel"
              placeholder="আপনার ফোন নাম্বার লিখুন"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 block w-full px-3 py-2 text-center border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </label>

          <label htmlFor="message" className="block text-center">
            বার্তা
            <textarea
              id="message"
              placeholder="আপনার বার্তা লিখুন"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="mt-1 text-center block w-full px-3 py-2 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              required
            />
          </label>

          <button
            type="submit"
            className={`
        inline-flex justify-center items-center min-w-fit px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        ${submitting ? "opacity-50 cursor-not-allowed" : ""}
    `}
            disabled={submitting}
          >
            {submitting ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান"}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <p className="text-green-600 font-semibold">
            সফলভাবে বার্তা পাঠানো হয়েছে!
          </p>
          {/* Additional success message or redirect logic can be added here */}
        </div>
      )}
    </div>
  );
};

export default ContactForm;
