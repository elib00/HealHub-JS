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

export const dateFormatToString = (date) => {
    const months = {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December"
    }

    const nums = date.split("-");
    const year = nums[0];
    const month = months[nums[1]];
    const day = nums[2];

    return `${month} ${day}, ${year}`;
};

export const calculateAge = (dateOfBirthString) => {
    const dob = new Date(dateOfBirthString);
    const today = new Date();
  
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
  
    return age;
}
