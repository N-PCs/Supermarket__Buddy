
import { useState } from 'react';
import { Upload, Map, Store, MapPin } from 'lucide-react';
import AIMapConverter from './AIMapConverter';
import GoogleMapsLocationPicker from './GoogleMapsLocationPicker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface UploadMapFormProps {
  onSubmit: (data: any) => void;
}

const UploadMapForm = ({ onSubmit }: UploadMapFormProps) => {
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [mapData, setMapData] = useState<any>(null);
  const [storeLocation, setStoreLocation] = useState<{lat: number; lng: number} | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'map' | 'simple'>('map');
  const [manualCoordinates, setManualCoordinates] = useState<string>('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process coordinates based on upload method
    let coordinates = { lat: 40.7128, lng: -74.0060 }; // Default coordinates
    
    if (uploadMethod === 'map' && storeLocation) {
      coordinates = storeLocation;
    } else if (uploadMethod === 'simple' && manualCoordinates) {
      try {
        const [lat, lng] = manualCoordinates.split(',').map(coord => parseFloat(coord.trim()));
        if (!isNaN(lat) && !isNaN(lng)) {
          coordinates = { lat, lng };
        } else {
          toast({
            title: "Invalid coordinates",
            description: "Please enter valid coordinates (e.g., 15.4909, 73.8278)",
            variant: "destructive"
          });
          return;
        }
      } catch (error) {
        toast({
          title: "Invalid coordinates format",
          description: "Please enter coordinates as latitude,longitude (e.g., 15.4909, 73.8278)",
          variant: "destructive"
        });
        return;
      }
    }
    
    // In a real app, you would upload the file and process it
    // For this demo, we'll just pass the form data
    onSubmit({
      name: storeName,
      address: storeAddress,
      file: file,
      // Pass AI processed map data if available
      aiProcessedMap: mapData,
      // Pass the selected store location
      coordinates: coordinates
    });
    
    // Reset form
    setStoreName('');
    setStoreAddress('');
    setFile(null);
    setMapData(null);
    setStoreLocation(null);
    setManualCoordinates('');
    
    toast({
      title: "Store details submitted",
      description: "Your store information has been successfully submitted.",
    });
  };

  const handleMapProcessed = (processedData: any) => {
    setMapData(processedData);
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setStoreLocation({ lat: location.lat, lng: location.lng });
    setStoreAddress(location.address);
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
          className="input-field w-full"
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
          className="input-field w-full"
          placeholder="123 Main St, City, State, ZIP"
        />
      </div>
      
      <Tabs defaultValue="map" className="w-full" onValueChange={(value) => setUploadMethod(value as 'map' | 'simple')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin size={16} />
            <span>Map Integration</span>
          </TabsTrigger>
          <TabsTrigger value="simple" className="flex items-center gap-2">
            <Store size={16} />
            <span>Simple Upload</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="pt-4">
          {/* Google Maps Location Picker */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <GoogleMapsLocationPicker 
              onLocationSelect={handleLocationSelect}
              initialLocation={storeLocation || undefined}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="simple" className="pt-4">
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Store size={18} className="text-blue-500" />
              <h3 className="font-medium">Manual Store Information</h3>
            </div>
            
            <div>
              <label htmlFor="manualCoordinates" className="block text-sm font-medium text-gray-700 mb-1">
                Store Coordinates (Latitude, Longitude)
              </label>
              <input
                id="manualCoordinates"
                type="text"
                value={manualCoordinates}
                onChange={(e) => setManualCoordinates(e.target.value)}
                className="input-field w-full"
                placeholder="15.4909, 73.8278"
              />
              <p className="text-xs text-gray-500 mt-1">
                You can find these coordinates using online tools like Google Maps (right click on location)
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Tip:</strong> For Goa locations, coordinates are typically in the range of:
                <br />
                Latitude: 14.8° to 15.8° N
                <br />
                Longitude: 73.6° to 74.3° E
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
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
      
      {/* AI Map Converter */}
      <AIMapConverter file={file} onMapProcessed={handleMapProcessed} />
      
      {mapData && (
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <p className="text-green-700 font-medium">Map processed successfully!</p>
          <p className="text-sm text-gray-600">
            We've detected {mapData.layout.aisles.length} aisles and {mapData.layout.sections.length} sections in your store.
          </p>
        </div>
      )}
      
      <div className="flex justify-end">
        <button type="submit" className="btn-primary">
          Upload Store Map
        </button>
      </div>
    </form>
  );
};

export default UploadMapForm;
