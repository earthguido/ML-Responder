export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { code, refresh_token, client_id, client_secret, redirect_uri } = req.body;

  const body = new URLSearchParams({
    client_id,
    client_secret,
    redirect_uri,
    grant_type: code ? 'authorization_code' : 'refresh_token',
    ...(code ? { code } : { refresh_token }),
  });

  const response = await fetch('https://api.mercadolibre.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
