import { collection, addDoc, getDoc } from "firebase/firestore"
import { db } from "lib/firebase"

async function submitNewglobal(barcode) {
  const ref = collection(db, "DBIDS")

  let data = {}
  data.name = ""
  while (data.name === "") {data.name = prompt("Enter full name of personnel")}

  if (data.name !== null) {
    console.log("#WROTE DATABASE")
    const docRef = await addDoc(ref, {
      barcode: barcode,
      full_name: data.name.toUpperCase()
    });
  
    const doc = await getDoc(docRef)
    return doc
  } else {return null}
}

export default submitNewglobal
