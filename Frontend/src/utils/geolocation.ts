// Get geocoordinates
export const getGeocoordinates = async (place) => {
  const response = await fetch(
    `${import.meta.env.VITE_GOOGLE_GEOCODE}/json?address=${encodeURIComponent(place)}&key=${import.meta.env.VITE_GOOGLE_API}`
  );
  if (!response.ok) {
    throw new Error('Could not fetch geocoordinates');
  }

  const data = await response.json();
  if (!data.results?.length) {
    throw new Error('No geocoordinates found for place');
  }
  return data;
};

export const getCurrentLocation = async () => {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported');
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, (error) => {
      reject(new Error(error.message || 'Could not get current location'));
    }, {
      timeout: 10000,
      maximumAge: 60000,
      enableHighAccuracy: false,
    });
  });
};
