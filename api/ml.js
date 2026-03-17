export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { endpoint } = req.query;
  if (!endpoint) return res.status(400).json({ error: 'Missing endpoint' });

  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Missing token' });

  const mlUrl = 'https://api.mercadolibre.com' + decodeURIComponent(endpoint);

  try {
    const options = {
      method: req.method,
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
    };

    if (req.method === 'POST' && req.body) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(mlUrl, options);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Proxy error', detail: e.message });
  }
}
