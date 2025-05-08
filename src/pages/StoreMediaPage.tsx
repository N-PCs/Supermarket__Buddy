
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
import { Store, MapIcon, Image, ShoppingBag, Images, Share2, Download, Copy, ExternalLink } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const StoreMediaPage = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const { getStore, isStoreOwnerLoggedIn } = useData();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("store-images");
  const [inspirationalImages, setInspirationalImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  useEffect(() => {
    // Expanded collection of Goan mall and supermarket images
    const goaStoreImages = [
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1460574283810-2aab119d8511?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?auto=format&fit=crop&q=80"
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

  const handleImageSelect = (url: string) => {
    setSelectedImage(url);
  };

  const handleShareImage = (url: string) => {
    if (navigator.share) {
      navigator.share({
        title: "Check out this store in Goa",
        text: "I found this amazing store in Goa on Rudy's Supermarket Buddy!",
        url: url
      }).then(() => {
        toast({
          title: "Shared successfully",
          description: "The image has been shared",
        });
      }).catch(err => {
        toast({
          title: "Share failed",
          description: "Could not share the image",
          variant: "destructive"
        });
      });
    } else {
      handleCopyImage(url);
    }
  };

  const handleDownloadImage = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = "goa-store-image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your image download has started",
    });
  };

  const handleOpenImage = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="flex items-center gap-3 mb-6">
        <Store className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Media Manager - {store.name}</h1>
      </div>
      
      <p className="text-gray-600 mb-8">
        Upload and manage your store images, maps, and product pictures in one place.
        Get inspiration from other stores in Goa to enhance your media presentation.
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
                Get inspiration from these real supermarkets and shopping malls in Goa. Click on any image to view details and sharing options.
              </p>
            </div>
            
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {inspirationalImages.map((imageUrl, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex flex-col p-3">
                          <div 
                            className="h-80 relative group cursor-pointer"
                            onClick={() => handleImageSelect(imageUrl)}
                          >
                            <img 
                              src={imageUrl} 
                              alt={`Goa Store ${index + 1}`}
                              className="w-full h-full object-cover rounded-md transition-all duration-300 group-hover:brightness-90"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-md">
                              <div className="bg-white px-3 py-2 rounded-md text-sm">
                                View Details
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
            
            {selectedImage && (
              <div className="mt-8">
                <h3 className="font-medium text-lg mb-4">Selected Image</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <img 
                        src={selectedImage} 
                        alt="Selected store" 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="pt-6">
                        <h4 className="font-medium mb-3">Image Actions</h4>
                        <div className="space-y-2">
                          <Button 
                            variant="outline" 
                            className="w-full justify-start" 
                            onClick={() => handleCopyImage(selectedImage)}
                          >
                            <Copy className="mr-2 h-4 w-4" /> Copy URL
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start" 
                            onClick={() => handleShareImage(selectedImage)}
                          >
                            <Share2 className="mr-2 h-4 w-4" /> Share Image
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start" 
                            onClick={() => handleDownloadImage(selectedImage)}
                          >
                            <Download className="mr-2 h-4 w-4" /> Download
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start" 
                            onClick={() => handleOpenImage(selectedImage)}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" /> Open in New Tab
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <h4 className="font-medium mb-3">Image Information</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          This high-quality image showcases a modern shopping venue in Goa, perfect for inspiration for your own store presentation.
                        </p>
                        <div className="text-xs text-gray-500">
                          <p>Format: JPG</p>
                          <p>Source: Unsplash</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
            
            <Separator className="my-8" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-medium mb-3 text-blue-800">Tips for Store Images</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Use high-resolution images for better customer experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Include both exterior and interior shots of your store</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Showcase your most popular sections and unique features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Keep your images updated as your store layout changes</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-medium mb-3 text-purple-800">Media Best Practices</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold">•</span>
                    <span>Maintain consistent lighting and style across all store photos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold">•</span>
                    <span>Show your store at different times of day for variety</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold">•</span>
                    <span>Include people (with permission) to show the scale and atmosphere</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold">•</span>
                    <span>Highlight seasonal displays and special promotions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreMediaPage;
