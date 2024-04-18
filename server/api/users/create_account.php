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
    $birthdate = mysqli_real_escape_string($connection, $userData["birthdate"]);
    $hashedPassword = password_hash($userData["password"], PASSWORD_BCRYPT);
    $password = mysqli_real_escape_string($connection, $hashedPassword);
    $usertype = 0;
 
    //check if the email is already taken
    $query = "SELECT * FROM tbluseraccount WHERE email = '$email'";
    $result = mysqli_query($connection, $query);
    if($result === false){
        die("Error in query: " . mysqli_error($connection));
    }

    //check if the email is already taken and if it is, kill the script
    if(mysqli_num_rows($result) > 0){
        echo json_encode(array("success" => false, "message" => "Email address already in use"));
        die();
    }

    //check if the username is already taken
    $query = "SELECT * FROM tbluseraccount WHERE username = '$username'";
    $result = mysqli_query($connection, $query);
    if($result === false){
        die("Error in query: " . mysqli_error($connection));
    }
    
    //check if the username is already taken and if it is, kill the script
    if(mysqli_num_rows($result) > 0){
        echo json_encode(array("success" => false, "message" => "Username already in use"));
        die();
    }

 
    $query = "INSERT INTO tbluserprofile (firstname, lastname, gender, birthdate) VALUES ('$firstname', '$lastname', '$gender', '$birthdate')";
 
    if(mysqli_query($connection, $query)) {
        // If insertion succeeds, return a success response
        header('Content-Type: application/json');
        http_response_code(200);

        //last inserted id
        $user_id = mysqli_insert_id($connection);
 
        $query = "INSERT INTO tbluseraccount (user_id, email, username, password, user_type) VALUES ('$user_id', '$email', '$username', '$password', '$usertype')";

        if(mysqli_query($connection, $query)) {
            $response = [
                "success" => true,
                "created_data" => [
                    "user_profile" => [
                        "firstname" => $firstname,
                        "lastname" => $lastname,
                        "gender" => $gender,
                        "birthdate" => $birthdate
                    ],
                    "user_account" => [
                        "email" => $email,
                        "username" => $username,
                        "user_type" => $usertype
                    ]
                ],
                "message" => "Account created successfully"
            ];
    
            echo json_encode($response, JSON_PRETTY_PRINT);
        }else{
            http_response_code(500); // Internal Server Error
            echo json_encode(array("success" => false, "message" => "Error creating user account"), JSON_PRETTY_PRINT);
        }
    } else {
        // If insertion fails, return an error response
        http_response_code(500); // Internal Server Error
        echo json_encode(array("success" => false, "message" => "Error creating user profile"), JSON_PRETTY_PRINT);
    }
 
    // Close the database connection
    // mysqli_close($connection);
}else{
    echo json_encode(array("success" => false, "message" => "Type of method not supported or allowed in this endpoint."), JSON_PRETTY_PRINT);
}
 