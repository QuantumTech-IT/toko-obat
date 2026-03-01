export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    res.setHeader(
      'Set-Cookie',
      `admin_session=1; HttpOnly; Path=/; Max-Age=${8 * 60 * 60}; SameSite=Strict`
    );
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ success: false, message: 'Username atau password salah' });
}
