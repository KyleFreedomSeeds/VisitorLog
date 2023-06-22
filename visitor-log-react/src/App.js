import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './Home'
import Register from './Register'
import VerifyEmail from './VerifyEmail';
import ResetPass from "./ResetPass"
import Login from './Login'
import {useState, useEffect} from 'react'
import {AuthProvider} from './AuthContext'
import {auth} from 'lib/firebase'
import {onAuthStateChanged} from 'firebase/auth'
import PrivateRoute from './PrivateRoute'
import {Navigate} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query';
import { FirebaseAppProvider } from 'reactfire';
import { firebaseConfig } from 'lib/firebase';
import RegisterDodaac from 'RegisterDodaac';
import VisitorPDF from '1109Generation/VisitorPDF';
import { Document, PDFViewer } from '@react-pdf/renderer';

const queryClient = new QueryClient({defaultOptions: {queries: {cacheTime: 0}}});

function App() {

  const [currentUser, setCurrentUser] = useState(null)
  const [timeActive, setTimeActive] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
  }, [])



  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <QueryClientProvider client={queryClient}>
    <AuthProvider value={{currentUser, timeActive, setTimeActive}}>
      <Router>
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
              <PDFViewer width={window.innerWidth} height={window.innerHeight}>
                <Document>
                  <VisitorPDF/>
                </Document>
              </PDFViewer>
            </PrivateRoute>
          }/>
          <Route exact path='*' element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }/>  
        </Routes>
    </Router>
  </AuthProvider>
  </QueryClientProvider>
  </FirebaseAppProvider>
  );
}

export default App;
