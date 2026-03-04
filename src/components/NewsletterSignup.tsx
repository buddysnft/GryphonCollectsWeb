"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");

    try {
      await addDoc(collection(db, "newsletter"), {
        email: email.toLowerCase().trim(),
        subscribedAt: Timestamp.now(),
        source: "website",
        status: "active",
      });

      setStatus("success");
      setMessage("Thanks for subscribing!");
      setEmail("");
      
      // Reset after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } catch (error) {
      console.error("Newsletter signup error:", error);
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
      
      // Reset after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h3 className="text-xl font-bold text-text-primary mb-2">
        Stay Updated
      </h3>
      <p className="text-text-secondary text-sm mb-4">
        Get notified about new drops, breaks, and exclusive deals
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={status === "loading" || status === "success"}
          className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none disabled:opacity-50"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="bg-primary text-background px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed!" : "Subscribe"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-3 text-sm ${
            status === "success" ? "text-success" : "text-danger"
          }`}
          role="alert"
        >
          {message}
        </p>
      )}

      {status === "idle" && (
        <p className="text-text-muted text-xs mt-3">
          We respect your privacy. Unsubscribe anytime.
        </p>
      )}
    </div>
  );
}
