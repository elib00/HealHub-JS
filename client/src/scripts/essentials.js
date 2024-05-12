export const postDataToServer = async (pathString, clientData) => {
    try{
        const response = await axios.post(`http://localhost:3000/server/api/${pathString}`, clientData);
        console.log(response.data);
        return response.data;
    }catch(err){
        console.log(err.message);
        console.log(err.response.data);
        return err.response.data;
    }
};

export const getDataFromServer = async (pathString) => {
    try{
        const response = await axios.get(`http://localhost:3000/server/api/${pathString}`);
        console.log(response.data);
        return response.data;
    }catch(err){
        console.log(err.message);
        console.log(err.response.data);
        return err.response.data;
    }
};




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

export const getDoctorSchedules = async () => {
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

export const getCurrentDoctor = async (userData) => {
    try{
        const response = await axios.post("http://localhost:3000/server/api/users/get_current_doctor.php", userData);
        console.log(response.data);
        return response.data;
    }catch(err){
        console.log(err.message);
        console.log(err.response.data);
        return err.response.data;
    }
}

export const getDoctorAppointments = async (doctorData) => {
    try{
        const response = await axios.post("http://localhost:3000/server/api/users/get_doctor_appointments.php", doctorData);
        console.log(response.data);
        return response.data;
    }catch(err){
        console.log(err.message);
        console.log(err.response.data);
        return err.response.data;
    }
}

export const getUserAppointments = async (userData) => {
    try{
        const response = await axios.post("http://localhost:3000/server/api/users/get_user_appointments.php", userData);
        console.log(response.data);
        return response.data;
    }catch(err){
        console.log(err.message);
        console.log(err.response.data);
        return err.response.data;
    }
}