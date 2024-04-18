<?php
include_once("../../connect.php");
include_once("../../includes/cors.php");
 
$method = $_SERVER["REQUEST_METHOD"];
 
if($method === "GET"){
    $getDoctorsWithScheduleQuery = "SELECT DISTINCT d.doctor_id " .
                                   "FROM tbldoctor d " . 
                                   "JOIN tblschedule s ON d.doctor_id = s.doctor_id";

    $result1 = mysqli_query($connection, $getDoctorsWithScheduleQuery);

    if($result1 === false){
        die("Error in query: " . mysqli_error($connection));
    }

    $doctors = [];

    while($doctor = mysqli_fetch_assoc($result1)){
        $doctorID = $doctor["doctor_id"];

        //get the doctor information like full name, gender, and email
        $getDoctorDetailsQuery = "SELECT CONCAT(up.firstname, ' ', up.lastname) AS doctor_name, up.gender AS doctor_gender, ua.email AS doctor_email " .
                              "FROM tbldoctor d " .
                              "JOIN tbluseraccount ua ON d.account_id = ua.account_id " .
                              "JOIN tbluserprofile up ON ua.user_id = up.user_id " .
                              "WHERE d.doctor_id = '$doctorID'";

        $result2 = mysqli_query($connection, $getDoctorDetailsQuery);
        if($result2 === false){
            die("Error in query: " . mysqli_error($connection));
        }

        //extract the doctor details
        $doctorDetails = mysqli_fetch_assoc($result2);
        $doctorName = $doctorDetails["doctor_name"];
        $doctorEmail = $doctorDetails["doctor_email"];
        $doctorGender = $doctorDetails["doctor_gender"];
                
        //get the set or available schedules of that doctor from the id
        $getSchedulesQuery = "SELECT schedule_id, date from tblschedule WHERE doctor_id = '$doctorID'";
        $result3 = mysqli_query($connection, $getSchedulesQuery);

        if($result3 === false){
            die("Error in query: " . mysqli_error($connection));
        }

        $doctorSchedules = [];
        while ($schedule = mysqli_fetch_assoc($result3)) {
            $doctorSchedules[] = $schedule;
        }

        $doctors[] = [
            "doctor_details" => [
                "doctor_id" => $doctorID,
                "doctor_name" => $doctorName,
                "doctor_email" => $doctorEmail,
                "doctor_gener" => $doctorGender
            ],
            "doctor_schedule" => $doctorSchedules
        ];

    }

    header('Content-Type: application/json');
    http_response_code(200);

    $response = [
        "success" => true,
        "doctors" => [...$doctors],
        "message" => "Fetched doctor schedules successfully."
    ];

    echo json_encode($response, JSON_PRETTY_PRINT);
}