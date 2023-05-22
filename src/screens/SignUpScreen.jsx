import React, {useContext, useState} from 'react';
import { AuthContext } from '../App';
import { useNavigate } from "react-router-dom";
import '../assets/css/signupscreen.css';

export default function SignupScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const {register} = useContext(AuthContext);

  return(
    <div className='authdiv'>
      <p className='authtitle text-[5rem]'>NCP's Portfolio Calculator</p>
      <p id='createacc' className='text-white'>Create an Account</p>
      <form className='authform'>
        <input
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email-address"
          autoCapitalize="none"
          autoCorrect="false"
        />
        <input type='password'
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <input type='password'
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
        />
        <input type='button' className='buttons' onClick={() => {
          if (password !== confirmPassword) {
            alert('Passwords do not match');
          } else {
            register(email, password);
          }
        }} value='Sign Up'/>
      </form>

      <p className='mt-4'>Already have an account?</p>
      <button id='signinbutton' className='buttons' onClick={() => navigate('/signin')}>
        Sign In
      </button>
    </div>
  );
};