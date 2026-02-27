export default async function handler(req, res) {

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ live: false });
    }

    try {

        const response = await fetch(url + "/live", {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const html = await response.text();

        // Kalau ada scheduledStartTime → OFFLINE
        if (html.includes('"scheduledStartTime"')) {
            return res.status(200).json({ live: false });
        }

        // Kalau ada isLive:true
        if (html.includes('"isLive":true')) {

            const match = html.match(/"videoId":"(.*?)"/);

            if (match && match[1]) {
                return res.status(200).json({
                    live: true,
                    embed: `https://www.youtube.com/embed/${match[1]}`,
                    channel: url
                });
            }
        }

        return res.status(200).json({ live: false });

    } catch (err) {
        return res.status(500).json({ live: false });
    }
}