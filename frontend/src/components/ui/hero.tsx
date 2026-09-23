"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MeshGradient, PulsingBorder } from "@paper-design/shaders-react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import BrandMark from "@/components/BrandMark";

// Shader colors live here as literal hex (WebGL uniforms can't read CSS
// variables) — this is the one place to edit when the brand palette changes.
// Deep Ocean: near-black navy base with a vivid blue accent.
const MESH_COLORS = ["#0a0b10", "#3358f4", "#7c93ff", "#161925", "#1c2f8f"];
const MESH_COLORS_WIREFRAME = ["#0a0b10", "#ffffff", "#3358f4", "#7c93ff"];
const RING_COLORS = ["#3358f4", "#7c93ff", "#5470ff", "#3fae7c", "#d1495b", "#c7d2ff", "#ffffff"];
const RING_TEXT = "REPOMIND • AN AI ASSISTANT FOR THE SDLC • REPOMIND • AN AI ASSISTANT FOR THE SDLC • ";

const navLinks = [
  { href: "#platform", label: "Platform" },
  { href: "#workflow", label: "Workflow" },
];

export default function ShaderHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setIsActive] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onEnter = () => setIsActive(true);
    const onLeave = () => setIsActive(false);
    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);
    return () => {
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen flex-col overflow-hidden bg-bg"
    >
      <svg className="absolute inset-0 h-0 w-0">
        <defs>
          <filter id="text-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <MeshGradient
        className="absolute inset-0 h-full w-full"
        colors={MESH_COLORS}
        speed={0.3}
        backgroundColor="#0a0b10"
      />
      <MeshGradient
        className="absolute inset-0 h-full w-full opacity-40"
        colors={MESH_COLORS_WIREFRAME}
        speed={0.2}
        wireframe="true"
        backgroundColor="transparent"
      />

      <header className="relative z-20 flex items-center justify-between border-b border-white/10 bg-black/15 px-6 py-5 backdrop-blur-sm md:px-10">
        <Link href="/" className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <BrandMark size={42} />
          </motion.div>
          <span className="text-xl font-bold tracking-tight text-white">RepoMind</span>
        </Link>

        <nav className="hidden items-center space-x-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-5 py-2.5 text-[15px] font-medium text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="rounded-full px-4 py-2.5 text-[15px] font-medium text-white/80 transition-colors hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="flex h-11 items-center gap-1.5 rounded-full bg-white px-6 text-[15px] font-semibold text-black transition-all duration-300 hover:bg-white/90"
          >
            Get started
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="relative z-20 flex flex-1 items-end px-6 pb-14 md:px-10 md:pb-16">
        <div className="max-w-2xl text-left">
          <motion.h1
            className="mb-6 text-5xl font-bold leading-none tracking-tight text-white md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.span
              className="mb-2 block text-3xl font-light tracking-wider text-white/90 md:text-4xl lg:text-5xl"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #cddaff 35%, #eef2ff 65%, #ffffff 100%)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "url(#text-glow)",
                textShadow: "0 4px 24px rgba(0,0,0,0.45)",
              }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              Requirements. Design. Code. Tests.
            </motion.span>
            <span className="block font-black text-white drop-shadow-2xl">One Assistant</span>
            <span className="block font-light italic text-white/80">Every Stage</span>
          </motion.h1>

          <motion.p
            className="mb-8 max-w-xl text-lg font-light leading-relaxed text-white/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            RepoMind stays alongside your team through requirements, design,
            implementation, and testing — proposing, drafting, and explaining
            at each stage, while every decision stays yours to approve.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <Link href="/login">
              <motion.span
                className="inline-block cursor-pointer rounded-full border-2 border-white/30 bg-transparent px-8 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-[#3358f4]/60 hover:bg-white/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign in
              </motion.span>
            </Link>
            <Link href="/signup">
              <motion.span
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-gradient-to-r from-[#3358f4] to-[#7c93ff] px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-[#5470ff] hover:to-[#9db0ff] hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get started free
                <ArrowUpRight className="h-4 w-4" />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </main>

      <div className="absolute bottom-8 right-8 z-30 hidden sm:block">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <PulsingBorder
            colors={RING_COLORS}
            colorBack="#00000000"
            speed={1.5}
            roundness={1}
            thickness={0.1}
            softness={0.2}
            intensity={5}
            spotsPerColor={5}
            spotSize={0.1}
            pulse={0.1}
            smoke={0.5}
            smokeSize={4}
            scale={0.65}
            rotation={0}
            style={{ width: "60px", height: "60px", borderRadius: "50%" }}
          />

          <motion.svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            style={{ transform: "scale(1.6)" }}
          >
            <defs>
              <path id="ring-path" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
            </defs>
            <text className="fill-white/80 text-[9px] font-medium">
              <textPath href="#ring-path" startOffset="0%">
                {RING_TEXT}
              </textPath>
            </text>
          </motion.svg>
        </div>
      </div>
    </div>
  );
}
