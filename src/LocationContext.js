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
  const dataHandler = new VenueData(venueID, floor);

  function checkVenueExists(id){
    checkVenueExists.then((result) => {
        console.log("Exists? " + result);
    });
  }

  function setSelectedVenue(id) {
    setVenueID(id);
  }

  function setSelectedFloor(floor) {
    setFloor(floor);
  }

  const value = {
    venueID,
    floor,
    setSelectedVenue,
    setSelectedFloor,
    checkVenueExists,
    dataHandler
  }

  return (
    <VenueContext.Provider value={value}>
      {children}
    </VenueContext.Provider>
  )
}