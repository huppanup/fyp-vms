import {database} from "./firebase"
import { get, ref, push, update, onValue } from "firebase/database";

export function addVenue(name) {
    return push(ref(database,'venues/'), name).key; // Returns key value of added venue
}

export async function checkVenueExists(id) {
    const snapshot = await get(ref(database, 'venues/' + id ))
    return snapshot.exists;
}

export function renameVenue(id, newName){
    const updates = {};
    updates[id] = newName;
    update(ref(database,'venues/'), updates).then()
    .catch((e) => {console.log("Failed to rename venue.")});
}

export function deleteVenue(id){
    const updates = {};
    updates[id] = null;
    update(ref(database,'venues/'), updates).then()
    .catch((e) => {console.log("Failed to remove venue.")});
}

export async function getLikedLocations(id){
    const likedVenues = ref(database, 'users/' + id + '/likedLocations');
    const result = await get(likedVenues);
    return result.val();
 
}

export function removeLikedLocations(id, location) {
    const likedLocationRef = ref(database, `users/${id}/likedLocations/${location.name}`);
    likedLocationRef.remove()
    .then(() => {
      console.log("Location removed successfully");
    })
    .catch((error) => {
      console.error("Error removing location:", error);
    });
}

export function updateLikedLocations(id, locations) {
    const likedLocationRef = ref(database, `users/${id}/likedLocations`);
    const updatedLikedLocationsObject = locations.reduce((acc, location) => {
      acc[location.locationId] = location;
      return acc;
    }, {});
    update(likedLocationRef, updatedLikedLocationsObject)
    .then(() => {
      return("Data updated successfully");
    })
    .catch((error) => {
      console.error("Error updating data:", error);
    });
}