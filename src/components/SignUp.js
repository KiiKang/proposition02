import React, { useState } from 'react';
import { Auth } from 'aws-amplify';

const SignUp = (props) => {
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        email: ''
    });

    const handleSignUp = async () => {
        try {
            const { username, password, email, phone_number } = signUpData;
            await Auth.signUp({
                username,
                password,
                attributes: {
                    email,
                    phone_number
                }
            });
            console.log('Sign up successful');
            // Redirect or show success message
        } catch (error) {
            console.error('Error signing up:', error);
            // Handle error, show error message, etc.
        }
    };

    return (
        <div className={'w-full h-full top-0 fixed m-0 backdrop-blur-md backdrop-close'}
             style={{
                 background: props.bg ? 'hsla(27,78%,32%,0.4)' : 'none',
                 // cursor: `url("${X}") 12 12, default`
             }}
        />
    )
}

export default SignUp
