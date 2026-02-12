<?php
session_start();
header("Content-Type: text/plain");

// Check if event ID is provided
if (!isset($_POST['id'])) {
    echo "Error: Event ID not provided!";
    exit;
}

$eventId = $_POST['id'];

// Check if events array exists
if (!isset($_SESSION['events'])) {
    echo "Error: No events found!";
    exit;
}

// Find and delete the event
$newEvents = array();

foreach ($_SESSION['events'] as $event) {
    if ($event['id'] == $eventId) {
        // Delete image file if exists
        if (!empty($event['image']) && file_exists('../' . $event['image'])) {
            unlink('../' . $event['image']);
        }
    } else {
        // Keep this event
        $newEvents[] = $event;
    }
}

$_SESSION['events'] = $newEvents;
echo "Event Deleted Successfully!";
?>
