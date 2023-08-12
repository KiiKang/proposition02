import React, {useCallback, useEffect, useRef, useState} from 'react';

import './Intro.css'
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';

const SignIn = () => {
    let navigate = useNavigate()
    // const [userData, setUserData] = useState([]);
    // const [error, setError] = useState(null);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [input, setInput] = useState({
        username: '',
        password: '',
    });

    const [inputError, setInputError] = useState({
        username: '',
        password: ''
    });

    const onSubmit = (i) => {
        setInput(prev => ({
            ...prev,
            username: usernameRef.current.value,
            password: passwordRef.current.value
        }))
        if (i===1) {
            let userDatum = userData.filter(d => d.username === input.username);
            if (userDatum.length === 0) {
                setInputError(prev => ({
                    ...prev,
                    username: "Username not found.",
                    password: ""
                }))
            } else if (userDatum[0].password !== input.password) {
                setInputError(prev => ({
                    ...prev,
                    username: "",
                    password: "Password does not match."
                }))
            } else {
                console.log("login success!");
                Cookies.set("user", input.username, {})
                navigate("/map");
            }
        }
    }

    const getUserData = async () => {
        await axios({
            method: "get",
            url: "https://api.netlify.com/api/v1/sites/42f65c23-823d-4910-8665-7c3326279a24/submissions",
            timeout: 10000,
            headers: {
                Authorization: "bearer JjNhtcVqyqqcP2ll56ikXS_k5aYlw-bunHncNJRnjHc"
            }
        }).then(response => {
            console.log(response);
            let userData_in = [];
            response.data.forEach(d => userData_in.push(d.data));
            setUserData(userData_in);
        }).finally(() => {
            setLoading(false);
        })
    }

    useEffect(() => {
        getUserData()
    }, [])

    if (loading) return
    return (
        <form className='Intro-textbox-sign'>
            <input ref={usernameRef} name="username_in" type="text" placeholder='Username'/>
            <div className='err'>{loading ? null : inputError.username}</div>
            <input ref={passwordRef} name="password_in" type='password' placeholder='Password'/>
            <div className='err'>{loading ? null : inputError.password}</div>
            <div className='button-round-L' onMouseOver={() => onSubmit(0)} onClick={() => onSubmit(1)}>sign in</div><br/>
            <div>Don't have an account? <a onClick={() => navigate("/signup")}><u>sign up</u></a></div>
        </form>
    )
}

export default SignIn
