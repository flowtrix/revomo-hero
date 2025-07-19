# GitHub Pages Deployment Guide for Revomo Hero

## 🚀 Complete Step-by-Step Setup

### Prerequisites
- GitHub account
- Git installed on your computer
- Node.js and pnpm installed

### Step 1: Prepare Your Local Repository
First, make sure your local branch is up to date:

```bash
# Pull the latest changes (your branch is currently behind by 2 commits)
git pull origin main

# Verify everything is clean
git status
```

### Step 2: Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and create a new repository
2. **Repository name**: `revomo-hero` (must match your local folder name)
3. **Visibility**: Public (required for free GitHub Pages)
4. **DO NOT** initialize with README, .gitignore, or license (you already have these)
5. Click "Create repository"

### Step 3: Connect Local Repository to GitHub
If you haven't already connected your local repo to GitHub:

```bash
# Add GitHub as remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/revomo-hero.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

If you already have a remote set up, just push:
```bash
git push origin main
```

### Step 4: Configure GitHub Pages
1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **"GitHub Actions"**
5. The workflow will automatically trigger and deploy your site

### Step 5: Monitor Deployment
1. Go to the **Actions** tab in your repository
2. You should see a "Deploy to GitHub Pages" workflow running
3. Wait for it to complete (usually takes 2-3 minutes)
4. Once complete, your site will be live at: `https://YOUR_USERNAME.github.io/revomo-hero/`

## 🔧 Technical Details

### Build Configuration
Your project is already configured for GitHub Pages:
- **Vite Config**: Automatically sets correct base path for production
- **GitHub Actions**: Workflow builds and deploys automatically
- **Multi-page Setup**: Supports multiple HTML files (index, footer, circular-particles)

### Package Manager Note
⚠️ **Important**: Your project uses `pnpm` but the GitHub Actions workflow uses `npm`. This might cause dependency issues. Let's fix this:

The workflow should be updated to use pnpm for consistency. The current setup will work, but using pnpm would be more reliable.

### GSAP Premium Plugins
Your project uses premium GSAP plugins:
- `DrawSVGPlugin`
- `SplitText`
- `MorphSVGPlugin`

**For Production**:
1. **Option 1**: Purchase GSAP license for full functionality
2. **Option 2**: Your code includes fallback animations that work without premium plugins

## 🛠 Local Development & Testing

### Run Development Server
```bash
pnpm dev
```
Your site will be available at `http://localhost:5173`

### Build and Preview Locally
```bash
# Build for GitHub Pages
pnpm run build:github

# Preview the built site
pnpm run preview
```

### Test GitHub Pages Build Locally
```bash
# Build with production settings
NODE_ENV=production pnpm run build:github

# The built files will be in ./dist/
# You can serve this folder to test exactly what will be deployed
```

## ⚡ Performance Optimization

### Current Status
- Your `index.html` is quite large (~3.2MB)
- Contains extensive inline SVG content
- GSAP animations and plugins

### Optimization Tips
1. **SVG Optimization**: Consider extracting large SVGs to separate files
2. **Image Compression**: Optimize any images in `/public` folder
3. **Code Splitting**: Vite automatically splits GSAP into separate chunks
4. **CDN Option**: For faster loading, consider GSAP CDN (but requires license for premium plugins)

## 🔍 Troubleshooting

### Deployment Issues
**Site not deploying?**
1. Check **Actions** tab for build errors
2. Ensure repository is public
3. Verify GitHub Pages is enabled in Settings > Pages
4. Make sure the workflow has proper permissions

**Build failing?**
1. Check if all dependencies are in `package.json`
2. Verify Node.js version compatibility (workflow uses Node 18)
3. Look for any missing files or broken imports

**Site loading but animations broken?**
1. Check browser console for GSAP errors
2. Premium plugins require valid licenses
3. Fallback animations should work regardless

### Common Fixes
```bash
# Clear local build cache
rm -rf dist node_modules
pnpm install
pnpm run build:github

# Force push if needed (be careful!)
git push --force-with-lease origin main
```

## 🎯 What Happens Next

1. **Automatic Deployments**: Every push to `main` branch triggers a new deployment
2. **Live Updates**: Changes appear on your GitHub Pages site within 2-3 minutes
3. **Multiple Pages**: All your HTML files (`index.html`, `footer.html`, `circular-particles.html`) will be accessible

### Your Live URLs
- Main page: `https://YOUR_USERNAME.github.io/revomo-hero/`
- Footer demo: `https://YOUR_USERNAME.github.io/revomo-hero/footer.html`
- Circular particles: `https://YOUR_USERNAME.github.io/revomo-hero/circular-particles.html`

## 📝 Next Steps

1. **Push your latest changes** (you're currently 2 commits behind)
2. **Create the GitHub repository** with exact name `revomo-hero`
3. **Enable GitHub Pages** with GitHub Actions source
4. **Wait for deployment** and test your live site
5. **Consider GSAP licensing** for premium features

Your site should be live and working within 5 minutes of completing these steps!

## 🆘 Need Help?

If you encounter any issues:
1. Check the GitHub Actions logs for specific error messages
2. Verify all file paths are correct in your HTML files
3. Test the build locally first with `pnpm run build:github`
4. Ensure your repository name matches the base path in `vite.config.js`

---

**Ready to deploy? Follow the steps above and your Revomo Hero site will be live on GitHub Pages!** 🚀
