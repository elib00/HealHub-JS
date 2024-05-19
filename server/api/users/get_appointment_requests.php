<?php
include_once("../../connect.php");
include_once("../../includes/cors.php");
 
$method = $_SERVER["REQUEST_METHOD"];
 
if($method === "POST"){
    $doctorData = json_decode(file_get_contents('php://input'), true);
    $doctorID = $doctorData["doctor_id"];

        $getDoctorAppointmentRequestsQuery = "SELECT
                                                request_id, ar.account_id, 
                                                CONCAT(up.firstname, ' ', up.lastname) AS name,
                                                up.gender AS gender, up.birthdate as birthdate,
                                                ua.email as email
                                            FROM 
                                                tblappointmentrequest ar
                                            JOIN 
                                                tbluseraccount ua ON ua.account_id = ar.account_id
                                            JOIN
                                                tbluserprofile up ON up.user_id = ua.user_id
                                            WHERE 
                                                doctor_id = '$doctorID';
                                            ";

    $result = mysqli_query($connection, $getDoctorAppointmentRequestsQuery);

    if($result === false){
        die("Error in query: " . mysqli_error($connection));
    }

    header('Content-Type: application/json');
    http_response_code(200);

    $appointmentRequests = [];

    while($row = mysqli_fetch_assoc($result)){
        $appointmentRequests[] = $row;
    }


    $response = [
        "success" => true,
        "appointment_requests" => $appointmentRequests,
        "message" => "Doctor appointment requests fetched successfully"
    ];

    echo json_encode($response, JSON_PRETTY_PRINT);
}