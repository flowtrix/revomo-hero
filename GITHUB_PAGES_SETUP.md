# GitHub Pages Deployment Guide

## 🚀 Quick Setup

### 1. Upload to GitHub
1. Create a new repository on GitHub named `Revomo`
2. Push your entire codebase to the repository:
```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Revomo.git
git push -u origin main
```

### 2. Enable GitHub Pages
1. Go to your repository Settings
2. Scroll to "Pages" section
3. Select "Source: GitHub Actions"
4. The workflow will automatically deploy your site

### 3. Access Your Site
Your site will be available at: `https://YOUR_USERNAME.github.io/Revomo/`

## 🔧 Important Notes

### GSAP Premium Plugins
Your code uses premium GSAP plugins:
- `DrawSVGPlugin`
- `SplitText`
- `MorphSVGPlugin`

**Options:**
1. **Purchase GSAP license** - Full functionality
2. **Use fallbacks** - Your code already includes fallback animations

### File Size Considerations
- Your `index.html` is 3.2MB (very large)
- Consider optimizing SVG content if loading is slow
- GitHub Pages has a 100MB repository limit

### Build Process
- The workflow automatically builds with Vite
- Static assets are properly handled
- GSAP is bundled correctly

## 🛠 Manual Build (Optional)

If you want to build locally:
```bash
npm install
npm run build:github
```

The built files will be in the `dist/` folder.

## ⚡ Performance Tips

1. **Optimize SVG**: Consider extracting inline SVG to separate files
2. **Image Compression**: Optimize any large images in `/public`
3. **CDN Usage**: Consider using GSAP from CDN for faster loading

## 🔍 Troubleshooting

### Site not loading?
1. Check GitHub Actions tab for build errors
2. Ensure repository name matches the base path in `vite.config.js`
3. Verify GitHub Pages is enabled in repository settings

### Animations not working?
1. Check browser console for GSAP errors
2. Premium plugins require licensing
3. Fallback animations should work without licenses
