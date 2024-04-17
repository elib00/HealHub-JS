<?php
include_once("../../connect.php");
include_once("../../includes/cors.php");
 
$method = $_SERVER["REQUEST_METHOD"];

if($method === "POST"){
    $userData = json_decode(file_get_contents('php://input'), true);

    $accountID = mysqli_real_escape_string($connection, $userData["account_id"]);
    $date = mysqli_real_escape_string($connection, $userData["date"]);

    $query1 = "SELECT * FROM tbldoctor WHERE account_id = '$accountID'";
    $result = mysqli_query($connection, $query1);

    if($result === false){
        die("Error in query: " . mysqli_error($connection));
    }

    $doctor = mysqli_fetch_assoc($result);
    $doctorID = $doctor["doctor_id"];

    //check first if the date is not taken (not in the database)

    $query2 = "SELECT date FROM tblschedule WHERE date = '$date'";
    $result = mysqli_query($connection, $query2);

    if($result === false){
        die("Error in query: " . mysqli_error($connection));
    }

    if(mysqli_num_rows($result) != 0){
        echo json_encode(array("success" => false, "message" => "Schedule is already taken. Please choose an available date."), JSON_PRETTY_PRINT);
        die();
    } 

    $query3 = "INSERT INTO tblschedule(doctor_id, date) VALUES('$doctorID', '$date')";
    $result = mysqli_query($connection, $query3);

    if($result === false){
        die("Error in query: " . mysqli_error($connection));
    }


    header('Content-Type: application/json');
    http_response_code(200);

    $response = [
        "success" => true,
        "schedule" => [
            "doctor_id" => $doctorID,
            "date" => $date
        ],
        "message" => "Appointment schedule set successfully."
    ];

    echo json_encode($response, JSON_PRETTY_PRINT);

}