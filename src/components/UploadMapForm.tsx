
import { useState } from 'react';
import { Upload, Map } from 'lucide-react';

interface UploadMapFormProps {
  onSubmit: (data: any) => void;
}

const UploadMapForm = ({ onSubmit }: UploadMapFormProps) => {
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would upload the file and process it
    // For this demo, we'll just pass the form data
    onSubmit({
      name: storeName,
      address: storeAddress,
      file: file,
      // In a real app, you'd also send coordinates after geocoding the address
      coordinates: {
        lat: 40.7128, // Example coordinates (New York)
        lng: -74.0060
      }
    });
    
    // Reset form
    setStoreName('');
    setStoreAddress('');
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      <div>
        <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
          Store Name
        </label>
        <input
          id="storeName"
          type="text"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          required
          className="input-field"
          placeholder="Rudy's Market"
        />
      </div>
      
      <div>
        <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700 mb-1">
          Store Address
        </label>
        <input
          id="storeAddress"
          type="text"
          value={storeAddress}
          onChange={(e) => setStoreAddress(e.target.value)}
          required
          className="input-field"
          placeholder="123 Main St, City, State, ZIP"
        />
      </div>
      
      <div>
        <label htmlFor="storeMap" className="block text-sm font-medium text-gray-700 mb-1">
          Store Layout Map
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {file ? (
            <div className="space-y-2">
              <Map size={24} className="mx-auto text-green-500" />
              <p className="text-green-600 font-medium">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-xs text-red-500 underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload size={24} className="mx-auto text-gray-400" />
              <p className="text-sm text-gray-500">
                Drag and drop your store layout map, or{" "}
                <label htmlFor="mapUpload" className="text-blue-500 cursor-pointer">
                  browse
                </label>
              </p>
              <p className="text-xs text-gray-400">
                Supported formats: PNG, JPG, SVG
              </p>
              <input
                id="mapUpload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button type="submit" className="btn-primary">
          Upload Store Map
        </button>
      </div>
    </form>
  );
};

export default UploadMapForm;
