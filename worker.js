import { createEventHandler } from '@vercel/next/edge';

export default createEventHandler({
  onRequest: async ({ request }) => {
    return new Response('Next.js on Cloudflare Workers');
  },
}); 