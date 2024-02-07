import {database} from "./firebase"
import { ref, push, update } from "firebase/database";

export function addVenue(name) {
    return push(ref(database,'venues/'), name).key; // Returns key value of added venue
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