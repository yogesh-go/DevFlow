import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, ArrowRight, RotateCw, AlertCircle, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const initialEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState("");
  const [devPreviewCode, setDevPreviewCode] = useState(searchParams.get("preview") || "");

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => Math.max(prev - 1, 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code.trim() || code.trim().length < 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await api("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          code: code.trim(),
        }),
      });

      toast.success("Email verified successfully! Welcome to DevFlow.");
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Verification failed. Please check the code and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !email.trim()) return;

    try {
      setResending(true);
      setError("");

      const res = await api("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
      });

      toast.success("A fresh verification code has been dispatched.");
      setResendCooldown(60);
      if (res?.previewCode) {
        setDevPreviewCode(res.previewCode);
      }
    } catch (err) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-stretch bg-[#F7F6F2]">
      {/* Left Column Brand */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between border-r border-[#E6E3DB] bg-[#FAF9F5] p-12 lg:p-16">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#18181B] text-white font-mono text-xs font-bold">
            &lt;/&gt;
          </div>
          <span className="text-lg font-bold tracking-tight text-[#18181B]">
            DevFlow
          </span>
        </div>

        <div className="space-y-6 max-w-lg">
          <div className="inline-block rounded-md bg-[#EEF2EB] px-2.5 py-1 text-xs font-semibold text-[#4E5D44] border border-[#C6D2BF]">
            Account Security
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#18181B] leading-tight">
            Verify your developer account.
          </h2>
          <p className="text-sm text-[#575653] leading-relaxed">
            To ensure secure ownership of your solutions, revision history, and personal code notebooks, verify your email with the 6-digit one-time passcode.
          </p>

          <div className="space-y-3 pt-2 text-xs text-[#575653]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#657858]" />
              <span>Protects your solution code and revision logs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#657858]" />
              <span>One-time 15-minute expiration window</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#657858]" />
              <span>Zero third-party tracking or secret exposure</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#8E8B82]">
          DevFlow Security Protocol · v2.0
        </p>
      </div>

      {/* Right Form Column */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center sm:text-left space-y-1">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2EB] text-[#4E5D44] mb-2 border border-[#C6D2BF]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
              Verify your email
            </h1>
            <p className="text-xs sm:text-sm text-[#575653]">
              We've dispatched a 6-digit verification code to{" "}
              <span className="font-semibold text-[#18181B]">{email || "your email"}</span>.
            </p>
          </div>

          {devPreviewCode && (
            <div className="rounded-lg border border-[#C6D2BF] bg-[#EEF2EB] p-3 text-xs text-[#4E5D44] space-y-1">
              <p className="font-bold">Development Mode Detected:</p>
              <p>
                Verification code: <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded text-sm text-[#18181B]">{devPreviewCode}</code> (also logged in server terminal).
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-[#E8BFBF] bg-[#FBF0F0] p-3 text-xs text-[#933D3D] flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            {!initialEmail && (
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                required
              />
            )}

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#575653] mb-1.5">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                autoFocus
                className="w-full text-center font-mono text-2xl tracking-[0.4em] font-bold rounded-lg border border-[#E6E3DB] bg-white py-3 px-4 text-[#18181B] focus:border-[#657858] focus:outline-none focus:ring-2 focus:ring-[#657858]/15 placeholder:tracking-normal placeholder:font-normal placeholder:text-sm placeholder:text-[#8E8B82]"
                required
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full shadow-xs"
                loading={loading}
              >
                <span>Verify & Enter Workspace</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </form>

          {/* Resend Section */}
          <div className="pt-2 flex items-center justify-between border-t border-[#E6E3DB] text-xs">
            <span className="text-[#8E8B82]">Didn't receive the code?</span>
            <button
              type="button"
              disabled={resendCooldown > 0 || resending}
              onClick={handleResend}
              className={`inline-flex items-center gap-1 font-semibold transition-colors ${
                resendCooldown > 0 || resending
                  ? "text-[#8E8B82] cursor-not-allowed"
                  : "text-[#18181B] hover:text-[#657858] underline underline-offset-2"
              }`}
            >
              <RotateCw className={`h-3 w-3 ${resending ? "animate-spin" : ""}`} />
              <span>
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : resending
                  ? "Resending..."
                  : "Resend Code"}
              </span>
            </button>
          </div>

          <div className="text-center text-xs text-[#575653]">
            <Link
              to="/login"
              className="text-[#8E8B82] hover:text-[#18181B] transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
