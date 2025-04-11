import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

/**
 * The DEBUG flag will do two things:
 * 1. we will skip caching on the edge, which makes it easier to debug
 * 2. we will return an error message on exception in your Response
 */
const DEBUG = false;

addEventListener('fetch', (event) => {
  try {
    event.respondWith(handleEvent(event));
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        }),
      );
    }
    event.respondWith(new Response('Internal Error', { status: 500 }));
  }
});

async function handleEvent(event) {
  const url = new URL(event.request.url);
  let options = {};

  try {
    if (DEBUG) {
      options.cacheControl = {
        bypassCache: true,
      };
    }
    
    // Get the static asset from KV
    const response = await getAssetFromKV(event, options);

    // Set cache control headers
    const headers = new Headers(response.headers);
    headers.set('X-XSS-Protection', '1; mode=block');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('Referrer-Policy', 'unsafe-url');
    headers.set('Feature-Policy', 'none');

    // Apply cache settings based on asset type
    if (url.pathname.startsWith('/_next/static')) {
      // Cache static assets for a year
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (url.pathname.includes('.')){
      // Cache other assets (images, etc.) for a week
      headers.set('Cache-Control', 'public, max-age=604800');
    } else {
      // Don't cache HTML
      headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
    }

    return new Response(response.body, {
      headers,
      status: response.status,
      statusText: response.statusText,
    });
  } catch (e) {
    // Fall back to serving the index page for any route
    if (e.message.includes('could not find')) {
      try {
        const notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: (req) => new Request(`${new URL(req.url).origin}/index.html`, req),
        });

        return new Response(notFoundResponse.body, {
          ...notFoundResponse,
          headers: {
            ...notFoundResponse.headers,
            'Cache-Control': 'public, max-age=0, must-revalidate',
          },
          status: 200,
        });
      } catch (e) {
        // If that fails too, return a simple 404
        return new Response('Not Found', { status: 404 });
      }
    } else {
      return new Response(e.message || e.toString(), { status: 500 });
    }
  }
} 