import React from 'react';

import './Intro.css'
import {useNavigate} from "react-router-dom";

const SignIn = () => {
    let navigate = useNavigate()
    return (
        <form className='Intro-textbox-sign'>
            <input placeholder='Username'/>
            <input type='password' placeholder='Password'/>
            <div className='button-round-L'>sign in</div><br/>
            <div>Don't have an account? <a onClick={() => navigate("/signup")}><u>sign up</u></a></div>
        </form>
    )
}

export default SignIn
