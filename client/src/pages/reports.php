<?php    
    include_once '../../../server/connect.php'; 
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reports</title>
    <link rel="stylesheet" href="../styles/index.css">
    <link rel="stylesheet" href="../styles/reports.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

</head>
<body>
    <div class="page-header">
        <div class="page-logo">
        HealHub
        </div>

        <div class="page-navbar">
        <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="about-us.html">About Us</a></li>
            <li><a href="contact-us.html">Contact Us</a></li>
        </ul>
        </div>

        <div class="navbar-button-container">
        <a href="index.html">
            <button class="buttons" style="background-color: red" id="logout">Log Out</button>
        </a>
        </div>
    </div>

      
<?php 

//list of all doctors
// SELECT  * from student_address INNER JOIN student_marks on student_address.sid=student_marks.sid;


//for displaying the table

$qMaleDoctors = "SELECT 
                    up.firstname as user_fname, 
                    up.lastname as user_lname, 
                    d.specialization as doctor_specialization
                FROM tbluseraccount ua   
                JOIN tbluserprofile up ON up.user_id = ua.user_id 
                JOIN tbldoctor d ON d.account_id = ua.account_id 
                WHERE ua.user_type = 1 
                AND up.gender = 'Male'";
$resultMaleDoctors = mysqli_query($connection, $qMaleDoctors);

$qFemaleDoctors = "SELECT 
                    up.firstname as user_fname, 
                    up.lastname as user_lname, 
                    d.specialization as doctor_specialization
                FROM tbluseraccount ua 
                JOIN tbluserprofile up ON up.user_id = ua.user_id 
                JOIN tbldoctor d ON d.account_id = ua.account_id 
                WHERE ua.user_type = 1 
                AND up.gender = 'Female'";
$resultFemaleDoctors = mysqli_query($connection, $qFemaleDoctors);

// displaying table 3

$qSpecialization = "SELECT up.firstname as user_fname, 
                    up.lastname as user_lname, 
                    up.gender as user_gender, 
                    d.specialization as doctor_specialization 
                    FROM tbluseraccount ua 
                    JOIN tbluserprofile up ON up.user_id = ua.user_id 
                    JOIN tbldoctor d ON d.account_id = ua.account_id 
                    ORDER BY d.specialization";
$resSpe = mysqli_query($connection, $qSpecialization);


//for displaying the first chart - count of all and female doctors
$qMaleDoctorsCount = "SELECT 
                    COUNT(*) as total_male_doctors
                    FROM tbluseraccount ua   
                    JOIN tbluserprofile up ON up.user_id = ua.user_id
                    JOIN tbldoctor d ON d.account_id = ua.account_id 
                    WHERE ua.user_type = 1 
                    AND up.gender = 'Male'";
$resultMaleDoctorsCount = mysqli_query($connection, $qMaleDoctorsCount);
$rowMaleDoctors = mysqli_fetch_assoc($resultMaleDoctorsCount);
$totalMaleDoctors = $rowMaleDoctors['total_male_doctors'];

$qFemaleDoctorsCount = "SELECT 
                    COUNT(*) as total_female_doctors
                    FROM tbluseraccount ua 
                    JOIN tbluserprofile up ON up.user_id = ua.user_id
                    JOIN tbldoctor d ON d.account_id = ua.account_id 
                    WHERE ua.user_type = 1 
                    AND up.gender = 'Female'";
$resultFemaleDoctorsCount = mysqli_query($connection, $qFemaleDoctorsCount);
$rowFemaleDoctors = mysqli_fetch_assoc($resultFemaleDoctorsCount);
$totalFemaleDoctors = $rowFemaleDoctors['total_female_doctors'];


//patient acc to gender

$qMalePatientsCount = "SELECT COUNT(*) as total_male_patients FROM tbluserprofile up JOIN tbluseraccount ua ON up.user_id = ua.user_id  WHERE up.gender = 'Male' AND ua.user_type = 0";
$resultMalePatientsCount = mysqli_query($connection, $qMalePatientsCount);
$rowMalePatients = mysqli_fetch_assoc($resultMalePatientsCount);
$totalMalePatients = $rowMalePatients['total_male_patients'];

$qFemalePatientsCount = "SELECT COUNT(*) as total_female_patients FROM tbluserprofile up JOIN tbluseraccount ua ON up.user_id = ua.user_id  WHERE up.gender = 'Female' AND ua.user_type = 0";
$resultFemalePatientsCount = mysqli_query($connection, $qFemalePatientsCount);
$rowFemalePatients = mysqli_fetch_assoc($resultFemalePatientsCount);
$totalFemalePatients = $rowFemalePatients['total_female_patients'];

