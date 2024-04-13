import { requestToBeDoctor } from "./essentials.js";
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
    
    const handleAdminDashboard = () => {
        
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

        leftPane.innerHTML = leftPaneHTML;
        //add everything to the parent container
        contentContainer.appendChild(leftPane);
    }


    

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

