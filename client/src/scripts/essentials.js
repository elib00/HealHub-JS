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
