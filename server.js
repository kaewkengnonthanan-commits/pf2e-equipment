require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL = 'llama-3.3-70b-versatile'; // Groq free tier

async function askAI(prompt) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 6000,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

// ── /api/equipment ──────────────────────────────────────────────
app.post('/api/equipment', async (req, res) => {
  const { category = '' } = req.body;
  const categoryLabel = category ||
    'general equipment (mix of weapons, armor, alchemical, consumables, held items, worn items, wands, scrolls, adventuring gear, magical items)';

  const prompt = `You are a Pathfinder 2nd Edition expert with complete knowledge of Archives of Nethys (aonprd.com).
Generate exactly 40 real ${categoryLabel} items from Pathfinder 2nd Edition. Include diverse levels (0-20) and rarities (Common, Uncommon, Rare, Unique).
Return ONLY a valid JSON array. No markdown. No explanation. No code fences. Start with [ and end with ]:
[{"name":"Item Name","level":1,"price":"10 gp","rarity":"Common","category":"Category","type":"Subcategory","bulk":"L","traits":["trait1"],"desc":"Description.","usage":"held in one hand","source":"Core Rulebook"}]`;

  try {
    let text = await askAI(prompt);
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('No JSON array found in response');
    const items = JSON.parse(match[0]);
    res.json({ success: true, items, count: items.length });
  } catch (err) {
    console.error('Equipment error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── /api/item-detail ────────────────────────────────────────────
app.post('/api/item-detail', async (req, res) => {
  const { name, category } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });

  const prompt = `You are a Pathfinder 2nd Edition expert. Give full details for PF2E item: "${name}" (category: ${category || 'equipment'}).
Return ONLY valid JSON. No markdown. No code fences:
{"name":"${name}","level":0,"price":"","rarity":"Common","category":"","type":"","bulk":"","traits":[],"usage":"","source":"","activate":"","desc":"Full description with all rules text, activation, effects, and special properties."}`;

  try {
    let text = await askAI(prompt);
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON object found');
    const detail = JSON.parse(match[0]);
    res.json({ success: true, detail });
  } catch (err) {
    console.error('Detail error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🗡️  PF2E Equipment Browser → http://localhost:${PORT}`);
  console.log(`🤖  Using: Llama 3.3 70B via Groq (Free)\n`);
});
