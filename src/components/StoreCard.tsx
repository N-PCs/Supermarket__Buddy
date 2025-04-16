
import { Link } from 'react-router-dom';
import { MapPin, ShoppingCart } from 'lucide-react';

interface StoreCardProps {
  store: {
    id: string;
    name: string;
    address: string;
    image?: string;
    itemCount: number;
  };
}

const StoreCard = ({ store }: StoreCardProps) => {
  return (
    <div className="store-card">
      <div className="h-40 mb-4 bg-gray-100 rounded-md overflow-hidden">
        {store.image ? (
          <img 
            src={store.image} 
            alt={store.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ShoppingCart size={48} />
          </div>
        )}
      </div>
      <h3 className="font-semibold text-xl mb-2">{store.name}</h3>
      <div className="flex items-start gap-2 text-gray-600 mb-4">
        <MapPin size={18} className="mt-0.5 flex-shrink-0" />
        <p className="text-sm">{store.address}</p>
      </div>
      <p className="text-sm text-gray-500 mb-4">{store.itemCount} items mapped</p>
      <Link 
        to={`/store/${store.id}`}
        className="block w-full text-center btn-primary"
      >
        Browse Store
      </Link>
    </div>
  );
};

export default StoreCard;
