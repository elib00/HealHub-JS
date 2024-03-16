import { validateUser } from "./authentication.js";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const loginEmailInput = document.getElementById("login-email");
    const loginPasswordInput = document.getElementById("login-password");

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
        const result = await validateUser(pendingUser);
        if(result.success){
            console.log(result.success);
            console.log("hi");
            window.location.href = "dashboard.html";
        }else{
            loginEmailInput.classList.add("login-error");
            loginPasswordInput.classList.add("login-error");
            setTimeout(() => {
                loginEmailInput.classList.remove("login-error");
                loginPasswordInput.classList.remove("login-error");
            }, 1000);
        }
    });


    //button to go to register page
    const btnNavigateToRegister = document.getElementById("nav-to-register");
    btnNavigateToRegister.addEventListener("click", () => {
        window.location.href = "register.html";
    });

    //check box
    const checkbox = document.getElementById("keep-logged-in");
    const message = document.querySelector("[data-message]");
    checkbox.addEventListener("change", () => {
        if(checkbox.checked){
            message.style.color = "#6e63f5";
        }else{
            message.style.color = "gray";
        }
    });
});