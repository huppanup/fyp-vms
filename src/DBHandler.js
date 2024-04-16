import {database} from "./firebase"
import { get, ref, push, update, set, remove } from "firebase/database";

export function addVenue(name) {
    return push(ref(database,'venues/'), {"name": name}).key; // Returns key value of added venue
}

export function addUser(id) {
  return set(ref(database, 'users/' + id), {type: 0});
}

export async function checkVenueExists(id) {
    const snapshot = await get(ref(database, 'venues/' + id ))
    return snapshot.exists;
}

/*export function renameVenue(id, newName){
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
} */

export async function getLikedLocations(id){
    const likedVenues = ref(database, 'users/' + id + '/likedLocations');
    const result = await get(likedVenues);
    return result.val();
 
}

export function getVenues() {
  const venues = ref(database, 'venues');
  return get(venues)
  .then(result => {
    const venueNames = {};
    Object.entries(result.val()).forEach(([key, value]) => {
      venueNames[key] = value.name;
    });
    return venueNames;
  }).catch(error => console.error(error));
}

export function removeLikedLocations(uid, id) {
    const likedLocationRef = ref(database, `users/${uid}/likedLocations/${id}`);
    remove(likedLocationRef)
    .then(() => {
      console.log("Location removed successfully");
    })
    .catch((error) => {
      console.error("Error removing location:", error);
    });
}

export function updateLikedLocations(uid, locations) {
    const likedLocationRef = ref(database, `users/${uid}/likedLocations`);
    update(likedLocationRef, locations)
    .then(() => {
      return("Data updated successfully");
    })
    .catch((error) => {
      console.error("Error updating data:", error);
    });
}

export function createLikedLocations(uid, locations) {
  const likedLocationRef = ref(database, `users/${uid}/likedLocations`);
    set(likedLocationRef, locations)
    .then(() => {
      return("Data updated successfully");
    })
    .catch((error) => {
      console.error("Error updating data:", error);
    });
}

export async function getAlignment(venueID, floor) {
  const alignmentReft = ref(database, 'venues/' + venueID + "/floors/" + floor);
  const result = await get(alignmentReft);
  return result.val();
}

export async function checkBoundsExists(venueID, floor) {
  const snapshot = await get(ref(database, 'venues/' + venueID + "/floors/" + floor));
  return snapshot.exists;
}

export function setAlignmentBounds(venueID, floor, bottomLeft, upperRight, upperLeft, transformationMatrix) {
  const alignmentReft = ref(database, 'venues/' + venueID + "/floors/" + floor);
  const data = {
    bottomLeft : bottomLeft,
    upperRight : upperRight,
    upperLeft : upperLeft,
    transformation : transformationMatrix
  };
  checkBoundsExists(venueID, floor).then((snapshot) => {
    if (!snapshot) {
      set(alignmentReft, data)
      .then(() => {
        return("Data updated successfully");
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
    } else {
      update(alignmentReft, data)
      .then(() => {
        return("Data updated successfully");
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
    }
  });
}