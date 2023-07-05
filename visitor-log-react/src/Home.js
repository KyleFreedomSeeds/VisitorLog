import {useAuthValue} from './AuthContext'
import { signOut } from 'firebase/auth' 
import { auth } from 'lib/firebase'
import SubmitvisitorModal from 'SubmitVisitorModal'
import { SignVisitorOut } from 'lib/SignVisitorOut'
import { cardScan } from 'lib/cardScanning'
import { FormProvider, useForm } from 'react-hook-form'
import { useState} from 'react'
import "css/home.css"
import moment from 'moment/moment'
import ReactDatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import Popup from 'reactjs-popup'
import { useVisitors } from 'VisitorContext'
import { Timeout } from 'Timeout'
import { PDFDownloadLink } from '@react-pdf/renderer'
import VisitorPDF from '1109Generation/VisitorPDF'

function Home() {
  const {currentUser, setTimeActive} = useAuthValue()
  const {visitors, visitorsQuery, base} = useVisitors()
  const submitVisitor = useForm()
  const submitBarcode = useForm()
  const [dateError, setDateError] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange

  function scanId(data) {
    if (data.barcode !== null && data.barcode !== "") {
      cardScan(data.barcode, visitors).then(visitorInfo => {
        if (visitorInfo !== null) {
          submitBarcode.reset()
          // implement multi visitor single location
          document.getElementById("manualSubmit").click()
          if ("FMN" in visitorInfo) {
            submitVisitor.setValue("name", visitorInfo["FMN"])
          } else {
            submitVisitor.setValue("name", visitorInfo["LN"] + " " + visitorInfo["FN"] + " " + visitorInfo["MI"].substring(0,1))
          }
          submitVisitor.setValue("rank", visitorInfo["Rank"])
          submitVisitor.setFocus("badge", {shouldSelect: true})
        }
      })
    }
  }

  return (
      <div className="body">
        <div className="header">
          <h1>Visitor Log</h1>
          <p>Logged in as: {currentUser.email}<span onClick={() => {visitorsQuery.current.unsubscribe(); signOut(auth)}}>Sign Out</span></p>
        </div>
        <div className="buttons">
          <Popup trigger={<button id="scanBarcode">Scan ID</button>} modal className="visitors">
            {
            close => (
              <div>
                <h3>Scan ID</h3>
                <button style={{position:"absolute", top:"10px", right:"10px"}} onClick={() =>  {submitBarcode.reset(); close(); setTimeActive(new Date())}}>X</button>
                <form onSubmit={submitBarcode.handleSubmit(scanId)}>
                  <input type="text" name="formBarcode" id="formBarcode" required placeholder="Barcode" {...submitBarcode.register("barcode")}/>
                  {submitBarcode.formState.errors.name && <label className="error" htmlFor="formBarcode">{submitBarcode.formState.errors.name.message}</label>}

                  <button type="submit" id="submitBarcode">Submit</button>
                </form>
              </div>
            )}
          </Popup>
          <FormProvider {...submitVisitor}>
            <SubmitvisitorModal/>
          </FormProvider>
          <button onClick={() => {let badge = prompt("Enter Badge Number"); SignVisitorOut(badge, visitors); setTimeActive(new Date())}}>Sign Visitor Out</button>
          <Popup trigger={<button>Generate 1109</button>}>
            <ReactDatePicker required form="generate1109" placeholderText='Select 1109 Date Range' selectsRange={true} onChange={(update) => {setDateRange(update); setDateError(false)}} startDate={startDate} endDate={endDate} className='datePicker1109'/>
            <form id="generate1109" onSubmit={(e) => e.preventDefault()}>
                {dateError ? <p style={{color: "red", fontSize: "10pt"}}>Please select a date range!</p> : null}
                <button id='button1109'>
                <PDFDownloadLink document={<VisitorPDF startDate={startDate} endDate={endDate} base={base}/>} fileName={"1109 " + moment(startDate).format("DD MMM YY") + " - " + moment(endDate).format("DD MMM YY")} className='download1109' onClick={(e) => {
                  if (startDate == null || endDate == null) {
                    setDateError(true)
                    e.preventDefault()}
                  }}>{({loading}) => loading ? "Loading.." : "Download 1109"}</PDFDownloadLink>
                </button>
            </form>
          </Popup>
          <Timeout/>
        </div>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Rank</th>
                <th>Organization</th>
                <th>Destination</th>
                <th>Escort</th>
                <th>Badge</th>
                <th>Signed In At</th>
              </tr>
            </thead>
            <tbody>
            {visitors !== undefined && visitors.map(visitor => {
              const date = moment(new Date(visitor.created.seconds * 1000)).format("DD MMM YY h:mm a")
              return(
              <tr key={visitor.id}>
                  <td>{visitor.name}</td>
                  <td>{visitor.rank}</td>
                  <td>{visitor.org}</td>
                  <td>{visitor.dest}</td>
                  <td>{visitor.escort}</td>
                  <td>{visitor.badge}</td>
                  <td>{date}</td>
              </tr>
              );
            })}
            </tbody>
          </table>
          {visitors === undefined && <div className="loading-wheel"></div>}
        </div>
        
      </div>
  )
}

export default Home
