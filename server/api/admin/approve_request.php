<?php
include_once("../../connect.php");
include_once("../../includes/cors.php");
 
$method = $_SERVER["REQUEST_METHOD"];
 
if($method === "POST"){
    $userData = json_decode(file_get_contents('php://input'), true);
    $accountID = mysqli_real_escape_string($connection, $userData["account_id"]);
    $requestID = mysqli_real_escape_string($connection, $userData["request_id"]);
    $specialization = mysqli_real_escape_string($connection, $userData["specialization"]);

    $query1 = "UPDATE tbluseraccount SET user_type = 1 WHERE account_id = '$accountID'";
    $result = mysqli_query($connection, $query1);

    if($result === false){
        die("Error in query: " . mysqli_error($connection));
    }

    $query2 = "DELETE FROM tblupgraderequest WHERE request_id = '$requestID'";
    $result = mysqli_query($connection, $query2);
 
    if($result === false){
        die("Error in query: " . mysqli_error($connection));
    }


    $query3 = "INSERT INTO tbldoctor(account_id, specialization) VALUES ('$accountID', '$specialization')";
    
    if(mysqli_query($connection, $query3)){
        header('Content-Type: application/json');
        http_response_code(200);
    
        $response = [
            "success" => true,
            "created_data" => [
                "doctor_account" => [
                    "account_id" => $accountID,
                    "specialization" => $specialization
                ]
            ],
            "message" => "User account is now a Doctor."
        ];
    
        echo json_encode($response, JSON_PRETTY_PRINT);
    }else{
        die("Error in query: " . mysqli_error($connection));
    }

}