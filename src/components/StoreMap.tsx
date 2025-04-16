
import { useEffect, useRef, useState } from 'react';
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
  aiProcessedMap?: any;
  viewOnly?: boolean;
}

const StoreMap = ({ storeData, selectedItem, aiProcessedMap, viewOnly = false }: StoreMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

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

    // If we have AI processed map data with an image
    if (aiProcessedMap && aiProcessedMap.imageUrl) {
      map.current.on('load', () => {
        // This would be where you'd overlay the store layout image
        // For a real implementation, you would need to properly georeference the image
        console.log("AI map data available, would overlay store layout here");
        setImageLoaded(true);
        
        // Add aisles as lines if available
        if (aiProcessedMap.layout && aiProcessedMap.layout.aisles) {
          aiProcessedMap.layout.aisles.forEach((aisle: any) => {
            if (map.current && aisle.coordinates && aisle.coordinates.length >= 2) {
              map.current.addSource(`aisle-${aisle.id}`, {
                'type': 'geojson',
                'data': {
                  'type': 'Feature',
                  'properties': {
                    'name': aisle.name
                  },
                  'geometry': {
                    'type': 'LineString',
                    'coordinates': aisle.coordinates
                  }
                }
              });
              
              map.current.addLayer({
                'id': `aisle-${aisle.id}`,
                'type': 'line',
                'source': `aisle-${aisle.id}`,
                'layout': {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                'paint': {
                  'line-color': '#4287f5',
                  'line-width': 6
                }
              });
            }
          });
        }
        
        // Add sections as points if available
        if (aiProcessedMap.layout && aiProcessedMap.layout.sections) {
          aiProcessedMap.layout.sections.forEach((section: any) => {
            if (map.current && section.coordinates) {
              // Add marker for each section
              new mapboxgl.Marker({ color: '#2ca02c' })
                .setLngLat(section.coordinates)
                .setPopup(new mapboxgl.Popup().setHTML(`<h3>${section.name}</h3>`))
                .addTo(map.current);
            }
          });
        }
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [storeData, aiProcessedMap]);

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
      
      {aiProcessedMap && aiProcessedMap.imageUrl && !imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-5">
          <div className="text-center p-4">
            <p className="font-medium text-gray-700">Loading store layout...</p>
          </div>
        </div>
      )}
      
      <div ref={mapContainer} className="map-container h-[400px] rounded-lg" />
      
      {aiProcessedMap && aiProcessedMap.suggestions && aiProcessedMap.suggestions.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-medium mb-2">AI-Suggested Item Placements</h3>
          <div className="space-y-2">
            {aiProcessedMap.suggestions.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>{item.name}</span>
                <span className="text-gray-600">{item.section}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreMap;
