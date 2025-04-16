
import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Button } from "@/components/ui/button";
import { Image, Upload, X, AlertCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface StoreImageUploaderProps {
  storeId: string;
}

const StoreImageUploader = ({ storeId }: StoreImageUploaderProps) => {
  const { getStore } = useData();
  const [storeImage, setStoreImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const store = getStore(storeId);
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setStoreImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUpload = () => {
    if (!storeImage) return;
    
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      // In a real app, you would upload to a server or cloud storage
      // For now, we'll just create an object URL
      const imageUrl = URL.createObjectURL(storeImage);
      
      // Update store with the new image URL
      // This would normally be done after a successful upload to cloud storage
      
      setIsUploading(false);
      
      toast({
        title: "Image uploaded successfully",
        description: "Your store image has been updated.",
      });
      
      // Reset form
      setStoreImage(null);
      setPreviewUrl(null);
    }, 1500);
  };
  
  const handleCancel = () => {
    setStoreImage(null);
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Image className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Store Images</h2>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
        {previewUrl ? (
          <div className="space-y-4">
            <div className="relative w-full h-64 bg-gray-100 rounded-md overflow-hidden">
              <img 
                src={previewUrl} 
                alt="Store preview" 
                className="w-full h-full object-cover"
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
                <p className="font-medium">{storeImage?.name}</p>
                <p className="text-sm text-gray-500">{(storeImage?.size ? (storeImage.size / 1024 / 1024).toFixed(2) : 0)} MB</p>
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
                >
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">Upload Store Image</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              This image will be displayed on your store page and in search results.
              Use a high-quality image that represents your store well.
            </p>
            
            <div className="flex justify-center">
              <label className="btn-primary cursor-pointer flex items-center gap-2">
                <Upload size={16} />
                <span>Select Image</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageSelect}
                />
              </label>
            </div>
            
            <p className="text-xs text-gray-400 mt-4">
              Recommended size: 1200x800 pixels. Max file size: 5MB.
            </p>
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Tips for great store images</h4>
            <ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
              <li>Use high-quality, well-lit images</li>
              <li>Showcase your store front or interior</li>
              <li>Avoid text overlays or logos that may be hard to read</li>
              <li>Make sure the image represents your brand and products</li>
            </ul>
          </div>
        </div>
      </div>
      
      {store?.image && !previewUrl && (
        <div className="mt-8">
          <h3 className="font-medium mb-3">Current Store Image</h3>
          <div className="w-full h-48 bg-gray-100 rounded-md overflow-hidden">
            <img 
              src={store.image} 
              alt={store.name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreImageUploader;
