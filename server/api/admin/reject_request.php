<?php
include_once("../../connect.php");
include_once("../../includes/cors.php");

$method = $_SERVER["REQUEST_METHOD"];

if($method === "POST"){
    $userData = json_decode(file_get_contents('php://input'), true);
    $requestID = mysqli_real_escape_string($connection, $userData["request_id"]);

    $query1 = "DELETE FROM tblupgraderequest WHERE request_id = $requestID";
    $result = mysqli_query($connection, $query1);

    if($result === false){
        die("Error in query: " . mysqli_error($connection));
    }

    echo json_encode(array("success" => true, "rejected_user" => $userData, "message" => "Doctor request rejected."), JSON_PRETTY_PRINT);
}
