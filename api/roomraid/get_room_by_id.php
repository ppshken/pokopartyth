<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
require_once '../db.php';

// รับ roomraid_id จาก GET
$roomraid_id = isset($_GET['roomraid_id']) ? $_GET['roomraid_id'] : null;

if (!$roomraid_id) {
    echo json_encode([
        "status" => 'error',
        "message" => "Missing 'roomraid_id' parameter."
    ]);
    exit;
}

try {
    // ✅ 1. ดึงข้อมูลห้อง + friend_code + joined_count
    $stmt = $pdo->prepare(
        "SELECT
            rr.*,
            u.friend_code AS trainer_code,
            u.trainer_name AS trainer_name,
            COUNT(urr.id) AS joined_count
        FROM
            raid_rooms rr
        JOIN
            users u ON rr.created_by = u.id
        LEFT JOIN
            user_raid_rooms urr ON rr.id = urr.raid_rooms_id
        WHERE
            rr.id = :roomraid_id
        GROUP BY
            rr.id
        ");
    $stmt->bindParam(':roomraid_id', $roomraid_id, PDO::PARAM_INT);
    $stmt->execute();

    $roomData = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$roomData) {
        echo json_encode([
            "status" => "error",
            "message" => "ไม่พบห้อง raid นี้"
        ]);
        exit;
    }

    // ✅ 2. ดึงรายชื่อผู้เข้าร่วมห้อง
    $stmt2 = $pdo->prepare(
        "SELECT 
            u.id,
            u.trainer_name,
            u.friend_code,
            u.team,
            u.level,
            urr.created_at,
            urr.status
        FROM user_raid_rooms urr
        JOIN users u ON urr.user_id = u.id
        WHERE urr.raid_rooms_id = :roomraid_id
        ORDER BY urr.created_at ASC
        ");
    $stmt2->bindParam(':roomraid_id', $roomraid_id, PDO::PARAM_INT);
    $stmt2->execute();

    $participants = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    // ✅ รวมข้อมูลทั้งหมดใน JSON เดียว
    echo json_encode([
        "status" => 'success',
        "room" => $roomData,
        "participants" => $participants
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => 'error',
        "message" => 'เกิดข้อผิดพลาด: ' . $e->getMessage()
    ]);
}
