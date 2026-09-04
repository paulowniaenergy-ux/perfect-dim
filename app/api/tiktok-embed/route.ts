const tiktokHosts = new Set(['tiktok.com', 'www.tiktok.com', 'vt.tiktok.com', 'vm.tiktok.com']);

export async function GET(request: Request) {
  const source = new URL(request.url).searchParams.get('url');
  if (!source) return Response.json({ error: 'Missing URL' }, { status: 400 });

  let parsed: URL;
  try { parsed = new URL(source); } catch { return Response.json({ error: 'Invalid URL' }, { status: 400 }); }
  if (parsed.protocol !== 'https:' || !tiktokHosts.has(parsed.hostname.toLowerCase())) return Response.json({ error: 'Unsupported URL' }, { status: 400 });

  try {
    const response = await fetch(parsed, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (compatible; PerfectDim/1.0)' } });
    const resolved = new URL(response.url);
    if (!tiktokHosts.has(resolved.hostname.toLowerCase())) throw new Error('Unexpected redirect');
    const match = resolved.pathname.match(/\/video\/(\d+)/i);
    if (!match) throw new Error('Video ID unavailable');
    return Response.json({ embedUrl: `https://www.tiktok.com/embed/v2/${match[1]}` }, { headers: { 'Cache-Control': 'public, max-age=86400' } });
  } catch {
    return Response.json({ error: 'Could not resolve TikTok link' }, { status: 422 });
  }
}
