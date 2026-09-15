import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, Eye, EyeOff } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import GoogleAuthButton from "../components/ui/GoogleAuthButton";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes("verify your email")) {
        navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      } else {
        setError(err.message || "Failed to sign in. Please verify your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential) => {
    setError("");
    setLoading(true);
    try {
      const data = await api("/auth/google", {
        method: "POST",
        body: JSON.stringify({ credential }),
      });

      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Google authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-stretch bg-[#F7F6F2]">
      {/* Left Editorial Brand Column (Hidden on mobile) */}
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
            Developer Workspace
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#18181B] leading-tight">
            Stop losing solutions to memory decay.
          </h2>
          <p className="text-sm text-[#575653] leading-relaxed">
            DevFlow structures your algorithmic preparation around automated spaced repetition intervals, technical notes, and deep pattern recall.
          </p>

          <div className="space-y-3 pt-2 text-xs text-[#575653]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#657858]" />
              <span>Scientific 1, 3, 7, 15, 30 day revision queue</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#657858]" />
              <span>Clean Markdown technical notebook & code snippets</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#657858]" />
              <span>GitHub-style contribution analytics and streak tracking</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#8E8B82]">
          Designed with restraint for focused engineers.
        </p>
      </div>

      {/* Right Form Column */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center sm:text-left space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
              Sign in to your workspace
            </h1>
            <p className="text-xs sm:text-sm text-[#575653]">
              Welcome back. Enter your credentials to access your dashboard.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-[#E8BFBF] bg-[#FBF0F0] p-3 text-xs text-[#933D3D]">
              {error}
            </div>
          )}

          {/* Google Authentication */}
          <div className="space-y-4">
            <GoogleAuthButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              disabled={loading}
              text="signin_with"
            />

            <div className="relative flex items-center justify-center my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E6E3DB]" />
              </div>
              <span className="relative bg-[#F7F6F2] px-3 text-[11px] uppercase tracking-wider text-[#8E8B82] font-medium">
                or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="developer@example.com"
              required
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-[#8E8B82] hover:text-[#18181B] focus:outline-none focus:text-[#18181B] transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  tabIndex={0}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              }
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full shadow-xs"
                loading={loading}
              >
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </form>

          <div className="pt-2 text-center text-xs text-[#575653]">
            Don't have an account yet?{" "}
            <Link
              to="/signup"
              className="font-semibold text-[#18181B] hover:text-[#657858] underline underline-offset-2 transition-colors"
            >
              Create free workspace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;