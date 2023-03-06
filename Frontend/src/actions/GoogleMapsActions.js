// Get geocoordinates
export const getGeocoordinates = async (place) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_GOOGLE_GEOCODE}/json?address=${place}&key=${process.env.REACT_APP_GOOGLE_API}`);
    console.log(`${process.env.REACT_APP_GOOGLE_GEOCODE}`);
    if (!response.ok) {
      throw new Error('Something went wrong');
    }

    const data = await response.json();
    const lat = data.results[0].geometry.location.lat;
    const lng = data.results[0].geometry.location.lng;
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getCurrentLocation = () => {
  if (navigator.permissions && navigator.permissions.query) {
    navigator.permissions.query({ name: 'geolocation' }).then((status) => {
      if (status.state === 'granted' || status.state === 'prompt') {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          console.log('lat: ' + lat, ' lng: ' + lng);
          return position;
        });
      }
    });
  } else {
    console.log(undefined);
  }
};
