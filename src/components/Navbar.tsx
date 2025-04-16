
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="py-4 px-6 shadow-sm bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Rudy's Supermarket Buddy
        </Link>
        <div className="flex gap-6">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/stores" className="hover:text-blue-600 transition-colors">Find Stores</Link>
          <Link to="/store-owner" className="hover:text-blue-600 transition-colors">Store Owners</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
