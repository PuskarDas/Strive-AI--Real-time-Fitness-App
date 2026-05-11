import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Fitbit OAuth Routes
  app.get('/api/auth/fitbit/url', (req, res) => {
    const clientId = process.env.FITBIT_CLIENT_ID;
    const redirectUri = `${process.env.APP_URL}/auth/callback/fitbit`;
    
    if (!clientId) {
      return res.status(500).json({ error: 'FITBIT_CLIENT_ID not configured' });
    }

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      scope: 'activity heartrate location profile sleep weight',
      redirect_uri: redirectUri,
      expires_in: '604800' // 1 week
    });

    const authUrl = `https://www.fitbit.com/oauth2/authorize?${params.toString()}`;
    res.json({ url: authUrl });
  });

  app.get(['/auth/callback/fitbit', '/auth/callback/fitbit/'], async (req, res) => {
    const { code } = req.query;

    if (!code) {
      return res.send(`
        <html>
          <body>
            <script>
              window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: 'No code provided' }, '*');
              window.close();
            </script>
          </body>
        </html>
      `);
    }

    try {
      const clientId = process.env.FITBIT_CLIENT_ID;
      const clientSecret = process.env.FITBIT_CLIENT_SECRET;
      const redirectUri = `${process.env.APP_URL}/auth/callback/fitbit`;

      // Basic auth header for Fitbit
      const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

      const response = await fetch('https://api.fitbit.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          code: code as string,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          client_id: clientId!
        })
      });

      const data = await response.json();
      
      // In a real app, you'd save these tokens to a database or session
      // For this demo, we'll just signal success
      console.log('Fitbit Auth Success:', data.user_id);

      res.send(`
        <html>
          <body style="background: #050505; color: #F5F5F5; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh;">
            <div style="text-align: center;">
              <h2 style="color: #CFFF04;">STREIVE.OS Sync Active</h2>
              <p>Connection established with Fitbit. This window will close automatically.</p>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', provider: 'fitbit' }, '*');
                  setTimeout(() => window.close(), 2000);
                } else {
                  window.location.href = '/';
                }
              </script>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Fitbit exchange error:', error);
      res.status(500).send('Authentication failed');
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
