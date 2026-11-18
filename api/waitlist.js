module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  const reply = (status, message) => { res.statusCode = status; res.end(JSON.stringify({ message })); };
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return reply(405, 'Please submit the waitlist form.');
  }
  try {
    let body = req.body;
    if (!body) {
      let raw = '';
      for await (const chunk of req) {
        raw += chunk;
        if (Buffer.byteLength(raw) > 16000) return reply(413, 'Your notes are too long.');
      }
      body = JSON.parse(raw);
    }
    if (typeof body === 'string') body = JSON.parse(body);
    const contact = typeof body.contact === 'string' ? body.contact.trim() : '';
    const notes = typeof body.notes === 'string' ? body.notes.trim() : '';
    if (!contact || contact.length > 254 || notes.length > 3000) return reply(400, 'Enter your email or Instagram handle and keep notes under 3,000 characters.');
    const response = await fetch('https://docs.google.com/forms/d/e/1FAIpQLSf0v2RWBVkiSMrIHP_LemL6JMOCpvxYAY8GSbnaLVl3xMbr0Q/formResponse', {
      method: 'POST',
      body: new URLSearchParams({ 'entry.1713324163': contact, 'entry.438321500': notes }),
      signal: AbortSignal.timeout(15000)
    });
    const html = await response.text();
    if (!response.ok || !/Your response has been recorded/i.test(html)) return reply(502, 'We could not confirm your signup. Please try again shortly.');
    return reply(200, "You're on the waitlist! We'll contact you when Re-fit is ready to test.");
  } catch {
    return reply(502, 'We could not confirm your signup. Please check your connection and try again.');
  }
};
