import axios from "axios";


const serviceUrl = `${process.env.REACT_APP_BACKEND_URL}/services/`;

export const deleteServiceById = async (id) => {
    try {
        const response = await axios.delete(`${serviceUrl}${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
        })
        return response;
    } catch (err) {
        throw new Error("Could not delete service");
    }    
}