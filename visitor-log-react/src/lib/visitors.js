import pb from "lib/pocketbase";

export async function getUserDodaac() {
    if (true) {
        let dodaac = ""
        await pb.collection('users').getOne(pb.authStore.model.id, {expand: 'dodaac'}).then(resp =>  dodaac = resp.expand.dodaac)
        return dodaac
    }
}

export async function getDodaacList() {
    if (true) {
        return await pb.collection('dodaacs').getFullList(200)
    }
}

export async function getVisitors(dodaac) {
    if (true) {
        console.log(dodaac)
        return await pb.collection("visitors").getFullList(200, {sort: "-created", filter: 'signed_out = null && dodaac = "' + dodaac + '"', $autoCancel: "false"});
    }
}

export async function submitVisitor(data, dodaac) {
    try {
        await pb.collection("visitors").getFirstListItem('name=""', {filter: 'name = "' + data.name.toUpperCase() + '" && signed_out = null'})
        alert("A visitor with this name is already signed in!")
        return null
    } catch (error) {}

    try {
        await pb.collection("visitors").getFirstListItem('badge=""', {filter: 'badge = "' + data.badge + '" && signed_out = null'})
        alert("This badge is already signed in!")
        return null
    } catch (error) {}

    const newVisitor = {
        "badge": data.badge,
        "rank": data.rank.toUpperCase(),
        "name": data.name.toUpperCase(),
        "org": data.org.toUpperCase(),
        "dest": data.dest.toUpperCase(),
        "escort": data.escort.toUpperCase(),
        "dodaac": dodaac,
        "signed_out": Date.now()
    };

    return newVisitor
}

export async function submitDodaac(data) {
    try {
        await pb.collection("dodaacs").getFirstListItem('dodaac=""', {filter: 'dodaac = "' + data.dodaac + '"'})
        alert("This DODAAC already exists!")
        return null
    } catch (error) {}

    const newDodaac = {
        "dodaac": data.dodaac,
        "base_name": data.base,
        "squadron": data.squad
    };

    return newDodaac
}

export async function createRecord({collection, data}) {
    await pb.collection(collection).create(data);
}

export async function editRecord({collection, record_id, data}) {
    await pb.collection(collection).update(record_id, data);
}

export async function signOut() {
    let badge = ""
    while (badge !== null) {
        badge = prompt("Enter Badge Number");
        if (badge == null) {return}
        try {
            const record = await pb.collection("visitors").getFirstListItem('badge=', { filter: "badge = " +  badge + " && signed_out = null",})
            let date = new Date()
            await pb.collection("visitors").update(record.id, {signed_out: date})
        } catch (error) {
            alert("Visitor with this badge is not currently signed in!");
        }
    }
}