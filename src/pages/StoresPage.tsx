
import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import SearchBar from '../components/SearchBar';
import StoreCard from '../components/StoreCard';
import { getUserLocation, getDistance } from '../utils/location';
import { toast } from '@/components/ui/sonner';
import { MapPin } from 'lucide-react';

// Using a more explicit type declaration to avoid the syntax error
interface StoreWithDistance extends Omit<ReturnType<typeof useData>['stores'][number], 'distance'> {
  distance?: number;
}

const StoresPage = () => {
  const { stores } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyStores, setNearbyStores] = useState<StoreWithDistance[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const detectLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const position = await getUserLocation();
      const { latitude, longitude } = position.coords;
      setUserLocation({ lat: latitude, lng: longitude });
      
      // Calculate distances and sort stores
      const storesWithDistance = stores.map(store => ({
        ...store,
        distance: getDistance(
          latitude,
          longitude,
          store.coordinates.lat,
          store.coordinates.lng
        )
      }));
      
      const sorted = storesWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      setNearbyStores(sorted);
      toast.success('Found stores near you!');
    } catch (error) {
      toast.error('Could not detect your location. Please allow location access.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const filteredStores = searchQuery
    ? (userLocation ? nearbyStores : stores).filter(store => 
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : (userLocation ? nearbyStores : stores);

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Find a Store</h1>
        <button
          onClick={detectLocation}
          disabled={isLoadingLocation}
          className="btn-secondary flex items-center gap-2"
        >
          <MapPin size={16} />
          {isLoadingLocation ? 'Detecting Location...' : 'Find Stores Near Me'}
        </button>
      </div>
      
      {/* Search */}
      <div className="mb-10">
        <SearchBar 
          onSearch={setSearchQuery}
          placeholder="Search for stores by name or location..."
        />
      </div>

      {/* Results */}
      {filteredStores.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStores.map(store => (
            <StoreCard 
              key={store.id} 
              store={{
                id: store.id,
                name: store.name,
                address: store.address,
                image: store.image,
                itemCount: store.items.length,
                distance: 'distance' in store ? store.distance : undefined
              }} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          {searchQuery ? (
            <div>
              <h3 className="text-xl font-medium mb-2">No stores match "{searchQuery}"</h3>
              <p className="text-gray-600">Try a different search term or browse all stores</p>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-medium mb-2">No stores available yet</h3>
              <p className="text-gray-600">Be the first to register your store!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StoresPage;
