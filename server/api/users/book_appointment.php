<?php
include_once("../../connect.php");
include_once("../../includes/cors.php");
 
$method = $_SERVER["REQUEST_METHOD"];

if($method === "POST"){
    $appointmentData = json_decode(file_get_contents('php://input'), true);

    $accountID = mysqli_real_escape_string($connection, $appointmentData["account_id"]);
    $doctorID = mysqli_real_escape_string($connection, $appointmentData["doctor_id"]);
    $scheduleID = mysqli_real_escape_string($connection, $appointmentData["schedule_id"]);

    $updateScheduleAvailabilityQuery = "UPDATE tblschedule SET is_available = 0 WHERE schedule_id = '$scheduleID'";
    $result = mysqli_query($connection, $updateScheduleAvailabilityQuery);

    if($result === false){
        die("Error in query: " . mysqli_error($connection));
    }

    $insertNewAppointmentRequestQuery = "INSERT INTO tblappointmentrequest(account_id, doctor_id, schedule_id) VALUES ('$accountID','$doctorID','$scheduleID')";
    $result = mysqli_query($connection, $insertNewAppointmentRequestQuery);

    if($result === false){
        die("Error in query: " . mysqli_error($connection));
    }


    $response = [
        "success" => true,
        "message" => "Appointment booked successfully"
    ];

    echo json_encode($response, JSON_PRETTY_PRINT);
}