import {
  CodeIcon,
  DesignIcon,
  DocIcon,
  TestingIcon,
} from "@/components/icons";
import Footer from "@/components/marketing/Footer";
import Reveal from "@/components/marketing/Reveal";
import StageCycler from "@/components/marketing/StageCycler";
import ShaderHero from "@/components/ui/hero";

const stages = [
  {
    icon: DocIcon,
    name: "Requirements",
    description:
      "Talk through the idea and get functional requirements, user stories, and acceptance criteria drafted with you — not for you.",
  },
  {
    icon: DesignIcon,
    name: "Design",
    description:
      "The assistant proposes services, data stores, and an architecture ready for review before any code is written.",
  },
  {
    icon: CodeIcon,
    name: "Implementation",
    description:
      "Pick a user story and it writes the code alongside your team, flagging anything left unfinished for you to check.",
  },
  {
    icon: TestingIcon,
    name: "Testing",
    description:
      "Candidate tests are generated, run, and explained — so you see the evidence, not just a pass or fail badge.",
  },
];

const steps = [
  {
    step: "01",
    title: "Bring your idea, or your repo",
    description:
      "Start a new project from an idea, or connect an existing repository. The assistant meets you wherever you are in the SDLC.",
  },
  {
    step: "02",
    title: "Work through each stage together",
    description:
      "Requirements, design, implementation, testing — the assistant stays in the loop at every stage, adapting as decisions change.",
  },
  {
    step: "03",
    title: "You stay in control",
    description:
      "Every requirement, architecture decision, and code change is proposed for your review — nothing ships without your approval.",
  },
  {
    step: "04",
    title: "Context carries forward",
    description:
      "What you approved in requirements informs the design; what you approved in design informs the code and tests. Nothing gets re-explained.",
  },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <ShaderHero />

      {/* Product preview */}
      <section className="border-t border-border-soft">
        <Reveal className="mx-auto max-w-[980px] px-6 py-16">
          <div className="overflow-hidden rounded-xl2 border border-border-soft bg-surface shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-1.5 border-b border-border-soft px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-bad/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warn/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-good/70" />
              <span className="ml-3 text-[11.5px] text-ink-faint">
                app.repomind.dev/dashboard
              </span>
            </div>
            <div className="p-6">
              <StageCycler />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Platform / stages */}
      <section id="platform" className="border-t border-border-soft bg-surface/40">
        <div className="mx-auto max-w-[1080px] px-6 py-20">
          <Reveal className="mx-auto max-w-[600px] text-center">
            <h2 className="text-[28px] font-bold tracking-tight">
              Assistance at every stage, not just at the end
            </h2>
            <p className="mt-3 text-[14.5px] text-ink-dim">
              Most AI coding tools show up once you already have code. RepoMind
              is there earlier — helping shape requirements and design, then
              staying involved through implementation and testing.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stages.map(({ icon: Icon, name, description }, i) => (
              <Reveal key={name} delay={i * 90}>
                <div className="group h-full rounded-xl2 border border-border-soft bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-[#8aa2ff] transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                      <Icon className="h-[18px] w-[18px]" />
                    </div>
                    <span className="text-[12px] font-medium text-ink-faint">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="text-[14.5px] font-semibold">{name}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-dim">
                    {description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="workflow" className="border-t border-border-soft">
        <div className="mx-auto max-w-[1080px] px-6 py-20">
          <Reveal className="mx-auto max-w-[600px] text-center">
            <h2 className="text-[28px] font-bold tracking-tight">How it works</h2>
            <p className="mt-3 text-[14.5px] text-ink-dim">
              The assistant adapts as your project moves — through every
              stage, not just once.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            {steps.map((s, i) => (
              <Reveal key={s.step} delay={i * 90} className="flex gap-4">
                <span className="text-[22px] font-bold text-ink-faint">{s.step}</span>
                <div>
                  <h3 className="text-[15px] font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-dim">
                    {s.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