$totalPatients = $totalMalePatients + $totalFemalePatients;

//PATIENT AGE
$PatientCountByAge = "SELECT 
    COUNT(*) AS patient_count,
    CASE
        WHEN FLOOR(DATEDIFF(CURRENT_DATE(), STR_TO_DATE(up.birthdate, '%Y-%m-%d')) / 365.25) BETWEEN 0 AND 17 THEN '0-17'
        WHEN FLOOR(DATEDIFF(CURRENT_DATE(), STR_TO_DATE(up.birthdate, '%Y-%m-%d')) / 365.25) BETWEEN 18 AND 35 THEN '18-35'
        WHEN FLOOR(DATEDIFF(CURRENT_DATE(), STR_TO_DATE(up.birthdate, '%Y-%m-%d')) / 365.25) BETWEEN 36 AND 50 THEN '36-50'
        WHEN FLOOR(DATEDIFF(CURRENT_DATE(), STR_TO_DATE(up.birthdate, '%Y-%m-%d')) / 365.25) BETWEEN 51 AND 65 THEN '51-65'
        ELSE '66+' END AS age_group FROM tbluserprofile up JOIN tbluseraccount ua ON up.user_id = ua.user_id  WHERE ua.user_type = 0
    GROUP BY age_group";

$resultPatientCountByAge = mysqli_query($connection, $PatientCountByAge);
$patientCountsData = [];
$ageGroups = [];

while ($row = mysqli_fetch_assoc($resultPatientCountByAge)) {
    $ageGroups[] = $row['age_group'];
    $patientCountsData[] = $row['patient_count'];
}

//DOCTOR SPECIALIZATION

$qDoctorCountBySpecialization = "SELECT d.specialization, COUNT(*) AS doctor_count
    FROM tbldoctor d
    JOIN tbluseraccount ua ON d.account_id = ua.account_id
    GROUP BY d.specialization";
$resultDoctorCountBySpecialization = mysqli_query($connection, $qDoctorCountBySpecialization);

$specializations = [];
$doctorCounts = [];

while ($row = mysqli_fetch_assoc($resultDoctorCountBySpecialization)) {
    $specializations[] = $row['specialization'];
    $doctorCounts[] = $row['doctor_count'];
}
?>



