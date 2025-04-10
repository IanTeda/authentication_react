import { LoginForm } from "@/components/LoginForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_unprotected/login")({
  component: LoginComponent,
});

function LoginComponent() {
  return (
    <div className="w-full max-w-sm md:max-w-3xl">
      <LoginForm />
    </div>
  );
}
