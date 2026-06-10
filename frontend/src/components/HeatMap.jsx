function getColor(count) {
  if (!count) return '#161b22';
  if (count <= 2) return '#0e4429';
  if (count <= 5) return '#006d32';
  if (count <= 9) return '#26a641';
  return '#39d353';
}

function buildGrid(heatmap) {
  const today = new Date();
  const cells = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    cells.push({ date: key, count: heatmap?.[key] || 0 });
  }
  // Pad start to Sunday
  const firstDay = new Date(cells[0].date).getDay();
  const padded = Array(firstDay).fill(null).concat(cells);
  // Split into weeks
  const weeks = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }
  return weeks;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['Sun','Mon','','Wed','','Fri',''];

export default function HeatMap({ activity, username }) {
  const weeks = buildGrid(activity?.heatmap);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#e6edf3] font-semibold text-lg">Activity Heatmap</h2>
        <span className="text-[#8b949e] text-sm">{activity?.totalCommits ?? 0} commits in the last year</span>
      </div>

      <div className="card p-6 overflow-x-auto">
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-1 pt-6">
            {DAYS.map((d, i) => (
              <div key={i} className="text-[10px] text-[#6e7681] h-[11px] leading-none">{d}</div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              <div className="text-[10px] text-[#6e7681] h-4 leading-none text-center">
                {/* show month label on first day of month */}
                {week[0] && new Date(week[0].date).getDate() <= 7
                  ? MONTHS[new Date(week[0].date).getMonth()]
                  : ''}
              </div>
              {week.map((cell, di) =>
                cell === null ? (
                  <div key={di} className="w-[11px] h-[11px]" />
                ) : (
                  <div
                    key={di}
                    title={`${cell.date}: ${cell.count} commit${cell.count !== 1 ? 's' : ''}`}
                    className="heatmap-cell w-[11px] h-[11px] cursor-default"
                    style={{ backgroundColor: getColor(cell.count) }}
                  />
                )
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 justify-end">
          <span className="text-[10px] text-[#6e7681]">Less</span>
          {['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'].map((c) => (
            <div key={c} className="w-[11px] h-[11px] rounded-sm" style={{ backgroundColor: c, border: '1px solid #30363d' }} />
          ))}
          <span className="text-[10px] text-[#6e7681]">More</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="text-[#8b949e] text-xs uppercase tracking-wider mb-1">Current Streak</div>
          <div className="text-2xl font-bold text-[#39d353]">{activity?.streak ?? 0} days</div>
        </div>
        <div className="card p-4">
          <div className="text-[#8b949e] text-xs uppercase tracking-wider mb-1">Active Days</div>
          <div className="text-2xl font-bold text-[#e6edf3]">
            {Object.keys(activity?.heatmap || {}).length}
          </div>
        </div>
      </div>
    </div>
  );
}
