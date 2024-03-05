import React, { useContext, useState, useEffect } from "react"
import VenueData from "./VenueDataHandler";
import { checkVenueExists } from "./DBHandler";
import { initializeMap } from "./leaflet";

const VenueContext = React.createContext()

// Custom hook
export function useVenue() {
  return useContext(VenueContext)
}

export function VenueProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [venueID, setVenueID] = useState(null);
  const [floor, setFloor] = useState(null);
  const [venueInfo, setVenueInfo] = useState(null);
  const dataHandler = new VenueData();
  const [map, setMap] = useState(null);

  async function setVenue(id){
    if (!id || venueID === id) return;
    setLoading(true);
    setVenueID(id);
    const vin = await dataHandler.getVenueInfo(id); // 시간 좀 걸림
    setVenueInfo(vin);
    setLoading(false);
    setMap(initializeMap());
  }

  const value = {
    venueID,
    floor,
    setVenue,
    setFloor,
    venueInfo,
    dataHandler,
    loading,
    map,
    setMap
  }

  return (
    <VenueContext.Provider value={value}>
      {children}
    </VenueContext.Provider>
  )
}