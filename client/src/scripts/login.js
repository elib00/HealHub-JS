import { validateUser } from "./authentication.js";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    const handleFocus = (elem)  => {
        elem.style.outline = "solid #6e63f5 2px";
        elem.style.border = "none";
    }

    const handleBlur = (elem) => {
        elem.style.outline = "none";
        elem.style.border = "solid black 1px";
    }

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


    //button to go to registe page
    const btnNavigateToRegister = document.getElementById("nav-to-register");
    btnNavigateToRegister.addEventListener("click", () => {
        window.location.href="register.html";
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

    //adding focus effects to the input (js is slow)
    // const focusedInputs = document.querySelectorAll("[data-focus]");
    // focusedInputs.forEach((input) => {
    //     input.addEventListener("focus", () => {
    //         handleFocus(input);
    //     });

    //     input.addEventListener("blur", () => {
    //         handleBlur(input);
    //     });
    // });

});