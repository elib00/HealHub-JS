<?php
include_once("../../connect.php");
include_once("../../includes/cors.php");
 
$method = $_SERVER["REQUEST_METHOD"];
 
if($method === "POST"){
    $doctorData = json_decode(file_get_contents('php://input'), true);
    $doctorID = $doctorData["doctor_id"];

    $getDoctorAppointmentsQuery = "SELECT 
                                    appointment_id, patient_id, schedule_id " .
                                  "FROM 
                                    tblappointment " .    
                                  "WHERE
                                    doctor_id = '$doctorID'";

    $result = mysqli_query($connection, $getDoctorAppointmentsQuery);
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
        "message" => "Fetched doctor appointments successfully."
    ];

    echo json_encode($response, JSON_PRETTY_PRINT);
                            
}