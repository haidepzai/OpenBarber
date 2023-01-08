import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import React, { Fragment } from 'react';

const GoogleMaps = ({ lat = 48.783333, lng = 9.183333, height = '100%', width = '100%' }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API,
  });

  const center = {
    lat: lat, //TODO: Real Location for barbers
    lng: lng,
  };

  return (
    <Fragment>
      {isLoaded && (
        <GoogleMap center={center} zoom={15} mapContainerStyle={{ width: height, height: width }}>
          <Marker position={center} />
        </GoogleMap>
      )}
    </Fragment>
  );
};

export default GoogleMaps;
