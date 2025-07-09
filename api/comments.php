<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Responder a requests OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Dados inválidos']);
    exit();
}

$type = $input['type'] ?? '';
$data = $input['data'] ?? [];

// Validar dados
if ($type === 'comment') {
    if (empty($data['username']) || empty($data['comment']) || empty($data['rating'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Dados obrigatórios faltando']);
        exit();
    }
} elseif ($type === 'suggestion') {
    if (empty($data['username']) || empty($data['title']) || empty($data['suggestion'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Dados obrigatórios faltando']);
        exit();
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Tipo inválido']);
    exit();
}

// Configurações do GitHub
$owner = 'overpride007';
$repo = 'velino';
$githubToken = getenv('TOKEN_CLASSIC'); // Token será configurado no servidor

if (!$githubToken) {
    // Para desenvolvimento local, você pode usar um arquivo .env ou configurar diretamente
    // NUNCA faça commit do token real!
    http_response_code(500);
    echo json_encode(['error' => 'Token não configurado']);
    exit();
}

// Preparar payload para GitHub Actions
$payload = [
    'event_type' => $type === 'comment' ? 'new-comment' : 'new-suggestion',
    'client_payload' => $data
];

// Enviar para GitHub Actions via repository_dispatch
$url = "https://api.github.com/repos/{$owner}/{$repo}/dispatches";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $githubToken,
    'Accept: application/vnd.github.v3+json',
    'User-Agent: VelinoComments/1.0',
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 204) {
    echo json_encode([
        'success' => true,
        'message' => $type === 'comment' ? 'Comentário enviado com sucesso!' : 'Sugestão enviada com sucesso!'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'error' => 'Erro ao processar solicitação',
        'details' => $response
    ]);
}
?>
