#!/bin/bash
# Simple deployment script for Next.js to Cloudflare Workers

# Build the Next.js app
echo "Building Next.js app..."
npm run build

# Install wrangler if not already installed
if ! command -v wrangler &> /dev/null; then
  echo "Installing wrangler..."
  npm install -g wrangler
fi

# Deploy to Cloudflare Workers
echo "Deploying to Cloudflare Workers..."
npx wrangler deploy 