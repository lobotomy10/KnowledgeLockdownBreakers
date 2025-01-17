import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createServer() {
  const app = express();
  const isProd = process.env.NODE_ENV === 'production';
  const distPath = join(__dirname, 'dist');

  // Health check endpoint
  app.get('/healthz', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  if (isProd) {
    // Serve static files from dist with proper caching
    app.use(express.static(distPath, {
      maxAge: '1h',
      etag: true,
      lastModified: true,
    }));
    
    // Handle all routes by serving index.html
    app.get('*', (req, res, next) => {
      // Skip API routes
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(join(distPath, 'index.html'));
    });
  } else {
    // Create Vite server in middleware mode for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    
    app.use(vite.middlewares);
  }

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Mode: ${isProd ? 'production' : 'development'}`);
  });
}

createServer().catch(console.error);
