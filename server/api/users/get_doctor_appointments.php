<?php
include_once("../../connect.php");
include_once("../../includes/cors.php");
 
$method = $_SERVER["REQUEST_METHOD"];
 
if($method === "POST"){
    $doctorData = json_decode(file_get_contents('php://input'), true);
    $doctorID = $doctorData["doctor_id"];

    $getDoctorAppointmentsQuery = "SELECT 
                                    appointment_id, patient_id, appointment.schedule_id, ua.email AS patient_email, 
                                    CONCAT(up.firstname, ' ', up.lastname) AS patient_name, 
                                    up.gender AS patient_gender, up.birthdate AS patient_birthday, 
                                    sched.date AS scheduled_date
                                  FROM 
                                    tblappointment appointment
                                  JOIN 
                                    tbluseraccount ua ON ua.account_id = patient_id
                                  JOIN
                                    tbluserprofile up ON up.user_id = ua.user_id
                                  JOIN 
                                    tblschedule sched ON sched.schedule_id = appointment.schedule_id
                                  WHERE
                                    appointment.doctor_id = '$doctorID'";

    $result = mysqli_query($connection, $getDoctorAppointmentsQuery);
    if($result === false){
        die("Error in query: " . mysqli_error($connection));
    }

    header('Content-Type: application/json');
    http_response_code(200);

    $appointments = [];

    while($row = mysqli_fetch_assoc($result)){
        $appointments[] = $row;
    }

    $response = [
        "success" => true,
        "appointments" => [...$appointments],
        "message" => "Fetched doctor appointments successfully."
    ];

    echo json_encode($response, JSON_PRETTY_PRINT);
                            
}