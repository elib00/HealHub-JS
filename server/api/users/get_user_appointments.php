<?php
include_once("../../connect.php");
include_once("../../includes/cors.php");
 
$method = $_SERVER["REQUEST_METHOD"];
 
if($method === "POST"){
    $userData = json_decode(file_get_contents('php://input'), true);
    $accountID = $userData["account_id"];

    $getUserAppointmentsQuery = "SELECT 
                                    a.appointment_id AS appointment_id, a.doctor_id AS doctor_id, a.schedule_id AS schedule_id, d.specialization AS doctor_specialization, s.date as scheduled_date,  CONCAT(up.firstname, ' ', up.lastname) AS doctor_name, ua.email AS doctor_email 
                                  FROM 
                                    tblappointment a
                                  JOIN 
                                    tbldoctor d ON d.doctor_id = a.doctor_id
                                  JOIN
                                    tbluseraccount ua ON ua.account_id = d.account_id
                                  JOIN
                                    tbluserprofile up ON up.user_id = ua.user_id
                                  JOIN
                                    tblschedule s ON s.schedule_id = a.schedule_id
                                  WHERE
                                    patient_id = '$accountID'";

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