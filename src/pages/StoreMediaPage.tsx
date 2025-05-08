
import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import StoreImageUploader from '../components/StoreImageUploader';
import ProductImageUploader from '../components/ProductImageUploader';
import StoreMapUploader from '../components/StoreMapUploader';
import { Store, MapIcon, Image, ShoppingBag, Images } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const StoreMediaPage = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const { getStore, isStoreOwnerLoggedIn } = useData();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("store-images");
  const [inspirationalImages, setInspirationalImages] = useState<string[]>([]);
  
  useEffect(() => {
    // Sample images of malls and supermarkets in Goa
    const goaStoreImages = [
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?auto=format&fit=crop&q=80"
    ];
    
    setInspirationalImages(goaStoreImages);
  }, []);
  
  if (!isStoreOwnerLoggedIn) {
    return <Navigate to="/store-owner" />;
  }
  
  if (!storeId) {
    return <Navigate to="/store-owner" />;
  }
  
  const store = getStore(storeId);
  
  if (!store) {
    return <Navigate to="/store-owner" />;
  }

  const handleCopyImage = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Image URL copied",
        description: "The image URL has been copied to your clipboard",
      });
    }).catch(err => {
      toast({
        title: "Failed to copy",
        description: "Could not copy the URL to clipboard",
        variant: "destructive"
      });
    });
  };

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="flex items-center gap-3 mb-6">
        <Store className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Media Manager - {store.name}</h1>
      </div>
      
      <p className="text-gray-600 mb-8">
        Upload and manage your store images, maps, and product pictures in one place.
      </p>
      
      <Tabs defaultValue="store-images" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="store-images" className="flex items-center gap-2">
            <Image size={16} />
            <span>Store Images</span>
          </TabsTrigger>
          <TabsTrigger value="store-maps" className="flex items-center gap-2">
            <MapIcon size={16} />
            <span>Store Maps</span>
          </TabsTrigger>
          <TabsTrigger value="product-images" className="flex items-center gap-2">
            <ShoppingBag size={16} />
            <span>Product Images</span>
          </TabsTrigger>
          <TabsTrigger value="inspiration-gallery" className="flex items-center gap-2">
            <Images size={16} />
            <span>Goa Stores</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="store-images" className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <StoreImageUploader storeId={storeId} />
        </TabsContent>
        
        <TabsContent value="store-maps" className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <StoreMapUploader storeId={storeId} />
        </TabsContent>
        
        <TabsContent value="product-images" className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <ProductImageUploader storeId={storeId} />
        </TabsContent>
        
        <TabsContent value="inspiration-gallery" className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Supermarkets & Malls in Goa</h2>
              <p className="text-gray-600 mb-6">
                Get inspiration from these real supermarkets and shopping malls in Goa. Click on any image to copy its URL for use in your store.
              </p>
            </div>
            
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {inspirationalImages.map((imageUrl, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex flex-col p-3">
                          <div 
                            className="h-80 relative group cursor-pointer"
                            onClick={() => handleCopyImage(imageUrl)}
                          >
                            <img 
                              src={imageUrl} 
                              alt={`Goa Store ${index + 1}`}
                              className="w-full h-full object-cover rounded-md transition-all duration-300 group-hover:brightness-90"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-md">
                              <div className="bg-white px-3 py-2 rounded-md text-sm">
                                Copy Image URL
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <h3 className="font-medium">Goa {index % 2 === 0 ? "Mall" : "Supermarket"} {index + 1}</h3>
                            <p className="text-sm text-gray-500">{index % 2 === 0 ? "Shopping complex" : "Grocery store"} in Goa</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="mt-4 flex justify-center gap-2">
                <CarouselPrevious className="relative -left-0 static" />
                <CarouselNext className="relative -right-0 static" />
              </div>
            </Carousel>
            
            <div className="mt-8 bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Tips for Store Images</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Use high-resolution images for better customer experience</li>
                <li>• Include both exterior and interior shots of your store</li>
                <li>• Showcase your most popular sections and unique features</li>
                <li>• Keep your images updated as your store layout changes</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreMediaPage;
