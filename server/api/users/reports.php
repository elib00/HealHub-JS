<?php
include_once("../../connect.php");
include_once("../../includes/cors.php");
 
$method = $_SERVER["REQUEST_METHOD"];

if($method === "GET"){
    $query1 = "SELECT CONCAT(up.firstname, ' ', up.lastname) AS doctor_name, doctor_id, specialization FROM tbldoctor d" . 
              "";
}
