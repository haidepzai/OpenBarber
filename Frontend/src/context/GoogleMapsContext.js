import { createContext } from "react";

const GoogleMapsContext = createContext();

export const GoogleMapsProvider = ({children}) => {
    return <GoogleMapsContext.Provider>
        {children}
    </GoogleMapsContext.Provider>
}