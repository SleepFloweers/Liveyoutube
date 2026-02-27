<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
function checkLive($channelUrl) {

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $channelUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT,
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
    );

    $html = curl_exec($ch);
    curl_close($ch);

    if (!$html) return ["live" => false];

    // CEK isLive:true
    if (strpos($html, '"scheduledStartTime"') !== false) {

        return ["live" => false];
    }else
    if (strpos($html, '"isLive":true') !== false) {

        if (preg_match('/"videoId":"([^"]+)"/', $html, $matches)) {
            return [
                "live" => true,
                "videoId" => $matches[1]
            ];
        }
    }

    return ["live" => false];
}

if (!isset($_GET['url'])) {
    echo json_encode(["error" => "No URL"]);
    exit;
}

$url = $_GET['url'];
$result = checkLive($url);

header("Content-Type: application/json");

if ($result["live"]) {

    echo json_encode([
        "live" => true,
        "embed" => "https://www.youtube.com/embed/" . $result["videoId"],
        "channel" => str_replace("/live", "", $url)
    ]);

} else {

    echo json_encode([
        "live" => false,
        "channel" => str_replace("/live", "", $url)
    ]);
}