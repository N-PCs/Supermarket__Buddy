
import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StoreImageUploader from '../components/StoreImageUploader';
import ProductImageUploader from '../components/ProductImageUploader';
import StoreMapUploader from '../components/StoreMapUploader';
import { Store, MapIcon, Image, ShoppingBag } from 'lucide-react';

const StoreMediaPage = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const { getStore, isStoreOwnerLoggedIn } = useData();
  
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

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="flex items-center gap-3 mb-6">
        <Store className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Media Manager - {store.name}</h1>
      </div>
      
      <p className="text-gray-600 mb-8">
        Upload and manage your store images, maps, and product pictures in one place.
      </p>
      
      <Tabs defaultValue="store-images" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
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
      </Tabs>
    </div>
  );
};

export default StoreMediaPage;
