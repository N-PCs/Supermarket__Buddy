
import { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useData, Item } from '../contexts/DataContext';
import ItemForm from '../components/ItemForm';
import StoreMap from '../components/StoreMap';

const ManageStorePage = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const { getStore, addItem } = useData();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showForm, setShowForm] = useState(true);

  // Handle invalid store ID
  if (!storeId) {
    return <Navigate to="/store-owner" />;
  }

  const store = getStore(storeId);
  
  // Handle store not found
  if (!store) {
    return <Navigate to="/store-owner" />;
  }

  const handleItemSubmit = (data: any) => {
    addItem({
      name: data.name,
      aisle: data.aisle,
      section: data.section,
      price: data.price,
      coordinates: data.coordinates,
      storeId: data.storeId
    });
    
    setShowForm(false);
    // Reset form after brief delay
    setTimeout(() => setShowForm(true), 100);
  };

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="flex flex-wrap items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage: {store.name}</h1>
          <p className="text-gray-600">{store.address}</p>
        </div>
        <Link 
          to={`/store/${storeId}`}
          className="btn-secondary mt-4 sm:mt-0"
        >
          View Store Page
        </Link>
      </div>
      
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-lg font-medium text-blue-800">{store.items.length}</h3>
          <p className="text-sm text-gray-600">Items Mapped</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="text-lg font-medium text-green-800">
            {store.items.reduce((acc, item) => acc.add(item.aisle), new Set<string>()).size}
          </h3>
          <p className="text-sm text-gray-600">Aisles</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <h3 className="text-lg font-medium text-purple-800">
            {store.items.reduce((acc, item) => acc.add(item.section), new Set<string>()).size}
          </h3>
          <p className="text-sm text-gray-600">Sections</p>
        </div>
      </div>
      
      {/* Store Content */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Add Items Form */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Add Items to Your Store</h2>
          
          {showForm && (
            <ItemForm 
              onSubmit={handleItemSubmit}
              storeId={storeId}
            />
          )}
          
          {/* Success message */}
          {!showForm && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-4">
              <p className="text-green-800 font-medium">Item added successfully!</p>
            </div>
          )}
          
          {/* Items list */}
          {store.items.length > 0 && (
            <div className="mt-8">
              <h3 className="font-medium mb-3">Recently Added Items</h3>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {store.items.slice(0, 5).map((item) => (
                      <tr 
                        key={item.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.aisle} • {item.section}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.price || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {store.items.length > 5 && (
                <div className="text-center mt-3">
                  <button className="text-sm text-blue-600 hover:underline">
                    View All Items ({store.items.length})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Store Map */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Store Map</h2>
          <StoreMap 
            storeData={{
              lat: store.coordinates.lat,
              lng: store.coordinates.lng
            }}
            selectedItem={selectedItem ? {
              name: selectedItem.name,
              coordinates: selectedItem.coordinates
            } : undefined}
          />
          
          <div className="mt-4 text-sm text-gray-600">
            <p>
              In a full implementation, you would be able to click on the map to set item locations
              and draw aisles, shelves, and other store features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageStorePage;
