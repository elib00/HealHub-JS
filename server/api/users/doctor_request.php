<?php
include_once("../../connect.php");
include_once("../../includes/cors.php");
 
$method = $_SERVER["REQUEST_METHOD"];

if($method === "POST"){
    $userData = json_decode(file_get_contents('php://input'), true);

    $firstname = mysqli_real_escape_string($connection, $userData["firstname"]);
    $lastname = mysqli_real_escape_string($connection, $userData["lastname"]);
    $userID = mysqli_real_escape_string($connection, $userData["user_id"]);
    $accountID = mysqli_real_escape_string($connection, $userData["account_id"]);
    $specialization = mysqli_real_escape_string($connection, $userData["specialization"]);

     //get the user information from user profile table based from the ids of the rows with user_type="1"/doctor
    $query1 = "SELECT * FROM tbluseraccount WHERE user_type = 1";
    $result = mysqli_query($connection, $query1);

    if($result === false){
        die("Error in query: " . mysqli_error($connection));
    }

    $user_ids = [];
    while($row = mysqli_fetch_assoc($result)){
        $user_ids[] = $row["user_id"];
    }

    //get all rows of doctors
    if(count($user_ids) > 0){
        $id_list = implode(",", $user_ids);
        $query2 = "SELECT * FROM tbluserprofile WHERE user_id IN ($id_list) AND firstname = '$firstname' AND lastname = '$lastname'";
        $result = mysqli_query($connection, $query2);

        if($result === false){
            die("Error in query: " . mysqli_error($connection));
        }

        if(mysqli_num_rows($result) != 0){
            echo json_encode(array("success" => false, "message" => "User is already a doctor."));
            die();
        }
    }

    //check in the requests db if the account is already in there
    $query4 = "SELECT * FROM tblupgraderequest WHERE account_id = '$accountID'";
    $result = mysqli_query($connection, $query4);

    if(mysqli_num_rows($result) != 0){
        echo json_encode(array("success" => false, "message" => "Request already sent. Account is currently being verified."));
        die();
    }

    //if the request has not been sent yet, insert it into the database for requests
    $query5 = "INSERT INTO tblupgraderequest (account_id, specialization) VALUES ('$accountID', '$specialization')";

    if(mysqli_query($connection, $query5)){
        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode(array("success" => true, "message" => "Request to be a doctor successfully sent. Account is now being verified."), JSON_PRETTY_PRINT);
    } 
}