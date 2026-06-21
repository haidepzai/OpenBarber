// Get geocoordinates
export const getGeocoordinates = async (place) => {
  const response = await fetch(
    `${process.env.REACT_APP_GOOGLE_GEOCODE}/json?address=${encodeURIComponent(place)}&key=${process.env.REACT_APP_GOOGLE_API}`
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

  if (navigator.permissions && navigator.permissions.query) {
    const status = await navigator.permissions.query({ name: 'geolocation' });
    if (status.state !== 'granted' && status.state !== 'prompt') {
      throw new Error('Geolocation permission denied');
    }
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, (error) => {
      reject(new Error(error.message || 'Could not get current location'));
    });
  });
};
