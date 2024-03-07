const createUser = async (e) => {
    e.preventDefault();
    const firstname = document.getElementById("register-firstname").value;
    const lastname = document.getElementById("register-lastname").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const gender = document.getElementById("register-gender").value;
    const birthday = document.getElementById("register-birthday").value;
    const username = document.getElementById("register-username").value;
    console.log(firstname, lastname, email, password);

    const newUser = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        gender: gender,
        birthday: birthday,
        username: username
    }
    
    try{
        const response = await axios.post("http://localhost:3000/HealHub/server/endpoints/users/create_account.php", newUser);
        console.log(response.data);
    }catch(err){
        console.log(err.message);
    }
}