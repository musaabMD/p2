// Simple worker script for serving a Next.js app on Cloudflare Workers
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Serve static assets if path starts with /_next/static
  if (url.pathname.startsWith('/_next/static')) {
    // Serve from the static site bucket
    const path = url.pathname;
    return new Response(`Would serve static asset from: ${path}`, {
      headers: { 'Content-Type': 'text/plain' },
    });
  }
  
  // For all other routes, serve the Next.js app
  return new Response('Next.js on Cloudflare Workers', {
    headers: { 'Content-Type': 'text/plain' },
  });
} 