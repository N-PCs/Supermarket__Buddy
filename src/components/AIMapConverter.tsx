
import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AIMapConverterProps {
  file: File | null;
  onMapProcessed: (mapData: any) => void;
}

const AIMapConverter = ({ file, onMapProcessed }: AIMapConverterProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const processMap = () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate AI processing with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        
        // When processing completes
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          
          // Generate a simulated processed map result
          // In a real implementation, this would come from an AI model
          const processedMap = {
            layout: {
              aisles: [
                { id: 'a1', name: 'Aisle 1', coordinates: [[40.7128, -74.006], [40.7129, -74.006]] },
                { id: 'a2', name: 'Aisle 2', coordinates: [[40.7128, -74.005], [40.7129, -74.005]] },
                { id: 'a3', name: 'Aisle 3', coordinates: [[40.7128, -74.004], [40.7129, -74.004]] },
              ],
              sections: [
                { id: 's1', name: 'Produce', aisle: 'a1', coordinates: [40.7128, -74.006] },
                { id: 's2', name: 'Dairy', aisle: 'a2', coordinates: [40.7128, -74.005] },
                { id: 's3', name: 'Bakery', aisle: 'a3', coordinates: [40.7128, -74.004] },
              ],
              entrances: [
                { id: 'e1', name: 'Main Entrance', coordinates: [40.7127, -74.006] }
              ],
              checkouts: [
                { id: 'c1', name: 'Checkout 1', coordinates: [40.7129, -74.007] }
              ]
            },
            imageUrl: URL.createObjectURL(file),
            suggestions: [
              { name: 'Apples', section: 's1', coordinates: [40.7128, -74.0061] },
              { name: 'Milk', section: 's2', coordinates: [40.7128, -74.0051] },
              { name: 'Bread', section: 's3', coordinates: [40.7128, -74.0041] },
            ]
          };
          
          onMapProcessed(processedMap);
        }
        
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 400);
  };

  return (
    <div className="border border-blue-100 rounded-lg p-6 bg-blue-50 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Wand2 className="text-blue-500" size={24} />
        <h3 className="font-semibold text-lg">AI Map Conversion</h3>
      </div>
      
      <p className="text-gray-600 mb-4">
        Our AI can analyze your store layout image and automatically create an interactive map with aisles and sections.
      </p>
      
      {file ? (
        <>
          {isProcessing ? (
            <div className="space-y-3">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 text-center">Processing your store layout... {progress}%</p>
            </div>
          ) : (
            <Button
              onClick={processMap}
              className="w-full flex items-center justify-center gap-2"
            >
              <Wand2 size={16} />
              Process with AI
            </Button>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-500 italic">
          Upload a store layout image first to use AI conversion
        </p>
      )}
    </div>
  );
};

export default AIMapConverter;
