#!/bin/bash
# Test building the Next.js app locally

# Build the Next.js app
echo "Building Next.js app..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
  echo "Your Next.js app was built successfully."
else
  echo "❌ Build failed!"
  echo "Check the error messages above for details."
  exit 1
fi

# List the output directories to verify
echo "Checking output directories..."
if [ -d "./.next" ]; then
  echo "✅ .next directory exists"
  ls -la ./.next
else
  echo "❌ .next directory not found"
  exit 1
fi

echo "Build test completed successfully." 