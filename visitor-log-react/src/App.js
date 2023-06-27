import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {useState, useEffect, lazy} from 'react'
import {AuthProvider} from './AuthContext'
import {auth, db} from 'lib/firebase'
import {onAuthStateChanged} from 'firebase/auth'
import PrivateRoute from './PrivateRoute'
import {Navigate} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query';
import { FirebaseAppProvider } from 'reactfire';
import { firebaseConfig } from 'lib/firebase';
import { Suspense } from 'react';
import "css/loadingWheel.css"
import { collectionData } from 'rxfire/firestore'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { VisitorProvider } from 'VisitorContext'
import moment from 'moment'

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
  var timeout = moment(timeActive).add(1, 'hour').toDate()
  var timeoutWarn = moment(timeActive).add(55, 'minutes').toDate()
  const filter = moment(new Date()).subtract(2, "days").toDate()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setTimeActive(new Date())
    })
  }, [])

  useEffect(() => {
    if (currentUser?.emailVerified && dodaac === undefined){
      const dodaacRef = query(collection(db, "users"), where("uid", "==", currentUser?.uid))
      getDocs(dodaacRef).then((dodaacQuery) => dodaacQuery.docs.map(doc => setDodaac(doc.data())))      
    }

    if (dodaac !== undefined) {
      const baseRef = query(collection(db, "DODAACS"), where("dodaac", "==", dodaac.dodaac))
      collectionData(baseRef, {idField: 'id'}).subscribe(base => setBase(base[0]))

      const ref = query(collection(db, "visitors"), where("signedOut", "==", "null"), where("created", ">=", filter), where("dodaac", "==", dodaac.dodaac), orderBy("created"))
      collectionData(ref, {idField: 'id'}).subscribe(visitors => setVisitors(visitors))
    }
  },[currentUser, dodaac])

  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <QueryClientProvider client={queryClient}>
    <AuthProvider value={{currentUser, timeActive, setTimeActive, timeout, timeoutWarn}}>
    <VisitorProvider value={{visitors, base}}>
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
          <Route path="/register-dodaac" element={
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
  </VisitorProvider>
  </AuthProvider>
  </QueryClientProvider>
  </FirebaseAppProvider>
  );
}

export default App;
