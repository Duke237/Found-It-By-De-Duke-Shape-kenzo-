"use client";

import { useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import AuthField from "@/components/auth/AuthField";
import PasswordField from "@/components/auth/PasswordField";
import Button from "@/components/ui/Button";
import { useAuth } from "@/components/auth/useAuth";
import { validateLogin } from "@/lib/auth/validation";

// Wrapper component to handle Suspense boundary for useSearchParams
export default function LoginPageWrapper() {
  return (
    <Suspense fallback={
      <AuthCard
        eyebrow="Welcome back"
        title="Sign in"
        subtitle="Access your saved reports and protected actions."
        sideTitle="Find it faster"
        sideSubtitle="Sign in to report items and browse found submissions securely."
      >
        <div className="mt-8 space-y-5">
          <div className="h-10 bg-gray-100 rounded animate-pulse" />
          <div className="h-10 bg-gray-100 rounded animate-pulse" />
          <div className="h-10 bg-primary rounded animate-pulse" />
        </div>
      </AuthCard>
    }>
      <LoginPage />
    </Suspense>
  );
}

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const errors = useMemo(() => validateLogin({ email, password }), [email, password]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (Object.keys(errors).length > 0) {
      setFormError("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      await login({ email, password });
      
      // Check user role after login and redirect accordingly
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      
      if (data.user?.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace(next);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Sign in"
      subtitle="Access your saved reports and protected actions."
      sideTitle="Find it faster"
      sideSubtitle="Sign in to report items and browse found submissions securely."
    >
      <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
        <AuthField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
        />

        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          error={errors.password}
        />

        {formError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {formError}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full rounded-xl"
          disabled={submitting}
        >
          {submitting ? "Signing in…" : "Sign In"}
        </Button>

        <p className="text-sm text-muted text-center">
          New here?{" "}
          <a
            href={`/signup?next=${encodeURIComponent(next)}`}
            className="text-accent font-semibold hover:underline"
          >
            Create an account
          </a>
        </p>
      </form>
    </AuthCard>
  );
}

