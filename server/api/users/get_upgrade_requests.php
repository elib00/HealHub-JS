<?php
include_once("../../connect.php");
include_once("../../includes/cors.php");
 
$method = $_SERVER["REQUEST_METHOD"];

if($method === "GET"){
    $query1 = "SELECT * FROM tblupgraderequest";
    $result = mysqli_query($connection, $query1);

    if($result === false){
        die("Error in query: " . mysqli_error($connection));
    }

    $requests = [];

    while($row = mysqli_fetch_assoc($result)){
        $requests[] = $row;
    }

    header('Content-Type: application/json');
    http_response_code(200);

    $response = [
        "success" => true,
        "requests" => [...$requests],
        "message" => "Requests to be Doctor retrieved successfully."
    ];

    echo json_encode($response, JSON_PRETTY_PRINT);
}