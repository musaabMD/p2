#!/bin/bash
# Deployment script for Next.js to Cloudflare Workers

# Build the Next.js app
echo "Building Next.js app..."
npm run build

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