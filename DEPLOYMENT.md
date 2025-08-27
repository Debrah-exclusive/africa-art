# Deployment Guide for African Art Timeline

This guide will help you deploy the African Art Timeline website to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free)
- Git installed on your computer

## Step-by-Step Deployment

### 1. Prepare Your Repository

1. **Initialize Git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: African Art Timeline website"
   ```

2. **Create a GitHub repository**:
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it `african-art-timeline`
   - Make it public
   - Don't initialize with README (we already have one)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/yourusername/african-art-timeline.git
   git branch -M main
   git push -u origin main
   ```

### 2. Deploy to Vercel

1. **Sign up for Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Sign up"
   - Choose "Continue with GitHub"
   - Authorize Vercel to access your GitHub account

2. **Import your project**:
   - Click "New Project" on your Vercel dashboard
   - Find your `african-art-timeline` repository
   - Click "Import"

3. **Configure deployment**:
   - **Project Name**: `african-art-timeline` (or your preferred name)
   - **Framework Preset**: Other (static site)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: Leave empty (static site)
   - **Output Directory**: Leave empty (static site)
   - **Install Command**: Leave empty (no dependencies)

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete (usually 1-2 minutes)
   - Your site will be available at `https://your-project-name.vercel.app`

### 3. Custom Domain (Optional)

If you want to use a custom domain:

1. Go to your project dashboard on Vercel
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow Vercel's instructions to configure DNS

### 4. Automatic Deployments

Vercel automatically deploys when you push to your main branch:

```bash
# Make changes to your files
git add .
git commit -m "Update: description of changes"
git push origin main
```

Your site will automatically redeploy with the changes.

## Project Configuration Files

The following files are included for optimal Vercel deployment:

### `vercel.json`
- Configures static file serving
- Sets up proper routing for SPA behavior
- Optimizes caching headers

### `package.json`
- Defines project metadata
- Specifies Node.js version requirements
- Includes development scripts

### `.gitignore`
- Excludes unnecessary files from version control
- Prevents sensitive data from being committed

## Troubleshooting

### Common Issues

1. **404 errors on page refresh**:
   - The `vercel.json` file should handle this with proper routing
   - Ensure all HTML files are in the root directory

2. **CSS/JS files not loading**:
   - Check that file paths are relative (no leading slash)
   - Verify all files are committed to Git

3. **Build fails**:
   - Ensure no build command is specified (static site)
   - Check that all files are properly formatted

### Getting Help

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [GitHub Issues](https://github.com/yourusername/african-art-timeline/issues)

## Performance Optimization

The site is optimized for Vercel with:

- **Static file caching**: Long-term caching for assets
- **HTML caching**: Short-term caching for dynamic content
- **Gzip compression**: Automatic compression by Vercel
- **CDN delivery**: Global content delivery network

## Security

- All files are served over HTTPS
- No sensitive data is exposed in the frontend
- Vercel provides automatic security headers

Your African Art Timeline website is now ready for the world to explore! 🌍✨