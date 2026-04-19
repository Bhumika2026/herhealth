const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/chat', protect, async (req, res) => {
  try {
    const { messages, userContext } = req.body;

    const systemPrompt = `You are Sakhi, a warm, knowledgeable Indian women's health companion on the HerHealth app. You specialize in menstrual cycle health, Ayurvedic remedies, Indian diet and nutrition, PCOS thyroid endometriosis management, mental wellness, and natural home remedies. User context: ${JSON.stringify(userContext)}. Always give practical compassionate advice. Include Indian dietary tips when relevant. Keep responses concise 3-4 sentences max. Always remind users to consult a doctor for serious concerns.`;

    const response = await fetch('https://api.sambanova.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SAMBANOVA_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'Meta-Llama-3.1-8B-Instruct',
        max_tokens: 400,
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'I could not process that. Please try again.';
    res.json({ success: true, reply });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;