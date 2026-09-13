import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Shield,
  Save,
  LogOut,
  Briefcase,
  Layers,
  Sparkles,
  CheckCircle2,
  Code2,
  FolderGit2,
  Plus,
  X,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import { updateProfile } from "../services/userService";
import { getProfileAIContext } from "../services/aiService";

const POPULAR_SKILLS = [
  "React",
  "Node.js",
  "TypeScript",
  "System Design",
  "Dynamic Programming",
  "Distributed Systems",
  "PostgreSQL",
  "Docker",
  "Graph Algorithms",
  "Redis",
];

const EXPERIENCE_LEVELS = [
  "Entry Level",
  "Intermediate",
  "Senior",
  "Lead / Staff",
];

function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [targetRole, setTargetRole] = useState(user?.targetRole || "Software Engineer");
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || "Intermediate");
  const [bio, setBio] = useState(user?.bio || "");
  const [skills, setSkills] = useState(user?.skills || ["React", "Node.js", "Data Structures"]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [saving, setSaving] = useState(false);

  // DevFlow journey stats for interview prep
  const [activityStats, setActivityStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      if (user.targetRole) setTargetRole(user.targetRole);
      if (user.experienceLevel) setExperienceLevel(user.experienceLevel);
      if (user.bio !== undefined) setBio(user.bio);
      if (Array.isArray(user.skills) && user.skills.length > 0) setSkills(user.skills);
    }
  }, [user]);

  useEffect(() => {
    const fetchJourneyContext = async () => {
      try {
        setLoadingStats(true);
        const res = await getProfileAIContext();
        if (res?.data) {
          setActivityStats(res.data);
        }
      } catch (err) {
        console.warn("Could not fetch profile AI context:", err.message);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchJourneyContext();
  }, []);

  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || newSkillInput).trim();
    if (!trimmed) return;
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Skill already added");
      return;
    }
    setSkills([...skills, trimmed]);
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await updateProfile({
        name,
        targetRole,
        skills,
        experienceLevel,
        bio,
      });

      if (res?.user) {
        updateUser(res.user);
        toast.success("Profile preferences updated!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLaunchInterviewSimulation = () => {
    navigate("/ai-tools?tool=interview&source=profile");
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="border-b border-[#E6E3DB] pb-5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#657858]">
          Workspace Account
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18181B]">
          Profile & Developer Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-[#575653] mt-1">
          Configure your target role, technical skills, and workspace preferences. DevFlow uses this data to ground AI interview simulations and career audits in your actual work.
        </p>
      </div>

      {/* Main Profile Form */}
      <div className="rounded-xl border border-[#E6E3DB] bg-white p-6 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {/* User Identity Banner */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#18181B] text-xl font-bold text-white shadow-xs">
            {name ? name.charAt(0).toUpperCase() : "D"}
          </div>
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-[#18181B]">{name || "Developer"}</h2>
            <p className="text-xs text-[#8E8B82]">{user?.email || "developer@devflow.local"}</p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-block rounded bg-[#EEF2EB] px-2 py-0.5 text-[10px] font-semibold text-[#4E5D44] border border-[#C6D2BF]">
                {targetRole} · {experienceLevel}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5 pt-4 border-t border-[#E6E3DB]">
          {/* Row 1: Name & Email */}
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
                  required
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

          {/* Row 2: Target Role & Experience Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#575653] mb-1.5">
                Target Engineering Role
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-2.5 h-4 w-4 text-[#8E8B82]" />
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Full Stack Engineer, Systems Architect"
                  className="w-full rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] py-2 pl-10 pr-4 text-xs text-[#18181B] focus:border-[#657858] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#657858]/15"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#575653] mb-1.5">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] py-2 px-3 text-xs font-semibold text-[#18181B] focus:border-[#657858] focus:bg-white focus:outline-none"
              >
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bio / Career Focus */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#575653] mb-1.5">
              Professional Summary / Focus Areas
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief note on your technical background, domain focus, or target company archetypes..."
              className="w-full rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3 text-xs text-[#18181B] focus:border-[#657858] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Skills Management Section */}
          <div className="space-y-3 pt-3 border-t border-[#E6E3DB]">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#575653]">
                  Technical Skills & Technologies ({skills.length})
                </label>
                <p className="text-[11px] text-[#8E8B82]">
                  Used to personalize AI Interview questions and Resume analysis.
                </p>
              </div>
            </div>

            {/* Current Skills Tags */}
            <div className="flex flex-wrap gap-2 min-h-[36px] p-3 rounded-lg border border-[#E6E3DB] bg-[#FAF9F5]">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-[#18181B] border border-[#E6E3DB] shadow-2xs"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-[#8E8B82] hover:text-[#933D3D] transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {skills.length === 0 && (
                <span className="text-xs text-[#8E8B82] italic">
                  No skills added yet. Add your core technical competencies below.
                </span>
              )}
            </div>

            {/* Add Skill Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Type a skill (e.g. Graph Algorithms, Kubernetes) and press Add..."
                className="flex-1 rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] py-1.5 px-3 text-xs text-[#18181B] focus:border-[#657858] focus:bg-white focus:outline-none"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleAddSkill()}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Skill</span>
              </Button>
            </div>

            {/* Quick Skill Recommendations */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8B82]">
                Suggested Quick Add:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SKILLS.filter((ps) => !skills.includes(ps)).map((ps) => (
                  <button
                    key={ps}
                    type="button"
                    onClick={() => handleAddSkill(ps)}
                    className="inline-flex items-center gap-1 rounded bg-[#FAF9F5] px-2 py-0.5 text-[11px] text-[#575653] border border-[#E6E3DB] hover:border-[#657858] hover:text-[#18181B] transition-colors"
                  >
                    <Plus className="h-2.5 w-2.5 text-[#657858]" />
                    <span>{ps}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-[#E6E3DB]">
            <Button type="submit" variant="primary" size="sm" loading={saving}>
              <Save className="h-3.5 w-3.5" />
              <span>Save Changes</span>
            </Button>
          </div>
        </form>
      </div>

      {/* DevFlow Journey Activity & Intelligence Summary Card (Workflow 5) */}
      <div className="rounded-xl border border-[#C6D2BF] bg-[#F7F9F6] p-6 space-y-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D8E2D4] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF2EB] text-[#4E5D44] border border-[#C6D2BF]">
              <Sparkles className="h-4 w-4 text-[#657858]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#18181B]">
                DevFlow Activity & Interview Readiness
              </h3>
              <p className="text-[11px] text-[#575653]">
                Real-time synthesis of your coding problems, mastered patterns, and project progress.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleLaunchInterviewSimulation}
            className="shrink-0 shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            <span>Launch Journey Interview Simulation</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Solved Problems */}
          <div className="rounded-lg border border-[#E6E3DB] bg-white p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#657858]">
                Solved Challenges
              </span>
              <Code2 className="h-3.5 w-3.5 text-[#657858]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#18181B]">
                {activityStats?.solvedStats?.total ?? 0}
              </span>
              <span className="text-xs text-[#8E8B82]">problems</span>
            </div>
            <div className="flex items-center gap-1.5 pt-1 text-[10px] font-semibold">
              <span className="rounded bg-[#EDF4EE] px-1.5 py-0.5 text-[#426447]">
                {activityStats?.solvedStats?.easy ?? 0} Easy
              </span>
              <span className="rounded bg-[#FAF4E8] px-1.5 py-0.5 text-[#865B20]">
                {activityStats?.solvedStats?.medium ?? 0} Med
              </span>
              <span className="rounded bg-[#FBF0F0] px-1.5 py-0.5 text-[#933D3D]">
                {activityStats?.solvedStats?.hard ?? 0} Hard
              </span>
            </div>
          </div>

          {/* Topics Mastered */}
          <div className="rounded-lg border border-[#E6E3DB] bg-white p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#657858]">
                Mastered Topics
              </span>
              <Layers className="h-3.5 w-3.5 text-[#657858]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#18181B]">
                {activityStats?.solvedStats?.topics?.length ?? 0}
              </span>
              <span className="text-xs text-[#8E8B82]">domains</span>
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              {(activityStats?.solvedStats?.topics || []).slice(0, 3).map((t, idx) => (
                <span
                  key={idx}
                  className="rounded bg-[#FAF9F5] px-1.5 py-0.5 text-[10px] font-medium text-[#575653] border border-[#E6E3DB]"
                >
                  {t}
                </span>
              ))}
              {(activityStats?.solvedStats?.topics?.length || 0) > 3 && (
                <span className="text-[10px] text-[#8E8B82]">
                  +{activityStats.solvedStats.topics.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Projects & Tasks */}
          <div className="rounded-lg border border-[#E6E3DB] bg-white p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#657858]">
                Workspace Projects
              </span>
              <FolderGit2 className="h-3.5 w-3.5 text-[#657858]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#18181B]">
                {activityStats?.projects?.length ?? 0}
              </span>
              <span className="text-xs text-[#8E8B82]">tracked tasks</span>
            </div>
            <p className="text-[10px] text-[#575653] pt-1">
              {activityStats?.projects?.length > 0
                ? `Latest: ${activityStats.projects[0].title}`
                : "Active system tasks & milestones"}
            </p>
          </div>
        </div>

        {/* AI Grounding Notice */}
        <div className="rounded-lg border border-[#D8E2D4] bg-white p-3 text-xs text-[#3F3E3A] flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#657858] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            When you launch an interview simulation from here, questions are automatically synthesized from your listed skills ({skills.slice(0, 4).join(", ")}) and your actual solved problem topics ({activityStats?.solvedStats?.topics?.slice(0, 4).join(", ") || "General DSA"}).
          </p>
        </div>
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
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E8BFBF] bg-[#FBF0F0] px-3 py-1.5 text-xs font-semibold text-[#933D3D] hover:bg-[#F5E1E1] transition-colors cursor-pointer"
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
