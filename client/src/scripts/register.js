import { createUser } from "./authentication.js";

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");

    const getUserData = () => {
        const firstname = document.getElementById("register-firstname").value;
        const lastname = document.getElementById("register-lastname").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
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
    };

    const getGender = () => {
        
    };

    //create new user
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const newUser = getUserData();
        const result = await createUser(newUser);
        if(result.success){
            window.location.replace("login.html");
        }
    });

    const handleFocus = (elem)  => {
        elem.style.outline = "solid #6e63f5 2px";
        elem.style.border = "none";
    }

    const handleBlur = (elem) => {
        elem.style.outline = "none";
        elem.style.border = "solid black 1px";
    }

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