import { createUser } from "./authentication.js";

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");

    const getUserData = () => {
        const firstname = document.getElementById("register-firstname").value;
        const lastname = document.getElementById("register-lastname").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const gender = document.getElementById("register-gender").value;
        const birthdate = document.getElementById("register-birthdate").value;
        const username = document.getElementById("register-username").value;
            
        const newUser = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            gender: gender,
            birthdate: birthdate,
            username: username
        }

        return newUser;
    }

    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const newUser = getUserData();
        createUser(newUser);
    });



});