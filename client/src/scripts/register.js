import { postDataToServer } from "./essentials.js";

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    const modalResponseMessage = document.getElementById("modal-response-message");
    const responseTitle = document.getElementById("response-title");

    const getUserData = () => {
        const firstname = document.getElementById("register-firstname").value.trim();
        const lastname = document.getElementById("register-lastname").value.trim();
        const email = document.getElementById("register-email").value.trim();
        const password = document.getElementById("register-password").value.trim();
        let gender = null;

        const genderRadios = document.querySelectorAll("[name=gender-option]");
        genderRadios.forEach((radio) => {
            if(radio.checked){
                gender = radio.value;
            }
        });

        const month = document.getElementById("month-dropdown").value
        const year = document.getElementById("year-dropdown").value
        const day = document.getElementById("day-dropdown").value
        const birthdate = `${year}-${month}-${day}`;
        
        const username = document.getElementById("register-username").value.trim();
            
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
    };

    //create new user
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const response = getUserData();
        const result = await postDataToServer("users/create_account.php", {...response});
        if(result.success){
            responseTitle.textContent = "ACCOUNT CREATION SUCCESS"
            responseTitle.style.color = "green";
            modalResponseMessage.textContent = "User created successfully";
            $("#response-modal").modal("show");
            setTimeout(() => {
                window.location.replace("login.html");
            }, 2000);
        }else{
            responseTitle.textContent = "ACCOUNT CREATION FAILURE";
            responseTitle.style.color = "red";
            modalResponseMessage.textContent = result.message;
            $("#response-modal").modal("show");
        }
    });

    const inputsWithFocus = document.querySelectorAll("[data-focus]");
    const radioWrappers = document.querySelectorAll("[data-gender-wrapper] .gender-choice-wrapper");

    //selecting the gender when the wrapper div of the input is clicked
    //event delegation babyyyy
    radioWrappers.forEach((wrapper) => {
        wrapper.addEventListener("click", () => {
            const radio = wrapper.querySelector('input[type="radio"]');
            radio.checked = true;

            //remove the focused status from the other wrappers
            radioWrappers.forEach((otherWrapper) => {
                if (otherWrapper !== wrapper) {
                    otherWrapper.classList.remove("focused");
                }
            });

            wrapper.classList.toggle("focused");
        });
    });

    //remove ang outline sa mga inputs if ma click ang wrappers
    inputsWithFocus.forEach((input) => {
        input.addEventListener("focus", () => {
            radioWrappers.forEach((wrapper) =>{
                wrapper.classList.remove("focused");
            }); 
        });
    });

    //set the default birthdate input to the current date
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const monthDropdown = document.getElementById("month-dropdown");
    const dayDropdown = document.getElementById("day-dropdown");
    const yearDropdown = document.getElementById("year-dropdown");

    monthDropdown.value = month;
    dayDropdown.value = day;
    yearDropdown.value = year; 
});