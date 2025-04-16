
import { useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';

// You should replace this with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

interface GoogleMapsLocationPickerProps {
  initialLocation?: { lat: number; lng: number };
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

const defaultCenter = {
  lat: 40.7128, // New York City coordinates as default
  lng: -74.0060
};

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem'
};

const GoogleMapsLocationPicker = ({ initialLocation, onLocationSelect }: GoogleMapsLocationPickerProps) => {
  const [markerPosition, setMarkerPosition] = useState(initialLocation || defaultCenter);
  const [address, setAddress] = useState('');
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  
  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPosition = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      
      setMarkerPosition(newPosition);
      
      // Get address from coordinates (reverse geocoding)
      if (geocoderRef.current) {
        geocoderRef.current.geocode({ location: newPosition }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const newAddress = results[0].formatted_address;
            setAddress(newAddress);
            onLocationSelect({ ...newPosition, address: newAddress });
          }
        });
      }
    }
  }, [onLocationSelect]);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    geocoderRef.current = new google.maps.Geocoder();
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MapPin size={18} className="text-blue-500" />
        <h3 className="font-medium">Select Store Location</h3>
      </div>
      
      {!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY' ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 text-center">
          <p className="text-gray-600">
            Google Maps integration requires an API key
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Replace 'YOUR_GOOGLE_MAPS_API_KEY' in GoogleMapsLocationPicker.tsx with your actual Google Maps API key
          </p>
        </div>
      ) : (
        <LoadScript
          googleMapsApiKey={GOOGLE_MAPS_API_KEY}
          libraries={["places", "geometry"]}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={markerPosition}
            zoom={15}
            onClick={onMapClick}
            onLoad={handleMapLoad}
          >
            <Marker position={markerPosition} />
          </GoogleMap>
        </LoadScript>
      )}
      
      {address && (
        <div className="text-sm text-gray-600">
          <strong>Selected address:</strong> {address}
        </div>
      )}
      
      <p className="text-xs text-gray-500">
        Click on the map to select your store's exact location
      </p>
    </div>
  );
};

export default GoogleMapsLocationPicker;
