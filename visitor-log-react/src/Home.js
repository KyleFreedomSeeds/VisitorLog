import {useAuthValue} from './AuthContext'
import { signOut } from 'firebase/auth' 
import { auth } from 'lib/firebase'
import SubmitvisitorModal from 'SubmitVisitorModal'
import { SignVisitorOut } from 'lib/SignVisitorOut'
import { cardScan } from 'lib/cardScanning'
import { FormProvider, useForm } from 'react-hook-form'
import { useState} from 'react'
import "css/home.css"
import { useNavigate } from 'react-router-dom'
import moment from 'moment/moment'
import ReactDatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import Popup from 'reactjs-popup'
import { useVisitors } from 'VisitorContext'
import { Timeout } from 'Timeout'

function Home() {
  const {currentUser, setTimeActive} = useAuthValue()
  const navigate = useNavigate()
  const visitors = useVisitors()
  const submitVisitor = useForm()
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange

  const scanId = barcode => {
    if (barcode !== null) {
      cardScan(barcode).then(visitorInfo => {
        if (visitorInfo !== null) {
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
          <p>Logged in as: {currentUser.email}<span onClick={() => signOut(auth)}>Sign Out</span></p>
        </div>
        <div className="buttons">
          <button onClick={() => {let barcode = prompt("Scan ID"); scanId(barcode); setTimeActive(new Date())}}>Scan ID</button>
          <FormProvider {...submitVisitor}>
            <SubmitvisitorModal/>
          </FormProvider>
          <button onClick={() => {let badge = prompt("Enter Badge Number"); SignVisitorOut(badge); setTimeActive(new Date())}}>Sign Visitor Out</button>
          <Popup trigger={<button>Generate 1109</button>}>
            <ReactDatePicker required form="generate1109" placeholderText='Select 1109 Date Range' selectsRange={true} onChange={(update) => setDateRange(update)} startDate={startDate} endDate={endDate}/>
            <form id="generate1109" onSubmit={(e) => {e.preventDefault(); navigate("1109-pdf", {state: {startDate: startDate, endDate: endDate}})}}>
              <button id='button1109' type='submit'>View/Download 1109</button>
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
