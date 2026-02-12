import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const CONFIG_PATH = join(__dirname, 'public', 'config.json');

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

// API endpoint to save configuration
app.post('/api/config/save', (req, res) => {
  try {
    const config = req.body;

    // Validate basic structure
    if (!config.fields || !Array.isArray(config.fields)) {
      return res.status(400).json({ error: 'Invalid config: missing fields array' });
    }
    if (!config.dependencies || !Array.isArray(config.dependencies)) {
      return res.status(400).json({ error: 'Invalid config: missing dependencies array' });
    }
    if (typeof config.adminPassword !== 'string') {
      return res.status(400).json({ error: 'Invalid config: missing adminPassword' });
    }

    // Write to config.json
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');

    res.json({ success: true, message: 'Configuration saved successfully' });
  } catch (error) {
    console.error('Error saving config:', error);
    res.status(500).json({ error: 'Failed to save configuration' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ UTM Generator server running on port ${PORT}`);
  console.log(`   Local: http://localhost:${PORT}`);
});
