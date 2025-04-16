
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./contexts/DataContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage";
import StoresPage from "./pages/StoresPage";
import StorePage from "./pages/StorePage";
import StoreOwnerPage from "./pages/StoreOwnerPage";
import ManageStorePage from "./pages/ManageStorePage";
import StoreMediaPage from "./pages/StoreMediaPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DataProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/stores" element={<StoresPage />} />
                <Route path="/store/:storeId" element={<StorePage />} />
                <Route path="/store-owner" element={<StoreOwnerPage />} />
                <Route path="/manage-store/:storeId" element={<ManageStorePage />} />
                <Route path="/store-media/:storeId" element={<StoreMediaPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
