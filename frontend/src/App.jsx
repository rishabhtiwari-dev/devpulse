import { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import HeatMap from './components/HeatMap.jsx';
import LanguageChart from './components/LanguageChart.jsx';
import AIInsights from './components/AIInsights.jsx';
import { fetchUser, fetchRepos, fetchLanguages, fetchActivity, fetchInsights } from './api/client.js';

const SCREENS = ['dashboard', 'heatmap', 'languages', 'insights'];

export default function App() {
  const [username, setUsername] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [screen, setScreen] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [activity, setActivity] = useState(null);
  const [insights, setInsights] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setLoading(true);
    setError('');
    setInsights(null);
    try {
      const [u, r, l, a] = await Promise.all([
        fetchUser(inputVal.trim()),
        fetchRepos(inputVal.trim()),
        fetchLanguages(inputVal.trim()),
        fetchActivity(inputVal.trim()),
      ]);
      setUser(u.data);
      setRepos(r.data);
      setLanguages(l.data);
      setActivity(a.data);
      setUsername(inputVal.trim());
      setScreen('dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'GitHub user not found');
    } finally {
      setLoading(false);
    }
  }

  async function loadInsights() {
    if (!user || insights) return;
    try {
      const res = await fetchInsights({
        username: user.login,
        languages,
        totalCommits: activity?.totalCommits || 0,
        streak: activity?.streak || 0,
        topRepos: repos.slice(0, 5),
      });
      setInsights(res.data.insights);
    } catch {
      setInsights([{ type: 'error', insight: 'Could not load AI insights. Check your OpenAI key.' }]);
    }
  }

  function handleScreenChange(s) {
    setScreen(s);
    if (s === 'insights') loadInsights();
  }

  return (
    <div className="flex min-h-screen bg-[#0d1117]">
      <Sidebar
        active={screen}
        onNavigate={handleScreenChange}
        hasData={!!user}
      />

      <main className="flex-1 p-6 overflow-y-auto">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8 max-w-lg">
          <input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Enter GitHub username..."
            className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2.5 text-sm text-[#e6edf3] placeholder-[#6e7681] focus:outline-none focus:border-[#388bfd]"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Analyze'}
          </button>
        </form>

        {error && (
          <div className="mb-6 px-4 py-3 bg-[#3d1919] border border-[#f85149] rounded-lg text-[#f85149] text-sm">
            {error}
          </div>
        )}

        {!user && !loading && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-6xl mb-4">⚡</div>
            <h2 className="text-xl font-semibold text-[#e6edf3] mb-2">Welcome to DevPulse</h2>
            <p className="text-[#8b949e] text-sm">Enter any GitHub username to see their activity dashboard</p>
          </div>
        )}

        {user && screen === 'dashboard' && (
          <Dashboard user={user} repos={repos} activity={activity} />
        )}
        {user && screen === 'heatmap' && (
          <HeatMap activity={activity} username={user.login} />
        )}
        {user && screen === 'languages' && (
          <LanguageChart languages={languages} />
        )}
        {user && screen === 'insights' && (
          <AIInsights insights={insights} user={user} />
        )}
      </main>
    </div>
  );
}
