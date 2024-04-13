<?php

include_once("../../connect.php");
include_once("../../includes/cors.php");
 
$method = $_SERVER["REQUEST_METHOD"];
 
if($method === "POST"){
    $userData = json_decode(file_get_contents('php://input'), true);
 
    //sanitize the input data
    $email = mysqli_real_escape_string($connection, $userData["email"]);
    $inputPassword = mysqli_real_escape_string($connection, $userData["password"]);
 
    $query = "SELECT * FROM tbluseraccount WHERE email = '$email'";
    $result = mysqli_query($connection, $query);
    if(mysqli_num_rows($result) == 0){
        http_response_code(404);
        echo json_encode(array("success" => false, "message" => "User not found. Please try again."), JSON_PRETTY_PRINT);
        die();
    }
 
    //get the row for the user account
    $userAccount = mysqli_fetch_assoc($result);
    // echo json_encode($row);
 
    $dbPassword = $userAccount["password"];
    if(password_verify($inputPassword, $dbPassword)){
        header('Content-Type: application/json');
        http_response_code(200);

        //find the user profile (using the user account_id) associated with the email address and echo it back to the client
        $target_id = $userAccount["user_id"];
        $query = "SELECT * FROM tbluserprofile WHERE user_id = $target_id";

        $result = mysqli_query($connection, $query);
        if($result){
            $user = mysqli_fetch_assoc($result);
            $response = [
                "success" => true,
                "user" => [
                    "user_id" => $user["user_id"],
                    "account_id" => $userAccount["account_id"],
                    "user_type" => $userAccount["user_type"],
                    "firstname" => $user["firstname"],
                    "lastname" => $user["lastname"],
                    "gender" => $user["gender"],
                    "birthdate" => $user["birthdate"]
                ],
                "message" => "User found in the database. Validation successful.",
            ];
    
            echo json_encode($response, JSON_PRETTY_PRINT);
            exit();
        }
    }else{
        http_response_code(401);
        echo json_encode(array("success" => false, "message" => "Incorrect password. Please try again."), JSON_PRETTY_PRINT);
    }  
}