
import { MapPin } from 'lucide-react';

interface ItemCardProps {
  item: {
    id: string;
    name: string;
    aisle: string;
    section: string;
    price?: string;
    image?: string;
  };
  onGetDirections: () => void;
}

const ItemCard = ({ item, onGetDirections }: ItemCardProps) => {
  return (
    <div className="store-card flex flex-col">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
          {item.image ? (
            <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
          ) : (
            <div className="text-gray-400 text-xs text-center">No image</div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <p className="text-gray-600 text-sm">
            Aisle: {item.aisle} • Section: {item.section}
          </p>
          {item.price && <p className="text-green-600 font-medium mt-1">{item.price}</p>}
        </div>
      </div>
      <button 
        onClick={onGetDirections}
        className="mt-4 flex items-center justify-center gap-2 btn-primary"
      >
        <MapPin size={16} />
        <span>Get Directions</span>
      </button>
    </div>
  );
};

export default ItemCard;
