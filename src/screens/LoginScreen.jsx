import React, {useContext, useState} from 'react';
import { AuthContext } from '../App.jsx';
import { sendPasswordResetEmail  } from 'firebase/auth';
import {auth} from '../firebase.js';
import { useNavigate } from 'react-router-dom';
import '../assets/css/signupscreen.css';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const {login} = useContext(AuthContext);

  return (
    <div className='authdiv'>
      <p className='authtitle text-[5rem]'>NCP's Portfolio Calculator</p>
      <p id='createacc' className='text-white'>Login</p>
      <div id='loginform' className='authform'>
        <input
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email-address"
          autoCapitalize="none"
        />
        <input
          type='password'
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className='buttons' onClick={(e) => {
          e.preventDefault();
          login(email, password)
        }}>
            Sign In
        </button>
      </div>

      <button className='buttons' onClick={
        async() => await sendPasswordResetEmail(auth, email)
          .then(() => {
            if (email.includes('@') && email.includes('.com')) {
              alert("Your password reset has been sent to your email", '', [
                { text: 'OK', onClick: () => console.log('Your password reset has been sent to your email')},
              ])
            }
            else{
              alert("Please enter a valid email.", '', [
                { text: 'OK', onClick: () => console.log('Invalid email')},
              ])
            }
          })
          .catch(e => {
            if (e.code === 'auth/invalid-email'){
              alert("Please enter a valid email.", '', [
                { text: 'OK', onClick: () => console.log('Invalid email')},
              ])
            }
          })
      }>
        Forgot Password?
      </button>

      <button className='buttons' onClick={() => navigate('/')}>
        Don't have an account? Create here
      </button>
    </div>
  );
};