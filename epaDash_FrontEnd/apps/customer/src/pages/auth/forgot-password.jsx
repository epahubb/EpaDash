import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, TextInput, forgotPasswordSchema, validateWithZod } from "@epadash/shared";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validateWithZod(forgotPasswordSchema, { email });
    if (!result.success) {
      setError(result.errors.email);
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };
  if (submitted) {
    return <div className="w-full bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4"><CheckCircle2 className="h-6 w-6" /></div><h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2><p className="text-sm text-gray-600 mb-6">
          We have sent a password reset link to <strong className="text-gray-900">{email}</strong>.
        </p><Link to="/login"><Button variant="outline" size="md" className="w-full" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Sign In
          </Button></Link></div>;
  }
  return <div className="w-full bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm"><div className="mb-6"><h2 className="text-2xl font-bold tracking-tight text-gray-900">Reset password</h2><p className="mt-1 text-sm text-gray-500">
          Enter your registered email address and we&apos;ll send you instructions to reset your password.
        </p></div><form onSubmit={handleSubmit} className="space-y-4"><TextInput
    label="Email address"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="you@example.com"
    error={error || void 0}
    required
  /><Button
    type="submit"
    variant="primary"
    size="lg"
    className="w-full"
    isLoading={loading}
  >
          Send Reset Instructions
        </Button></form><div className="mt-6 text-center"><Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900"><ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link></div></div>;
}
export {
  ForgotPasswordPage as default
};
