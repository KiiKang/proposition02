import React, {useEffect, useRef, useState} from 'react';
import Intro from "../components/Intro";
import BlurryBackdrop from "../components/BlurryBackdrop";
// import { signUp } from 'aws-amplify/auth';
import {Authenticator, useAuthenticator,} from "@aws-amplify/ui-react";
import { GrClose } from "react-icons/gr";
// import '@aws-amplify/ui-react/styles.css';
import './Authenticator.css';
// import {Hub} from "aws-amplify/utils";
// import {SignUp} from "@aws-amplify/ui-react/dist/types/components/Authenticator/Authenticator";

const Home = (props) => {
    // const [showAuth, setShowAuth] = useState(false);
    // const [isSignUp, setIsSignUp] = useState(true);
    // const { toSignUp, toSignIn } = useAuthenticator(
    //     ({ toSignUp, toSignIn }) => [
    //         toSignUp,
    //         toSignIn,
    //     ]
    // );
    // const shout = (r) => {
    //     if (r.payload.event === "signedIn") {
    //         setShowAuth(false);
    //         window.location.reload();
    //     }
    // }
    // Hub.listen('auth', shout);
    // useEffect(() => {
    //     if (isSignUp) toSignUp()
    //     else toSignIn()
    // }, [isSignUp])
    return (
        <div>
            <BlurryBackdrop/>
            <Intro data={props.data}
                   user={props.user}
                   // onShowAuth={setShowAuth}
                   // onInOrUp={setIsSignUp}
            />
            {/*<SignUp/>*/}
            {/*{   showAuth ?*/}
            {/*    <div className='auth-container bg-gray-50'>*/}
            {/*        <div className='close'*/}
            {/*             onClick={() => setShowAuth(false)}*/}
            {/*        >*/}
            {/*            <GrClose size={18}/>*/}
            {/*        </div>*/}
            {/*        <div className='auth'>*/}
            {/*            <Authenticator loginMechanism="email" initialState= {isSignUp ? "signUp":"signIn"} />*/}
            {/*        </div>*/}
            {/*    </div> : <div/>*/}
            {/*}*/}
        </div>
    );
}

export default Home;
