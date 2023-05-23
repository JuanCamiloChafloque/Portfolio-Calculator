import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../App.jsx';
import { useNavigate } from 'react-router';
import { db } from '../firebase.js';
import { addDoc, doc, collection, getDocs } from '@firebase/firestore';

export default function PastSearches() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [foundpast, setFoundPast] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            console.log("fetching data")
            const querySnapshot = await getDocs(collection(db, 'data', user.uid, 'searches'));
            console.log("querySnapshot is: ", querySnapshot);
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                setFoundPast((lastobj) => [...lastobj, doc.data()]);
            });
            return querySnapshot;
        }

        fetchData();
    }, [])

    useEffect(() => {
        console.log("foundpast is: ", foundpast);
        console.log("foundpast is: ", typeof foundpast);
    }, [foundpast])

    return (
        <div>
            <div id="homebuttondiv" className="toprightbuttons">
                <button id="pastsearchesbutton" className="buttons" onClick={() => navigate("/")}>Back to Home</button>
                <button id="signoutbutton" className="buttons" onClick={() => logout()}>Sign Out</button>
            </div>
            <h1>Past Searches</h1>
        </div>
    )
}