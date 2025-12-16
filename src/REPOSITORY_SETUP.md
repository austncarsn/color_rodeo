# Repository Setup Guide

This guide walks you through publishing Color Rodeo to GitHub and deploying it to production.

## Prerequisites

- [ ] Node.js 18.18 or higher installed
- [ ] npm 9.0.0 or higher installed
- [ ] Git installed and configured
- [ ] GitHub account created
- [ ] Vercel account (optional, for deployment)

## Step 1: Update Project Metadata

Before publishing, update these files with your actual information:

### package.json
```json
{
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/color-rodeo.git"
  }
}
```

### LICENSE.txt
Replace "Color Rodeo Contributors" with your name or organization:
```
Copyright (c) 2025 Your Name
```

## Step 2: Initialize Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Color Rodeo v1.0.0"
```

## Step 3: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `color-rodeo`
3. Description: "Professional color palette management tool for designers and developers"
4. Visibility: Public (recommended) or Private
5. **Do NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 4: Push to GitHub

```bash
# Add remote origin (replace with your actual repository URL)
git remote add origin https://github.com/your-username/color-rodeo.git

# Push to main branch
git branch -M main
git push -u origin main
```

## Step 5: Set Up GitHub Repository Settings

### About Section
- **Description:** "Professional color palette management tool"
- **Website:** (add after deployment)
- **Topics:** `color-palette` `design-tools` `react` `typescript` `accessibility` `wcag` `tailwindcss`

### Repository Details
- Enable Issues (for bug reports and feature requests)
- Enable Discussions (optional, for community)
- Update README if needed

## Step 6: Install Dependencies & Test Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check
```

## Step 7: Deploy to Vercel (Recommended)

### Option A: Deploy via Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

### Option B: Deploy via Vercel Dashboard
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Click "Deploy"

### Vercel Configuration
The project includes `vercel.json` with optimized settings:
- SPA routing enabled
- Cache headers configured
- Build settings pre-configured

## Step 8: Set Up Development Tools (Optional)

### Install Recommended VSCode Extensions
The workspace includes recommended extensions in `.vscode/extensions.json`:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Error Lens
- Path Intellisense
- Auto Rename Tag
- Code Spell Checker

VSCode will prompt to install these when you open the project.

### Configure Pre-commit Hooks (Optional)
```bash
# Install husky for git hooks
npm install --save-dev husky lint-staged

# Initialize husky
npx husky init

# Add pre-commit hook
echo "npx lint-staged" > .husky/pre-commit
```

Add to `package.json`:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

## Step 9: Create GitHub Releases

### First Release (v1.0.0)
1. Go to your repository on GitHub
2. Click "Releases" → "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: `🎨 Color Rodeo v1.0.0 - Initial Release`
5. Description: Copy from `CHANGELOG.md`
6. Click "Publish release"

## Step 10: Add Deployment Badge to README

After deploying, update README.md with your deployment URL:

```markdown
## 🚀 Live Demo

**[Try Color Rodeo →](https://your-app.vercel.app)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/color-rodeo)
```

## Next Steps

### Community & Growth
- [ ] Share on Twitter/X with #webdev #design hashtags
- [ ] Post on Reddit (r/webdev, r/reactjs, r/design)
- [ ] Submit to Product Hunt
- [ ] Add to alternative to lists (Coolors.co alternative)
- [ ] Create demo video or GIF for README

### Documentation
- [ ] Add screenshots to README
- [ ] Create video tutorial
- [ ] Write blog post about the project
- [ ] Add inline code comments where needed

### Enhancements
- [ ] Set up CI/CD with GitHub Actions
- [ ] Add unit tests (Vitest)
- [ ] Add E2E tests (Playwright)
- [ ] Set up Storybook for component documentation
- [ ] Add analytics (optional)

### Maintenance
- [ ] Monitor GitHub Issues
- [ ] Respond to community feedback
- [ ] Plan feature roadmap
- [ ] Regular dependency updates

## Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Type Errors
```bash
# Run type check to see all errors
npm run type-check
```

### Git Issues
```bash
# If you need to reset
git reset --hard HEAD
git clean -fd
```

## Support

If you encounter issues:
1. Check existing GitHub Issues
2. Review documentation in `/guidelines/`
3. Create a new issue with detailed description

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/)

---

**Happy coding! 🎨✨**

For detailed contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md)
For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
