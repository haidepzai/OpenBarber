import axios from "axios";

export const getEnterprises = async () => {
    const response = await fetch('http://localhost:8080/api/enterprises');
    const responseData = await response.json();
    return responseData;
}

export const getShop = async (id) => {
    const response = await axios.get('http://localhost:8080/api/enterprises/' + id);
    return response.data
}