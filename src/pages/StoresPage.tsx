
import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import SearchBar from '../components/SearchBar';
import StoreCard from '../components/StoreCard';

const StoresPage = () => {
  const { stores } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStores = searchQuery
    ? stores.filter(store => 
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : stores;

  return (
    <div className="container mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8">Find a Store</h1>
      
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
                itemCount: store.items.length
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
