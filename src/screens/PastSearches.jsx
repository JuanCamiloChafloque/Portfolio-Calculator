import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../App.jsx';
import { useNavigate } from 'react-router';
import { db } from '../firebase.js';
import { addDoc, doc, collection, getDocs, serverTimestamp } from '@firebase/firestore';
import '../assets/css/pastsearches.css';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import tinycolor from 'tinycolor2';

export default function PastSearches() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [foundpast, setFoundPast] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // gets all the documents in the searches collection for the current user
            const querySnapshot = await getDocs(collection(db, 'data', user.uid, 'searches'));

            // maps the data from each document into an array
            const newData = querySnapshot.docs.map((doc) => doc.data());

            // filters out any duplicates
            setFoundPast((prevState) => {
                const uniqueData = newData.filter((obj) => {
                    return !prevState.some((prevObj) =>
                        prevObj.start === obj.start &&
                        prevObj.finish === obj.finish &&
                        prevObj.balance === obj.balance &&

                        // allocation is an array of objects, so we need to stringify it to compare
                        JSON.stringify(prevObj.allocation) === JSON.stringify(obj.allocation)
                    );
                })
                return [...prevState, ...uniqueData];
            })
            return querySnapshot;
        }

        fetchData();
    }, [])

    useEffect(() => {
        console.log("foundpast is: ", foundpast);
    }, [foundpast])

    // math stuff for pie chart
    const RADIAN = Math.PI / 180;

    return (
        <div>
            <div id="homebuttondiv" className="toprightbuttons">
                <button id="pastsearchesbutton" className="buttons" onClick={() => navigate("/")}>Back to Home</button>
                <button id="signoutbutton" className="buttons" onClick={() => logout()}>Sign Out</button>
            </div>
            <h1>Past <span id="searchesspan" className='relative'>Searches</span></h1>
            <div id='pastsearchesdiv' className='flex flex-col items-center justify-center relative'>
                {foundpast.length > 0 && foundpast.map((val, index) => {
                    console.log("value at index is: ", val)
                    const piedata = val.allocation.map((outeralloc) => ({ name: outeralloc.symbol, value: outeralloc.weight }));
                    return (
                        <div key={index} onClick={() => navigate(`/searches/?start=${val.start}&end=${val.finish}&balance=${val.balance}&allocation=${
                            encodeURIComponent(JSON.stringify(val.allocation))}&symbol=${val.symbol}`)}
                            className='flex flex-row gap-x-4 justify-center'
                        >
                            <div className='flex flex-col justify-center'>
                                <p>From {new Date(val.start).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} to {
                                    new Date(val.finish).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                                <p>Request was made at {new Date(val.timestamp.seconds * 1000).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} on {new Date(val.timestamp.seconds * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <PieChart id='piechart' width={150} height={150}>
                                <Pie
                                    data={piedata}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                      
                                        return (
                                            <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="middle">
                                                {`${(percent * 100).toFixed(0)}%`}
                                            </text>
                                        );
                                    }}   
                                    outerRadius={37.5}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {piedata.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={tinycolor('#' + Math.floor(Math.random() * 16777215).toString(16)).darken(20).toString()} />
                                    ))}
                                </Pie>
                                <Legend verticalAlign="bottom" height={27} />
                                <Tooltip />
                            </PieChart>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}