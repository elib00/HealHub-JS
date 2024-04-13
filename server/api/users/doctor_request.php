<?php
include_once("../../connect.php");
include_once("../../includes/cors.php");
 
$method = $_SERVER["REQUEST_METHOD"];

if($method === "POST"){
    $userData = json_decode(file_get_contents('php://input'), true);

    $firstname = mysqli_real_escape_string($connection, $userData["firstname"]);
    $lastname = mysqli_real_escape_string($connection, $userData["lastname"]);
    $userID = mysqli_real_escape_string($connection, $userData["user_id"]);

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

    $query3 = "SELECT * FROM tbluseraccount WHERE user_id = '$userID'";
    $result = mysqli_query($connection, $query3);

    if($result === false){
        die("Error in query: " . mysqli_error($connection));
    }

    $row = mysqli_fetch_assoc($result);
    $accountID = $row["account_id"];

    $query4 = "INSERT INTO tbldoctor (account_id, specialization) VALUES ('$accountID', 'pediatrician')";
    
    if(mysqli_query($connection, $query4)){
        header('Content-Type: application/json');
        http_response_code(200);

        //update the user_type of the account
        $query5 = "UPDATE tbluseraccount SET user_type = 1 WHERE account_id = '$accountID'";
        $result = mysqli_query($connection, $query5);
        if($result === false){
            die("Error in query: " . mysqli_error($connection));
        }

        $response = [
            "success" => true,
            "created_data" => [
                "doctor_account" => [
                    "account_id" => $accountID,
                    "specialization" => "pediatrician"
                ]
            ],
            "message" => "User account is now a Doctor."
        ];
    
        echo json_encode($response, JSON_PRETTY_PRINT);
    }
}