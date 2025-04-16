
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';

const Navbar = () => {
  const { isStoreOwnerLoggedIn, currentStoreOwner, logoutStoreOwner } = useData();

  return (
    <nav className="py-4 px-6 shadow-sm bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Rudy's Supermarket Buddy
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/stores" className="hover:text-blue-600 transition-colors">Find Stores</Link>
          
          {isStoreOwnerLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link to="/store-owner" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                My Store
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center">
                  <Sparkles size={12} className="mr-1" /> AI Layout
                </span>
              </Link>
              <span className="text-sm text-gray-600">
                {currentStoreOwner?.name}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logoutStoreOwner}
                className="text-sm"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/store-owner" className="hover:text-blue-600 transition-colors">Store Owners</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
