import React, { useContext } from 'react';
import { AuthContext } from '../App.jsx';
import { useNavigate } from 'react-router';

export default function PastSearches() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
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