#!/bin/bash

# Make sure we're in the project directory
cd "$(dirname "$0")"

# Test build locally first
echo "🔍 Testing build locally..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
  
  # Add files to git
  git add app/login/page.js
  git add middleware.js
  git add app/api/auth/login/route.js
  
  # Commit changes
  git commit -m "Fix auth issues: update login page and add dedicated API route"
  
  # Push to main branch
  git push origin main
  
  echo "🚀 Changes pushed to GitHub. Vercel deployment should start automatically."
  echo "🔒 Login should now work with password: 1988@1988"
else
  echo "❌ Build failed. Please fix the errors before deploying."
  exit 1
fi 