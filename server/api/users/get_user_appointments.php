<?php
include_once("../../connect.php");
include_once("../../includes/cors.php");
 
$method = $_SERVER["REQUEST_METHOD"];
 
if($method === "POST"){
    $userData = json_decode(file_get_contents('php://input'), true);
    $userID = $userData["user_id"];

    $getUserAppointmentsQuery = "SELECT 
                                    appointment_id, doctor_id, schedule_id " .
                                  "FROM 
                                    tblappointment " .    
                                  "WHERE
                                    patient_id = '$userID'";

    $result = mysqli_query($connection, $getUserAppointmentsQuery);
    if($result === false){
        die("Error in query: " . mysqli_error($connection));
    }

    header('Content-Type: application/json');
    http_response_code(200);

    $appointments = [];

    while($row = mysqli_fetch_array($result)){
        $appointments[] = $row;
    }

    $response = [
        "success" => true,
        "appointments" => [...$appointments],
        "message" => "Fetched user appointments successfully."
    ];

    echo json_encode($response, JSON_PRETTY_PRINT);
                            
}