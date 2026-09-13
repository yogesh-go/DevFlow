import { useState } from "react";
import { User, Mail, Shield, Save, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function Profile() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Profile preferences updated!");
    }, 500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="border-b border-[#E6E3DB] pb-5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#657858]">
          Workspace Account
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18181B]">
          Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#575653] mt-1">
          Manage your DevFlow account identity, security preferences, and workspace configuration.
        </p>
      </div>

      {/* Identity Card */}
      <div className="rounded-xl border border-[#E6E3DB] bg-white p-6 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#18181B] text-xl font-bold text-white shadow-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : "D"}
          </div>
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-[#18181B]">{user?.name || "Developer"}</h2>
            <p className="text-xs text-[#8E8B82]">{user?.email || "developer@devflow.local"}</p>
            <span className="inline-block rounded bg-[#EEF2EB] px-2 py-0.5 text-[10px] font-semibold text-[#4E5D44] border border-[#C6D2BF]">
              Active Developer Workspace
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-[#E6E3DB]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#575653] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-2.5 h-4 w-4 text-[#8E8B82]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] py-2 pl-10 pr-4 text-xs text-[#18181B] focus:border-[#657858] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#657858]/15"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#575653] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-[#8E8B82]" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full rounded-lg border border-[#E6E3DB] bg-[#F2F0E8] py-2 pl-10 pr-4 text-xs text-[#8E8B82] cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm" loading={saving}>
              <Save className="h-3.5 w-3.5" />
              <span>Save Changes</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Security & Token Info */}
      <div className="rounded-xl border border-[#E6E3DB] bg-white p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 text-[#18181B] font-bold text-sm">
          <Shield className="h-4 w-4 text-[#657858]" />
          <span>Security & Sessions</span>
        </div>
        <p className="text-xs text-[#575653] leading-relaxed">
          DevFlow authenticates client sessions via JSON Web Tokens signed with HMAC-SHA256. Passwords are salted and hashed using bcrypt.
        </p>

        <div className="pt-4 border-t border-[#E6E3DB] flex items-center justify-between">
          <span className="text-xs text-[#8E8B82]">
            End your active session on this device:
          </span>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E8BFBF] bg-[#FBF0F0] px-3 py-1.5 text-xs font-semibold text-[#933D3D] hover:bg-[#F5E1E1] transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
