export function DifficultyBadge({ difficulty }) {
  const styles = {
    Easy: "bg-[#EDF4EE] text-[#426447] border-[#BCD4C2]",
    Medium: "bg-[#FAF4E8] text-[#865B20] border-[#EAD5AC]",
    Hard: "bg-[#FBF0F0] text-[#933D3D] border-[#E8BFBF]",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border tracking-tight ${
        styles[difficulty] || "bg-[#F2F0E8] text-[#575653] border-[#E6E3DB]"
      }`}
    >
      {difficulty}
    </span>
  );
}

export function StatusBadge({ status }) {
  const styles = {
    "Not Started": "bg-[#F2F0E8] text-[#716F6A] border-[#E6E3DB]",
    Attempted: "bg-[#FAF4E8] text-[#865B20] border-[#EAD5AC]",
    Solved: "bg-[#EDF4EE] text-[#426447] border-[#BCD4C2]",
    "Need Revision": "bg-[#F3EFF7] text-[#6A4A87] border-[#DACFE4]",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border tracking-tight ${
        styles[status] || "bg-[#F2F0E8] text-[#575653] border-[#E6E3DB]"
      }`}
    >
      {status}
    </span>
  );
}

export function PlatformBadge({ platform }) {
  const styles = {
    LeetCode: "bg-[#FBF3E8] text-[#9A6014] border-[#EAD5AC]",
    Codeforces: "bg-[#FBF0F0] text-[#933D3D] border-[#E8BFBF]",
    CodeChef: "bg-[#F5EFEB] text-[#7D4D2E] border-[#D9C7BC]",
    GeeksforGeeks: "bg-[#EDF4EE] text-[#396641] border-[#BCD4C2]",
    HackerRank: "bg-[#EDF4EE] text-[#32613B] border-[#BCD4C2]",
    Other: "bg-[#F2F0E8] text-[#575653] border-[#E6E3DB]",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border tracking-tight ${
        styles[platform] || "bg-[#F2F0E8] text-[#575653] border-[#E6E3DB]"
      }`}
    >
      {platform}
    </span>
  );
}

export default {
  DifficultyBadge,
  StatusBadge,
  PlatformBadge,
};
