import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "./firebase"


export async function validateVisitor(data) {
    const col = collection(db, "visitors")
    const nameRef = query(col, where("name", "==", data.name.toUpperCase()), where("signedOut", "==", "null"))
    const nameQuerySnapshot = await getDocs(nameRef)
    const badgeRef = query(col, where("badge", "==", parseInt(data.badge)), where("signedOut", "==", "null"))
    const badgeQuerySnapshot = await getDocs(badgeRef)

    if(nameQuerySnapshot.docs.length !== 0) {
        alert("There is already a user signed in with this name!")
        return null
    } 

    if(badgeQuerySnapshot.docs.length !== 0) {
        alert("This badge is already signed in!")
        return null
    } 

    return "valid"
}