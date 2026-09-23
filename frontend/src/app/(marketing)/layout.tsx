// The homepage's hero (src/components/ui/hero.tsx) ships its own header/nav,
// and the login/signup pages are immersive full-screen shader backgrounds
// with their own minimal logo — so no shared chrome is rendered here. The
// homepage renders its own Footer directly (see (marketing)/page.tsx).
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-bg">{children}</div>;
}
