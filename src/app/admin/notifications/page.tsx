"use client";

import { useState } from "react";
import { addNotification } from "@/lib/firestore";
import { Timestamp } from "firebase/firestore";

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSuccess(false);

    try {
      await addNotification({
        title,
        body,
        createdAt: Timestamp.now(),
      });

      setTitle("");
      setBody("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-2">Send Notification</h1>
        <p className="text-text-secondary mb-8">
          Compose and send push notifications to all app users
        </p>

        <div className="bg-primary-light border border-primary rounded-lg p-4 mb-6">
          <p className="text-primary text-sm">
            <strong>Note:</strong> This UI saves notifications to Firestore. Actual push sending will be wired up via Firebase Cloud Functions in a future update.
          </p>
        </div>

        <form onSubmit={handleSend} className="bg-surface border border-border rounded-lg p-6 space-y-6">
          {success && (
            <div className="bg-success/20 border border-success text-success px-4 py-3 rounded-lg">
              Notification saved successfully!
            </div>
          )}

          <div>
            <label className="block text-text-secondary mb-2">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="New products available!"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Message *</label>
            <textarea
              required
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Check out the latest drops in our shop..."
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full bg-primary text-background py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send to All Users"}
          </button>
        </form>
      </div>
    </div>
  );
}
