import { calculateAge, dateFormatToString, postDataToServer } from "./essentials.js";
import { getCookie } from "./cookieHandler.js";


document.addEventListener("DOMContentLoaded", () => {
    const generateAppointmentsTable = async () => {
        const doctorAppointmentsTable = document.getElementById("doctor-appointments-table");
        const currentDoctor = getCookie("currentDoctor");
        const result = await postDataToServer("users/get_doctor_appointments.php", {
            doctor_id: currentDoctor.doctor_id
        });

        const appointments = result.appointments;
            
        let tableHTML = `
            <thead>
                <tr>
                    <th scope="col">Appointment Date</th>
                    <th scope="col">Patient ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Age</th>
                    <th scope="col">Birthday</th>
                    <th scope="col">Email</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
        `;

        for(let i = 0; i < appointments.length; i++){
            tableHTML += `
                <tr>
                    <td>
                        <p>${dateFormatToString(appointments[i].scheduled_date)} 
                        <i class="fa-solid fa-pen-to-square fa-xl btn-icon" 
                            style="color: green; margin-left: 1rem"
                            data-edit-appointment
                            data-schedule-id="${appointments[i].schedule_id}"></i></p>
                    </td>
                    <td>${appointments[i].patient_id}</td>
                    <td>${appointments[i].patient_name}</td>
                    <td>${calculateAge(appointments[i].patient_birthday)}</td>
                    <td>${dateFormatToString(appointments[i].patient_birthday)}</td>
                    <td>${appointments[i].patient_email}</td>
                    <td>
                        <button class="btn btn-success" data-process-appointment="process" data-schedule-id="${appointments[i].schedule_id}">Process</button>
                        <button class="btn btn-danger" data-process-appointment="cancel" data-schedule-id="${appointments[i].schedule_id}">Cancel</button>
                    </td>
                </tr>
            `;
        }

        tableHTML += `
            </tbody>
        `;

        doctorAppointmentsTable.innerHTML = tableHTML;

        const editAppointmentButtons = doctorAppointmentsTable.querySelectorAll("[data-edit-appointment]");
        const processAppointmentButtons = doctorAppointmentsTable.querySelectorAll("[data-process-appointment]");
        
        editAppointment(editAppointmentButtons);
        processAppointment(processAppointmentButtons);
    };


    generateAppointmentsTable();
    const returnDashboardButton = document.getElementById("return-dashboard-button");
    
    returnDashboardButton.addEventListener("click", () => {
        window.location.replace("dashboard.html");
    });

});

const editAppointment = (buttonArray) => {
    buttonArray.forEach((button) => {
        const appointmentEditTitle = document.getElementById("appointment-edit-title");
        const appointmentEditLabel = document.getElementById("appointment-edit-label");
        const editAppointmentCalendar = document.getElementById("appointment-edit-calendar");
        const editAppointmentButton = document.getElementById("appointment-edit-button");
        const appointmentEditSmall = document.getElementById("appointment-edit-small");

        const appointmentStatusTitle = document.getElementById("appointment-status-title");
        const appointmentStatusMessage = document.getElementById("appointment-status-message");

        const appointmentEditCloseModalButton = document.getElementById("appointment-edit-modal").querySelector("[data-close-modal]");
        const appointmentMessageCloseModalButton = document.getElementById("appointment-status-modal").querySelector("[data-close-modal]");

        // console.log(appointmentMessageCloseModalButton);
        // console.log(appointmentEditCloseModalButton)

        button.addEventListener("click", () => {
            appointmentEditTitle.textContent = "EDIT APPOINTMENT";
            appointmentEditTitle.style.color = "green";

            appointmentEditLabel.textContent = "Change your appointment date";
            appointmentEditSmall.textContent = "Make sure that it will not conflict with your other appointments";

            appointmentEditCloseModalButton.classList.add("btn-success");
            appointmentEditCloseModalButton.classList.remove("btn-danger");

            $("#appointment-edit-modal").modal("show");

            editAppointmentButton.addEventListener("click", async () => {
                const newAppointmentDate = editAppointmentCalendar.value;
                console.log(newAppointmentDate);

                if(newAppointmentDate === ""){
                    appointmentStatusTitle.textContent = "INVALID DATE";
                    appointmentStatusTitle.style.color = "red";

                    appointmentStatusMessage.textContent = "Please select a valid new appointment date.";

                    appointmentMessageCloseModalButton.classList.add("btn-danger");
                    appointmentMessageCloseModalButton.classList.remove("btn-sucess");

                    $("#appointment-edit-modal").modal("hide");
                    $("#appointment-status-modal").modal("show");
                }else{
                    console.log(button.getAttribute("data-schedule-id"));
                    const result = await postDataToServer("users/edit_appointment.php", {
                        appointment_id: button.getAttribute("data-schedule-id"),
                        new_date: newAppointmentDate
                    });

                    console.log(result);

                    appointmentStatusTitle.textContent = "EDIT SUCCESSFUL";
                    appointmentStatusTitle.style.color = "green";

                    appointmentStatusMessage.textContent = "Appointment schedule updated successfully.";
                
                    appointmentMessageCloseModalButton.classList.add("btn-success");
                    appointmentMessageCloseModalButton.classList.remove("btn-danger");
                    
                    $("#appointment-edit-modal").modal("hide");
                    $("#appointment-status-modal").modal("show");
                    setTimeout(() => {
                        window.location.replace("appointments.html");
                    }, 2000);
                }
            });
        });
    });
};

