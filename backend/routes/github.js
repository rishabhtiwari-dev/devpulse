import express from 'express';

const router = express.Router();

const GH_API = 'https://api.github.com';

function ghHeaders() {
  return {
    Accept: 'application/vnd.github+json',
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  };
}

// GET /api/github/user/:username
router.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const r = await fetch(`${GH_API}/users/${username}`, { headers: ghHeaders() });
    if (!r.ok) return res.status(r.status).json({ error: 'GitHub user not found' });
    const data = await r.json();
    res.json({
      login: data.login,
      name: data.name,
      avatar_url: data.avatar_url,
      bio: data.bio,
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
      created_at: data.created_at,
      location: data.location,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/github/repos/:username
router.get('/repos/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const r = await fetch(
      `${GH_API}/users/${username}/repos?sort=pushed&per_page=20`,
      { headers: ghHeaders() }
    );
    if (!r.ok) return res.status(r.status).json({ error: 'Could not fetch repos' });
    const repos = await r.json();

    const cleaned = repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updated_at: repo.pushed_at,
      html_url: repo.html_url,
      topics: repo.topics,
    }));

    res.json(cleaned);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/github/languages/:username  — aggregate language stats across top repos
router.get('/languages/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const reposRes = await fetch(
      `${GH_API}/users/${username}/repos?sort=pushed&per_page=15`,
      { headers: ghHeaders() }
    );
    const repos = await reposRes.json();

    const langMap = {};
    await Promise.all(
      repos.map(async (repo) => {
        const lr = await fetch(`${GH_API}/repos/${username}/${repo.name}/languages`, {
          headers: ghHeaders(),
        });
        const langs = await lr.json();
        for (const [lang, bytes] of Object.entries(langs)) {
          langMap[lang] = (langMap[lang] || 0) + bytes;
        }
      })
    );

    const total = Object.values(langMap).reduce((a, b) => a + b, 0);
    const result = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percent: Math.round((bytes / total) * 100),
      }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/github/commits/:username  — recent commit activity (last 52 weeks via stats)
router.get('/activity/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Use GitHub Events API for recent activity
    const eventsRes = await fetch(
      `${GH_API}/users/${username}/events?per_page=100`,
      { headers: ghHeaders() }
    );
    const events = await eventsRes.json();

    // Build commit heatmap: { "YYYY-MM-DD": count }
    const heatmap = {};
    let totalCommits = 0;
    let streak = 0;

    for (const event of events) {
      if (event.type === 'PushEvent') {
        const date = event.created_at.split('T')[0];
        const count = event.payload?.commits?.length || 1;
        heatmap[date] = (heatmap[date] || 0) + count;
        totalCommits += count;
      }
    }

    // Calculate current streak
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      if (heatmap[key]) streak++;
      else if (i > 0) break;
    }

    res.json({ heatmap, totalCommits, streak });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
