
import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Button } from "@/components/ui/button";
import { MapIcon, Upload, X, AlertCircle, Wand2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import AIMapConverter from './AIMapConverter';

interface StoreMapUploaderProps {
  storeId: string;
}

const StoreMapUploader = ({ storeId }: StoreMapUploaderProps) => {
  const { getStore } = useData();
  const [mapFile, setMapFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [aiProcessedMap, setAiProcessedMap] = useState<any>(null);
  const { toast } = useToast();
  
  const store = getStore(storeId);
  
  const handleMapSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMapFile(file);
      setAiProcessedMap(null);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUpload = () => {
    if (!mapFile) return;
    
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      // In a real app, you would upload to a server or cloud storage
      setIsUploading(false);
      
      toast({
        title: "Map uploaded successfully",
        description: "Your store map has been updated.",
      });
      
      // Reset form
      setMapFile(null);
      setPreviewUrl(null);
      setAiProcessedMap(null);
    }, 1500);
  };
  
  const handleCancel = () => {
    setMapFile(null);
    setPreviewUrl(null);
    setAiProcessedMap(null);
  };
  
  const handleMapProcessed = (processedData: any) => {
    setAiProcessedMap(processedData);
    
    toast({
      title: "Map processed successfully",
      description: `Detected ${processedData.layout.aisles.length} aisles and ${processedData.layout.sections.length} sections.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <MapIcon className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Store Maps</h2>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
        {previewUrl ? (
          <div className="space-y-4">
            <div className="relative w-full h-64 bg-gray-100 rounded-md overflow-hidden">
              <img 
                src={previewUrl} 
                alt="Store map preview" 
                className="w-full h-full object-contain"
              />
              <button 
                onClick={handleCancel}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{mapFile?.name}</p>
                <p className="text-sm text-gray-500">{(mapFile?.size ? (mapFile.size / 1024 / 1024).toFixed(2) : 0)} MB</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="gap-2"
                >
                  {isUploading ? 'Uploading...' : 'Upload Map'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <MapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">Upload Store Map</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Upload a map of your store layout. Our AI can analyze it to create an interactive digital map.
            </p>
            
            <div className="flex justify-center">
              <label className="btn-primary cursor-pointer flex items-center gap-2">
                <Upload size={16} />
                <span>Select Map</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleMapSelect}
                />
              </label>
            </div>
            
            <p className="text-xs text-gray-400 mt-4">
              Accepted formats: JPG, PNG, SVG. Max file size: 5MB.
            </p>
          </div>
        )}
      </div>
      
      {mapFile && !aiProcessedMap && (
        <AIMapConverter file={mapFile} onMapProcessed={handleMapProcessed} />
      )}
      
      {aiProcessedMap && (
        <div className="bg-green-50 p-6 rounded-lg border border-green-100">
          <div className="flex items-center gap-3 mb-4">
            <Wand2 className="h-5 w-5 text-green-600" />
            <h3 className="font-medium text-green-800">AI Processing Results</h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-green-700">
              Our AI has analyzed your store map and identified:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-md border border-green-200">
                <div className="font-medium mb-2 text-green-800">{aiProcessedMap.layout.aisles.length} Aisles</div>
                <ul className="text-sm space-y-1">
                  {aiProcessedMap.layout.aisles.slice(0, 3).map((aisle: any) => (
                    <li key={aisle.id}>{aisle.name}</li>
                  ))}
                  {aiProcessedMap.layout.aisles.length > 3 && (
                    <li className="text-gray-500">+ {aiProcessedMap.layout.aisles.length - 3} more</li>
                  )}
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-md border border-green-200">
                <div className="font-medium mb-2 text-green-800">{aiProcessedMap.layout.sections.length} Sections</div>
                <ul className="text-sm space-y-1">
                  {aiProcessedMap.layout.sections.slice(0, 3).map((section: any) => (
                    <li key={section.id}>{section.name}</li>
                  ))}
                  {aiProcessedMap.layout.sections.length > 3 && (
                    <li className="text-gray-500">+ {aiProcessedMap.layout.sections.length - 3} more</li>
                  )}
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-md border border-green-200">
                <div className="font-medium mb-2 text-green-800">{aiProcessedMap.suggestions.length} Item Suggestions</div>
                <ul className="text-sm space-y-1">
                  {aiProcessedMap.suggestions.slice(0, 3).map((item: any, index: number) => (
                    <li key={index}>{item.name} ({item.section})</li>
                  ))}
                  {aiProcessedMap.suggestions.length > 3 && (
                    <li className="text-gray-500">+ {aiProcessedMap.suggestions.length - 3} more</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Tips for effective store maps</h4>
            <ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
              <li>Use a clear, top-down view of your store</li>
              <li>Make sure aisles and sections are clearly visible</li>
              <li>Include labels for main sections if possible</li>
              <li>Higher resolution images will give better AI results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreMapUploader;
