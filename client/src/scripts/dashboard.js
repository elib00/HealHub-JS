import { requestToBeDoctor, getDoctorUpgradeRequests, approveRequest, rejectRequest, setSchedule } from "./essentials.js";
import { getCookie } from "./cookieHandler.js";
import { deleteCookie } from "./cookieHandler.js";

document.addEventListener("DOMContentLoaded", async () => {

    const handleUserDashboard = (userData) => {
        generateUserPage();
        const doctorRequestBtn = document.getElementById("doctor-request-button");
    
        doctorRequestBtn.addEventListener("click", async () => {
            const doctorSpecialization = document.getElementById("doctor-specialization").value;
            console.log(userData);
            const result = await requestToBeDoctor({specialization: doctorSpecialization, ...userData});
            console.log(result);
        });
    };
    
    const handleDoctorDashboard = (userData) => {
        generateDoctorPage(userData);
        const setScheduleBtn = document.getElementById("set-schedule-button");

        setScheduleBtn.addEventListener("click", async (event) => {
            event.preventDefault();
            const schedule = document.getElementById("schedule-date").value;
            console.log(schedule);

            const data = {
                account_id: userData.account_id,
                date: schedule,
            }

            console.log(data);
            const result = await setSchedule(data);
            console.log(result);
        });
    };
    
    const handleAdminDashboard = async (userData) => {
        await generateAdminPage();
    }
    
    const generateUserPage = () => {
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

        

        leftPane.innerHTML = leftPaneHTML;
        //add everything to the parent container
        contentContainer.appendChild(leftPane);
        contentContainer.appendChild(rightPane);
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

        const result = await getDoctorUpgradeRequests();
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

    const generateDoctorPage = () => {
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
        `;

        const rightPane = document.createElement("div");
        rightPane.className = "right-pane";

        leftPane.innerHTML = leftPaneHTML;
        contentContainer.appendChild(leftPane);
        contentContainer.appendChild(rightPane);
    }


    // ------------------ main logic ----------------------//

    const logoutBtn = document.getElementById("logout");    
    logoutBtn.addEventListener("click", () => {
        deleteCookie("currentUser");
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
            handleDoctorDashboard({...userData});
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
                result = await approveRequest(data);
                statusMessage.textContent = "User is now a Doctor.";
                statusTitle.textContent = "ACCEPTED";
                statusMessage.style.color = "green";
            }else{
                result = await rejectRequest(data);
                statusMessage.textContent = "Request to be a Doctor has been rejected.";
                statusTitle.textContent = "REJECTED";
                statusMessage.style.color = "red";
            }

            $("#status-modal").modal("show");
            console.log(result);
            targetElement.parentNode.remove();
        }); 
    });
}
