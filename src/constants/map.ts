export const mapContainerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '8px',
  };
  
export const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    mapId: process.env.REACT_APP_GOOGLE_MAPS_ID || 'DEMO_MAP_ID',
    styles: [
      {
        featureType: "all",
        elementType: "all",
        stylers: [{ visibility: "on" }]
      }
    ]
  };