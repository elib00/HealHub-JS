export const requestToBeDoctor = async (userData) => {
    try{
        const response = await axios.post("http://localhost:3000/server/api/users/doctor_request.php", userData);
        console.log(response.data);
        return response.data;
    }catch(err){
        console.log(err.message);
        console.log(err.response.data);
        return err.response.data;
    }
};

export const getDoctorUpgradeRequests = async () => {
    try{
        const response = await axios.get("http://localhost:3000/server/api/users/get_upgrade_requests.php");
        console.log(response.data);
        return response.data;
    }catch(err){
        console.log(err.message);
        console.log(err.response.data);
        return err.response.data;
    }
}