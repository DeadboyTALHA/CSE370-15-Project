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
    $userID = $_POST['userID'];
    
    try {
        $stmt = $pdo->prepare("SELECT AllergyName FROM Allergy WHERE UserID = ?");
        $stmt->execute([$userID]);
        $allergies = $stmt->fetchAll(PDO::FETCH_COLUMN);

        $query = "
            SELECT 
                f.F_Name, 
                f.Basic_Ingredients as Ingredients,
                f.Category,
                GROUP_CONCAT(DISTINCT cn.CounterNo ORDER BY cn.CounterNo SEPARATOR ', ') as CounterNos,
                f.Price,
                GROUP_CONCAT(DISTINCT st.ServingTime SEPARATOR ', ') as ServingTimes,
                f.Availability_Status,
                f.Available_Quantity
            FROM Food f
            LEFT JOIN CounterNo cn ON f.F_Name = cn.F_Name
            LEFT JOIN Serving_Time st ON f.F_Name = st.F_Name
            GROUP BY f.F_Name
            ORDER BY 
                CASE 
                    WHEN f.Available_Quantity = 0 THEN 2
                    ELSE 1
                END,
                f.F_Name
        ";
        
        $stmt = $pdo->prepare($query);
        $stmt->execute();
        $foodItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $isStaff = false;
        if (isset($userID) && !empty($userID)) {
            $stmt = $pdo->prepare("SELECT Category FROM Users WHERE UserID = ?");
            $stmt->execute([$userID]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user) {
                $isStaff = ($user['Category'] === 'staff' || $user['Category'] === 'admin');
            }
        }
        
        echo json_encode([
            'success' => true, 
            'foodItems' => $foodItems,
            'user' => [
                'allergiesArray' => $allergies
            ],
            'isStaff' => $isStaff
        ]);
        
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
}
?>