import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types for our data structures
export interface Item {
  id: string;
  name: string;
  aisle: string;
  section: string;
  price?: string;
  coordinates: [number, number];
  storeId: string;
  image?: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  image?: string;
  items: Item[];
}

// Add this interface
export interface StoreOwner {
  id: string;
  name: string;
  email: string;
  provider: string;
}

// Context type
interface DataContextType {
  stores: Store[];
  addStore: (store: Omit<Store, 'id' | 'items'>) => string;
  addItem: (item: Omit<Item, 'id'>) => string;
  getStore: (id: string) => Store | undefined;
  getItem: (storeId: string, itemId: string) => Item | undefined;
  searchItems: (storeId: string, query: string) => Item[];
  isStoreOwnerLoggedIn: boolean;
  currentStoreOwner: StoreOwner | null;
  loginStoreOwner: (userData: StoreOwner) => void;
  logoutStoreOwner: () => void;
}

// Create context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [stores, setStores] = useState<Store[]>(() => {
    const savedStores = localStorage.getItem('rudys-stores');
    if (savedStores) {
      try {
        return JSON.parse(savedStores);
      } catch (e) {
        console.error('Failed to parse stored data', e);
      }
    }
    
    // Default stores data for Goa
    return [
      {
        id: 'store-1',
        name: 'Magsons Supermarket',
        address: 'Dr E Borges Rd, Panaji, Goa 403001',
        coordinates: {
          lat: 15.4909,
          lng: 73.8278
        },
        image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
        items: [
          {
            id: 'item-1',
            name: 'Goan Fish Curry Masala',
            aisle: 'A1',
            section: 'Spices',
            price: '₹120',
            coordinates: [73.8278, 15.4909],
            storeId: 'store-1'
          },
          {
            id: 'item-2',
            name: 'Cashew Nuts',
            aisle: 'B2',
            section: 'Dry Fruits',
            price: '₹850',
            coordinates: [73.8278, 15.4909],
            storeId: 'store-1'
          }
        ]
      },
      {
        id: 'store-2',
        name: 'Newton Supermart',
        address: '18th June Rd, Panaji, Goa 403001',
        coordinates: {
          lat: 15.4960,
          lng: 73.8277
        },
        items: [
          {
            id: 'item-3',
            name: 'Goan Chorizo',
            aisle: 'C1',
            section: 'Local Specialties',
            price: '₹280',
            coordinates: [73.8277, 15.4960],
            storeId: 'store-2'
          }
        ]
      },
      {
        id: 'store-3',
        name: 'Delfinos Hypermarket',
        address: 'Porvorim, Bardez, Goa 403501',
        coordinates: {
          lat: 15.5074,
          lng: 73.8247
        },
        image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
        items: [
          {
            id: 'item-4',
            name: 'Coconut Oil',
            aisle: 'D1',
            section: 'Oils',
            price: '₹180',
            coordinates: [73.8247, 15.5074],
            storeId: 'store-3'
          },
          {
            id: 'item-5',
            name: 'Bebinca',
            aisle: 'E2',
            section: 'Local Sweets',
            price: '₹350',
            coordinates: [73.8247, 15.5074],
            storeId: 'store-3'
          }
        ]
      },
      {
        id: 'store-4',
        name: 'Kamat Supermarket',
        address: 'Margao, Goa 403601',
        coordinates: {
          lat: 15.2832,
          lng: 73.9862
        },
        image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
        items: [
          {
            id: 'item-6',
            name: 'Goan Vinegar',
            aisle: 'F1',
            section: 'Condiments',
            price: '₹90',
            coordinates: [73.9862, 15.2832],
            storeId: 'store-4'
          }
        ]
      }
    ];
  });

  const [storeOwner, setStoreOwner] = useState<StoreOwner | null>(() => {
    const saved = localStorage.getItem('storeOwner');
    return saved ? JSON.parse(saved) : null;
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedStores = localStorage.getItem('rudys-stores');
    if (savedStores) {
      try {
        setStores(JSON.parse(savedStores));
      } catch (e) {
        console.error('Failed to parse stored data', e);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('rudys-stores', JSON.stringify(stores));
  }, [stores]);

  // Add a new store
  const addStore = (store: Omit<Store, 'id' | 'items'>) => {
    const newStore: Store = {
      ...store,
      id: `store-${Date.now()}`,
      items: []
    };
    setStores(prev => [...prev, newStore]);
    
    // Save store ID to localStorage for easy navigation
    localStorage.setItem('lastStoreId', newStore.id);
    
    return newStore.id;
  };

  // Add an item to a store
  const addItem = (item: Omit<Item, 'id'>) => {
    const newItem: Item = {
      ...item,
      id: `item-${Date.now()}`
    };
    
    setStores(prev => prev.map(store => 
      store.id === item.storeId 
        ? { ...store, items: [...store.items, newItem] }
        : store
    ));
    
    return newItem.id;
  };

  // Get a store by ID
  const getStore = (id: string) => {
    return stores.find(store => store.id === id);
  };

  // Get an item by store ID and item ID
  const getItem = (storeId: string, itemId: string) => {
    const store = getStore(storeId);
    return store?.items.find(item => item.id === itemId);
  };

  // Search items in a store
  const searchItems = (storeId: string, query: string) => {
    const store = getStore(storeId);
    if (!store) return [];
    
    const normalizedQuery = query.toLowerCase();
    return store.items.filter(item => 
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.aisle.toLowerCase().includes(normalizedQuery) ||
      item.section.toLowerCase().includes(normalizedQuery)
    );
  };

  // Value object to be provided to consumers
  const value = {
    stores,
    addStore,
    addItem,
    getStore,
    getItem,
    searchItems,
    isStoreOwnerLoggedIn: !!storeOwner,
    currentStoreOwner: storeOwner,
    loginStoreOwner: (userData: StoreOwner) => {
      setStoreOwner(userData);
      localStorage.setItem('storeOwner', JSON.stringify(userData));
    },
    logoutStoreOwner: () => {
      setStoreOwner(null);
      localStorage.removeItem('storeOwner');
    }
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Custom hook for using the context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
