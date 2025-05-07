
import React from 'react';
import { createRoot } from 'react-dom/client';
import ThemeToggle from './ThemeToggle';

// This component will be used to add the theme toggle to the navbar
// without modifying the original Navbar.tsx file which is read-only
const NavbarThemePatch = () => {
  // This function finds the navbar-right div and injects the theme toggle
  React.useEffect(() => {
    const navbarRightDiv = document.querySelector('.navbar-right');
    if (navbarRightDiv && !document.querySelector('#theme-toggle-container')) {
      const themeToggleContainer = document.createElement('div');
      themeToggleContainer.id = 'theme-toggle-container';
      themeToggleContainer.className = 'mr-2';
      navbarRightDiv.prepend(themeToggleContainer);
      
      // React root for the theme toggle
      const root = createRoot(themeToggleContainer);
      root.render(<ThemeToggle />);
    }
  }, []);

  return null;
};

export default NavbarThemePatch;
