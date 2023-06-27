import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "./firebase"
import submitNewglobal from "./SubmitNewGlobal"

export async function checkDBIDS(barcode) {
    let ScanLib = {}
    console.log("#READ DATABASE")
    const col = collection(db, "DBIDS")
    const ref = query(col, where("barcode", "==", barcode))
    const querySnapshot = await getDocs(ref)
    if (querySnapshot.docs.length !== 0) {
        ScanLib["FMN"] = querySnapshot.docs[0].data().full_name
        ScanLib["Rank"] = "CIV"
        return ScanLib
    } else {
        const newUser = window.confirm("Barcode unable to be automatically read. Add personnel to global search list?")
        if (newUser) {
            const doc = await submitNewglobal(barcode)
            if (doc !== null) {
                ScanLib["FMN"] = doc.data().full_name
                ScanLib["Rank"] = "CIV"
                return ScanLib
            } else {return null}
        } else {return null}
    }
}