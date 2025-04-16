
import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useData, Item } from '../contexts/DataContext';
import SearchBar from '../components/SearchBar';
import ItemCard from '../components/ItemCard';
import StoreMap from '../components/StoreMap';

const StorePage = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const { getStore, searchItems } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Handle invalid store ID
  if (!storeId) {
    return <Navigate to="/stores" />;
  }

  const store = getStore(storeId);
  
  // Handle store not found
  if (!store) {
    return <Navigate to="/stores" />;
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const results = searchItems(storeId, query);
    setSearchResults(results);
    setSelectedItem(null); // Clear selected item when searching
  };

  const handleGetDirections = (item: Item) => {
    setSelectedItem(item);
    // Scroll to map if needed
    document.getElementById('store-map')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
      <p className="text-gray-600 mb-8">{store.address}</p>
      
      {/* Search */}
      <div className="mb-10">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search for items in this store..."
        />
      </div>

      {/* Results and Map Container */}
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Search Results */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">
            {searchQuery 
              ? `Results for "${searchQuery}"`
              : "Popular Items"
            }
          </h2>
          
          {searchQuery && searchResults.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No items found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* If searching, show results. Otherwise show first few items */}
              {(searchQuery ? searchResults : store.items.slice(0, 5)).map(item => (
                <ItemCard 
                  key={item.id} 
                  item={item}
                  onGetDirections={() => handleGetDirections(item)} 
                />
              ))}
              
              {/* If not searching and no items */}
              {!searchQuery && store.items.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No items have been added to this store yet</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Store Map */}
        <div className="lg:col-span-3" id="store-map">
          <h2 className="text-xl font-semibold mb-4">Store Map</h2>
          <StoreMap 
            storeData={{
              lat: store.coordinates.lat,
              lng: store.coordinates.lng
            }}
            selectedItem={selectedItem ? {
              name: selectedItem.name,
              coordinates: selectedItem.coordinates
            } : undefined}
            viewOnly={true}
          />
          
          {selectedItem && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-medium">Directions to: {selectedItem.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                Aisle: {selectedItem.aisle} • Section: {selectedItem.section}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorePage;
