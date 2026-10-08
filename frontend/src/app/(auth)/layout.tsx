import Link from "next/link";
import Velaris from "@/components/auth/Velaris";
import BrandMark from "@/components/ui/BrandMark";

// Shared full-screen shader background and logo for /login and /signup.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Velaris height="100vh" className="min-h-screen">
      <div className="flex min-h-screen flex-col">
        <div className="p-6">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <BrandMark size={30} />
            <span className="text-[14px] font-semibold tracking-tight text-white">
              RepoMind
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-16">{children}</div>
      </div>
    </Velaris>
  );
}
