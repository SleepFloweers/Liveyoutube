export const dynamic = "force-dynamic";

export async function GET(request) {

    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
        return new Response(
            JSON.stringify({ live:false, error:"missing_url" }),
            { status:400 }
        );
    }

    try {

        const api = await fetch(
            "https://arizuproject.my.id/nocturnnoir/check_live.php?url=" +
            encodeURIComponent(url),
            {
                headers:{
                    "User-Agent":"Mozilla/5.0"
                },
                cache:"no-store"
            }
        );

        const data = await api.json();

        return new Response(JSON.stringify(data),{
            status:200,
            headers:{
                "Content-Type":"application/json"
            }
        });

    } catch (err) {

        return new Response(
            JSON.stringify({
                live:false,
                error:"bridge_failed"
            }),
            { status:500 }
        );

    }

}