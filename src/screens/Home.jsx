import React, { useState, useEffect, useRef, useContext } from "react";
import Typed from "typed.js";
import { AuthContext } from "../App";
import { RingLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PortfolioForm } from "../components/home/PortfolioForm";
import { db } from "../firebase";
import { addDoc, collection, doc, serverTimestamp } from "@firebase/firestore";
import "../assets/css/home.css";
import { getHistoricalDataBySymbol } from "../utils/WTDApi";

export default function Home() {
  const [formcomplete, setFormComplete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formdata, setFormData] = useState({});
  const [filteredRange, setFilteredRange] = useState(null);

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

  useEffect(() => {
    if (formcomplete) {
      const startDate = new Date(formdata.start);
      const endDate = new Date(formdata.finish);
      let dataResults = {};

      const processData = async () => {
        await Promise.all(
          formdata.allocation.map(async (alloc, index) => {
            const allocBalance = formdata.balance * (alloc.weight / 100);
            const data = await getHistoricalDataBySymbol(alloc.symbol);
            // if data holds a key titled "Note", then there was an error, and alert to user "API is exhausted, please try again in a minute"
            if (data["Note"]) {
              toast.error("API is exhausted, please try again in a minute.", {
                position: toast.POSITION.TOP_CENTER,
                theme: "colored",
              });
              return;
            } else {
              const filteredData = Object.entries(data)
                .filter(([key, _]) => {
                  const keyasdate = new Date(key);
                  return keyasdate >= startDate && keyasdate <= endDate;
                })
                .reverse();

              // each entry in filteredData is a new date
              const result = filteredData.map((newdate) => {
                return {
                  date: newdate[0],
                  close: parseFloat(newdate[1]["4. close"]),
                  adjusted_close: parseFloat(newdate[1]["5. adjusted close"]),
                };
              });

              if (result) {
                if (!dataResults[alloc.symbol]) {
                  dataResults[alloc.symbol] = {
                    initialBalance: parseFloat(allocBalance.toFixed(2)),
                    initialDate: startDate,
                    weight: alloc.weight,
                    data: result,
                    sharesondayone:
                      (formdata.balance * (alloc.weight / 100)) /
                      result[0].close,
                  };
                }
                console.log("DATA:", dataResults);
                return dataResults;
              } else {
                toast.error("Something went wrong! Try again.", {
                  position: toast.POSITION.TOP_CENTER,
                  theme: "colored",
                });
              }
            }
          })
        );
      };

      processData().then((result) => {
        if (result) {
          setFilteredRange(result);
        }
      });
    }
  }, [formcomplete]);

  useEffect(() => {
    if (filteredRange) {
      setLoading(false);
      navigate("/results", { state: { filteredRange } });
    }
  }, [filteredRange]);

  return (
    <div id="homeouterdiv">
      <div className="toprightbuttons">
        <button
          id="pastsearchesbutton"
          className="buttons"
          onClick={() => navigate("/pastsearches")}
        >
          Past Searches
        </button>
        <button
          id="resultsbutton"
          className="buttons"
          onClick={() => navigate("/results")}
        >
          Results
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
          {loading && <RingLoader color="#FFA500" loading={true} size={150} />}
        </div>
      ) : (
        <PortfolioForm setFormData={setFormData} />
      )}
    </div>
  );
}
