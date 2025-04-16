
import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Button } from "@/components/ui/button";
import { ShoppingBag, Upload, X, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface ProductImageUploaderProps {
  storeId: string;
}

const ProductImageUploader = ({ storeId }: ProductImageUploaderProps) => {
  const { getStore } = useData();
  const [productImages, setProductImages] = useState<{ file: File; preview: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const store = getStore(storeId);
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages: { file: File; preview: string }[] = [];
      
      Array.from(e.target.files).forEach(file => {
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push({
            file,
            preview: reader.result as string
          });
          
          if (newImages.length === e.target.files!.length) {
            setProductImages(prev => [...prev, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleUpload = () => {
    if (productImages.length === 0) return;
    
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      // In a real app, you would upload to a server or cloud storage
      setIsUploading(false);
      
      toast({
        title: "Images uploaded successfully",
        description: `${productImages.length} product images have been uploaded.`,
      });
      
      // Reset form
      setProductImages([]);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <ShoppingBag className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Product Images</h2>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
        {productImages.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {productImages.map((image, index) => (
                <div key={index} className="relative">
                  <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                    <img 
                      src={image.preview} 
                      alt={`Product ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button 
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                  <p className="text-xs text-gray-500 truncate mt-1">{image.file.name}</p>
                </div>
              ))}
              
              {/* Add more images button */}
              <div className="aspect-square border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                  <Plus size={24} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Add More</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                  />
                </label>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={() => setProductImages([])}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                <Trash2 size={16} />
                <span>Clear All</span>
              </Button>
              
              <Button 
                onClick={handleUpload}
                disabled={isUploading}
                className="gap-2"
              >
                <Upload size={16} />
                {isUploading ? 'Uploading...' : 'Upload All Images'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">Upload Product Images</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Upload images of your products. These will be used in your product listings
              and when customers search for items.
            </p>
            
            <div className="flex justify-center">
              <label className="btn-primary cursor-pointer flex items-center gap-2">
                <Upload size={16} />
                <span>Select Images</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                />
              </label>
            </div>
            
            <p className="text-xs text-gray-400 mt-4">
              You can select multiple images at once. Max 10 files, 5MB each.
            </p>
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Tips for great product images</h4>
            <ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
              <li>Use consistent lighting and background</li>
              <li>Show the product from multiple angles</li>
              <li>Include size reference where helpful</li>
              <li>Make sure images are in focus and high resolution</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImageUploader;
