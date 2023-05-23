import React, { useState, useEffect, useContext } from 'react';
import { addDoc, doc, collection, serverTimestamp } from '@firebase/firestore';
import { db } from '../../firebase.js';
import { AuthContext } from '../../App.jsx';

export const PortfolioForm = () => {
  const [queryresults, setQueryResults] = useState(null);
  const {user} = useContext(AuthContext);
  useEffect(() => {
    (async function () {
      const parentDocRef = doc(db, 'data', user.uid);
      const questCollectionRef = collection(parentDocRef, 'searches');
      await addDoc(questCollectionRef, {...queryresults, timestamp: serverTimestamp()});
    })()
  }, [])
  return (
    <form>
      <input type="number" name="" id="" />
    </form>
  )
}
