import { validateUser } from "./authentication.js";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    const getUserData = () => {
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        const pendingUser = {
            email: email,
            password: password
        }

        return pendingUser;
    }

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const pendingUser = getUserData();
        console.log(pendingUser);
        validateUser(pendingUser);
    });


    const btnNavigateToRegister = document.getElementById("nav-to-register");
    btnNavigateToRegister.addEventListener("click", () => {
        window.location.href="register.html";
    });

});