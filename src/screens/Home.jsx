import React, { useState, useEffect, useRef, useContext } from 'react';
import Typed from "typed.js";
import { AuthContext } from '../App';
import { RingLoader } from 'react-spinners';
import { useNavigate } from 'react-router';
import '../assets/css/home.css';


export default function Home(){
  const {logout} = useContext(AuthContext);
  const [questcomplete, setQuestComplete] = useState(null);
  const navigate = useNavigate();
  const el = useRef(null);
  
  const typed = useRef(null);
  const {user} = useContext(AuthContext);
    
  useEffect(() => {
    const options = {
      strings: [
        "NCP's Portfolio Calculator"
      ],
      typeSpeed: 45,
      backSpeed: 45,
      loop: true,
    };

    typed.current = new Typed(el.current, options);
    
    return () => {
      typed.current.destroy();
    }
  }, [])
  useEffect(() => {
    if (questcomplete) {
      getQuestData();
    }

    async function getQuestData() {
      // uncomment if sending dat over to firestore

      // const userUid = user.uid;
      // const parentDocRef = doc(db, 'data', userUid);
      // const questCollectionRef = collection(parentDocRef, 'quest');
      // await addDoc(questCollectionRef, {...questcomplete, timestamp: serverTimestamp()});

      fetch(`http://127.0.0.1:8000/...`)
        .then(response => response.json())
        .then(myList => {
          console.log("data is: ", JSON.parse(myList));
          const jsoncall = JSON.parse(myList);
          console.log("typeof myList.plan is: ", typeof jsoncall.plan);
          console.log("myList.plan is: ", jsoncall.plan);
        })
        .catch(error => {
          console.log(error);
        });
    }

  }, [questcomplete])

  return(
    <div id="homeouterdiv">
      <button id='signoutbutton' onClick={() => logout()}>Sign Out</button>
      <div id='homebuttondiv' className='toprightbuttons'>
        <button id='pastsearchesbutton' className='buttons' onClick={() => navigate('/pastsearches')}>Past Searches</button>
        <button id='signoutbutton' className='buttons' onClick={() => logout()}>Sign Out</button>
      </div>
      <div id='outertyped'>
        <span id='typedvote' className='blinkingorange' ref={el} />
      </div>
      <div id='questouterdiv' className='absolute flex flex-col items-center justify-center top-1/2 left-1/2 -translate-x-1/2  -translate-y-1/2'>
        <RingLoader color='#FFA500' loading={true} size={150} />
      </div>
    </div> 
  )
}