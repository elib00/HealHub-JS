import { requestToBeDoctor } from "./essentials.js";
import { getCookie } from "./cookieHandler.js";
import { deleteCookie } from "./cookieHandler.js";

document.addEventListener("DOMContentLoaded", () => {
    const doctorRequestBtn = document.getElementById("doctor-request-button");
    const logoutBtn = document.getElementById("logout");

    doctorRequestBtn.addEventListener("click", async () => {
        const userData = getCookie("currentUser");
        const doctorSpecialization = document.getElementById("doctor-specialization").value;
        console.log(userData);
        const result = await requestToBeDoctor({specialization: doctorSpecialization, ...userData});
        console.log(result);
    });

    logoutBtn.addEventListener("click", () => {
        deleteCookie("currentUser");
    });


});