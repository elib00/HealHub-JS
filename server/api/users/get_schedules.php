<?php
include_once("../../connect.php");
include_once("../../includes/cors.php");
 
$method = $_SERVER["REQUEST_METHOD"];

if($method === "POST"){
    $userData = json_decode(file_get_contents('php://input'), true);
    $accountID = mysqli_real_escape_string($connection, $userData["account_id"]);

    $query1 = "SELECT doctor_id FROM tbldoctor WHERE account_id = '$accountID'";
    $result = mysqli_query($connection, $query1);

    if($result === false){
        die("Error in query: " . mysqli_error($connection));
    }

    $doctor = mysqli_fetch_assoc($result);
    $doctorID = $doctor["doctor_id"];

    $query2 = "SELECT * FROM tblschedule WHERE doctor_id = '$doctorID'";
    $result = mysqli_query($connection, $query2);

    if($result === false){
        die("Error in query: " . mysqli_error($connection));
    }

    $schedules = [];

    while($row = mysqli_fetch_assoc($result)){
        $schedules[] = $row;
    }

    header('Content-Type: application/json');
    http_response_code(200);

    $response = [
        "success" => true,
        "schedules" => [...$schedules],
        "message" => "Schedules of Doctor with ID " . $doctorID . " fetched successfully."
    ];

    echo json_encode($response, JSON_PRETTY_PRINT);
}else{
    echo json_encode(array("success" => false, "message" => "Type of method not supported or allowed in this endpoint."), JSON_PRETTY_PRINT);
}