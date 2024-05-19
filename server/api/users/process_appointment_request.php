<?php
include_once("../../connect.php");
include_once("../../includes/cors.php");
 
$method = $_SERVER["REQUEST_METHOD"];
 
if($method === "POST"){
    $requestData = json_decode(file_get_contents('php://input'), true);
    $requestID = $requestData["request_id"];
    $type = $requestData["type"];

    if($type === "accept"){
        $getAppointmentRequestQuery = "SELECT
                                        *
                                       FROM
                                        tblappointmentrequest
                                       WHERE
                                        request_id = '$requestID'
                                    ";
        
        $result = mysqli_query($connection, $getAppointmentRequestQuery);
        $appointmentRequest = mysqli_fetch_assoc(mysqli_query($connection, $getAppointmentRequestQuery));


        //data for to be inserted in appointment table
        $scheduleID = $appointmentRequest["schedule_id"];
        $doctorID = $appointmentRequest["doctor_id"];
        $patientID = $appointmentRequest["account_id"];

        $createAppointmentQuery = "INSERT INTO tblappointment (patient_id, doctor_id, schedule_id) VALUES('$patientID', '$doctorID', '$scheduleID')";

        $result = mysqli_query($connection, $createAppointmentQuery);

        if($result === false){
            die("Error in query: " . mysqli_error($connection));
        }

        $updateScheduleAvailabilityQuery = "UPDATE tblschedule SET is_available = 0 WHERE schedule_id = '$scheduleID'";

        $result2 = mysqli_query($connection, $updateScheduleAvailabilityQuery);

        if($result2 === false){
            die("Error in query: " . mysqli_error($connection));
        }

        // if(!(mysqli_query($connection, $updateScheduleAvailabilityQuery))){
        //     die("Error in query: " . mysqli_error($connection));
        // }
    }
    
    $deleteAppointmentRequestQuery = "DELETE FROM tblappointmentrequest WHERE request_id = '$requestID'";
    if(!(mysqli_query($connection, $deleteAppointmentRequestQuery))){
        die("Error in query: " . mysqli_error($connection));
    }

    header('Content-Type: application/json');
    http_response_code(200);

    $response = [
        "success" => true,
        "type" => $type,
        "message" => "Appointment request processed successfully"
    ];

    echo json_encode($response, JSON_PRETTY_PRINT);

}