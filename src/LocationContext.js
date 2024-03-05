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
    if (!id) return;
    setLoading(true);
    console.log("In set venue")
    setVenueID(id);
    console.log("Set id")
    const vin = await dataHandler.getVenueInfo(id);
    console.log("Retrieved venue info")
    setVenueInfo(vin);
    console.log("Set venue info")

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