const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const API_KEY = process.env.GEMINI_API_KEY;

app.post('/api/chat', async (req, res) => {
  const { history, system } = req.body;
  const messages = [
    { role: 'system', content: system },
    ...history.map(m => ({
      role: m.role === 'model' ? 'assistant' : 'user',
      content: m.parts[0].text
    }))
  ];
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        max_tokens: 1024,
        temperature: 0.7
      })
    });
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response.';
    res.json({ reply });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`UI Navigator Agent running at http://localhost:${PORT}`);
});