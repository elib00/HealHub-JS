<?php
include_once("../../connect.php");
include_once("../../includes/cors.php");
 
$method = $_SERVER["REQUEST_METHOD"];
 
if($method === "POST"){
    //get the data from the request body
    $userData = json_decode(file_get_contents('php://input'), true);
 
    //sanitize the input data
    $firstname = mysqli_real_escape_string($connection, $userData["firstname"]);
    $lastname = mysqli_real_escape_string($connection, $userData["lastname"]);
    $email = mysqli_real_escape_string($connection, $userData["email"]);
    $gender = mysqli_real_escape_string($connection, $userData["gender"]);
    $username = mysqli_real_escape_string($connection, $userData["username"]);
    $birthday = mysqli_real_escape_string($connection, $userData["birthday"]);
    $hashedPassword = password_hash($userData["password"], PASSWORD_BCRYPT);
    $password = mysqli_real_escape_string($connection, $hashedPassword);
    $usertype = "0";
 
    //check if the email is already taken
    $query = "SELECT * FROM user WHERE email = '$email'";
 
    //check if the credentials are already taken and if they are, kill the script
    $result = mysqli_query($connection, $query);
    if(mysqli_num_rows($result) > 0){
        die("Email address already in use.");
    }
 
    $query = "INSERT INTO tbluserprofile (firstname, lastname, gender, birthday) VALUES ('$firstname', '$lastname', '$gender', $birthday)";
 
    if(mysqli_query($connection, $query)) {
        // If insertion succeeds, return a success response
        header('Content-Type: application/json');
        http_response_code(200);
 
        // $userId = mysqli_insert_id($connection);
        $query = "INSERT INTO tbluseraccount (email, username, password, user_type) VALUES ('$email', '$username', '$password', $usertype)";

        $response = [
            "success" => true,
            "message" => "Account created successfully"
        ];

        echo json_encode($response, JSON_PRETTY_PRINT);
    } else {
        // If insertion fails, return an error response
        http_response_code(500); // Internal Server Error
        echo json_encode(array('error' => 'Error creating user'));
    }
 
    // Close the database connection
    // mysqli_close($connection);
}
 