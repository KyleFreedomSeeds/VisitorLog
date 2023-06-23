import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {useState, useEffect, lazy} from 'react'
import {AuthProvider} from './AuthContext'
import {auth} from 'lib/firebase'
import {onAuthStateChanged} from 'firebase/auth'
import PrivateRoute from './PrivateRoute'
import {Navigate} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query';
import { FirebaseAppProvider } from 'reactfire';
import { firebaseConfig } from 'lib/firebase';
import { Suspense } from 'react';
import "css/loadingWheel.css"
import VisitorPDF from '1109Generation/VisitorPDF';

const Home = lazy(() => import('./Home'));
const Register = lazy(() => import('./Register'));
const VerifyEmail = lazy(() => import('./VerifyEmail'));
const ResetPass = lazy(() => import('./ResetPass'));
const Login = lazy(() => import('./Login'));
const RegisterDodaac = lazy(() => import('./RegisterDodaac'));

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
  </AuthProvider>
  </QueryClientProvider>
  </FirebaseAppProvider>
  );
}

export default App;
