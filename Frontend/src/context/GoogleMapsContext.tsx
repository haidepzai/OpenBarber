import { createContext, type ReactNode } from 'react';

const GoogleMapsContext = createContext<unknown>(null);

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export const GoogleMapsProvider = ({ children }: GoogleMapsProviderProps) => {
  return <GoogleMapsContext.Provider value={null}>{children}</GoogleMapsContext.Provider>;
};

export default GoogleMapsContext;
