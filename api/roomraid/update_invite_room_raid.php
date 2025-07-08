<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
require_once '../db.php';

$raid_rooms_id = $_GET['raid_rooms_id'] ?? null;

if ($raid_rooms_id) {
    try {
        $stmt = $pdo->prepare('
            UPDATE raid_rooms SET invite="true" WHERE id= :raid_rooms_id;
        ');
        $stmt->bindParam(':raid_rooms_id', $raid_rooms_id, PDO::PARAM_INT);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'เชิญแล้วเรียบร้อย'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'ไม่พบข้อมูลห้อง'
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'เกิดข้อผิดพลาด: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'ไม่สามารถเชิญได้'
    ]);
}
