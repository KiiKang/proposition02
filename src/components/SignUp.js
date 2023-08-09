import React from 'react';

import './Intro.css'
import {useNavigate} from "react-router-dom";

const SignUp = () => {
    let navigate = useNavigate()
    const handleSubmit = (event) => {
        event.preventDefault();

        const myForm = event.target;
        const formData = new FormData(myForm);

        fetch("/", {
            method: "POST",
            // headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString(),
        })
            .then(() => console.log("Form successfully submitted"))
            .catch((error) => alert(error));
    };

    return (
        <form name="signup" className='Intro-textbox-sign' data-netlify="true" method="post" netlify>
            <h3>sign up to make annotations.</h3>
            <input type='email' name='email' placeholder='Email' required/>
            <input type="text" placeholder='Username' name='username' required/>
            <input type='password' name='password' placeholder='Password' required/>
            <input type='password' placeholder='Confirm password' required/><br/>
            <button type="submit" className='button-round-L' onSubmit={()=>handleSubmit()}>submit</button><br/>
            <div>already signed up? <a onClick={() => navigate("/login")}><u>sign in</u></a></div>
        </form>
    )
}

export default SignUp
