<?php
include_once("../../connect.php");
include_once("../../includes/cors.php");
 
$method = $_SERVER["REQUEST_METHOD"];

if($method === "POST"){
    $appointmentData = json_decode(file_get_contents('php://input'), true);

    $patientID = mysqli_real_escape_string($connection, $appointmentData["patient_id"]);
    $doctorID = mysqli_real_escape_string($connection, $appointmentData["doctor_id"]);
    $scheduleID = mysqli_real_escape_string($connection, $appointmentData["schedule_id"]);
    
    $query1 = "INSERT INTO tblappointment (patient_id, doctor_id, schedule_id) VALUES ('$patientID', '$doctorID', '$scheduleID')";
    $result = mysqli_query($connection, $query1);
    
    if($result === false){
        die("Error in query: " . mysqli_error($connection));
    }

    $query2 = "UPDATE tblschedule SET is_available = 0 WHERE schedule_id = '$scheduleID'";
    $result = mysqli_query($connection, $query2);

    if($result === false){
        die("Error in query: " . mysqli_error($connection));
    }

    $response = [
        "success" => true,
        "message" => "Appointment booked successfully"
    ];

    echo json_encode($response, JSON_PRETTY_PRINT);
}