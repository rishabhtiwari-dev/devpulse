const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'heatmap', label: 'Activity Heatmap', icon: '🗓' },
  { id: 'languages', label: 'Languages', icon: '◉' },
  { id: 'insights', label: 'AI Insights', icon: '✦' },
];

export default function Sidebar({ active, onNavigate, hasData }) {
  return (
    <aside className="w-56 min-h-screen bg-[#161b22] border-r border-[#30363d] flex flex-col py-6 px-3">
      <div className="flex items-center gap-2 px-3 mb-8">
        <span className="text-2xl">⚡</span>
        <span className="text-[#e6edf3] font-bold text-lg tracking-tight">DevPulse</span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => hasData && onNavigate(item.id)}
            disabled={!hasData}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left
              ${active === item.id
                ? 'bg-[#21262d] text-[#e6edf3] font-medium'
                : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]'
              }
              ${!hasData ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto px-3">
        <div className="text-xs text-[#484f58] leading-5">
          <div className="font-medium text-[#6e7681] mb-1">DevPulse v1.0</div>
          <div>GitHub Activity + AI Insights</div>
        </div>
      </div>
    </aside>
  );
}
