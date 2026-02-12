<?php
session_start();
header("Content-Type: application/json");

// Initialize events array if not exists
if (!isset($_SESSION['events'])) {
    $_SESSION['events'] = [];
}

// Return all events
echo json_encode($_SESSION['events']);
?>
