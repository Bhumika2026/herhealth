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

console.log('SambaNova response status:', response.status);
const rawData = await response.text();
console.log('SambaNova raw response:', rawData);
const data = JSON.parse(rawData);
const reply = data.choices?.[0]?.message?.content || 'I could not process that. Please try again.';
res.json({ success: true, reply });