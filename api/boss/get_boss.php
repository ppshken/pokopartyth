<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
require_once '../db.php'; // เชื่อมต่อฐานข้อมูล

function getPokemonData($pokemon_id) {
    $url = "https://pokeapi.co/api/v2/pokemon/{$pokemon_id}";
    $response = @file_get_contents($url);
    if ($response === FALSE) return null;
    $data = json_decode($response, true);
    return [
        'name' => $data['name'] ?? '',
        'image' => $data['sprites']['other']['official-artwork']['front_default'] ?? $data['sprites']['front_default'] ?? '',
    ];
}

try {
    $today = date('Y-m-d');
    $stmt = $pdo->prepare('SELECT id, pokemon_id, boss_name, boss_tier, start_date, end_date FROM raid_boss WHERE start_date <= :today AND end_date >= :today ORDER BY id DESC');
    $stmt->execute(['today' => $today]);
    $bosses = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($bosses as &$boss) {
        $poke = getPokemonData($boss['pokemon_id']);
        $boss['pokemon_name'] = $poke['name'] ?? '';
        $boss['pokemon_image'] = $poke['image'] ?? '';
        // boss_tier มาจากฐานข้อมูลอยู่แล้ว
    }
    echo json_encode([
        'success' => true,
        'bosses' => $bosses
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'เกิดข้อผิดพลาด: ' . $e->getMessage()
    ]);
}
