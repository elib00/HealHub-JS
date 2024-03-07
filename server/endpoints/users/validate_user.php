<?php

include_once("../../connect.php");
include_once("../../includes/cors.php");
 
$method = $_SERVER["REQUEST_METHOD"];
 
if($method === "POST"){
    $userData = json_decode(file_get_contents('php://input'), true);
 
    //sanitize the input data
    $email = mysqli_real_escape_string($connection, $userData["email"]);
    $inputPassword = mysqli_real_escape_string($connection, $userData["password"]);
 
    $query = "SELECT * FROM user WHERE email = '$email'";
 
    $result = mysqli_query($connection, $query);
    if(mysqli_num_rows($result) == 0){
        die("User not found.");
    }
 
    $row = mysqli_fetch_assoc($result);
    // echo json_encode($row);
 
    $dbPassword = $row["password"];
    if(password_verify($inputPassword, $dbPassword)){
        header('Content-Type: application/json');
        http_response_code(200);
   
        $response = [
            "message" => "User found in the database. Validation successful.",
            "data" => $row
        ];
 
        echo json_encode($response, JSON_PRETTY_PRINT);
        exit();
    }
 
    http_response_code(404);
    echo json_encode(array("error" => "User not found in the database"));
}