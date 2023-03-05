import axios from "axios";

export const getEnterprises = async () => {
    const response = await fetch('http://localhost:8080/api/enterprises');
    const responseData = await response.json();
    return responseData;
}

export const getShop = async (id) => {
    const response = await axios.get('http://localhost:8080/api/enterprises/' + id);

    return response.data;
}

export const getShopByEmail = async (email) => {
    const config = {
        method: 'GET',
        params: {email: email},
    }
    const response = await axios.get('http://localhost:8080/api/enterprises/email', config);

    return response.data;
}

export const getShopByUser = async () => {
    const config = {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('tokenJWT')).token,
          },
    }
    const response = await axios.get('http://localhost:8080/api/enterprises/', config);

    return response.data;
}