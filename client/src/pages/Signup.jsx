import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import api from "../services/api";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

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
      const data = await api("/auth/signup", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (data?.requiresVerification) {
        navigate(
          `/verify-email?email=${encodeURIComponent(formData.email)}${
            data.previewCode ? `&preview=${encodeURIComponent(data.previewCode)}` : ""
          }`
        );
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
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
            Start Free
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#18181B] leading-tight">
            Build consistency that lasts through interview day.
          </h2>
          <p className="text-sm text-[#575653] leading-relaxed">
            Create your personal DevFlow workspace. Begin logging DSA problems, tracking recall confidence, and compounding your technical problem-solving skills.
          </p>

          <div className="space-y-3 pt-2 text-xs text-[#575653]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#657858]" />
              <span>Full access to DSA Tracker & Spaced Repetition</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#657858]" />
              <span>Built-in AI algorithmic explanation tools</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#657858]" />
              <span>Contest calendar and GitHub developer insights</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#8E8B82]">
          Free forever for individual engineers.
        </p>
      </div>

      {/* Right Form Column */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center sm:text-left space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
              Create your account
            </h1>
            <p className="text-xs sm:text-sm text-[#575653]">
              Join DevFlow and start tracking your preparation with editorial clarity.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-[#E8BFBF] bg-[#FBF0F0] p-3 text-xs text-[#933D3D]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ada Lovelace"
              required
            />

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
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full shadow-xs"
                loading={loading}
              >
                <span>Create Workspace</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </form>

          <div className="pt-2 text-center text-xs text-[#575653]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#18181B] hover:text-[#657858] underline underline-offset-2 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;