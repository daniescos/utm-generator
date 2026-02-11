# UTM Link Generator

A lightweight, free-to-host web application for generating properly formatted UTM-parameterized links with admin-controlled field configurations and conditional dependencies.

## Features

### User Interface
✅ **No Login Required** - Users can immediately start generating UTM links
✅ **Conditional Dropdowns** - Field options change based on previous selections
✅ **Copy to Clipboard** - One-click copying of generated URLs
✅ **Dark Theme** - Modern, professional interface optimized for readability
✅ **Mobile Responsive** - Works seamlessly on all device sizes

### Admin Panel
🔒 **Password Protected** - Simple password authentication
⚙️ **Field Management** - Add, remove, and reorder UTM fields
📝 **Option Management** - Configure dropdown values for each field
🔗 **Dependency Rules** - Set conditional relationships between fields
💾 **Import/Export** - Backup and restore configurations as JSON
🔑 **Password Control** - Change admin password anytime

## Quick Start

### Prerequisites
- Node.js 20+ and npm 10+
- Modern web browser

### Installation

```bash
# Navigate to project directory
cd utm-generator

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:5173 in your browser.

### Credentials
**Admin Password:** `admin123` (change this after first login!)

## Tech Stack

- **React 19** + TypeScript
- **Vite 7** for fast builds
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **localStorage** for persistence

## Deployment

### Render (Recommended for Static Sites)
1. Create a GitHub repository and push your code
2. Create a free account at https://render.com
3. Click "New +" → "Static Site"
4. Connect your GitHub repository
5. Render will automatically detect the `render.yaml` configuration
6. Click "Create Static Site"
7. Automatic deployment on every push!

**Manual configuration (if needed):**
- Build Command: `npm run build`
- Publish Directory: `dist`

### Vercel
1. Push to GitHub
2. Connect to Vercel
3. Auto-deploy on push

### Netlify / Cloudflare Pages
1. Push to GitHub
2. Connect service
3. Deploy from `dist` folder

All platforms offer free hosting! See [DEPLOY.md](./DEPLOY.md) for detailed instructions on all platforms.

## Documentation

- [SETUP.md](./SETUP.md) - Detailed setup and troubleshooting
- See [README.md](./README.md) for full feature documentation

## License

Available for personal and commercial use.

---

Built with ❤️ for token efficiency and lightweight deployment.
