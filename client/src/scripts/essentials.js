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

export const numberToMonth = (number) => {
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

    return months[number];
};
