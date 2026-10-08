// The homepage's hero (src/components/marketing/Hero.tsx) ships its own
// header/nav and the page renders its own Footer, so no shared chrome here.
// Login and signup have their own layout in app/(auth)/.
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-bg">{children}</div>;
}
