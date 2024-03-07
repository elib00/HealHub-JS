<?php

 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Credentials: true");
 
$serverName = "localhost";
$username = "root";
$password = "";
$databaseName = "dbhealhub";
 
$connection = mysqli_connect($serverName, $username, $password, $databaseName);
 
if(!($connection)){
    die("ERROR: Connection failed.");
}
 