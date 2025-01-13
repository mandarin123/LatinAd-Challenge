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
    mapId: 'AIzaSyDXATZeJNq59FfgyE3CiSKuvcCjHLp2joc',
    styles: [
      {
        featureType: "all",
        elementType: "all",
        stylers: [{ visibility: "on" }]
      }
    ]
  };