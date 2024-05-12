import { postDataToServer, getDataFromServer } from "./essentials.js";
import { setCookie, getCookie, deleteCookie  } from "./cookieHandler.js";

document.addEventListener("DOMContentLoaded", async () => {
    const handleUserDashboard = async (userData) => {
        const appointments = await postDataToServer("users/get_user_appointments.php", userData);
        console.log(appointments);
        await generateUserPage();
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

        console.log(appointments);

        await generateDoctorPage(userData);

        const setScheduleBtn = document.getElementById("set-schedule-button");

        const statusTitle = document.getElementById("status-title");
        const statusMessage = document.getElementById("status-message");    

        setScheduleBtn.addEventListener("click", async (event) => {
            event.preventDefault();
            const schedule = document.getElementById("schedule-date").value;
            console.log(schedule);

            const data = {
                account_id: userData.account_id,
                date: schedule,
            }

            console.log(data);
            const result = await postDataToServer("users/set_schedule.php", {...data});
            console.log(result);

            statusMessage.textContent = "Schedule created successfully.";
            statusTitle.textContent = "SCHEDULE CREATED";
            statusMessage.style.color = "green";
            $("#status-modal").modal("show");
            
            setTimeout(() => {
                window.location.replace("dashboard.html");
            }, 2000);
        });
    };
    
    const handleAdminDashboard = async (userData) => {
        await generateAdminPage();
    }
    
    const generateUserPage = async () => {
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

        const appointments = await getDataFromServer("users/get_doctor_schedules.php");
        const doctors = appointments.doctors;

        let doctorAppointments = {};

        for(let i = 0; i < doctors.length; i++) {
            const doctorDetails = doctors[i].doctor_details;
            const doctorSchedule = doctors[i].doctor_schedule;
            doctorAppointments = {...doctorAppointments, [doctorDetails.doctor_id]: doctorSchedule};

            cardContainerHTML += `<div class="content-card" data-doctor-id=${doctorDetails.doctor_id}>`;
            cardContainerHTML += `<h2>Doctor ${doctorDetails.doctor_name}</h2>`;
            cardContainerHTML += `<p style="text-align: start">${doctorDetails.doctor_email}</p>`;
            cardContainerHTML += `<p style="text-align: start">${doctorDetails.doctor_gender}</p>`;
            // cardContainerHTML += `<button class="btn btn-danger delete-card">&times</button>`;
            cardContainerHTML += '<button class="btn btn-success" data-open-appointments>Book Appointment</button>';
            cardContainerHTML += `</div>`;
        }

        setCookie("doctorAppointments", doctorAppointments);

        cardContainer.innerHTML = cardContainerHTML;
        rightPane.appendChild(cardContainer);

        leftPane.innerHTML = leftPaneHTML;

        //add everything to the parent container
        contentContainer.appendChild(leftPane);
        contentContainer.appendChild(rightPane);
        const openAppointmentsButtons = document.querySelectorAll("[data-open-appointments]");
        processShowAppointments(openAppointmentsButtons);
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
        contentContainer.appendChild(tableContainer);   

        //add the event listeners for the accept buttons
        const acceptButtons = document.querySelectorAll("[data-accept]");
        const rejectButtons = document.querySelectorAll("[data-reject]");
        processDoctorRequest(acceptButtons, "accept");
        processDoctorRequest(rejectButtons, "reject");
    };

    const generateDoctorPage = async (userData) => {
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

        viewAppointmentsButton.addEventListener("click", () => {
            console.log(getCookie("currentUser"));
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

    buttonArray.forEach(button => {
        button.addEventListener("click", async (event) => {
            const targetElement = event.target.closest("tr").querySelector("[data-schedule-id]");
            const scheduleID = targetElement.textContent;
            const newScheduleDate = document.querySelector("[data-new-schedule]").value;
            let result = null;

            const data = {
                schedule_id: scheduleID,
                date: newScheduleDate
            };

            console.log(data);
    
            if(type === "edit"){
                result = await postDataToServer("users/edit_schedule.php", {...data});
                statusMessage.textContent = "Schedule updated successfully.";
                statusTitle.textContent = "UPDATE SCHEDULE";
                statusMessage.style.color = "green";
            }else{
                result = await postDataToServer("users/cancel_schedule.php", {...data});
                statusMessage.textContent = "Schedule has been cancelled successfully.";
                statusTitle.textContent = "CANCEL SCHEDULE";
                statusMessage.style.color = "red";
                targetElement.parentNode.remove();
            }

            $("#status-modal").modal("show");
            console.log(result);
            setTimeout(() => {
                window.location.replace("dashboard.html");
            }, 2000);
        }); 
    });
};

const processShowAppointments = (buttonArray) => {
    const appointmentsBody = document.getElementById("appointments-body");

    buttonArray.forEach((button) => {
        button.addEventListener("click", async (event) => {
            appointmentsBody.innerHTML = "";
            const doctorCard = event.target.closest(".content-card");

            const doctorID = doctorCard.getAttribute("data-doctor-id");
            const doctorSchedules = getCookie("doctorAppointments")[doctorID];
            console.log(doctorSchedules);
        
            for(let i = 0; i < doctorSchedules.length; i++) {
                let appointmentCard = document.createElement("div");
                appointmentCard.className = "appointment-card";
                let appointmentCardHTML = `
                    <h3><span style="color: red">WHEN: </span>${doctorSchedules[i].date}</h3>`;

                if(doctorSchedules[i].is_available === "1"){
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
                        schedule_id: doctorSchedules[i].schedule_id
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
