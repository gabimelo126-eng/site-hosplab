<?php
// Recebe o formulário de orçamento e salva em dados/orcamentos.csv
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: index.html'); exit; }

function limpar($v) {
    $v = trim(strip_tags($v ?? ''));
    return preg_match('/^[=+\-@]/', $v) ? "'" . $v : $v; // evita fórmulas ao abrir no Excel
}

$d = [];
foreach (['nome', 'telefone', 'email', 'produto', 'mensagem'] as $campo) {
    $d[$campo] = limpar($_POST[$campo] ?? '');
}

$erro = '';
if ($d['nome'] === '') $erro = 'Informe seu nome ou empresa.';
elseif (strlen(preg_replace('/\D/', '', $d['telefone'])) < 10) $erro = 'Telefone inválido (use DDD).';
elseif (!filter_var($d['email'], FILTER_VALIDATE_EMAIL)) $erro = 'E-mail inválido.';
elseif (mb_strlen($d['mensagem']) < 10) $erro = 'Escreva pelo menos 10 caracteres na mensagem.';

if ($erro) {
    header('Location: index.html?status=erro&msg=' . urlencode($erro) . '#orcamento');
    exit;
}

$pasta = __DIR__ . '/dados';
if (!is_dir($pasta)) mkdir($pasta, 0755, true);
if (!file_exists($pasta . '/.htaccess')) file_put_contents($pasta . '/.htaccess', "Require all denied\n");

$arq = fopen($pasta . '/orcamentos.csv', 'a');
fputcsv($arq, [date('d/m/Y H:i'), $d['nome'], $d['telefone'], $d['email'], $d['produto'], $d['mensagem']], ';', '"', '\\');
fclose($arq);

header('Location: index.html?status=ok#orcamento');
