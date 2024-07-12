import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollRestoration = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on new page load

    const handlePopState = (event) => {
      if (event.state && event.state.scrollPosition) {
        window.scrollTo(event.state.scrollPosition.x, event.state.scrollPosition.y);
      } else {
        window.scrollTo(0, 0);
      }
    };

    const saveScrollPosition = () => {
      const scrollPosition = { x: window.scrollX, y: window.scrollY };
      window.history.replaceState({ scrollPosition }, '');
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', saveScrollPosition);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, [location.pathname]);
};

const ScrollRestoration = () => {
  useScrollRestoration();

  return null; // Since it's a utility component, it doesn't render anything
};

export default ScrollRestoration;