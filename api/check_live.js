export async function GET(request) {

    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
        return new Response(JSON.stringify({ live: false }), { status: 400 });
    }

    try {

        const response = await fetch(url + "/live?hl=id&gl=ID", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
                "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7"
            }
        });;

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