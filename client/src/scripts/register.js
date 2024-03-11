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
    };

    const getGender = () => {
        
    };

    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const newUser = getUserData();
        createUser(newUser);
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

    //for the highlighting of outlines everytime an input is focused and blurred (js is slow so css pseudo-classes nalang)
    // inputsWithFocus.forEach((input) => {
    //     input.addEventListener("focus", (event) => {
    //         radioWrappers.forEach((wrapper) => {
    //             wrapper.classList.remove("focused");
    //         });

    //         handleFocus(input);
    //     })

    //     input.addEventListener("blur", () => {
    //         handleBlur(input);
    //     });
    // });

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

});