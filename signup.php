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
    $fullname = $_POST['fullname'];
    $id = $_POST['id'];
    $username = $_POST['newUsername'];
    $password = password_hash($_POST['newPassword'], PASSWORD_DEFAULT);
    $email = $_POST['email'];
    $allergy = $_POST['allergy'];
    $usertype = $_POST['usertype'];
    
    try {

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !str_ends_with($email, '@g.bracu.ac.bd')) {
            echo json_encode(['success' => false, 'message' => 'Email must be a valid BRAC University email ending with @g.bracu.ac.bd']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO Users (UserID, Username, Password, Email, FullName, Category) 
                              VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$id, $username, $password, $email, $fullname, $usertype]);
        
        if (!empty($allergy)) {
            $allergies = array_map('trim', explode(',', $allergy));
            
            $stmt = $pdo->prepare("INSERT INTO Allergy (UserID, AllergyName) VALUES (?, ?)");
            foreach ($allergies as $allergyItem) {
                if (!empty($allergyItem)) {
                    $stmt->execute([$id, $allergyItem]);
                }
            }
        }
        
        echo json_encode(['success' => true, 'message' => 'Account created successfully!']);
    } catch (PDOException $e) {

        if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
            if (strpos($e->getMessage(), 'Username') !== false) {
                echo json_encode(['success' => false, 'message' => 'Username already exists']);
            } elseif (strpos($e->getMessage(), 'Email') !== false) {
                echo json_encode(['success' => false, 'message' => 'Email already exists']);
            } elseif (strpos($e->getMessage(), 'UserID') !== false) {
                echo json_encode(['success' => false, 'message' => 'User ID already exists']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Duplicate entry error: ' . $e->getMessage()]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
        }
    }
}
?>