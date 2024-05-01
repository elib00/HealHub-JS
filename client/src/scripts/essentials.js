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

export const getSchedules = async (userData) => {
    try{
        const response = await axios.post("http://localhost:3000/server/api/users/get_schedules.php", userData);
        console.log(response.data);
        return response.data;
    }catch(err){
        console.log(err.message);
        console.log(err.response.data);
        return err.response.data;
    }
}

export const approveRequest = async (userData) => {
    try{
        const response = await axios.post("http://localhost:3000/server/api/admin/approve_request.php", userData);
        console.log(response.data);
        return response.data;
    }catch(err){
        console.log(err.message);
        console.log(err.response.data);
        return err.response.data;
    }
};

export const rejectRequest = async (userData) => {
    try{
        const response = await axios.post("http://localhost:3000/server/api/admin/reject_request.php", userData);
        console.log(response.data);
        return response.data;
    }catch(err){
        console.log(err.message);
        console.log(err.response.data);
        return err.response.data;
    }
};

export const setSchedule = async (userData) => {
    try{
        const response = await axios.post("http://localhost:3000/server/api/users/set_schedule.php", userData);
        console.log(response.data);
        return response.data;
    }catch(err){
        console.log(err.message);
        console.log(err.response.data);
        return err.response.data;
    }
};

export const editSchedule = async (userData) => {
    try{
        const response = await axios.post("http://localhost:3000/server/api/users/edit_schedule.php", userData);
        console.log(response.data);
        return response.data;
    }catch(err){
        console.log(err.message);
        console.log(err.response.data);
        return err.response.data;
    }
};

export const cancelSchedule = async (userData) => {
    try{
        const response = await axios.post("http://localhost:3000/server/api/users/cancel_schedule.php", userData);
        console.log(response.data);
        return response.data;
    }catch(err){
        console.log(err.message);
        console.log(err.response.data);
        return err.response.data;
    }
};

export const getDoctorAppointments = async () => {
    try{
        const response = await axios.get("http://localhost:3000/server/api/users/get_doctor_schedules.php");
        console.log(response.data);
        return response.data;
    }catch(err){
        console.log(err.message);
        console.log(err.response.data);
        return err.response.data;
    }
};

export const bookAppointment = async (appointmentData) => {
    try{
        const response = await axios.post("http://localhost:3000/server/api/users/book_appointment.php", appointmentData);
        console.log(response.data);
        return response.data;
    }catch(err){
        console.log(err.message);
        console.log(err.response.data);
        return err.response.data;
    }
}