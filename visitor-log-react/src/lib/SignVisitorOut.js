import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { db } from "./firebase"


export async function SignVisitorOut(badge) {
    if (badge !== null) {
        const col = collection(db, "visitors")
        const ref = query(col, where("badge", "==", parseInt(badge)), where("signedOut", "==", "null"))
        const querySnapshot = await getDocs(ref)
        if(querySnapshot.docs.length !== 0) {
                await updateDoc(doc(db, "visitors", querySnapshot.docs[0].id), {
                signedOut: new Date()
            })
        } else {alert("This badge is not signed out")
        }
    }
}