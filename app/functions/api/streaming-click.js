const ALLOWED_PLATFORMS = new Set([
  'spotify',
  'apple_music',
  'youtube',
  'amazon_music',
  'tidal',
  'deezer',
]);

const clean = (value, maxLength = 100) =>
  typeof value === 'string'
    ? value.trim().slice(0, maxLength)
    : '';

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const platform = clean(body.platform, 32);

    if (!ALLOWED_PLATFORMS.has(platform)) {
      return new Response(null, { status: 400 });
    }

    context.env.OWL_STREAMING_CLICKS.writeDataPoint({
      blobs: [
        'streaming_click',
        platform,
        clean(body.utm_source),
        clean(body.utm_medium),
        clean(body.utm_campaign),
      ],
      doubles: [1],
    });

    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 400 });
  }
}
