export async function GET(request) {

    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
        return new Response(JSON.stringify({ live: false }), { status: 400 });
    }

    try {

        const response = await fetch(url + "/live", {
            headers: { "User-Agent": "Mozilla/5.0" }
        });

        const html = await response.text();

        if (html.includes('"scheduledStartTime"')) {
            return new Response(JSON.stringify({ live: false }), { status: 200 });
        }

        if (html.includes('"isLive":true')) {

            const match = html.match(/"videoId":"(.*?)"/);

            if (match && match[1]) {
                return new Response(
                    JSON.stringify({
                        live: true,
                        embed: `https://www.youtube.com/embed/${match[1]}`,
                        channel: url
                    }),
                    { status: 200 }
                );
            }
        }

        return new Response(JSON.stringify({ live: false }), { status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({ live: false }), { status: 500 });
    }
}