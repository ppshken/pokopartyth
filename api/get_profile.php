<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
require_once 'db.php'; // เชื่อมต่อฐานข้อมูล

$sessionId = $_GET['sessionId'] ?? $_POST['sessionId'] ?? null;

if (!$sessionId) {
    echo json_encode(['status' => 'error', 'message' => 'Missing sessionId']);
    exit;
}

// 1. หา user_id จาก sessionId
$stmt = $pdo->prepare("SELECT user_id FROM sessions WHERE session_id = ?");
$stmt->execute([$sessionId]);
$session = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$session) {
    echo json_encode(['status' => 'error', 'message' => 'มีการเข้าบัญชีคุณจากเครื่องอื่น']);
    exit;
}

$user_id = $session['user_id'];

// 2. ดึงข้อมูลผู้ใช้จากตาราง users
$stmt = $pdo->prepare("SELECT id, email, trainer_name, friend_code, level, team, created_at FROM users WHERE id = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo json_encode(['status' => 'success', 'profile' => $user]);
    exit;
} else {
    echo json_encode(['status' => 'error', 'message' => 'User not found']);
    exit;
}
