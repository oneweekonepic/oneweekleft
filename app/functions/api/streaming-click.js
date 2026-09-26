const clean = (value, maxLength = 100) =>
  typeof value === 'string'
    ? value.trim().slice(0, maxLength)
    : '';

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const platform = clean(body.platform, 32);

    if (!/^[a-z0-9_-]{1,32}$/.test(platform)) {
      return new Response(null, { status: 400 });
    }

    context.env.OWL_STREAMING_CLICKS.writeDataPoint({
      blobs: [
        'streaming_click',
        platform,
        clean(body.utm_source),
        clean(body.utm_medium),
        clean(body.utm_campaign),
        clean(context.request.cf?.country) || 'unknown',
        clean(context.request.cf?.city) || 'unknown',
        clean(body.utm_content),
        clean(body.language, 10),
        clean(body.link_type, 20),
        clean(body.device, 20),
      ],
      doubles: [1],
    });

    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 400 });
  }
}
