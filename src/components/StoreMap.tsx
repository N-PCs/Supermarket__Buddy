import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  const [mapboxToken, setMapboxToken] = useState('');

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('MAPBOX_TOKEN', mapboxToken);
    window.location.reload(); // Refresh to apply the token
  };

  // Check for existing token
  useEffect(() => {
    const savedToken = localStorage.getItem('MAPBOX_TOKEN');
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, []);

  if (!mapboxToken) {
    return (
      <div className="container mx-auto py-10 px-6">
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Mapbox Token Required</h2>
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div>
              <label htmlFor="mapboxToken" className="block text-sm font-medium text-gray-700">
                Mapbox Public Token
              </label>
              <input 
                type="text" 
                id="mapboxToken"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                placeholder="pk.ey..." 
                required 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Save Token
            </button>
          </form>
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>🔒 Your token is saved locally in browser storage.</p>
            <p>Get your token at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">mapbox.com</a></p>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!mapContainer.current) return;

    // If no store data is provided, use a default location
    const defaultLocation = {
      lat: 40.7128,
      lng: -74.0060
    };

    const center = storeData ? [storeData.lng, storeData.lat] : [defaultLocation.lng, defaultLocation.lat];

    mapboxgl.accessToken = mapboxToken;
    
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
  }, [storeData, aiProcessedMap, mapboxToken]);

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

  }, [selectedItem, mapboxToken]);

  return (
    <div className="relative">
      {!mapboxToken ? (
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
