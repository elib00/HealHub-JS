import { postDataToServer, getDataFromServer, numberToMonth } from "./essentials.js";
import { setCookie, getCookie, deleteCookie  } from "./cookieHandler.js";

document.addEventListener("DOMContentLoaded", async () => {
    const handleUserDashboard = async (userData) => {
        const appointments = await postDataToServer("users/get_user_appointments.php", {...userData});
        const doctorSchedulesData = await getDataFromServer("users/get_doctor_schedules.php");
        console.log(doctorSchedulesData);

        await generateUserPage(appointments, doctorSchedulesData);
        const doctorRequestBtn = document.getElementById("doctor-request-button");
    
        doctorRequestBtn.addEventListener("click", async () => {
            const doctorSpecialization = document.getElementById("doctor-specialization").value;
            console.log(userData);
            const result = await postDataToServer("users/doctor_request.php", {specialization: doctorSpecialization, ...userData});
            console.log(result);
        });
    };
    
    const handleDoctorDashboard = async (userData) => {
        const res = await postDataToServer("users/get_current_doctor.php", {...userData});
        const currentDoctor = res.doctor;

        const appointments = await postDataToServer("users/get_doctor_appointments.php", {
            doctor_id: currentDoctor.doctor_id
        });

        const doctorSchedules = await postDataToServer("users/get_schedules.php", {...userData});
        const appointmentRequests = await postDataToServer("users/get_appointment_requests.php", {...currentDoctor});
        await generateDoctorPage2({...userData}, {...currentDoctor}, appointments.appointments, doctorSchedules.schedules, appointmentRequests.appointment_requests);

        // const setScheduleBtn = document.getElementById("set-schedule-button");

        // const statusTitle = document.getElementById("status-title");
        // const statusMessage = document.getElementById("status-message");    

        // setScheduleBtn.addEventListener("click", async (event) => {
        //     event.preventDefault();
        //     const schedule = document.getElementById("schedule-date").value;
        //     console.log(schedule);

        //     const data = {
        //         account_id: userData.account_id,
        //         date: schedule,
        //     }

        //     console.log(data);
        //     const result = await postDataToServer("users/set_schedule.php", {...data});
        //     console.log(result);

        //     statusMessage.textContent = "Schedule created successfully.";
        //     statusTitle.textContent = "SCHEDULE CREATED";
        //     statusMessage.style.color = "green";
        //     $("#status-modal").modal("show");
            
        //     setTimeout(() => {
        //         window.location.replace("dashboard.html");
        //     }, 2000);
        // });
    };
    
    const handleAdminDashboard = async (userData) => {
        await generateAdminPage();
    }
    
    const generateUserPage = async (appointments, doctorSchedulesData) => {
        const contentContainer = document.getElementById("content-container");

        //create the left pane
        const leftPane = document.createElement("div");
        leftPane.className = "left-pane";

        let leftPaneHTML = `
            <h2>Request to be a doctor?</h2>
            <button class="btn btn-warning btn-request" data-toggle="modal"
            data-target="#doctor-request-modal">Request</button>
        `;

                //create the left pane
        const rightPane = document.createElement("div");
        rightPane.className = "right-pane";
        const cardContainer = document.createElement("div");
        cardContainer.className = "card-container";
    
        let cardContainerHTML = ``;

        // setCookie("doctorSchedules", doctorSchedules);
        const doctors = doctorSchedulesData.doctors;
        let doctorSchedules = {};

        for(let i = 0; i < doctors.length; i++) {
            const doctorDetails = doctors[i].doctor_details;
            const doctorSchedule = doctors[i].doctor_schedule;
            doctorSchedules = {...doctorSchedules, [doctorDetails.doctor_id]: doctorSchedule};

            cardContainerHTML += `<div class="content-card" data-doctor-id=${doctorDetails.doctor_id}>`;
            cardContainerHTML += `<h2>Doctor ${doctorDetails.doctor_name}</h2>`;
            cardContainerHTML += `<p style="text-align: start">${doctorDetails.doctor_email}</p>`;
            cardContainerHTML += `<p style="text-align: start">${doctorDetails.doctor_gender}</p>`;
            // cardContainerHTML += `<button class="btn btn-danger delete-card">&times</button>`;
            cardContainerHTML += '<button class="btn btn-success" data-open-appointments>Book Schedule</button>';
            cardContainerHTML += `</div>`;
        }

        cardContainer.innerHTML = cardContainerHTML;
        rightPane.appendChild(cardContainer);

        leftPane.innerHTML = leftPaneHTML;

        //add everything to the parent container
        contentContainer.appendChild(leftPane);
        contentContainer.appendChild(rightPane);
        const openAppointmentsButtons = document.querySelectorAll("[data-open-appointments]");
        processShowAppointments(openAppointmentsButtons, doctorSchedules);
    }

    const generateAdminPage = async () => {
        const contentContainer = document.getElementById("content-container");

        //create the table container
        const tableContainer = document.createElement("table");
        tableContainer.className = "table";
        tableContainer.style = "width: 80%; height: wrap-content; border: solid black 1px";

        const tableHeader = document.createElement("thead");
        tableHeader.className = "table-dark";

        let tableHeaderHTML = `
            <tr>
                <th scope="col">Request ID</th>
                <th scope="col">Account ID</th>
                <th scope="col">Specialization</th>
                <th scope="col">Action</th>
            </tr>
        `;

        tableHeader.innerHTML = tableHeaderHTML;

        const tableBody = document.createElement("tbody");

        const result = await getDataFromServer("users/get_upgrade_requests.php");
        const requests = result.requests;
        console.log(requests);

        let tableBodyHTML = ``;

        for(let i = 0; i < requests.length; i++) {
            tableBodyHTML += `<tr>`;
            tableBodyHTML += `<th data-request-id scope="row">${requests[i].request_id}</th>`;
            tableBodyHTML += `<td data-account-id> ${requests[i].account_id}</td>`;
            tableBodyHTML += `<td data-specialization> ${requests[i].specialization}</td>`;
            tableBodyHTML += `
                <td>
                    <button data-accept class="btn btn-success">Accept</button>
                    <button data-reject class="btn btn-danger">Reject</button>
                </td>
            `;

            tableBodyHTML += `</tr>`;

        }

        tableBody.innerHTML = tableBodyHTML;
        tableContainer.appendChild(tableHeader);
        tableContainer.appendChild(tableBody);

        const reportsButton = document.createElement('button');
        reportsButton.className = "btn btn-success";
        reportsButton.textContent = "Reports";
        reportsButton.addEventListener("click", () => {
            window.location = "reports.html";
        });

        contentContainer.appendChild(tableContainer);   
        contentContainer.appendChild(reportsButton);

        //add the event listeners for the accept buttons
        const acceptButtons = document.querySelectorAll("[data-accept]");
        const rejectButtons = document.querySelectorAll("[data-reject]");
        processDoctorRequest(acceptButtons, "accept");
        processDoctorRequest(rejectButtons, "reject");
    };

    const generateDoctorPage2 = async (userData, doctorData, doctorAppointments, schedules, appointmentRequests) => {

        const contentContainer = document.getElementById("content-container");

        const leftPane = document.createElement("div");
        leftPane.className = "left-pane";
        leftPane.style = "background-color: blanchedalmond; padding-top: 20px; padding-bottom: 20px; padding-left: 20px; width: 70%";

        let leftPaneHTML = `
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; 
                box-sizing: border-box; gap: 10px">
                <div id="doctor-name-wrapper" style="background-color: blue;">
                    <h2 style="margin-left: 10px; color: white">Hello, Doctor ${doctorData.doctor_name}</h2>
                </div>
                <div style="display: flex; height: calc(100% - 80px); width: 100%; gap: 1rem; box-sizing: border-box">
                    <div id="schedule-wrapper">
                        <h2 style="height: 10%;">Schedule</h2>
                        <div style="display: flex; justify-content: center; height: 90%; width: 100%; overflow-y: auto; box-sizing: border-box">
                            <table class="table-borderless custom-table">
                                <tbody>
        `;

        console.log(schedules.length);
        for(let i = 0; i < schedules.length; i++){
            const date = schedules[i].date;
            const nums = date.split("-");
            const year = nums[0];
            const month = numberToMonth(nums[1]);
            const day = nums[2];

            leftPaneHTML += `
                <tr>
                    <th scope="row">${month} ${day}, ${year}</th>
                    <td><i class="fa-solid fa-file-pen fa-xl btn-icon" style="color: green" data-edit-schedule data-schedule-id="${schedules[i].schedule_id}" title="Edit"></i></td>
                    <td><i class="fa-solid fa-xmark fa-xl btn-icon" style="color: red" data-cancel-schedule data-schedule-id="${schedules[i].schedule_id}" title="Cancel"></i></td>
                </tr>
            `;
        }

        leftPaneHTML += `
                                </tbody>
                            </table>
                        </div>
                    </div>
        `;

        leftPaneHTML += `
            <div id="appointment-request-wrapper">
                <h2 style="height: 10%;">Appointment Requests</h2>
                <div style="height: 90%; width: 100%; overflow-y: auto">
                    <table class="table-borderless custom-table">
                        <tbody>
        `;

        console.log(appointmentRequests);
        for(let i = 0; i < appointmentRequests.length; i++){
            leftPaneHTML += `
                <tr>
                    <th scope="row"><span style="margin-right: 10px">${appointmentRequests[i].name}</span> 
                        <i class="fa-solid fa-address-card fa-xl btn-icon" style="color: blue" data-view-user-details data-request-index="${i}" title="Details"></i></th>
                    
                    <td><i class="fa-solid fa-check fa-xl btn-icon" style="color: green" title="Approve" 
                        data-accept-request data-request-id="${appointmentRequests[i].request_id}"></i></td>

                    <td><i class="fa-solid fa-xmark fa-xl btn-icon" style="color: red" title="Reject"
                        data-reject-request data-request-id="${appointmentRequests[i].request_id}" ></i></td>
                </tr>
            `;
        }

        leftPaneHTML += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;

        
        const rightPane = document.createElement("div");
        rightPane.className = "right-pane";
        rightPane.style = "width: 30%; background-color: blanchedalmond";

        let rightPaneHTML = `
            <div id="doctor-calendar-container">
                <div style="width: 100%; flex: 1; border: solid black 1px; gap: 10px; 
                display: flex; flex-direction: column; align-items: center; justify-content: center">
                    <img style="width: 50%; height: 50%; border: solid black 1px">
                    <h2>Doctor ${doctorData.doctor_name}</h2>
                    <h3>${doctorData.doctor_specialization}</h3>
                </div>
                <div style="width: 100%; flex: 1; border: solid black 1px"></div>
            </div>
        `;


        leftPane.innerHTML = leftPaneHTML;
        rightPane.innerHTML = rightPaneHTML;
        contentContainer.append(leftPane);
        contentContainer.append(rightPane);

        const editScheduleButtons = document.querySelectorAll("[data-edit-schedule]");
        const cancelScheduleButtons = document.querySelectorAll("[data-cancel-schedule]");
        const viewUserDetailsButtons = document.querySelectorAll("[data-view-user-details]");
        const acceptAppointmentRequestButtons = document.querySelectorAll("[data-accept-request]");
        const rejectAppointmentRequestButtons = document.querySelectorAll("[data-reject-request]");
        

        processScheduleUpdate(editScheduleButtons, "edit");
        processScheduleUpdate(cancelScheduleButtons, "cancel");
        processViewUserDetails(viewUserDetailsButtons, [...appointmentRequests]);
    };

    const generateDoctorPage = async (userData, doctorData, doctorAppointments, doctorSchedules) => {
        const contentContainer = document.getElementById("content-container");
        const leftPane = document.createElement("div");
        leftPane.className = "left-pane";

        let leftPaneHTML = `
            <form id="set-schedule-form" class="mb-3">
                <div class="mb-3">
                    <input type="date" id="schedule-date">
                </div>
                <div class="mb-3">
                    <button type="submit" id="set-schedule-button" class="btn btn-success">Submit</button>
                </div>
            </form>
            <div class="mb-3">
                <button id="view-appointments-button" class="btn btn-success">Appointments</button>
            </div>
        `;

        const rightPane = document.createElement("div");
        rightPane.className = "right-pane";

        const tableContainer = document.createElement("table");
        tableContainer.className = "table";
        tableContainer.style = "width: 80%; height: wrap-content; border: solid black 1px";

        const tableHeader = document.createElement("thead");
        tableHeader.className = "table-dark";

        let tableHeaderHTML = `
            <tr>
                <th scope="col">Schedule ID</th>
                <th scope="col">Schedule Date</th>
                <th scope="col">New Schedule Date</th>
                <th scope="col">Action</th>
            </tr>
        `;
        

        tableHeader.innerHTML = tableHeaderHTML;

        const tableBody = document.createElement("tbody");

        const result = await postDataToServer("users/get_schedules.php", {...userData});
        const schedules = result.schedules;

        let tableBodyHTML = ``;

        for(let i = 0; i < schedules.length; i++) {
            tableBodyHTML += `<tr>`;
            tableBodyHTML += `<th data-schedule-id scope="row">${schedules[i].schedule_id}</th>`;
            tableBodyHTML += `<td data-schedule-date> ${schedules[i].date}</td>`;
            tableBodyHTML += `<td><input type="date" data-new-schedule></td>`;
            tableBodyHTML += `
                <td>
                    <button data-edit-schedule class="btn btn-success">Edit Schedule</button>
                    <button data-cancel-schedule class="btn btn-danger">Cancel Schedule</button>
                </td>
            `;

            tableBodyHTML += `</tr>`;

        }

        tableBody.innerHTML = tableBodyHTML;
        tableContainer.appendChild(tableHeader);
        tableContainer.appendChild(tableBody);

        leftPane.innerHTML = leftPaneHTML;
        rightPane.appendChild(tableContainer);
        contentContainer.appendChild(leftPane);
        contentContainer.appendChild(rightPane);

        //add the event listeners for the accept buttons
        const editScheduleButtons = document.querySelectorAll("[data-edit-schedule]");
        const cancelScheduleButtons = document.querySelectorAll("[data-cancel-schedule]");
        const viewAppointmentsButton = document.getElementById("view-appointments-button");

        viewAppointmentsButton.addEventListener("click", async () => {
            setCookie("currentDoctor", {...doctorData});
            setCookie("currentDoctorAppointments", {...doctorAppointments});
        });

        processScheduleUpdate(editScheduleButtons, "edit");
        processScheduleUpdate(cancelScheduleButtons, "cancel");
    }


    // ------------------ main logic ----------------------//

    const logoutBtn = document.getElementById("logout");    
    logoutBtn.addEventListener("click", () => {
        deleteCookie("currentUser");
        deleteCookie("rememberedUser");
    });


    //handling the case when the user has not logged in yet
    const statusTitle = document.getElementById("status-title");
    const statusMessage = document.getElementById("status-message");

    let userData; //variable that dictates the view of the dashboard
    userData = getCookie("currentUser");
    if(!userData) userData = getCookie("rememberedUser");
    if(!userData){
        statusTitle.textContent = "PAGE ACCESS NOT ALLOWED"
        statusTitle.style.color = "red";
        statusMessage.textContent = "Please log in a valid account first.";
        $("#status-modal").modal("show");

        setTimeout(() => {
            window.location.replace("index.html");
        }, 2000);
    }

    const userType = parseInt(userData.user_type);
    
    switch(userType){
        case 0:
            console.log("user");
            handleUserDashboard({...userData});
            break;
        case 1:
            console.log("doctor");
            await handleDoctorDashboard({...userData});
            break;
        case 2:
            console.log("admin");
            await handleAdminDashboard({...userData});
            break;
    }
});

