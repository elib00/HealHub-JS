<?php
include_once("../../connect.php");
include_once("../../includes/cors.php");
 
$method = $_SERVER["REQUEST_METHOD"];
 
if($method === "POST"){
    $appointmentData = json_decode(file_get_contents('php://input'), true);
    $scheduleID = $appointmentData["schedule_id"];
    $type = $appointmentData["type"];

    $response = null;

    $removeAppointmentFromTableQuery = "DELETE FROM tblschedule WHERE schedule_id = '$scheduleID'";

    if(!mysqli_query($connection, $removeAppointmentFromTableQuery)){
        die("Error in query: " . mysqli_error($connection));
    }else{
        if($type === "process"){
            $response = [
                "success" => true,
                "type" => $type,
                "message" => "Appointment completed successfully"
            ];
        }else{
            $response = [
                "success" => true,
                "type" => $type,
                "message" => "Appointment cancelled successfully"
            ];
        }
    }
    

    header('Content-Type: application/json');
    http_response_code(200);

    echo json_encode($response, JSON_PRETTY_PRINT);
}