<div class="page-contents-container">
    <div class="header-container-report">
      <div class="header-text" style="display: flex; justify-content: center; margin-bottom: 1rem; margin-top: 1rem"> 
        <p style="width: auto;">List of all Male Doctors </p>
      </div>

      
    <table class = "tblrep" style="margin-right: 1.5rem; margin-left: 1.5rem"> 
        <thead>
                    <tr>
                        <th class = "tblrep2" > First Name</th>
                        <th class ="tblrep2" > Last Name </th>
                        <th class ="tblrep2" > Specialization </th>
                    </tr>
        </thead>
                <tbody>
                <?php while ($mdoctors = mysqli_fetch_assoc($resultMaleDoctors)){?>
                 
                        <tr> 
                            <td class ="tblrep" style="text-align: center;  "><?php echo $mdoctors['user_fname'] ?></td>
                            <td class ="tblrep" style="text-align: center;  "><?php echo $mdoctors['user_lname'] ?></td>
                            <td class = "tblrep" style="text-align: center; "><?php echo $mdoctors['doctor_specialization'] ?></td>
                           
                            </td>
                        </tr>
                        <?php }?>
                </tbody>
        </table>


        <div class="header-text" style="display: flex; justify-content: center; margin-bottom: 1rem; margin-top: 1rem"> 
        <p style="width: auto;">List of all Female Doctors </p>
        </div>

      <table class = "tblrep" style="margin-left: 1.5rem; margin-right: 1.5rem; margin-bottom: 2rem"> 

            <thead>
                    <tr>
                        <th class ="tblrep2"   > First Name</th>
                        <th class = "tblrep2" > Last Name </th>
                        <th class ="tblrep2" > Specialization </th>
                    </tr>
            </thead>
            <tbody>
            <?php while ($fdoctor = mysqli_fetch_assoc($resultFemaleDoctors)){?>
                    <tr> 
                        <td class ="tblrep" style="text-align: center;"><?php echo $fdoctor['user_fname'] ?></td>
                        <td class ="tblrep"  style="text-align: center;"><?php echo $fdoctor['user_lname'] ?></td>
                        <td class = "tblrep" style="text-align: center;"><?php echo $fdoctor['doctor_specialization'] ?></td>
                        </td>
                    </tr>
                    <?php }?>
            </tbody>
        
        </table>

        <div class="header-text" style="display: flex; justify-content: center; margin-bottom: 1rem; margin-top: 1rem"> 
                <p> List of Doctors According to Specialization </p>
        </div>

      <table class ="tblrep" style="margin-left: 1.5rem; margin-right: 1.5rem; margin-bottom: 2rem"> 

            <thead>
                <tr>
                    <th class= "tblrep2" > First Name</th>
                    <th class = "tblrep2" > Last Name </th>
                    <th class = "tblrep2" > Gender </th>
                    <th class = "tblrep2" > Specialization </th>
                </tr>
            </thead>
            <tbody>
            <?php while ( $specialization = mysqli_fetch_assoc($resSpe)){?>
                    <tr> 
                        <td class = "tblrep" style="text-align: center;"><?php echo $specialization['user_fname'] ?></td>
                        <td class = "tblrep" style="text-align: center;"><?php echo $specialization['user_lname'] ?></td>
                        <td class = "tblrep" style="text-align: center;"><?php echo $specialization['user_gender'] ?></td>
                        <td class ="tblrep" style="text-align: center;"><?php echo $specialization['doctor_specialization'] ?></td>
                        </td>
                    </tr>
                    <?php }?>
            </tbody>
        
        </table>


        <div class="charts-container" style="display: flex; justify-content: space-between; width: 80%; margin: auto">
            <div style="width: 40%;">
                <div class="header-text-report">
                    <p style = "font-size: 2rem">Statistics of Doctors According to Gender</p>
                </div>
                <canvas id="doctorChart" width="300" height="200" style="margin-top: 2%;"></canvas>
                <p style = "font-size: 1rem">Total Male Doctors: <?php echo $totalMaleDoctors; ?> &nbsp;  &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;Total Female Doctors: <?php echo $totalFemaleDoctors?></p>
            </div>

            <div style="width: 40%;">
                <div class="header-text-report">
                <p style="font-size: 2rem">Statistics of Doctors According to Specialization</p>
                </div>
                <canvas id="doctorSpecializationChart" width="300" height="200" style="margin-top: 2%;"></canvas>
               
            </div>
        </div>


        <div class="charts-container" style="display: flex; justify-content: space-between; width: 80%; margin: auto">
            <div style="width: 40%;">
                <div class="header-text-report">
                    <p style = "font-size: 1rem">Statistics of Patient According to Gender</p>
                </div>
                <canvas id="patientChart" width="300" height="200" style="margin-top: 2%;"></canvas>
                <p style = "font-size: 1rem">Total Male Patient: <?php echo $totalMalePatients; ?> &nbsp;  &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;Total Female Doctors: <?php echo $totalFemaleDoctors?></p>
            </div>

            <div style="width: 40%;">
                <div class="header-text-report">
                <p style = "font-size: 1rem">Statistics of Patients According to Age</p>
                </div>
                <canvas id="ageGroupChart" width="300" height="200" style="margin-top: 2%;"></canvas>
               
            </div>
        </div>
    


    <script>
        var ctx = document.getElementById('doctorChart').getContext('2d');
        var doctorChart = new Chart(ctx, {
            type: 'bar',
    data: {
        labels: ['Male Doctors', 'Female Doctors'],
            datasets: [{
                label:  ['Doctors'],
                backgroundColor: ['blue', 'pink'],
                data: [<?php echo $totalMaleDoctors; ?>, <?php echo $totalFemaleDoctors; ?>]
            }]
        },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    </script>



    
        <script>
    var ctx = document.getElementById('patientChart').getContext('2d');
    var patientChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Male Patients', 'Female Patients'],
            datasets: [{
                label: 'Patients',
                backgroundColor: ['blue', 'pink'],
                data: [<?php echo $totalMalePatients; ?>, <?php echo $totalFemalePatients; ?>]
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
</script>




<script>
    var ctx = document.getElementById('ageGroupChart').getContext('2d');
    var ageGroupChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: <?php echo json_encode($ageGroups); ?>,
            datasets: [{
                label: 'Patient Count',
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                data: <?php echo json_encode($patientCountsData); ?>
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1
                    }
                }]
            },
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Patients by Age Group'
            }
        }
    });
</script>


 


<script>
    var ctx = document.getElementById('doctorSpecializationChart').getContext('2d');
    var doctorSpecializationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: <?php echo json_encode($specializations); ?>,
            datasets: [{
                label: 'Number of Doctors',
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                data: <?php echo json_encode($doctorCounts); ?>
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1
                    }
                }]
            },
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Doctors by Specialization'
            }
        }
    });
</script>

</div>
</div>

</body>
</html>