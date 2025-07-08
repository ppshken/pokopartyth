<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
require_once '../db.php';

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
$raid_rooms_id = isset($_GET['raid_rooms_id']) ? intval($_GET['raid_rooms_id']) : 0;

if ($user_id <= 0 || $raid_rooms_id <= 0) {
    echo json_encode(["status" => "error", "message" => "Missing or invalid parameters."]);
    exit;
}

try {
    // 1. ดึง people_count จาก raid_rooms
    $stmt = $pdo->prepare("SELECT people_count FROM raid_rooms WHERE id = ?");
    $stmt->execute([$raid_rooms_id]);
    $room = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$room) {
        echo json_encode(["status" => "error", "message" => "Raid room not found."]);
        exit;
    }

    $people_count = intval($room['people_count']);

    // 2. ตรวจสอบว่าผู้ใช้เข้าห้องนี้ไปแล้วหรือยัง
    $stmt = $pdo->prepare("SELECT COUNT(*) AS found FROM user_raid_rooms WHERE user_id = ? AND raid_rooms_id = ?");
    $stmt->execute([$user_id, $raid_rooms_id]);
    $exists = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($exists && intval($exists['found']) > 0) {
        echo json_encode(["status" => "error", "message" => "คุณได้เข้าร่วมห้องนี้แล้ว"]);
        exit;
    }

    // 3. นับจำนวนคนในห้อง
    $stmt = $pdo->prepare("SELECT COUNT(*) AS total FROM user_raid_rooms WHERE raid_rooms_id = ?");
    $stmt->execute([$raid_rooms_id]);
    $joined = $stmt->fetch(PDO::FETCH_ASSOC);
    $current_count = intval($joined['total']);

    if ($current_count >= $people_count) {
        echo json_encode(["status" => "error", "message" => "Raid room is full."]);
        exit;
    }

    // 4. บันทึกข้อมูล
    $stmt = $pdo->prepare("INSERT INTO user_raid_rooms (user_id, raid_rooms_id) VALUES (?, ?)");
    $stmt->execute([$user_id, $raid_rooms_id]);

    echo json_encode(["status" => "success", "message" => "Joined the raid room successfully."]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}