import express from 'express';
import Groq from 'groq-sdk';

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST /api/insights/analyze
// Body: { username, languages, totalCommits, streak, topRepos, recentActivity }
router.post('/analyze', async (req, res) => {
  try {
    const { username, languages, totalCommits, streak, topRepos } = req.body;

    const langSummary = (Array.isArray(languages) ? languages : [])
      .slice(0, 5)
      .map((l) => `${l.name} (${l.percent}%)`)
      .join(', ') || 'N/A';

    const repoSummary = (Array.isArray(topRepos) ? topRepos : [])
      .slice(0, 5)
      .map((r) => `${r.name} (${r.language || 'N/A'}, ⭐${r.stars})`)
      .join(', ') || 'N/A';

    const prompt = `You are a senior engineering mentor reviewing a developer's GitHub profile.

Developer: ${username}
Current streak: ${streak} days
Total recent commits: ${totalCommits}
Top languages: ${langSummary}
Notable repos: ${repoSummary}

Give 3 short, specific, actionable insights about this developer's coding patterns and habits.
Each insight should be 1-2 sentences. Format as JSON array:
[
  { "type": "strength", "insight": "..." },
  { "type": "opportunity", "insight": "..." },
  { "type": "tip", "insight": "..." }
]
Only return valid JSON. No extra text.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 400,
    });

    const raw = completion.choices[0].message.content.trim();
    const insights = JSON.parse(raw);
    res.json({ insights });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
