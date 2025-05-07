
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-8 border-t">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">About Rudy's Supermarket Buddy</h3>
            <p className="text-gray-600 mb-4">
              Rudy's Supermarket Buddy is an innovative application designed to enhance your shopping experience. 
              Our platform allows you to easily locate items within participating stores, eliminating the frustration of 
              wandering through aisles. With our interactive store maps and precise item locations, you can shop more 
              efficiently and save valuable time.
            </p>
            <p className="text-gray-600">
              For store owners, we offer a simple way to digitize your store layout and help customers navigate your 
              space with ease, potentially increasing customer satisfaction and sales.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features</h3>
            <ul className="text-gray-600 space-y-2">
              <li>• Interactive store maps with item locations</li>
              <li>• Search functionality to quickly find products</li>
              <li>• Store registration for business owners</li>
              <li>• User-friendly interface for both shoppers and stores</li>
            </ul>
            
            <div className="mt-8 text-gray-500">
              <p>© 2025 Rudy's Supermarket Buddy. All rights reserved.</p>
              <p className="text-sm mt-2">Developed by Rudra Naik.</p>
              <p className="text-sm mt-1">Find your way around any store with ease.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
