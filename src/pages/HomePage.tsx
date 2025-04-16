
import { Link } from 'react-router-dom';
import { ShoppingCart, MapPin, SearchIcon } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const HomePage = () => {
  const { stores } = useData();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Never Get Lost in a Supermarket Again
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Find the exact location of any item in participating stores and get turn-by-turn directions directly to what you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/stores" className="btn-primary px-8 py-3 text-lg">
              Find Nearby Stores
            </Link>
            <Link to="/store-owner" className="btn-secondary px-8 py-3 text-lg">
              Register Your Store
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon size={28} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Search for Items</h3>
              <p className="text-gray-600">
                Simply search for the items you need to find their exact location within the store.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={28} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Directions</h3>
              <p className="text-gray-600">
                Follow the map to navigate directly to your item's location in the store.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart size={28} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Shop Efficiently</h3>
              <p className="text-gray-600">
                Save time and frustration by going directly to what you need without wandering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stores */}
      {stores.length > 0 && (
        <section className="py-16 px-6 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Stores</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stores.slice(0, 3).map((store) => (
                <div key={store.id} className="store-card">
                  <h3 className="font-semibold text-xl mb-2">{store.name}</h3>
                  <p className="text-gray-600 mb-4">{store.address}</p>
                  <p className="text-sm text-gray-500 mb-4">{store.items.length} items mapped</p>
                  <Link 
                    to={`/store/${store.id}`}
                    className="block w-full text-center btn-primary"
                  >
                    Browse Store
                  </Link>
                </div>
              ))}
            </div>
            
            {stores.length > 3 && (
              <div className="text-center mt-10">
                <Link to="/stores" className="btn-secondary">
                  View All Stores
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Store Owner CTA */}
      <section className="py-16 px-6 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Are You a Store Owner?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Register your store with Rudy's Supermarket Buddy and help your customers find products more easily.
          </p>
          <Link to="/store-owner" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Register Your Store
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
