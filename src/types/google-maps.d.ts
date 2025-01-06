declare namespace google.maps {
    export interface AdvancedMarkerElement {
      new (options: AdvancedMarkerOptions): AdvancedMarkerElement;
      map: google.maps.Map | null;
      position: google.maps.LatLng | google.maps.LatLngLiteral;
      title?: string;
    }
  
    export interface AdvancedMarkerOptions {
      map: google.maps.Map;
      position: google.maps.LatLng | google.maps.LatLngLiteral;
      title?: string;
    }
  }