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
    $foodName = $_POST['foodName'];
    $quantity = intval($_POST['quantity']);
    $action = $_POST['action'];
    $userID = $_POST['userID'];
    
    try {
        $stmt = $pdo->prepare("SELECT Category FROM Users WHERE UserID = ?");
        $stmt->execute([$userID]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user || ($user['Category'] !== 'staff' && $user['Category'] !== 'admin')) {
            echo json_encode(['success' => false, 'message' => 'Unauthorized: Staff access required']);
            exit;
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error verifying user: ' . $e->getMessage()]);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("SELECT Available_Quantity FROM Food WHERE F_Name = ?");
        $stmt->execute([$foodName]);
        $food = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$food) {
            echo json_encode(['success' => false, 'message' => 'Food item not found']);
            exit;
        }
        
        $currentQuantity = $food['Available_Quantity'];
        $newQuantity = $currentQuantity;
        
        if ($action === 'add') {
            $newQuantity = $currentQuantity + $quantity;
            
            $vendorName = ($foodName === 'Ice Cream') ? 'Polar' : 'Khabar Dabar';
            
            $historyEntry = $foodName . ' - ' . $quantity;
            $stmt = $pdo->prepare("INSERT INTO vending_history (V_Name, V_History) VALUES (?, ?)");
            $stmt->execute([$vendorName, $historyEntry]);
            
        } elseif ($action === 'sell') {
            if ($quantity > $currentQuantity) {
                echo json_encode(['success' => false, 'message' => 'Cannot sell more than available quantity']);
                exit;
            }
            $newQuantity = $currentQuantity - $quantity;
            
            $stmt = $pdo->prepare("SELECT * FROM finance WHERE F_Date = CURDATE() AND F_Name = ?");
            $stmt->execute([$foodName]);
            $existingEntry = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($existingEntry) {
                $newSoldQuantity = $existingEntry['Sold_Quantity'] + $quantity;
                $stmt = $pdo->prepare("UPDATE finance SET Sold_Quantity = ? WHERE F_Date = CURDATE() AND F_Name = ?");
                $stmt->execute([$newSoldQuantity, $foodName]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO finance (F_Date, F_Name, Sold_Quantity) VALUES (CURDATE(), ?, ?)");
                $stmt->execute([$foodName, $quantity]);
            }
        }
        
        $stmt = $pdo->prepare("UPDATE Food SET Available_Quantity = ? WHERE F_Name = ?");
        $stmt->execute([$newQuantity, $foodName]);
        
        echo json_encode(['success' => true, 'message' => 'Quantity updated successfully']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
}
?>