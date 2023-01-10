// Get geocoordinates
export const getGeocoordinates = async (place) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_GOOGLE_GEOCODE}json?address=${place}&key=${process.env.REACT_APP_GOOGLE_API}`);

        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        const data = await response.json();
        const lat = data.results[0].geometry.location.lat;
        const lng = data.results[0].geometry.location.lng;
        return data;
    } catch (e) {
        console.log(e);
    }    
}