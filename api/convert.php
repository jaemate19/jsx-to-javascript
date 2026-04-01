<?php
header('Content-Type: application/json');

// 🔐 Put your API key here (SAFE — backend only)
$apiKey = "";

// Get POST data
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['jsx']) || empty(trim($input['jsx']))) {
    echo json_encode(["error" => "No JSX provided"]);
    exit;
}

$jsx = $input['jsx'];

// Prepare request to DeepSeek
$data = [
    "model" => "deepseek-chat",
    "messages" => [
        [
            "role" => "system",
            "content" => "Convert JSX to vanilla JavaScript. Return ONLY code."
        ],
        [
            "role" => "user",
            "content" => $jsx
        ]
    ],
    "temperature" => 0.1
];

// cURL request
$ch = curl_init("https://api.deepseek.com/v1/chat/completions");

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $apiKey",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo json_encode(["error" => "cURL error: " . curl_error($ch)]);
    exit;
}

curl_close($ch);

// Decode API response
$result = json_decode($response, true);

if (!isset($result['choices'][0]['message']['content'])) {
    echo json_encode(["error" => "Invalid API response"]);
    exit;
}

$output = $result['choices'][0]['message']['content'];

// Return to frontend
echo json_encode([
    "converted" => trim($output),
    "tokens" => $result['usage']['total_tokens'] ?? 0
]);
