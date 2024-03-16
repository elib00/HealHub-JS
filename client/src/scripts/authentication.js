export const createUser = async (newUser) => {
    try{
        const response = await axios.post("http://localhost:3000/server/api/users/create_account.php", newUser);
        console.log(response.data);
        return response.data;
    }catch(err){
        console.log(err.message);
        console.log(err.response.data);
        return err.response.data;
    }
}

export const validateUser = async (pendingUser) => {
    try{
        const response = await axios.post("http://localhost:3000/server/api/users/validate_user.php", pendingUser);
        console.log(response.data);
        return response.data;
    }catch(err){
        console.log(err.message);
        console.log(err.response.data);
        return err.response.data;
    }
}