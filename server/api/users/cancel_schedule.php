<?php
include_once("../../connect.php");
include_once("../../includes/cors.php");
 
$method = $_SERVER["REQUEST_METHOD"];
 
if($method === "POST"){
    $userData = json_decode(file_get_contents('php://input'), true);
    $scheduleID = mysqli_real_escape_string($connection, $userData["schedule_id"]);
    
    $query1 = "DELETE FROM tblschedule WHERE schedule_id = '$scheduleID'";
    $result = mysqli_query($connection, $query1);

    if($result === false){
        die("Error in query: " . mysqli_error($connection));
    }

    $response = [
        "success" => true,
        "message" => "Schedule cancelled successfully."
    ];

    echo json_encode($response, JSON_PRETTY_PRINT);
}