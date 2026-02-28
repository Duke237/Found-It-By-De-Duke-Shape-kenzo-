function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateLogin(input: { email: string; password: string }) {
  const errors: Record<string, string> = {};
  if (!input.email.trim()) errors.email = "Email is required.";
  else if (!isEmail(input.email.trim())) errors.email = "Enter a valid email.";

  if (!input.password) errors.password = "Password is required.";
  else if (input.password.length < 8) errors.password = "Password must be at least 8 characters.";
  return errors;
}

export function validateSignup(input: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const errors: Record<string, string> = {};

  if (!input.username.trim()) errors.username = "Username is required.";
  else if (input.username.trim().length < 2) errors.username = "Username is too short.";

  if (!input.email.trim()) errors.email = "Email is required.";
  else if (!isEmail(input.email.trim())) errors.email = "Enter a valid email.";

  if (!input.password) errors.password = "Password is required.";
  else if (input.password.length < 8) errors.password = "Password must be at least 8 characters.";

  if (!input.confirmPassword) errors.confirmPassword = "Confirm your password.";
  else if (input.confirmPassword !== input.password)
    errors.confirmPassword = "Passwords do not match.";

  return errors;
}

