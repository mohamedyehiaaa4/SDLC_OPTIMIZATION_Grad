"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, Lock, Mail, User } from "lucide-react";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const isSignup = mode === "signup";

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Front-end only prototype: there is no auth backend yet.
    // Submitting simply takes you into the dashboard shell.
    setSubmitting(true);
    router.push("/dashboard");
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
              required
              placeholder="Password"
              className="w-full bg-transparent text-[13.5px] text-white outline-none placeholder:text-white/40"
            />
          </label>
          {!isSignup && (
            <div className="mt-2 text-right">
              <a href="#" className="text-[11.5px] text-white/50 hover:text-white/80">
                Forgot Password?
              </a>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 flex items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-3 text-[13.5px] font-semibold text-white shadow-[0_10px_30px_-8px_rgba(51,88,244,0.65)] transition-colors hover:bg-[#5470ff] disabled:opacity-70"
        >
          {submitting ? "Please wait…" : isSignup ? "Create workspace" : "Sign In"}
          {!submitting && <ArrowUpRight className="h-4 w-4" />}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[10.5px] font-medium tracking-wide text-white/40">
          OR CONTINUE WITH
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-white px-4 py-3 text-[13.5px] font-semibold text-black transition-colors hover:bg-white/90"
      >
        <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="currentColor">
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.44-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a10.9 10.9 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.51 10.51 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
        </svg>
        Continue with GitHub
      </button>

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
