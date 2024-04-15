import { requestToBeDoctor, getDoctorUpgradeRequests, approveRequest, rejectRequest } from "./essentials.js";
import { getCookie } from "./cookieHandler.js";
import { deleteCookie } from "./cookieHandler.js";

document.addEventListener("DOMContentLoaded", () => {
    const handleUserDashboard = () => {
        const userData = getCookie("currentUser");
        generateUserPage();

        const doctorRequestBtn = document.getElementById("doctor-request-button");
    
        doctorRequestBtn.addEventListener("click", async () => {
            const doctorSpecialization = document.getElementById("doctor-specialization").value;
            console.log(userData);
            const result = await requestToBeDoctor({specialization: doctorSpecialization, ...userData});
            console.log(result);
        });
    };
    
    const handleDoctorDashboard = () => {
        const userData = getCookie("currentUser");
    };
    
    const handleAdminDashboard = async () => {
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


    

    const logoutBtn = document.getElementById("logout");    
    logoutBtn.addEventListener("click", () => {
        deleteCookie("currentUser");
    });

    const userData = getCookie("currentUser"); //variable that dictates the view of the dashboard
    const userType = parseInt(userData.user_type);
    console.log(userType);

    if(userType === 0){
        handleUserDashboard();
    }else if(userType === 1){
        handleDoctorDashboard();
    }else if(userType === 2){
        handleAdminDashboard();
    }
});

const processDoctorRequest = (buttonArray, type) => {
    const requestOutcomeTitle = document.getElementById("request-outcome-title");
    const requestOutcomeMessage = document.getElementById("request-outcome-message");

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
                requestOutcomeMessage.textContent = "User is now a Doctor.";
                requestOutcomeTitle.textContent = "ACCEPTED";
                requestOutcomeTitle.style.color = "green";
            }else{
                result = await rejectRequest(data);
                requestOutcomeMessage.textContent = "Request to be a Doctor has been rejected.";
                requestOutcomeTitle.textContent = "REJECTED";
                requestOutcomeTitle.style.color = "red";
            }

            $("#request-outcome-modal").modal("show");
            console.log(result);
            targetElement.parentNode.remove();
        }); 
    });
}

