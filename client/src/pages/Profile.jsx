import { useState } from "react";
import { User, Mail, Shield, Calendar, LogOut, Save, Key } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";

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
    }, 600);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Developer Profile & Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your DevFlow account identity and workspace preferences.
        </p>
      </div>

      {/* Identity Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-2xl font-bold text-white shadow-lg shadow-blue-600/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : "D"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name || "Developer"}</h2>
            <p className="text-xs text-slate-400">{user?.email || "developer@devflow.local"}</p>
            <span className="mt-1 inline-block rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
              Verified Developer Account
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-10 pr-4 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/60 py-2 pl-10 pr-4 text-sm text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" loading={saving} size="sm">
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Security & Token Info */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Shield className="h-5 w-5 text-blue-400" />
          <span>Security & Authentication</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          DevFlow authenticates all client requests using stateless JSON Web Tokens signed with HMAC-SHA256. Passwords are salted and hashed using bcrypt (10 rounds).
        </p>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">End your current session across this browser:</span>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