const processAppointment = (buttonArray) => {
    buttonArray.forEach((button) => {
        const appointmentProcessTitle = document.getElementById("appointment-process-title");
        const appointmentProcessCloseModalButton = document.getElementById("appointment-process-modal").querySelector("[data-close-modal]");
        const appointmentProcessMessage = document.getElementById("appointment-process-message");
        const appointmentProcessButton = document.getElementById("appointment-process-button");

        const appointmentStatusTitle = document.getElementById("appointment-status-title");
        const appointmentStatusMessage = document.getElementById("appointment-status-message");
        const appointmentStatusCloseModalButton = document.getElementById("appointment-status-modal").querySelector("[data-close-modal]");

        button.addEventListener("click", () => {
            const type = button.getAttribute("data-process-appointment");
            if(type === "process"){
                appointmentProcessTitle.textContent = "PROCESS APPOINTMENT";
                appointmentProcessTitle.style.color = "green";

                appointmentProcessCloseModalButton.classList.add("btn-success");
                appointmentProcessCloseModalButton.classList.remove("btn-danger");

                appointmentProcessMessage.textContent = "Complete appointment with this patient?";

                appointmentProcessButton.textContent = "Proceed";
                appointmentProcessButton.classList.add("btn-success");
                appointmentProcessButton.classList.remove("btn-danger"); 

                $("#appointment-process-modal").modal("show");

                appointmentProcessButton.addEventListener("click", async () => {
                    const result = await postDataToServer("users/process_appointment.php", {
                        schedule_id: button.getAttribute("data-schedule-id"),
                        type: "process"
                    });

                    console.log(result);
                    appointmentStatusTitle.textContent = "APPOINTMENT COMPLETED";
                    appointmentStatusTitle.style.color = "green";

                    appointmentStatusMessage.textContent = "Appointment with patient has been completed.";

                    appointmentStatusCloseModalButton.classList.add("btn-success");
                    appointmentStatusCloseModalButton.classList.remove("btn-danger");

                    $("#appointment-process-modal").modal("hide");
                    $("#appointment-status-modal").modal("show");

                    setTimeout(() => {
                        window.location.replace("appointments.html");
                    }, 2000);
                });


            }else{
                appointmentProcessTitle.textContent = "CANCEL APPOINTMENT";
                appointmentProcessTitle.style.color = "red";

                appointmentProcessCloseModalButton.classList.add("btn-danger");
                appointmentProcessCloseModalButton.classList.remove("btn-success");

                appointmentProcessMessage.textContent = "Cancel appointment with this patient?";

                appointmentProcessButton.textContent = "Cancel";
                appointmentProcessButton.classList.add("btn-danger");
                appointmentProcessButton.classList.remove("btn-success"); 

                $("#appointment-process-modal").modal("show");

                appointmentProcessButton.addEventListener("click", async () => {
                    const result = await postDataToServer("users/process_appointment.php", {
                        schedule_id: button.getAttribute("data-schedule-id"),
                        type: "cancel"
                    });

                    console.log(result);
                    appointmentStatusTitle.textContent = "APPOINTMENT CANCELLED";
                    appointmentStatusTitle.style.color = "red";

                    appointmentStatusMessage.textContent = "Appointment with patient has been cancelled.";

                    appointmentStatusCloseModalButton.classList.add("btn-danger");
                    appointmentStatusCloseModalButton.classList.remove("btn-success");

                    $("#appointment-process-modal").modal("hide");
                    $("#appointment-status-modal").modal("show");

                    setTimeout(() => {
                        window.location.replace("appointments.html");
                    }, 2000);
                });
            }


        });
    });
}