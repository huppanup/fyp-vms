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

export function getLikedLocations(id){
    const likedVenues = ref(database, 'users/' + id + '/likedLocations');
    var result;
    onValue(likedVenues, (snapshot) => {
        const data = snapshot.val();
        result = data;
    });
    return result;
}