<?php
include_once("../../connect.php");
include_once("../../includes/cors.php");
 
$method = $_SERVER["REQUEST_METHOD"];
 
if($method === "POST"){
    $userData = json_decode(file_get_contents('php://input'), true);
    $accountID = $userData["account_id"];

    $getDoctorDetailsQuery = "SELECT CONCAT(up.firstname, ' ', up.lastname) AS doctor_name, up.gender AS doctor_gender, ua.email AS doctor_email, doctor_id, specialization " .
                              "FROM tbldoctor d " .
                              "JOIN tbluseraccount ua ON d.account_id = ua.account_id " .
                              "JOIN tbluserprofile up ON ua.user_id = up.user_id " .
                              "WHERE d.account_id = '$accountID'";


    $result = mysqli_query($connection, $getDoctorDetailsQuery);
    if($result === false){
        die("Error in query: " . mysqli_error($connection));
    }

        //extract the doctor details
    $doctorDetails = mysqli_fetch_assoc($result );
    $doctorID = $doctorDetails["doctor_id"];
    $doctorName = $doctorDetails["doctor_name"];
    $doctorEmail = $doctorDetails["doctor_email"];
    $doctorGender = $doctorDetails["doctor_gender"];
    $doctorSpecialization = $doctorDetails["specialization"];

    header('Content-Type: application/json');
    http_response_code(200);

    $response = [
        "success" => true,
        "doctor" => [
            "doctor_id" => $doctorID,
            "doctor_name" => $doctorName,
            "doctor_email" => $doctorEmail,
            "doctor_gender" => $doctorGender,
            "doctor_specialization" => $doctorSpecialization
        ],
        "message" => "Fetched current doctor successfully."
    ];

    echo json_encode($response, JSON_PRETTY_PRINT);
}