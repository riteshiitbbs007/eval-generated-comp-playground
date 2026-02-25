# Deployment Guide

## GitHub Pages Deployment (Branch Method)

This project is deployed to GitHub Pages using the `gh-pages` branch method. This avoids the module resolution issues that occur with GitHub Actions.

### Current Deployment

🌐 **Live Site**: https://riteshiitbbs007.github.io/eval-generated-comp-playground/

### How It Works

1. Build the site locally: `npm run build`
2. The site is generated in the `site/` directory
3. The `site/` directory content is pushed to the `gh-pages` branch
4. GitHub Pages serves the content from the `gh-pages` branch

### To Deploy Updates

When you make changes to components or code:

```bash
# 1. Build the site locally
npm run build

# 2. Commit the built site to main
git add -f site/
git commit -m "Update site build"
git push origin main

# 3. Deploy to gh-pages branch
git subtree split --prefix site -b gh-pages-temp
git push -f origin gh-pages-temp:gh-pages
git branch -D gh-pages-temp
```

### Quick Deploy Script

You can create a deploy script to automate this:

```bash
#!/bin/bash
# deploy.sh

echo "Building site..."
npm run build

echo "Committing built site..."
git add -f site/
git commit -m "Deploy: $(date +'%Y-%m-%d %H:%M:%S')"
git push origin main

echo "Deploying to gh-pages..."
git subtree split --prefix site -b gh-pages-temp
git push -f origin gh-pages-temp:gh-pages
git branch -D gh-pages-temp

echo "✅ Deployment complete! Site will update in 1-2 minutes."
echo "🌐 https://riteshiitbbs007.github.io/eval-generated-comp-playground/"
```

### Notes

- The `site/` directory is normally in `.gitignore` but must be force-added for deployment
- GitHub Pages caching: Changes may take 5-10 minutes to appear due to CDN caching
- This method bypasses the @lwc/engine-dom resolution issue that occurs in GitHub Actions
