function StatCard({ label, value, sub }) {
  return (
    <div className="card p-5">
      <div className="text-[#8b949e] text-xs font-medium uppercase tracking-wider mb-1">{label}</div>
      <div className="text-3xl font-bold text-[#e6edf3]">{value ?? '—'}</div>
      {sub && <div className="text-xs text-[#6e7681] mt-1">{sub}</div>}
    </div>
  );
}

function RepoCard({ repo }) {
  const langColors = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
    Java: '#b07219', 'C++': '#f34b7d', Go: '#00ADD8', Rust: '#dea584',
    HTML: '#e34c26', CSS: '#563d7c', PHP: '#4F5D95',
  };
  const color = langColors[repo.language] || '#8b949e';

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="card p-4 block hover:border-[#388bfd] transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-[#58a6ff] text-sm font-medium truncate">{repo.name}</span>
        <span className="text-[#8b949e] text-xs ml-2 shrink-0">⭐ {repo.stars}</span>
      </div>
      <p className="text-[#8b949e] text-xs line-clamp-2 mb-3">
        {repo.description || 'No description'}
      </p>
      {repo.language && (
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-[#8b949e] text-xs">{repo.language}</span>
        </div>
      )}
    </a>
  );
}

export default function Dashboard({ user, repos, activity }) {
  const joinYear = user.created_at ? new Date(user.created_at).getFullYear() : '—';

  return (
    <div>
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-8">
        <img
          src={user.avatar_url}
          alt={user.login}
          className="w-16 h-16 rounded-full border-2 border-[#30363d]"
        />
        <div>
          <h1 className="text-xl font-bold text-[#e6edf3]">{user.name || user.login}</h1>
          <div className="text-[#8b949e] text-sm">@{user.login}</div>
          {user.bio && <div className="text-[#8b949e] text-sm mt-1 max-w-md">{user.bio}</div>}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Current Streak" value={`${activity?.streak ?? 0}d`} sub="consecutive days" />
        <StatCard label="Recent Commits" value={activity?.totalCommits ?? 0} sub="last 100 events" />
        <StatCard label="Public Repos" value={user.public_repos} sub={`since ${joinYear}`} />
        <StatCard label="Followers" value={user.followers} sub={`following ${user.following}`} />
      </div>

      {/* Top repos */}
      <h2 className="text-[#e6edf3] font-semibold mb-4">Top Repositories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repos.slice(0, 6).map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
}
