
import { useState } from 'react';

interface ItemFormProps {
  onSubmit: (data: any) => void;
  storeId: string;
}

const ItemForm = ({ onSubmit, storeId }: ItemFormProps) => {
  const [itemName, setItemName] = useState('');
  const [itemAisle, setItemAisle] = useState('');
  const [itemSection, setItemSection] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [coordinates, setCoordinates] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse coordinates string into array
    let coords: [number, number] = [0, 0];
    try {
      coords = coordinates.split(',').map(Number) as [number, number];
    } catch (error) {
      alert('Please enter valid coordinates (e.g., -74.0060, 40.7128)');
      return;
    }
    
    onSubmit({
      name: itemName,
      aisle: itemAisle,
      section: itemSection,
      price: itemPrice,
      coordinates: coords,
      storeId
    });
    
    // Reset form
    setItemName('');
    setItemAisle('');
    setItemSection('');
    setItemPrice('');
    setCoordinates('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      <div>
        <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
          Item Name
        </label>
        <input
          id="itemName"
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
          className="input-field"
          placeholder="Organic Apples"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="itemAisle" className="block text-sm font-medium text-gray-700 mb-1">
            Aisle
          </label>
          <input
            id="itemAisle"
            type="text"
            value={itemAisle}
            onChange={(e) => setItemAisle(e.target.value)}
            required
            className="input-field"
            placeholder="Produce"
          />
        </div>
        
        <div>
          <label htmlFor="itemSection" className="block text-sm font-medium text-gray-700 mb-1">
            Section
          </label>
          <input
            id="itemSection"
            type="text"
            value={itemSection}
            onChange={(e) => setItemSection(e.target.value)}
            required
            className="input-field"
            placeholder="Fresh Fruits"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-700 mb-1">
          Price (Optional)
        </label>
        <input
          id="itemPrice"
          type="text"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          className="input-field"
          placeholder="$2.99/lb"
        />
      </div>
      
      <div>
        <label htmlFor="coordinates" className="block text-sm font-medium text-gray-700 mb-1">
          Coordinates on Map
        </label>
        <input
          id="coordinates"
          type="text"
          value={coordinates}
          onChange={(e) => setCoordinates(e.target.value)}
          required
          className="input-field"
          placeholder="-74.0060, 40.7128"
        />
        <p className="text-xs text-gray-500 mt-1">
          In a real application, you would click on the map to set these coordinates
        </p>
      </div>
      
      <div className="flex justify-end">
        <button type="submit" className="btn-primary">
          Add Item
        </button>
      </div>
    </form>
  );
};

export default ItemForm;
