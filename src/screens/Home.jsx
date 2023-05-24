import React, { useState, useEffect, useRef, useContext } from "react";
import Typed from "typed.js";
import { AuthContext } from "../App";
import { RingLoader } from "react-spinners";
import { useNavigate } from "react-router";
import { PortfolioForm } from "../components/home/PortfolioForm";
import Results from "../components/home/Results.jsx";
import { db } from "../firebase";
import { addDoc, collection, doc, serverTimestamp } from "@firebase/firestore";
import "../assets/css/home.css";

export default function Home() {
  const [formcomplete, setFormComplete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formdata, setFormData] = useState({});

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const el = useRef(null);
  const typed = useRef(null);

  useEffect(() => {
    const options = {
      strings: ["NCP's Portfolio Calculator"],
      typeSpeed: 45,
      backSpeed: 45,
      loop: true,
    };

    typed.current = new Typed(el.current, options);

    return () => {
      typed.current.destroy();
    };
  }, []);

  useEffect(() => {
    // if not an empty object, set formcomplete to true
    if (Object.keys(formdata).length !== 0) {
      makeDoc();
      setFormComplete(true);
    }

    async function makeDoc() {
      const userUid = user.uid;
      const parentDocRef = doc(db, "data", userUid);
      const questCollectionRef = collection(parentDocRef, "searches");
      await addDoc(questCollectionRef, {
        ...formdata,
        timestamp: serverTimestamp(),
      });
    }
  }, [formdata]);

  return (
    <div id="homeouterdiv">
      <div id="homebuttondiv" className="toprightbuttons">
        <button
          id="pastsearchesbutton"
          className="buttons"
          onClick={() => navigate("/pastsearches")}
        >
          Past Searches
        </button>
        <button id="signoutbutton" className="buttons" onClick={() => logout()}>
          Sign Out
        </button>
      </div>
      <div id="outertyped">
        <span id="typedvote" className="blinkingorange" ref={el} />
      </div>
      {formcomplete ? (
        <div
          id="questouterdiv"
          className="absolute flex flex-col items-center justify-center top-1/2 left-1/2 -translate-x-1/2  -translate-y-1/2"
        >
          {loading ? (
            <RingLoader color="#FFA500" loading={true} size={150} />
          ) : (
            <Results formData={formdata} />
          )}
        </div>
      ) : (
        <PortfolioForm setFormData={setFormData} />
      )}
    </div>
  );
}
