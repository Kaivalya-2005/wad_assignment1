<?php
session_start();
header("Content-Type: text/plain");

// Validate input
if (!isset($_POST['title']) || !isset($_POST['date']) || !isset($_POST['desc']) || !isset($_POST['type'])) {
    echo "Error: Missing required fields!";
    exit;
}

// Sanitize input
$title = htmlspecialchars(trim($_POST['title']));
$date = htmlspecialchars(trim($_POST['date']));
$description = htmlspecialchars(trim($_POST['desc']));
$type = htmlspecialchars(trim($_POST['type']));

// Validate event type
if ($type !== 'latest' && $type !== 'old') {
    echo "Error: Invalid event type!";
    exit;
}

// Handle image upload
$imagePath = '';
if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
    $allowedTypes = array('image/jpeg', 'image/png');
    $fileType = $_FILES['image']['type'];
    
    if (in_array($fileType, $allowedTypes)) {
        $extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $fileName = time() . '_' . uniqid() . '.' . $extension;
        $uploadPath = '../uploads/' . $fileName;
        
        if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadPath)) {
            $imagePath = 'uploads/' . $fileName;
        }
    }
}

// Create event object
$event = [
    "id" => uniqid(),
    "title" => $title,
    "date" => $date,
    "description" => $description,
    "type" => $type,
    "image" => $imagePath,
    "created_at" => date('Y-m-d H:i:s')
];

// Add event to session
$_SESSION['events'][] = $event;

echo "Event Added Successfully!";
?>
