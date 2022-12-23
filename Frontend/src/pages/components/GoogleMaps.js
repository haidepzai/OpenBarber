import React from 'react';
import GoogleMapReact from 'google-map-react';

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API;

const MapContainer = ({lat = 48.783333, lng = 9.183333, height = "100%", width = "100%"}) => {
  const defaultProps = {
    center: {
      lat: lat,
      lng: lng,
    },
    zoom: 11,
  };

  return (
    <div style={{ height: height, width: width }}>
      <GoogleMapReact 
        bootstrapURLKeys={{ key: GOOGLE_API_KEY }} 
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}>
        {/* Your map components go here */}
      </GoogleMapReact>
    </div>
  );
};

export default MapContainer;
