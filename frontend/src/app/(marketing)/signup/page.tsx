import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import AuthForm from "@/components/marketing/AuthForm";
import Velaris from "@/components/ui/velaris";

export default function SignupPage() {
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
        <div className="flex flex-1 items-center justify-center px-6 pb-16">
          <AuthForm mode="signup" />
        </div>
      </div>
    </Velaris>
  );
}
