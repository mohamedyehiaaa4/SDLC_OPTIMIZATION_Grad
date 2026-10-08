"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, Lock, Mail, User } from "lucide-react";
import { ApiError } from "@/lib/api";
import { logIn, signUp } from "@/services/auth.service";

// Mirrors the backend rules (backend/app/auth/schemas.py); the backend is the authority.
function validateSignup(name: string, password: string): string | null {
  if (!name) return "Please enter your name.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "Password must contain at least one letter and one number.";
  }
  return null;
}

export default function AuthForm({
  mode,
  notice,
}: {
  mode: "login" | "signup";
  notice?: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSignup = mode === "signup";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email")).trim().toLowerCase();
    const password = String(form.get("password"));

    try {
      if (isSignup) {
        const name = String(form.get("name")).trim();
        const problem = validateSignup(name, password);
        if (problem) {
          setError(problem);
          setSubmitting(false);
          return;
        }
        await signUp({ name, email, password });
        router.push("/login?registered=1");
      } else {
        await logIn({ email, password });
        router.push("/dashboard");
      }
    } catch (err) {
      setSubmitting(false);
      setError(err instanceof ApiError ? err.message : "Could not reach the server. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-[400px] rounded-2xl border border-white/10 bg-white/[0.06] p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl">
      <div className="mb-7 text-center">
        <h1 className="text-[24px] font-bold tracking-tight text-white">
          {isSignup ? "Create your workspace" : "Welcome Back"}
        </h1>
        <p className="mt-1.5 text-[13.5px] text-white/60">
          {isSignup
            ? "Start turning requirements into a verified repository."
            : "Sign in to continue"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {isSignup && (
          <label className="flex items-center gap-2.5 border-b border-white/15 pb-2.5 transition-colors focus-within:border-accent">
            <User className="h-4 w-4 shrink-0 text-white/40" />
            <input
              type="text"
              name="name"
              autoComplete="name"
              required
              placeholder="Full Name"
              className="w-full bg-transparent text-[13.5px] text-white outline-none placeholder:text-white/40"
            />
          </label>
        )}

        <label className="flex items-center gap-2.5 border-b border-white/15 pb-2.5 transition-colors focus-within:border-accent">
          <Mail className="h-4 w-4 shrink-0 text-white/40" />
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="Email Address"
            className="w-full bg-transparent text-[13.5px] text-white outline-none placeholder:text-white/40"
          />
        </label>

        <div>
          <label className="flex items-center gap-2.5 border-b border-white/15 pb-2.5 transition-colors focus-within:border-accent">
            <Lock className="h-4 w-4 shrink-0 text-white/40" />
            <input
              type="password"
              name="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              minLength={isSignup ? 8 : undefined}
              required
              placeholder="Password"
              className="w-full bg-transparent text-[13.5px] text-white outline-none placeholder:text-white/40"
            />
          </label>
          {isSignup && (
            <p className="mt-2 text-[11.5px] text-white/40">
              At least 8 characters, with a letter and a number.
            </p>
          )}
          {!isSignup && (
            <div className="mt-2 text-right">
              <a href="#" className="text-[11.5px] text-white/50 hover:text-white/80">
                Forgot Password?
              </a>
            </div>
          )}
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-[12.5px] text-red-200">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-[12.5px] text-emerald-200">
            {notice}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 flex items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-3 text-[13.5px] font-semibold text-white shadow-[0_10px_30px_-8px_rgba(51,88,244,0.65)] transition-colors hover:bg-[#5470ff] disabled:opacity-70"
        >
          {submitting ? "Please wait…" : isSignup ? "Create workspace" : "Sign In"}
          {!submitting && <ArrowUpRight className="h-4 w-4" />}
        </button>
      </form>

      <p className="mt-6 text-center text-[13px] text-white/50">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-white hover:underline">
              Sign In
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-white hover:underline">
              Sign Up
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
