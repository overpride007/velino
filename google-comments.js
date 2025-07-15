// Exemplo de fetch para Google Apps Script
// Use este arquivo como referência para integração frontend

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxXSbxak0Cr72Z7u_qpCjwNUZAifAjnBEALgAtz-8bcN7L3WX_pM8YBYkgtCCubw1d5Ig/exec';

// Enviar comentário
async function enviarComentario({ nome, idade, avaliacao, comentario }) {
  const res = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, idade, avaliacao, comentario })
  });
  return res.json();
}

// Listar comentários
async function listarComentarios() {
  const res = await fetch(GOOGLE_SCRIPT_URL);
  return res.json();
}

// Exemplo de uso:
// enviarComentario({ nome: 'Teste', idade: '30', avaliacao: '5', comentario: 'Ótimo!' })
//   .then(console.log);
// listarComentarios().then(console.log);
