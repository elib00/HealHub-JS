import { validateUser } from "./authentication.js";
import { setCookie } from "./cookieHandler.js";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const loginEmailInput = document.getElementById("login-email");
    const loginPasswordInput = document.getElementById("login-password");
    const responseMessage = document.getElementById("response-message");
    const responseContainer = document.querySelector("[data-response-container]");
    const checkbox = document.getElementById("keep-logged-in");
    const message = document.querySelector("[data-message]");
    
    const getUserData = () => {
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        const pendingUser = {
            email: email,
            password: password
        }

        return pendingUser;
    }
    

    //submitting the login form
    //adding error login style
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const pendingUser = getUserData();
        console.log(pendingUser);
        const result = await validateUser({...pendingUser});
        if(result.success){
            console.log(result.success);

            if(checkbox.checked){
                setCookie("rememberedUser", result.user, 1);
            }

            setCookie("currentUser", result.user, 1);

            responseContainer.classList.toggle("success-wrapper");
            responseMessage.textContent = "Login successful"
            loginEmailInput.classList.add("login-success");
            loginPasswordInput.classList.add("login-success");

            setTimeout(() => {
                responseContainer.classList.toggle("success-wrapper");
                responseMessage.textContent = "";
                window.location.href = "dashboard.html";
            }, 1500);
        }else{
            responseMessage.textContent = result.message;
            loginEmailInput.classList.add("login-error");
            loginPasswordInput.classList.add("login-error");
            responseContainer.classList.toggle("error-wrapper");
            setTimeout(() => {
                loginEmailInput.classList.remove("login-error");
                loginPasswordInput.classList.remove("login-error");
                responseMessage.textContent = "";
                responseContainer.classList.toggle("error-wrapper");
            }, 1500);
        }
    });


    //button to go to register page
    const btnNavigateToRegister = document.getElementById("nav-to-register");
    btnNavigateToRegister.addEventListener("click", () => {
        window.location.href = "register.html";
    });

    //check box
    checkbox.addEventListener("change", () => {
        if(checkbox.checked){
            message.style.color = "#6e63f5";
        }else{
            message.style.color = "gray";
        }
    });
});