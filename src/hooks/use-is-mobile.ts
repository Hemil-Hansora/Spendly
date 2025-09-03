

'use client'; 

import { useState, useEffect } from 'react';


export const useIsMobile = (breakpoint: number = 768): boolean => {
  // Initialize state, defaulting to `false` for SSR safety.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // This effect should only run in the browser where the `window` object is available.
    if (typeof window === 'undefined') {
      return;
    }

    // Function to check the window's width against the breakpoint.
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Run the function on initial mount to set the correct state.
    handleResize();

    // Add an event listener to call `handleResize` whenever the window is resized.
    window.addEventListener('resize', handleResize);

    // This is a cleanup function. It removes the event listener when the
    // component unmounts to prevent memory leaks.
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]); // The effect re-runs if the breakpoint value ever changes.

  return isMobile;
};