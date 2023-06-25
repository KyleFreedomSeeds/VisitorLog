import { useAuthValue } from 'AuthContext';
import { useState } from 'react';
import Popup from 'reactjs-popup';
import "css/timeout.css"
import useInterval from 'lib/UseInterval';
import { signOut } from 'firebase/auth';
import { auth } from 'lib/firebase';
import moment from 'moment';

export const Timeout = () => {
    var curTime = new Date()
    const { setTimeActive, timeout, timeoutWarn} = useAuthValue()
    const [timeoutCheck, setTimeoutCheck] = useState(0);
    const [remainingTime, setRemainingTime] = useState('05:00')
    const closeModal = () => {setTimeActive(new Date())};

    useInterval(() => {
    setTimeoutCheck(timeoutCheck => timeoutCheck + 1)
    if(curTime >= timeout) {
        signOut(auth)
    }
    }, 300000);

    useInterval(
    () => {
        setRemainingTime(moment.utc(timeout-curTime).format('mm:ss'));
    },
    curTime >= timeoutWarn  ? 1000 : null
    );

    return (
    <>
    {curTime >= timeoutWarn && 
    <div>
        <Popup open={true} closeOnDocumentClick={false} closeOnEscape={false} onClose={closeModal} className='timeout'>
        <div>
            You will be signed out due to inactivity in {remainingTime}
        </div>
        <button className="close" onClick={closeModal}>
            Stay Logged In
            </button>
        </Popup>
    </div>}
    </>
    );
    };