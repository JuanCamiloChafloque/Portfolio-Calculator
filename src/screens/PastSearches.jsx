import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../App.jsx';
import { useNavigate } from 'react-router';
import { db } from '../firebase.js';
import { addDoc, doc, collection, getDocs, serverTimestamp } from '@firebase/firestore';
import '../assets/css/pastsearches.css';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

export default function PastSearches() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [foundpast, setFoundPast] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // await addDoc(collection(doc(db, 'data', user.uid), 'searches'), { start: "2013-03-20", finish: "2023-05-23", balance: 32500, allocation: [{ symbol: 'AAPL', weight: 20}, { symbol: 'GOOG', weight: 50 }, { symbol: 'MSFT', weight: 30 }], timestamp: serverTimestamp() });
            const querySnapshot = await getDocs(collection(db, 'data', user.uid, 'searches'));
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                setFoundPast((lastobj) => lastobj.some((item) => item.finish === doc.data().finish && item.start === doc.data().start && item.symbol === doc.data().symbol) ? [...lastobj] : [...lastobj, doc.data()])
            });
            return querySnapshot;
        }

        fetchData();
    }, [])

    useEffect(() => {
        console.log("foundpast is: ", foundpast);
    }, [foundpast])

    return (
        <div>
            <div id="homebuttondiv" className="toprightbuttons">
                <button id="pastsearchesbutton" className="buttons" onClick={() => navigate("/")}>Back to Home</button>
                <button id="signoutbutton" className="buttons" onClick={() => logout()}>Sign Out</button>
            </div>
            <h1>Past <span id="searchesspan" className='relative'>Searches</span></h1>
            <div id='pastsearchesdiv' className='flex flex-col items-center justify-center relative'>
                {foundpast.map((val, index) => {
                    console.log("value at index is: ", val)
                    const piedata = val.allocation.map((outeralloc, outeri) => ({ name: outeralloc.symbol, value: outeralloc.weight }));
                    return (
                        <div key={index} onClick={() => navigate(`/searches/?start=${val.start}&end=${val.finish}&balance=${val.balance}&allocation=${encodeURIComponent(JSON.stringify(val.allocation))}&symbol=${val.symbol}`)}>
                            <div className='flex flex-row gap-x-1'>
                                {val.allocation.map((alloc, inneri) => 
                                    <p key={inneri}>{alloc.symbol} - {alloc.weight}%</p>
                                )}
                            </div>
                            <p>From {new Date(val.start).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} to {new Date(val.finish).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p>Request was made at {new Date(val.timestamp.seconds * 1000).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} on {new Date(val.timestamp.seconds * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}