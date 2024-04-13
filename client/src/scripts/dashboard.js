import { requestToBeDoctor } from "./essentials.js";
import { getCookie } from "./cookieHandler.js";

document.addEventListener("DOMContentLoaded", () => {
    const doctorRequestBtn = document.getElementById("doctor-request-button");

    doctorRequestBtn.addEventListener("click", async () => {
        const userData = getCookie("currentUser");
        // console.log(userData);
        const result = await requestToBeDoctor({...userData});
        console.log(result);
    });
});