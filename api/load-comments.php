<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Responder a requests OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$githubToken = getenv('TOKEN_CLASSIC');

if (!$githubToken) {
    // Para desenvolvimento, retornar comentários de exemplo
    echo json_encode([
        'success' => true,
        'comments' => [
            [
                'author' => 'Maria Santos',
                'text' => 'Excelente projeto! A interface é muito intuitiva e fácil de usar. ⭐⭐⭐⭐⭐',
                'date' => '2025-07-08'
            ],
            [
                'author' => 'Pedro Silva', 
                'text' => 'Muito bom! Algumas funcionalidades poderiam ser melhoradas, mas no geral está ótimo. ⭐⭐⭐⭐',
                'date' => '2025-07-07'
            ],
            [
                'author' => 'Ana Costa',
                'text' => 'Adorei o design! Muito moderno e responsivo. Parabéns pela implementação! ⭐⭐⭐⭐⭐',
                'date' => '2025-07-06'
            ]
        ]
    ]);
    exit();
}

// GraphQL query para buscar comentários
$query = [
    'query' => '
        query {
            repository(owner: "overpride007", name: "velino") {
                discussion(number: 1) {
                    comments(first: 50) {
                        nodes {
                            body
                            author {
                                login
                            }
                            createdAt
                        }
                    }
                }
            }
        }
    '
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.github.com/graphql');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $githubToken,
    'Content-Type: application/json',
    'User-Agent: VelinoComments/1.0'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($query));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $data = json_decode($response, true);
    
    $comments = [];
    if (isset($data['data']['repository']['discussion']['comments']['nodes'])) {
        foreach ($data['data']['repository']['discussion']['comments']['nodes'] as $comment) {
            $comments[] = [
                'author' => $comment['author']['login'] ?? 'Usuário',
                'text' => $comment['body'] ?? '',
                'date' => date('Y-m-d', strtotime($comment['createdAt'] ?? 'now'))
            ];
        }
    }
    
    echo json_encode([
        'success' => true,
        'comments' => $comments
    ]);
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Erro ao carregar comentários',
        'comments' => []
    ]);
}
?>
