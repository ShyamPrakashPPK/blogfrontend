import { Suspense } from "react";
import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Suspense fallback={<div>Loading login form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
