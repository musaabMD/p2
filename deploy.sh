#!/bin/bash
# Deployment script for Next.js to Cloudflare Workers

# Build project
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
  
  # Add files to git
  git add .
  
  # Commit changes
  git commit -m "Fix Suspense boundary for useSearchParams in login page"
  
  # Push to main branch
  git push origin main
  
  echo "🚀 Changes pushed to GitHub. Vercel deployment should start automatically."
else
  echo "❌ Build failed. Please fix the errors before deploying."
  exit 1
fi

# Install wrangler if not already installed
if ! command -v wrangler &> /dev/null; then
  echo "Installing wrangler..."
  npm install -g wrangler
fi

# Create worker-site directory if it doesn't exist
if [ ! -d "worker-site" ]; then
  echo "Creating worker-site directory..."
  mkdir -p worker-site
fi

# Deploy to Cloudflare Workers
echo "Deploying to Cloudflare Workers..."
npx wrangler deploy --config wrangler.toml 