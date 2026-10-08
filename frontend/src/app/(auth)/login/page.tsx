import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { registered?: string };
}) {
  return (
    <AuthForm
      mode="login"
      notice={
        searchParams.registered
          ? "Account created. Log in with your email and password."
          : undefined
      }
    />
  );
}
