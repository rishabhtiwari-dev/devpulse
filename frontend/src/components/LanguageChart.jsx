import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const COLORS = [
  '#58a6ff', '#3fb950', '#d2a8ff', '#ffa657', '#ff7b72',
  '#79c0ff', '#56d364', '#f0883e', '#a5d6ff', '#7ee787',
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-xs">
        <div className="font-medium text-[#e6edf3]">{d.name}</div>
        <div className="text-[#8b949e]">{d.percent}% of codebase</div>
      </div>
    );
  }
  return null;
};

export default function LanguageChart({ languages }) {
  if (!languages?.length) {
    return <div className="text-[#8b949e]">No language data available.</div>;
  }

  return (
    <div>
      <h2 className="text-[#e6edf3] font-semibold text-lg mb-6">Language Breakdown</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart */}
        <div className="card p-6">
          <h3 className="text-[#8b949e] text-sm mb-4">Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={languages}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={3}
                dataKey="percent"
              >
                {languages.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart */}
        <div className="card p-6">
          <h3 className="text-[#8b949e] text-sm mb-4">Bytes Written</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={languages} layout="vertical" margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#21262d" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: '#8b949e', fontSize: 12 }}
                width={80}
              />
              <Tooltip
                formatter={(v, n, p) => [`${p.payload.percent}%`, p.payload.name]}
                contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8 }}
                labelStyle={{ color: '#8b949e' }}
              />
              <Bar dataKey="bytes" radius={[0, 4, 4, 0]}>
                {languages.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Language legend list */}
      <div className="card p-5 mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {languages.map((lang, i) => (
            <div key={lang.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-[#e6edf3] text-sm truncate">{lang.name}</span>
              <span className="text-[#6e7681] text-xs ml-auto">{lang.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
