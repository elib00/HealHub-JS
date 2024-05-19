<?php
include_once("../../connect.php");
include_once("../../includes/cors.php");
 
$method = $_SERVER["REQUEST_METHOD"];

if($method === "POST"){
    $appointmentData = json_decode(file_get_contents('php://input'), true);
    $scheduleID = $appointmentData["appointment_id"];
    $newDate = $appointmentData["new_date"];
    
    $editAppointmentDateQuery = "UPDATE tblschedule SET date = '$newDate' WHERE schedule_id = '$scheduleID'";
    if(!(mysqli_query($connection, $editAppointmentDateQuery))){
        die("Error in query: " . mysqli_error($connection));
    }else{
        header('Content-Type: application/json');
        http_response_code(200);
    
        $response = [
            "success" => true,
            "message" => "Appointment updated successfully."
        ];
    
        echo json_encode($response, JSON_PRETTY_PRINT); 
    }
}
