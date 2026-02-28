"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import AuthField from "@/components/auth/AuthField";
import PasswordField from "@/components/auth/PasswordField";
import Button from "@/components/ui/Button";
import { useAuth } from "@/components/auth/useAuth";
import { validateSignup } from "@/lib/auth/validation";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  const { signup } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const errors = useMemo(
    () => validateSignup({ username, email, password, confirmPassword }),
    [username, email, password, confirmPassword]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (Object.keys(errors).length > 0) {
      setFormError("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      await signup({ username, email, password, confirmPassword });
      router.replace(next);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Sign up failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard
      eyebrow="Join FindIt"
      title="Create your account"
      subtitle="Report items, browse found listings, and reunite faster."
      sideTitle="Safer access"
      sideSubtitle="Create an account to unlock protected actions and manage your activity."
    >
      <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
        <AuthField
          label="Username"
          name="username"
          autoComplete="username"
          value={username}
          onChange={setUsername}
          error={errors.username}
        />

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
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          helpText="At least 8 characters."
        />

        <PasswordField
          label="Confirm Password"
          name="confirmPassword"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={errors.confirmPassword}
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
          {submitting ? "Creating…" : "Sign Up"}
        </Button>

        <p className="text-sm text-muted text-center">
          Already have an account?{" "}
          <a
            href={`/login?next=${encodeURIComponent(next)}`}
            className="text-accent font-semibold hover:underline"
          >
            Sign in
          </a>
        </p>
      </form>
    </AuthCard>
  );
}

