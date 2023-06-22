import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { analytics, db } from "./firebase"
import { logEvent } from "firebase/analytics"


export async function SignVisitorOut(badge) {
    if (badge !== null) {
        const col = collection(db, "visitors")
        const ref = query(col, where("badge", "==", parseInt(badge)), where("signedOut", "==", "null"))
        const querySnapshot = await getDocs(ref)
        if(querySnapshot.docs.length !== 0) {
                await updateDoc(doc(db, "visitors", querySnapshot.docs[0].id), {
                signedOut: new Date()
            })
            logEvent(analytics, "visitor_sign_out")
        } else {alert("This badge is not signed out")
        }
    }
}