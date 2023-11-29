import React, {useCallback, useEffect, useState} from 'react';

import './Intro.css'
import {useNavigate} from "react-router-dom";
import axios from "axios";


const SignUp = () => {
    const [input, setInput] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [inputError, setInputError] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [userData, setUserData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    let navigate = useNavigate()

    const validateInput = (e) => {
        return
        onInputChange(e)
        let { name, value } = e.target;
        setInputError(prev => {
            const stateObj = { ...prev, [name]: '' };
            switch (name) {
                case "email":
                    if (userData.map(d => d.email).includes(value)) {
                        stateObj[name] = "Email already exists."
                    }
                    break;
                case "password":
                    if (input.confirmPassword && value !== input.confirmPassword) {
                        stateObj["confirmPassword"] = "Password does not match.";
                    }
                    break;
                case "confirmPassword":
                    if (input.password && value !== input.password) {
                        stateObj[name] = "Password does not match.";
                    }
                    break;
                default:
                    break;
            }
            return stateObj;
        });
    }

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setInput(prev => ({
            ...prev,
            [name]: value
        }));
    }

    // const handleSubmit = (event) => {
    //     fetchData()
    //     if (!Object.values(inputError).every(d => d === '')) return
    //
    //     event.preventDefault();
    //     const myForm = event.target;
    //     const formData = new FormData(myForm);
    //
    //     // fetch("/", {
    //     //     method: "POST",
    //     //     // headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //     //     body: new URLSearchParams(formData).toString(),
    //     // })
    //     //     .then(() => navigate("/signin"))
    //     //     .catch((error) => alert(error));
    // };

    const handleSubmit = (event) => {
        const myForm = event.target;
        const formData = new FormData(myForm);
        console.log(formData);
        return fetch('/.netlify/functions/create', {
            body: JSON.stringify(formData),
            method: 'POST'
        }).then(response => {
            return response.json()
        })
    }

    // const fetchData = useCallback(async () => {
    //     try {
    //         await axios.get("https://api.netlify.com/api/v1/sites/42f65c23-823d-4910-8665-7c3326279a24/submissions",
    //             {
    //                 headers: {
    //                     Authorization: "bearer JjNhtcVqyqqcP2ll56ikXS_k5aYlw-bunHncNJRnjHc"
    //                 }
    //             }).then(response => {
    //             setUserData(d => response.data)
    //         })
    //         setError(null)
    //     } catch (err) {
    //         setError(err.message)
    //         setUserData(null);
    //     } finally {
    //         setLoading(false);
    //     }
    // }, [])

    // useEffect(() => {
    //
    //     // await fetch("https://api.netlify.com/api/v1/sites/42f65c23-823d-4910-8665-7c3326279a24/submissions", {
    //     //         method: "GET",
    //     //         headers: {
    //     //             Authorization : "bearer JjNhtcVqyqqcP2ll56ikXS_k5aYlw-bunHncNJRnjHc"
    //     //         }
    //     //     })
    //     //         .then(r => {
    //     //             setUserData(r)
    //     //         })
    //     //         .catch(err => setError(err))
    //     //         .finally(() => setLoading(false))
    // fetchData()
    // }, [])

    if (!loading) {
        console.log(userData);

        // let emails = []
        // userData.forEach(d => {
        //     emails.push(d.email)
        // })
        // console.log(emails)
    }

    return (
        // <form name="signup" className='Intro-textbox-sign' data-netlify="true" method="post" netlify>
        <form name="signup" className='Intro-textbox-sign' method="post">
            <input type="hidden" name="form-name" value="signup"/>
            <h3>sign up to make annotations.</h3>
            <input type='email' name='email' autoComplete="email" placeholder='Email' onBlur={(e) => validateInput(e)} required/>
            <div className='err'>{inputError.email}</div>
            <input type="text" placeholder='Username' autoComplete="username" name='username'  onBlur={(e) => validateInput(e)} required/>
            <div className='err'>{inputError.username}</div>
            <input type='password' autoComplete="new-password" name='password' placeholder='Password'  onBlur={(e) => validateInput(e)} required/>
            <div className='err'>{inputError.password}</div>
            <input type='password' autoComplete="new-password" name='confirmPassword' placeholder='Confirm password'  onBlur={(e) => validateInput(e)} required/>
            <div className='err'>{inputError.confirmPassword}</div>
            <button type="submit" className='button-round-L' onClick={()=>handleSubmit()}>submit</button>
            <div>already signed up? <a onClick={() => navigate("/login")}><u>sign in</u></a></div>
        </form>
    )
}

export default SignUp
