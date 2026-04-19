async function callSakhi(messages, userContext) {
  try {
    const token = localStorage.getItem('hh_token');
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/sakhi/chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ messages, userContext }),
      }
    );
    const data = await response.json();
    return data.reply || 'I could not process that. Please try again.';
  } catch {
    return 'Network error. Please check your connection and try again.';
  }
}