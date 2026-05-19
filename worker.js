const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const key = 'opea_state';

    if (request.method === 'GET') {
      const value = await env.OPEA_KV.get(key);
      return new Response(value || '{}', {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }

    if (request.method === 'PUT') {
      const body = await request.text();
      await env.OPEA_KV.put(key, body);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }

    return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
  }
};
