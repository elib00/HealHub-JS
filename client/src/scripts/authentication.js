export const createUser = async (newUser) => {
    try{
        const response = await axios.post("http://localhost:3000/server/endpoints/users/create_account.php", newUser);
        console.log(response.data);
    }catch(err){
        console.log(err.message);
        console.log(err.response.data);
    }
}

export const validateUser = async (pendingUser) => {
    try{
        const response = await axios.post("http://localhost:3000/server/endpoints/users/validate_user.php", pendingUser);
        console.log(response.data);
    }catch(err){
        console.log(err.message);
        console.log(err.response.data);
    }
}