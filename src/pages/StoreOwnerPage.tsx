
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import UploadMapForm from '../components/UploadMapForm';
import StoreMap from '../components/StoreMap';
import StoreOwnerAuth from '../components/StoreOwnerAuth';

const StoreOwnerPage = () => {
  const { addStore, isStoreOwnerLoggedIn } = useData();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [storeData, setStoreData] = useState<any>(null);
  const [aiProcessedMap, setAiProcessedMap] = useState<any>(null);

  const handleStoreSubmit = (data: any) => {
    // In a real app, we would process the map file
    // For this demo, we'll just store the form data
    const newStore = {
      name: data.name,
      address: data.address,
      coordinates: data.coordinates,
      // In a real app, we would upload and process the image
      // For this demo, we'll use a placeholder
      image: data.file ? URL.createObjectURL(data.file) : undefined,
    };
    
    setStoreData(newStore);
    
    // If AI processed the map, save that data too
    if (data.aiProcessedMap) {
      setAiProcessedMap(data.aiProcessedMap);
    }
    
    setStep(2);
  };

  const handleFinalSubmit = () => {
    // Add the store to our context
    const storeId = addStore(storeData);
    
    // Navigate to the manage items page for the new store
    navigate(`/manage-store/${storeId}`);
  };

  if (!isStoreOwnerLoggedIn) {
    return (
      <div className="container mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Store Owner Portal</h1>
        <div className="max-w-md mx-auto">
          <StoreOwnerAuth />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Store Owner Portal</h1>
      
      {/* Steps */}
      <div className="flex justify-center mb-10">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            step === 1 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
          } font-semibold`}>
            1
          </div>
          <div className="w-16 h-1 bg-gray-200 mx-1"></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            step === 2 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
          } font-semibold`}>
            2
          </div>
          <div className="w-16 h-1 bg-gray-200 mx-1"></div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 font-semibold">
            3
          </div>
        </div>
      </div>
      
      {/* Step Content */}
      <div className="max-w-3xl mx-auto">
        {step === 1 ? (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-center">Upload Your Store Map</h2>
            <p className="text-gray-600 mb-8 text-center">
              Start by providing your store details and uploading a map of your store layout.
              Our AI can automatically convert your layout image into an interactive map.
            </p>
            <UploadMapForm onSubmit={handleStoreSubmit} />
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-center">Review Your Store</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="font-semibold text-xl mb-2">{storeData.name}</h3>
              <p className="text-gray-600 mb-6">{storeData.address}</p>
              
              <div className="mb-6">
                <h4 className="font-medium mb-2">Store Map Preview</h4>
                <StoreMap 
                  storeData={{
                    lat: storeData.coordinates.lat,
                    lng: storeData.coordinates.lng
                  }}
                  aiProcessedMap={aiProcessedMap}
                  viewOnly={true}
                />
              </div>
              
              {aiProcessedMap && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-6">
                  <h4 className="font-medium mb-2">AI Processing Results</h4>
                  <p className="text-sm text-gray-600">
                    Our AI has identified {aiProcessedMap.layout.aisles.length} aisles and {aiProcessedMap.layout.sections.length} sections 
                    in your store layout. We've also suggested placements for {aiProcessedMap.suggestions.length} common items.
                  </p>
                </div>
              )}
              
              <div className="flex justify-between">
                <button 
                  onClick={() => setStep(1)}
                  className="btn-secondary"
                >
                  Go Back
                </button>
                <button 
                  onClick={handleFinalSubmit}
                  className="btn-primary"
                >
                  Continue to Add Items
                </button>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-medium mb-1">Next Steps</h4>
              <p className="text-sm text-gray-600">
                After confirming your store details, you'll be able to add items to your store map and specify their exact locations.
                {aiProcessedMap ? " The AI has already suggested some common item placements to get you started." : ""}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerPage;