const processDoctorRequest = (buttonArray, type) => {
    const statusTitle = document.getElementById("status-title");
    const statusMessage = document.getElementById("status-message");

    buttonArray.forEach(button => {
        button.addEventListener("click", async (event) => {
            const targetElement = event.target.closest("tr").querySelector("[data-request-id]");
            const requestID = targetElement.textContent;
            const accountID = targetElement.nextElementSibling.textContent;
            const specialization = targetElement.nextElementSibling.nextElementSibling.textContent;
            let result = null;

            const data = {
                request_id: requestID,
                account_id: accountID,
                specialization: specialization
            };
    
            if(type === "accept"){
                result = await postDataToServer("admin/approve_request.php", {...data});
                statusMessage.textContent = "User is now a Doctor.";
                statusTitle.textContent = "ACCEPTED";
                statusMessage.style.color = "green";
            }else{
                result = await postDataToServer("admin/reject_request.php", {...data});
                statusMessage.textContent = "Request to be a Doctor has been rejected.";
                statusTitle.textContent = "REJECTED";
                statusMessage.style.color = "red";
            }

            $("#status-modal").modal("show");
            console.log(result);
            targetElement.parentNode.remove();
        }); 
    });
};

const processScheduleUpdate = (buttonArray, type) => {
    const statusTitle = document.getElementById("status-title");
    const statusMessage = document.getElementById("status-message");

    //for the schedule modify modal
    const editCalendar = document.getElementById("edit-schedule-calendar");
    const sendModifyRequestButton = document.getElementById("schedule-modify-button");
    const scheduleModifyTitle = document.getElementById("schedule-modify-title");
    const scheduleModifySmall = document.getElementById("schedule-modify-small");
    const scheduleModifyLabel = document.getElementById("schedule-modify-label");

    buttonArray.forEach(button => {
        button.addEventListener("click", async (event) => {
            const targetElement = event.target.closest("tr").querySelector("[data-edit-schedule]");
            const scheduleID = targetElement.getAttribute("data-schedule-id");
            let result = null;
            let scheduleData = {};


            if(type === "edit"){
                //modifying the content of the modal
                sendModifyRequestButton.classList.remove("btn-danger");
                sendModifyRequestButton.classList.add("btn-success");
                sendModifyRequestButton.textContent = "Proceed Edit Schedule";
                scheduleModifyTitle.textContent = "Edit Schedule";
                scheduleModifySmall.textContent = "Change your schedule based on your availability";
                scheduleModifyLabel.style.display = "block";
                scheduleModifyLabel.textContent = "New Schedule";
                editCalendar.style.display = "block";
                
                $("#schedule-modify-modal").modal("show");

                sendModifyRequestButton.addEventListener("click", async () => {
                    scheduleData = {
                        schedule_id: scheduleID,
                        date: editCalendar.value
                    }

                    result = await postDataToServer("users/edit_schedule.php", {...scheduleData});
                    $("#schedule-modify-modal").modal("hide");
                    console.log(result);
                    statusMessage.textContent = "Schedule updated successfully.";
                    statusTitle.textContent = "UPDATE SCHEDULE";
                    statusMessage.style.color = "green";

                    $("#status-modal").modal("show");
                    console.log(result);
                    setTimeout(() => {
                        window.location.replace("dashboard.html");
                    }, 2000);
                });
            }else{                
                sendModifyRequestButton.classList.remove("btn-success");
                sendModifyRequestButton.classList.add("btn-danger");
                sendModifyRequestButton.textContent = "Proceed Cancel Schedule?";
                scheduleModifyTitle.textContent = "Cancel Schedule";
                scheduleModifySmall.textContent = "That' okay! We can't control unforeseen events in our life";
                scheduleModifyLabel.style.display = "none";
                editCalendar.style.display = "none";
                

                $("#schedule-modify-modal").modal("show");

                sendModifyRequestButton.addEventListener("click", async () => {
                    scheduleData = {schedule_id: scheduleID};
                    result = await postDataToServer("users/cancel_schedule.php", {...scheduleData});
                    statusMessage.textContent = "Schedule has been cancelled successfully.";
                    statusTitle.textContent = "CANCEL SCHEDULE";
                    statusMessage.style.color = "red";
                    // targetElement.parentNode.remove();

                    $("#schedule-modify-modal").modal("hide");
                    $("#status-modal").modal("show");
                    console.log(result);
                    setTimeout(() => {
                        window.location.replace("dashboard.html");
                    }, 2000);
                });
            }
        }); 
    });
};

