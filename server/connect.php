<?php

$serverName = "localhost";
$username = "root";
$password = "";
$databaseName = "dbnapiñasf1";
 
$connection = mysqli_connect($serverName, $username, $password, $databaseName);


if(!($connection)){
    die(mysqli_error($connection));
}