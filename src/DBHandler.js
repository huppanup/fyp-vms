import {database, firestore} from "./firebase"
import { get, ref, push, update, set, remove } from "firebase/database";
import {collection, doc, getDocs,deleteField, getDoc, updateDoc} from 'firebase/firestore'

export function addVenue(name) {
    return push(ref(database,'venues/'), {"name": name}).key; // Returns key value of added venue
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
  const likedVenues = await getDoc(doc(firestore, "users", id));
  return likedVenues.get("likedLocations");

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


export function updateLikedLocations(uid, locations) {
  console.log(locations);
  const likedVenues = doc(firestore, "users", uid);
  const venueID = Object.keys(locations)[0]
  updateDoc(likedVenues,{['likedLocations.' + venueID] : locations[venueID]}).then(() => {
    return("Data updated successfully");
  })
  .catch((error) => {
    console.error("Error updating data:", error);
  });
}

export function removeLikedLocations(uid, id) {

  const likedVenues = doc(firestore, "users", uid);
  updateDoc(likedVenues,{['likedLocations.' + id] : deleteField()}).then(() => {
    console.log("Location removed successfully");
  })
  .catch((error) => {
    console.error("Error removing location:", error);
  });

}

// export function updateLikedLocations(uid, locations) {
//     const likedLocationRef = ref(database, `users/${uid}/likedLocations`);
//     update(likedLocationRef, locations)
//     .then(() => {
//       return("Data updated successfully");
//     })
//     .catch((error) => {
//       console.error("Error updating data:", error);
//     });
// }

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