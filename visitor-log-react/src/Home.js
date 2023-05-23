import pb from "lib/pocketbase";
import { useEffect, useState } from "react";
import useLogout from "hooks/useLogout";
import {cardScan} from "lib/cardScanning"
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import {set, useForm} from "react-hook-form";
import {submitVisitor,signOut, createRecord, getUserDodaac, getVisitors, submitDodaac, getDodaacList, editRecord} from "lib/visitors.js"
import { useQuery } from "react-query";
import { useMutation } from "react-query";
//import 'reactjs-popup/dist/index.css'
let renderCount = 0

export default function Home() {
    renderCount += 1;
    console.log(` renderCount: `, renderCount);

    const {register: manualRegister, handleSubmit: manualHandleSubmit, reset: manualReset, formState: { errors: manualErrors }, setValue: manualSetValue, setFocus: manualSetFocus} = useForm();
    const {register: dodaacRegister, handleSubmit: dodaaacHandleSubmit, reset: dodaacReset, formState: { errors: dodaacErrors }} = useForm();
    const logout = useLogout();
    let isLoggedIn = pb.authStore.isValid;
    let navigate = useNavigate();
    const { status: mutateStatus, error: mutateError, mutate} = useMutation({mutationFn: createRecord})
    const {data: updatedDodaac, status: updatedDodaacStatus, refetch: refetchDodaac} = useQuery({queryFn: getUserDodaac, queryKey: ['update-dodaac', getID()]})
    const dodaacQuery = updatedDodaac?.id
    const {data: updatedVisitors, status: updatedVisitorsStatus, refetch: refetchVisitors} = useQuery({queryFn: () => getVisitors(dodaacQuery), queryKey: ['update-visitors', getID()], pollInterval: 2000, enabled: updatedDodaacStatus === "success"})
    const {data: updatedDodaacList, status: updatedDodaacListStatus, refetch: refetchDodaacList} = useQuery({queryFn: getDodaacList, queryKey: ['update-dodaac-list', getID()]})
    const { status: editMutateStatus, error: editMutateError, mutate: editMutate} = useMutation({mutationFn: editRecord, onSuccess: refetchDodaac})

    useEffect(() => {
        //console.log(isLoggedIn)
        if (!isLoggedIn) {
            navigate("/")
            logout()
        }
    },[isLoggedIn, navigate, logout])

    useEffect(() => {
        refetchVisitors()
    }, [dodaacQuery, refetchVisitors])

    function getID() {
        if (pb.authStore.model== null) {return Math.random()}
        return pb.authStore.model.id
    }
   
    pb.collection("visitors").subscribe('*', function(e) {
        if (updatedDodaacStatus === "success") {refetchVisitors()}
    })

    function manual(data) {
        submitVisitor(data , dodaacQuery).then((newVisitor => {
            if (newVisitor != null) {
                mutate({collection: "visitors", data: newVisitor});
                manualReset();
            }
        }))
    }

    function dodaac(data) {
        submitDodaac(data).then((newDodaac => {
            if (newDodaac != null) {
                mutate({collection: "dodaacs", data: newDodaac});
                dodaacReset();
            }
        }))
    }

    function scanID() {
        let barcode = prompt("Scan ID")

        if (barcode!== null) {
            let visitorInfo = cardScan(barcode)
            console.log(visitorInfo)
            if (visitorInfo !== null) { 
                document.getElementById("newVisitor").click()
                manualSetValue("name", visitorInfo["LN"] + " " + visitorInfo["FN"] + " " + visitorInfo["MI"].substring(0,1))
                manualSetValue("rank", visitorInfo["Rank"])
                manualSetFocus("badge", {shouldSelect: true})
            } else {alert("Invalid barcode")}
             
        }
    }

    const editUserDodaac = (event) => {
        let obj = updatedDodaacList.find(o => o.dodaac === event.target.value);
        let id = pb.authStore.model.id
        editMutate({collection: "users", record_id: id, data: {"dodaac": obj.id}});
    }

    const manualClose = () => {manualReset();};
    const dodaacClose = () => {dodaacReset();};

    return (
        <>
            {updatedDodaacStatus === "success" && <h4 >Logged In: {updatedDodaac?.dodaac} | {updatedDodaac?.base_name} | {updatedDodaac?.squadron}</h4>}
            {updatedDodaacStatus === "loading" && <h4>Logged In: Loading...</h4>}
            <button onClick={() => {logout()}}>Log Out</button>
            <Popup trigger={<button>Settings</button>} modal nested>
                {
                    close => (
                        <div className="modal">
                            <div>
                                Settings
                            </div>
                            <div>
                            <Popup trigger={<button>Select DODAAC</button>} modal nested>
                                {
                                    close => (
                                        <div className="modal">
                                            <div>
                                                <h3>Select DODAAC</h3>
                                                {editMutateStatus == "loading" && <h3>Loading...</h3>}
                                                {editMutateStatus == "error" && <h3>An error has occured!</h3>}
                                                <select onChange={editUserDodaac}>
                                                    {updatedDodaac?.dodaac !== undefined ? <option>{updatedDodaac.dodaac}</option> : <option>-Select DODAAC-</option>}
                                                    {updatedDodaacListStatus === "success" && updatedDodaacList.map(dodaac => {
                                                        return <option key={dodaac.id}>{dodaac.dodaac}</option>
                                                    })}
                                                </select>
                                            </div>
                                            <div>
                                            </div>
                                        </div>
                                    )
                                }
                            </Popup>
                            <Popup trigger={<button>New DODAAC</button>} onClose={dodaacClose} modal nested>
                                {
                                    close => (
                                        <div className="modal">
                                            <div>
                                                <h3>New DODAAC</h3>
                                                {mutateStatus == "loading" && <h3>Loading...</h3>}
                                                {mutateStatus == "error" && <h3>An error has occured!</h3>}
                                                <form onSubmit={dodaaacHandleSubmit(dodaac)}>
                                                    <input type="text"name="formDodaac" id="formDodaac" required placeholder="DODAAC" {...dodaacRegister("dodaac", {pattern: {value: /^[A-Z]{2}\d{4}/i, message: "DODAAC should be 2 captial letters followed by 4 numbers!"}})}/>
                                                    {dodaacErrors.dodaac && <label className="error" htmlFor="formDodaac">{dodaacErrors.dodaac.message}</label>}

                                                    <input type="text" name="formBase" id="formBase" required placeholder="Base Name"{...dodaacRegister("base")}/>

                                                    <input type="text" name="formSquad" id="formSquad" required placeholder="Squadron"{...dodaacRegister("squad")}/>

                                                    <button type="submit">Submit</button>
                                                </form>
                                            </div>
                                            <div>
                                            </div>
                                        </div>
                                    )
                                }
                            </Popup>
                            </div>
                            <div>
                            </div>
                        </div>
                    )
                }
            </Popup>
            <h2>Visitor Log</h2>
            <button onClick={scanID}>Scan ID</button>
            <Popup trigger={<button id="newVisitor">Manual Entry</button>} onClose={manualClose} modal>
                {
                    close => (
                        <div className="modal">
                            <div>
                                <h3>New Visitor</h3>
                                {mutateStatus == "loading" && <h3>Loading...</h3>}
                                {mutateStatus == "error" && <h3>An error has occured!</h3>}
                                <form onSubmit={manualHandleSubmit(manual)}>
                                    <input type="text" name="formName" id="formName" required placeholder="Full Name" {...manualRegister("name", {pattern: {value: /^[^0-9]+$/i, message: "Name must not contain numbers!"}})}/>
                                    {manualErrors.name && <label className="error" htmlFor="formName">{manualErrors.name.message}</label>}

                                    <input type="text" name="formRank" id="formRank" required placeholder="Rank"{...manualRegister("rank")}/>

                                    <input type="number" name="formBadge" id="formbadge" required placeholder="Badge"{...manualRegister("badge", {min: {value: 1,  message: "Value must be greater than 0!"}, max: {value: 999, message: "Value must be less than 999!"}})}/>
                                    {manualErrors.badge && <label className="error" htmlFor="formBadge">{manualErrors.badge.message}</label>}

                                    <input type="text" name="formOrg" id="formOrg" required placeholder="Organization"{...manualRegister("org")}/>

                                    <input type="text" name="formDest" id="formDest" required placeholder="Destination"{...manualRegister("dest")}/>

                                    <input type="text" name="formEscort" id="formEscort" required placeholder="Escort"{...manualRegister("escort", {pattern: {value: /^[A-Za-z]+$/i, message: "Escort must not contain numbers!"}})}/>
                                    {manualErrors.escort && <label className="error" htmlFor="formEscort">{manualErrors.escort.message}</label>}

                                    <button type="submit">Submit</button>
                                </form>
                            </div>
                        </div>
                    )
                }
            </Popup>
            <button onClick={signOut}>Sign Visitor Out</button>
            <table id="visitorLog">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Rank</th>
                        <th>Organization</th>
                        <th>Destination</th>
                        <th>Escort</th>
                        <th>Signed In</th>
                        <th>Badge</th>
                    </tr>
                </thead>
                <tbody>
                    {updatedVisitorsStatus === "success" && updatedVisitors.map(visitor => {
                        let newDate = new Date(visitor.created).toLocaleString();
                        return(
                        <tr key={visitor.id}>
                            <td>{visitor.name}</td>
                            <td>{visitor.rank}</td>
                            <td>{visitor.org}</td>
                            <td>{visitor.dest}</td>
                            <td>{visitor.escort}</td>
                            <td>{newDate}</td>
                            <td>{visitor.badge}</td>
                        </tr>
                    );
                    })}
                </tbody>
            </table>
            {updatedVisitorsStatus === "loading" && <h4>Loading Data...</h4>}
            {updatedVisitorsStatus === "error" && <h4 className="error" color="red">An Error has occured!</h4>}
        </>
    );
}