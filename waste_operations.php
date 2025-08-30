<?php
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    
    exit(0);
}

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];
    
    try {
        if ($action === 'get_waste_data') {
            $query = "SELECT W_date, W_amount FROM waste 
                     WHERE W_date >= DATE_SUB(CURDATE(), INTERVAL 10 DAY) 
                     ORDER BY W_date DESC";
            $stmt = $pdo->prepare($query);
            $stmt->execute();
            $wasteData = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode(['success' => true, 'wasteData' => $wasteData]);
            
        } elseif ($action === 'add_waste') {
            $userID = $_POST['userID'];
            $wasteAmount = $_POST['wasteAmount'];
            
            $stmt = $pdo->prepare("SELECT Category FROM Users WHERE UserID = ?");
            $stmt->execute([$userID]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user && in_array($user['Category'], ['staff', 'vendor', 'admin'])) {
                $stmt = $pdo->prepare("SELECT * FROM waste WHERE W_date = CURDATE()");
                $stmt->execute();
                $existingEntry = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($existingEntry) {
                    $stmt = $pdo->prepare("UPDATE waste SET W_amount = ? WHERE W_date = CURDATE()");
                    $stmt->execute([$wasteAmount]);
                } else {
                    $stmt = $pdo->prepare("INSERT INTO waste (W_date, W_amount) VALUES (CURDATE(), ?)");
                    $stmt->execute([$wasteAmount]);
                }
                
                echo json_encode(['success' => true, 'message' => 'Waste data updated successfully!']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
            }
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
}
?>