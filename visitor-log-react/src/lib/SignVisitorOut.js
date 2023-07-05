import {doc, updateDoc} from "firebase/firestore"
import { analytics, db } from "./firebase"
import { logEvent } from "firebase/analytics"


export async function SignVisitorOut(data, visitors) {
    var bdg = data.badge
    if (bdg !== null) {
        const badge = parseInt(bdg)

        function searchInObject(obj, searchValue) {
            var found = ''
            obj.forEach(element => {
              if(element["badge"] === searchValue && element["signedOut"] === "null") {found = element.id}
            });
      
            return found
          }
            
        var badgeCheck = searchInObject(visitors, badge);

        if(badgeCheck !== '') {
                console.log("#WROTE DATABASE")
                await updateDoc(doc(db, "visitors", badgeCheck), {
                signedOut: new Date()
            })
            logEvent(analytics, "visitor_sign_out")
        } else {alert("This badge is not signed out")
        }
    }
}