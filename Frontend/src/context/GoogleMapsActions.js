import axios from "axios"

const google = axios.create({
    baseURL: process.env.REACT_APP_GOOGLE_GEOCODE,
    headers: {Authorization: `token ${process.env.REACT_APP_GOOGLE_API}`}
})

// Get geocoordinates
export const getGeocoordinates = async (place) => {
    const params = new URLSearchParams({
        q: place
    });

    const response = await google.get(`json?address=${params}`);
    console.log(response);
}