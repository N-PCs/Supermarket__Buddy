
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// You'll need to replace this with your actual Mapbox token
// For production, this should be stored in environment variables or Supabase secrets
const MAPBOX_TOKEN = 'pk.placeholder'; // This is just a placeholder

interface StoreMapProps {
  storeData?: {
    lat: number;
    lng: number;
    layout?: any;
  };
  selectedItem?: {
    name: string;
    coordinates: [number, number];
  };
  viewOnly?: boolean;
}

const StoreMap = ({ storeData, selectedItem, viewOnly = false }: StoreMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // If no store data is provided, use a default location
    const defaultLocation = {
      lat: 40.7128,
      lng: -74.0060
    };

    const center = storeData ? [storeData.lng, storeData.lat] : [defaultLocation.lng, defaultLocation.lat];

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: center as [number, number],
      zoom: 17
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [storeData]);

  // Add or update marker when selected item changes
  useEffect(() => {
    if (!map.current || !selectedItem) return;

    // Remove existing marker if any
    if (marker.current) {
      marker.current.remove();
    }

    // Add a new marker for the selected item
    marker.current = new mapboxgl.Marker({ color: '#FF0000' })
      .setLngLat(selectedItem.coordinates)
      .addTo(map.current);

    // Pan to the marker
    map.current.flyTo({
      center: selectedItem.coordinates,
      zoom: 19,
      essential: true
    });
    
    // Add a popup to show item name
    new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(selectedItem.coordinates)
      .setHTML(`<h3>${selectedItem.name}</h3>`)
      .addTo(map.current);

  }, [selectedItem]);

  return (
    <div className="relative">
      {!MAPBOX_TOKEN || MAPBOX_TOKEN === 'pk.placeholder' ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center p-4">
            <p className="font-medium text-gray-700">Map functionality requires a Mapbox token</p>
            <p className="text-sm text-gray-500 mt-2">For a real implementation, connect to Supabase and add your Mapbox token as a secret</p>
          </div>
        </div>
      ) : null}
      <div ref={mapContainer} className="map-container" />
    </div>
  );
};

export default StoreMap;