const processShowAppointments = (buttonArray, doctorSchedules) => {
    console.log(doctorSchedules);
    const appointmentsBody = document.getElementById("appointments-body");

    buttonArray.forEach((button) => {
        button.addEventListener("click", async (event) => {
            appointmentsBody.innerHTML = "";
            const doctorCard = event.target.closest(".content-card");

            const doctorID = doctorCard.getAttribute("data-doctor-id");
            const schedules = doctorSchedules[doctorID];
        
            for(let i = 0; i < schedules.length; i++) {
                let appointmentCard = document.createElement("div");
                appointmentCard.className = "appointment-card";
                let appointmentCardHTML = `
                    <h3><span style="color: red">WHEN: </span>${schedules[i].date}</h3>`;

                if(schedules[i].is_available === "1"){
                    appointmentCardHTML += `<button data-book-appointment class="btn btn-success">Book</button>`;
                }else{
                    appointmentCardHTML += `<div style="unavailable">
                                                <p>Schedule already booked</p>                            
                                        </div>`
                }
                
                appointmentCard.innerHTML = appointmentCardHTML;
                appointmentsBody.appendChild(appointmentCard);

                const bookButton = appointmentCard.querySelector("[data-book-appointment]");

                if(!bookButton) continue;

                bookButton.addEventListener("click", async () => {
                    const currentUser = getCookie("currentUser");
                    let appointmentDetails = {
                        patient_id: currentUser.user_id,
                        doctor_id: doctorID,
                        schedule_id: schedules[i].schedule_id
                    };

                    const res = await postDataToServer("users/book_appointment.php", {...appointmentDetails});
                    console.log(res);
                    window.location.replace("dashboard.html");
                });
                
            }

            $("#book-appointment-modal").modal("show");
        });
    });
}

const processViewUserDetails = (buttonArray, appointmentRequests) => {
    buttonArray.forEach((button) => {
        button.addEventListener("click", () => {
            const appointmentIndex = button.getAttribute("data-request-index");
            const appointmentRequest = appointmentRequests[appointmentIndex];
            console.log(appointmentRequest);
        });
    });
};
