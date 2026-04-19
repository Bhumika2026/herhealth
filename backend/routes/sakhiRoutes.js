const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/chat', protect, async (req, res) => {
  try {
    const { messages, userContext } = req.body;

    const systemPrompt = `You are Sakhi, a warm knowledgeable Indian women health companion on HerHealth app. You specialize in menstrual cycle health, Ayurvedic remedies, Indian diet and nutrition, PCOS thyroid endometriosis management, mental wellness, and natural home remedies. User context: ${JSON.stringify(userContext)}. Keep responses concise 3-4 sentences. Always remind users to consult a doctor for serious concerns.`;

    const response = await fetch('https://api.sambanova.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SAMBANOVA_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'Meta-Llama-3.3-70B-Instruct',
        max_tokens: 400,
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
      }),
    });

    console.log('SambaNova status:', response.status);
    const rawData = await response.text();
    console.log('SambaNova response:', rawData);

    const data = JSON.parse(rawData);
    const reply = data.choices?.[0]?.message?.content || 'I could not process that. Please try again.';
    res.json({ success: true, reply });

  } catch (err) {
    console.error('Sakhi error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;