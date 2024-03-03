import React, { useContext, useState, useEffect } from "react"
import VenueData from "./VenueDataHandler";
import { checkVenueExists } from "./DBHandler";

const VenueContext = React.createContext()

// Custom hook
export function useVenue() {
  return useContext(VenueContext)
}

export function VenueProvider({ children }) {
  const [venueID, setVenueID] = useState(null);
  const [floor, setFloor] = useState(null);
  const [venueInfo, setVenueInfo] = useState(null);
  const dataHandler = new VenueData(null);

  async function setVenue(id){
    if (!id) return;
    setVenueID(id);
    dataHandler.venueID = id;
    setVenueInfo(await dataHandler.getVenueInfo())
    console.log(venueInfo);
  }

  const value = {
    venueID,
    floor,
    setVenue,
    setFloor,
    venueInfo,
    dataHandler
  }

  return (
    <VenueContext.Provider value={value}>
      {children}
    </VenueContext.Provider>
  )
}