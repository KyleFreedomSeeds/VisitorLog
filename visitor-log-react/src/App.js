import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {useState, useEffect, lazy} from 'react'
import {AuthProvider} from './AuthContext'
import {auth, db} from 'lib/firebase'
import { onAuthStateChanged, onIdTokenChanged} from 'firebase/auth'
import PrivateRoute from './PrivateRoute'
import {Navigate} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query';
import { FirebaseAppProvider } from 'reactfire';
import { firebaseConfig } from 'lib/firebase';
import { Suspense } from 'react';
import "css/loadingWheel.css"
import { collectionData, collection as collectionrx } from 'rxfire/firestore'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { VisitorProvider } from 'VisitorContext'
import moment from 'moment'
import { useRef } from 'react'

const Home = lazy(() => import('./Home'));
const Register = lazy(() => import('./Register'));
const VerifyEmail = lazy(() => import('./VerifyEmail'));
const ResetPass = lazy(() => import('./ResetPass'));
const Login = lazy(() => import('./Login'));
const RegisterDodaac = lazy(() => import('./RegisterDodaac'));
const VisitorPDF = lazy(() => import('1109Generation/VisitorPDF'));
const queryClient = new QueryClient({defaultOptions: {queries: {cacheTime: 0}}});

function App() {

  const [currentUser, setCurrentUser] = useState(null)
  const [visitors, setVisitors] = useState([])
  const [timeActive, setTimeActive] = useState(new Date())
  const [dodaac, setDodaac] = useState(undefined)
  const [base, setBase] = useState([])
  const [bases, setBases] = useState()
  const [userDocs, setUserDocs] = useState()

  var timeout = moment(timeActive).add(1, 'hour').toDate()
  var timeoutWarn = moment(timeActive).add(55, 'minutes').toDate()
  const filter = moment(new Date()).subtract(2, "days").toDate()
  const visitorsQuery = useRef(0)
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setTimeActive(new Date())
    })

  },[])

  useEffect(() => {
    if (auth.currentUser?.emailVerified) {
      console.log("#READ DATABASE")
      var baseRef = ''
      if (dodaac?.area === "*") { baseRef = query(collection(db, "DODAACS"), where("base", "==", dodaac.base))} else {
      baseRef = query(collection(db, "DODAACS"), where("base", "==", dodaac?.base), where("area", "==", dodaac?.area))}
      getDocs(baseRef).then(base => {base.docs.map(doc => setBase(doc.data()))})

      console.log("#READ DATABASE")
      const ref = query(collection(db, "visitors"), where("signedOut", "==", "null"), where("created", ">=", filter), where("base", "==", dodaac.base), where("area", "==", dodaac.area), orderBy("created"))
      visitorsQuery.current  = collectionData(ref, {idField: 'id'}).subscribe(visitors => setVisitors(visitors))

      console.log("#READ DATABASE")
      const dodaacRef = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid))
      getDocs(dodaacRef).then((dodaacQuery) => dodaacQuery.docs.map(doc => {setUserDocs(doc)}))
    }
  },[dodaac])

  useEffect(() => {
    if (auth.currentUser?.emailVerified) {
      console.log("#READ DATABASE")
      const dodaacRef = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid))
      getDocs(dodaacRef).then((dodaacQuery) => dodaacQuery.docs.map(doc => {setDodaac(doc.data()); setUserDocs(doc)}))
    }

    console.log("#READ DATABASE")
    const ref = query(collection(db, "DODAACS"))
    getDocs(ref).then(base => {
      const bases = []
      base.docs.map(base => {bases.push(base.data())})
      setBases(bases.reduce((unique,o) => {
        if(!unique.some(obj => obj.base === o.base)) {unique.push(o)} return unique},[]))
    })
  },[currentUser])

  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <QueryClientProvider client={queryClient}>
    <AuthProvider value={{currentUser, timeActive, setTimeActive, timeout, timeoutWarn}}>
    <VisitorProvider value={{visitors, base, visitorsQuery, setDodaac, bases, userDocs}}>
      <Router>
      <Suspense fallback={<div className="loading-wheel"></div>}>
        <Routes>
          <Route path="/login" element={
            !currentUser?.emailVerified 
            ? <Login/>
            : <Navigate to='/' replace/>
          } />
          <Route path="/register" element={
            !currentUser?.emailVerified 
            ? <Register/>
            : <Navigate to='/' replace/>
          } />
          <Route path="/register-base" element={
              <RegisterDodaac/>
          } />
          <Route path="/reset-password" element={
            !currentUser?.emailVerified 
            ? <ResetPass/>
            : <Navigate to='/' replace/>
          } />
          <Route path='/verify-email' element={<VerifyEmail/>} />
          <Route path='/1109-pdf' element={
             <PrivateRoute>
                <VisitorPDF/>
             </PrivateRoute>
             
          }/>
          <Route path='*' element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }/>  
        </Routes>
        </Suspense>
    </Router>
    <div className='footer' style={{ margin: "0px", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", textAlign: "center", opacity: "0.5", bottom: "0", left: "0", right: "0", position: "fixed", marginTop: "1px"}}>
    <p style={{margin: "0px"}}>Visitor Log v0.2 @TwoWO</p>
    <p style={{margin: "0px", color: "red"}}>Until v1.0, Visitor Log is considered beta and should not be used as an official source for documenting visitors. Upon v1.0, all data from the beta phase will be wiped</p>
    </div>
  </VisitorProvider>
  </AuthProvider>
  </QueryClientProvider>
  </FirebaseAppProvider>
  
  );
}

export default App;
