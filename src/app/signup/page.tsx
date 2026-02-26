"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, displayName);
      router.push("/account");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Create Account</h1>
          <p className="text-text-secondary">Join us today</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-lg p-8">
          {error && (
            <div className="bg-danger/20 border border-danger text-danger px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="displayName" className="block text-text-secondary mb-2">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
              placeholder="Your Name"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-text-secondary mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
              placeholder="your@email.com"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-text-secondary mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-text-secondary mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-background py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="text-text-secondary text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
